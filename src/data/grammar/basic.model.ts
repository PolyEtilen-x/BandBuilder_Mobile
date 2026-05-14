export interface GrammarBasicExpandedModel {
  id: number
  category: string
  topic: string

  ruleSummary: string
  ieltsStrategy: string

  practiceCases: GrammarPracticeCase[]
}

export interface GrammarPracticeCase {
  type: string
  input: string
  transformed: string
  note: string
}

