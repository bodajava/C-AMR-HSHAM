import apiClient from './client';

export const authApi = {
  login: (data: any) => apiClient.post('/auth/login', data),
  register: (data: any) => apiClient.post('/auth/signup', data),
  confirmEmail: (data: any) => apiClient.patch('/auth/confirm-email-otp', data),
  resendOtp: (email: string) => apiClient.patch('/auth/resend-code-confirm-email', { email }),
  googleLogin: (idToken: string, FCM?: string | null) => apiClient.post('/auth/gmail', { idToken, FCM }),
};
