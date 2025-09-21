'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Button from '@/components/ui/Buttons/Button';
import SectionHeader from '../ui/SectionHeader';
import { getPopularReviews } from '@/api/reviews';
import type { PopularReview, PopularReviewsParams } from '@/types/reviews';


export default function PopularReviews() {
  const [selectedFilter, setSelectedFilter] = useState('전체');
  const [popularReviews, setPopularReviews] = useState<PopularReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


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
      
      setPopularReviews(response.content);
    } catch (err) {
      console.error('인기리뷰 조회 실패:', err);
      setError('인기리뷰를 불러오는데 실패했습니다.');
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

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => {
      const starIndex = index + 1;
      
      if (starIndex <= Math.floor(rating)) {
        return (
          <Image
            key={index}
            src="/icon/ic_star.png"
            alt="별점"
            width={18}
            height={18}
          />
        );
      } else if (starIndex === Math.ceil(rating) && rating % 1 >= 0.5) {
        return (
          <Image
            key={index}
            src="/icon/ic_star_half.png"
            alt="반별점"
            width={18}
            height={18}
          />
        );
      } else {
        return (
          <Image
            key={index}
            src="/icon/ic_star_failled.png"
            alt="빈별점"
            width={18}
            height={18}
          />
        );
      }
    });
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const year = date.getFullYear().toString().slice(-2); // 뒤 2자리만
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}.${month}.${day}`;
    } catch {
      return dateString;
    }
  };

  return (
    <div>
      {/* 섹션 헤더 */}
      <SectionHeader
        title="인기리뷰"
        description="가장 화제의 리뷰들은 뭐가 있을까?"
        selectedFilter={selectedFilter}
        onFilterChange={handleFilterChange}
      />

      {/* 리뷰 아이템들 */}
      {loading ? (
        <div className="flex justify-center py-8">
          <p className="text-body2 text-gray-500">로딩 중...</p>
        </div>
      ) : error ? (
        <div className="flex justify-center py-8">
          <p className="text-body2 text-red-500">{error}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-[30px] mb-[30px]">
          {popularReviews.map((review) => (
            <div key={review.id} className="flex-1">
              <Link href={`/reviews/${review.reviewId}`} className="block">
                <div className="py-[24px] px-[30px] rounded-[16px] bg-gray-0 border-[1.5px] border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex gap-[20px]">
                    {/* 도서 이미지 */}
                    <div className="flex-shrink-0">
                      <Image
                        src={review.bookThumbnailUrl || '/images/book/book default.png'}
                        alt={review.bookTitle || '기본 도서 이미지'}
                        width={96.5}
                        height={144.75}
                        className="w-[96.5px] h-[144.75px] object-cover rounded-[6px]"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/images/book/book default.png';
                        }}
                      />
                    </div>

                    {/* 도서 정보 */}
                    <div className="flex-1 flex flex-col">
                      {/* 닉네임, 도서제목, 평점 */}
                      <div className="flex items-center justify-between mt-[8px] mb-[8px]">
                        <div className="flex items-center gap-[6px]">
                          <span className="text-body1 font-semibold text-gray-950">
                            {review.userNickname || '익명'}
                          </span>
                          <span className="text-body2 font-medium text-gray-500">
                            {review.bookTitle || '제목 없음'}
                          </span>
                        </div>
                        <div className="flex">
                          {renderStars(review.reviewRating || 0)}
                        </div>
                      </div>

                      {/* 리뷰 내용 */}
                      <div className="flex-1 mb-[12.75px]">
                        <p className="text-body2 font-medium text-gray-800">
                          {review.reviewContent || '리뷰 내용이 없습니다.'}
                        </p>
                      </div>

                      {/* 하단 정보 */}
                      <div className="flex items-center justify-between">
                        <div className="flex gap-[12px]">
                          <div className="flex items-center text-body3 font-medium text-gray-500">
                            <Image
                              src="/icon/ic_heart.svg"
                              alt="좋아요"
                              width={16}
                              height={16}
                              className="mr-[2px]"
                            />
                            {review.likeCount || 0}
                          </div>
                          <div className="flex items-center text-body3 font-medium text-gray-500">
                            <Image
                              src="/icon/ic_comment.svg"
                              alt="댓글"
                              width={16}
                              height={16}
                              className="mr-[2px]"
                            />
                            {review.commentCount || 0}
                          </div>
                        </div>
                        <div className="text-body3 font-medium text-gray-500">
                          {formatDate(review.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* 리뷰 더보기 버튼 */}
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
