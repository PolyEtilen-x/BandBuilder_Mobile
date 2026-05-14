export type ExamSession = {
  testId: string
  practiceTestId: string

  status: "IN_PROGRESS" | "COMPLETED"

  startedAt: string
}