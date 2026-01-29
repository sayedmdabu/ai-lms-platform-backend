// services/authService.ts
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor - Handle errors properly
apiClient.interceptors.response.use(
  (response) => {
    // For successful responses (2xx), return the response
    return response;
  },
  (error) => {
    // For error responses (4xx, 5xx), reject with error
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const authService = {
  /**
   * Login user
   */
  login: async (email: string, password: string) => {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);
    
    const response = await apiClient.post('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  },

  /**
   * Register new user
   */
  register: async (userData: {
    email: string;
    password: string;
    full_name?: string;
    role?: string;
  }) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  /**
   * ✅ Email Verification - GET request with query parameter
   */
  verifyEmail: async (token: string) => {
    try {
      console.log('📤 Sending verification request...');
      console.log('🔗 URL:', `${API_URL}/auth/verify-email`);
      console.log('🎫 Token:', token.substring(0, 30) + '...');
      
      const response = await apiClient.get('/auth/verify-email', {
        params: { token }, // ✅ Send as query parameter
      });
      
      console.log('✅ Verification response:', response.data);
      
      // Check if backend returned success
      if (response.data.success === false) {
        throw new Error(response.data.message || 'Verification failed');
      }
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Verification error:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Forgot Password - Send reset link
   */
  forgotPassword: async (email: string) => {
    const response = await apiClient.post('/auth/forgot-password', { email });
    return response.data;
  },

  /**
   * Reset Password - Set new password
   */
  resetPassword: async (token: string, newPassword: string) => {
    const response = await apiClient.post('/auth/reset-password', {
      token,
      new_password: newPassword,
    });
    return response.data;
  },

  /**
   * Refresh Token
   */
  refreshToken: async (refreshToken: string) => {
    const response = await apiClient.post('/auth/refresh', {
      refresh_token: refreshToken,
    });
    return response.data;
  },
};