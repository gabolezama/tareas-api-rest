// frontend/src/common/Container.ts
import styled from 'styled-components';

const Container = styled.div`
  max-width: 960px; /* Ancho máximo para el contenido */
  margin: 0 auto;   /* Centra el contenedor */
  padding: 20px;    /* Espaciado interno */
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  min-height: 100vh; /* Para que ocupe al menos toda la altura de la ventana */
`;

export default Container;