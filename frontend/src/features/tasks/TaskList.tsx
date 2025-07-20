// frontend/src/features/tasks/TaskList.tsx
import React, { useEffect, useState } from 'react'; // Asegúrate de importar useState
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../app/store';
import { fetchTasks, updateTask, deleteTask, Task } from './tasksSlice';
import TaskForm from '../tasks/components/TaskForm';

import {
  TaskListWrapper,
  TaskItem,
  TaskTitle,
  TaskDescription,
  TaskActions,
  AddTaskButton,
} from './TaskList.styles';

const TaskList: React.FC = () => {
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const status = useSelector((state: RootState) => state.tasks.status);
  const error = useSelector((state: RootState) => state.tasks.error);
  const dispatch = useDispatch<AppDispatch>();
  const [showForm, setShowForm] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | undefined>(undefined);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchTasks());
    }
  }, [status, dispatch]);

  const handleToggleComplete = (task: Task) => {
    dispatch(updateTask({ id: task.id, completed: !task.completed }));
  };

  const handleDeleteTask = (taskId: number) => {
    dispatch(deleteTask(taskId));
  };

  const handleOpenCreateForm = () => {
    setTaskToEdit(undefined);
    setShowForm(true);
  };

  const handleOpenEditForm = (task: Task) => {
    setTaskToEdit(task);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setTaskToEdit(undefined);
  };

  if (status === 'loading') {
    return <TaskListWrapper>Cargando tareas...</TaskListWrapper>;
  }

  if (error) {
    return <TaskListWrapper>Error al cargar tareas: {error}</TaskListWrapper>;
  }

  return (
    <TaskListWrapper>
      <h1>Lista de Tareas</h1>
      
      {!showForm && (
        <AddTaskButton onClick={handleOpenCreateForm}>Añadir Nueva Tarea</AddTaskButton>
      )}

      {showForm && (
        <TaskForm taskToEdit={taskToEdit} onClose={handleCloseForm} />
      )}

      <ul>
        {tasks.map((task) => (
          <TaskItem key={task.id}>
            <div>
              <TaskTitle completed={task.completed}>
                {task.title} (Prioridad: {task.priority})
              </TaskTitle>
              <TaskDescription>{task.description}</TaskDescription>
            </div>
            <TaskActions>
              <button onClick={() => handleToggleComplete(task)}>
                {task.completed ? 'Desmarcar' : 'Completar'}
              </button>
              <button onClick={() => handleOpenEditForm(task)}>
                Editar
              </button>
              <button onClick={() => handleDeleteTask(task.id)} style={{ backgroundColor: '#dc3545' }}>
                Eliminar
              </button>
            </TaskActions>
          </TaskItem>
        ))}
      </ul>
    </TaskListWrapper>
  );
};

export default TaskList;