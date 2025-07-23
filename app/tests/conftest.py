import pytest
import tornado.web
import tornado.testing
from unittest.mock import MagicMock, patch
from datetime import datetime, timezone
import copy

from app.main import make_app
from app.domain.models import Task, Comment
from app.application.use_cases import TaskUseCases
from app.adapters.sqlalchemy_task_repository import SQLAlchemyTaskRepository
from app.infrastructure.database import get_db, SessionLocal, engine, Base # Importa engine y Base también para el parche
from app.presentation.handlers import TaskListHandler, TaskDetailHandler, with_db_session
from app.presentation.dtos import TaskCreateDTO, TaskUpdateDTO, TaskResponseDTO

@pytest.fixture
def sample_task_data():
    """Proporciona datos de ejemplo para una tarea."""
    return {
        "id": 1,
        "title": "Comprar víveres",
        "description": "Leche, pan, huevos, frutas",
        "completed": False,
        "due_date": datetime(2025, 7, 25, 10, 0, 0, tzinfo=timezone.utc),
        "priority": 1,
        "category": "Hogar",
        "created_at": datetime(2025, 7, 20, 9, 0, 0, tzinfo=timezone.utc),
        "updated_at": datetime(2025, 7, 20, 9, 0, 0, tzinfo=timezone.utc),
    }

@pytest.fixture
def sample_task(sample_task_data):
    """Proporciona un objeto Task del dominio."""
    # Convertir el diccionario a un objeto Task.
    # Asegurarse de que todos los campos requeridos por TaskResponseDTO estén presentes.
    task = Task(
        id=sample_task_data['id'],
        title=sample_task_data['title'],
        description=sample_task_data['description'],
        completed=sample_task_data['completed'],
        due_date=sample_task_data['due_date'],
        priority=sample_task_data['priority'],
        category=sample_task_data['category'],
        created_at=sample_task_data['created_at'],
        updated_at=sample_task_data['updated_at']
    )
    return task

@pytest.fixture
def another_sample_task_data():
    """Proporciona datos de ejemplo para otra tarea."""
    return {
        "id": 2,
        "title": "Enviar informe",
        "description": "Informe mensual de ventas",
        "completed": True,
        "due_date": datetime(2025, 7, 18, 17, 0, 0, tzinfo=timezone.utc),
        "priority": 2,
        "category": "Trabajo",
        "created_at": datetime(2025, 7, 15, 10, 0, 0, tzinfo=timezone.utc),
        "updated_at": datetime(2025, 7, 18, 17, 0, 0, tzinfo=timezone.utc),
    }

@pytest.fixture
def another_sample_task(another_sample_task_data):
    """Proporciona otro objeto Task del dominio."""
    task = Task(
        id=another_sample_task_data['id'],
        title=another_sample_task_data['title'],
        description=another_sample_task_data['description'],
        completed=another_sample_task_data['completed'],
        due_date=another_sample_task_data['due_date'],
        priority=another_sample_task_data['priority'],
        category=another_sample_task_data['category'],
        created_at=another_sample_task_data['created_at'],
        updated_at=another_sample_task_data['updated_at']
    )
    return task

@pytest.fixture
def mock_task_repository(mocker, sample_task, another_sample_task):
    """
    Fixture que mockea SQLAlchemyTaskRepository.
    Simula las operaciones CRUD sin interactuar con una base de datos real.
    Se asegura de que el store se reinicie con copias frescas para cada test.
    """
    mock_repo = mocker.MagicMock(spec=SQLAlchemyTaskRepository)

    # Simular un almacenamiento en memoria para las tareas
    # Usamos deepcopy para asegurar que cada test obtenga una copia limpia de las tareas iniciales
    initial_tasks_store = {
        sample_task.id: copy.deepcopy(sample_task),
        another_sample_task.id: copy.deepcopy(another_sample_task)
    }
    tasks_store = {} # Se inicializará con initial_tasks_store para cada test

    def _reset_store():
        tasks_store.clear()
        for k, v in initial_tasks_store.items():
            tasks_store[k] = copy.deepcopy(v)

    _reset_store() # Inicializa el store al cargar la fixture

    def _get_all_tasks():
        return list(tasks_store.values())

    def _get_task_by_id(task_id):
        return tasks_store.get(task_id)

    def _create_task(task):
        # Asignar un ID simple para el mock
        new_id = max(tasks_store.keys()) + 1 if tasks_store else 1
        task.id = new_id
        task.created_at = datetime.now(timezone.utc)
        task.updated_at = datetime.now(timezone.utc)
        tasks_store[new_id] = task
        return task

    def _update_task(task_id, updates):
        task = tasks_store.get(task_id)
        if task:
            for key, value in updates.items():
                if hasattr(task, key):
                    setattr(task, key, value)
            task.updated_at = datetime.now(timezone.utc)
            return task
        return None

    def _delete_task(task_id):
        if task_id in tasks_store:
            del tasks_store[task_id]
            return True
        return False

    # Asignar las funciones simuladas a los métodos del mock
    mock_repo.get_all_tasks.side_effect = _get_all_tasks
    mock_repo.get_task_by_id.side_effect = _get_task_by_id
    mock_repo.create_task.side_effect = _create_task
    mock_repo.update_task.side_effect = _update_task
    mock_repo.delete_task.side_effect = _delete_task
    mock_repo.add_comment_to_task.return_value = MagicMock(spec=Comment)

    yield mock_repo # Retorna el mock_repo para que los tests lo usen

    # Limpiar y reiniciar el store después de cada test para asegurar aislamiento
    _reset_store()


