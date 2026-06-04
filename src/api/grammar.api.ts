import { apiClient } from "./apiClient.api"
import { MistakeCategory } from "@/data/grammar/mistake.model"

// Map subCategory to basic categories required by FE
const subCategoryMap: Record<string, string> = {
  morphology: "Morphology",
  syntax: "Syntax",
  mechanics: "Mechanics",
  phonetics: "Phonetics"
}

export const grammarApi = {
  async getBasics() {
    const res = await apiClient.get<any[]>("/materials/grammar/sections", {
      params: { category: "basics" }
    })

    return res.data.map((item) => {
      const content = item.content || {}
      return {
        id: item.id,
        category: subCategoryMap[item.subCategory] || item.subCategory || "Morphology",
        title: item.title,
        subtitle: item.ruleSummary,
        content: content.ieltsStrategy || "",
        examples: (content.practiceCases || []).map((c: any) =>
          typeof c === 'string'
            ? c
            : (c.input && c.transformed ? `${c.input} ➔ ${c.transformed}` : (c.sentence || c.example || String(c)))
        )
      }
    })
  },
  
  async getByCategory(category: string) {
    const basics = await this.getBasics()
    return basics.filter((i) => i.category === category)
  },

  async getTenses() {
    const res = await apiClient.get<any[]>("/materials/grammar/sections", {
      params: { category: "tenses" }
    })

    return res.data.map((item) => {
      const content = item.content || {}
      return {
        id: item.id,
        title: item.title,
        formula: item.ruleSummary,
        use: content.ieltsStrategy || "",
        examples: (content.examples || []).map((e: any) =>
          typeof e === 'string'
            ? e
            : `${e.sentence || ""}${e.note ? ` (${e.note})` : ""}`
        ),
        signals: (content.signalWords || []).join(", ")
      }
    })
  },

  async getSentences() {
    const res = await apiClient.get<any[]>("/materials/grammar/sections", {
      params: { category: "sentence" }
    })

    return res.data.map((item) => {
      const content = item.content || {}
      return {
        id: item.id,
        category: item.title,
        structure: item.ruleSummary,
        ielts_application: content.ieltsStrategy || "",
        examples: (content.examples || []).map((e: any) =>
          typeof e === 'string'
            ? { sentence: e, logic: "" }
            : { sentence: e.sentence || e.example || String(e), logic: e.logic || e.type || "" }
        )
      }
    })
  },

  async getMistakes(): Promise<MistakeCategory[]> {
    const res = await apiClient.get<any[]>("/materials/grammar/mistakes")
    const flatMistakes = res.data

    const grouped: Record<string, any[]> = {}
    flatMistakes.forEach((m) => {
      const cat = m.category || "General"
      if (!grouped[cat]) {
        grouped[cat] = []
      }
      grouped[cat].push({
        id: m.id,
        incorrect: m.incorrect,
        correct: m.correct,
        note: m.note
      })
    })

    return Object.keys(grouped).map((cat) => ({
      category: cat,
      mistakes: grouped[cat]
    }))
  },

  async getMistakeByCategory(category: string): Promise<MistakeCategory | null> {
    const mistakes = await this.getMistakes()
    return mistakes.find((i) => i.category === category) || null
  },

  // ─── Admin CRUD APIs ──────────────────────────────────────────────────────────

  async createSection(dto: { category: string; subCategory: string; title: string; ruleSummary: string; content: any; orderIndex?: number }): Promise<any> {
    const res = await apiClient.post("/admin/materials/grammar/sections", dto)
    return res.data
  },

  async updateSection(id: string, dto: { category?: string; subCategory?: string; title?: string; ruleSummary?: string; content?: any; orderIndex?: number }): Promise<any> {
    const res = await apiClient.patch(`/admin/materials/grammar/sections/${id}`, dto)
    return res.data
  },

  async deleteSection(id: string): Promise<any> {
    const res = await apiClient.delete(`/admin/materials/grammar/sections/${id}`)
    return res.data
  },

  async createMistake(dto: { category: string; incorrect: string; correct: string; note: string; orderIndex?: number }): Promise<any> {
    const res = await apiClient.post("/admin/materials/grammar/mistakes", dto)
    return res.data
  },

  async updateMistake(id: string, dto: { category?: string; incorrect?: string; correct?: string; note?: string; orderIndex?: number }): Promise<any> {
    const res = await apiClient.patch(`/admin/materials/grammar/mistakes/${id}`, dto)
    return res.data
  },

  async deleteMistake(id: string): Promise<any> {
    const res = await apiClient.delete(`/admin/materials/grammar/mistakes/${id}`)
    return res.data
  }
}