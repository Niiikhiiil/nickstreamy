import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("sTheme") || "coffee",
  setTheme: (theme) => {
    localStorage.setItem("sTheme", theme);
    set({ theme });
  },
}));
