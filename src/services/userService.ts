import api from './api';
import type { User } from '../types';

export const getUsers = () => api.get<User[]>('/users').then(r => r.data);
export const getUser = (id: number) => api.get<User>(`/users/${id}`).then(r => r.data);
export const updateUser = (id: number, data: Partial<User & { password?: string }>) => api.put(`/users/${id}`, data).then(r => r.data);
export const deleteUser = (id: number) => api.delete(`/users/${id}`).then(r => r.data);
export const registerUser = (data: { username: string; password: string; role: string }) => api.post('/auth/register', data).then(r => r.data);
