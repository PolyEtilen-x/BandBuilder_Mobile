import { useQuery } from "@tanstack/react-query"
import { speakingApi } from "@/api/speaking.api"

export const useSpeakingHistory = () => {
  return useQuery({
    queryKey: ["speakingHistory"],
    queryFn: () => speakingApi.getHistory()
  })
}

export const useSpeakingSessionDetail = (id: string | null) => {
  return useQuery({
    queryKey: ["speakingSession", id],
    queryFn: () => speakingApi.getSessionDetail(id!),
    enabled: !!id
  })
}
