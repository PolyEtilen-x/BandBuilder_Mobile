export type VocabItem = {
  id: string | number
  word: string
  meaning: string
  pronunciation?: string
  example?: string
  synonyms?: string[]
  isSaved: boolean
}

export type VocabTopic = {
  id?: string | number
  topic: string
  numberSaved: number
  vocab_list: VocabItem[]
  wordCount?: number
}