import { toggleReviewLike } from "@/api/reviews";
import { formatDate } from "@/app/utils/formatData";
import StarRating from "@/components/common/StarRating";
import { useDisclosure } from "@/hooks/common/useDisclosure";
import { Review } from "@/types/reviews";
import Image from "next/image";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import ActionDropdown from "./ActionDropdown";
import ReviewDeleteModal from "./ReviewDeleteModal";
import { useAuthStore } from "@/store/authStore";
import DelayedLoader from "@/components/common/DelayedLoader";
import InfiniteScrollLoader from "@/components/common/InfiniteScrollLoader";
import EditContainer from "./EditContainer";

export default function ReviewList({
  data,
  setData,
  isLoading,
  bookId
}: {
  data: Review[];
  setData: Dispatch<SetStateAction<Review[]>>;
  isLoading: boolean;
  bookId: string;
}) {
  const [reviews, setReviews] = useState<Review[]>(data);
  const [reviewId, setReviewId] = useState("");
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);

  const { user } = useAuthStore();
  const { isOpen, open: showModal, close } = useDisclosure();

  const toggleLike = async (reviewId: string) => {
    try {
      const result = await toggleReviewLike(reviewId);

      setReviews(prev =>
        prev.map(r =>
          r.id === reviewId
            ? {
                ...r,
                likedByMe: result.liked,
                likeCount: result.liked ? r.likeCount + 1 : r.likeCount - 1
              }
            : r
        )
      );
    } catch (error) {
      console.error("좋아요 토글 실패:", error);
      alert("좋아요 처리에 실패했습니다. 다시 시도해주세요.");
    }
  };

  useEffect(() => {
    setReviews(data);
  }, [data]);

  if (reviews.length === 0) {
    return (
      <div>
        <p className="text-body1 font-semibold text-gray-400 text-center">
          등록된 댓글이 없습니다.
        </p>
      </div>
    );
  }

  return (
    <>
      <DelayedLoader isLoading={isLoading} delay={1000}>
        <InfiniteScrollLoader />
      </DelayedLoader>
      <div className="mt-5 flex flex-col gap-5">
        {reviews.map(review => {
          const isEdit = editingReviewId === review.id;

          return (
            <div key={review.id} className="pb-5 border-b border-gray-100">
              <div className="flex items-center jsutify-between mb-[10px]">
                <p className="flex flex-[1] gap-2 items-center text-body3 font-semibold text-gray-600">
                  {review.userNickname}
                  <span className="font-medium text-gray-400">
                    {formatDate(review.createdAt)}
                  </span>
                </p>
                {user?.id === review.userId && (
                  <ActionDropdown
                    showModal={showModal}
                    reviewId={review.id}
                    setReviewId={setReviewId}
                    setIsEdit={() => setEditingReviewId(review.id)}
                  />
                )}
              </div>
              <StarRating rating={review.rating} />
              {isEdit ? (
                <EditContainer
                  reviewId={review.id}
                  bookId={bookId}
                  data={data}
                  setData={setData}
                  defaultValue={review.content}
                  setEditingReviewId={setEditingReviewId}
                />
              ) : (
                review.content.split("\n").map((line, i) => (
                  <p
                    key={i}
                    className="mt-2 text-gray-700 text-body3 font-medium"
                  >
                    {line}
                  </p>
                ))
              )}
              <div className="flex items-center gap-[12px] pt-[8px]">
                <div
                  className="flex items-center cursor-pointer hover:opacity-70 transition-opacity"
                  onClick={() => toggleLike(review.id)}
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
          );
        })}
      </div>
      <ReviewDeleteModal
        isOpen={isOpen}
        close={close}
        reviewId={reviewId}
        data={data}
        setData={setData}
        bookId={bookId}
      />
    </>
  );
}
