from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from ..database.database import get_db
from ..models.models import Project, ProjectStep, User
from ..schemas.schemas import Project as ProjectSchema, ProjectStep as ProjectStepSchema
from ..utils.auth import get_current_team_member

router = APIRouter()

@router.get("/projects", response_model=List[ProjectSchema])
async def read_team_projects(
    skip: int = 0, 
    limit: int = 100, 
    current_user: User = Depends(get_current_team_member),
    db: Session = Depends(get_db)
):
    """
    Get all projects - only accessible by team members
    """
    projects = db.query(Project).offset(skip).limit(limit).all()
    return projects

@router.post("/projects/{project_id}/steps/{step_number}/complete", response_model=ProjectStepSchema)
async def complete_project_step(
    project_id: int,
    step_number: int,
    current_user: User = Depends(get_current_team_member),
    db: Session = Depends(get_db)
):
    """
    Mark a project step as completed - only accessible by team members
    """
    # Get the project
    project = db.query(Project).filter(Project.id == project_id).first()
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Get the step
    step = db.query(ProjectStep).filter(
        ProjectStep.project_id == project_id,
        ProjectStep.step_number == step_number
    ).first()
    
    if step is None:
        raise HTTPException(status_code=404, detail="Step not found")
    
    # Check if previous step is completed (except for step 1)
    if step_number > 1:
        previous_step = db.query(ProjectStep).filter(
            ProjectStep.project_id == project_id,
            ProjectStep.step_number == step_number - 1
        ).first()
        
        if not previous_step.completed:
            raise HTTPException(
                status_code=400, 
                detail="Cannot complete this step because the previous step is not completed"
            )
    
    # Mark the step as completed
    step.completed = True
    step.completed_at = datetime.now()
    
    # Update the project status
    project.status = step.step_name
    
    db.commit()
    db.refresh(step)
    
    return step
