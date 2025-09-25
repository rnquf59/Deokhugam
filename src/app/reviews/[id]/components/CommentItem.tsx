import Image from "next/image";
import type { Comment } from "@/types/reviews";

interface CommentItemProps {
  comment: Comment;
}

export default function CommentItem({ comment }: CommentItemProps) {
  return (
    <div className="py-[24px] border-b border-gray-100">
      <div className="flex flex-col gap-[10px]">
        {/* 첫 번째 요소: 닉네임, 작성일, 더보기 아이콘 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[6px]">
            <span className="my-[3.5px] text-body3 font-semibold text-gray-600">
              {comment.userNickname}
            </span>
            <span className="my-[3.5px] text-body3 font-medium text-gray-400">
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
          </div>
          <Image
            src="/images/icon/ic_more.svg"
            alt="더보기"
            width={24}
            height={24}
            className="cursor-pointer"
          />
        </div>

        {/* 두 번째 요소: 댓글 내용 */}
        <div className="text-body2 font-medium text-gray-800">
          {comment.content}
        </div>
      </div>
    </div>
  );
}
