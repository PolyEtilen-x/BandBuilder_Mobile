import raw from "@/data/grammar/basic.data.json"
import tenses from "@/data/grammar/tense.data.json"
import { mapGrammarData } from "@/utils/grammar_basic.utils"
import { MistakeCategory } from "@/data/grammar/mistake.model"
import mistakeJson from "@/data/grammar/mistake.data.json"

const data = mapGrammarData(raw)
const mistakeData: MistakeCategory[] = mistakeJson.data

export const grammarApi = {
  async getBasics() {
    return data
  },

  async getByCategory(category: string) {
    return data.filter((i) => i.category === category)
  },

  async getTenses() {
    return tenses.data
  },

  async getMistakes(): Promise<MistakeCategory[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mistakeData), 200)
    })
  },

  async getMistakeByCategory(category: string): Promise<MistakeCategory | null> {
    const found = mistakeData.find((i) => i.category === category)
    return found || null
  },
}