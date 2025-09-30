import { useMediaQuery } from "react-responsive";

export default function useResponsiveLimit(type: "bookList" | "popularBook") {
  if (!type) return;

  if (type === "bookList") {
    const isDesktop = useMediaQuery({ minWidth: 1200 });
    const isTabletPC = useMediaQuery({ minWidth: 769 });

    if (isDesktop) return 10;
    if (isTabletPC) return 8;
    return 6;
  }

  if (type === "popularBook") {
    const isDesktop = useMediaQuery({ minWidth: 941 });
    const isTabletPC = useMediaQuery({ minWidth: 707 });
    const isTablet = useMediaQuery({ minWidth: 474 });

    if (isDesktop) return 4;
    if (isTabletPC) return 3;
    if (isTablet) return 2;
    return 1;
  }
}
