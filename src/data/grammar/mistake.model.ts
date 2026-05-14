export type Mistake = {
  id: number
  incorrect: string
  correct: string
  note: string
}

export type MistakeCategory = {
  category: string
  mistakes: Mistake[]
}