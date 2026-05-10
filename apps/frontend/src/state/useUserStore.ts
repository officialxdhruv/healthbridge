import { create } from "zustand"
import { persist } from "zustand/middleware"

type UserStore = {
    isLoggedIn: boolean
    setLoggedIn: (value: boolean) => void
    logout: () => void
}

export const useUserStore = create<UserStore>()(
    persist(
        (set) => ({
            isLoggedIn: false,
            setLoggedIn: (value) => set({ isLoggedIn: value }),
            logout: () => set({ isLoggedIn: false }),
        }),
        { name: "user-auth" }
    )
)