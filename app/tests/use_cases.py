import pytest
from datetime import datetime, timezone
from pydantic import ValidationError

from app.application.use_cases import TaskUseCases
from app.domain.models import Task, Comment
from app.presentation.dtos import TaskCreateDTO, TaskUpdateDTO, TaskResponseDTO

class TestTaskUseCases:
    """
    Clase que contiene los tests para los casos de uso de tareas.
    Se enfoca en la lógica de negocio, mockeando el repositorio.
    """

    def test_get_all_tasks(self, mock_task_repository, sample_task, another_sample_task):
        """
        Verifica que get_all_tasks retorne todas las tareas
        y las convierta correctamente a DTOs de respuesta.
        """
        # Configurar el mock para que retorne una lista de tareas
        mock_task_repository.get_all_tasks.return_value = [sample_task, another_sample_task]

        use_cases = TaskUseCases(mock_task_repository)
        tasks_dtos = use_cases.get_all_tasks()

        # Verificar que el método del repositorio fue llamado
        mock_task_repository.get_all_tasks.assert_called_once()
        # Verificar que se retornaron los DTOs correctos
        assert len(tasks_dtos) == 2
        assert isinstance(tasks_dtos[0], TaskResponseDTO)
        assert tasks_dtos[0].id == sample_task.id
        assert tasks_dtos[1].id == another_sample_task.id

    def test_get_task_by_id_found(self, mock_task_repository, sample_task):
        """
        Verifica que get_task_by_id retorne una tarea existente
        y la convierta correctamente a DTO de respuesta.
        """
        # Configurar el mock para que retorne la tarea específica
        mock_task_repository.get_task_by_id.return_value = sample_task

        use_cases = TaskUseCases(mock_task_repository)
        task_dto = use_cases.get_task_by_id(sample_task.id)

        # Verificar que el método del repositorio fue llamado con el ID correcto
        mock_task_repository.get_task_by_id.assert_called_once_with(sample_task.id)
        # Verificar que se retornó el DTO correcto
        assert isinstance(task_dto, TaskResponseDTO)
        assert task_dto.id == sample_task.id
        assert task_dto.title == sample_task.title

    def test_get_task_by_id_not_found(self, mock_task_repository):
        """
        Verifica que get_task_by_id retorne None si la tarea no existe.
        """
        # Configurar el mock para que retorne None
        mock_task_repository.get_task_by_id.return_value = None

        use_cases = TaskUseCases(mock_task_repository)
        task_dto = use_cases.get_task_by_id(999) # ID que no existe

        # Verificar que el método del repositorio fue llamado
        mock_task_repository.get_task_by_id.assert_called_once_with(999)
        # Verificar que se retornó None
        assert task_dto is None

    def test_create_task_success(self, mock_task_repository):
        """
        Verifica que create_task cree una nueva tarea y la retorne como DTO.
        """
        # Datos para la nueva tarea
        new_task_data = TaskCreateDTO(
            title="Nueva Tarea",
            description="Descripción de la nueva tarea",
            priority=1,
            due_date=datetime(2025, 8, 1, 12, 0, 0, tzinfo=timezone.utc),
            category="Test"
        )
        # Simular la tarea que sería devuelta por el repositorio con un ID
        mock_created_task = Task(
            id=3,
            title="Nueva Tarea",
            description="Descripción de la nueva tarea",
            completed=False,
            priority=1,
            due_date=datetime(2025, 8, 1, 12, 0, 0, tzinfo=timezone.utc),
            category="Test",
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc)
        )
        mock_task_repository.create_task.return_value = mock_created_task

        use_cases = TaskUseCases(mock_task_repository)
        created_task_dto = use_cases.create_task(new_task_data)

        # Verificar que el método del repositorio fue llamado
        mock_task_repository.create_task.assert_called_once()
        # Verificar que el objeto Task pasado al repositorio es correcto
        assert mock_task_repository.create_task.call_args[0][0].title == new_task_data.title
        assert mock_task_repository.create_task.call_args[0][0].description == new_task_data.description
        assert mock_task_repository.create_task.call_args[0][0].priority == new_task_data.priority
        assert mock_task_repository.create_task.call_args[0][0].completed is False

        # Verificar que se retornó el DTO correcto
        assert isinstance(created_task_dto, TaskResponseDTO)
        assert created_task_dto.id == mock_created_task.id
        assert created_task_dto.title == mock_created_task.title

    def test_update_task_success(self, mock_task_repository, sample_task):
        """
        Verifica que update_task actualice una tarea existente y la retorne como DTO.
        """
        # Datos para la actualización
        update_data = TaskUpdateDTO(title="Título Actualizado", completed=True)
        
        # Simular la tarea actualizada que sería devuelta por el repositorio
        updated_task_in_repo = sample_task
        updated_task_in_repo.title = "Título Actualizado"
        updated_task_in_repo.completed = True
        updated_task_in_repo.updated_at = datetime.now(timezone.utc)

        mock_task_repository.update_task.return_value = updated_task_in_repo

        use_cases = TaskUseCases(mock_task_repository)
        updated_task_dto = use_cases.update_task(sample_task.id, update_data)

        # Verificar que el método del repositorio fue llamado
        mock_task_repository.update_task.assert_called_once_with(
            sample_task.id, update_data.dict(exclude_unset=True)
        )
        # Verificar que se retornó el DTO correcto
        assert isinstance(updated_task_dto, TaskResponseDTO)
        assert updated_task_dto.id == sample_task.id
        assert updated_task_dto.title == "Título Actualizado"
        assert updated_task_dto.completed is True

    def test_update_task_not_found(self, mock_task_repository):
        """
        Verifica que update_task retorne None si la tarea no existe.
        """
        mock_task_repository.update_task.return_value = None

        use_cases = TaskUseCases(mock_task_repository)
        update_data = TaskUpdateDTO(title="No existe")
        updated_task_dto = use_cases.update_task(999, update_data)

        # Verificar que el método del repositorio fue llamado
        mock_task_repository.update_task.assert_called_once_with(999, update_data.dict(exclude_unset=True))
        # Verificar que se retornó None
        assert updated_task_dto is None

    def test_delete_task_success(self, mock_task_repository, sample_task):
        """
        Verifica que delete_task elimine una tarea exitosamente.
        """
        mock_task_repository.delete_task.return_value = True

        use_cases = TaskUseCases(mock_task_repository)
        deleted = use_cases.delete_task(sample_task.id)

        # Verificar que el método del repositorio fue llamado
        mock_task_repository.delete_task.assert_called_once_with(sample_task.id)
        # Verificar que se retornó True
        assert deleted is True

    def test_delete_task_not_found(self, mock_task_repository):
        """
        Verifica que delete_task retorne False si la tarea no existe.
        """
        mock_task_repository.delete_task.return_value = False

        use_cases = TaskUseCases(mock_task_repository)
        deleted = use_cases.delete_task(999)

        # Verificar que el método del repositorio fue llamado
        mock_task_repository.delete_task.assert_called_once_with(999)
        # Verificar que se retornó False
        assert deleted is False

