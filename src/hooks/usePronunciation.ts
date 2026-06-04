import { useQuery } from "@tanstack/react-query"
import {
  practiceGeneralApi,
  type PronunciationTopicListItemDto,
  type PronunciationTopicDetailDto,
} from "@/api/practiceGeneral.api"

// 1. Fetch all pronunciation topics (list view)
export const usePronunciationTopics = () => {
  return useQuery<PronunciationTopicListItemDto[]>({
    queryKey: ["pronunciation-topics"],
    queryFn: () => practiceGeneralApi.getPronunciationTopics(),
    staleTime: 1000 * 60 * 10, // 10 min — topics don't change often
  })
}

// 2. Fetch single topic detail (sentences + vocabs)
export const usePronunciationTopicDetail = (id: string | null) => {
  return useQuery<PronunciationTopicDetailDto>({
    queryKey: ["pronunciation-topic", id],
    queryFn: () => practiceGeneralApi.getPronunciationTopicDetail(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  })
}
