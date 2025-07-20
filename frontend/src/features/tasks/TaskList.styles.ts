import styled from 'styled-components';

export const TaskListWrapper = styled.div`
  max-width: 900px;
  margin: 24px auto;
  padding: 24px;
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

  h1 {
    color: ${({ theme }) => theme.colors.primary};
    text-align: center;
    margin-bottom: ${({ theme }) => theme.spacing.large};
  }

  ul {
    list-style: none;
    padding: 0;
  }

  p {
    text-align: center;
    margin-top: ${({ theme }) => theme.spacing.medium};
  }
`;

export const TaskListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.medium};
  width: 100%;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.small};
`;

export const AddTaskButton = styled.button`
  background-color: ${({ theme }) => theme.colors.success};
  color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.medium} ${({ theme }) => theme.spacing.large};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius};
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: background-color 0.2s ease;
  margin-bottom: ${({ theme }) => theme.spacing.large};
  align-self: flex-start;

  &:hover {
    background-color: #218838;
  }
`;

export const TaskItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing.medium};
  border-radius: ${({ theme }) => theme.borderRadius};
  margin-bottom: ${({ theme }) => theme.spacing.small};
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease;
  flex-wrap: wrap;

  &:hover {
    transform: translateY(-2px);
  }
`;

export const TaskTitle = styled.h3<{ completed: boolean }>`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  text-decoration: ${({ completed }) => (completed ? 'line-through' : 'none')};
  opacity: ${({ completed }) => (completed ? 0.6 : 1)};
`;

export const TaskDescription = styled.p`
  margin: ${({ theme }) => theme.spacing.small} 0 0 0;
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 0.9em;
`;

export const TaskActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.small};
  margin-top: ${({ theme }) => theme.spacing.small};

  button {
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.white};
    border: none;
    padding: ${({ theme }) => theme.spacing.small} ${({ theme }) => theme.spacing.medium};
    border-radius: ${({ theme }) => theme.borderRadius};
    cursor: pointer;
    font-size: 0.85rem;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: ${({ theme }) => theme.colors.primaryDark};
    }
  }
`;

export const TaskCount = styled.p`
  font-size: 0.9em;
  white-space: nowrap;
`;