'use client';

import { useState, useMemo, useCallback } from 'react';
import ReviewCard from '../main/components/reviews/ReviewCard';
import RadioButton from '@/components/ui/Buttons/RadioButton';
import SearchBar from '@/components/ui/SearchBar';
import type { PopularReview } from '@/types/reviews';

// 임시 더미 데이터 (14개)
const dummyReviews: PopularReview[] = [
  {
    id: '1',
    reviewId: 'review-1',
    bookId: 'book-1',
    bookTitle: '노을 디어 올리버',
    bookThumbnailUrl: '/images/books/imgError.png',
    userId: 'user-1',
    userNickname: '독서왕',
    reviewContent: '이 책은 올리버라는 한 남자의 복잡한 내면을 섬세하게 그려내고 있습니다. 모든 문장이 시처럼 아름답고, 읽는 내내 깊은 위로를 받았습니다. 잔잔하게 마음을 울리는 소설을 찾는 분들께 꼭 추천하고 싶은 작품입니다.',
    reviewRating: 4.5,
    period: 'MONTHLY',
    createdAt: '2025-06-30T00:00:00Z',
    rank: 1,
    score: 95,
    likeCount: 1,
    commentCount: 1,
  },
  {
    id: '2',
    reviewId: 'review-2',
    bookId: 'book-2',
    bookTitle: '마음의 평화',
    bookThumbnailUrl: '/images/books/imgError.png',
    userId: 'user-2',
    userNickname: '책벌레',
    reviewContent: '일상의 소소한 행복을 찾는 방법에 대해 이야기하는 책입니다. 바쁜 현대인들에게 잠시나마 마음의 여유를 선사해주는 따뜻한 메시지가 담겨있어요.',
    reviewRating: 4.0,
    period: 'MONTHLY',
    createdAt: '2025-06-29T00:00:00Z',
    rank: 2,
    score: 90,
    likeCount: 3,
    commentCount: 2,
  },
  {
    id: '3',
    reviewId: 'review-3',
    bookId: 'book-3',
    bookTitle: '시간의 비밀',
    bookThumbnailUrl: '/images/books/imgError.png',
    userId: 'user-3',
    userNickname: '시간여행자',
    reviewContent: '시간에 대한 철학적 사고를 담은 작품으로, 읽는 동안 많은 생각을 하게 만듭니다. 작가의 깊이 있는 통찰력이 돋보이는 책입니다.',
    reviewRating: 5.0,
    period: 'MONTHLY',
    createdAt: '2025-06-28T00:00:00Z',
    rank: 3,
    score: 88,
    likeCount: 5,
    commentCount: 0,
  },
  {
    id: '4',
    reviewId: 'review-4',
    bookId: 'book-4',
    bookTitle: '꿈의 해석',
    bookThumbnailUrl: '/images/books/imgError.png',
    userId: 'user-4',
    userNickname: '꿈분석가',
    reviewContent: '꿈에 대한 심리학적 접근이 흥미로운 책입니다. 자신의 꿈을 이해하는 새로운 관점을 제시해주어서 읽어볼 만합니다.',
    reviewRating: 3.5,
    period: 'MONTHLY',
    createdAt: '2025-06-27T00:00:00Z',
    rank: 4,
    score: 85,
    likeCount: 2,
    commentCount: 1,
  },
  {
    id: '5',
    reviewId: 'review-5',
    bookId: 'book-5',
    bookTitle: '바다의 노래',
    bookThumbnailUrl: '/images/books/imgError.png',
    userId: 'user-5',
    userNickname: '바다사랑',
    reviewContent: '바다를 소재로 한 아름다운 이야기입니다. 바닷가에서의 추억과 감정이 생생하게 전달되어 마치 바다에 있는 것 같은 느낌을 받았습니다.',
    reviewRating: 4.2,
    period: 'MONTHLY',
    createdAt: '2025-06-26T00:00:00Z',
    rank: 5,
    score: 82,
    likeCount: 4,
    commentCount: 3,
  },
  {
    id: '6',
    reviewId: 'review-6',
    bookId: 'book-6',
    bookTitle: '숲속의 비밀',
    bookThumbnailUrl: '/images/books/imgError.png',
    userId: 'user-6',
    userNickname: '자연인',
    reviewContent: '자연과 인간의 관계에 대해 생각해보게 하는 책입니다. 숲의 신비로움과 자연의 소중함을 일깨워주는 좋은 작품이에요.',
    reviewRating: 4.8,
    period: 'MONTHLY',
    createdAt: '2025-06-25T00:00:00Z',
    rank: 6,
    score: 80,
    likeCount: 6,
    commentCount: 2,
  },
  {
    id: '7',
    reviewId: 'review-7',
    bookId: 'book-7',
    bookTitle: '별이 빛나는 밤',
    bookThumbnailUrl: '/images/books/imgError.png',
    userId: 'user-7',
    userNickname: '별관찰자',
    reviewContent: '밤하늘의 별들을 소재로 한 감성적인 이야기입니다. 어둠 속에서도 빛을 잃지 않는 희망의 메시지가 담겨있어요.',
    reviewRating: 4.3,
    period: 'MONTHLY',
    createdAt: '2025-06-24T00:00:00Z',
    rank: 7,
    score: 78,
    likeCount: 3,
    commentCount: 1,
  },
  {
    id: '8',
    reviewId: 'review-8',
    bookId: 'book-8',
    bookTitle: '춤추는 나비',
    bookThumbnailUrl: '/images/books/imgError.png',
    userId: 'user-8',
    userNickname: '나비추종자',
    reviewContent: '자유롭게 춤추는 나비의 모습을 통해 삶의 자유로움을 표현한 아름다운 작품입니다. 가벼우면서도 깊이 있는 메시지가 인상적이에요.',
    reviewRating: 4.6,
    period: 'MONTHLY',
    createdAt: '2025-06-23T00:00:00Z',
    rank: 8,
    score: 76,
    likeCount: 2,
    commentCount: 4,
  },
  {
    id: '9',
    reviewId: 'review-9',
    bookId: 'book-9',
    bookTitle: '비 내리는 날',
    bookThumbnailUrl: '/images/books/imgError.png',
    userId: 'user-9',
    userNickname: '비사랑',
    reviewContent: '비 오는 날의 특별한 분위기를 잘 담아낸 작품입니다. 우울하면서도 아름다운 감정이 잘 표현되어 있어서 마음에 와닿았습니다.',
    reviewRating: 4.1,
    period: 'MONTHLY',
    createdAt: '2025-06-22T00:00:00Z',
    rank: 9,
    score: 74,
    likeCount: 1,
    commentCount: 0,
  },
  {
    id: '10',
    reviewId: 'review-10',
    bookId: 'book-10',
    bookTitle: '바람의 소리',
    bookThumbnailUrl: '/images/books/imgError.png',
    userId: 'user-10',
    userNickname: '바람청취자',
    reviewContent: '바람의 소리를 통해 자연의 신비로움을 느낄 수 있는 책입니다. 조용한 시간을 보내고 싶을 때 읽기 좋은 작품이에요.',
    reviewRating: 4.4,
    period: 'MONTHLY',
    createdAt: '2025-06-21T00:00:00Z',
    rank: 10,
    score: 72,
    likeCount: 3,
    commentCount: 2,
  },
  {
    id: '11',
    reviewId: 'review-11',
    bookId: 'book-11',
    bookTitle: '꽃피는 봄',
    bookThumbnailUrl: '/images/books/imgError.png',
    userId: 'user-11',
    userNickname: '봄사랑',
    reviewContent: '봄의 생명력과 희망을 담은 따뜻한 이야기입니다. 새로운 시작에 대한 용기를 얻을 수 있는 좋은 책이에요.',
    reviewRating: 4.7,
    period: 'MONTHLY',
    createdAt: '2025-06-20T00:00:00Z',
    rank: 11,
    score: 70,
    likeCount: 5,
    commentCount: 1,
  },
  {
    id: '12',
    reviewId: 'review-12',
    bookId: 'book-12',
    bookTitle: '달빛 아래서',
    bookThumbnailUrl: '/images/books/imgError.png',
    userId: 'user-12',
    userNickname: '달빛추종자',
    reviewContent: '달빛의 신비로움과 아름다움을 표현한 감성적인 작품입니다. 밤의 정적 속에서 느끼는 특별한 감정이 잘 전달되어요.',
    reviewRating: 4.0,
    period: 'MONTHLY',
    createdAt: '2025-06-19T00:00:00Z',
    rank: 12,
    score: 68,
    likeCount: 2,
    commentCount: 3,
  },
  {
    id: '13',
    reviewId: 'review-13',
    bookId: 'book-13',
    bookTitle: '새벽의 기도',
    bookThumbnailUrl: '/images/books/imgError.png',
    userId: 'user-13',
    userNickname: '새벽기도자',
    reviewContent: '새벽의 고요함과 평화로움을 담은 영적인 작품입니다. 마음의 평안을 찾고 싶을 때 읽으면 좋을 것 같아요.',
    reviewRating: 4.5,
    period: 'MONTHLY',
    createdAt: '2025-06-18T00:00:00Z',
    rank: 13,
    score: 66,
    likeCount: 4,
    commentCount: 0,
  },
  {
    id: '14',
    reviewId: 'review-14',
    bookId: 'book-14',
    bookTitle: '산 정상에서',
    bookThumbnailUrl: '/images/books/imgError.png',
    userId: 'user-14',
    userNickname: '등산가',
    reviewContent: '산 정상에서 바라본 풍경과 그때의 감정을 생생하게 담아낸 작품입니다. 도전과 성취의 기쁨이 잘 표현되어 있어요.',
    reviewRating: 4.2,
    period: 'MONTHLY',
    createdAt: '2025-06-17T00:00:00Z',
    rank: 14,
    score: 64,
    likeCount: 3,
    commentCount: 2,
  },
];

