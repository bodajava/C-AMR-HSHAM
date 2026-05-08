import apiClient from './client';

export const subscriptionApi = {
  getPlans: () => apiClient.get('/subscription/plans'),
  createCheckout: (planId: string) => apiClient.post('/subscription/checkout', { planId }),
  getStatus: () => apiClient.get('/subscription/status'),
  
  // Admin Plan Management
  adminGetPlans: () => apiClient.get('/subscription/admin/plans'),
  adminCreatePlan: (data: any) => apiClient.post('/subscription/admin/plans', data),
  adminUpdatePlan: (id: string, data: any) => apiClient.patch(`/subscription/admin/plans/${id}`, data),
  adminDeletePlan: (id: string) => apiClient.delete(`/subscription/admin/plans/${id}`),
};
