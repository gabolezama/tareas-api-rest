from typing import Optional
from datetime import datetime
from enum import Enum
from pydantic import BaseModel, Field

class PriorityEnum(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"

class TaskCreateDTO(BaseModel):
    title: str = Field(..., min_length=3, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    due_date: Optional[datetime] = None
    priority: PriorityEnum = PriorityEnum.medium
    category: Optional[str] = Field(None, max_length=50)

class TaskUpdateDTO(BaseModel):
    title: Optional[str] = Field(None, min_length=3, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    completed: Optional[bool] = None
    due_date: Optional[datetime] = None
    priority: Optional[PriorityEnum] = None
    category: Optional[str] = Field(None, max_length=50)

class TaskResponseDTO(BaseModel):
    id: int
    title: str
    description: Optional[str]
    completed: bool
    due_date: Optional[datetime]
    priority: PriorityEnum
    category: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True # Permite que Pydantic lea de modelos ORM