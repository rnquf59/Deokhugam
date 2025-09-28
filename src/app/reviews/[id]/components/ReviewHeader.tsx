import { useState, useEffect } from "react";
import Image from "next/image";
import StarRating from "@/components/common/StarRating";
import LoadingScreen from "@/components/common/LoadingScreen";
import { getReviewDetail, toggleReviewLike } from "@/api/reviews";
import type { Review } from "@/types/reviews";

interface ReviewHeaderProps {
  reviewId: string;
  commentCount?: number;
}

export default function ReviewHeader({
  reviewId,
  commentCount
}: ReviewHeaderProps) {
  const [review, setReview] = useState<Review | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReview = async () => {
      if (!reviewId) return;

      try {
        setIsLoading(true);
        setError(null);

        const reviewData = await getReviewDetail(reviewId);
        setReview(reviewData);
      } catch (error) {
        console.error("리뷰 조회 실패:", error);
        setError("리뷰를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReview();
  }, [reviewId]);

  const toggleLike = async () => {
    if (!review) return;

    try {
      const result = await toggleReviewLike(reviewId);

      setReview(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          likedByMe: result.liked,
          likeCount: result.liked ? prev.likeCount + 1 : prev.likeCount - 1
        };
      });
    } catch (error) {
      console.error("좋아요 토글 실패:", error);
      alert("좋아요 처리에 실패했습니다. 다시 시도해주세요.");
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="pt-[50px] pb-[80px] h-[inherit] min-h-[inherit] flex items-center justify-center">
        <p className="text-body1 font-semibold text-red-500 text-center">
          {error}
        </p>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="pt-[50px] pb-[80px] h-[inherit] min-h-[inherit] flex items-center justify-center">
        <p className="text-body1 font-semibold text-gray-400 text-center">
          리뷰를 찾을 수 없습니다.
        </p>
      </div>
    );
  }
  return (
    <div className="flex gap-6">
      <div className="w-[118px] h-[178px] relative">
        <Image
          src={review.bookThumbnailUrl || "/images/books/imgError.png"}
          alt={review.bookTitle}
          fill
          unoptimized
          className="object-cover rounded-lg"
          onError={e => {
            const target = e.target as HTMLImageElement;
            target.src = "/images/books/imgError.png";
          }}
        />
      </div>

      <div className="flex flex-col gap-[10px]">
        <div className="text-body4 font-medium text-gray-500 underline decoration-solid underline-offset-0 decoration-0">
          {review.bookTitle}
        </div>

        <div className="flex items-center gap-[6px] py-[3.5px]">
          <span className="text-body3 font-semibold text-gray-600">
            {review.userNickname}
          </span>
          <span className="text-body3 font-medium text-gray-400">
            {new Date(review.createdAt).toLocaleDateString()}
          </span>
        </div>

        <div className="flex flex-col">
          <div className="mb-[8px]">
            <StarRating rating={review.rating} size={18} />
          </div>
          <div className="text-body2 font-medium text-gray-800 h-[130px] overflow-hidden">
            {review.content}
          </div>
        </div>

        <div className="flex items-center gap-[12px] pt-[8px]">
          <div
            className="flex items-center cursor-pointer hover:opacity-70 transition-opacity"
            onClick={toggleLike}
          >
            <Image
              src={
                review.likedByMe
                  ? "/images/icon/ic_heart_black.svg"
                  : "/images/icon/ic_heart.svg"
              }
              alt="좋아요"
              width={16}
              height={16}
              className="mr-[2px] w-4 h-4"
            />
            <span className="text-body3 font-medium text-gray-500">
              좋아요 {review.likeCount}
            </span>
          </div>

          <div className="flex items-center">
            <Image
              src="/images/icon/ic_comment.svg"
              alt="댓글"
              width={16}
              height={16}
              className="mr-[2px]"
            />
            <span className="text-body3 font-medium text-gray-500">
              댓글{" "}
              {commentCount !== undefined ? commentCount : review.commentCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
