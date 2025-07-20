import React from 'react';
import { FilterContainer, FilterLabel, FilterSelect } from '../TaskFilter/TaskFilter.styles';

interface TaskFilterProps {
  currentFilter: 'all' | 'completed' | 'pending';
  onFilterChange: (filter: 'all' | 'completed' | 'pending') => void;
}

const TaskFilter: React.FC<TaskFilterProps> = ({ currentFilter, onFilterChange }) => {
  return (
    <FilterContainer>
      <FilterLabel htmlFor="task-filter">Mostrar:</FilterLabel>
      <FilterSelect
        id="task-filter"
        value={currentFilter}
        onChange={(e) => onFilterChange(e.target.value as 'all' | 'completed' | 'pending')}
      >
        <option value="all">Todas</option>
        <option value="completed">Completadas</option>
        <option value="pending">Pendientes</option>
      </FilterSelect>
    </FilterContainer>
  );
};

export default TaskFilter;