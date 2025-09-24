import { AddBookFormValues, addBookSchema } from "@/schemas/addBookSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

export default function FormContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const methods = useForm<AddBookFormValues>({
    mode: "onChange",
    resolver: zodResolver(addBookSchema),
    defaultValues: {
      isbn: "",
      title: "",
      author: "",
      description: "",
      publisher: "",
      publishedDate: "",
    },
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
}
