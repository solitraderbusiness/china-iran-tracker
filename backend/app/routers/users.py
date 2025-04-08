from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ..database.database import get_db
from ..models.models import User
from ..schemas.schemas import User as UserSchema
from ..utils.auth import get_current_user, get_current_team_member

router = APIRouter()

@router.get("/me", response_model=UserSchema)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.get("/", response_model=List[UserSchema])
async def read_users(
    skip: int = 0, 
    limit: int = 100, 
    current_user: User = Depends(get_current_team_member),
    db: Session = Depends(get_db)
):
    """
    Get all users - only accessible by team members
    """
    users = db.query(User).offset(skip).limit(limit).all()
    return users
