import api from './api';
import type { Priority } from '../types';

export const getPriorities = () => api.get<Priority[]>('/priorities').then(r => r.data);
export const createPriority = (data: { name: string }) => api.post<Priority>('/priorities', data).then(r => r.data);
export const updatePriority = (id: number, data: { name: string }) => api.put(`/priorities/${id}`, data).then(r => r.data);
export const deletePriority = (id: number) => api.delete(`/priorities/${id}`).then(r => r.data);
