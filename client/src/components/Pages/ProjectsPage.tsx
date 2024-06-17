import React, { useEffect, useState } from 'react';
import { getProjects, deleteProject, getTasks  } from '../../services/api';
import ProjectForm from '../Forms/ProjectForm';
import { Modal, Button } from 'react-bootstrap';

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchProjectsAndTasks  = async () => {
      const projectsResponse = await getProjects();
      const tasksResponse = await getTasks();
      setProjects(projectsResponse.data);
      setTasks(tasksResponse.data);
    };
    fetchProjectsAndTasks ();
  }, []);

  const handleDelete = async (id: number) => {
    await deleteProject(id);
    setProjects(projects.filter((project) => project.id !== id));
  };

  const handleEdit = (project: any) => {
    setEditingProject(project);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingProject(null);
    setShowModal(true);
  };

  const handleSave = () => {
    setEditingProject(null);
    setShowModal(false);
    const fetchProjectsAndTasks = async () => {
      const projectsResponse = await getProjects();
      const tasksResponse = await getTasks();
      setProjects(projectsResponse.data);
      setTasks(tasksResponse.data);
    };
    fetchProjectsAndTasks();
  };

  const getTaskTitles = (taskIds: number[]) => {
    return taskIds
      .map(id => tasks.find(task => task.id === id))
      .filter(task => task !== undefined);
  };

  return (
    <div className="m-3">
      <div className="mb-3 d-flex gap-2">
        <Button onClick={handleAdd} className="mb-3 btn-success">Додати проект</Button>

      </div>
      <h2>Проекти</h2>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">№</th>
            <th scope="col">Назва</th>
            <th scope="col">Опис</th>
            <th scope="col">Завдання</th>
            <th scope="col">Дії</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project, index) => (
            <tr key={project.id}>
              <th scope="row">{index + 1}</th>
              <td>{project.name}</td>
              <td>{project.description}</td>
              <td className=''>
                <ul className='ms-5'>
                    {getTaskTitles(project.tasks).map((task) => (
                      <li className='text-start ps-4' key={task.id}>{task.title}</li>
                    ))}
                  </ul>
                </td>
              <td>
                <Button onClick={() => handleEdit(project)} className="me-2 btn-sm btn-warning">Редагувати</Button>
                <Button onClick={() => handleDelete(project.id)} className="btn-sm btn-danger">Видалити</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingProject ? 'Редагувати проект' : 'Додати проект'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ProjectForm project={editingProject} onSave={handleSave} />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ProjectsPage;