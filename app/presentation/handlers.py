import tornado.web
import json
from app.application.use_cases import TaskUseCases
from app.adapters.sqlalchemy_task_repository import SQLAlchemyTaskRepository
from app.infrastructure.database import SessionLocal, get_db
from app.presentation.dtos import TaskCreateDTO, TaskUpdateDTO, TaskResponseDTO
from pydantic import ValidationError

# Decorador para inyectar la sesión de DB y cerrar al finalizar
def with_db_session(func):
    def wrapper(self, *args, **kwargs):
        db = next(get_db()) # Obtiene una nueva sesión de la base de datos
        try:
            task_repo = SQLAlchemyTaskRepository(db)
            task_use_cases = TaskUseCases(task_repo)
            return func(self, task_use_cases, *args, **kwargs)
        finally:
            db.close() # Asegura que la sesión se cierre
    return wrapper

class BaseHandler(tornado.web.RequestHandler):
    def prepare(self):
        if self.request.body:
            try:
                self.json_data = json.loads(self.request.body)
            except json.JSONDecodeError:
                self.send_error(400, reason="Invalid JSON")
                self.json_data = {}
        else:
            self.json_data = {}

    def set_default_headers(self):
        self.set_header("Content-Type", "application/json")

    def write_error(self, status_code, **kwargs):
        if "reason" in kwargs:
            self.set_status(status_code, reason=kwargs["reason"])
            self.write(json.dumps({"error": kwargs["reason"]}))
        else:
            self.write(json.dumps({"error": self._reason}))
        self.finish()

class TaskListHandler(BaseHandler):
    @with_db_session
    async def get(self, task_use_cases: TaskUseCases):
        tasks = task_use_cases.get_all_tasks()
        self.write(json.dumps([task.dict() for task in tasks], default=str))

    @with_db_session
    async def post(self, task_use_cases: TaskUseCases):
        try:
            task_data = TaskCreateDTO(**self.json_data)
            new_task = task_use_cases.create_task(task_data)
            self.set_status(201)
            self.write(json.dumps(new_task.dict(), default=str))
        except ValidationError as e:
            self.send_error(400, reason=f"Validation Error: {e.errors()}")
        except Exception as e:
            self.send_error(500, reason=f"Internal Server Error: {str(e)}")

class TaskDetailHandler(BaseHandler):
    @with_db_session
    async def get(self, task_use_cases: TaskUseCases, task_id: str):
        try:
            task = task_use_cases.get_task_by_id(int(task_id))
            if task:
                self.write(json.dumps(task.dict(), default=str))
            else:
                self.send_error(404, reason="Task not found")
        except ValueError:
            self.send_error(400, reason="Invalid Task ID")
        except Exception as e:
            self.send_error(500, reason=f"Internal Server Error: {str(e)}")

    @with_db_session
    async def put(self, task_use_cases: TaskUseCases, task_id: str):
        try:
            task_data = TaskUpdateDTO(**self.json_data)
            updated_task = task_use_cases.update_task(int(task_id), task_data)
            if updated_task:
                self.write(json.dumps(updated_task.dict(), default=str))
            else:
                self.send_error(404, reason="Task not found")
        except ValidationError as e:
            self.send_error(400, reason=f"Validation Error: {e.errors()}")
        except ValueError:
            self.send_error(400, reason="Invalid Task ID")
        except Exception as e:
            self.send_error(500, reason=f"Internal Server Error: {str(e)}")

    @with_db_session
    async def delete(self, task_use_cases: TaskUseCases, task_id: str):
        try:
            deleted = task_use_cases.delete_task(int(task_id))
            if deleted:
                self.set_status(204)
            else:
                self.send_error(404, reason="Task not found")
        except ValueError:
            self.send_error(400, reason="Invalid Task ID")
        except Exception as e:
            self.send_error(500, reason=f"Internal Server Error: {str(e)}")