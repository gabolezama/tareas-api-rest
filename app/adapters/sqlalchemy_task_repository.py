from typing import List, Optional
from sqlalchemy.orm import Session
from app.domain.interfaces import TaskRepository
from app.domain.models import Task, Comment, PriorityEnum
from app.infrastructure.database import SessionLocal

class SQLAlchemyTaskRepository(TaskRepository):
    def __init__(self, db: Session):
        self.db = db

    def get_all_tasks(self) -> List[Task]:
        return self.db.query(Task).all()

    def get_task_by_id(self, task_id: int) -> Optional[Task]:
        return self.db.query(Task).filter(Task.id == task_id).first()

    def create_task(self, task: Task) -> Task:
        self.db.add(task)
        self.db.commit()
        self.db.refresh(task)
        return task

    def update_task(self, task_id: int, updates: dict) -> Optional[Task]:
        task = self.get_task_by_id(task_id)
        if task:
            for key, value in updates.items():
                if key == "priority" and isinstance(value, str):
                    value = PriorityEnum[value]
                setattr(task, key, value)
            self.db.commit()
            self.db.refresh(task)
        return task

    def delete_task(self, task_id: int) -> bool:
        task = self.get_task_by_id(task_id)
        if task:
            self.db.delete(task)
            self.db.commit()
            return True
        return False

    def add_comment_to_task(self, task_id: int, comment: Comment) -> Comment:
        task = self.get_task_by_id(task_id)
        if not task:
            raise ValueError(f"Task with id {task_id} not found.")

        comment.task_id = task_id
        self.db.add(comment)
        self.db.commit()
        self.db.refresh(comment)
        return comment