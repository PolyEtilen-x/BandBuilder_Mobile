import { apiClient } from "./apiClient.api"

// ── DTO types (raw API shape) ──────────────────────────────────────────────

export interface PronunciationVocabDto {
  id: string
  word: string
  ipa: string
  meaning: string
  audioUrl: string | null
  example: string
  exampleTranslation: string
}

export interface PronunciationTopicListItemDto {
  id: string
  title: string
  paragraph: string
  videoUrl: string | null
  vocabCount: number
  sentencesCount: number
}

export interface PronunciationSentenceDto {
  id: string
  topicId: string
  text: string
  startTime: number
  endTime: number
  orderIndex: number
}

export interface PronunciationTopicDetailDto {
  id: string
  title: string
  paragraph: string
  videoUrl: string | null
  audioUrl: string | null
  vocabs: PronunciationVocabDto[]
  sentences: PronunciationSentenceDto[]
}

export type WritingTaskType = "TASK_1" | "TASK_2"

export interface KeyVocabularyItem {
  phrase: string
  meaning: string
  context: string
}

export interface EssayAnalysis {
  taskAchievement?: number
  coherenceCohesion?: number
  lexicalResource?: number
  grammaticalRange?: number
  outline?: string
  strengths?: string[]
  improvements?: string[]
  overallComment?: string
  keyVocabulary?: KeyVocabularyItem[]
}

export interface WritingSampleTopicListItemDto {
  id: string
  taskType: WritingTaskType
  category: string
  prompt: string
  imageUrl: string | null
  chartDescription: string | null
  essayCount: number
}

export interface WritingEssayDto {
  id: string
  bandScore: number
  essayText: string
  essayTranslation?: string | null
  analysis: EssayAnalysis | null
}

export interface WritingSampleTopicDetailDto {
  id: string
  taskType: WritingTaskType
  category: string
  prompt: string
  imageUrl: string | null
  chartDescription: string | null
  essays: WritingEssayDto[]
}

// ── Pronunciation API ──────────────────────────────────────────────────────

export const practiceGeneralApi = {
  getPronunciationTopics: async (): Promise<PronunciationTopicListItemDto[]> => {
    const res = await apiClient.get<PronunciationTopicListItemDto[]>("/practice-general/pronunciation/topics")
    return res.data
  },

  getPronunciationTopicDetail: async (id: string): Promise<PronunciationTopicDetailDto> => {
    const res = await apiClient.get<PronunciationTopicDetailDto>(`/practice-general/pronunciation/topics/${id}`)
    return res.data
  },

  // ── Writing Samples API ────────────────────────────────────────────────────
  getWritingSampleTopics: async (taskType?: WritingTaskType): Promise<WritingSampleTopicListItemDto[]> => {
    const res = await apiClient.get<WritingSampleTopicListItemDto[]>("/practice-general/writing-samples/topics", {
      params: taskType ? { taskType } : undefined
    })
    return res.data
  },

  getWritingSampleTopicDetail: async (id: string): Promise<WritingSampleTopicDetailDto> => {
    const res = await apiClient.get<WritingSampleTopicDetailDto>(`/practice-general/writing-samples/topics/${id}`)
    return res.data
  }
}

// ── Admin Pronunciation CRUD API ───────────────────────────────────────────

export async function createPronunciationTopicAdmin(
  dto: {
    title: string
    paragraph: string
    videoUrl?: string
    audioUrl?: string
    vocabs?: any[]
    sentences?: any[]
  }
): Promise<PronunciationTopicDetailDto> {
  const res = await apiClient.post<PronunciationTopicDetailDto>(
    "/admin/pronunciation/topics",
    dto
  )
  return res.data
}

export async function deletePronunciationTopicAdmin(
  id: string
): Promise<{ success: boolean; message: string }> {
  const res = await apiClient.delete<{ success: boolean; message: string }>(
    `/admin/pronunciation/topics/${id}`
  )
  return res.data
}

export interface CreateWritingSampleTopicDto {
  taskType: "TASK_1" | "TASK_2"
  category: string
  prompt: string
  imageUrl?: string
  chartDescription?: string
}

