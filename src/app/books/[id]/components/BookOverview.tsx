import { BookResponse, getBookDetail } from "@/api/books";
import { ReactNode, useEffect, useState } from "react";

type Props = {
  id: string;
  children: (props: { data: BookResponse | null }) => ReactNode;
};

export default function BookOverview({ children, id }: Props) {
  const [data, setData] = useState<BookResponse | null>(null);

  useEffect(() => {
    const fetchBookDetail = async () => {
      try {
        const response = await getBookDetail(id);
        setData(response);
      } catch (err) {
        console.error("도서 상세 조회 실패:", err);
      }
    };

    fetchBookDetail();
  }, [id]);

  return (
    <div className="flex gap-[34px] pt-[50px] pb-[60px] border-b border-gray-100">
      {children({ data })}
    </div>
  );
}
