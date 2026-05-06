import { create } from "zustand";
import { doctors } from "@/assets/assets_frontend/assets";

type AppState = {
  currencySymbol: string;
  backendUrl: string;
};

export const useAppStore = create(() => {
  return {
    currencySymbol: "₹",
    backendUrl: import.meta.env.VITE_BACKEND_URL,
    doctors,
  };
});
