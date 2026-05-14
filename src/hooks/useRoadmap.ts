import { useMutation, useQuery } from "@tanstack/react-query"
import { roadmapApi } from "@/api/roadmap.api"
import { GenerateRoadmapPayload } from "@/types/roadmap.types"

export const useGenerateRoadmap = () => {
  return useMutation({
    mutationFn: (payload: GenerateRoadmapPayload) => roadmapApi.generateRoadmap(payload)
  })
}

export const useRoadmap = (id: string) => {
  return useQuery({
    queryKey: ["roadmap", id],
    queryFn: () => roadmapApi.getRoadmapById(id),
    enabled: !!id
  })
}
