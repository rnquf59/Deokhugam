import Image from "next/image";
import { useRouter } from "next/navigation";

export default function PageHead() {
  const router = useRouter();

  return (
    <div className="flex justify-between items-center mb-5">
      <p className="text-header1 font-bold">도서 리스트 둘러보기</p>
      <button
        className="flex items-center gap-1 bg-gray-900 text-white rounded-full px-[18px] py-3 font-medium"
        onClick={() => router.push("/books/add")}
      >
        <Image src="/images/icon/ic_plus.svg" alt="+" width={18} height={18} />{" "}
        도서 등록
      </button>
    </div>
  );
}
