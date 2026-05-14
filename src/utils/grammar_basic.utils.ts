import { GrammarBasicExpandedModel } from "@/data/grammar/basic.model"

function mapItem(item: any, category: string): GrammarBasicExpandedModel {
  return {
    id: item.id,
    category,
    topic: item.topic,

    ruleSummary: item.rule_summary,
    ieltsStrategy: item.ielts_strategy,

    practiceCases: item.practice_cases.map((c: any) => ({
      type: c.type,
      input: c.input,
      transformed: c.transformed,
      note: c.note,
    })),
  }
}

export function mapGrammarData(raw: any): GrammarBasicExpandedModel[] {
  return [
    ...raw.tier_1_morphology.map((i: any) =>
      mapItem(i, "Morphology")
    ),

    ...raw.tier_2_syntax.map((i: any) =>
      mapItem(i, "Syntax")
    ),

    ...raw.tier_3_mechanics_phonetics
      .filter((i: any) => i.topic.toLowerCase().includes("sound") || i.topic.toLowerCase().includes("phonetic"))
      .map((i: any) => mapItem(i, "Phonetics")),

    ...raw.tier_3_mechanics_phonetics
      .filter((i: any) => !i.topic.toLowerCase().includes("sound") && !i.topic.toLowerCase().includes("phonetic"))
      .map((i: any) => mapItem(i, "Mechanics")),
  ]
}