import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
const API_BASE_URL = 'http://localhost:8888'
export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  priority: number;
  created_at: string;
  updated_at: string;
}

// Define el estado inicial del slice de tareas
interface TasksState {
  tasks: Task[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: TasksState = {
  tasks: [],
  status: 'idle',
  error: null,
};

export const fetchTasks = createAsyncThunk<Task[], void>(
  'tasks/fetchTasks',
  async () => {
    const response = await fetch(`${API_BASE_URL}/tasks`);
    const data: Task[] = await response.json();
    console.log('DATA', data);
    
    if (!response.ok) {
      throw new Error('No se pudieron obtener las tareas.');
    }
    
    return data;
  }
);

export const addNewTask = createAsyncThunk<Task, Omit<Task, 'id' | 'created_at' | 'updated_at'>>(
  'tasks/addNewTask',
  async (newTaskData) => {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTaskData),
    });
    if (!response.ok) {
      throw new Error('No se pudo añadir la tarea.');
    }
    const data: Task = await response.json();
    return data;
  }
);

export const updateTask = createAsyncThunk<Task, { id: number; completed?: boolean; title?: string; description?: string; priority?: number }>(
  'tasks/updateTask',
  async ({ id, ...updates }) => {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    if (!response.ok) {
      throw new Error('No se pudo actualizar la tarea.');
    }
    const data: Task = await response.json();
    return data;
  }
);

export const deleteTask = createAsyncThunk<number, number>(
  'tasks/deleteTask',
  async (taskId) => {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('No se pudo eliminar la tarea.');
    }
    return taskId;
  }
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: { },
  extraReducers: (builder) => {
    builder
      // Manejo de fetchTasks
      .addCase(fetchTasks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.status = 'succeeded';
        state.tasks = action.payload; // Reemplaza las tareas con las obtenidas de la API
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Error al obtener tareas.';
      })
      // Manejo de addNewTask
      .addCase(addNewTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.tasks.push(action.payload); // Añade la nueva tarea (con ID real del backend)
      })
      .addCase(addNewTask.rejected, (state, action) => {
        state.error = action.error.message || 'Error al añadir tarea.';
      })
      // Manejo de updateTask
      .addCase(updateTask.fulfilled, (state, action: PayloadAction<Task>) => {
        const updatedTask = action.payload;
        const index = state.tasks.findIndex((task) => task.id === updatedTask.id);
        if (index !== -1) {
          state.tasks[index] = updatedTask; // Actualiza la tarea en el estado
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.error = action.error.message || 'Error al actualizar tarea.';
      })
      // Manejo de deleteTask
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<number>) => {
        const deletedTaskId = action.payload;
        state.tasks = state.tasks.filter((task) => task.id !== deletedTaskId); // Elimina la tarea del estado
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.error = action.error.message || 'Error al eliminar tarea.';
      });
  },
});

export default tasksSlice.reducer;