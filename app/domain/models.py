from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.infrastructure.database import Base # Importamos la Base que definimos

import datetime

class PriorityEnum(Enum):
    low = "low"
    medium = "medium"
    high = "high"
    name = "priority_enum" # Nombre para la creación del tipo Enum en PostgreSQL
    create_type = True     # Indica a SQLAlchemy que cree el tipo en la BD si no existe

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    description = Column(String, nullable=True)
    completed = Column(Boolean, default=False)
    due_date = Column(DateTime, nullable=True)
    priority = Column(PriorityEnum, default=PriorityEnum.medium, nullable=False)
    category = Column(String, nullable=True)
    # created_by = Column(Integer, ForeignKey("users.id")) # Lo añadiremos cuando tengamos el modelo de usuario
    # assigned_to = Column(Integer, ForeignKey("users.id"), nullable=True) # Lo añadiremos cuando tengamos el modelo de usuario
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    # Relaciones (descomentar cuando tengamos el modelo User)
    # creator = relationship("User", foreign_keys=[created_by])
    # assignee = relationship("User", foreign_keys=[assigned_to])

    comments = relationship("Comment", back_populates="task", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Task(title='{self.title}', completed={self.completed})>"

class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey("tasks.id"), nullable=False)
    # user_id = Column(Integer, ForeignKey("users.id"), nullable=False) # Lo añadiremos cuando tengamos el modelo de usuario
    content = Column(String, nullable=False)
    created_at = Column(DateTime, default=func.now())

    task = relationship("Task", back_populates="comments")
    # author = relationship("User") # Lo añadiremos cuando tengamos el modelo de usuario