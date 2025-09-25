"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useAuthGuard } from "@/hooks/auth/useAuthRedirect";
import LoadingScreen from "@/components/common/LoadingScreen";
import ReviewHeader from "./components/ReviewHeader";
import CommentSection from "./components/CommentSection";
import { getComments } from "@/api/comments";
import { getReviewDetail } from "@/api/reviews";
import type { Comment, Review } from "@/types/reviews";

export default function ReviewDetailPage() {
  const { shouldShowContent } = useAuthGuard();
  const params = useParams();
  const reviewId = params.id as string;

  const [review, setReview] = useState<Review | null>(null);
  const [isLoadingReview, setIsLoadingReview] = useState(true);
  const [reviewError, setReviewError] = useState<string | null>(null);

  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [commentsError, setCommentsError] = useState<string | null>(null);

  // 좋아요 토글 함수
  const handleLikeToggle = () => {
    if (!review) return;

    setReview(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        likedByMe: !prev.likedByMe,
        likeCount: prev.likedByMe ? prev.likeCount - 1 : prev.likeCount + 1
      };
    });
  };

  // 댓글 개수 업데이트 함수
  const handleCommentCountUpdate = (count: number) => {
    setReview(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        commentCount: count
      };
    });
  };

  // 리뷰 데이터 로드
  useEffect(() => {
    const fetchReview = async () => {
      if (!reviewId) return;

      try {
        setIsLoadingReview(true);
        setReviewError(null);

        const reviewData = await getReviewDetail(reviewId);
        setReview(reviewData);
      } catch (error) {
        console.error("리뷰 조회 실패:", error);
        setReviewError("리뷰를 불러오는데 실패했습니다.");
      } finally {
        setIsLoadingReview(false);
      }
    };

    fetchReview();
  }, [reviewId]);

  // 댓글 데이터 로드
  useEffect(() => {
    const fetchComments = async () => {
      if (!reviewId) return;

      try {
        setIsLoadingComments(true);
        setCommentsError(null);

        const response = await getComments({
          reviewId,
          direction: "DESC",
          limit: 50
        });

        setComments(response.content);
      } catch (error) {
        console.error("댓글 조회 실패:", error);
        setCommentsError("댓글을 불러오는데 실패했습니다.");
      } finally {
        setIsLoadingComments(false);
      }
    };

    fetchComments();
  }, [reviewId]);

  if (!shouldShowContent) {
    return <LoadingScreen />;
  }

  if (isLoadingReview) {
    return <LoadingScreen />;
  }

  if (reviewError) {
    return (
      <div className="pt-[50px] pb-[80px] h-[inherit] min-h-[inherit] flex items-center justify-center">
        <p className="text-body1 font-semibold text-red-500 text-center">
          {reviewError}
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
    <div className="pt-[50px] pb-[80px] h-[inherit] min-h-[inherit] flex flex-col gap-[40px]">
      <ReviewHeader review={review} onLikeToggle={handleLikeToggle} />

      <CommentSection
        reviewId={reviewId}
        comments={comments}
        setComments={setComments}
        isLoadingComments={isLoadingComments}
        commentsError={commentsError}
        onCommentCountUpdate={handleCommentCountUpdate}
      />
    </div>
  );
}
