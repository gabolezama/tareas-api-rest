import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Comment {
  id: number;
  task_id: number;
  content: string;
  created_at: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  due_date?: string;
  priority: number;
  category?: string;
  created_at: string;
  updated_at: string;
  comments?: Comment[];
}

interface TasksState {
  tasks: Task[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: TasksState = {
  tasks: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
    },
    updateTaskStatus: (state, action: PayloadAction<{ id: number; completed: boolean }>) => {
      const existingTask = state.tasks.find(task => task.id === action.payload.id);
      if (existingTask) {
        existingTask.completed = action.payload.completed;
      }
    },
  },
  // extraReducers se usará para manejar acciones de thunks asíncronos (ej. fetchTasks)
  extraReducers: (builder) => {
    // Ejemplo: builder.addCase(fetchTasks.pending, (state) => { state.status = 'loading'; });
  },
});

export const { addTask, updateTaskStatus } = tasksSlice.actions;

export default tasksSlice.reducer;