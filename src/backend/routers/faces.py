
import base64
import json

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from database import get_db
from models import Student, StudentFaceEmbedding, LabSession
from face_service import (
    decode_base64_image,
    get_face_embedding,
    cosine_similarity,
)
from routers.students import BACKEND_DIR, UPLOAD_DIR


router = APIRouter(
    prefix="/faces",
    tags=["Face Recognition"],
)

# Initial threshold for testing, not a production guarantee.
# We will calibrate this using real camera results.
SIMILARITY_THRESHOLD = 0.70


class FaceRecognitionRequest(BaseModel):
    image: str = Field(min_length=1)
    

@router.post("/students/{student_id}/enroll")
def enroll_student_face(
    student_id: str,
    db: Session = Depends(get_db),
):
    student = (
        db.query(Student)
        .filter(Student.id == student_id)
        .first()
    )

    if not student:
        raise HTTPException(
            status_code=404,
            detail="Student not found.",
        )

    if not student.is_active:
        raise HTTPException(
            status_code=400,
            detail="Cannot enroll an inactive student.",
        )

    if not student.photo_path:
        raise HTTPException(
            status_code=400,
            detail="This student does not have a registered photo.",
        )

    photo_file = (BACKEND_DIR / student.photo_path).resolve()

    if (
        not photo_file.is_relative_to(UPLOAD_DIR.resolve())
        or not photo_file.is_file()
    ):
        raise HTTPException(
            status_code=404,
            detail="Registered student photo could not be found.",
        )

    try:
        encoded_image = base64.b64encode(
            photo_file.read_bytes()
        ).decode("ascii")

        image = decode_base64_image(
            "data:image/jpeg;base64," + encoded_image
        )

        embedding = get_face_embedding(image)

    except ValueError as exc:
        raise HTTPException(
            status_code=422,
            detail=str(exc),
        )

    except Exception as exc:
        print(f"Face enrollment failed for {student.usn}: {exc}")
        raise HTTPException(
            status_code=500,
            detail="Face processing failed. Check the backend terminal.",
        )

    try:
        for existing in list(student.embeddings):
            db.delete(existing)

        record = StudentFaceEmbedding(
            student_id=student.id,
            embedding=json.dumps(embedding),
            image_path=student.photo_path,
        )

        db.add(record)
        student.face_enrolled = True
        db.commit()

    except Exception as exc:
        db.rollback()
        print(f"Could not save face enrollment: {exc}")

        raise HTTPException(
            status_code=500,
            detail="Could not save face enrollment.",
        )

    return {
        "success": True,
        "studentId": student.id,
        "usn": student.usn,
        "name": student.name,
        "face_enrolled": True,
        "message": "Student face enrolled successfully.",
    }


@router.post("/sessions/{session_id}/recognize")
def recognize_student(
    session_id: str,
    request: FaceRecognitionRequest,
    db: Session = Depends(get_db),
):
    # 1. Find the active lab session.
    session = (
        db.query(LabSession)
        .filter(LabSession.id == session_id)
        .first()
    )

    if not session:
        raise HTTPException(
            status_code=404,
            detail="Lab session not found.",
        )

    if (session.status or "").lower() != "active":
        raise HTTPException(
            status_code=400,
            detail="This lab session is not active.",
        )

    if not session.lab_id:
        raise HTTPException(
            status_code=400,
            detail="This session has no lab ID.",
        )

    # 2. Find only students in this session's cohort.
    students = (
        db.query(Student)
        .filter(
            Student.department == session.department,
            Student.semester == session.semester,
            Student.section == session.section,
            Student.is_active.is_(True),
            Student.face_enrolled.is_(True),
        )
        .all()
    )

    # 3. Keep only students assigned to this lab.
    lab_id = str(session.lab_id)
    candidates = []

    for student in students:
        try:
            assigned_labs = json.loads(
                student.assigned_labs or "[]"
            )

            if not isinstance(assigned_labs, list):
                continue

        except (json.JSONDecodeError, TypeError):
            continue

        if lab_id not in [str(value) for value in assigned_labs]:
            continue

        candidates.append(student)

    if not candidates:
        return {
            "success": True,
            "matched": False,
            "message": (
                "No enrolled students assigned to this lab "
                "were found in the session cohort."
            ),
        }

    # 4. Generate an embedding from the camera frame.
    try:
        image = decode_base64_image(request.image)
        camera_embedding = get_face_embedding(image)

    except ValueError as exc:
        raise HTTPException(
            status_code=422,
            detail=str(exc),
        )

    except Exception as exc:
        print(f"Camera face processing failed: {exc}")
        raise HTTPException(
            status_code=500,
            detail="Face recognition failed. Check the backend terminal.",
        )

    # 5. Compare the camera face against enrolled candidates.
    best_student = None
    best_similarity = -1.0

    for student in candidates:
        embedding_record = (
            db.query(StudentFaceEmbedding)
            .filter(
                StudentFaceEmbedding.student_id == student.id
            )
            .first()
        )

        if not embedding_record:
            continue

        try:
            stored_embedding = json.loads(
                embedding_record.embedding
            )

            similarity = cosine_similarity(
                camera_embedding,
                stored_embedding,
            )

        except (ValueError, TypeError, json.JSONDecodeError):
            continue

        if similarity > best_similarity:
            best_similarity = similarity
            best_student = student

    # 6. Reject uncertain or missing matches.
    if (
        best_student is None
        or best_similarity < SIMILARITY_THRESHOLD
    ):
        return {
            "success": True,
            "matched": False,
            "message": "No sufficiently confident student match.",
        }

    # Recognition only. Attendance is handled separately.
    return {
        "success": True,
        "matched": True,
        "student": {
            "id": best_student.id,
            "usn": best_student.usn,
            "name": best_student.name,
            "department": best_student.department,
            "semester": best_student.semester,
            "section": best_student.section,
        },
        "similarity": round(best_similarity, 4),
        "message": "Student recognized successfully.",
    }
