'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import RadioButton from '@/components/ui/RadioButton';
import { getPopularBooks, type PopularBook, type PopularBooksParams } from '@/api/books';

export default function Home() {
  const [selectedFilter, setSelectedFilter] = useState('전체');
  const [popularBooks, setPopularBooks] = useState<PopularBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filterOptions = ['전체', '월간', '주간', '일간'];

  // 필터 옵션을 API 파라미터로 변환
  const getPeriodFromFilter = (filter: string): PopularBooksParams['period'] => {
    switch (filter) {
      case '일간': return 'DAILY';
      case '주간': return 'WEEKLY';
      case '월간': return 'MONTHLY';
      case '전체': return 'ALL_TIME';
      default: return 'DAILY';
    }
  };

  // 인기도서 데이터 가져오기
  const fetchPopularBooks = async (period: PopularBooksParams['period'] = 'DAILY') => {
    try {
      setLoading(true);
      setError(null);
      const response = await getPopularBooks({ 
        period, 
        direction: 'DESC',
        limit: 4 
      });
      setPopularBooks(response.content);
    } catch (err) {
      console.error('인기도서 조회 실패:', err);
      setError('인기도서를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchPopularBooks(getPeriodFromFilter(selectedFilter));
  }, []);

  // 필터 변경 시 데이터 다시 로드
  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
    fetchPopularBooks(getPeriodFromFilter(filter));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 메인 컨테이너 */}
      <div className="px-[10px] max-w-[1200px] mx-auto">
        <div className="flex gap-[32px]">
          {/* 인기도서 + 인기리뷰 섹션 */}
          <div className="flex-1">
            <div className="flex flex-col gap-[60px]">
              {/* 인기도서 섹션 */}
              <div>
                {/* 제목 부분 */}
                <div className="mb-[20px] text-center">
                  <h2 className="text-header1 font-bold text-gray-950 mb-[10px]">
                    인기도서
                  </h2>
                  <p className="text-body2 font-medium text-gray-500">
                    어떤 책이 좋을까? 지금 가장 인기 있는 도서
                  </p>
                </div>

                {/* 필터 버튼들 */}
                <div className="flex gap-[8px] mb-[30px] justify-center">
                  {filterOptions.map((option) => (
                    <RadioButton
                      key={option}
                      variant={selectedFilter === option ? 'selected' : 'unselected'}
                      onClick={() => handleFilterChange(option)}
                    >
                      {option}
                    </RadioButton>
                  ))}
                </div>

                {/* 도서 아이템들 */}
                {loading ? (
                  <div className="flex justify-center py-8">
                    <p className="text-body2 text-gray-500">로딩 중...</p>
                  </div>
                ) : error ? (
                  <div className="flex justify-center py-8">
                    <p className="text-body2 text-red-500">{error}</p>
                  </div>
                ) : (
                  <div className="flex gap-[24px] mb-[30px]">
                    {popularBooks.map((book) => (
                      <div key={book.id} className="flex-1">
                        {/* 도서 이미지 */}
                        <div 
                          className="w-[209px] h-[209px] rounded-[6px] mb-[12px]"
                          style={{
                            background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 33%, rgba(0, 0, 0, 0.25) 83.58%, rgba(0, 0, 0, 0.5) 177.5%)'
                          }}
                        >
                          <Image
                            src={book.thumbnailUrl || '/logo/logo_symbol.png'}
                            alt={book.title}
                            width={209}
                            height={209}
                            className="w-full h-full object-cover rounded-[6px]"
                          />
                        </div>

                        {/* 도서 정보 */}
                        <div className="mb-[8px]">
                          <h3 className="text-body2 font-semibold text-gray-950 mb-[6px]">
                            {book.title}
                          </h3>
                          <p className="text-body3 font-medium text-gray-500">
                            {book.author}
                          </p>
                        </div>

                        {/* 평점 */}
                        <div className="flex items-center gap-[4px]">
                          <div className="flex gap-[2px]">
                            {[...Array(5)].map((_, index) => (
                              <Image
                                key={index}
                                src="/icon/ic_star.png"
                                alt="별점"
                                width={16}
                                height={16}
                              />
                            ))}
                          </div>
                          <span className="text-body4 font-medium text-gray-500">
                            ({book.rating.toFixed(1)})
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 도서 더보기 버튼 */}
                <div className="flex justify-center">
                  <Button variant="outline">
                    도서 더보기
                    <Image
                      src="/icon/ic_chevron-right.png"
                      alt="더보기"
                      width={16}
                      height={16}
                    />
                  </Button>
                </div>
              </div>

              {/* 구분선 */}
              <div className="border-b border-gray-100"></div>

              {/* 인기리뷰 섹션 (나중에 구현) */}
              <div>
                <h2 className="text-header1 font-bold text-gray-950 mb-[10px]">
                  인기리뷰
                </h2>
                <p className="text-body2 font-medium text-gray-500">
                  사용자들이 가장 많이 본 리뷰
                </p>
              </div>
            </div>
          </div>

          {/* 유저 활동 순위 섹션 (나중에 구현) */}
          <div className="w-[300px]">
            <h2 className="text-header1 font-bold text-gray-950 mb-[10px]">
              유저들의 활동 순위
            </h2>
            <p className="text-body2 font-medium text-gray-500">
              활발한 사용자들을 확인해보세요
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
