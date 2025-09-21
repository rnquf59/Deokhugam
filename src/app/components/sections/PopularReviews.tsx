'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Buttons/Button';
import SectionHeader from '../ui/SectionHeader';
import EmptyState from '../ui/EmptyState';
import ReviewCard from '../reviews/ReviewCard';
import { getPopularReviews } from '@/api/reviews';
import type { PopularReview, PopularReviewsParams } from '@/types/reviews';
import Image from 'next/image';


export default function PopularReviews() {
  const [selectedFilter, setSelectedFilter] = useState('전체');
  const [popularReviews, setPopularReviews] = useState<PopularReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasData, setHasData] = useState(false);


  const getPeriodFromFilter = (filter: string): PopularReviewsParams['period'] => {
    switch (filter) {
      case '일간': return 'DAILY';
      case '주간': return 'WEEKLY';
      case '월간': return 'MONTHLY';
      case '전체': return 'ALL_TIME';
      default: return 'DAILY';
    }
  };

  const fetchPopularReviews = async (period: PopularReviewsParams['period'] = 'DAILY') => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getPopularReviews({ 
        period, 
        direction: 'DESC',
        limit: 3 
      });
      
      const reviews = response.content;
      
      if (period === 'ALL_TIME' && reviews.length === 0) {
        setHasData(false);
        setPopularReviews([]);
      } else {
        setHasData(true);
        const emptySlots = Array.from({ length: Math.max(0, 3 - reviews.length) }, (_, index) => ({
          id: `empty-${index}`,
          reviewId: '',
          bookId: '',
          bookTitle: '',
          bookThumbnailUrl: '',
          userId: '',
          userNickname: '',
          reviewContent: '',
          reviewRating: 0,
          period: 'DAILY' as const,
          createdAt: '',
          rank: 0,
          score: 0,
          likeCount: 0,
          commentCount: 0,
          isEmpty: true
        }));
        
        setPopularReviews([...reviews, ...emptySlots]);
      }
    } catch (err) {
      console.error('인기리뷰 조회 실패:', err);
      setError('인기리뷰를 불러오는데 실패했습니다.');
      setHasData(false);
      setPopularReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPopularReviews(getPeriodFromFilter(selectedFilter));
  }, []);

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
    fetchPopularReviews(getPeriodFromFilter(filter));
  };


  return (
    <div>
      <SectionHeader
        title="인기 리뷰"
        description="가장 화제의 리뷰들은 뭐가 있을까?"
        selectedFilter={selectedFilter}
        onFilterChange={handleFilterChange}
      />

      {loading ? (
        <div className="flex justify-center py-8">
          <p className="text-body2 text-gray-500">로딩 중...</p>
        </div>
      ) : error ? (
        <div className="flex justify-center py-8">
          <p className="text-body2 text-red-500">{error}</p>
        </div>
      ) : !hasData ? (
        <EmptyState
          title="인기 리뷰"
          description="아직 등록된 리뷰가 없습니다."
          iconSrc="/icon/ic_comment-filled.svg"
          iconAlt="리뷰 아이콘"
        />
      ) : (
        <div className="flex flex-col gap-[30px] mb-[30px]">
          {popularReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}

      <div className="flex justify-center">
        <Link href="/reviews">
          <Button variant="outline">
            리뷰 더보기
            <Image
              src="/icon/ic_chevron-right.png"
              alt="더보기"
              width={16}
              height={16}
            />
          </Button>
        </Link>
      </div>
    </div>
  );
}
