import { create } from "zustand"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { getCurrentUser } from "./auth.service"
import { apiClient } from "@/api/apiClient.api"

type User = {
    userId: string
    email: string
    name?: string
    fullName?: string
    avatarUrl?: string
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
            const token = await AsyncStorage.getItem("auth_token")
            if (!token) {
                set({
                    user: null,
                    isAuthenticated: false,
                    isLoading: false
                })
                return
            }

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
            await AsyncStorage.removeItem("auth_token")
            await AsyncStorage.removeItem("refresh_token")
            set({ user: null, isAuthenticated: false })
        }
    }
}))