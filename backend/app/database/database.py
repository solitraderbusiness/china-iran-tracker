import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get database credentials from environment variables
DB_USERNAME = os.getenv("DB_USERNAME", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "postgres")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "china_iran_tracker")
DB_SSLMODE = os.getenv("DB_SSLMODE", "prefer")

# For development, we'll use SQLite if DATABASE_URL is not provided
if os.getenv("USE_SQLITE", "false").lower() == "true":
    SQLALCHEMY_DATABASE_URL = "sqlite:///./china_iran_tracker.db"
    connect_args = {"check_same_thread": False}
else:
    # Construct PostgreSQL connection string from environment variables
    SQLALCHEMY_DATABASE_URL = f"postgresql://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    connect_args = {"sslmode": DB_SSLMODE} if DB_SSLMODE else {}

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args=connect_args
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

