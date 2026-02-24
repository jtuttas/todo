import api from './api';
import type { Task } from '../types';

type Wrap<T> = { message: string; data: T };

export const getTasks = () => api.get<Wrap<Task[]>>('/tasks').then(r => r.data.data);
export const createTask = (data: Partial<Task>) => api.post<Wrap<Task>>('/tasks', data).then(r => r.data.data);
export const updateTask = (id: number, data: Partial<Task>) => api.put<Wrap<Task>>(`/tasks/${id}`, data).then(r => r.data.data);
export const deleteTask = (id: number) => api.delete(`/tasks/${id}`).then(r => r.data);
export const markTaskDone = (id: number, done: boolean) => api.patch<Wrap<Task>>(`/tasks/${id}/done`, { done }).then(r => r.data.data);