@pytest.fixture
def mock_task_use_cases(mocker, mock_task_repository):
    """
    Fixture que mockea TaskUseCases.
    """
    mock_use_cases = mocker.MagicMock(spec=TaskUseCases)
    mock_use_cases.get_all_tasks.return_value = [
        TaskResponseDTO.from_orm(copy.deepcopy(mock_task_repository.get_task_by_id(1))),
        TaskResponseDTO.from_orm(copy.deepcopy(mock_task_repository.get_task_by_id(2)))
    ]
    mock_use_cases.get_task_by_id.side_effect = lambda task_id: (
        TaskResponseDTO.from_orm(copy.deepcopy(mock_task_repository.get_task_by_id(task_id)))
        if mock_task_repository.get_task_by_id(task_id) else None
    )
    mock_use_cases.create_task.side_effect = lambda task_data: (
        TaskResponseDTO.from_orm(mock_task_repository.create_task(
            Task(
                title=task_data.title,
                description=task_data.description,
                due_date=task_data.due_date,
                priority=task_data.priority,
                category=task_data.category,
                completed=False # Default value
            )
        ))
    )
    mock_use_cases.update_task.side_effect = lambda task_id, updates: (
        TaskResponseDTO.from_orm(mock_task_repository.update_task(task_id, updates.dict(exclude_unset=True)))
        if mock_task_repository.update_task(task_id, updates.dict(exclude_unset=True)) else None
    )
    mock_use_cases.delete_task.side_effect = lambda task_id: mock_task_repository.delete_task(task_id)
    
    yield mock_use_cases


@pytest.fixture(autouse=True)
def mock_db_session_and_use_cases(mocker, mock_task_repository, mock_task_use_cases):
    """
    Fixture que mockea la sesión de la base de datos, get_db y TaskUseCases.
    Esto asegura que el decorador @with_db_session use nuestros mocks.
    """
    # Mockear la sesión de SQLAlchemy
    mock_session_instance = mocker.MagicMock(spec=SessionLocal())
    mock_session_instance.query.return_value.filter.return_value.first.return_value = None
    mock_session_instance.add.return_value = None
    mock_session_instance.commit.return_value = None
    mock_session_instance.refresh.return_value = None
    mock_session_instance.close.return_value = None

    # Patch create_engine to prevent actual database connection
    mocker.patch('sqlalchemy.create_engine', return_value=mocker.MagicMock())

    # Patch the module-level 'engine' and 'SessionLocal' in app.infrastructure.database
    mocker.patch('app.infrastructure.database.engine', new=mocker.MagicMock())
    mocker.patch('app.infrastructure.database.SessionLocal', return_value=mock_session_instance)

    # Patch Base.metadata.create_all and drop_all to do nothing
    mocker.patch('app.infrastructure.database.Base.metadata.create_all', return_value=None)
    mocker.patch('app.infrastructure.database.Base.metadata.drop_all', return_value=None)

    # Patch SQLAlchemyTaskRepository to use the mocked repository
    mocker.patch('app.adapters.sqlalchemy_task_repository.SQLAlchemyTaskRepository',
                 return_value=mock_task_repository)

    # Patch TaskUseCases to return our mock_task_use_cases instance
    mocker.patch('app.application.use_cases.TaskUseCases', return_value=mock_task_use_cases) # <-- ¡Nuevo!

    yield mock_session_instance # Yield the mock_session_instance for the fixture itself to be used by tests

# Fixture para la aplicación Tornado de prueba
@pytest.fixture
def app():
    """
    Proporciona una instancia de la aplicación Tornado para pruebas.
    """
    return make_app()

class BaseAPITest(tornado.testing.AsyncHTTPTestCase):
    """
    Clase base para los tests de la API de Tornado,
    configura la aplicación y el cliente HTTP.
    """
    def get_app(self):
        return self.app

    @pytest.fixture(autouse=True)
    def inject_fixtures(self, app, mock_task_repository, mock_db_session_and_use_cases, sample_task, another_sample_task, mock_task_use_cases): # <-- Añadido mock_task_use_cases
        self.app = app
        self.mock_task_repository = mock_task_repository
        self.mock_db_session = mock_db_session_and_use_cases
        self.sample_task = sample_task
        self.another_sample_task = another_sample_task
        self.mock_task_use_cases = mock_task_use_cases
