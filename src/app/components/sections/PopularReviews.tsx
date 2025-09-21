'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Button from '@/components/ui/Buttons/Button';
import SectionHeader from '../ui/SectionHeader';

// 임시 타입 정의 (API 연동 시 수정 필요)
interface PopularReview {
  id: string;
  bookId: string;
  bookTitle: string;
  bookThumbnailUrl: string;
  nickname: string;
  content: string;
  rating: number;
  createdAt: string;
  period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ALL_TIME';
  rank: number;
  isEmpty?: boolean;
}

// 임시 데이터 (API 연동 시 제거)
const mockReviews: PopularReview[] = [
  {
    id: '1',
    bookId: 'book1',
    bookTitle: '해리포터와 마법사의 돌',
    bookThumbnailUrl: '/images/book/book default.png',
    nickname: '마법사123',
    content: '정말 재미있는 책이었어요! 마법의 세계에 빠져들었습니다. 해리포터의 모험을 따라가면서 정말 신나고 즐거웠어요.',
    rating: 4.5,
    createdAt: '2024.09.20',
    period: 'DAILY',
    rank: 1
  },
  {
    id: '2',
    bookId: 'book2',
    bookTitle: '1984',
    bookThumbnailUrl: '/images/book/book default.png',
    nickname: '독서왕',
    content: '조지 오웰의 걸작! 현실과 너무 닮아서 무서웠습니다. 독재와 감시사회에 대한 경고가 담긴 소설이에요.',
    rating: 5.0,
    createdAt: '2024.09.19',
    period: 'DAILY',
    rank: 2
  },
  {
    id: '3',
    bookId: 'book3',
    bookTitle: '어린왕자',
    bookThumbnailUrl: '/images/book/book default.png',
    nickname: '별빛',
    content: '어른이 되어서 다시 읽어보니 더욱 감동적이었어요. 순수함과 진실에 대한 이야기가 마음에 와닿았습니다.',
    rating: 4.8,
    createdAt: '2024.09.18',
    period: 'DAILY',
    rank: 3
  }
];

export default function PopularReviews() {
  const [selectedFilter, setSelectedFilter] = useState('전체');
  const [popularReviews, setPopularReviews] = useState<PopularReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  // 필터 옵션을 API 파라미터로 변환
  const getPeriodFromFilter = (filter: string): PopularReview['period'] => {
    switch (filter) {
      case '일간': return 'DAILY';
      case '주간': return 'WEEKLY';
      case '월간': return 'MONTHLY';
      case '전체': return 'ALL_TIME';
      default: return 'DAILY';
    }
  };

  // 인기리뷰 데이터 가져오기 (임시)
  const fetchPopularReviews = async (period: PopularReview['period'] = 'DAILY') => {
    try {
      setLoading(true);
      setError(null);
      
      // 임시 데이터 사용 (API 연동 시 수정)
      await new Promise(resolve => setTimeout(resolve, 500)); // 로딩 시뮬레이션
      setPopularReviews(mockReviews);
    } catch (err) {
      console.error('인기리뷰 조회 실패:', err);
      setError('인기리뷰를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchPopularReviews(getPeriodFromFilter(selectedFilter));
  }, []);

  // 필터 변경 시 데이터 다시 로드
  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
    fetchPopularReviews(getPeriodFromFilter(filter));
  };

  // 별점 렌더링 함수
  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => {
      const starIndex = index + 1;
      
      if (starIndex <= Math.floor(rating)) {
        // 완전한 별 (노란색)
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
        // 반별 (노란색 반)
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
        // 빈 별 (회색)
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
              {!review.isEmpty ? (
                <div className="py-[24px] px-[30px] rounded-[16px] bg-gray-0 border-[1.5px] border-gray-200">
                  <div className="flex gap-[20px]">
                    {/* 도서 이미지 */}
                    <div className="flex-shrink-0">
                      <Link href={`/books/${review.bookId}`}>
                        <Image
                          src={review.bookThumbnailUrl || '/images/book/book default.png'}
                          alt={review.bookTitle || '기본 도서 이미지'}
                          width={96.5}
                          height={144.75}
                          className="w-[96.5px] h-[144.75px] object-cover rounded-[6px] cursor-pointer hover:opacity-90 transition-opacity"
                        />
                      </Link>
                    </div>

                    {/* 도서 정보 */}
                    <div className="flex-1 flex flex-col">
                      {/* 닉네임, 도서제목, 평점 */}
                      <div className="flex items-center justify-between mt-[8px] mb-[8px]">
                        <div className="flex items-center gap-[6px]">
                          <span className="text-body1 font-semibold text-gray-950">
                            {review.nickname}
                          </span>
                          <span className="text-body2 font-medium text-gray-500">
                            {review.bookTitle}
                          </span>
                        </div>
                        <div className="flex">
                          {renderStars(review.rating)}
                        </div>
                      </div>

                      {/* 리뷰 내용 */}
                      <div className="flex-1 mb-[12.75px]">
                        <p className="text-body2 font-medium text-gray-800">
                          {review.content}
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
                            좋아요
                          </div>
                          <div className="flex items-center text-body3 font-medium text-gray-500">
                            <Image
                              src="/icon/ic_comment.svg"
                              alt="댓글"
                              width={16}
                              height={16}
                              className="mr-[2px]"
                            />
                            댓글
                          </div>
                        </div>
                        <div className="text-body3 font-medium text-gray-500">
                          {review.createdAt}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // 빈 슬롯 (필요시)
                <div className="py-[24px] px-[30px] rounded-[16px] bg-gray-50 border-[1.5px] border-gray-200">
                  <div className="flex items-center justify-center h-[120px]">
                    <p className="text-body2 text-gray-400">리뷰가 없습니다</p>
                  </div>
                </div>
              )}
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
