import DelayedLoader from "@/components/common/DelayedLoader";
import InfiniteScrollLoader from "@/components/common/InfiniteScrollLoader";
import ReviewCard from "@/app/(home)/components/reviews/ReviewCard";
import type { Review } from "@/types/reviews";
import clsx from "clsx";

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

      <div
        className={clsx("grid grid-cols-2 gap-[30px]", "max-md:grid-cols-1")}
      >
        {reviews.map(review => (
          <ReviewCard key={review.id} review={review} maxTitleWidth={270} />
        ))}
      </div>
    </>
  );
}
