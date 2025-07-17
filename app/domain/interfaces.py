from abc import ABC, abstractmethod
from typing import List, Optional
from app.domain.models import Task, Comment

class TaskRepository(ABC):
    @abstractmethod
    def get_all_tasks(self) -> List[Task]:
        pass

    @abstractmethod
    def get_task_by_id(self, task_id: int) -> Optional[Task]:
        pass

    @abstractmethod
    def create_task(self, task: Task) -> Task:
        pass

    @abstractmethod
    def update_task(self, task_id: int, updates: dict) -> Optional[Task]:
        pass

    @abstractmethod
    def delete_task(self, task_id: int) -> bool:
        pass

    @abstractmethod
    def add_comment_to_task(self, task_id: int, comment: Comment) -> Comment:
        pass