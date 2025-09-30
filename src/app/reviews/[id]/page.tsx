"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useAuthGuard } from "@/hooks/auth/useAuthRedirect";
import LoadingScreen from "@/components/common/LoadingScreen";
import ReviewHeader from "./components/ReviewHeader";
import CommentSection from "./components/CommentSection";

export default function ReviewDetailPage() {
  const { shouldShowContent } = useAuthGuard();
  const params = useParams();
  const reviewId = params.id as string;
  const [commentCount, setCommentCount] = useState<number | undefined>(
    undefined
  );

  if (!shouldShowContent) {
    return <LoadingScreen />;
  }

  return (
    <div className="pt-[50px] pb-[80px] h-[inherit] min-h-[inherit] flex flex-col gap-[40px]">
      <ReviewHeader reviewId={reviewId} commentCount={commentCount} />
      <CommentSection
        reviewId={reviewId}
        onCommentCountChange={setCommentCount}
      />
    </div>
  );
}
