// 인기리뷰 관련 타입 정의

export interface PopularReview {
  id: string;
  reviewId: string;
  bookId: string;
  bookTitle: string;
  bookThumbnailUrl: string;
  userId: string;
  userNickname: string;
  reviewContent: string;
  reviewRating: number;
  period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ALL_TIME';
  createdAt: string;
  rank: number;
  score: number;
  likeCount: number;
  commentCount: number;
  isEmpty?: boolean;
}

export interface PopularReviewsResponse {
  content: PopularReview[];
  nextCursor: string | null;
  nextAfter: string | null;
  size: number;
  totalElements: number;
  hasNext: boolean;
}

export interface PopularReviewsParams {
  period?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ALL_TIME';
  direction?: 'ASC' | 'DESC';
  cursor?: string;
  after?: string;
  limit?: number;
}
