interface BookDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function BookDetailPage({ params }: BookDetailPageProps) {
  const { id } = await params;
  
  return (
    <div>
      <h1>도서 상세 페이지</h1>
      <p>도서 ID: {id}</p>
    </div>
  );
}
