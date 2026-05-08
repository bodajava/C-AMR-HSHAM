import apiClient from './client';

export const workoutApi = {
  getAll: (userId?: string) => apiClient.get('/workout', { params: { userId } }),
  getById: (id: string) => apiClient.get(`/workout/${id}`),
  create: (data: any) => apiClient.post('/workout', data),
  update: (id: string, data: any) => apiClient.patch(`/workout/${id}`, data),
  delete: (id: string) => apiClient.delete(`/workout/${id}`),
  getPresignedUrl: (data: { ContentType: string, originalname: string }) => 
    apiClient.patch('/workout/presigned-url', data),
};
