import api from './api';
import type { Project } from '../types';

type Wrap<T> = { message: string; data: T };

export const getProjects = () => api.get<Wrap<Project[]>>('/projects').then(r => r.data.data);
export const createProject = (data: { name: string }) => api.post<Wrap<Project>>('/projects', data).then(r => r.data.data);
export const updateProject = (id: number, data: { name: string }) => api.put<Wrap<Project>>(`/projects/${id}`, data).then(r => r.data.data);
export const deleteProject = (id: number) => api.delete(`/projects/${id}`).then(r => r.data);
