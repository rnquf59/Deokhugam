"use client";

import { useState, useCallback, useEffect } from "react";
import LoadingScreen from "@/components/common/LoadingScreen";
import ReviewSearchSection from "./components/ReviewSearchSection";
import ReviewCard from "@/app/(home)/components/reviews/ReviewCard";
import { getReviews } from "@/api/reviews";
import { useAuthGuard } from "@/hooks/auth/useAuthRedirect";
import { useInfiniteScroll } from "@/hooks/common/useInfiniteScroll";
import DelayedLoader from "@/components/common/DelayedLoader";
import InfiniteScrollLoader from "@/components/common/InfiniteScrollLoader";
import type { Review } from "@/types/reviews";

export default function ReviewsPage() {
  const [sortBy, setSortBy] = useState<"time" | "rating">("time");
  const [orderBy, setOrderBy] = useState<"asc" | "desc">("desc");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  const { shouldShowContent } = useAuthGuard();

  const { isLoading, setCursor, setAfter, setIsLoading, resetInfiniteScroll } =
    useInfiniteScroll<Review, Record<string, unknown>>({
      initialParams: {
        sortBy,
        orderBy,
        search: searchKeyword || undefined,
        limit: 6,
      },
      fetcher: getReviews as (params: Record<string, unknown>) => Promise<{
        content: Review[];
        nextCursor: string;
        nextAfter: string;
        hasNext: boolean;
      }>,
      setData: setReviews,
    });

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);

      try {
        const response = await getReviews({
          sortBy,
          orderBy,
          search: searchKeyword || undefined,
          limit: 6,
        });
        setReviews(response.content);
        setCursor(response.nextCursor || undefined);
        setAfter(response.nextAfter || undefined);
      } catch (err) {
        console.error("리뷰 조회 실패:", err);
      } finally {
        setIsLoading(false);
      }
    };

    resetInfiniteScroll();
    setReviews([]);
    fetchInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, orderBy, searchKeyword]);

  const handleSearch = useCallback((value: string) => {
    setSearchKeyword(value);
  }, []);

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

      <>
        <DelayedLoader isLoading={isLoading} delay={1000}>
          <InfiniteScrollLoader />
        </DelayedLoader>

        <div className="grid grid-cols-2 gap-[30px]">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} maxTitleWidth={270} />
          ))}
        </div>
      </>
    </div>
  );
}
