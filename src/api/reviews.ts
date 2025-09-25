import { apiClient } from "./client";
import { useAuthStore } from "@/store/authStore";
import type {
  PopularReviewsResponse,
  PopularReviewsParams,
  ReviewsResponse,
  ReviewsParams
} from "@/types/reviews";

export const getPopularReviews = async (
  params: PopularReviewsParams = {}
): Promise<PopularReviewsResponse> => {
  const {
    period = "DAILY",
    direction = "ASC",
    cursor,
    after,
    limit = 3
  } = params;

  const queryParams = new URLSearchParams();

  queryParams.append("period", period);
  queryParams.append("direction", direction);
  queryParams.append("limit", limit.toString());

  if (cursor) {
    queryParams.append("cursor", cursor);
  }

  if (after) {
    queryParams.append("after", after);
  }

  return await apiClient.get<PopularReviewsResponse>(
    `/api/reviews/popular?${queryParams.toString()}`
  );
};

export const getReviews = async (
  params: ReviewsParams = {}
): Promise<ReviewsResponse> => {
  const {
    sortBy = "time",
    orderBy = "desc",
    cursor,
    after,
    limit = 10,
    search
  } = params;

  const queryParams = new URLSearchParams();

  // 스웨거 스펙에 맞게 파라미터 설정
  queryParams.append("orderBy", sortBy === "time" ? "createdAt" : "rating");
  queryParams.append("direction", orderBy === "desc" ? "DESC" : "ASC");
  queryParams.append("limit", limit.toString());

  if (cursor) {
    queryParams.append("cursor", cursor);
  }

  if (after) {
    queryParams.append("after", after);
  }

  if (search) {
    queryParams.append("keyword", search);
  }

  // requestUserId는 query parameter로도 필요 (스웨거에서 필수로 표시됨)
  if (typeof window !== "undefined") {
    const authState = useAuthStore.getState();
    if (authState.user?.id) {
      queryParams.append("requestUserId", authState.user.id);
    }
  }

  return await apiClient.get<ReviewsResponse>(
    `/api/reviews?${queryParams.toString()}`
  );
};
