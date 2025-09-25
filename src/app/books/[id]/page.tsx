"use client";

import { useAuthGuard } from "@/hooks/auth/useAuthRedirect";
import LoadingScreen from "@/components/common/LoadingScreen";
import { useParams } from "next/navigation";
import BookOverview from "./components/BookOverview";
import BookThumbnail from "./components/BookThumbnail";
import BookInfo from "./components/BookInfo";

export default function BookDetailPage() {
  const params = useParams();
  const parmasId = params.id;
  const id = String(parmasId);

  const { shouldShowContent } = useAuthGuard();

  if (!shouldShowContent) {
    return <LoadingScreen />;
  }

  return (
    <>
      <BookOverview id={id}>
        <BookThumbnail />
        <BookInfo />
      </BookOverview>
    </>
  );
}
