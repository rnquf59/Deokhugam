'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Button from '@/components/ui/Buttons/Button';
import RadioButton from '@/components/ui/Buttons/RadioButton';
import { getPopularBooks, type PopularBook, type PopularBooksParams } from '@/api/books';

export default function PopularBooks() {
  const [selectedFilter, setSelectedFilter] = useState('전체');
  const [popularBooks, setPopularBooks] = useState<PopularBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filterOptions = ['전체', '월간', '주간', '일간'];

  const getPeriodFromFilter = (filter: string): PopularBooksParams['period'] => {
    switch (filter) {
      case '일간': return 'DAILY';
      case '주간': return 'WEEKLY';
      case '월간': return 'MONTHLY';
      case '전체': return 'ALL_TIME';
      default: return 'DAILY';
    }
  };

  const fetchPopularBooks = async (period: PopularBooksParams['period'] = 'DAILY') => {
    try {
      setLoading(true);
      setError(null);
      const response = await getPopularBooks({ 
        period, 
        direction: 'ASC',
        limit: 4 
      });
      
      const books = response.content;
      
      // rank 기준으로 정렬 (낮은 순위가 더 높은 인기)
      books.sort((a, b) => a.rank - b.rank);
      const emptySlots = Array.from({ length: Math.max(0, 4 - books.length) }, (_, index) => ({
        id: `empty-${index}`,
        bookId: '',
        title: ''     ,
        author: '',
        thumbnailUrl: '',
        period: 'DAILY' as const,
        rank: 0,
        score: 0,
        reviewCount: 0,
        rating: 0,
        createdAt: '',
        isEmpty: true
      }));
      
      setPopularBooks([...books, ...emptySlots]);
    } catch (err) {
      console.error('인기도서 조회 실패:', err);
      setError('인기도서를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPopularBooks(getPeriodFromFilter(selectedFilter));
  }, []);

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
    fetchPopularBooks(getPeriodFromFilter(filter));
  };

  return (
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
              {!book.isEmpty ? (
                <Link href={`/books/${book.bookId}`} className="block">
                   {/* 도서 이미지 */}
                   <div 
                     className="w-[209px] h-[314px] rounded-[6px] mb-[12px] relative cursor-pointer hover:opacity-90 transition-opacity"
                     style={{
                       background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 33%, rgba(0, 0, 0, 0.25) 83.58%, rgba(0, 0, 0, 0.5) 177.5%)'
                     }}
                   >
                     <Image
                       src={book.thumbnailUrl || '/image/book default.png'}
                       alt={book.title || '기본 도서 이미지'}
                       width={209}
                       height={314}
                       className="w-full h-full object-cover rounded-[6px]"
                     />
                     {/* 그라데이션 오버레이 */}
                     <div 
                       className="absolute inset-0 rounded-[6px]"
                       style={{
                         background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 33%, rgba(0, 0, 0, 0.25) 83.58%, rgba(0, 0, 0, 0.5) 177.5%)'
                       }}
                     />
                     {/* 순위 표시 */}
                     <div 
                       className="absolute text-gray-0 font-bold flex items-center justify-center"
                       style={{
                         fontFamily: 'Pretendard',
                         fontSize: '52px',
                         lineHeight: '100%',
                         letterSpacing: '-2%',
                         left: '20px',
                         bottom: '11px'
                       }}
                     >
                       {book.rank}
                     </div>
                   </div>

                   {/* 도서 정보 */}
                   <div className="mb-[8px]">
                     <h3 className="text-body2 font-semibold text-gray-950 mb-[6px] hover:text-gray-700 transition-colors line-clamp-1 overflow-hidden text-ellipsis">
                       {book.title}
                     </h3>
                     <p className="text-body3 font-medium text-gray-500">
                       {book.author || '저자 정보 없음'}
                     </p>
                   </div>

                  {/* 평점 */}
                  <div className="flex items-center gap-[4px]">
                    <div className="flex">
                      {[...Array(5)].map((_, index) => {
                        const starIndex = index + 1;
                        const rating = book.rating;
                        
                        if (starIndex <= Math.floor(rating)) {
                          return (
                            <Image
                              key={index}
                              src="/icon/ic_star.png"
                              alt="별점"
                              width={16}
                              height={16}
                            />
                          );
                        } else if (starIndex === Math.ceil(rating) && rating % 1 >= 0.5) {
                          return (
                            <Image
                              key={index}
                              src="/icon/ic_star_half.png"
                              alt="반별점"
                              width={16}
                              height={16}
                            />
                          );
                        } else {
                          return (
                            <Image
                              key={index}
                              src="/icon/ic_star_failled.png"
                              alt="빈별점"
                              width={16}
                              height={16}
                            />
                          );
                        }
                      })}
                    </div>
                    <span className="text-body4 font-medium text-gray-500">
                      ({book.reviewCount})
                    </span>
                  </div>
                </Link>
              ) : (
                <>
                  <div 
                    className="w-[209px] h-[314px] rounded-[6px] mb-[12px] relative"
                    style={{
                      background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 33%, rgba(0, 0, 0, 0.25) 83.58%, rgba(0, 0, 0, 0.5) 177.5%)'
                    }}
                  >
                    <Image
                      src="/image/book default.png"
                      alt="기본 도서 이미지"
                      width={209}
                      height={314}
                      className="w-full h-full object-cover rounded-[6px]"
                    />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-center">
        <Link href="/books">
          <Button variant="outline">
            도서 더보기
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
