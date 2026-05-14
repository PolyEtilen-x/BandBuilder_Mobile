import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { SidebarState } from "@/data/practices/practice.types"

interface PracticeStore {
    sidebar: SidebarState
    answers: Record<string, any>

    setSidebar: (state: Partial<SidebarState>) => void
    resetSidebar: () => void

    setAnswer: (id: string, value: any) => void
    clearAnswers: () => void
}

export const usePracticeStore = create<PracticeStore>()(
    persist(
        (set) => ({
            sidebar: {
                skill: "listening",
                mode: "single",
                subSection: 1,
            },
            answers: {},

            setSidebar: (newState) =>
                set((state) => ({
                    sidebar: { ...state.sidebar, ...newState }
                })),

            resetSidebar: () =>
                set({ sidebar: { skill: "listening", mode: "single", subSection: 1 } }),

            setAnswer: (id, value) =>
                set((state) => ({
                    answers: { ...state.answers, [id]: value }
                })),

            clearAnswers: () => set({ answers: {} })
        }),
        {
            name: "practice-storage",
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
)
