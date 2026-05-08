import apiClient from './client';

export const weeklyPlanApi = {
  getAll: (userId?: string) => apiClient.get('/weekly-plan', { params: { userId } }),
  getByDay: (day: string, userId?: string) => apiClient.get(`/weekly-plan/${day}`, { params: { userId } }),
  updateByDay: (day: string, data: any, userId?: string) => apiClient.patch(`/weekly-plan/${day}`, data, { params: { userId } }),
};
