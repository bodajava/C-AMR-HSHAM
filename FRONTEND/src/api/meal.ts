import apiClient from './client';

export const mealApi = {
  getAll: (userId?: string) => apiClient.get('/meal', { params: { userId } }),
  getById: (id: string) => apiClient.get(`/meal/${id}`),
  create: (data: any) => apiClient.post('/meal', data),
  update: (id: string, data: any) => apiClient.patch(`/meal/${id}`, data),
  delete: (id: string) => apiClient.delete(`/meal/${id}`),
  getPresignedUrl: (data: { ContentType: string, originalname: string }) => 
    apiClient.patch('/meal/presigned-url', data),
};
