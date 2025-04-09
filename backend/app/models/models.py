from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Text, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from ..database.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    email = Column(String(100), unique=True, index=True)
    password_hash = Column(Text)
    phone = Column(String(20))
    is_team = Column(Boolean, default=False)
    
    # Relationships
    projects = relationship("Project", back_populates="user")


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String(255))
    description = Column(Text)
    product_url = Column(String(500), nullable=True)
    product_image = Column(String(500), nullable=True)
    product_count = Column(Integer, default=1)
    source_location = Column(String(100), nullable=True)
    product_description = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(String(50), default="Order Received")
    
    # Relationships
    user = relationship("User", back_populates="projects")
    steps = relationship("ProjectStep", back_populates="project")


class ProjectStep(Base):
    __tablename__ = "project_steps"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    step_number = Column(Integer)
    step_name = Column(String(100))
    completed = Column(Boolean, default=False)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    project = relationship("Project", back_populates="steps")
