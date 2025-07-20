import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from './app/store';
import { toggleTheme } from './features/theme/themeSlice';
import TaskList from './features/tasks/TaskList';

import Container from './common/Container';

function App() {
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const dispatch = useDispatch<AppDispatch>();

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  return (
    <Container> {/* Usa el Container aquí */}
      <header style={{ padding: '20px', textAlign: 'right' }}>
        <button onClick={handleToggleTheme}>
          Cambiar a Modo {themeMode === 'light' ? 'Oscuro' : 'Claro'}
        </button>
      </header>
      <TaskList />
    </Container>
  );
}

export default App;