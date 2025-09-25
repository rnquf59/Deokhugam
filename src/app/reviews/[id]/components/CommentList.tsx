import CommentItem from "./CommentItem";
import type { Comment } from "@/types/reviews";

interface CommentListProps {
  comments: Comment[];
}

export default function CommentList({ comments }: CommentListProps) {
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
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
}
