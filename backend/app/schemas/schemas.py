from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


class UserBase(BaseModel):
    name: str
    email: EmailStr
    phone: str


class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: int
    is_team: bool

    class Config:
        orm_mode = True


class ProjectStepBase(BaseModel):
    step_number: int
    step_name: str
    completed: bool = False
    completed_at: Optional[datetime] = None


class ProjectStepCreate(ProjectStepBase):
    pass


class ProjectStep(ProjectStepBase):
    id: int
    project_id: int

    class Config:
        orm_mode = True


class ProjectBase(BaseModel):
    product_description: str
    status: str = "Order Received"


class ProjectCreate(ProjectBase):
    name: str
    description: str
    product_url: Optional[str] = None
    product_image: Optional[str] = None
    product_count: Optional[int] = 1
    source_location: Optional[str] = None


class Project(ProjectBase):
    id: int
    user_id: int
    created_at: datetime
    steps: List[ProjectStep] = []

    class Config:
        orm_mode = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None
    is_team: Optional[bool] = None
