import { SkillType } from "@/data/practices/common.types";
import axios from "axios"
import { apiClient } from "./apiClient.api"

export const skillService = {
  async start(testId: string, skillType: string) {
    await apiClient.post(
      `/practice/tests/${testId}/skills/${skillType}/start`
    )
  }
}