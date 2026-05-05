import { create } from "zustand";

// import { doctors } from "@/assets/assets_frontend/assets";

type AppState = {
  currencySymbol: string;
  backendUrl: string;
  role: "Admin" | "Doctor" | null;
};

export const useAppStore = create<AppState>(() => {
  return {
    currencySymbol: "₹",
    backendUrl: import.meta.env.VITE_BACKEND_URL,
    role: null,
  };
});
