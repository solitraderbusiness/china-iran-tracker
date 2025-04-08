from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .database import database
from .models import models
from .schemas import schemas
from .routers import users, projects, auth, team

# Create database tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(
    title="China-Iran Tracker API",
    description="API for China-to-Iran Product Ordering and Tracking Web Application",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, this should be restricted
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, tags=["Authentication"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(projects.router, prefix="/api/projects", tags=["Projects"])
app.include_router(team.router, prefix="/api/team", tags=["Team"])

@app.get("/")
def read_root():
    return {"message": "Welcome to China-Iran Tracker API"}

@app.get("/api/health")
def health_check():
    return {"status": "healthy"}
