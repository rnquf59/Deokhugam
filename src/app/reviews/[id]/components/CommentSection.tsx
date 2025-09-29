import { useState, useEffect, useRef } from "react";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/common/Buttons/Button";
import CommentItem from "./CommentItem";
import InfiniteScrollLoader from "@/components/common/InfiniteScrollLoader";
import { createComment, getComments } from "@/api/comments";
import { getReviewDetail } from "@/api/reviews";
import { useTooltipStore } from "@/store/tooltipStore";
import { useInfiniteScroll } from "@/hooks/common/useInfiniteScroll";
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
  const [review, setReview] = useState<Review | null>(null);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isUpdatingComment, setIsUpdatingComment] = useState(false);
  const [hasContent, setHasContent] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const showTooltip = useTooltipStore(state => state.showTooltip);

  const { isLoading, setCursor, setAfter, setIsLoading, resetInfiniteScroll } =
    useInfiniteScroll<
      Comment,
      { reviewId: string; direction: "DESC" | "ASC"; limit: number }
    >({
      initialParams: {
        reviewId,
        direction: "DESC",
        limit: 4
      },
      fetcher: async params => {
        const response = await getComments(params);
        return {
          content: response.content,
          nextCursor: response.nextCursor || "",
          nextAfter: response.nextAfter || "",
          hasNext: response.hasNext
        };
      },
      setData: setComments
    });

  // 초기 댓글 데이터 로드
  useEffect(() => {
    const fetchInitialComments = async () => {
      if (!reviewId) return;

      setIsLoading(true);
      try {
        const response = await getComments({
          reviewId,
          direction: "DESC",
          limit: 4
        });
        setComments(response.content);
        setCursor(response.nextCursor ?? undefined);
        setAfter(response.nextAfter ?? undefined);
      } catch (error) {
        console.error("초기 댓글 조회 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    resetInfiniteScroll();
    setComments([]);
    fetchInitialComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reviewId]);

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
    <div className="border-t border-gray-100">
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

      {comments.length === 0 ? (
        <div>
          <p className="text-body1 font-semibold text-gray-400 text-center">
            등록된 댓글이 없습니다.
          </p>
        </div>
      ) : (
        <div>
          {comments.map(comment => (
            <CommentItem
              key={comment.id}
              comment={comment}
              data={comments}
              setData={setComments}
              reviewId={reviewId}
              onCommentCountChange={onCommentCountChange}
              onCommentUpdate={async updatedComment => {
                try {
                  setIsUpdatingComment(true);
                  setComments(prev =>
                    prev.map(comment =>
                      comment.id === updatedComment.id
                        ? updatedComment
                        : comment
                    )
                  );

                  const updatedReview = await getReviewDetail(reviewId);
                  setReview(updatedReview);
                  onCommentCountChange?.(updatedReview.commentCount);
                } catch (error) {
                  console.error("댓글 수정 반영 실패:", error);
                } finally {
                  setIsUpdatingComment(false);
                }
              }}
            />
          ))}
        </div>
      )}
      {(isLoading || isUpdatingComment) && <InfiniteScrollLoader />}
    </div>
  );
}
