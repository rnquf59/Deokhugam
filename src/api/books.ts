import { apiClient } from "./client";

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
  isEmpty?: boolean;
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
  [key: string]: unknown;
}

// 인기도서 목록 조회
export const getPopularBooks = async (
  params: PopularBooksParams = {}
): Promise<PopularBooksResponse> => {
  const {
    period = "DAILY",
    direction = "ASC",
    cursor,
    after,
    limit = 4,
  } = params;

  const queryParams = new URLSearchParams();

  queryParams.append("period", period);
  queryParams.append("direction", direction);
  queryParams.append("limit", limit.toString());

  if (cursor) queryParams.append("cursor", cursor);
  if (after) queryParams.append("after", after);

  const response = await apiClient.get<PopularBooksResponse>(
    `/api/books/popular?${queryParams.toString()}`
  );
  return response;
};

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

export interface AddBookResponse {
  id: string;
  title: string;
  author: string;
  description: string;
  publisher: string;
  publisheddate: string;
  isbn: string;
  thumbnailUrl: string;
  reviewCount: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

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

// 이미지 기반 ISBN 인식
export const getOcr = async (formData: FormData) => {
  const response = await apiClient.post<string>(
    `/api/books/isbn/ocr`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return response;
};

// 도서 등록
export const postBook = async (formData: FormData) => {
  const response = await apiClient.post<AddBookResponse>(
    "/api/books",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );

  return response;
};