export interface EssayAnalysisInput {
  taskAchievement?: number
  coherenceCohesion?: number
  lexicalResource?: number
  grammaticalRange?: number
  outline?: string
  strengths?: string[]
  improvements?: string[]
  overallComment?: string
  keyVocabulary?: { phrase: string; meaning: string; context?: string }[]
}

export interface CreateWritingSampleEssayDto {
  bandScore: number
  essayText: string
  essayTranslation?: string
  analysis?: EssayAnalysisInput
}

export async function createWritingSampleTopicAdmin(
  dto: CreateWritingSampleTopicDto
): Promise<any> {
  const res = await apiClient.post("/admin/writing-samples/topics", dto)
  return res.data
}

export async function updateWritingSampleTopicAdmin(
  id: string,
  dto: Partial<CreateWritingSampleTopicDto>
): Promise<any> {
  const res = await apiClient.patch(`/admin/writing-samples/topics/${id}`, dto)
  return res.data
}

export async function deleteWritingSampleTopicAdmin(
  id: string
): Promise<any> {
  const res = await apiClient.delete(`/admin/writing-samples/topics/${id}`)
  return res.data
}

export async function createWritingSampleEssayAdmin(
  topicId: string,
  dto: CreateWritingSampleEssayDto
): Promise<any> {
  const res = await apiClient.post(`/admin/writing-samples/topics/${topicId}/essays`, dto)
  return res.data
}

export async function updateWritingSampleEssayAdmin(
  id: string,
  dto: Partial<CreateWritingSampleEssayDto>
): Promise<any> {
  const res = await apiClient.patch(`/admin/writing-samples/essays/${id}`, dto)
  return res.data
}

export async function deleteWritingSampleEssayAdmin(
  id: string
): Promise<any> {
  const res = await apiClient.delete(`/admin/writing-samples/essays/${id}`)
  return res.data
}

export async function updatePronunciationTopicAdmin(
  id: string,
  dto: { title?: string; paragraph?: string; videoUrl?: string | null; audioUrl?: string | null }
): Promise<PronunciationTopicDetailDto> {
  const res = await apiClient.patch<PronunciationTopicDetailDto>(
    `/admin/pronunciation/topics/${id}`,
    dto
  )
  return res.data
}

export async function createPronunciationVocabAdmin(
  topicId: string,
  dto: { word: string; ipa: string; meaning: string; audioUrl?: string; example: string; exampleTranslation: string }
): Promise<any> {
  const res = await apiClient.post(`/admin/pronunciation/topics/${topicId}/vocabs`, dto)
  return res.data
}

export async function updatePronunciationVocabAdmin(
  id: string,
  dto: any
): Promise<any> {
  const res = await apiClient.patch(`/admin/pronunciation/vocabs/${id}`, dto)
  return res.data
}

export async function deletePronunciationVocabAdmin(
  id: string
): Promise<any> {
  const res = await apiClient.delete(`/admin/pronunciation/vocabs/${id}`)
  return res.data
}

export async function createPronunciationSentenceAdmin(
  topicId: string,
  dto: { text: string; startTime: number; endTime: number; orderIndex: number }
): Promise<any> {
  const res = await apiClient.post(`/admin/pronunciation/topics/${topicId}/sentences`, dto)
  return res.data
}

export async function updatePronunciationSentenceAdmin(
  id: string,
  dto: any
): Promise<any> {
  const res = await apiClient.patch(`/admin/pronunciation/sentences/${id}`, dto)
  return res.data
}

export async function deletePronunciationSentenceAdmin(
  id: string
): Promise<any> {
  const res = await apiClient.delete(`/admin/pronunciation/sentences/${id}`)
  return res.data
}

export async function scrapeYoutubeTranscriptAdmin(
  videoUrl: string
): Promise<{ title: string; paragraph: string; sentences: any[] }> {
  const res = await apiClient.post<{ title: string; paragraph: string; sentences: any[] }>(
    "/admin/pronunciation/scrape-transcript",
    { videoUrl }
  )
  return res.data
}
