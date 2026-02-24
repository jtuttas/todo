import api from './api';
import type { Task } from '../types';

export const getTasks = () => api.get<Task[]>('/tasks').then(r => r.data);
export const createTask = (data: Partial<Task>) => api.post<Task>('/tasks', data).then(r => r.data);
export const updateTask = (id: number, data: Partial<Task>) => api.put(`/tasks/${id}`, data).then(r => r.data);
export const deleteTask = (id: number) => api.delete(`/tasks/${id}`).then(r => r.data);
export const markTaskDone = (id: number, done: boolean) => api.patch(`/tasks/${id}/done`, { done }).then(r => r.data);
