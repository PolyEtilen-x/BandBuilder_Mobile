import axios from "axios"
import { apiClient } from "./apiClient.api"

type StartTestResponse = {
  testId: string
  status: string
  startedAt: string
}

export const examService = {
  async startTest(practiceTestId: string) {
    const res = await apiClient.post(`/practice/tests/${practiceTestId}/start`)
    return res.data as StartTestResponse
  }
}