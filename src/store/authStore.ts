import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi, type SignupRequest, type LoginRequest } from '@/api/auth';

export interface User {
  id: string;
  email: string;
  nickname: string;
  createdAt: string;
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
                const loginData: LoginRequest = { email, password };
                const response = await authApi.login(loginData);

                set({
                  user: response,
                  isAuthenticated: true,
                  isLoading: false,
                  error: null,
                });
              } catch (error) {
                set({
                  user: null,
                  isAuthenticated: false,
                  isLoading: false,
                  error: error instanceof Error ? error.message : '로그인에 실패했습니다.',
                });
              }
            },

            signup: async (email: string, nickname: string, password: string) => {
              set({ isLoading: true, error: null });

              try {
                const signupData: SignupRequest = { email, nickname, password };
                const response = await authApi.signup(signupData);

                set({
                  user: response,
                  isAuthenticated: true,
                  isLoading: false,
                  error: null,
                });
              } catch (error) {
                set({
                  user: null,
                  isAuthenticated: false,
                  isLoading: false,
                  error: error instanceof Error ? error.message : '회원가입에 실패했습니다.',
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
