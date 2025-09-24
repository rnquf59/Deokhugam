import z from "zod";

export const addBookSchema = z.object({
  isbn: z.string().min(1, "ISBN 정보를 불러와주세요."),
  title: z.string().min(1, "제목을 입력해주세요.").max(100),
  author: z.string().min(1, "저자를 입력해주세요.").max(50),
  publisher: z.string().min(1, "출판사를 입력해주세요.").max(50),
  publishedDate: z.string().min(1, "출판일을 선택해주세요."),
  description: z.string().min(1, "설명을 입력해주세요.").max(500),
});

export type AddBookFormValues = z.infer<typeof addBookSchema>;
