import axios from 'axios';
import { useAuthStore } from '@/store/auth-store';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://c-amr-hsham-qkn9.vercel.app';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Token
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor: Handle Token Refresh & Errors
apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    // Handle Unauthorized (401) - Attempt Token Refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = useAuthStore.getState().refreshToken;

      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/user/refresh-token`, {}, {
            headers: { Authorization: `Bearer ${refreshToken}` }
          });
          
          const { accessToken, refreshToken: newRefreshToken } = response.data.data;
          
          useAuthStore.getState().setAuth(
            useAuthStore.getState().user!,
            accessToken,
            newRefreshToken
          );

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          useAuthStore.getState().logout();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      } else {
        useAuthStore.getState().logout();
        window.location.href = '/login';
      }
    }

    return Promise.reject(error.response?.data || error.message);
  }
);

export default apiClient;

// Auth APIs
export const authApi = {
  login: (data: any) => apiClient.post('/auth/login', data),
  register: (data: any) => apiClient.post('/auth/signup', data),
  confirmEmail: (data: any) => apiClient.patch('/auth/confirm-email-otp', data),
  resendOtp: (email: string) => apiClient.patch('/auth/resend-code-confirm-email', { email }),
  googleLogin: (idToken: string, FCM?: string | null) => apiClient.post('/auth/gmail', { idToken, FCM }),
};

// User APIs
export const userApi = {
  getProfile: () => apiClient.get('/user'),
  logout: (flag: number = 0) => apiClient.post('/user/logout', { flag }),
  getPresignedUrl: (data: { ContentType: string, originalname: string }) => 
    apiClient.patch('/user/profile-image', data),
  updateProfileImage: (key: string) => apiClient.patch('/user/profile-image', { key }),
  registerFcmToken: (token: string) => apiClient.patch('/user/fcm-token', { token }),
  deleteProfile: () => apiClient.delete('/user/delete-profile'),
};

// Subscription APIs
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

// Workout APIs
export const workoutApi = {
  getAll: () => apiClient.get('/workout'),
  getById: (id: string) => apiClient.get(`/workout/${id}`),
  create: (data: any) => apiClient.post('/workout', data),
  update: (id: string, data: any) => apiClient.patch(`/workout/${id}`, data),
  delete: (id: string) => apiClient.delete(`/workout/${id}`),
};

// Meal APIs
export const mealApi = {
  getAll: () => apiClient.get('/meal'),
  getById: (id: string) => apiClient.get(`/meal/${id}`),
  create: (data: any) => apiClient.post('/meal', data),
  update: (id: string, data: any) => apiClient.patch(`/meal/${id}`, data),
  delete: (id: string) => apiClient.delete(`/meal/${id}`),
  getPresignedUrl: (data: { ContentType: string, originalname: string }) => 
    apiClient.patch('/meal/presigned-url', data),
};
// Metrics APIs
export const metricsApi = {
  getMetrics: () => apiClient.get('/metrics'),
  updateMetrics: (data: any) => apiClient.patch('/metrics', data),
};
