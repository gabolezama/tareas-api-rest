import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

import {
    ChartContainer, 
    DashboardWrapper, 
    MetricCard, 
    MetricLabel, 
    MetricValue, 
    MetricsContainer
} from './TaskDashboard.styles'

ChartJS.register(ArcElement, Tooltip, Legend);

const TaskDashboard: React.FC = () => {
  const tasks = useSelector((state: RootState) => state.tasks.tasks);

  // Calcular el número de tareas completadas y pendientes
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = tasks.filter(task => !task.completed).length;
  const totalTasks = tasks.length;

  // Datos para el gráfico de rosca
  const data = {
    labels: ['Completadas', 'Pendientes'],
    datasets: [
      {
        data: [completedTasks, pendingTasks],
        backgroundColor: [
          'rgba(40, 167, 69, 0.8)', // Verde para completadas
          'rgba(220, 53, 69, 0.8)',  // Rojo para pendientes
        ],
        borderColor: [
          'rgba(40, 167, 69, 1)',
          'rgba(220, 53, 69, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'white', // Color de las etiquetas de la leyenda
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed !== null) {
              label += context.parsed;
              if (totalTasks > 0) {
                label += ` (${((context.parsed / totalTasks) * 100).toFixed(1)}%)`;
              }
            }
            return label;
          }
        }
      }
    }
  };

  return (
    <DashboardWrapper>
      <h2>Análisis de Tareas</h2>

      <MetricsContainer>
        <MetricCard>
          <MetricValue>{totalTasks}</MetricValue>
          <MetricLabel>Total de Tareas</MetricLabel>
        </MetricCard>
        <MetricCard>
          <MetricValue>{completedTasks}</MetricValue>
          <MetricLabel>Tareas Completadas</MetricLabel>
        </MetricCard>
        <MetricCard>
          <MetricValue>{pendingTasks}</MetricValue>
          <MetricLabel>Tareas Pendientes</MetricLabel>
        </MetricCard>
      </MetricsContainer>

      {totalTasks > 0 ? (
        <ChartContainer>
          <Doughnut data={data} options={options} />
        </ChartContainer>
      ) : (
        <p>No hay tareas para mostrar en el gráfico.</p>
      )}
    </DashboardWrapper>
  );
};

export default TaskDashboard;