'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Button from '@/components/ui/Buttons/Button';
import SectionHeader from '../ui/SectionHeader';
import EmptyState from '../ui/EmptyState';
import { getPopularBooks, type PopularBook, type PopularBooksParams } from '@/api/books';
import BookCard from '../books/BookCard';

export default function PopularBooks() {
  const [selectedFilter, setSelectedFilter] = useState('전체');
  const [popularBooks, setPopularBooks] = useState<PopularBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasData, setHasData] = useState(false);


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
      
      // 전체 기준일 때만 데이터가 없으면 EmptyState 표시
      if (period === 'ALL_TIME' && books.length === 0) {
        setHasData(false);
        setPopularBooks([]);
      } else {
        setHasData(true);
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
      }
    } catch (err) {
      console.error('인기도서 조회 실패:', err);
      setError('인기도서를 불러오는데 실패했습니다.');
      setHasData(false);
      setPopularBooks([]);
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

  if (!loading && !error && !hasData && selectedFilter === '전체') {
    return (
      <EmptyState
        title="인기 도서"
        description="아직 등록된 도서가 없습니다."
        iconSrc="/icon/ic_book2.svg"
        iconAlt="도서 아이콘"
      />
    );
  }

  return (
    <div>
      <SectionHeader
        title="인기도서"
        description="어떤 책이 좋을까? 지금 가장 인기 있는 도서"
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
      ) : (
        <div className="flex gap-[24px] mb-[30px]">
          {popularBooks.map((book) => (
            <BookCard key={book.id} book={book} />
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
