interface BookDetailPageProps {
  params: {
    id: string;
  };
}

export default function BookDetailPage({ params }: BookDetailPageProps) {
  return (
    <div>
      <h1>도서 상세 페이지</h1>
      <p>도서 ID: {params.id}</p>
    </div>
  );
}
