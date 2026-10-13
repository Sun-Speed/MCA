
import json
from datetime import datetime
from typing import Literal

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from database import get_db
from models import AttendanceRecord, LabSession, Student


router = APIRouter(prefix="/attendance", tags=["Attendance"])


# ---------- Request schemas ----------

class SessionStudent(BaseModel):
    studentId: str
    usn: str = ""
    rollNumber: str | None = None
    name: str
    attendance: str = "ABSENT"
    entryTime: str | None = None
    exitTime: str | None = None


class SessionCreate(BaseModel):
    id: str
    lab: dict
    teacher: dict | str | None = None
    department: str
    semester: str
    section: str
    date: str
    startTime: str
    students: list[SessionStudent] = Field(default_factory=list)


class AttendanceUpdate(BaseModel):
    studentId: str
    status: Literal["PRESENT", "ABSENT", "LATE"]
    entryTime: str | None = None
    exitTime: str | None = None
    verificationMode: Literal["MANUAL", "AI"] = "MANUAL"
    confidence: float | None = Field(default=None, ge=0, le=1)
    remarks: str | None = None


# ---------- Helpers ----------

def current_time():
    return datetime.now().strftime("%H:%M")


def session_response(session):
    return {
        "id": session.id,
        "labId": session.lab_id,
        "labName": session.lab_name,
        "department": session.department,
        "semester": session.semester,
        "section": session.section,
        "date": session.date,
        "startTime": session.start_time,
        "endTime": session.end_time,
        "status": session.status,
    }


def find_session(db: Session, session_id: str):
    session = (
        db.query(LabSession)
        .filter(LabSession.id == session_id)
        .first()
    )

    if not session:
        raise HTTPException(status_code=404, detail="Lab session not found.")

    return session


def find_student(db: Session, student_id: str):
    student = (
        db.query(Student)
        .filter(Student.id == student_id)
        .first()
    )

    if not student:
        raise HTTPException(
            status_code=404,
            detail=f"Registered student '{student_id}' was not found.",
        )

    return student


# ---------- Synchronize an existing frontend session ----------

@router.post("/sessions", status_code=201)
def create_or_sync_session(
    payload: SessionCreate,
    db: Session = Depends(get_db),
):
    """
    Save a session started through the existing React frontend.
    The frontend-generated session ID is retained.
    """

    existing = (
        db.query(LabSession)
        .filter(LabSession.id == payload.id)
        .first()
    )

    if existing:
        if existing.status != "ACTIVE":
            raise HTTPException(
                status_code=409,
                detail="This session has already ended.",
            )

        return session_response(existing)

    lab_name = str(payload.lab.get("labName", "")).strip()

    if not lab_name:
        raise HTTPException(
            status_code=422,
            detail="The session must include a lab name.",
        )

    # Ensure every session student is a registered database student.
    for session_student in payload.students:
        student = find_student(db, session_student.studentId)

        if student.usn != session_student.usn:
            raise HTTPException(
                status_code=409,
                detail=f"USN mismatch for student {session_student.studentId}.",
            )

    teacher_id = None
    if isinstance(payload.teacher, dict):
        teacher_id = payload.teacher.get("id")
    elif isinstance(payload.teacher, str):
        teacher_id = payload.teacher

    lab_id = payload.lab.get("id")

    session = LabSession(
        id=payload.id,
        lab_id=lab_id,
        lab_name=lab_name,
        teacher_id=teacher_id,
        department=payload.department,
        semester=str(payload.semester),
        section=str(payload.section),
        date=payload.date[:10],
        start_time=payload.startTime,
        status="ACTIVE",
    )

    db.add(session)
    db.commit()
    db.refresh(session)

    return session_response(session)


# ---------- Mark or update attendance ----------

@router.post("/sessions/{session_id}/records")
def mark_attendance(
    session_id: str,
    payload: AttendanceUpdate,
    db: Session = Depends(get_db),
):
    session = find_session(db, session_id)

    if session.status != "ACTIVE":
        raise HTTPException(
            status_code=409,
            detail="Cannot mark attendance for an ended session.",
        )

    student = find_student(db, payload.studentId)

    if (
        student.department != session.department
        or str(student.semester) != str(session.semester)
        or student.section != session.section
    ):
        raise HTTPException(
            status_code=403,
            detail="This student does not belong to the session's department, semester, and section.",
        )

    record = (
        db.query(AttendanceRecord)
        .filter(
            AttendanceRecord.session_id == session_id,
            AttendanceRecord.student_id == student.id,
        )
        .first()
    )

    now = current_time()

    if payload.status == "ABSENT":
        entry_time = None
        exit_time = None
    else:
        entry_time = (
            payload.entryTime
            or (record.entry_time if record and record.entry_time else now)
        )
        exit_time = payload.exitTime or (
            record.exit_time if record else None
        )

    if record is None:
        record = AttendanceRecord(
            session_id=session.id,
            student_id=student.id,
            usn=student.usn,
            student_name=student.name,
            department=student.department,
            semester=str(student.semester),
            section=student.section,
            lab_name=session.lab_name,
            date=session.date,
            entry_time=entry_time,
            exit_time=exit_time,
            status=payload.status,
            verification_mode=payload.verificationMode,
            confidence=payload.confidence,
            remarks=payload.remarks,
        )
        db.add(record)
    else:
        record.entry_time = entry_time
        record.exit_time = exit_time
        record.status = payload.status
        record.verification_mode = payload.verificationMode
        record.confidence = payload.confidence
        record.remarks = payload.remarks

    db.commit()
    db.refresh(record)

    return {
        "id": record.id,
        "sessionId": record.session_id,
        "studentId": record.student_id,
        "usn": record.usn,
        "studentName": record.student_name,
        "status": record.status,
        "entryTime": record.entry_time,
        "exitTime": record.exit_time,
        "verificationMode": record.verification_mode,
        "confidence": record.confidence,
    }


# ---------- Retrieve attendance for a session ----------

@router.get("/sessions/{session_id}/records")
def get_session_attendance(
    session_id: str,
    db: Session = Depends(get_db),
):
    find_session(db, session_id)

    records = (
        db.query(AttendanceRecord)
        .filter(AttendanceRecord.session_id == session_id)
        .order_by(AttendanceRecord.student_name)
        .all()
    )

    return [
        {
            "id": record.id,
            "sessionId": record.session_id,
            "studentId": record.student_id,
            "usn": record.usn,
            "studentName": record.student_name,
            "status": record.status,
            "entryTime": record.entry_time,
            "exitTime": record.exit_time,
            "verificationMode": record.verification_mode,
            "confidence": record.confidence,
            "remarks": record.remarks,
        }
        for record in records
    ]


# ---------- End the active session ----------

@router.patch("/sessions/{session_id}/end")
def end_lab_session(
    session_id: str,
    db: Session = Depends(get_db),
):
    session = find_session(db, session_id)

    if session.status != "ACTIVE":
        raise HTTPException(
            status_code=409,
            detail="This session has already ended.",
        )

    end_time = current_time()

    records = (
        db.query(AttendanceRecord)
        .filter(AttendanceRecord.session_id == session_id)
        .all()
    )

    for record in records:
        if record.status != "ABSENT" and not record.exit_time:
            record.exit_time = end_time

    session.end_time = end_time
    session.status = "COMPLETED"

    db.commit()
    db.refresh(session)

    return session_response(session)