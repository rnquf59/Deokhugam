import { apiClient } from "./client";
import type {
  PopularReviewsResponse,
  PopularReviewsParams,
} from "@/types/reviews";

export const getPopularReviews = async (
  params: PopularReviewsParams = {},
): Promise<PopularReviewsResponse> => {
  const {
    period = "DAILY",
    direction = "ASC",
    cursor,
    after,
    limit = 3,
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
    `/api/reviews/popular?${queryParams.toString()}`,
  );
};
