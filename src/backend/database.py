
from pathlib import Path

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Backend directory
BASE_DIR = Path(__file__).resolve().parent

# Database file will be created inside backend/
DB_PATH = BASE_DIR / "smartlab.db"

DATABASE_URL = f"sqlite:///{DB_PATH.as_posix()}"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

Base = declarative_base()


def get_db():
    """Provide one database session per API request."""
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()
