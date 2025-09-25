"use client";

import { memo } from "react";
import Selectbox from "@/components/ui/Selectbox";
import SearchBar from "@/components/ui/SearchBar";
import { REVEWS_ORDERBY, SORT_DIRECTION } from "@/constants/selectOptions";

interface ReviewSearchSectionProps {
  orderBy: "createdAt" | "rating";
  direction: "DESC" | "ASC";
  onSearch: (value: string) => void;
  onOrderByChange: (value: "createdAt" | "rating") => void;
  onDirectionChange: (value: "DESC" | "ASC") => void;
}

const ReviewSearchSection = memo(function ReviewSearchSection({
  orderBy,
  direction,
  onSearch,
  onOrderByChange,
  onDirectionChange
}: ReviewSearchSectionProps) {
  return (
    <div className="flex justify-between items-center mb-[30px]">
      <div>
        <SearchBar onSearch={onSearch} />
      </div>

      <div className="flex gap-2">
        <Selectbox
          options={REVEWS_ORDERBY}
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

export default ReviewSearchSection;
