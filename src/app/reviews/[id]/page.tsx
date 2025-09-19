interface ReviewDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ReviewDetailPage({ params }: ReviewDetailPageProps) {
  const { id } = await params;
  
  return (
    <div className="min-h-screen bg-gray-0 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-header1 font-bold text-gray-900 mb-8">
          상세 리뷰 페이지
        </h1>
        <p className="text-body2 text-gray-600 mb-4">
          리뷰 ID: {id}
        </p>
        <p className="text-body2 text-gray-600">
          여기에 상세 리뷰 내용이 들어갑니다.
        </p>
      </div>
    </div>
  );
}
