import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';
import { authService } from '@/services/authService';

interface User {
  id: string;
  email: string;
  role: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  _hasHydrated: boolean; // নতুন ফ্ল্যাগ
  setHasHydrated: (state: boolean) => void;
  login: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      _hasHydrated: false, // শুরুতে ফলস

      setHasHydrated: (state) => {
        set({ _hasHydrated: state });
      },

      login: (token: string) => {
        try {
          const decoded: any = jwtDecode(token);
          set({ 
            token, 
            user: { 
              id: decoded.id, 
              email: decoded.sub, 
              role: decoded.role 
            } 
          });
          localStorage.setItem('access_token', token);
        } catch (error) {
          console.error("Token decoding failed", error);
        }
      },

      logout: () => {
        set({ token: null, user: null });
        localStorage.removeItem('access_token');
        window.location.href = '/login';
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        // মেমোরি লোড শেষ হলে ফ্ল্যাগ ট্রু করে দেবে
        state?.setHasHydrated(true);
      },
    }
  )
);