
import base64
import json
import uuid
from pathlib import Path
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy.orm import Session

from database import get_db
from models import Student


router = APIRouter(prefix="/students", tags=["Students"])

BACKEND_DIR = Path(__file__).resolve().parent.parent
UPLOAD_DIR = BACKEND_DIR / "uploads" / "students"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

MAX_PHOTO_BYTES = 5 * 1024 * 1024

ALLOWED_IMAGE_TYPES = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
}


# --------------------------------------------------
# REQUEST SCHEMA
# Accepts the React frontend's field names.
# photo should be a Base64 data URL or an empty string.
# --------------------------------------------------
class StudentCreate(BaseModel):
    usn: str = Field(min_length=1, max_length=50)
    name: str = Field(min_length=1, max_length=150)
    department: str = Field(min_length=1, max_length=100)
    semester: str = Field(min_length=1, max_length=30)
    section: str = Field(min_length=1, max_length=30)

    assignedLabs: list[str] = Field(default_factory=list)
    photo: Optional[str] = None

    rollNumber: Optional[str] = None


class StudentUpdate(StudentCreate):
    pass


class StudentResponse(BaseModel):
    id: str
    usn: str
    name: str
    department: str
    semester: str
    section: str
    assignedLabs: list[str]
    photo: Optional[str] = None
    rollNumber: Optional[str] = None
    face_enrolled: bool = False
    is_active: bool = True

    model_config = ConfigDict(from_attributes=True)


# --------------------------------------------------
# PHOTO HELPERS
# --------------------------------------------------
def save_photo(photo_data: Optional[str], student_id: str):
    if not photo_data:
        return None

    if not photo_data.startswith("data:") or "," not in photo_data:
        raise HTTPException(
            status_code=400,
            detail="Photo must be a valid Base64 image data URL.",
        )

    header, encoded = photo_data.split(",", 1)
    mime_type = header[5:].split(";", 1)[0].lower()

    if mime_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Only JPEG, PNG, and WebP photos are supported.",
        )

    try:
        image_bytes = base64.b64decode(encoded, validate=True)
    except (ValueError, base64.binascii.Error):
        raise HTTPException(
            status_code=400,
            detail="Invalid Base64 photo data.",
        )

    if not image_bytes:
        raise HTTPException(status_code=400, detail="Photo is empty.")

    if len(image_bytes) > MAX_PHOTO_BYTES:
        raise HTTPException(
            status_code=413,
            detail="Photo must not exceed 5 MB.",
        )

    # Verify that the file's actual format matches the declared type.
    valid_image = (
        mime_type == "image/jpeg"
        and image_bytes.startswith(b"\xff\xd8\xff")
    ) or (
        mime_type == "image/png"
        and image_bytes.startswith(b"\x89PNG\r\n\x1a\n")
    ) or (
        mime_type == "image/webp"
        and image_bytes.startswith(b"RIFF")
        and image_bytes[8:12] == b"WEBP"
    )

    if not valid_image:
        raise HTTPException(
            status_code=400,
            detail="The uploaded file is not a valid supported image.",
        )

    extension = ALLOWED_IMAGE_TYPES[mime_type]
    filename = f"{student_id}{extension}"
    destination = UPLOAD_DIR / filename

    destination.write_bytes(image_bytes)

    return f"uploads/students/{filename}"


def delete_photo(photo_path: Optional[str]):
    if not photo_path:
        return

    # Only delete files inside our dedicated student upload directory.
    filename = Path(photo_path).name
    candidate = (UPLOAD_DIR / filename).resolve()

    if candidate.parent == UPLOAD_DIR.resolve() and candidate.is_file():
        candidate.unlink()


def student_to_response(student: Student):
    photo_data = None

    if student.photo_path:
        photo_file = (BACKEND_DIR / student.photo_path).resolve()

        if photo_file.is_relative_to(UPLOAD_DIR.resolve()) and photo_file.is_file():
            extension = photo_file.suffix.lower()
            mime_type = {
                ".jpg": "image/jpeg",
                ".png": "image/png",
                ".webp": "image/webp",
            }.get(extension)

            if mime_type:
                encoded = base64.b64encode(photo_file.read_bytes()).decode("ascii")
                photo_data = f"data:{mime_type};base64,{encoded}"

    try:
        assigned_labs = json.loads(student.assigned_labs or "[]")
        if not isinstance(assigned_labs, list):
            assigned_labs = []
    except (json.JSONDecodeError, TypeError):
        assigned_labs = []

    return {
        "id": student.id,
        "usn": student.usn,
        "name": student.name,
        "department": student.department,
        "semester": student.semester,
        "section": student.section,
        "assignedLabs": assigned_labs,
        "photo": photo_data,
        "rollNumber": student.roll_number,
        "face_enrolled": student.face_enrolled,
        "is_active": student.is_active,
    }


def normalize_usn(usn: str) -> str:
    return usn.strip().upper()


