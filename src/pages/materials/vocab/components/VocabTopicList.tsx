import React from "react"
import { View, Text, ScrollView, TouchableOpacity } from "react-native"
import { FolderOpen, ChevronRight } from "lucide-react-native"
import { VocabTopic } from "@/data/vocab/vocab.model"

interface Props {
  filteredTopics: VocabTopic[]
  setSelectedTopic: (topic: VocabTopic) => void
  formatTopicName: (name: string) => string
  t: any
  theme: any
  styles: any
}

export function VocabTopicList({
  filteredTopics,
  setSelectedTopic,
  formatTopicName,
  t,
  theme,
  styles,
}: Props) {
  return (
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.topicsGrid}>
        {filteredTopics.map((topic, index) => {
          const total = topic.wordCount ?? topic.vocab_list.length ?? 0
          const saved = topic.numberSaved ?? 0
          const progress = total ? Math.round((saved / total) * 100) : 0

          return (
            <TouchableOpacity
              key={index}
              activeOpacity={0.85}
              style={styles.topicCard}
              onPress={() => setSelectedTopic(topic)}
            >
              <View style={styles.topicCardHeader}>
                <FolderOpen size={20} color={theme.primary} />
                <Text style={styles.topicCardTitle}>{formatTopicName(topic.topic)}</Text>
              </View>

              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
              </View>

              <View style={styles.topicCardMeta}>
                <Text style={styles.topicCardCount}>
                  {t('vocab.savedMeta', { saved, total })}
                </Text>
                <ChevronRight size={16} color={theme.textSecondary} />
              </View>
            </TouchableOpacity>
          )
        })}
      </View>
    </ScrollView>
  )
}
