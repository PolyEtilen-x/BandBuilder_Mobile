import { apiClient } from "./apiClient.api"
import { GenerateRoadmapPayload, Roadmap } from "@/types/roadmap.types"

export const roadmapApi = {
  generateRoadmap: async (payload: GenerateRoadmapPayload): Promise<Roadmap> => {
    const res = await apiClient.post("/roadmaps/generate", payload)
    return res.data
  },

  getRoadmapById: async (id: string): Promise<Roadmap> => {
    const res = await apiClient.get(`/roadmaps/${id}`)
    return res.data
  }
}
