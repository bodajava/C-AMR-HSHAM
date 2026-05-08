import apiClient from './client';

export const userApi = {
  getProfile: () => apiClient.get('/user'),
  logout: (flag: number = 0) => apiClient.post('/user/logout', { flag }),
  getPresignedUrl: (data: { ContentType: string, originalname: string }) => 
    apiClient.patch('/user/profile-image', data),
  updateProfileImage: (key: string) => apiClient.patch('/user/profile-image', { key }),
  registerFcmToken: (token: string) => apiClient.patch('/user/fcm-token', { token }),
  deleteProfile: () => apiClient.delete('/user/delete-profile'),
  
  // Admin Client Management
  adminGetClients: () => apiClient.get('/user/clients'),
  adminGetClientById: (id: string) => apiClient.get(`/user/clients/${id}`),
  adminUpdateClient: (id: string, data: any) => apiClient.patch(`/user/clients/${id}`, data),
};
