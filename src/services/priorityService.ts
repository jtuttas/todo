import api from './api';
import type { Priority } from '../types';

type Wrap<T> = { message: string; data: T };

export const getPriorities = () => api.get<Wrap<Priority[]>>('/priorities').then(r => r.data.data);
export const createPriority = (data: { name: string }) => api.post<Wrap<Priority>>('/priorities', data).then(r => r.data.data);
export const updatePriority = (id: number, data: { name: string }) => api.put<Wrap<Priority>>(`/priorities/${id}`, data).then(r => r.data.data);
export const deletePriority = (id: number) => api.delete(`/priorities/${id}`).then(r => r.data);
