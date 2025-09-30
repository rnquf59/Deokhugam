import DelayedLoader from "@/components/common/DelayedLoader";
import InfiniteScrollLoader from "@/components/common/InfiniteScrollLoader";
import ReviewCard from "@/app/(home)/components/reviews/ReviewCard";
import type { Review } from "@/types/reviews";
import { useState, useEffect } from "react";

interface ReviewListProps {
  reviews: Review[];
  isLoading: boolean;
}

export default function ReviewList({ reviews, isLoading }: ReviewListProps) {
  const [reviewsData, setReviewsData] = useState(reviews);

  useEffect(() => {
    setReviewsData(reviews);
  }, [reviews]);

  const handleLikeChange = (
    reviewId: string,
    newLikeCount: number,
    likedByMe: boolean
  ) => {
    setReviewsData(prevReviews =>
      prevReviews.map(review =>
        review.id === reviewId
          ? { ...review, likeCount: newLikeCount, likedByMe }
          : review
      )
    );
  };

  return (
    <>
      <DelayedLoader isLoading={isLoading} delay={1000}>
        <InfiniteScrollLoader />
      </DelayedLoader>

      <div className="grid grid-cols-2 gap-[30px]">
        {reviewsData.map(review => (
          <ReviewCard
            key={review.id}
            review={review}
            maxTitleWidth={270}
            onLikeChange={handleLikeChange}
          />
        ))}
      </div>
    </>
  );
}
