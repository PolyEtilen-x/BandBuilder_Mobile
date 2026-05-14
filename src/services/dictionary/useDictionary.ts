import { useState } from "react"
import { getDictionary } from "../../api/dictionary.api"
import AsyncStorage from "@react-native-async-storage/async-storage"

export function useDictionary() {
  const [dict, setDict] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const lookup = async (word: string, sentence?: string) => {
    setLoading(true)

    const data = await getDictionary(word, sentence)

    setDict(data)
    setLoading(false)
  }

  const close = () => setDict(null)

  const save = async () => {
    if (!dict) return
    const savedStr = await AsyncStorage.getItem("vocab")
    const saved = JSON.parse(savedStr || "[]")
    await AsyncStorage.setItem("vocab", JSON.stringify([...saved, dict]))
  }

  return {
    dict,
    loading,
    lookup,
    close,
    save
  }
}