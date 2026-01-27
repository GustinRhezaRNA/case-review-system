import { api } from '../client';

export const getCases = (page: number = 1, limit: number = 10, search?: string, status?: string) =>
    api.get('/cases', { params: { page, limit, ...(search && { search }), ...(status && { status }) } });

export const getCase = (id: string) => api.get(`/cases/${id}`);

export const createCase = (data: any) => api.post('/cases', data);

export const assignCase = (id: string, userId: string) => api.patch(`/cases/${id}/assign`, { userId });

export const updateStatus = (id: string, status: string) => api.patch(`/cases/${id}/status`, { status });

export const getStatusCounts = () => api.get('/cases/status-counts');

export const getAssignableUsers = () => api.get('/cases/users');

export const getUserStats = (userId: string) => api.get(`/cases/stats/${userId}`);
