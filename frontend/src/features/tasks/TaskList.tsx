import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../app/store';
import { fetchTasks, updateTask, deleteTask, Task } from '../tasks/tasksSlice';

import TaskForm from './components/TaskForm/TaskForm';
import TaskDashboard from './TaskDashboard';
import TaskFilter from './components/TaskFilter/TaskFilter';

import {
  TaskListWrapper,
  TaskItem,
  TaskTitle,
  TaskDescription,
  TaskActions,
  AddTaskButton,
  TaskListHeader,
  TaskCount,
} from './TaskList.styles';

const TaskList: React.FC = () => {
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const status = useSelector((state: RootState) => state.tasks.status);
  const error = useSelector((state: RootState) => state.tasks.error);
  const dispatch = useDispatch<AppDispatch>();
  const [showForm, setShowForm] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | undefined>(undefined);
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all'); // Estado para el filtro

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchTasks());
    }
  }, [status, dispatch]);

  const filteredTasks = useMemo(() => {
    if (filter === 'completed') {
      return tasks.filter(task => task.completed);
    } else if (filter === 'pending') {
      return tasks.filter(task => !task.completed);
    }
    return tasks;
  }, [tasks, filter]);

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

  const handleFilterChange = (newFilter: 'all' | 'completed' | 'pending') => {
    setFilter(newFilter);
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
      
      {/* Dashboard de métricas y gráficos */}
      <TaskDashboard /> 

      <TaskListHeader>
        {/* Componente de filtro */}
        <TaskFilter currentFilter={filter} onFilterChange={handleFilterChange} />
        {/* Contador de tareas visibles */}
        <TaskCount>Tareas visibles: {filteredTasks.length} de {tasks.length}</TaskCount>
      </TaskListHeader>

      {/* Botón para añadir nueva tarea (solo visible si el formulario no está abierto) */}
      {!showForm && (
        <AddTaskButton onClick={handleOpenCreateForm}>Añadir Nueva Tarea</AddTaskButton>
      )}

      {/* Formulario de creación/edición de tareas */}
      {showForm && (
        <TaskForm taskToEdit={taskToEdit} onClose={handleCloseForm} />
      )}

      <ul>
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
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
          ))
        ) : (
          <p>No hay tareas para mostrar con el filtro actual.</p>
        )}
      </ul>
    </TaskListWrapper>
  );
};

export default TaskList;