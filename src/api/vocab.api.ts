import { apiClient } from "./apiClient.api"
import { VocabTopic, VocabItem } from "@/data/vocab/vocab.model"
import { useVocabStore } from "@/services/vocab/vocab.store"
import AsyncStorage from "@react-native-async-storage/async-storage"

// Helper to get/set saved word IDs per topic using AsyncStorage
const getTopicSavedWords = async (): Promise<Record<string, string[]>> => {
  try {
    const data = await AsyncStorage.getItem("topic_saved_words")
    return data ? JSON.parse(data) : {}
  } catch {
    return {}
  }
}

const saveTopicSavedWords = async (data: Record<string, string[]>) => {
  try {
    await AsyncStorage.setItem("topic_saved_words", JSON.stringify(data))
  } catch (e) {
    console.error("Failed to save topic words", e)
  }
}

export const vocabApi = {
  async getTopics(): Promise<VocabTopic[]> {
    const res = await apiClient.get<any[]>("/materials/vocab/topics")
    const topicSavedWords = await getTopicSavedWords()

    return res.data.map((t) => {
      const savedIds = topicSavedWords[t.name] || []
      return {
        id: t.id,
        topic: t.name,
        numberSaved: savedIds.length,
        vocab_list: [], // The list page only needs the topic name and counts
        wordCount: t.wordCount
      }
    })
  },

  async getTopic(name: string): Promise<VocabTopic | undefined> {
    const topics = await this.getTopics()
    const foundTopic = topics.find((t) => t.topic === name)
    if (!foundTopic) return undefined

    const res = await apiClient.get<any>(`/materials/vocab/topics/${foundTopic.id!}`)
    const data = res.data

    const topicSavedWords = await getTopicSavedWords()
    const savedIds = topicSavedWords[name] || []

    const vocab_list: VocabItem[] = data.words.map((w: any) => ({
      id: w.id,
      word: w.word,
      meaning: w.meaning,
      pronunciation: w.pronunciation || "",
      example: w.example || "",
      synonyms: w.synonyms || [],
      isSaved: savedIds.includes(w.id)
    }))

    const validSavedIds = savedIds.filter(id => data.words.some((w: any) => w.id === id))
    if (validSavedIds.length !== savedIds.length) {
      topicSavedWords[name] = validSavedIds
      await saveTopicSavedWords(topicSavedWords)
    }

    return {
      topic: data.name,
      numberSaved: validSavedIds.length,
      vocab_list
    }
  },

  async toggleSave(topicName: string, wordId: string | number): Promise<VocabTopic | undefined> {
    const topicSavedWords = await getTopicSavedWords()
    const savedIds = topicSavedWords[topicName] || []

    const topicDetail = await this.getTopic(topicName)
    if (!topicDetail) return undefined

    const word = topicDetail.vocab_list.find((w) => String(w.id) === String(wordId))
    if (!word) return topicDetail

    const store = useVocabStore.getState()
    const index = savedIds.indexOf(String(wordId))

    if (index > -1) {
      // Unsave
      savedIds.splice(index, 1)
      store.removeWord(word.word)
    } else {
      // Save
      savedIds.push(String(wordId))
      store.addWord({
        word: word.word,
        phonetic: word.pronunciation || "",
        audio: "",
        meaning: word.meaning,
        related: word.synonyms ? word.synonyms.join(", ") : "",
        explainVN: word.meaning,
        example: word.example || "",
        translation: "",
        isSaved: true,
        dateSaved: new Date().toISOString()
      })
    }

    topicSavedWords[topicName] = savedIds
    await saveTopicSavedWords(topicSavedWords)

    return this.getTopic(topicName)
  },

  // ─── Admin CRUD APIs ──────────────────────────────────────────────────────────

  async createTopic(dto: { name: string; type: "TOPIC" | "BAND_LR" | "BAND_SW"; bandLevel?: number }): Promise<any> {
    const res = await apiClient.post("/admin/materials/vocab/topics", dto)
    return res.data
  },

  async updateTopic(id: string, dto: { name?: string; type?: "TOPIC" | "BAND_LR" | "BAND_SW"; bandLevel?: number }): Promise<any> {
    const res = await apiClient.patch(`/admin/materials/vocab/topics/${id}`, dto)
    return res.data
  },

  async deleteTopic(id: string): Promise<any> {
    const res = await apiClient.delete(`/admin/materials/vocab/topics/${id}`)
    return res.data
  },

  async createWord(topicId: string, dto: { word: string; meaning: string; pronunciation?: string; example?: string; synonyms?: string[] }): Promise<any> {
    const res = await apiClient.post(`/admin/materials/vocab/topics/${topicId}/words`, dto)
    return res.data
  },

  async updateWord(id: string, dto: { word?: string; meaning?: string; pronunciation?: string; example?: string; synonyms?: string[] }): Promise<any> {
    const res = await apiClient.patch(`/admin/materials/vocab/words/${id}`, dto)
    return res.data
  },

  async deleteWord(id: string): Promise<any> {
    const res = await apiClient.delete(`/admin/materials/vocab/words/${id}`)
    return res.data
  }
}