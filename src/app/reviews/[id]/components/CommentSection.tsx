import { useState, useCallback } from "react";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Buttons/Button";
import CommentList from "./CommentList";
import { createComment } from "@/api/comments";
import type { Comment } from "@/types/reviews";

interface CommentSectionProps {
  reviewId: string;
  comments: Comment[];
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
  isLoadingComments: boolean;
  commentsError: string | null;
  onCommentCountUpdate: (count: number) => void;
}

export default function CommentSection({
  reviewId,
  comments,
  setComments,
  isLoadingComments,
  commentsError,
  onCommentCountUpdate
}: CommentSectionProps) {
  const [commentContent, setCommentContent] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // 댓글 내용 변경 핸들러
  const handleCommentContentChange = useCallback((value: string) => {
    setCommentContent(value);
  }, []);

  // 댓글 작성 함수
  const handleSubmitComment = useCallback(async () => {
    if (!commentContent.trim() || !reviewId || isSubmittingComment) return;

    try {
      setIsSubmittingComment(true);

      const newComment = await createComment({
        reviewId,
        content: commentContent.trim()
      });

      // 댓글 목록에 새 댓글 추가
      setComments(prev => [newComment, ...prev]);

      // 댓글 개수 업데이트
      onCommentCountUpdate(comments.length + 1);

      // 입력창 초기화
      setCommentContent("");
    } catch (error) {
      console.error("댓글 작성 실패:", error);
      alert("댓글 작성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmittingComment(false);
    }
  }, [
    commentContent,
    reviewId,
    isSubmittingComment,
    setComments,
    comments.length,
    onCommentCountUpdate
  ]);

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
        <Textarea
          placeholder="댓글을 입력해주세요..."
          className="h-[120px]"
          value={commentContent}
          onChange={handleCommentContentChange}
        />
        <div className="flex justify-end">
          <Button
            variant="primary"
            onClick={handleSubmitComment}
            disabled={!commentContent.trim() || isSubmittingComment}
          >
            {isSubmittingComment ? "작성 중..." : "댓글 작성"}
          </Button>
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
        <CommentList comments={comments} />
      )}
    </div>
  );
}
