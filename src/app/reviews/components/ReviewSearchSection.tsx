"use client";

import { memo } from "react";
import Selectbox from "@/components/ui/Selectbox";
import SearchBar from "@/components/ui/SearchBar";

interface ReviewSearchSectionProps {
  sortBy: "time" | "rating";
  orderBy: "asc" | "desc";
  onSearch: (value: string) => void;
  onSortByChange: (value: "time" | "rating") => void;
  onOrderByChange: (value: "asc" | "desc") => void;
}

const ReviewSearchSection = memo(function ReviewSearchSection({
  sortBy,
  orderBy,
  onSearch,
  onSortByChange,
  onOrderByChange,
}: ReviewSearchSectionProps) {
  return (
    <div className="flex justify-between items-center mb-[30px]">
      <div>
        <SearchBar onSearch={onSearch} />
      </div>

      <div className="flex gap-2">
        <Selectbox
          options={[
            { value: "time", label: "시간순" },
            { value: "rating", label: "평점순" },
          ]}
          value={sortBy}
          onChange={onSortByChange}
        />
        <Selectbox
          options={[
            { value: "desc", label: "내림차순" },
            { value: "asc", label: "오름차순" },
          ]}
          value={orderBy}
          onChange={onOrderByChange}
        />
      </div>
    </div>
  );
});

export default ReviewSearchSection;
