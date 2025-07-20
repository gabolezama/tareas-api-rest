import styled from 'styled-components';

export const DashboardWrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  padding: ${({ theme }) => theme.spacing.large};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: ${({ theme }) => theme.spacing.large};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const ChartContainer = styled.div`
  width: 100%;
  max-width: 400px;
  margin-top: ${({ theme }) => theme.spacing.medium};
`;

export const MetricsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing.large};
  gap: ${({ theme }) => theme.spacing.medium};
  flex-wrap: wrap;
`;

export const MetricCard = styled.div`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border: 1px solid ${({ theme }) => theme.colors.borderColor};
  padding: ${({ theme }) => theme.spacing.medium};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  text-align: center;
  flex: 1;
  min-width: 150px;
`;

export const MetricValue = styled.h3`
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.small};
`;

export const MetricLabel = styled.p`
  font-size: 0.9em;
`;