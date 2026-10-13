
import json
import uuid

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from database import get_db
from models import Lab, LabSession, Student, User


router = APIRouter(prefix="/labs", tags=["Labs"])


# --------------------------------------------------
# REQUEST SCHEMAS
# --------------------------------------------------

class LabCreate(BaseModel):
    labName: str = Field(min_length=1, max_length=150)
    labCode: str | None = Field(default=None, max_length=50)
    department: str = Field(min_length=1, max_length=100)
    assignedSemester: str | None = None
    assignedSection: str | None = None
    assignedTeacherId: str | None = None
    status: str = "ACTIVE"


class LabUpdate(LabCreate):
    pass


# --------------------------------------------------
# HELPERS
# --------------------------------------------------

def lab_response(lab: Lab):
    return {
        "id": lab.id,
        "labName": lab.lab_name,
        "labCode": lab.lab_code,
        "department": lab.department,
        "assignedSemester": lab.assigned_semester,
        "assignedSection": lab.assigned_section,
        "assignedTeacherId": lab.assigned_teacher_id,
        "status": lab.status,
        "createdAt": (
            lab.created_at.isoformat()
            if lab.created_at
            else None
        ),
    }


def normalize_lab(payload: LabCreate):
    data = payload.model_dump()

    data["labName"] = data["labName"].strip()
    data["department"] = data["department"].strip()
    data["status"] = data["status"].strip().upper()

    if not data["labName"] or not data["department"]:
        raise HTTPException(
            status_code=422,
            detail="Lab name and department cannot be blank.",
        )

    if data["status"] not in {"ACTIVE", "INACTIVE"}:
        raise HTTPException(
            status_code=422,
            detail="Status must be ACTIVE or INACTIVE.",
        )

    for key in (
        "labCode",
        "assignedSemester",
        "assignedSection",
        "assignedTeacherId",
    ):
        if data[key] is not None:
            data[key] = data[key].strip() or None

    return data


def validate_teacher(db: Session, teacher_id: str | None):
    if not teacher_id:
        return

    teacher = (
        db.query(User)
        .filter(
            User.id == teacher_id,
            User.role == "teacher",
        )
        .first()
    )

    if not teacher:
        raise HTTPException(
            status_code=404,
            detail="Assigned teacher account not found.",
        )


# --------------------------------------------------
# CREATE LAB
# POST /api/v1/labs
# --------------------------------------------------

@router.post("", status_code=201)
def create_lab(
    payload: LabCreate,
    db: Session = Depends(get_db),
):
    data = normalize_lab(payload)

    validate_teacher(db, data["assignedTeacherId"])

    lab = Lab(
        id=str(uuid.uuid4()),
        lab_name=data["labName"],
        lab_code=data["labCode"],
        department=data["department"],
        assigned_semester=data["assignedSemester"],
        assigned_section=data["assignedSection"],
        assigned_teacher_id=data["assignedTeacherId"],
        status=data["status"],
    )

    db.add(lab)
    db.commit()
    db.refresh(lab)

    return lab_response(lab)


# --------------------------------------------------
# LIST LABS
# GET /api/v1/labs
# --------------------------------------------------

@router.get("")
def list_labs(
    db: Session = Depends(get_db),
):
    labs = (
        db.query(Lab)
        .order_by(Lab.lab_name.asc())
        .all()
    )

    return [lab_response(lab) for lab in labs]


# --------------------------------------------------
# GET ONE LAB
# GET /api/v1/labs/{lab_id}
# --------------------------------------------------

@router.get("/{lab_id}")
def get_lab(
    lab_id: str,
    db: Session = Depends(get_db),
):
    lab = db.query(Lab).filter(Lab.id == lab_id).first()

    if not lab:
        raise HTTPException(
            status_code=404,
            detail="Lab not found.",
        )

    return lab_response(lab)


# --------------------------------------------------
# UPDATE LAB
# PUT /api/v1/labs/{lab_id}
# --------------------------------------------------

@router.put("/{lab_id}")
def update_lab(
    lab_id: str,
    payload: LabUpdate,
    db: Session = Depends(get_db),
):
    lab = db.query(Lab).filter(Lab.id == lab_id).first()

    if not lab:
        raise HTTPException(
            status_code=404,
            detail="Lab not found.",
        )

    data = normalize_lab(payload)

    validate_teacher(db, data["assignedTeacherId"])

    lab.lab_name = data["labName"]
    lab.lab_code = data["labCode"]
    lab.department = data["department"]
    lab.assigned_semester = data["assignedSemester"]
    lab.assigned_section = data["assignedSection"]
    lab.assigned_teacher_id = data["assignedTeacherId"]
    lab.status = data["status"]

    db.commit()
    db.refresh(lab)

    return lab_response(lab)


# --------------------------------------------------
# DELETE LAB
# DELETE /api/v1/labs/{lab_id}
# --------------------------------------------------

@router.delete("/{lab_id}")
def delete_lab(
    lab_id: str,
    db: Session = Depends(get_db),
):
    lab = db.query(Lab).filter(Lab.id == lab_id).first()

    if not lab:
        raise HTTPException(
            status_code=404,
            detail="Lab not found.",
        )

    existing_session = (
        db.query(LabSession)
        .filter(LabSession.lab_id == lab_id)
        .first()
    )

    if existing_session:
        raise HTTPException(
            status_code=409,
            detail="This lab has session history and cannot be deleted.",
        )

    # Remove this lab ID from students' assignedLabs.
    students = db.query(Student).all()

    for student in students:
        try:
            assigned_labs = json.loads(
                student.assigned_labs or "[]"
            )
        except (json.JSONDecodeError, TypeError):
            assigned_labs = []

        if not isinstance(assigned_labs, list):
            assigned_labs = []

        if lab_id in assigned_labs:
            student.assigned_labs = json.dumps(
                [
                    item
                    for item in assigned_labs
                    if item != lab_id
                ]
            )

    db.delete(lab)
    db.commit()

    return {
        "message": "Lab deleted successfully.",
        "id": lab_id,
    }
