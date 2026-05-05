// src/state/useAuthStore.ts
import { create } from "zustand"
import { persist } from "zustand/middleware"

type Role = "Admin" | "Doctor" | null

interface AuthStore {
    role: Role
    setRole: (role: Role) => void
    logout: () => void
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            role: null,
            setRole: (role) => set({ role }),
            logout: () => set({ role: null }),
        }),
        { name: "auth" }
    )
)