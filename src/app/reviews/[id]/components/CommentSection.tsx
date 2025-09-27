import { useState, useEffect, useRef, useCallback } from "react";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/common/Buttons/Button";
import CommentList from "./CommentList";
import InfiniteScrollLoader from "@/components/common/InfiniteScrollLoader";
import { createComment, getComments } from "@/api/comments";
import { getReviewDetail } from "@/api/reviews";
import { useTooltipStore } from "@/store/tooltipStore";
import type { Comment, Review } from "@/types/reviews";

interface CommentSectionProps {
  reviewId: string;
  onCommentCountChange?: (count: number) => void;
}

export default function CommentSection({
  reviewId,
  onCommentCountChange
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsError, setCommentsError] = useState<string | null>(null);
  const [review, setReview] = useState<Review | null>(null);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [hasContent, setHasContent] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const showTooltip = useTooltipStore(state => state.showTooltip);

  const [cursor, setCursor] = useState<string | null>(null);
  const [after, setAfter] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    const loadInitialComments = async () => {
      if (!reviewId) return;

      try {
        setCommentsError(null);
        const response = await getComments({
          reviewId,
          direction: "DESC",
          limit: 4
        });
        setComments(response.content);
        setCursor(response.nextCursor);
        setAfter(response.nextAfter);
        setHasMore(response.hasNext);
      } catch (error) {
        console.error("초기 댓글 조회 실패:", error);
        setCommentsError("댓글을 불러오는데 실패했습니다.");
      }
    };

    loadInitialComments();
  }, [reviewId]);

  const fetchMoreComments = useCallback(async () => {
    if (isLoadingMore || !hasMore || !reviewId) return;

    setIsLoadingMore(true);
    try {
      setCommentsError(null);
      const response = await getComments({
        reviewId,
        direction: "DESC",
        limit: 4,
        cursor: cursor || undefined,
        after: after || undefined
      });

      if (response.content.length === 0) {
        setHasMore(false);
        return;
      }

      setComments(prev => {
        const combined = [...prev, ...response.content];
        const unique = Array.from(
          new Map(combined.map(item => [item.id, item])).values()
        );
        return unique;
      });
      setCursor(response.nextCursor);
      setAfter(response.nextAfter);
      setHasMore(response.hasNext);
    } catch (error) {
      console.error("댓글 추가 로딩 실패:", error);
      setCommentsError("댓글을 불러오는데 실패했습니다.");
    } finally {
      setIsLoadingMore(false);
    }
  }, [reviewId, cursor, after, hasMore, isLoadingMore]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const docHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
      );

      if (scrollTop + windowHeight >= docHeight - 100) {
        fetchMoreComments();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [fetchMoreComments]);

  const resetInfiniteScroll = useCallback(() => {
    setCursor(null);
    setAfter(null);
    setHasMore(true);
  }, []);

  useEffect(() => {
    const fetchReview = async () => {
      if (!reviewId) return;

      try {
        const reviewData = await getReviewDetail(reviewId);
        setReview(reviewData);
      } catch (error) {
        console.error("리뷰 조회 실패:", error);
      }
    };

    fetchReview();
  }, [reviewId]);

  const handleSubmitComment = async () => {
    const content = textareaRef.current?.value?.trim();
    if (!content || !reviewId || isSubmittingComment) return;

    try {
      setIsSubmittingComment(true);

      const newComment = await createComment({
        reviewId,
        content
      });

      setComments(prev => {
        const combined = [newComment, ...prev];
        const unique = Array.from(
          new Map(combined.map(item => [item.id, item])).values()
        );
        return unique;
      });
      resetInfiniteScroll();

      if (review) {
        const newCommentCount = review.commentCount + 1;
        setReview(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            commentCount: newCommentCount
          };
        });

        onCommentCountChange?.(newCommentCount);
      }

      if (textareaRef.current) {
        textareaRef.current.value = "";
      }
      setHasContent(false);

      showTooltip("댓글이 등록되었습니다.");
    } catch (error) {
      console.error("댓글 작성 실패:", error);
      alert("댓글 작성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  return (
    <div>
      <div className="mt-[34px] flex flex-col gap-[15px]">
        <div className="flex items-center gap-[4px]">
          <h2 className="text-body1 font-semibold text-gray-900">댓글</h2>
          {review && review.commentCount > 0 && (
            <span className="text-body1 font-semibold text-gray-500">
              {review.commentCount}
            </span>
          )}
        </div>
        <div>
          <Textarea
            ref={textareaRef}
            placeholder="댓글을 입력해주세요..."
            className="h-[120px]"
            onChange={value => {
              setHasContent(value.trim().length > 0);
            }}
          />
          <div className="flex justify-end mt-[15px]">
            <Button
              variant="primary"
              onClick={handleSubmitComment}
              disabled={!hasContent || isSubmittingComment}
            >
              {isSubmittingComment ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-50 mx-auto" />
              ) : (
                "등록"
              )}
            </Button>
          </div>
        </div>
      </div>

      {commentsError ? (
        <div className="pt-10 pb-[79px]">
          <p className="text-body1 font-semibold text-red-500 text-center">
            {commentsError}
          </p>
        </div>
      ) : (
        <>
          <CommentList
            comments={comments}
            reviewId={reviewId}
            onCommentUpdate={async updatedComment => {
              try {
                setComments(prev =>
                  prev.map(comment =>
                    comment.id === updatedComment.id ? updatedComment : comment
                  )
                );

                const updatedReview = await getReviewDetail(reviewId);
                setReview(updatedReview);
                onCommentCountChange?.(updatedReview.commentCount);
              } catch (error) {
                console.error("댓글 수정 반영 실패:", error);
              }
            }}
            onCommentDelete={async deletedCommentId => {
              try {
                setComments(prev =>
                  prev.filter(comment => comment.id !== deletedCommentId)
                );

                const updatedReview = await getReviewDetail(reviewId);
                setReview(updatedReview);
                onCommentCountChange?.(updatedReview.commentCount);
              } catch (error) {
                console.error("댓글 삭제 반영 실패:", error);
              }
            }}
          />
          {isLoadingMore && <InfiniteScrollLoader />}
        </>
      )}
    </div>
  );
}
