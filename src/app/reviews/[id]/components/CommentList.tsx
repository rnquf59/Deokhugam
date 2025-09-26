import CommentItem from "./CommentItem";
import type { Comment } from "@/types/reviews";

interface CommentListProps {
  comments: Comment[];
  reviewId: string;
  onCommentUpdate?: (updatedComment: Comment) => void;
  onCommentDelete?: (deletedCommentId: string) => void;
}

export default function CommentList({
  comments,
  onCommentUpdate,
  onCommentDelete
}: CommentListProps) {
  const handleCommentUpdate = (updatedComment: Comment) => {
    onCommentUpdate?.(updatedComment);
  };

  const handleCommentDelete = (deletedCommentId: string) => {
    onCommentDelete?.(deletedCommentId);
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
          onCommentDelete={handleCommentDelete}
        />
      ))}
    </div>
  );
}
