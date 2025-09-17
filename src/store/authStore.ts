import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  nickname: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, nickname: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // TODO: 실제 API 호출로 교체
          await new Promise(resolve => setTimeout(resolve, 1000)); // 임시 지연
          
          // 임시 사용자 데이터
          const user: User = {
            id: '1',
            email,
            nickname: email.split('@')[0],
          };
          
          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: false,
            error: null 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : '로그인에 실패했습니다.',
            isLoading: false 
          });
        }
      },

      signup: async (email: string, password: string, nickname: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // TODO: 실제 API 호출로 교체
          await new Promise(resolve => setTimeout(resolve, 1000)); // 임시 지연
          
          // 임시 사용자 데이터
          const user: User = {
            id: '1',
            email,
            nickname,
          };
          
          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: false,
            error: null 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : '회원가입에 실패했습니다.',
            isLoading: false 
          });
        }
      },

      logout: () => {
        set({ 
          user: null, 
          isAuthenticated: false, 
          error: null 
        });
      },

      clearError: () => {
        set({ error: null });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);
