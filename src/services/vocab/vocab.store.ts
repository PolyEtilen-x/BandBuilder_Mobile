import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import AsyncStorage from "@react-native-async-storage/async-storage"

export interface SavedWord {
  word: string
  phonetic?: string
  audio?: string
  meaning: string
  related?: string
  explainVN: string
  example?: string
  translation?: string
  isSaved?: boolean
  dateSaved?: string
}

interface VocabStore {
  savedWords: SavedWord[]
  addWord: (word: SavedWord) => void
  removeWord: (wordStr: string) => void
}

export const useVocabStore = create<VocabStore>()(
  persist(
    (set, get) => ({
      savedWords: [],

      addWord: (word: SavedWord): void => {
        const { savedWords } = get()
        const isAlreadySaved = savedWords.some(
          (item) => item.word.toLowerCase() === word.word.toLowerCase()
        )
        if (isAlreadySaved) return

        const newWord: SavedWord = {
          ...word,
          isSaved: true,
          dateSaved: word.dateSaved || new Date().toISOString(),
        }

        set({ savedWords: [...savedWords, newWord] })
      },

      removeWord: (wordStr: string): void => {
        const { savedWords } = get()
        const updated = savedWords.filter(
          (item) => item.word.toLowerCase() !== wordStr.toLowerCase()
        )
        set({ savedWords: updated })
      },
    }),
    {
      name: "shadowing-vocab-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)
