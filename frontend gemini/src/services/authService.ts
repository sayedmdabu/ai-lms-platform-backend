import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';
import { authService } from '@/services/authService';

// User Interface based on your token structure
interface User {
  id: string;
  email: string;
  role: string;
}

// Auth State Interface
interface AuthState {
  // State variables
  token: string | null;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  _hasHydrated: boolean; // Flag to check if state has been hydrated from local storage

  // Actions
  setHasHydrated: (state: boolean) => void;
  login: (token: string) => void;
  logout: () => void;
  
  // New Auth Actions
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

      // --- Actions ---

      // Set hydration state (used to prevent hydration mismatch in Next.js)
      setHasHydrated: (state) => {
        set({ _hasHydrated: state });
      },

      // Login Action: Decodes token and saves user data
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
          // Also explicitly set to localStorage if needed by other libs (optional since persist handles it)
          localStorage.setItem('access_token', token);
        } catch (error) {
          console.error("Token decoding failed", error);
          set({ error: "Invalid token received" });
        }
      },

      // Logout Action: Clears state and local storage
      logout: () => {
        set({ token: null, user: null, error: null });
        localStorage.removeItem('access_token');
        // Redirect to login page
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      },

      // --- New Auth Features ---

      // 1. Forgot Password Action
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
          throw error; // Re-throw to handle UI feedback (toast) in the component
        }
      },

      // 2. Reset Password Action
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

      // 3. Verify Email Action
      verifyEmail: async (token) => {
        set({ isLoading: true, error: null });
        try {
          await authService.verifyEmail(token);
          set({ isLoading: false });
        } catch (error: any) {
          set({ 
            isLoading: false, 
            error: error.response?.data?.detail || 'Verification failed' 
          });
          throw error;
        }
      },
    }),
    {
      name: 'auth-storage', // Key name in localStorage
      storage: createJSONStorage(() => localStorage), // Use localStorage
      onRehydrateStorage: () => (state) => {
        // Callback when hydration finishes
        state?.setHasHydrated(true);
      },
    }
  )
);