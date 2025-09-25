import { BookResponse } from "@/api/books";
import Image from "next/image";
import { useState } from "react";

export default function BookThumbnail({ data }: { data: BookResponse | null }) {
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  return (
    <div className="relative min-w-[400px] min-h-[600px] max-h-[600px] w-[calc(100vw_*_(400/1920)) h-[calc(100vh_*_(600/1344))]] border rounded-xl overflow-hidden">
      {data?.thumbnailUrl && !imgErrors[data.id] && (
        <Image
          src={data.thumbnailUrl}
          alt={data.title || "thumbnail"}
          fill
          unoptimized
          onError={() => setImgErrors((prev) => ({ ...prev, [data.id]: true }))}
        />
      )}
      {(!data?.thumbnailUrl || imgErrors[data.id]) && (
        <Image src="/images/books/imgError.png" alt="이미지 없음" fill />
      )}
    </div>
  );
}
