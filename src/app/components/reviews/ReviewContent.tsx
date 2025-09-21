'use client';

import Image from 'next/image';

interface ReviewContentProps {
  userNickname?: string;
  bookTitle?: string;
  reviewRating: number;
  reviewContent?: string;
  likeCount: number;
  commentCount: number;
  createdAt: string;
}

export default function ReviewContent({ 
  userNickname, 
  bookTitle, 
  reviewRating, 
  reviewContent, 
  likeCount, 
  commentCount, 
  createdAt 
}: ReviewContentProps) {
  // 별점 렌더링 함수
  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => {
      const starIndex = index + 1;
      
      if (starIndex <= Math.floor(rating)) {
        // 완전한 별 (노란색)
        return (
          <Image
            key={index}
            src="/icon/ic_star.png"
            alt="별점"
            width={18}
            height={18}
          />
        );
      } else if (starIndex === Math.ceil(rating) && rating % 1 >= 0.5) {
        // 반별 (노란색 반)
        return (
          <Image
            key={index}
            src="/icon/ic_star_half.png"
            alt="반별점"
            width={18}
            height={18}
          />
        );
      } else {
        // 빈 별 (회색)
        return (
          <Image
            key={index}
            src="/icon/ic_star_failled.png"
            alt="빈별점"
            width={18}
            height={18}
          />
        );
      }
    });
  };

  // 날짜 포맷팅 함수 (00.00.00 형식)
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const year = date.getFullYear().toString().slice(-2); // 뒤 2자리만
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}.${month}.${day}`;
    } catch {
      return dateString;
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* 닉네임, 도서제목, 평점 */}
      <div className="flex items-center justify-between mt-[8px] mb-[8px]">
        <div className="flex items-center gap-[6px] flex-1 min-w-0">
          <span className="text-body1 font-semibold text-gray-950 flex-shrink-0">
            {userNickname || '익명'}
          </span>
          <span 
            className="text-body2 font-medium text-gray-500 truncate"
            style={{ maxWidth: '580px' }}
          >
            {bookTitle || '제목 없음'}
          </span>
        </div>
        <div className="flex flex-shrink-0 ml-2">
          {renderStars(reviewRating || 0)}
        </div>
      </div>

      {/* 리뷰 내용 */}
      <div className="flex-1 mb-[12.75px]">
        <p 
          className="text-body2 font-medium text-gray-800 overflow-hidden"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            lineHeight: '1.4',
            maxHeight: 'calc(1.4em * 3)'
          }}
        >
          {reviewContent || '리뷰 내용이 없습니다.'}
        </p>
      </div>

      {/* 하단 정보 */}
      <div className="flex items-center justify-between">
        <div className="flex gap-[12px]">
          <div className="flex items-center text-body3 font-medium text-gray-500">
            <Image
              src="/icon/ic_heart.svg"
              alt="좋아요"
              width={16}
              height={16}
              className="mr-[2px]"
            />
            {likeCount || 0}
          </div>
          <div className="flex items-center text-body3 font-medium text-gray-500">
            <Image
              src="/icon/ic_comment.svg"
              alt="댓글"
              width={16}
              height={16}
              className="mr-[2px]"
            />
            {commentCount || 0}
          </div>
        </div>
        <div className="text-body3 font-medium text-gray-500">
          {formatDate(createdAt)}
        </div>
      </div>
    </div>
  );
}
