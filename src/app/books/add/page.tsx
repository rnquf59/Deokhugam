"use client";

import { useAuthGuard } from "@/hooks/auth/useAuthRedirect";
import LoadingScreen from "@/components/common/LoadingScreen";
import PageHead from "../components/bookForm/PageHead";
import FormContainer from "../components/bookForm/FormContainer";
import FormFields from "../components/bookForm/FormFields";

export default function AddBookPage() {
  const { shouldShowContent } = useAuthGuard();

  if (!shouldShowContent) {
    return <LoadingScreen />;
  }

  return (
    <div className="pt-[50px]">
      <PageHead mode="add" />
      <FormContainer>
        <FormFields/>
      </FormContainer>
    </div>
  );
}
