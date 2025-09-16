import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("buddy-theme") || "coffee",
  setTheme: (theme) => {
    localStorage.setItem("buddy-theme", theme);
    set({ theme });
  },
})); 