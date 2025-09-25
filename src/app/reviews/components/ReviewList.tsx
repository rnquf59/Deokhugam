import DelayedLoader from "@/components/common/DelayedLoader";
import InfiniteScrollLoader from "@/components/common/InfiniteScrollLoader";
import ReviewCard from "@/app/(home)/components/reviews/ReviewCard";
import type { Review } from "@/types/reviews";

interface ReviewListProps {
  reviews: Review[];
  isLoading: boolean;
}

export default function ReviewList({ reviews, isLoading }: ReviewListProps) {
  return (
    <>
      <DelayedLoader isLoading={isLoading} delay={1000}>
        <InfiniteScrollLoader />
      </DelayedLoader>

      <div className="grid grid-cols-2 gap-[30px]">
        {reviews.map(review => (
          <ReviewCard key={review.id} review={review} maxTitleWidth={270} />
        ))}
      </div>
    </>
  );
}
