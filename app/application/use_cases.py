from typing import List, Optional
from app.domain.interfaces import TaskRepository
from app.domain.models import Task, Comment
from app.presentation.dtos import TaskCreateDTO, TaskUpdateDTO, TaskResponseDTO 
from datetime import datetime

class TaskUseCases:
    def __init__(self, task_repo: TaskRepository):
        self.task_repo = task_repo

    def get_all_tasks(self) -> List[TaskResponseDTO]:
        tasks = self.task_repo.get_all_tasks()
        return [TaskResponseDTO.from_orm(task) for task in tasks]

    def get_task_by_id(self, task_id: int) -> Optional[TaskResponseDTO]:
        task = self.task_repo.get_task_by_id(task_id)
        return TaskResponseDTO.from_orm(task) if task else None

    def create_task(self, task_data: TaskCreateDTO) -> TaskResponseDTO:
        task = Task(
            title=task_data.title,
            description=task_data.description,
            due_date=task_data.due_date,
            priority=task_data.priority,
            category=task_data.category,
            completed=False,
        )
        created_task = self.task_repo.create_task(task)
        return TaskResponseDTO.from_orm(created_task)

    def update_task(self, task_id: int, task_data: TaskUpdateDTO) -> Optional[TaskResponseDTO]:
        updates = task_data.dict(exclude_unset=True)
        updated_task = self.task_repo.update_task(task_id, updates)
        return TaskResponseDTO.from_orm(updated_task) if updated_task else None

    def delete_task(self, task_id: int) -> bool:
        return self.task_repo.delete_task(task_id)