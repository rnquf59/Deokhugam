"use client";

import { useState, useCallback, useEffect } from "react";
import ReviewCard from "../(home)/components/reviews/ReviewCard";
import Selectbox from "@/components/ui/Selectbox";
import SearchBar from "@/components/ui/SearchBar";
import { getReviews } from "@/api/reviews";
import { useAuthStore } from "@/store/authStore";
import type { Review, ReviewsParams } from "@/types/reviews";

export default function ReviewsPage() {
  const { user, isAuthenticated } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"time" | "rating">("time");
  const [orderBy, setOrderBy] = useState<"asc" | "desc">("desc");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // API 호출 함수
  const fetchReviews = useCallback(
    async (params: ReviewsParams = {}) => {
      try {
        setLoading(true);
        setError(null);
        const response = await getReviews({
          sortBy,
          orderBy,
          search: searchQuery || undefined,
          ...params,
        });
        setReviews(response.content);
      } catch (err) {
        setError("리뷰를 불러오는데 실패했습니다.");
        console.error("리뷰 조회 오류:", err);
      } finally {
        setLoading(false);
      }
    },
    [sortBy, orderBy, searchQuery]
  );

  // 초기 데이터 로드
  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // 검색 핸들러 메모이제이션
  const handleSearch = useCallback(
    (value: string) => {
      setSearchQuery(value);
      fetchReviews({ search: value });
    },
    [fetchReviews]
  );

  // 지우기 핸들러 메모이제이션
  const handleClear = useCallback(() => {
    setSearchQuery("");
    fetchReviews({ search: undefined });
  }, [fetchReviews]);

  // 정렬 핸들러들 메모이제이션
  const handleSortByChange = useCallback((newSortBy: "time" | "rating") => {
    setSortBy(newSortBy);
  }, []);

  const handleOrderByChange = useCallback((newOrderBy: "asc" | "desc") => {
    setOrderBy(newOrderBy);
  }, []);

  // 로그인하지 않은 사용자 안내
  if (!isAuthenticated) {
    return (
      <div className="pt-[50px] pb-[80px]">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="text-gray-500 mb-4">
              리뷰를 보려면 로그인이 필요합니다.
            </div>
            <a
              href="/auth/login"
              className="text-blue-500 hover:text-blue-700 underline"
            >
              로그인하기
            </a>
          </div>
        </div>
      </div>
    );
  }

  // 로딩 및 에러 상태 표시
  if (loading) {
    return (
      <div className="pt-[50px] pb-[80px]">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">리뷰를 불러오는 중...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-[50px] pb-[80px]">
        <div className="flex justify-center items-center h-64">
          <div className="text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-[50px] pb-[80px]">
      {/* 페이지 제목 */}
      <div className="flex mb-5 text-header1 font-bold text-[#111827]">
        리뷰 리스트
      </div>

      {/* 검색 및 필터 섹션 */}
      <div className="flex justify-between items-center mb-[30px]">
        {/* 검색 입력 */}
        <div>
          <SearchBar
            placeholder="내가 찾는 책 이름을 검색해보세요"
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={handleSearch}
            onClear={handleClear}
          />
        </div>

        {/* 정렬 옵션 */}
        <div className="flex gap-2">
          <Selectbox
            options={[
              { value: "time", label: "시간순" },
              { value: "rating", label: "평점순" },
            ]}
            value={sortBy}
            onChange={handleSortByChange}
          />
          <Selectbox
            options={[
              { value: "desc", label: "내림차순" },
              { value: "asc", label: "오름차순" },
            ]}
            value={orderBy}
            onChange={handleOrderByChange}
          />
        </div>
      </div>

      {/* 리뷰 목록 그리드 */}
      <div className="grid grid-cols-2 gap-[30px]">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} maxTitleWidth={270} />
        ))}
      </div>
    </div>
  );
}
