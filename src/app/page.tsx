'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import PopularBooks from '@/components/sections/PopularBooks';

export default function Home() {
  const { isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // 로딩이 완료되고 인증되지 않은 경우 로그인 페이지로 리다이렉트
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // 로딩 중이거나 인증되지 않은 경우 로딩 화면 표시
  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-body2 text-gray-500">로딩 중...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-white">
      {/* 메인 컨테이너 */}
      <div className="px-[10px] max-w-[1200px] mx-auto">
        <div className="flex gap-[32px]">
          {/* 인기도서 + 인기리뷰 섹션 */}
          <div className="flex-1">
            <div className="flex flex-col gap-[60px]">
              {/* 인기도서 섹션 */}
              <PopularBooks />

              {/* 인기리뷰 섹션 (나중에 구현) */}
              <div>
                <h2 className="text-header1 font-bold text-gray-950 mb-[10px] text-center">
                  인기리뷰
                </h2>
                <p className="text-body2 font-medium text-gray-500 text-center">
                  사용자들이 가장 많이 본 리뷰
                </p>
              </div>
            </div>
          </div>

          {/* 유저 활동 순위 섹션 (나중에 구현) */}
          <div className="w-[300px]">
            <h2 className="text-header1 font-bold text-gray-950 mb-[10px]">
              유저들의 활동 순위
            </h2>
            <p className="text-body2 font-medium text-gray-500">
              활발한 사용자들을 확인해보세요
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}