def normalize_payload(payload: StudentCreate):
    data = payload.model_dump()
    data["usn"] = normalize_usn(data["usn"])
    data["name"] = data["name"].strip()
    data["department"] = data["department"].strip()
    data["semester"] = data["semester"].strip()
    data["section"] = data["section"].strip()
    data["assignedLabs"] = [
        str(lab).strip()
        for lab in data["assignedLabs"]
        if str(lab).strip()
    ]

    if not all(
        data[field]
        for field in ("usn", "name", "department", "semester", "section")
    ):
        raise HTTPException(
            status_code=422,
            detail="Student details cannot be blank.",
        )

    return data


# --------------------------------------------------
# CREATE STUDENT
# POST /api/v1/students
# --------------------------------------------------
@router.post("", status_code=201)
def create_student(
    payload: StudentCreate,
    db: Session = Depends(get_db),
):
    data = normalize_payload(payload)

    existing = (
        db.query(Student)
        .filter(Student.usn == data["usn"])
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=409,
            detail="A student with this USN already exists.",
        )

    student_id = str(uuid.uuid4())
    photo_path = save_photo(data["photo"], student_id)

    student = Student(
        id=student_id,
        usn=data["usn"],
        name=data["name"],
        department=data["department"],
        semester=data["semester"],
        section=data["section"],
        roll_number=data["rollNumber"],
        assigned_labs=json.dumps(data["assignedLabs"]),
        photo_path=photo_path,
        face_enrolled=False,
    )

    try:
        db.add(student)
        db.commit()
        db.refresh(student)
    except Exception:
        db.rollback()
        delete_photo(photo_path)
        raise HTTPException(
            status_code=500,
            detail="Could not save the student.",
        )

    return student_to_response(student)


# --------------------------------------------------
# LIST STUDENTS
# GET /api/v1/students
# --------------------------------------------------
@router.get("")
def list_students(
    db: Session = Depends(get_db),
):
    students = (
        db.query(Student)
        .order_by(Student.name.asc())
        .all()
    )

    return [student_to_response(student) for student in students]


# --------------------------------------------------
# GET ONE STUDENT
# GET /api/v1/students/{student_id}
# --------------------------------------------------
@router.get("/{student_id}")
def get_student(
    student_id: str,
    db: Session = Depends(get_db),
):
    student = db.query(Student).filter(Student.id == student_id).first()

    if not student:
        raise HTTPException(status_code=404, detail="Student not found.")

    return student_to_response(student)


# --------------------------------------------------
# UPDATE STUDENT
# PUT /api/v1/students/{student_id}
# --------------------------------------------------
@router.put("/{student_id}")
def update_student(
    student_id: str,
    payload: StudentUpdate,
    db: Session = Depends(get_db),
):
    student = db.query(Student).filter(Student.id == student_id).first()

    if not student:
        raise HTTPException(status_code=404, detail="Student not found.")

    data = normalize_payload(payload)

    duplicate = (
        db.query(Student)
        .filter(Student.usn == data["usn"], Student.id != student_id)
        .first()
    )

    if duplicate:
        raise HTTPException(
            status_code=409,
            detail="Another student already uses this USN.",
        )

    old_photo_path = student.photo_path
    new_photo_path = old_photo_path

    if data["photo"]:
        new_photo_path = save_photo(data["photo"], student_id)

    try:
        student.usn = data["usn"]
        student.name = data["name"]
        student.department = data["department"]
        student.semester = data["semester"]
        student.section = data["section"]
        student.roll_number = data["rollNumber"]
        student.assigned_labs = json.dumps(data["assignedLabs"])
        student.photo_path = new_photo_path

        # Future enrollment service will regenerate face data
        # when a student's photo changes.
        if data["photo"]:
            student.face_enrolled = False
            for embedding in list(student.embeddings):
                db.delete(embedding)

        db.commit()
        db.refresh(student)
    except Exception:
        db.rollback()

        if data["photo"] and new_photo_path != old_photo_path:
            delete_photo(new_photo_path)

        raise HTTPException(
            status_code=500,
            detail="Could not update the student.",
        )

    if data["photo"] and old_photo_path != new_photo_path:
        delete_photo(old_photo_path)

    return student_to_response(student)


# --------------------------------------------------
# DELETE STUDENT
# DELETE /api/v1/students/{student_id}
# --------------------------------------------------
@router.delete("/{student_id}")
def delete_student(
    student_id: str,
    db: Session = Depends(get_db),
):
    student = db.query(Student).filter(Student.id == student_id).first()

    if not student:
        raise HTTPException(status_code=404, detail="Student not found.")

    # Preserve attendance history; don't delete a student
    # who already has attendance records.
    if student.attendance_records:
        raise HTTPException(
            status_code=409,
            detail="This student has attendance history. Deactivate the student instead.",
        )

    photo_path = student.photo_path

    try:
        db.delete(student)
        db.commit()
    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Could not delete the student.",
        )

    delete_photo(photo_path)

    return {"message": "Student deleted successfully.", "id": student_id}


# --------------------------------------------------
# DEACTIVATE STUDENT
# PATCH /api/v1/students/{student_id}/deactivate
# --------------------------------------------------
@router.patch("/{student_id}/deactivate")
def deactivate_student(
    student_id: str,
    db: Session = Depends(get_db),
):
    student = db.query(Student).filter(Student.id == student_id).first()

    if not student:
        raise HTTPException(status_code=404, detail="Student not found.")

    student.is_active = False
    db.commit()

    return {"message": "Student deactivated successfully."}
