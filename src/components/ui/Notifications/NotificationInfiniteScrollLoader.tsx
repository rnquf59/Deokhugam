import Image from "next/image";

export default function NotificationInfiniteScrollLoader() {
  return (
    <div className="flex items-center justify-center py-4">
      <div className="text-center">
        <Image
          src="/images/notification/scroll_Loading.gif"
          alt="알림 로딩 중..."
          width={100}
          height={100}
          unoptimized
        />
      </div>
    </div>
  );
}
