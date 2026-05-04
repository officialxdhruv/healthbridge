import { doctors } from "@/assets/assets_frontend/assets";
import { create } from "zustand";

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
