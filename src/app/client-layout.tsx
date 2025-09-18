"use client";

import NavBar from "@/components/ui/NavBar";
import clsx from "clsx";
import { usePathname } from "next/navigation";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideNavigation =
    pathname === "/auth/login" || pathname === "/auth/signup";

  return (
    <>
      {!hideNavigation && <NavBar />}
      <div className={clsx(!hideNavigation && "mt-[67px]")}>{children}</div>
    </>
  );
}
