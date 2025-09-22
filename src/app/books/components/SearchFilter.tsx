import Selectbox from "@/components/ui/Selectbox";
import { BOOKS_ORDERBY, SORT_DIRECTION } from "@/constants/selectOptions";
import clsx from "clsx";
import Image from "next/image";
import { Dispatch, SetStateAction } from "react";

export default function SearchFilter({
  orderBy,
  direction,
  setOrderBy,
  setDirection,
  setKeyword,
}: {
  orderBy: string;
  direction: string;
  setOrderBy: Dispatch<
    SetStateAction<"title" | "publishedDate" | "rating" | "reviewCount">
  >;
  setDirection: Dispatch<SetStateAction<"ASC" | "DESC">>;
  setKeyword: Dispatch<SetStateAction<string>>;
}) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setKeyword(e.currentTarget.value);
    }
  };
  return (
    <div className="flex items-center justify-between mb-[30px]">
      <div className="flex items-center bg-gray-100 h-[46px] p-5 gap-2 rounded-full w-[calc(100vw_*_(300/1920))] min-w-[290px]">
        <Image
          src="/images/icon/ic_search.svg"
          alt="Search"
          width={20}
          height={20}
        />
        <input
          type="text"
          placeholder="내가 찾는 책 이름을 검색해보세요"
          onKeyDown={handleKeyDown}
          className={clsx(
            "bg-gray-100 w-full font-medium",
            "placeholder:font-medium"
          )}
        />
      </div>
      <div className="flex items-center gap-2">
        <Selectbox
          options={BOOKS_ORDERBY}
          value={orderBy}
          onChange={(v) =>
            setOrderBy(
              v as "title" | "publishedDate" | "rating" | "reviewCount"
            )
          }
        />
        <Selectbox
          options={SORT_DIRECTION}
          value={direction}
          onChange={(v) => setDirection(v as "ASC" | "DESC")}
        />
      </div>
    </div>
  );
}
