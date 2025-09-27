import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  Notification as NotificationType
} from "@/api/notifications";
import { useAuthStore } from "@/store/authStore";
import { useTooltipStore } from "@/store/tooltipStore";

interface NotificationProps {
  className?: string;
  onNotificationRead?: () => void;
}

export default function Notification({
  className = "",
  onNotificationRead
}: NotificationProps) {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMarkingAllRead, setIsMarkingAllRead] = useState(false);
  const userId = useAuthStore(state => state.user?.id);
  const showTooltip = useTooltipStore(state => state.showTooltip);
  const router = useRouter();

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!userId) return;

      try {
        setIsLoading(true);
        const response = await getNotifications({
          userId,
          direction: "DESC",
          limit: 10
        });
        // 읽지 않은 알림만 표시
        setNotifications(
          response.content.filter(notification => !notification.confirmed)
        );
      } catch (error) {
        console.error("알림을 불러오는데 실패했습니다:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, [userId]);

  const handleMarkAllAsRead = async () => {
    if (!userId) {
      showTooltip("로그인이 필요합니다.", "");
      return;
    }

    try {
      setIsMarkingAllRead(true);
      await markAllNotificationsAsRead();
      showTooltip(
        "모든 알림을 읽음 처리했습니다.",
        "/images/icon/ic_check.svg"
      );

      // 알림 목록 비우기
      setNotifications([]);

      // NavBar 상태 업데이트
      onNotificationRead?.();
    } catch (error) {
      console.error("모든 알림을 읽음 처리하는데 실패했습니다:", error);
      showTooltip("모든 알림 읽음 처리에 실패했습니다.", "");
    } finally {
      setIsMarkingAllRead(false);
    }
  };

  const handleNotificationClick = async (notification: NotificationType) => {
    try {
      // 읽지 않은 알림이면 읽음 처리
      if (!notification.confirmed) {
        await markNotificationAsRead(notification.id);

        // 로컬 상태 업데이트
        setNotifications(prev =>
          prev.map(n =>
            n.id === notification.id ? { ...n, confirmed: true } : n
          )
        );

        // NavBar 상태 업데이트
        onNotificationRead?.();
      }

      // 해당 리뷰 페이지로 이동
      router.push(`/reviews/${notification.reviewId}`);
    } catch (error) {
      console.error("알림 처리에 실패했습니다:", error);
      showTooltip("알림 처리에 실패했습니다.", "");
    }
  };

  const getNotificationIcon = (content: string) => {
    if (content.includes("좋아요") || content.includes("좋아")) {
      return "/images/icon/ic_heart_red.svg";
    } else if (content.includes("댓글")) {
      return "/images/icon/ic_comment.svg";
    } else if (content.includes("인기") || content.includes("상")) {
      return "/images/icon/ic_award.svg";
    }
    return "/images/icon/ic_heart_red.svg"; // 기본값
  };

  const getNotificationAlt = (content: string) => {
    if (content.includes("좋아요") || content.includes("좋아")) {
      return "좋아요";
    } else if (content.includes("댓글")) {
      return "댓글";
    } else if (content.includes("인기") || content.includes("상")) {
      return "인기 리뷰";
    }
    return "알림";
  };

  return (
    <div
      className={`relative w-[370px] h-[630px] p-[20px_24px] rounded-[16px] bg-gray-0 border border-gray-200 shadow-[0px_4px_8px_0px_#18181805] flex flex-col ${className}`}
    >
      {notifications.length === 0 && !isLoading && (
        <div className="absolute inset-0 w-full h-full rounded-[16px] overflow-hidden flex items-center justify-center">
          <Image
            src="/images/notification/decorative_Background_pattern.png"
            alt="배경 패턴"
            width={336}
            height={336}
            className="object-cover"
          />
        </div>
      )}

      {/* 첫 번째 요소: 알림 제목/모두읽음 */}
      <div className="relative z-10 flex justify-between items-center mb-[14px]">
        <h2 className="text-title1 font-bold text-gray-800">알림</h2>
        <button
          className="text-body3 font-medium text-gray-500 underline decoration-solid underline-offset-0 decoration-0 decoration-skip-ink-auto my-[3.5px] disabled:opacity-50"
          onClick={handleMarkAllAsRead}
          disabled={isMarkingAllRead || isLoading}
        >
          {isMarkingAllRead ? (
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-500 mx-auto" />
          ) : (
            "모두 읽음"
          )}
        </button>
      </div>

      {/* 두 번째 요소: 알림 내용 */}
      <div className="relative z-10 flex flex-col flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            {/* 텍스트와 아이콘 - 알림 내용 영역의 정중앙 */}
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 bg-gray-0 rounded-lg border border-gray-200 flex items-center justify-center shadow-[0px_1px_2px_0px_#0A0D120D,0px_-2px_0px_0px_#0A0D120D_inset,0px_0px_0px_1px_#0A0D122E_inset]">
                <Image
                  src="/images/icon/ic_bell.svg"
                  alt="알림 없음"
                  width={24}
                  height={24}
                />
              </div>
              <p className="text-gray-500 text-sm">도착한 알림이 없습니다.</p>
            </div>
          </div>
        ) : (
          notifications.map(notification => (
            <div
              key={notification.id}
              className={`p-[24px_12px] rounded-lg cursor-pointer transition-colors duration-200 ${
                notification.confirmed
                  ? "border-t border-gray-100"
                  : "bg-gray-50"
              }`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex justify-between items-start">
                {/* 첫 번째 요소: 아이콘 + 알림 내용 */}
                <div className="flex gap-[10px]">
                  {/* 아이콘 */}
                  <div className="w-8 h-8 bg-gray-100 rounded-[6px] flex items-center justify-center flex-shrink-0">
                    <Image
                      src={getNotificationIcon(notification.content)}
                      alt={getNotificationAlt(notification.content)}
                      width={20}
                      height={20}
                    />
                  </div>

                  {/* 알림 내용 */}
                  <div className="flex flex-col gap-[8px]">
                    <p className="text-body2 font-medium text-gray-800">
                      {notification.content.split("\n")[0]}
                    </p>
                    <p className="text-body3 font-medium text-gray-500">
                      {notification.content.includes("\n")
                        ? notification.content.split("\n")[1]
                        : notification.reviewTitle}
                    </p>
                  </div>
                </div>

                {/* 두 번째 요소: 알림 표시 (읽지 않은 경우에만) */}
                {!notification.confirmed && (
                  <div className="w-[6px] h-[6px] bg-red-500 rounded-full flex-shrink-0 ml-[3px]"></div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
