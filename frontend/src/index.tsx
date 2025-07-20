import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider, useSelector } from 'react-redux';
import store, { RootState } from './app/store';

import { ThemeProvider } from 'styled-components';
import GlobalStyle from './styles/GlobalStyles';
import { lightTheme, darkTheme } from './styles/theme';

const ThemedApp: React.FC = () => {
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const currentTheme = themeMode === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={currentTheme}>
      <GlobalStyle />
      <App />
    </ThemeProvider>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemedApp />
    </Provider>
  </React.StrictMode>
);

reportWebVitals();