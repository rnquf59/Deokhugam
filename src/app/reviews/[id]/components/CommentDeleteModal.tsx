import Modal from "@/components/ui/Modal";
import { useTooltipStore } from "@/store/tooltipStore";
import { deleteComment } from "@/api/comments";
import { useState } from "react";
import type { Comment } from "@/types/reviews";

export default function CommentDeleteModal({
  isOpen,
  close,
  comment,
  onCommentDelete
}: {
  isOpen: boolean;
  close: () => void;
  comment: Comment | null;
  onCommentDelete?: (deletedCommentId: string) => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showTooltip } = useTooltipStore();

  const handleDeleteComment = async () => {
    if (!comment) return;

    setIsSubmitting(true);
    try {
      await deleteComment(comment.id);

      onCommentDelete?.(comment.id);
      close();
      showTooltip("댓글을 정상적으로 삭제하였습니다!");
    } catch (error) {
      console.error("댓글 삭제 실패:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isDelete
      isOpen={isOpen}
      onClose={close}
      disabled={isSubmitting}
      buttonText="삭제"
      action={handleDeleteComment}
    >
      <p className="font-medium">댓글을 삭제하시겠습니까?</p>
    </Modal>
  );
}
