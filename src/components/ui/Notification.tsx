import React from "react";
import Image from "next/image";

interface NotificationProps {
  className?: string;
}

export default function Notification({ className = "" }: NotificationProps) {
  return (
    <div
      className={`w-[370px] h-[630px] p-[20px_24px] rounded-[16px] bg-gray-0 border border-gray-200 shadow-[0px_4px_8px_0px_#18181805] ${className}`}
    >
      {/* 첫 번째 요소: 알림 제목/모두읽음 */}
      <div className="flex justify-between items-center mb-[14px]">
        <h2 className="text-title1 font-bold text-gray-800">알림</h2>
        <button className="text-body3 font-medium text-gray-500 underline decoration-solid underline-offset-0 decoration-0 decoration-skip-ink-auto my-[3.5px]">
          모두 읽음
        </button>
      </div>

      {/* 두 번째 요소: 알림 내용 */}
      <div className="flex flex-col">
        {/* 알림 아이템 1 */}
        <div className="p-[24px_12px] bg-gray-50 rounded-lg">
          <div className="flex justify-between items-start">
            {/* 첫 번째 요소: 아이콘 + 알림 내용 */}
            <div className="flex gap-[10px]">
              {/* 아이콘 */}
              <div className="w-8 h-8 bg-gray-100 rounded-[6px] flex items-center justify-center">
                <Image
                  src="/images/icon/ic_heart_red.svg"
                  alt="좋아요"
                  width={20}
                  height={20}
                />
              </div>

              {/* 알림 내용 */}
              <div className="flex flex-col gap-[8px]">
                <p className="text-body2 font-medium text-gray-800">
                  user 님이 내 리뷰를 좋아합니다.
                </p>
                <p className="text-body3 font-medium text-gray-500">
                  리뷰 내용 1줄만 노출
                </p>
              </div>
            </div>

            {/* 두 번째 요소: 알림 표시 */}
            <div className="w-[6px] h-[6px] bg-red-500 rounded-full"></div>
          </div>
        </div>

        {/* 알림 아이템 2 */}
        <div className="p-[24px_12px] bg-gray-50 rounded-lg">
          <div className="flex justify-between items-start">
            {/* 첫 번째 요소: 아이콘 + 알림 내용 */}
            <div className="flex gap-[10px]">
              {/* 아이콘 */}
              <div className="w-8 h-8 bg-gray-100 rounded-[6px] flex items-center justify-center">
                <Image
                  src="/images/icon/ic_comment.svg"
                  alt="댓글"
                  width={20}
                  height={20}
                />
              </div>

              {/* 알림 내용 */}
              <div className="flex flex-col gap-[8px]">
                <p className="text-body2 font-medium text-gray-800">
                  user 님이 내 리뷰에 댓글을 남겼어요.
                </p>
                <p className="text-body3 font-medium text-gray-500">
                  댓글 내용 1줄만 노출
                </p>
              </div>
            </div>

            {/* 두 번째 요소: 알림 표시 */}
            <div className="w-[6px] h-[6px] bg-red-500 rounded-full"></div>
          </div>
        </div>

        {/* 알림 아이템 3 */}
        <div className="p-[24px_12px] bg-gray-50 rounded-lg">
          <div className="flex justify-between items-start">
            {/* 첫 번째 요소: 아이콘 + 알림 내용 */}
            <div className="flex gap-[10px]">
              {/* 아이콘 */}
              <div className="w-8 h-8 bg-gray-100 rounded-[6px] flex items-center justify-center">
                <Image
                  src="/images/icon/ic_award.svg"
                  alt="인기 리뷰"
                  width={20}
                  height={20}
                />
              </div>

              {/* 알림 내용 */}
              <div className="flex flex-col gap-[8px]">
                <p className="text-body2 font-medium text-gray-800">
                  내 리뷰가 인기 리뷰로 등록되었어요.
                </p>
                <p className="text-body3 font-medium text-gray-500">
                  리뷰 내용 1줄만 노출
                </p>
              </div>
            </div>

            {/* 두 번째 요소: 알림 표시 */}
            <div className="w-[6px] h-[6px] bg-red-500 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
