export async function getDictionary(word: string, sentence?: string) {
  const cleanWord = word.toLowerCase().trim().split(" ")[0]

  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${cleanWord}`)

    // translate sentence
    let sentenceTranslation = ""
    if (sentence) {
      const transRes = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(sentence)}&langpair=en|vi`)
      const transData = await transRes.json()
      sentenceTranslation = transData?.responseData?.translatedText || ""
    }

    // 3. translate word
    const wordTransRes = await fetch(`https://api.mymemory.translated.net/get?q=${cleanWord}&langpair=en|vi`)
    const wordTransData = await wordTransRes.json()
    const wordExplanation = wordTransData?.responseData?.translatedText || ""

    if (!res.ok) throw new Error("Not found")
    const dictData = await res.json()
    if (!Array.isArray(dictData)) throw new Error("Invalid response")

    const entry = dictData[0]
    const firstMeaning = entry?.meanings?.[0]
    const firstDef = firstMeaning?.definitions?.[0]

    const synonyms = firstMeaning?.synonyms?.slice(0, 5).join(", ") || "No synonyms found"

    const realExample = firstDef?.example || (entry?.meanings?.[1]?.definitions?.[0]?.example) || "No example found in database"

    return {
      word: cleanWord,
      phonetic: entry?.phonetic || "",
      audio: entry?.phonetics?.find((p: any) => p.audio)?.audio,
      meaning: firstDef?.definition,
      related: synonyms,
      explainVN: wordExplanation,
      example: realExample,
      translation: sentenceTranslation,
    }
  } catch {
    return {
      word,
      phonetic: "",
      audio: "",
      meaning: "Definition not found",
      related: "N/A",
      explainVN: "Không tìm thấy nghĩa",
      example: "N/A",
      translation: "",
    }
  }
}