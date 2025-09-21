'use client';

import Link from 'next/link';
import ReviewImage from './ReviewImage';
import ReviewContent from './ReviewContent';
import type { PopularReview } from '@/types/reviews';

interface ReviewCardProps {
  review: PopularReview;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="flex-1">
      <Link href={`/reviews/${review.reviewId}`} className="block">
        <div className="py-[24px] px-[30px] rounded-[16px] bg-gray-0 border-[1.5px] border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
          <div className="flex gap-[20px]">
            <ReviewImage 
              bookThumbnailUrl={review.bookThumbnailUrl}
              bookTitle={review.bookTitle}
            />
            <ReviewContent 
              userNickname={review.userNickname}
              bookTitle={review.bookTitle}
              reviewRating={review.reviewRating}
              reviewContent={review.reviewContent}
              likeCount={review.likeCount}
              commentCount={review.commentCount}
              createdAt={review.createdAt}
            />
          </div>
        </div>
      </Link>
    </div>
  );
}
