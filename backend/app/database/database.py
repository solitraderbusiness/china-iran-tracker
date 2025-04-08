from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# For development, we'll use SQLite. In production, this would be PostgreSQL
SQLALCHEMY_DATABASE_URL = "sqlite:///./china_iran_tracker.db"
# SQLALCHEMY_DATABASE_URL = "postgresql://user:password@localhost/china_iran_tracker"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
