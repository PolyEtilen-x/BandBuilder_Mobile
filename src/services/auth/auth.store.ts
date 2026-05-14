import { create } from "zustand"
import { getCurrentUser } from "./auth.service"
import { apiClient } from "@/api/apiClient.api"

type User = {
    userId: string
    email: string
    //and more data
}

type AuthState = {
    user: User | null
    isLoading: boolean
    isAuthenticated: boolean

    initAuth: () => Promise<void>
    setUser: (user: User | null) => void
    logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isLoading: true,
    isAuthenticated: false,

    initAuth: async () => {
        set({ isLoading: true })

        try {
            const user = await getCurrentUser()

            set({
                user,
                isAuthenticated: !!user,
                isLoading: false
            })
        } catch {
            set({
                user: null,
                isAuthenticated: false,
                isLoading: false
            })
        }
    },

    setUser: (user) => {
        set({
            user,
            isAuthenticated: !!user
        })
    },

    logout: async () => {
        try {
            await apiClient.post("/auth/logout")
        } catch (e) {
            console.log("logout error:", e)
        } finally {
            set({ user: null, isAuthenticated: false })
        }
    }
}))