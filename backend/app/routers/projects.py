from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from ..database.database import get_db
from ..models.models import Project, ProjectStep, User
from ..schemas.schemas import Project as ProjectSchema, ProjectCreate, ProjectStep as ProjectStepSchema
from ..utils.auth import get_current_user, get_current_team_member

router = APIRouter()

@router.get("/", response_model=List[ProjectSchema])
async def read_projects(
    skip: int = 0, 
    limit: int = 100, 
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all projects for the current user
    """
    if current_user.is_team:
        # Team members can see all projects
        projects = db.query(Project).offset(skip).limit(limit).all()
    else:
        # Regular users can only see their own projects
        projects = db.query(Project).filter(Project.user_id == current_user.id).offset(skip).limit(limit).all()
    return projects

@router.get("/{project_id}", response_model=ProjectSchema)
async def read_project(
    project_id: int, 
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get a specific project by ID
    """
    project = db.query(Project).filter(Project.id == project_id).first()
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Check if user has access to this project
    if not current_user.is_team and project.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to access this project")
    
    return project

@router.post("/", response_model=ProjectSchema)
async def create_project(
    project: ProjectCreate, 
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new project
    """
    db_project = Project(
        user_id=current_user.id,
        product_description=project.product_description,
        status="Order Received"
    )
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    
    # Create the 13 steps for this project
    steps = [
        ProjectStep(project_id=db_project.id, step_number=1, step_name="Order Received", completed=True, completed_at=datetime.now()),
        ProjectStep(project_id=db_project.id, step_number=2, step_name="Contract Signed", completed=False),
        ProjectStep(project_id=db_project.id, step_number=3, step_name="Advance Payment Received", completed=False),
        ProjectStep(project_id=db_project.id, step_number=4, step_name="Order Placed in China", completed=False),
        ProjectStep(project_id=db_project.id, step_number=5, step_name="Items Stored in China Warehouse", completed=False),
        ProjectStep(project_id=db_project.id, step_number=6, step_name="Items Sent to Cargo Ship", completed=False),
        ProjectStep(project_id=db_project.id, step_number=7, step_name="Goods Clearance Permit (China)", completed=False),
        ProjectStep(project_id=db_project.id, step_number=8, step_name="Shipped to Dubai Port", completed=False),
        ProjectStep(project_id=db_project.id, step_number=9, step_name="Arrived at Dubai Port", completed=False),
        ProjectStep(project_id=db_project.id, step_number=10, step_name="Loaded on Ship to Iran", completed=False),
        ProjectStep(project_id=db_project.id, step_number=11, step_name="Goods Clearance Permit (Iran)", completed=False),
        ProjectStep(project_id=db_project.id, step_number=12, step_name="Delivered to User Warehouse in Iran", completed=False),
        ProjectStep(project_id=db_project.id, step_number=13, step_name="Final Confirmation from User", completed=False)
    ]
    
    db.add_all(steps)
    db.commit()
    
    # Refresh to get the steps
    db.refresh(db_project)
    return db_project

@router.get("/{project_id}/steps", response_model=List[ProjectStepSchema])
async def read_project_steps(
    project_id: int, 
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all steps for a specific project
    """
    project = db.query(Project).filter(Project.id == project_id).first()
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Check if user has access to this project
    if not current_user.is_team and project.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to access this project")
    
    steps = db.query(ProjectStep).filter(ProjectStep.project_id == project_id).order_by(ProjectStep.step_number).all()
    return steps