export default function ReviewsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'time' | 'rating'>('time');
  const [orderBy, setOrderBy] = useState<'asc' | 'desc'>('desc');

  // 검색 핸들러 메모이제이션
  const handleSearch = useCallback((value: string) => {
    console.log('검색:', value);
    // 실제 검색 로직 구현
  }, []);

  // 지우기 핸들러 메모이제이션
  const handleClear = useCallback(() => {
    setSearchQuery('');
    // 검색 결과 초기화 로직 구현
  }, []);

  // 정렬 핸들러들 메모이제이션
  const handleSortByChange = useCallback((newSortBy: 'time' | 'rating') => {
    setSortBy(newSortBy);
  }, []);

  const handleOrderByChange = useCallback(() => {
    setOrderBy(prev => prev === 'desc' ? 'asc' : 'desc');
  }, []);

  // 필터링된 리뷰 데이터 메모이제이션
  const filteredReviews = useMemo(() => {
    let filtered = [...dummyReviews];
    
    // 검색어 필터링
    if (searchQuery.trim()) {
      filtered = filtered.filter(review => 
        review.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.reviewContent.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.userNickname.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // 정렬
    filtered.sort((a, b) => {
      if (sortBy === 'time') {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return orderBy === 'desc' ? dateB - dateA : dateA - dateB;
      } else {
        return orderBy === 'desc' ? b.reviewRating - a.reviewRating : a.reviewRating - b.reviewRating;
      }
    });
    
    return filtered;
  }, [searchQuery, sortBy, orderBy]);

  return (
    <div className="pt-[50px] pb-[80px]">

        {/* 페이지 제목 */}
        <div 
          className="flex mb-5"
          style={{
            fontFamily: 'Pretendard',
            fontSize: '32px',
            fontWeight: 'bold',
            lineHeight: '120%',
            letterSpacing: '-2%',
            color: '#111827'
          }}
        >
          리뷰 리스트
        </div>

        {/* 검색 및 필터 섹션 */}
        <div className="flex justify-between items-center mb-[30px]">
          {/* 검색 입력 */}
          <div className="flex-1 max-w-md">
            <SearchBar
              placeholder="내가 찾는 책 이름을 검색해보세요"
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={handleSearch}
              onClear={handleClear}
            />
          </div>

          {/* 정렬 옵션 */}
          <div className="flex gap-2">
            <RadioButton
              variant={sortBy === 'time' ? 'selected' : 'unselected'}
              onClick={() => handleSortByChange('time')}
            >
              시간순
            </RadioButton>
            <RadioButton
              variant={orderBy === 'desc' ? 'selected' : 'unselected'}
              onClick={handleOrderByChange}
            >
              {orderBy === 'desc' ? '내림차순' : '오름차순'}
            </RadioButton>
          </div>
        </div>

        {/* 리뷰 목록 그리드 */}
        <div className="grid grid-cols-2 gap-[30px]">
          {filteredReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>

    </div>
  );
}