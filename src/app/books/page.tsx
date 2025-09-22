"use client";

import { useAuthGuard } from "@/hooks/auth/useAuthRedirect";
import LoadingScreen from "@/components/common/LoadingScreen";
import PageHead from "./components/PageHead";
import SearchFilter from "./components/SearchFilter";
import { useEffect, useState } from "react";
import ContentsList from "./components/ContentsList";
import { Book, BooksParams, getBooks } from "@/api/books";
import { useInfiniteScroll } from "@/hooks/common/useInfiniteScroll";

export default function BooksPage() {
  const [orderBy, setOrderBy] = useState<
    "title" | "publishedDate" | "rating" | "reviewCount"
  >("title");
  const [direction, setDirection] = useState<"ASC" | "DESC">("DESC");
  const [keyword, setKeyword] = useState("");
  const [booksData, setBooksData] = useState<Book[]>([]);
  const limit = 10;

  const { isLoading, setCursor, setAfter, resetInfiniteScroll } =
    useInfiniteScroll<Book, BooksParams>({
      initialParams: { orderBy, direction, keyword, limit },
      fetcher: getBooks,
      setData: setBooksData,
    });

  const fetchBook = async () => {
    try {
      const response = await getBooks({ orderBy, direction, keyword, limit });
      setBooksData(response.content);
      setCursor(response.nextCursor);
      setAfter(response.nextAfter);
    } catch (err) {
      console.error("도서 조회 실패:", err);
    }
  };

  useEffect(() => {
    resetInfiniteScroll();
    setBooksData([]);
    fetchBook();
  }, [orderBy, direction, keyword]);

  const { shouldShowContent } = useAuthGuard();

  if (!shouldShowContent) {
    return <LoadingScreen />;
  }

  return (
    <div className="pt-[50px] pb-[80px]">
      <PageHead />
      <SearchFilter
        orderBy={orderBy}
        direction={direction}
        setOrderBy={setOrderBy}
        setDirection={setDirection}
        setKeyword={setKeyword}
      />
      {booksData && (
        <ContentsList booksData={booksData} isLoading={isLoading} />
      )}
    </div>
  );
}
