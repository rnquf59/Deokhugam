"use client";

import { useState, useCallback, useEffect } from "react";
import LoadingScreen from "@/components/common/LoadingScreen";
import ReviewSearchSection from "./components/ReviewSearchSection";
import ReviewCard from "@/app/(home)/components/reviews/ReviewCard";
import { getReviews } from "@/api/reviews";
import { useAuthGuard } from "@/hooks/auth/useAuthRedirect";
import type { Review, ReviewsParams } from "@/types/reviews";

export default function ReviewsPage() {
  const [sortBy, setSortBy] = useState<"time" | "rating">("time");
  const [orderBy, setOrderBy] = useState<"asc" | "desc">("desc");
  const [reviews, setReviews] = useState<Review[]>([]);

  const { shouldShowContent } = useAuthGuard();

  const fetchReviews = useCallback(
    async (params: ReviewsParams = {}) => {
      try {
        const response = await getReviews({
          sortBy,
          orderBy,
          ...params,
        });
        setReviews(response.content);
      } catch (err) {
        console.error("리뷰 조회 실패:", err);
      }
    },
    [sortBy, orderBy]
  );

  useEffect(() => {
    fetchReviews();
  }, [sortBy, orderBy, fetchReviews]);

  const handleSearch = useCallback(
    (value: string) => {
      fetchReviews({ search: value || undefined });
    },
    [fetchReviews]
  );

  const handleSortByChange = useCallback((newSortBy: "time" | "rating") => {
    setSortBy(newSortBy);
  }, []);

  const handleOrderByChange = useCallback((newOrderBy: "asc" | "desc") => {
    setOrderBy(newOrderBy);
  }, []);

  if (!shouldShowContent) {
    return <LoadingScreen />;
  }

  return (
    <div className="pt-[50px] pb-[80px]">
      <div className="flex mb-5 text-header1 font-bold text-[#111827]">
        리뷰 리스트
      </div>

      <ReviewSearchSection
        sortBy={sortBy}
        orderBy={orderBy}
        onSearch={handleSearch}
        onSortByChange={handleSortByChange}
        onOrderByChange={handleOrderByChange}
      />

      <div className="grid grid-cols-2 gap-[30px]">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} maxTitleWidth={270} />
        ))}
      </div>
    </div>
  );
}
