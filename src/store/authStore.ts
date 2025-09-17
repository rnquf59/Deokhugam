import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  nickname: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, nickname: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // 초기 상태
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // 액션들
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // 실제 API 호출 대신 시뮬레이션
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // 로그인 성공 시뮬레이션
          const user: User = {
            id: '1',
            email,
            nickname: email.split('@')[0], // 이메일에서 닉네임 추출
          };
          
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: '로그인에 실패했습니다.',
          });
        }
      },

      signup: async (email: string, nickname: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // 실제 API 호출 대신 시뮬레이션
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // 회원가입 성공 시뮬레이션
          const user: User = {
            id: '1',
            email,
            nickname,
          };
          
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: '회원가입에 실패했습니다.',
          });
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
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
      name: 'auth-storage', // localStorage 키
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }), // user와 isAuthenticated만 persist
    }
  )
);
