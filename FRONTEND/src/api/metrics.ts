import apiClient from './client';

export const metricsApi = {
  getMetrics: (userId?: string) => apiClient.get('/metrics', { params: { userId } }),
  updateMetrics: (data: any, userId?: string) => apiClient.patch('/metrics', data, { params: { userId } }),
};
