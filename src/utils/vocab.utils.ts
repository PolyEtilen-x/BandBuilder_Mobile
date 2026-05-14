import { VocabTopic } from "@/data/vocab/vocab.model"

export function getSavedCount(topic: VocabTopic) {
    return topic.vocab_list.filter(w => w.isSaved).length
}

export function getProgress(topic: VocabTopic) {
    const total = topic.vocab_list.length
    const saved = getSavedCount(topic)

    if (!total) return 0

    return Math.round((saved / total) * 100)
}