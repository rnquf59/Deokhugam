"use client";

import dynamic from "next/dynamic";
import clsx from "clsx";
import { usePathname } from "next/navigation";

const NavBar = dynamic(() => import("@/components/ui/NavBar"), {
  ssr: false
});
const Tooltip = dynamic(() => import("@/components/ui/Tooltip"), {
  ssr: false
});
const Footer = dynamic(() => import("@/components/ui/Footer"), { ssr: false });

export default function ClientLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideNavigation =
    pathname === "/auth/login" || pathname === "/auth/signup";

  const hideFooter =
    pathname === "/auth/login" ||
    pathname === "/auth/signup" ||
    pathname.startsWith("/books/add") ||
    pathname.startsWith("/books/") ||
    pathname.startsWith("/reviews/");

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
      {!hideFooter && <Footer />}
      <Tooltip />
    </>
  );
}
