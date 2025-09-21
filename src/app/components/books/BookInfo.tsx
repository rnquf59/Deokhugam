'use client';

import Image from 'next/image';

interface BookInfoProps {
  title: string;
  author?: string;
  rating: number;
  reviewCount: number;
}

export default function BookInfo({ title, author, rating, reviewCount }: BookInfoProps) {
  return (
    <>
      {/* 도서 정보 */}
      <div className="mb-[8px]">
        <h3 className="text-body2 font-semibold text-gray-950 mb-[6px] hover:text-gray-700 transition-colors line-clamp-1 overflow-hidden text-ellipsis">
          {title}
        </h3>
        <p className="text-body3 font-medium text-gray-500">
          {author || '저자 정보 없음'}
        </p>
      </div>

      {/* 평점 */}
      <div className="flex items-center gap-[4px]">
        <div className="flex">
          {[...Array(5)].map((_, index) => {
            const starIndex = index + 1;
            
            if (starIndex <= Math.floor(rating)) {
              return (
                <Image
                  key={index}
                  src="/icon/ic_star.png"
                  alt="별점"
                  width={16}
                  height={16}
                />
              );
            } else if (starIndex === Math.ceil(rating) && rating % 1 >= 0.5) {
              return (
                <Image
                  key={index}
                  src="/icon/ic_star_half.png"
                  alt="반별점"
                  width={16}
                  height={16}
                />
              );
            } else {
              return (
                <Image
                  key={index}
                  src="/icon/ic_star_failled.png"
                  alt="빈별점"
                  width={16}
                  height={16}
                />
              );
            }
          })}
        </div>
        <span className="text-body4 font-medium text-gray-500">
          ({reviewCount})
        </span>
      </div>
    </>
  );
}
