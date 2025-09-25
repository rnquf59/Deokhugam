"use client";

import { useAuthGuard } from "@/hooks/auth/useAuthRedirect";
import LoadingScreen from "@/components/common/LoadingScreen";
import Image from "next/image";
import StarRating from "@/components/common/StarRating";
import Textarea from "@/components/ui/Textarea";
import CommentList from "./components/CommentList";
import type { Comment } from "@/types/reviews";

export default function ReviewDetailPage() {
  const { shouldShowContent } = useAuthGuard();

  if (!shouldShowContent) {
    return <LoadingScreen />;
  }

  // 임시 데이터
  const reviewData = {
    book: {
      title: "Who is a real hero? - 1001 stories presents",
      author: "Habimana Nahayo",
      publishedDate: "2021-01-15",
      description:
        "여러분은 어떤 사람을 영웅이라고 생각하나요? 돈이 많은 사람? 똑똑한 사람? 다른 사람을 도와주는 사람? 아마 다양한 대답들이 나올 것 같습니다.",
      thumbnailUrl: "/images/books/imgError.png",
      rating: 4.5,
      likeCount: 24,
      commentCount: 8
    }
  };

  // 임시 댓글 데이터
  const comments: Comment[] = [
    {
      id: "1",
      reviewId: "review-1",
      userId: "user-1",
      userNickname: "독서왕",
      content: "정말 좋은 책이네요! 추천합니다.",
      createdAt: "2024-01-15T10:30:00Z",
      updatedAt: "2024-01-15T10:30:00Z"
    },
    {
      id: "2",
      reviewId: "review-1",
      userId: "user-2",
      userNickname: "책벌레",
      content:
        "저도 이 책을 읽어봤는데 정말 인상적이었어요. 특히 마지막 부분이 인상깊었습니다.",
      createdAt: "2024-01-14T15:45:00Z",
      updatedAt: "2024-01-14T15:45:00Z"
    },
    {
      id: "3",
      reviewId: "review-1",
      userId: "user-3",
      userNickname: "독서러버",
      content: "작가의 문체가 정말 좋네요. 다음 작품도 기대됩니다!",
      createdAt: "2024-01-13T09:20:00Z",
      updatedAt: "2024-01-13T09:20:00Z"
    }
  ];

  return (
    <div className="pt-[50px] pb-[80px] h-[inherit] min-h-[inherit] flex flex-col gap-[40px]">
      <div className="flex gap-6">
        <div className="w-[118px] h-[178px] relative">
          <Image
            src={reviewData.book.thumbnailUrl}
            alt={reviewData.book.title}
            fill
            className="object-cover rounded-lg"
          />
        </div>

        <div className="flex flex-col gap-[10px]">
          <div className="text-body4 font-medium text-gray-500 underline decoration-solid underline-offset-0 decoration-0">
            {reviewData.book.title}
          </div>

          <div className="flex items-center gap-[6px] py-[3.5px]">
            <span className="text-body3 font-semibold text-gray-600">
              {reviewData.book.author}
            </span>
            <span className="text-body3 font-medium text-gray-400">
              {reviewData.book.publishedDate}
            </span>
          </div>

          <div className="flex flex-col">
            <div className="mb-[8px]">
              <StarRating rating={reviewData.book.rating} size={18} />
            </div>
            <div className="text-body2 font-medium text-gray-800 h-[130px] overflow-hidden">
              {reviewData.book.description}
            </div>
          </div>

          <div className="flex items-center gap-[12px] pt-[8px]">
            <div className="flex items-center">
              <Image
                src="/images/icon/ic_heart.svg"
                alt="좋아요"
                width={16}
                height={16}
                className="mr-[2px]"
              />
              <span className="text-body3 font-medium text-gray-500">
                좋아요 {reviewData.book.likeCount}
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
                댓글 {reviewData.book.commentCount}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="mt-[34px] flex flex-col gap-[15px]">
          <h2 className="text-body1 font-semibold text-gray-900">댓글</h2>
          <Textarea
            placeholder="댓글을 입력해주세요..."
            className="h-[120px]"
          />
        </div>

        <CommentList comments={comments} />
      </div>
    </div>
  );
}
