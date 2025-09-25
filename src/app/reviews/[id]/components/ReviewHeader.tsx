import Image from "next/image";
import StarRating from "@/components/common/StarRating";
import type { Review } from "@/types/reviews";

interface ReviewHeaderProps {
  review: Review;
  onLikeToggle: () => void;
}

export default function ReviewHeader({
  review,
  onLikeToggle
}: ReviewHeaderProps) {
  return (
    <div className="flex gap-6">
      <div className="w-[118px] h-[178px] relative">
        <Image
          src={review.bookThumbnailUrl}
          alt={review.bookTitle}
          fill
          className="object-cover rounded-lg"
        />
      </div>

      <div className="flex flex-col gap-[10px]">
        <div className="text-body4 font-medium text-gray-500 underline decoration-solid underline-offset-0 decoration-0">
          {review.bookTitle}
        </div>

        <div className="flex items-center gap-[6px] py-[3.5px]">
          <span className="text-body3 font-semibold text-gray-600">
            {review.userNickname}
          </span>
          <span className="text-body3 font-medium text-gray-400">
            {new Date(review.createdAt).toLocaleDateString()}
          </span>
        </div>

        <div className="flex flex-col">
          <div className="mb-[8px]">
            <StarRating rating={review.rating} size={18} />
          </div>
          <div className="text-body2 font-medium text-gray-800 h-[130px] overflow-hidden">
            {review.content}
          </div>
        </div>

        <div className="flex items-center gap-[12px] pt-[8px]">
          <div
            className="flex items-center cursor-pointer hover:opacity-70 transition-opacity"
            onClick={onLikeToggle}
          >
            <Image
              src={
                review.likedByMe
                  ? "/images/icon/ic_heart_black.svg"
                  : "/images/icon/ic_heart.svg"
              }
              alt="좋아요"
              width={16}
              height={16}
              className="mr-[2px]"
            />
            <span className="text-body3 font-medium text-gray-500">
              좋아요 {review.likeCount}
            </span>
          </div>

          <div className="flex items-center">
            <Image
              src="/images/icon/ic_comment.svg"
              alt="댓글"
              width={16}
              height={16}
              className="mr-[2px]"
            />
            <span className="text-body3 font-medium text-gray-500">
              댓글 {review.commentCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
