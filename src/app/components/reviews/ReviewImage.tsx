'use client';

import Image from 'next/image';

interface ReviewImageProps {
  bookThumbnailUrl?: string;
  bookTitle?: string;
}

export default function ReviewImage({ bookThumbnailUrl, bookTitle }: ReviewImageProps) {
  return (
    <div className="flex-shrink-0">
      <Image
        src={bookThumbnailUrl || '/images/book/book default.png'}
        alt={bookTitle || '기본 도서 이미지'}
        width={96.5}
        height={144.75}
        className="w-[96.5px] h-[144.75px] object-cover rounded-[6px]"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = '/images/book/book default.png';
        }}
      />
    </div>
  );
}
