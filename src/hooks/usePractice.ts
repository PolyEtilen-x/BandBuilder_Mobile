import { useQuery } from "@tanstack/react-query"
import { practiceApi } from "@/api/practice.api"
import { normalizeTestUnits } from "@/utils/normalizeTestUnits.utils"

//1. get all skill for practice
export const usePracticeSkills = () => {
    return useQuery({
        queryKey: ["practice-skills"],
        queryFn: async () => {
            const res = await practiceApi.getSkills()
            return res.data.data
        },
        staleTime: 1000 * 60 * 30,
    })
}

//2. get preview of skill
export const useSkillPreview = (skillContentId: string) => {
    return useQuery({
        queryKey: ["skill-preview", skillContentId],
        queryFn: async () => {
            const res = await practiceApi.getSkillPreview(skillContentId)
            const data = res.data

            // normalize data immediately
            return {
                ...data,
                units: normalizeTestUnits(data)
            }
        },
        enabled: !!skillContentId,
        staleTime: 1000 * 60 * 5,
    })
}