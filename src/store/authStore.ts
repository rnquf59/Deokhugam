import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '@/api/auth';
import type { SignupRequest, LoginRequest, User } from '@/types/auth';

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
  redirectAfterLogin: () => void;
  redirectAfterSignup: () => void;
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
        // 로그아웃 후 로그인 페이지로 이동
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
      },

      clearError: () => {
        set({ error: null });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      redirectAfterLogin: () => {
        // 로그인 성공 시 메인 페이지로 이동 (상태 업데이트 후)
        if (typeof window !== 'undefined') {
          setTimeout(() => {
            window.location.href = '/';
          }, 100); // 100ms 지연으로 상태 업데이트 대기
        }
      },

      redirectAfterSignup: () => {
        // 회원가입 성공 시 로그인 페이지로 이동
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
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
