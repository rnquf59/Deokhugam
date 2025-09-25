"use client";

import { useEffect, useState } from "react";
import FormContainer from "../../components/bookForm/FormContainer";
import PageHead from "../../components/bookForm/PageHead";
import { BookResponse, getBookDetail } from "@/api/books";
import LoadingScreen from "@/components/common/LoadingScreen";
import { useParams } from "next/navigation";
import FormFields from "../../components/bookForm/FormFields";

export default function EditBookPage() {
  const params = useParams();
  const parmasId = params.id;
  const id = String(parmasId);

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

  if (!data) return <LoadingScreen />;

  return (
    <div className="pt-[50px]">
      <PageHead mode="edit" />
      <FormContainer defaultValues={data}>
        <FormFields id={id} data={data} isEdit />
      </FormContainer>
    </div>
  );
}
