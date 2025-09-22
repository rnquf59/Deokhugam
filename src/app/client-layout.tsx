"use client";

import dynamic from "next/dynamic";
import clsx from "clsx";
import { usePathname } from "next/navigation";

const NavBar = dynamic(() => import("@/components/ui/NavBar"), { ssr: false });
const Tooltip = dynamic(() => import("@/components/ui/Tooltip"), {
  ssr: false,
});

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
      <div
        className={clsx(
          !hideNavigation &&
            "min-h-[calc(100vh-67px)] mt-[67px] px-4 max-w-[1200px] mx-auto"
        )}
      >
        {children}
      </div>
      <Tooltip />
    </>
  );
}
