import { useMediaQuery } from "react-responsive";

export default function useResponsiveLimit() {
  const isDesktop = useMediaQuery({ minWidth: 1200 });
  const isTabletPC = useMediaQuery({ minWidth: 769 });

  if (isDesktop) return 10;
  if (isTabletPC) return 8;
  return 6;
}
