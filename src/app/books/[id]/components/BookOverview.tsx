import { ReactNode } from "react";

export default function BookOverview({
  children,
  id,
}: {
  children: ReactNode;
  id: string;
}) {
  return (
    <div className="flex gap-[34px] pt-[50px] pb-[60px] border-b border-gray-100">
      {children}
    </div>
  );
}
