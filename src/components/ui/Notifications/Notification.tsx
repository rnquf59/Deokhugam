import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  Notification as NotificationType
} from "@/api/notifications";
import { apiClient } from "@/api/client";

import { useAuthStore } from "@/store/authStore";
import { useTooltipStore } from "@/store/tooltipStore";
import { useInfiniteScroll } from "@/hooks/common/useInfiniteScroll";
import InfiniteScrollLoader from "@/components/common/InfiniteScrollLoader";
import NotificationHeader from "./NotificationHeader";
import NotificationItem from "./NotificationItem";
import NotificationEmptyState from "./NotificationEmptyState";

interface NotificationProps {
  className?: string;
  onNotificationRead?: () => void;
  onClose?: () => void;
}

export default function Notification({
  className = "",
  onNotificationRead,
  onClose
}: NotificationProps) {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [isMarkingAllRead, setIsMarkingAllRead] = useState(false);
  const userId = useAuthStore(state => state.user?.id);
  const showTooltip = useTooltipStore(state => state.showTooltip);
  const router = useRouter();

  const { isLoading, resetInfiniteScroll, fetchMore } = useInfiniteScroll({
    initialParams: userId
      ? {
          userId,
          direction: "DESC" as const,
          limit: 7
        }
      : undefined,
    fetcher: getNotifications,
    setData: setNotifications
  });

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const { scrollTop, scrollHeight, clientHeight } = target;

    // 스크롤이 맨 아래에서 200px 전에 도달하면 무한스크롤 트리거
    if (scrollTop + clientHeight >= scrollHeight - 100 && !isLoading) {
      fetchMore();
    }
  };

  useEffect(() => {
    const fetchInitialNotifications = async () => {
      if (!userId) return;

      try {
        const response = await getNotifications({
          userId,
          direction: "DESC",
          limit: 7
        });
        setNotifications(response.content);
      } catch (error) {
        console.error("알림을 불러오는데 실패했습니다:", error);
      }
    };

    setNotifications([]);
    resetInfiniteScroll();
    fetchInitialNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

      setNotifications(prev =>
        prev.map(notification => ({ ...notification, confirmed: true }))
      );

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
      if (!notification.confirmed) {
        await markNotificationAsRead(notification.id);

        setNotifications(prev =>
          prev.map(n =>
            n.id === notification.id ? { ...n, confirmed: true } : n
          )
        );

        onNotificationRead?.();
      }

      try {
        const authState = useAuthStore.getState();
        await apiClient.get(`/api/reviews/${notification.reviewId}`, {
          skipInterceptor: true,
          headers: {
            ...(authState.user?.id && {
              "Deokhugam-Request-User-ID": authState.user.id
            })
          }
        });
      } catch (error) {
        const axiosError = error as { response?: { status?: number } };
        const status = axiosError?.response?.status;

        if (status === 404 || status === 500) {
          showTooltip("현재 해당 알림은 존재하지 않습니다.", "");
          onClose?.();
          return;
        }
      }

      router.push(`/reviews/${notification.reviewId}`);
      onClose?.();
    } catch (error) {
      console.error("알림 처리에 실패했습니다:", error);
      showTooltip("알림 처리에 실패했습니다.", "");
    }
  };

  return (
    <div
      className={`relative w-[370px] h-[630px] p-[20px_24px] rounded-[16px] bg-gray-0 border border-gray-200 shadow-[0px_4px_8px_0px_#18181805] flex flex-col ${className}`}
    >
      {notifications.length === 0 && !isLoading && <NotificationEmptyState />}

      <NotificationHeader
        isMarkingAllRead={isMarkingAllRead}
        onMarkAllAsRead={handleMarkAllAsRead}
      />

      <div
        className="relative z-10 flex flex-col flex-1 overflow-y-auto"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#D7D7DB transparent"
        }}
        onScroll={handleScroll}
      >
        {isLoading && notifications.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="relative z-10 flex items-center justify-center h-full text-gray-500">
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
          <>
            {notifications.map(notification => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onNotificationClick={handleNotificationClick}
              />
            ))}
            {isLoading && (
              <div className="flex justify-center py-4">
                <InfiniteScrollLoader />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
