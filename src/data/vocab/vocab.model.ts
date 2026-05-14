export type VocabItem = {
  id: number
  word: string
  meaning: string
  pronunciation?: string
  example?: string
  synonyms?: string[]
  isSaved: boolean
}

export type VocabTopic = {
  topic: string
  numberSaved: number
  vocab_list: VocabItem[]
}