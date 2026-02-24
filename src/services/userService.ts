import api from './api';
import type { User } from '../types';

type Wrap<T> = { message: string; data: T };

export const getUsers = () => api.get<Wrap<User[]>>('/users').then(r => r.data.data);
export const getUser = (id: number) => api.get<Wrap<User>>(`/users/${id}`).then(r => r.data.data);
export const updateUser = (id: number, data: Partial<User & { password?: string }>) => api.put<Wrap<User>>(`/users/${id}`, data).then(r => r.data.data);
export const deleteUser = (id: number) => api.delete(`/users/${id}`).then(r => r.data);
export const registerUser = (data: { username: string; password: string; role: string }) => api.post<Wrap<User>>('/auth/register', data).then(r => r.data.data);
