import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../../app/store';
import { addNewTask, updateTask, Task } from '../../tasksSlice';

import {
  FormWrapper,
  StyledForm,
  FormGroup,
  Label,
  Input,
  TextArea,
  Select,
  SubmitButton,
} from '../TaskForm/TaskForm.styles';

interface TaskFormProps {
  taskToEdit?: Task;
  onClose?: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ taskToEdit, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [title, setTitle] = useState(taskToEdit?.title || '');
  const [description, setDescription] = useState(taskToEdit?.description || '');
  const [priority, setPriority] = useState(taskToEdit?.priority || 1);

  // Efecto para precargar los datos si taskToEdit cambia (para modo edición)
  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description);
      setPriority(taskToEdit.priority);
    } else {
      // Si no hay tarea para editar, resetear el formulario a valores por defecto
      setTitle('');
      setDescription('');
      setPriority(1);
    }
  }, [taskToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones básicas
    if (!title.trim()) {
      alert('El título es obligatorio.');
      return;
    }

    // Datos que se enviarán a la API, sin ID, created_at, updated_at
    // y con `completed` en false para la creación (como en handleAddTask)
    const taskData = {
      title,
      description,
      priority,
    };

    if (taskToEdit) {
      // Si hay una tarea para editar, despachar updateTask con el ID y los campos actualizados
      dispatch(updateTask({ id: taskToEdit.id, ...taskData }));
    } else {
      // Si es una nueva tarea, despachar addNewTask
      dispatch(addNewTask({
        ...taskData,
        completed: false, // Alineado con tu handleAddTask: el backend establece esto al crear
      }));
    }

    // Limpiar el formulario si es una nueva tarea, o cerrarlo en cualquier caso
    if (!taskToEdit) {
      setTitle('');
      setDescription('');
      setPriority(1);
    }
    onClose && onClose(); // Llamar a la función para cerrar el formulario si se provee
  };

  return (
    <FormWrapper>
      <h2>{taskToEdit ? 'Editar Tarea' : 'Crear Nueva Tarea'}</h2>
      <StyledForm onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="title">Título:</Label>
          <Input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="description">Descripción:</Label>
          <TextArea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="priority">Prioridad:</Label>
          <Select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(parseInt(e.target.value))}
          >
            <option value={1}>Baja</option>
            <option value={2}>Media</option>
            <option value={3}>Alta</option>
          </Select>
        </FormGroup>
        
        <SubmitButton type="submit">
          {taskToEdit ? 'Guardar Cambios' : 'Añadir Tarea'}
        </SubmitButton>
      </StyledForm>
    </FormWrapper>
  );
};

export default TaskForm;