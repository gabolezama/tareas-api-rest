import React, { Suspense, lazy } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from './app/store';
import { toggleTheme } from './features/theme/themeSlice';

import Container from './common/Container';

// Carga perezosa del componente TaskList
const LazyTaskList = lazy(() => import('./features/tasks/TaskList'));

function App() {
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const dispatch = useDispatch<AppDispatch>();

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  return (
    <Container>
      <header style={{ padding: '20px', textAlign: 'right' }}>
        <button onClick={handleToggleTheme}>
          Cambiar a Modo {themeMode === 'light' ? 'Oscuro 🌙' : 'Claro ☀️'}
        </button>
      </header>
      <Suspense fallback={<div>Cargando tareas...</div>}>
        <LazyTaskList />
      </Suspense>
    </Container>
  );
}

export default App;