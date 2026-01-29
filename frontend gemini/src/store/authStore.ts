import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';
import { authService } from '@/services/authService';

// User Interface
interface User {
  id: string;
  email: string;
  role: string;
}

// Auth State Interface
interface AuthState {
  // State
  token: string | null;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  _hasHydrated: boolean;

  // Actions
  setHasHydrated: (state: boolean) => void;
  login: (token: string) => void;
  logout: () => void;
  
  // Auth Features
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial State
      token: null,
      user: null,
      isLoading: false,
      error: null,
      _hasHydrated: false,

      // Set hydration state
      setHasHydrated: (state) => {
        set({ _hasHydrated: state });
      },

      // Login: Decode token and save user
      login: (token: string) => {
        try {
          const decoded: any = jwtDecode(token);
          set({ 
            token, 
            user: { 
              id: decoded.id, 
              email: decoded.sub, 
              role: decoded.role 
            },
            error: null 
          });
          localStorage.setItem('access_token', token);
        } catch (error) {
          console.error("Token decoding failed", error);
          set({ error: "Invalid token received" });
        }
      },

      // Logout: Clear everything
      logout: () => {
        set({ token: null, user: null, error: null });
        localStorage.removeItem('access_token');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      },

      // Forgot Password
      forgotPassword: async (email) => {
        set({ isLoading: true, error: null });
        try {
          await authService.forgotPassword(email);
          set({ isLoading: false });
        } catch (error: any) {
          set({ 
            isLoading: false, 
            error: error.response?.data?.detail || 'Failed to send reset link' 
          });
          throw error;
        }
      },

      // Reset Password
      resetPassword: async (token, newPassword) => {
        set({ isLoading: true, error: null });
        try {
          await authService.resetPassword(token, newPassword);
          set({ isLoading: false });
        } catch (error: any) {
          set({ 
            isLoading: false, 
            error: error.response?.data?.detail || 'Failed to reset password' 
          });
          throw error;
        }
      },

      // ✅ FIXED Verify Email - Now works with GET request
      verifyEmail: async (token) => {
        set({ isLoading: true, error: null });
        try {
          console.log('🔍 [Store] Starting email verification...');
          
          const response = await authService.verifyEmail(token);
          
          console.log('✅ [Store] Verification successful:', response);
          set({ isLoading: false, error: null });
          
          // Don't throw error on success
        } catch (error: any) {
          console.error('❌ [Store] Verification failed:', error);
          
          const errorMessage = error.response?.data?.detail 
            || error.response?.data?.message 
            || error.message 
            || 'Verification failed';
          
          set({ 
            isLoading: false, 
            error: errorMessage 
          });
          
          // Re-throw so component can catch and show error state
          throw error;
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);