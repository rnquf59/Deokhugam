'use client';

import EmptyState from '../components/ui/EmptyState';

export default function TestPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* 메인 컨테이너 */}
      <div className="flex gap-[32px]">
        {/* 인기도서 + 인기리뷰 섹션 */}
        <div className="flex-1">
          <div className="flex flex-col gap-[60px]">
            {/* 인기도서 섹션 */}
            <EmptyState
              title="인기 도서"
              description="아직 등록된 도서가 없습니다."
              iconSrc="/icon/ic_book2.svg"
              iconAlt="도서 아이콘"
            />

            {/* 구분선 */}
            <div className="border-t border-gray-100"></div>

            {/* 인기리뷰 섹션 */}
            <EmptyState
              title="인기 리뷰"
              description="아직 등록된 리뷰가 없습니다."
              iconSrc="/icon/ic_comment-filled.svg"
              iconAlt="리뷰 아이콘"
            />
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
  );
}
