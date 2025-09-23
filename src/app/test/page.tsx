'use client';

import EmptyState from '../(home)/components/ui/EmptyState';
import UserRanking from '../(home)/components/sections/UserRanking';

export default function TestPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="flex gap-[32px]">
        <div className="flex-1">
          <div className="flex flex-col gap-[60px]">
            <EmptyState
              title="인기 도서"
              description="아직 등록된 도서가 없습니다."
              iconSrc="images/icon/ic_book2.svg"
              iconAlt="도서 아이콘"
            />

            <div className="border-t border-gray-100"></div>

            <EmptyState
              title="인기 리뷰"
              description="아직 등록된 리뷰가 없습니다."
              iconSrc="images/icon/ic_comment-filled.svg"
              iconAlt="리뷰 아이콘"
            />
          </div>
        </div>

          <div className="mb-[40px]">
            <UserRanking period="MONTHLY" />
          </div>

          
        </div>
      </div>
 
    );
  }
