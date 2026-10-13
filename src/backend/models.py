
import uuid
from datetime import datetime

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship

from database import Base


def generate_id():
    return str(uuid.uuid4())


def utc_now():
    return datetime.utcnow()


# --------------------------------------------------
# USERS
# HOD, Teacher, Clerk
# --------------------------------------------------
class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_id)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, nullable=False, index=True)
    department = Column(String, nullable=True)
    created_at = Column(DateTime, default=utc_now, nullable=False)


# --------------------------------------------------
# STUDENTS
# Matches the React student registration form
# --------------------------------------------------
class Student(Base):
    __tablename__ = "students"

    id = Column(String, primary_key=True, default=generate_id)

    usn = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False, index=True)
    department = Column(String, nullable=False, index=True)
    semester = Column(String, nullable=False)
    section = Column(String, nullable=False)

    # Optional roll number for frontend compatibility
    roll_number = Column(String, nullable=True)

    # Photo stored as a file; database stores its relative path
    photo_path = Column(String, nullable=True)

    # JSON string containing assigned lab IDs
    assigned_labs = Column(Text, default="[]", nullable=False)

    face_enrolled = Column(Boolean, default=False, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)

    created_at = Column(DateTime, default=utc_now, nullable=False)

    embeddings = relationship(
        "StudentFaceEmbedding",
        back_populates="student",
        cascade="all, delete-orphan",
    )

    attendance_records = relationship(
        "AttendanceRecord",
        back_populates="student",
    )


# --------------------------------------------------
# FACE DATA
# Stores the generated face representation
# --------------------------------------------------
class StudentFaceEmbedding(Base):
    __tablename__ = "student_face_embeddings"

    id = Column(Integer, primary_key=True, index=True)

    student_id = Column(
        String,
        ForeignKey("students.id"),
        nullable=False,
        index=True,
    )

    embedding = Column(Text, nullable=False)
    image_path = Column(String, nullable=True)
    created_at = Column(DateTime, default=utc_now, nullable=False)

    student = relationship(
        "Student",
        back_populates="embeddings",
    )


# --------------------------------------------------
# LABS
# --------------------------------------------------
class Lab(Base):
    __tablename__ = "labs"

    id = Column(String, primary_key=True, default=generate_id)

    lab_name = Column(String, nullable=False, index=True)
    lab_code = Column(String, nullable=True)
    department = Column(String, nullable=False, index=True)

    assigned_semester = Column(String, nullable=True)
    assigned_section = Column(String, nullable=True)

    assigned_teacher_id = Column(
        String,
        ForeignKey("users.id"),
        nullable=True,
    )

    status = Column(String, default="ACTIVE", nullable=False)
    created_at = Column(DateTime, default=utc_now, nullable=False)


# --------------------------------------------------
# LAB SESSIONS
# Created when a teacher starts a lab
# --------------------------------------------------
class LabSession(Base):
    __tablename__ = "lab_sessions"

    id = Column(String, primary_key=True, default=generate_id)

    lab_id = Column(
        String,
        ForeignKey("labs.id"),
        nullable=True,
    )

    lab_name = Column(String, nullable=False)

    teacher_id = Column(
        String,
        ForeignKey("users.id"),
        nullable=True,
    )

    department = Column(String, nullable=False)
    semester = Column(String, nullable=False)
    section = Column(String, nullable=False)

    date = Column(String, nullable=False)
    start_time = Column(String, nullable=False)
    end_time = Column(String, nullable=True)

    status = Column(String, default="ACTIVE", nullable=False)
    created_at = Column(DateTime, default=utc_now, nullable=False)


# --------------------------------------------------
# ATTENDANCE
# Supports AI camera and manual attendance
# --------------------------------------------------
class AttendanceRecord(Base):
    __tablename__ = "attendance_records"

    id = Column(String, primary_key=True, default=generate_id)

    session_id = Column(
        String,
        ForeignKey("lab_sessions.id"),
        nullable=False,
        index=True,
    )

    student_id = Column(
        String,
        ForeignKey("students.id"),
        nullable=False,
        index=True,
    )

    usn = Column(String, nullable=False, index=True)
    student_name = Column(String, nullable=False)

    department = Column(String, nullable=False)
    semester = Column(String, nullable=False)
    section = Column(String, nullable=False)

    lab_name = Column(String, nullable=False)
    date = Column(String, nullable=False, index=True)

    entry_time = Column(String, nullable=True)
    exit_time = Column(String, nullable=True)
    duration = Column(String, nullable=True)

    status = Column(String, default="PRESENT", nullable=False)

    verification_mode = Column(
        String,
        default="MANUAL",
        nullable=False,
    )

    confidence = Column(Float, nullable=True)
    remarks = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=utc_now, nullable=False)

    student = relationship(
        "Student",
        back_populates="attendance_records",
    )

    __table_args__ = (
        UniqueConstraint(
            "session_id",
            "student_id",
            name="uq_attendance_session_student",
        ),
    )
