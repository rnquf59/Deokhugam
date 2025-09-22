import { apiClient } from "./client";

// 인기도서 목록 조회 API 타입 정의
export interface PopularBook {
  id: string;
  bookId: string;
  title: string;
  author: string;
  thumbnailUrl: string;
  period: "DAILY" | "WEEKLY" | "MONTHLY" | "ALL_TIME";
  rank: number;
  score: number;
  reviewCount: number;
  rating: number;
  createdAt: string;
  isEmpty?: boolean; // 빈 슬롯 표시용
}

export interface PopularBooksResponse {
  content: PopularBook[];
  nextCursor: string;
  nextAfter: string;
  size: number;
  totalElements: number;
  hasNext: boolean;
}

export interface PopularBooksParams {
  period?: "DAILY" | "WEEKLY" | "MONTHLY" | "ALL_TIME";
  direction?: "ASC" | "DESC";
  cursor?: string;
  after?: string;
  limit?: number;
}

export interface BooksParams extends PopularBooksParams {
  keyword?: string;
  orderBy?: string;
}

// 도서 목록 조회
export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  publisher: string;
  publishedDate: string;
  isbn: string;
  thumbnailUrl: string;
  reviewCount: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface BooksResponse {
  content: Book[];
  nextCursor: string;
  nextAfter: string;
  size: number;
  totalElements: number;
  hasNext: boolean;
}

// 인기도서 목록 조회
export const getPopularBooks = async (
  params: PopularBooksParams = {}
): Promise<PopularBooksResponse> => {
  const queryParams = new URLSearchParams();

  if (params.period) queryParams.append("period", params.period);
  if (params.direction) queryParams.append("direction", params.direction);
  if (params.cursor) queryParams.append("cursor", params.cursor);
  if (params.after) queryParams.append("after", params.after);
  if (params.limit) queryParams.append("limit", params.limit.toString());

  const response = await apiClient.get<PopularBooksResponse>(
    `/api/books/popular?${queryParams.toString()}`
  );
  return response;
};

// 도서 목록 조회
export const getBooks = async (
  params: BooksParams = {}
): Promise<BooksResponse> => {
  const queryParams = new URLSearchParams();

  if (params.orderBy) queryParams.append("orderBy", params.orderBy);
  if (params.direction) queryParams.append("direction", params.direction);
  if (params.keyword) queryParams.append("keyword", params.keyword);
  if (params.cursor) queryParams.append("cursor", params.cursor);
  if (params.after) queryParams.append("after", params.after);
  if (params.limit) queryParams.append("limit", params.limit.toString());

  const response = await apiClient.get<BooksResponse>(
    `/api/books?${queryParams.toString()}`
  );
  return response;
};
