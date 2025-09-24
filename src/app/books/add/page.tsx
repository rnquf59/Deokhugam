"use client";

import { useAuthGuard } from "@/hooks/auth/useAuthRedirect";
import LoadingScreen from "@/components/common/LoadingScreen";
import PageHead from "./components/PageHead";
import FormContainer from "./components/FormContainer";
import FormFields from "./components/FormFields";

export default function AddBookPage() {
  const { shouldShowContent } = useAuthGuard();

  if (!shouldShowContent) {
    return <LoadingScreen />;
  }

  return (
    <div className="pt-[50px]">
      <PageHead />
      <FormContainer>
        <FormFields />
      </FormContainer>
    </div>
  );
}
