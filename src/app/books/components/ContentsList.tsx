import { Book } from "@/api/books";
import StarRating from "@/components/common/StarRating";
import DelayedLoader from "@/components/common/DelayedLoader";
import InfiniteScrollLoader from "@/components/common/InfiniteScrollLoader";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import clsx from "clsx";

export default function ContentsList({
  booksData,
  isLoading
}: {
  booksData: Book[];
  isLoading: boolean;
}) {
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const router = useRouter();

  return (
    <>
      <DelayedLoader isLoading={isLoading} delay={1000}>
        <InfiniteScrollLoader />
      </DelayedLoader>
      <div
        className={clsx(
          "flex gap-x-[2%] gap-y-[60px] w-full flex-wrap",
          "max-lg1050:gap-x-[3%]",
          "max-xs400:gap-x-0"
        )}
      >
        {booksData.map(book => {
          return (
            <div
              key={book.id}
              className={clsx(
                "w-[18%] cursor-pointer",
                "max-lg:w-[23%]",
                "max-lg1050:w-[31%]",
                "max-xs650:w-[48%]",
                "max-xs400:w-full"
              )}
              onClick={() => router.push(`/books/${book.id}`)}
            >
              <div className="relative h-[calc(100vw_*_(325/1920))] min-h-[325px] rounded overflow-hidden border">
                {book.thumbnailUrl && !imgErrors[book.id] && (
                  <Image
                    src={book.thumbnailUrl}
                    alt={book.title || "thumbnail"}
                    fill
                    unoptimized
                    onError={() =>
                      setImgErrors(prev => ({ ...prev, [book.id]: true }))
                    }
                  />
                )}
                {(!book.thumbnailUrl || imgErrors[book.id]) && (
                  <Image
                    src="/images/books/imgError.png"
                    alt="이미지 없음"
                    fill
                  />
                )}
              </div>
              <p className="mt-4 font-bold text-gray-950 line-clamp-2">
                {book.title}
              </p>
              <p className="text-gray-500 font-medium line-clamp-1 mb-3">
                {book.author}
              </p>
              <div className="flex items-center gap-1">
                <StarRating rating={book.rating} />
                <span className="text-body4 font-medium text-gray-500">
                  ({book.reviewCount})
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
