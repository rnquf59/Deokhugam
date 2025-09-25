import { useFormContext } from "react-hook-form";
import FormInputsContainer from "./FormInputsContainer";
import ImgUploadContainer from "./ImgUploadContainer";
import ButtonContainer from "./ButtonContainer";
import { AddBookFormValues } from "@/schemas/addBookSchema";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { postBook } from "@/api/books";
import { useTooltipStore } from "@/store/tooltipStore";

export default function FormFields() {
  const {
    register,
    control,
    setValue,
    setError,
    trigger,
    formState,
    watch,
    handleSubmit,
  } = useFormContext<AddBookFormValues>();

  const formMethods = {
    register,
    control,
    setValue,
    setError,
    trigger,
    watch,
    formState,
  };

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [fetchIsbnLoading, setFetchIsbnLoading] = useState(false);

  const showTooltip = useTooltipStore((state) => state.showTooltip);
  const { isValid, isSubmitting } = formState;
  const focusDisabled = fetchIsbnLoading || isSubmitting;
  const submitDisabled = fetchIsbnLoading || !isValid || isSubmitting;
  const router = useRouter();

  const onSubmit = async (data: AddBookFormValues) => {
    const formData = new FormData();

    const bookData = {
      isbn: data.isbn,
      title: data.title,
      author: data.author,
      publisher: data.publisher,
      publishedDate: data.publishedDate,
      description: data.description,
    };

    formData.append(
      "bookData",
      new Blob([JSON.stringify(bookData)], { type: "application/json" })
    );

    if (imageFile) {
      formData.append("thumbnailImage", imageFile);
    }

    try {
      await postBook(formData);
      showTooltip("도서 등록이 완료되었습니다!");
      router.push("/books");
    } catch (error) {
      setError("isbn", {
        type: "manual",
        message:
          "바코드가 중복되어 요청하신 ISBN을 사용할 수 없습니다. 다른 ISBN을 사용해주세요.",
      });

      console.error("도서 등록 실패:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <fieldset disabled={isSubmitting}>
        <div className="flex gap-10 mt-[30px]">
          <FormInputsContainer
            formMethods={formMethods}
            focusDisabled={focusDisabled}
            setFetchIsbnLoading={setFetchIsbnLoading}
            isSubmitting={isSubmitting}
          />
          <ImgUploadContainer setImageFile={setImageFile} />
        </div>
        <ButtonContainer
          disabled={submitDisabled}
          isSubmitting={isSubmitting}
        />
      </fieldset>
    </form>
  );
}
