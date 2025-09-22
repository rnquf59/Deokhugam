"use client";

import { useAuthGuard } from "@/hooks/auth/useAuthRedirect";
import LoadingScreen from "@/components/common/LoadingScreen";
import PopularBooks from "./main/components/sections/PopularBooks";
import PopularReviews from "./main/components/sections/PopularReviews";
import UserRanking from "./main/components/sections/UserRanking";

export default function Home() {
  const { shouldShowContent } = useAuthGuard();

  if (!shouldShowContent) {
    return <LoadingScreen />;
  }
  return (
    <div className="pt-[50px] pb-[80px]">
      {/* 메인 컨테이너 */}
        <div className="flex gap-[32px]">
          {/* 인기도서 + 인기리뷰 섹션 */}
          <div className="flex-1">
            <div className="flex flex-col gap-[60px]">
              {/* 인기도서 섹션 */}
              <PopularBooks />

              {/* 구분선 */}
              <div className="border-t border-gray-100"></div>

              {/* 인기리뷰 섹션 */}
              <PopularReviews />
            </div>
          </div>

          {/* 유저 활동 순위 섹션 */}
          <div className="w-[300px]">
            <UserRanking />
          </div>
        </div>
    </div>
  );
}
