import { apiClient } from './client';

export interface PopularBook {
  id: string;
  bookId: string;
  title: string;
  author: string;
  thumbnailUrl: string;
  period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ALL_TIME';
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
  period?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ALL_TIME';
  direction?: 'ASC' | 'DESC';
  cursor?: string;
  after?: string;
  limit?: number;
}

export const getPopularBooks = async (params: PopularBooksParams = {}): Promise<PopularBooksResponse> => {
  const {
    period = 'DAILY',
    direction = 'ASC',
    cursor,
    after,
    limit = 4
  } = params;

  const queryParams = new URLSearchParams();
  
  queryParams.append('period', period);
  queryParams.append('direction', direction);
  queryParams.append('limit', limit.toString());
  
  if (cursor) queryParams.append('cursor', cursor);
  if (after) queryParams.append('after', after);

  const response = await apiClient.get<PopularBooksResponse>(`/api/books/popular?${queryParams.toString()}`);
  return response;
};
