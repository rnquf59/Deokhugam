import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import type { User } from '@/types/auth';

export const useAuthRedirect = (redirectPath: string = '/auth/login'): {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
} => {
  const { user, isLoading, isInitialized } = useAuthStore(); // isInitialized 추가
  const router = useRouter();

  useEffect(() => {
    // 초기화가 완료되고 로그인되지 않은 경우에만 리다이렉트
    if (isInitialized && !isLoading && !user?.id) {
      router.push(redirectPath);
    }
  }, [user?.id, isLoading, isInitialized, router, redirectPath]); // isInitialized 의존성 추가

  return {
    user,
    isLoading: !isInitialized || isLoading, // 초기화되지 않았거나 로딩 중이면 로딩 상태
    isAuthenticated: !!user?.id,
  };
};

export const useAuthGuard = (redirectPath: string = '/auth/login'): {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  shouldShowContent: boolean;
} => {
  const { user, isLoading, isAuthenticated } = useAuthRedirect(redirectPath);

  return {
    user,
    isLoading,
    isAuthenticated,
    shouldShowContent: !isLoading && isAuthenticated,
  };
};