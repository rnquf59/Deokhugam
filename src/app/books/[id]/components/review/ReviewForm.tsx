
import clsx from "clsx";
import { useRef, useState } from "react";
import ReviewRating from "./ReviewRating";
import { textareaStyle } from "@/app/books/styles";

export default function ReviewForm({
  totalElements
}: {
  totalElements: number;
}) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [hasText, setHasText] = useState(false);

  const handleChange = () => {
    const value = textareaRef.current?.value ?? "";
    setHasText(value.length > 0);
  };

  return (
    <div className="mt-[34px]">
      <div className="flex items-center gap-[4px] mb-[15px]">
        <h2 className="text-body1 font-semibold text-gray-900">리뷰</h2>
        <span className="text-body1 font-semibold text-gray-500">
          {totalElements ? totalElements : ""}
        </span>
      </div>
      <form>
        <ReviewRating />
        <textarea
          ref={textareaRef}
          className={clsx(textareaStyle, "w-full")}
          placeholder="리뷰에 대한 댓글을 작성해주세요"
          onChange={handleChange}
        />
        <div className="flex justify-end mt-[15px]">
          <button
            className={clsx(
              "inline-flex items-center justify-center font-medium transition-colors gap-1 px-[18px] py-[14px] rounded-full bg-gray-900 text-gray-0 text-body2",
              "disabled:bg-gray-500"
            )}
            disabled={!hasText}
          >
            등록
          </button>
        </div>
      </form>
    </div>
  );
}
