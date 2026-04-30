import { create } from "zustand";

type AppState = {
    currencySymbol: string,
    backendUrl: string,

    doctors: any[],
    userData: any,

    setDoctors: () => void
}

export const useAppStore = create<AppState>((set) => {
    return {
        currencySymbol: '₹',
        backendUrl: import.meta.env.VITE_BACKEND_URL,

        doctors: [],
        userData: null,

        setDoctors() {

        }
    }
})