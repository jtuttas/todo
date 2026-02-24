import api from './api';
import type { Project } from '../types';

export const getProjects = () => api.get<Project[]>('/projects').then(r => r.data);
export const createProject = (data: { name: string }) => api.post<Project>('/projects', data).then(r => r.data);
export const updateProject = (id: number, data: { name: string }) => api.put(`/projects/${id}`, data).then(r => r.data);
export const deleteProject = (id: number) => api.delete(`/projects/${id}`).then(r => r.data);
