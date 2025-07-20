import styled from 'styled-components';

export const TaskListWrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  padding: ${({ theme }) => theme.spacing.large};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-top: ${({ theme }) => theme.spacing.large};
`;

export const TaskItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.medium} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderColor};

  &:last-child {
    border-bottom: none;
  }
`;

export const TaskTitle = styled.h3<{ completed: boolean }>`
  font-size: 1.2rem;
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  text-decoration: ${({ completed }) => (completed ? 'line-through' : 'none')};
`;

export const TaskDescription = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.secondary};
  margin: 5px 0 0;
`;

export const TaskActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.small};
`;

export const AddTaskButton = styled.button`
  margin-bottom: ${({ theme }) => theme.spacing.large};
  width: 100%;
`;