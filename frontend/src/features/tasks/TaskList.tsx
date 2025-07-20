import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../app/store';
import { addTask, updateTaskStatus, Task } from './tasksSlice';

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

  const handleAddTask = () => {
    const newTask: Task = {
      id: tasks.length + 1, // ID temporal
      title: `Nueva Tarea ${tasks.length + 1}`,
      description: "Esta es una tarea de ejemplo desde el frontend.",
      completed: false,
      priority: Math.floor(Math.random() * 3) + 1, // Random priority
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    dispatch(addTask(newTask));
  };

  const handleToggleComplete = (id: number, completed: boolean) => {
    dispatch(updateTaskStatus({ id, completed: !completed }));
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
      <AddTaskButton onClick={handleAddTask}>Añadir Tarea (Ejemplo)</AddTaskButton>
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
              <button onClick={() => handleToggleComplete(task.id, task.completed)}>
                {task.completed ? 'Desmarcar' : 'Completar'}
              </button>
            </TaskActions>
          </TaskItem>
        ))}
      </ul>
    </TaskListWrapper>
  );
};

export default TaskList;