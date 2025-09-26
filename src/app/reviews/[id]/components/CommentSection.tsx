import { useState, useEffect, useRef } from "react";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Buttons/Button";
import CommentList from "./CommentList";
import { createComment, getComments } from "@/api/comments";
import { getReviewDetail } from "@/api/reviews";
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
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [commentsError, setCommentsError] = useState<string | null>(null);
  const [review, setReview] = useState<Review | null>(null);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [hasContent, setHasContent] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

      setComments(prev => [newComment, ...prev]);

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
          {comments.length > 0 && (
            <span className="text-body1 font-semibold text-gray-500">
              {comments.length}
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
              {isSubmittingComment ? "등록 중..." : "등록"}
            </Button>
          </div>
        </div>
      </div>

      {isLoadingComments ? (
        <div className="pt-10 pb-[79px]">
          <p className="text-body1 font-semibold text-gray-400 text-center">
            댓글을 불러오는 중...
          </p>
        </div>
      ) : commentsError ? (
        <div className="pt-10 pb-[79px]">
          <p className="text-body1 font-semibold text-red-500 text-center">
            {commentsError}
          </p>
        </div>
      ) : (
        <CommentList
          comments={comments}
          reviewId={reviewId}
          onCommentsRefresh={() => {
            // 댓글 목록이 새로고침되었을 때 실행할 로직
            // 필요시 댓글 수 업데이트 등
          }}
        />
      )}
    </div>
  );
}
