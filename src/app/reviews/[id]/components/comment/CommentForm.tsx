import { useState, useRef } from "react";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/common/Buttons/Button";
import { createComment } from "@/api/comments";
import { useTooltipStore } from "@/store/tooltipStore";
import type { Comment } from "@/types/reviews";

interface CommentFormProps {
  reviewId: string;
  onCommentSubmit: (newComment: Comment) => void;
  onCommentCountChange?: (count: number) => void;
  reviewCommentCount?: number;
}

export default function CommentForm({
  reviewId,
  onCommentSubmit,
  onCommentCountChange,
  reviewCommentCount
}: CommentFormProps) {
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [hasContent, setHasContent] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const showTooltip = useTooltipStore(state => state.showTooltip);

  const handleSubmitComment = async () => {
    const content = textareaRef.current?.value?.trim();
    if (!content || !reviewId || isSubmittingComment) return;

    try {
      setIsSubmittingComment(true);

      const newComment = await createComment({
        reviewId,
        content
      });

      onCommentSubmit(newComment);

      if (reviewCommentCount !== undefined) {
        const newCommentCount = reviewCommentCount + 1;
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
  );
}
