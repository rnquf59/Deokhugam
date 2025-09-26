import { useState, useEffect } from "react";
import CommentItem from "./CommentItem";
import { getComments } from "@/api/comments";
import type { Comment, CommentsParams } from "@/types/reviews";

interface CommentListProps {
  comments: Comment[];
  reviewId: string;
  onCommentsRefresh?: (updatedComments: Comment[]) => void;
}

export default function CommentList({
  comments: initialComments,
  reviewId,
  onCommentsRefresh
}: CommentListProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 초기 댓글 목록이 변경되면 상태 업데이트
  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  const refreshComments = async () => {
    if (isRefreshing) return;

    try {
      setIsRefreshing(true);
      const commentsParams: CommentsParams = {
        reviewId,
        direction: "DESC",
        limit: 50
      };
      const response = await getComments(commentsParams);
      setComments(response.content);
      onCommentsRefresh?.(response.content);
    } catch (error) {
      console.error("댓글 목록 새로고침 실패:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCommentUpdate = async () => {
    await refreshComments();
  };

  if (comments.length === 0) {
    return (
      <div>
        <p className="text-body1 font-semibold text-gray-400 text-center">
          등록된 댓글이 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div>
      {comments.map(comment => (
        <CommentItem
          key={comment.id}
          comment={comment}
          onCommentUpdate={handleCommentUpdate}
        />
      ))}
    </div>
  );
}
