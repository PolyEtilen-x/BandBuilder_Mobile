export function groupTenses(data: any[]) {
  return {
    present: data.filter(t => t.tense_name.toLowerCase().includes("present")),
    past: data.filter(t => t.tense_name.toLowerCase().includes("past")),
    future: data.filter(t => t.tense_name.toLowerCase().includes("future")),
    perfect: data.filter(t => t.tense_name.toLowerCase().includes("perfect")),
  }
}