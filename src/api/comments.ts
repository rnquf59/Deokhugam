import { apiClient } from "./client";
import type { CommentsResponse, CommentsParams } from "@/types/reviews";

export const getComments = async (
  params: CommentsParams
): Promise<CommentsResponse> => {
  const { reviewId, direction = "DESC", cursor, after, limit = 50 } = params;

  const queryParams = new URLSearchParams();

  // reviewId는 필수 파라미터
  queryParams.append("reviewId", reviewId);
  queryParams.append("direction", direction);
  queryParams.append("limit", limit.toString());

  if (cursor) {
    queryParams.append("cursor", cursor);
  }

  if (after) {
    queryParams.append("after", after);
  }

  return await apiClient.get<CommentsResponse>(
    `/api/comments?${queryParams.toString()}`
  );
};
