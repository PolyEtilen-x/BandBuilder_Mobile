import React from "react"
import { View, Text, ScrollView, TouchableOpacity } from "react-native"
import { Heart, BookOpen, Volume2 } from "lucide-react-native"
import { useVocabStore } from "@/services/vocab/vocab.store"
import { playPronunciation } from "@/utils/sound.utils"

interface Props {
  savedWords: any[]
  formatTopicName: (name: string) => string
  handleToggleSave: (topicName: string, wordId: string | number) => void
  t: any
  theme: any
  styles: any
}

export function VocabNotebook({
  savedWords,
  formatTopicName,
  handleToggleSave,
  t,
  theme,
  styles,
}: Props) {
  return (
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {savedWords.length > 0 ? (
        savedWords.map((word) => (
          <View key={word.word} style={styles.wordCard}>
            <View style={styles.wordHeader}>
              <View style={{ flex: 1, paddingRight: 8 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={styles.wordSpelling}>{word.word}</Text>
                  <TouchableOpacity activeOpacity={0.7} onPress={() => playPronunciation(word.word, word.audio)}>
                    <Volume2 size={16} color={theme.primary} />
                  </TouchableOpacity>
                </View>
                <View style={styles.notebookBadgeRow}>
                  <Text style={styles.wordPhonetics}>{word.phonetic || word.pronunciation || ""}</Text>
                  <View style={[styles.topicBadge, !word.topicName && { backgroundColor: theme.primary + '08' }]}>
                    <Text style={[styles.topicBadgeText, !word.topicName && { color: theme.textSecondary }]}>
                      {word.topicName ? formatTopicName(word.topicName) : "Dictionary"}
                    </Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  if (word.topicName && word.id) {
                    handleToggleSave(word.topicName, word.id);
                  } else {
                    useVocabStore.getState().removeWord(word.word);
                  }
                }}
                style={styles.bookmarkButton}
              >
                <Heart size={22} color="#ef4444" fill="#ef4444" />
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            <Text style={styles.meaningLabel}>{t('vocab.meaningLabel')}</Text>
            <Text style={styles.wordMeaning}>{word.meaning}</Text>

            {word.example && (
              <>
                <Text style={styles.exampleLabel}>{t('vocab.exampleLabel')}</Text>
                <Text style={styles.wordExample}>"{word.example}"</Text>
              </>
            )}

            {word.synonyms && word.synonyms.length > 0 && (
              <View style={styles.synonymsRow}>
                <Text style={styles.synonymsLabel}>{t('vocab.synonymsLabel')}</Text>
                <Text style={styles.wordSynonyms}>{word.synonyms.join(", ")}</Text>
              </View>
            )}
          </View>
        ))
      ) : (
        <View style={styles.emptyContainer}>
          <BookOpen size={48} color={theme.textSecondary} />
          <Text style={styles.emptyText}>{t('vocab.emptyWords')}</Text>
        </View>
      )}
    </ScrollView>
  )
}
