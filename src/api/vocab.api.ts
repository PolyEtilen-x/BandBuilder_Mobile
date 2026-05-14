import data from "@/data/vocab/vocab.data.json"
import { VocabTopic } from "@/data/vocab/vocab.model"

let cache: VocabTopic[] = data.topics.map((t: any) => ({
  topic: t.topic,
  numberSaved: t.numberSaved ?? 0,
  vocab_list: t.vocab_list.map((w: any) => ({
    id: w.id,
    word: w.word,
    meaning: w.meaning,
    pronunciation: w.pronunciation,
    example: w.example,
    synonyms: Array.isArray(w.synonyms)
      ? w.synonyms
      : [w.synonyms],
    isSaved: w.isSaved ?? false
  }))
}))

const delay = (ms: number) =>
    new Promise((res) => setTimeout(res, ms))

export const vocabApi = {
    async getTopics(): Promise<VocabTopic[]> {
        await delay(300)
        return cache
    },

    async getTopic(name: string): Promise<VocabTopic | undefined> {
        await delay(300)
        return cache.find((t) => t.topic === name)
    },

    async toggleSave(
    topicName: string,
    wordId: number
    ): Promise<VocabTopic | undefined> {
    await delay(200)

    cache = cache.map((t) => {
        if (t.topic !== topicName) return t

        const updatedList = t.vocab_list.map((w) =>
        w.id === wordId
            ? { ...w, isSaved: !w.isSaved }
            : w
        )

        const numberSaved = updatedList.filter(w => w.isSaved).length

        return {
        ...t,
        vocab_list: updatedList,
        numberSaved
        }
    })

    return cache.find((t) => t.topic === topicName)
    }
}