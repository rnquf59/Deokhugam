"use client";

import { formatDate } from "@/app/utils/formatData";
import Image from "next/image";

interface ReviewContentProps {
  userNickname?: string;
  bookTitle?: string;
  reviewRating: number;
  reviewContent?: string;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  isEmpty?: boolean;
  maxTitleWidth?: number;
}

export default function ReviewContent({
  userNickname,
  bookTitle,
  reviewRating,
  reviewContent,
  likeCount,
  commentCount,
  createdAt,
  isEmpty = false,
  maxTitleWidth
}: ReviewContentProps) {
  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => {
      const starIndex = index + 1;

      if (starIndex <= Math.floor(rating)) {
        return (
          <Image
            key={index}
            src="/images/icon/ic_star.svg"
            alt="별점"
            width={18}
            height={18}
          />
        );
      } else if (starIndex === Math.ceil(rating) && rating % 1 >= 0.5) {
        return (
          <Image
            key={index}
            src="/images/icon/ic_star_half.svg"
            alt="반별점"
            width={18}
            height={18}
          />
        );
      } else {
        return (
          <Image
            key={index}
            src="/images/icon/ic_star_failled.svg"
            alt="빈별점"
            width={18}
            height={18}
          />
        );
      }
    });
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex items-center justify-between mt-[8px] mb-[8px]">
        <div className="flex items-center gap-[6px] flex-1 min-w-0">
          <span className="text-body1 font-semibold text-gray-950 flex-shrink-0">
            {isEmpty ? "" : userNickname || "익명"}
          </span>
          <span
            className="text-body2 font-medium text-gray-500 truncate"
            style={
              maxTitleWidth
                ? { maxWidth: `${maxTitleWidth}px` }
                : { maxWidth: "500px" }
            }
          >
            {isEmpty ? "" : bookTitle || "제목 없음"}
          </span>
        </div>
        <div className="flex flex-shrink-0 ml-2">
          {isEmpty
            ? [...Array(5)].map((_, index) => (
                <Image
                  key={index}
                  src="/images/icon/ic_star_failled.svg"
                  alt="빈별점"
                  width={18}
                  height={18}
                />
              ))
            : renderStars(reviewRating || 0)}
        </div>
      </div>

      <div className="flex-1 mb-[12.75px]">
        <p
          className="text-body2 font-medium text-gray-800 overflow-hidden"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            lineHeight: "1.4",
            maxHeight: "calc(1.4em * 3)"
          }}
        >
          {isEmpty ? "" : reviewContent || "리뷰 내용이 없습니다."}
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-[12px]">
          <div className="flex items-center text-body3 font-medium text-gray-500">
            <Image
              src="/images/icon/ic_heart.svg"
              alt="좋아요"
              width={16}
              height={16}
              className="mr-[2px] w-4 h-4"
            />
            {isEmpty ? "" : likeCount || 0}
          </div>
          <div className="flex items-center text-body3 font-medium text-gray-500">
            <Image
              src="/images/icon/ic_comment.svg"
              alt="댓글"
              width={16}
              height={16}
              className="mr-[2px]"
            />
            {isEmpty ? "" : commentCount || 0}
          </div>
        </div>
        <div className="text-body3 font-medium text-gray-500">
          {isEmpty ? "" : formatDate(createdAt)}
        </div>
      </div>
    </div>
  );
}
