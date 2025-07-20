// frontend/src/features/tasks/components/TaskFilter.styles.ts
import styled from 'styled-components';

export const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};
`;

export const FilterLabel = styled.label`
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
  white-space: nowrap; /* Evita que el texto del label se rompa */
`;

export const FilterSelect = styled.select`
  padding: ${({ theme }) => theme.spacing.small};
  border: 1px solid ${({ theme }) => theme.colors.borderColor};
  border-radius: ${({ theme }) => theme.borderRadius};
  background-color: ${({ theme }) => theme.colors.inputBackground};
  color: ${({ theme }) => theme.colors.inputText};
  cursor: pointer;
  min-width: 120px; /* Asegura un ancho mínimo para el select */

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    outline: none;
  }
`;