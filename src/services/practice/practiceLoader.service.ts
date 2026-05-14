import { practiceApi } from "@/api/practice.api"
import { normalizeTestUnits } from "@/utils/normalizeTestUnits.utils"
import { PracticeSkill } from "@/data/practices/practiceSkill.model"

const previewCache = new Map()

export async function loadSkillsWithPreview(list: PracticeSkill[]) {
  const results = []

  for (const s of list) {
    try {
      // cache now, avoid repeat request when user switch between skills
      if (previewCache.has(s.skillContentId)) {
        results.push({
          ...s,
          preview: previewCache.get(s.skillContentId),
          units: normalizeTestUnits(previewCache.get(s.skillContentId))
        })
        continue
      }

      const res = await practiceApi.getSkillPreview(s.skillContentId)

      previewCache.set(s.skillContentId, res.data)

      results.push({
        ...s,
        preview: res.data,
        units: normalizeTestUnits(res.data)
      })

      // delay a bit to avoid too many requests in a short time when user has many skills (can be removed if backend implements batch API)
      await new Promise((r) => setTimeout(r, 100))

    } catch {
      results.push({ ...s, units: [] })
    }
  }

  return results
}