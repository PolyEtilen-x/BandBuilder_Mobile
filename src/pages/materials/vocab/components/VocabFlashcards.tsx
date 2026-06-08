import React, { useState, useEffect } from "react"
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { BookOpen, Bookmark, ChevronRight, FolderOpen, ChevronLeft, Volume2 } from "lucide-react-native"
import { vocabApi } from "@/api/vocab.api"
import { useTranslation } from "react-i18next"
import { playPronunciation } from "@/utils/sound.utils"

interface Props {
  topics: any[]
  savedWords: any[]
  t: any
  theme: any
  styles: any
  handleToggleSave: (topicName: string, wordId: string | number) => void
}

type ViewType = "select" | "study"

export function VocabFlashcards({
  topics,
  savedWords,
  t,
  theme,
  styles,
  handleToggleSave,
}: Props) {
  const { i18n } = useTranslation()
  const [view, setView] = useState<ViewType>("select")
  const [loading, setLoading] = useState(false)
  const [words, setWords] = useState<any[]>([])
  const [current, setCurrent] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [deckTitle, setDeckTitle] = useState("")

  // Topic formatting helper
  const formatTopicName = (topic: string) => {
    const match = topic.match(/^(LR|SW)_(\d+)$/)
    if (match) {
      const type = match[1] === 'LR' ? 'Listening & Reading' : 'Speaking & Writing'
      const band = match[2]
      return `${type} (Band ${band}.0)`
    }
    return topic.replace(/_/g, " ")
  }

  const getRandomWords = (list: any[], count: number) => {
    const shuffled = [...list].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count)
  }

  const handleSelectDeck = async (topicName: string) => {
    try {
      setLoading(true)
      const fullTopic = await vocabApi.getTopic(topicName)
      if (fullTopic && fullTopic.vocab_list && fullTopic.vocab_list.length > 0) {
        const randomWords = getRandomWords(fullTopic.vocab_list, 20)
        setWords(randomWords)
        setCurrent(0)
        setFlipped(false)
        setDeckTitle(formatTopicName(topicName))
        setView("study")
      }
    } catch (err) {
      console.error("Failed to load topic words for flashcard:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectNotebook = () => {
    if (savedWords.length === 0) return
    const shuffled = getRandomWords(savedWords, 20)
    setWords(shuffled)
    setCurrent(0)
    setFlipped(false)
    setDeckTitle("My Notebook")
    setView("study")
  }

  const prev = () => {
    if (current === 0) return
    setCurrent((p) => p - 1)
    setFlipped(false)
  }

  const next = () => {
    if (current === words.length - 1) return
    setCurrent((p) => p + 1)
    setFlipped(false)
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={styles.loadingText}>
          {i18n.language === 'vi' ? 'Đang tải từ vựng...' : 'Loading words...'}
        </Text>
      </View>
    )
  }

  if (view === "select") {
    // general topics (no LR_ or SW_ prefix)
    const generalTopics = topics.filter((t) => !/^(LR|SW)_\d+/.test(t.topic))

    return (
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Section 1: My Notebook */}
        {savedWords.length > 0 && (
          <View style={{ marginBottom: 24 }}>
            <Text style={[styles.meaningLabel, { marginBottom: 12 }]}>
              {i18n.language === 'vi' ? 'Bộ thẻ của bạn' : 'Your Decks'}
            </Text>
            <TouchableOpacity
              activeOpacity={0.85}
              style={[styles.topicCard, { borderColor: theme.primary + '40', backgroundColor: theme.primary + '05' }]}
              onPress={handleSelectNotebook}
            >
              <View style={styles.topicCardHeader}>
                <Bookmark size={20} color={theme.primary} />
                <Text style={[styles.topicCardTitle, { color: theme.primary }]}>My Notebook</Text>
              </View>
              <Text style={styles.topicCardCount}>
                {savedWords.length} {i18n.language === 'vi' ? 'từ đã lưu' : 'saved words'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Section 2: General Topics */}
        <View style={{ marginBottom: 24 }}>
          <Text style={[styles.meaningLabel, { marginBottom: 12 }]}>
            {i18n.language === 'vi' ? 'Học theo Chủ Đề' : 'Study by Topic'}
          </Text>
          <View style={styles.topicsGrid}>
            {generalTopics.map((topic, index) => (
              <TouchableOpacity
                key={index}
                activeOpacity={0.85}
                style={styles.topicCard}
                onPress={() => handleSelectDeck(topic.topic)}
              >
                <View style={styles.topicCardHeader}>
                  <FolderOpen size={20} color={theme.primary} />
                  <Text style={styles.topicCardTitle}>{formatTopicName(topic.topic)}</Text>
                </View>
                <Text style={styles.topicCardCount}>
                  {topic.wordCount || 0} {i18n.language === 'vi' ? 'từ vựng' : 'words'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Section 3: Listening & Reading Band Decks */}
        <View style={{ marginBottom: 24 }}>
          <Text style={[styles.meaningLabel, { marginBottom: 12 }]}>
            Listening & Reading Decks
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {[5, 6, 7, 8].map((band) => (
              <TouchableOpacity
                key={band}
                activeOpacity={0.8}
                style={[styles.bandFilterButton, { flex: 1, minWidth: '45%', alignItems: 'center', paddingVertical: 12 }]}
                onPress={() => handleSelectDeck(`LR_${band}`)}
              >
                <Text style={[styles.bandFilterButtonText, { fontSize: 13, fontWeight: '700' }]}>
                  Band {band}.0+
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Section 4: Speaking & Writing Band Decks */}
        <View style={{ marginBottom: 24 }}>
          <Text style={[styles.meaningLabel, { marginBottom: 12 }]}>
            Speaking & Writing Decks
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {[5, 6, 7, 8].map((band) => (
              <TouchableOpacity
                key={band}
                activeOpacity={0.8}
                style={[styles.bandFilterButton, { flex: 1, minWidth: '45%', alignItems: 'center', paddingVertical: 12 }]}
                onPress={() => handleSelectDeck(`SW_${band}`)}
              >
                <Text style={[styles.bandFilterButtonText, { fontSize: 13, fontWeight: '700' }]}>
                  Band {band}.0+
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    )
  }

  const currentWord = words[current]

  useEffect(() => {
    if (currentWord) {
      playPronunciation(currentWord.word, currentWord.audio)
    }
  }, [current, words])

  return (
    <View style={styles.flashcardsContainer}>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'flex-start',
          paddingVertical: 8,
          paddingHorizontal: 16,
          marginBottom: 12,
          backgroundColor: theme.backgroundAlt,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: theme.border,
        }}
        onPress={() => setView("select")}
      >
        <ChevronLeft size={16} color={theme.text} />
        <Text style={{ fontSize: 13, color: theme.text, marginLeft: 4, fontWeight: '600' }}>
          {i18n.language === 'vi' ? 'Quay lại' : 'Back'}
        </Text>
      </TouchableOpacity>

      {currentWord ? (
        <View style={styles.flashcardView}>
          <Text style={[styles.detailTopicStats, { marginBottom: -8 }]}>
            {deckTitle} • {current + 1} / {words.length}
          </Text>

          <TouchableOpacity
            activeOpacity={0.95}
            onPress={() => setFlipped(!flipped)}
            style={[styles.flashcard, flipped && styles.flashcardFlipped]}
          >
            <LinearGradient
              colors={
                flipped
                  ? (theme.text === '#ffffff' ? ["#1e293b", "#0f172a"] : ["#ffffff", "#f1f5f9"])
                  : ["#1e40af", "#1e3a8a"]
              }
              style={styles.flashcardGradient}
            >
              {!flipped ? (
                <View style={styles.cardSide}>
                  <BookOpen size={48} color="#93c5fd" style={styles.cardIcon} />
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, justifyContent: 'center', marginBottom: 8 }}>
                    <Text style={styles.cardSpelling}>{currentWord.word}</Text>
                    <TouchableOpacity activeOpacity={0.7} onPress={(e) => { e.stopPropagation(); playPronunciation(currentWord.word, currentWord.audio); }}>
                      <Volume2 size={24} color="#93c5fd" />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.cardPhonetics}>{currentWord.pronunciation || currentWord.phonetic}</Text>
                  <Text style={styles.tapToFlipText}>{t('vocab.tapToFlip')}</Text>
                </View>
              ) : (
                <View style={styles.cardSide}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, justifyContent: 'center', marginBottom: 16 }}>
                    <Bookmark size={40} color="#f87171" />
                    <TouchableOpacity activeOpacity={0.7} onPress={(e) => { e.stopPropagation(); playPronunciation(currentWord.word, currentWord.audio); }}>
                      <Volume2 size={24} color="#f87171" />
                    </TouchableOpacity>
                  </View>
                  <Text style={[styles.cardMeaning, { color: theme.text }]}>{currentWord.meaning}</Text>
                  {currentWord.example && (
                    <Text style={[styles.cardExample, { color: theme.textSecondary }]}>
                      "{currentWord.example}"
                    </Text>
                  )}
                  <Text style={styles.tapToFlipText}>{t('vocab.tapToFlipBack')}</Text>
                </View>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'center', gap: 12, marginTop: 12 }}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={prev}
              disabled={current === 0}
              style={[
                styles.nextCardButton,
                { backgroundColor: 'transparent', borderWidth: 1, borderColor: theme.border },
                current === 0 && { opacity: 0.4 }
              ]}
            >
              <Text style={[styles.nextCardButtonText, { color: theme.text }]}>
                {i18n.language === 'vi' ? 'Trước' : 'Prev'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setFlipped(!flipped)}
              style={[styles.nextCardButton, { backgroundColor: theme.primary + '20', borderWidth: 1, borderColor: theme.primary }]}
            >
              <Text style={[styles.nextCardButtonText, { color: theme.primary }]}>
                {i18n.language === 'vi' ? 'Lật' : 'Flip'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={next}
              disabled={current === words.length - 1}
              style={[styles.nextCardButton, current === words.length - 1 && { opacity: 0.4 }]}
            >
              <Text style={styles.nextCardButtonText}>
                {i18n.language === 'vi' ? 'Tiếp' : 'Next'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <BookOpen size={48} color={theme.textSecondary} />
          <Text style={styles.emptyText}>{t('vocab.emptyWords')}</Text>
        </View>
      )}
    </View>
  )
}
