"use client";

import { memo } from "react";
import Selectbox from "@/components/ui/Selectbox";
import SearchBar from "@/components/ui/SearchBar";
import { BOOKS_ORDERBY, SORT_DIRECTION } from "@/constants/selectOptions";

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
    <div className="flex justify-between items-center mb-[30px]">
      <div>
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
