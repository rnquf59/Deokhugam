import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TooltipState {
  isVisible: boolean;
  content: string;
  showTooltip: (content: string) => void;
  hideTooltip: () => void;
}

export const useTooltipStore = create<TooltipState>()(
  persist(
    (set) => ({
      isVisible: false,
      content: "",
      x: 0,
      y: 0,
      showTooltip: (content, duration = 3000) => {
        set({ isVisible: true, content });

        setTimeout(() => {
          set({ isVisible: false });
        }, duration);
      },
      hideTooltip: () => set({ isVisible: false }),
    }),
    {
      name: "tooltip-storage",
      partialize: (state) => ({ isVisible: state.isVisible }),
    }
  )
);
