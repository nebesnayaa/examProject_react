import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
});

export interface Task {
  id: number;
  title: string;
  description: string;
  date: string;
  tags: string[];
  priority: string;
}

export const getTasks = () => api.get('/tasks');
export const addTask = (task: any) => api.post('/tasks', task);
export const deleteTask = (id: number) => api.delete(`/tasks/${id}`);
export const updateTask = (id: number, task: any) => api.put(`/tasks/${id}`, task);

export interface Tag {
  id: number;
  name: string;
}

export const getTags = () => api.get('/tags');
export const addTag = (tag: any) => api.post('/tags', tag);
export const deleteTag = (id: number) => api.delete(`/tags/${id}`);

export const getProjects = () => api.get('/projects');
export const addProject = (project: any) => api.post('/projects', project);
export const deleteProject = (id: number) => api.delete(`/projects/${id}`);
export const updateProject = (id: number, project: any) => api.put(`/projects/${id}`, project);

