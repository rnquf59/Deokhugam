import { deleteReview, getReviews } from "@/api/reviews";
import Modal from "@/components/ui/Modal";
import { useTooltipStore } from "@/store/tooltipStore";
import { Review } from "@/types/reviews";
import { Dispatch, SetStateAction, useState } from "react";

export default function ReviewDeleteModal({
  isOpen,
  close,
  reviewId,
  data,
  setData,
  bookId
}: {
  isOpen: boolean;
  close: () => void;
  reviewId: string;
  data: Review[];
  setData: Dispatch<SetStateAction<Review[]>>;
  bookId: string;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showTooltip } = useTooltipStore();

  const handleDeleteReview = async () => {
    setIsSubmitting(true);
    try {
      await deleteReview(reviewId);

      setData(prev => prev.filter(r => r.id !== reviewId));

      const refreshed = await getReviews(bookId, { limit: data.length });
      setData(refreshed.content);

      close();
      showTooltip("리뷰를 정상적으로 삭제하였습니다!");
    } catch (error) {
      console.error("리뷰 삭제 실패:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isDelete
      isOpen={isOpen}
      onClose={close}
      disabled={isSubmitting}
      buttonText="삭제"
      action={handleDeleteReview}
    >
      <p className="font-medium">리뷰를 삭제하시겠습니까?</p>
    </Modal>
  );
}
