"use client";

import { memo } from "react";
import Selectbox from "@/components/ui/Selectbox";
import SearchBar from "@/components/ui/SearchBar";
import { BOOKS_ORDERBY, SORT_DIRECTION } from "@/constants/selectOptions";
import clsx from "clsx";

interface BookSearchSectionProps {
  orderBy: "title" | "publishedDate" | "rating" | "reviewCount";
  direction: "ASC" | "DESC";
  onSearch: (value: string) => void;
  onOrderByChange: (
    value: "title" | "publishedDate" | "rating" | "reviewCount"
  ) => void;
  onDirectionChange: (value: "ASC" | "DESC") => void;
}

const BookSearchSection = memo(function BookSearchSection({
  orderBy,
  direction,
  onSearch,
  onOrderByChange,
  onDirectionChange
}: BookSearchSectionProps) {
  return (
    <div
      className={clsx(
        "flex justify-between items-center mb-[30px]",
        "max-xs650:flex-col max-xs650:items-start gap-y-4"
      )}
    >
      <div className="max-xs650:flex-[1] max-xs650:w-full">
        <SearchBar onSearch={onSearch} />
      </div>
      
      <div className="flex gap-2">
        <Selectbox
          options={BOOKS_ORDERBY}
          value={orderBy}
          onChange={onOrderByChange}
        />
        <Selectbox
          options={SORT_DIRECTION}
          value={direction}
          onChange={onDirectionChange}
        />
      </div>
    </div>
  );
});

export default BookSearchSection;
