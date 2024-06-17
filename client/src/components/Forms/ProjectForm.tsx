import React, { useState, useEffect } from 'react';
import { addProject, updateProject, getTasks } from '../../services/api';

interface ProjectFormProps {
  project?: any;
  onSave: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ project, onSave }) => {
  const [name, setName] = useState(project ? project.name : '');
  const [description, setDescription] = useState(project ? project.description : '');
  const [tasks, setTasks] = useState<any[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<any[]>(project ? project.tasks : []);

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await getTasks();
      setTasks(response.data);
    };
    fetchTasks();
  }, []);

  const handleTaskChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedTasks(selectedOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newProject = { name, description, tasks: selectedTasks };
    if (project) {
      await updateProject(project.id, newProject);
    } else {
      await addProject(newProject);
    }
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="add-project-form">
      <div className="mb-3">
        <label htmlFor="inputName" className="form-label">Назва проекту</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} id="inputName" className="form-control" />
      </div>
      <div className="mb-3">
        <label htmlFor="inputDescription" className="form-label">Опис проекту</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} id="inputDescription" className="form-control" />
      </div>
      <div className="mb-3">
        <label htmlFor="inputTasks" className="form-label">Завдання</label>
        <select multiple value={selectedTasks} onChange={handleTaskChange} id="inputTasks" className="form-control">
          {tasks.map(task => (
            <option key={task.id} value={task.id}>{task.title}</option>
          ))}
        </select>
      </div>
      <button type="submit">Зберегти</button>
    </form>
  );
};

export default ProjectForm;