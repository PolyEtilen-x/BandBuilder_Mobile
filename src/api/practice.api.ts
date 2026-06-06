import { apiClient } from "./apiClient.api"
import { PracticeTestDTO, PracticeTestPreview } from "@/data/practices/practice.types"

export interface PracticeSubmitDTO {
  answers: { questionId: string; userAnswer: string }[];
  timeSpentSec: number;
}

export const practiceApi = {
  getPracticeTests: () =>
    apiClient.get<PracticeTestPreview[]>("/practice/tests"),

  getSkills: () =>
    apiClient.get<{ data: any[] }>("/practice/skills"),

  getSkillPreview: (id: string) =>
    apiClient.get<PracticeTestDTO>(`/practice/skills/${id}/preview`),

  getTestPreview: (id: string) =>
    apiClient.get<PracticeTestDTO>(`/practice/tests/${id}/preview`),

  startSkillAttempt: (testId: string, skillType: string) =>
    apiClient.post(`/practice/tests/${testId}/skills/${skillType.toLowerCase()}/start`),

  submitSkillAnswers: (testId: string, skillType: string, data: PracticeSubmitDTO) =>
    apiClient.post(`/practice/tests/${testId}/skills/${skillType.toLowerCase()}/submit`, data),

  submitWritingTask1: (testId: string, data: PracticeSubmitDTO) =>
    apiClient.post(`/practice/tests/${testId}/skills/writing/task1/submit`, data),

  submitWritingTask2: (testId: string, data: PracticeSubmitDTO) =>
    apiClient.post(`/practice/tests/${testId}/skills/writing/task2/submit`, data),

  startTestSession: (practiceTestId: string) =>
    apiClient.post<{ testId: string }>(`/practice/tests/${practiceTestId}/start`),

  getTestSessionContent: (testId: string) =>
    apiClient.get<any>(`/practice/${testId}`),

  getSpeakingHint: (skillContentId: string, questionId: string) =>
    apiClient.get<any>(`/practice/skills/${skillContentId}/speaking/hint/${questionId}`),

  getSpeakingSample: (skillContentId: string, questionId: string, band: number) =>
    apiClient.get<any>(`/practice/skills/${skillContentId}/speaking/sample/${questionId}?band=${band}`)
}