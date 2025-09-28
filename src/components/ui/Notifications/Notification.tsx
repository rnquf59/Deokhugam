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
        setNotifications(response.content);
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

      <div className="relative z-10 flex flex-col flex-1 overflow-y-auto">
        {isLoading ? (
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
          notifications.map(notification => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onNotificationClick={handleNotificationClick}
            />
          ))
        )}
      </div>
    </div>
  );
}
