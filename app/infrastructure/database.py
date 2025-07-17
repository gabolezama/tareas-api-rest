from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os

# Obtiene la URL de la base de datos de las variables de entorno
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost:5432/task_manager_db")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base() # Esta es la base para nuestros modelos ORM

def get_db():
    db = SessionLocal()
    try:
        yield db # Permite que se use como un context manager (para inyección de dependencias)
    finally:
        db.close() # Asegura que la sesión de DB se cierre