import React, { useState, useEffect, useMemo } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { LinearGradient } from "expo-linear-gradient"
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Heart,
  Search,
  Sparkles,
  Bookmark,
  RefreshCw,
  FolderOpen,
  Volume2
} from "lucide-react-native"
import { useTranslation } from "react-i18next"
import { vocabApi } from "@/api/vocab.api"
import { VocabTopic } from "@/data/vocab/vocab.model"
import { VocabTopicList } from "./components/VocabTopicList"
import { VocabFlashcards } from "./components/VocabFlashcards"
import { VocabNotebook } from "./components/VocabNotebook"
import { useVocabStore } from "@/services/vocab/vocab.store"
import { getStyles } from "./VocabPage.styles"
import { useThemeColor } from "@/hooks/useThemeColor"
import { playPronunciation } from "@/utils/sound.utils"

interface Props {
  navigation?: any
  isTab?: boolean
}

type TabType = "topics" | "flashcards" | "notebook"

export default function VocabPage({ navigation, isTab = false }: Props) {
  const { t, i18n } = useTranslation()
  const theme = useThemeColor()
  const styles = useMemo(() => getStyles(theme), [theme])

  const [activeTab, setActiveTab] = useState<TabType>("topics")
  const [topics, setTopics] = useState<VocabTopic[]>([])
  const [selectedTopic, setSelectedTopic] = useState<VocabTopic | null>(null)
  const [loading, setLoading] = useState(true)
  const [isTopicLoading, setIsTopicLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeBandFilter, setActiveBandFilter] = useState<'all' | '5' | '6' | '7' | '8'>('all')


  const handleSelectTopic = async (topic: VocabTopic) => {
    try {
      setIsTopicLoading(true)
      const fullTopic = await vocabApi.getTopic(topic.topic)
      if (fullTopic) {
        setSelectedTopic(fullTopic)
      }
    } catch (err) {
      console.error("Failed to load topic detail:", err)
    } finally {
      setIsTopicLoading(false)
    }
  }

  // Fetch topics
  const loadData = async () => {
    try {
      setLoading(true)
      const data = await vocabApi.getTopics()
      setTopics(data)
    } catch (err) {
      console.error("Failed to load vocabulary:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Topic formatting helper
  const formatTopicName = (topic: string) => {
    const match = topic.match(/^(LR|SW)_(\d+)$/)
    if (match) {
      const type = match[1] === 'LR' ? 'Listening & Reading' : 'Speaking & Writing'
      const band = match[2]
      return `${type} (Band ${band}.0)`
    }
    return topic
  }

  // Flattened words for general notebook/flashcard operations
  const allWords = useMemo(() => {
    return topics.flatMap((t) => t.vocab_list.map((w) => ({ ...w, topicName: t.topic })))
  }, [topics])

  const savedWords = useVocabStore((state) => state.savedWords);

  // Filtered topics based on search and band
  const filteredTopics = useMemo(() => {
    let list = topics;

    if (activeBandFilter === 'all') {
      // General topics (no LR_ or SW_ prefix)
      list = list.filter((t) => !/^(LR|SW)_\d+/.test(t.topic))
    } else {
      // Specific band topics
      const regex = new RegExp(`^(LR|SW)_${activeBandFilter}`)
      list = list.filter((t) => regex.test(t.topic))
    }

    if (!searchQuery) return list
    return list.filter((t) =>
      t.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.vocab_list.some((w) => w.word.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  }, [topics, activeBandFilter, searchQuery])

  // Bookmark toggle handler
  const handleToggleSave = async (topicName: string, wordId: string | number) => {
    try {
      // Toggle locally
      const updated = await vocabApi.toggleSave(topicName, wordId)
      if (updated) {
        setTopics((prev) =>
          prev.map((t) => (t.topic === topicName ? updated : t))
        )
        if (selectedTopic && selectedTopic.topic === topicName) {
          setSelectedTopic(updated)
        }
      }
    } catch (err) {
      console.error(err)
    }
  }


  const Wrapper: any = isTab ? View : SafeAreaView

  return (
    <Wrapper style={styles.container} {...(!isTab ? { edges: ["top", "bottom"] } : {})}>
      {!isTab && <StatusBar barStyle={theme.text === '#ffffff' ? "light-content" : "dark-content"} />}
      {!isTab && (
        <LinearGradient colors={["#0f172a", "#1e293b"]} style={StyleSheet.absoluteFillObject} />
      )}

      {/* HEADER BAR */}
      {(!isTab || selectedTopic) && (
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => {
            if (selectedTopic) {
              setSelectedTopic(null)
            } else {
              navigation?.goBack()
            }
          }}>
            <ChevronLeft size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {selectedTopic ? formatTopicName(selectedTopic.topic) : t('vocab.headerTitle')}
          </Text>
          <View style={styles.headerRight}>
            <Sparkles size={18} color={theme.primary} />
          </View>
        </View>
      )}

      {/* NAVIGATION TABS */}
      {!selectedTopic && (
        <View style={styles.tabsRow}>
          {(["topics", "flashcards", "notebook"] as TabType[]).map((tab) => {
            const isActive = activeTab === tab
            const label = tab === "topics"
              ? t('vocab.tabTopics')
              : tab === "flashcards"
                ? t('vocab.tabFlashcards')
                : t('vocab.tabNotebook')
            return (
              <TouchableOpacity
                key={tab}
                activeOpacity={0.8}
                style={[styles.tabButton, isActive && styles.tabButtonActive]}
                onPress={() => {
                  setActiveTab(tab)
                }}
              >
                <Text style={[styles.tabButtonText, isActive && styles.tabButtonTextActive]}>
                  {label}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>
      )}

      {/* SEARCH BAR (Only for list modes) */}
      {!selectedTopic && activeTab === "topics" && (
        <View style={styles.searchBarWrap}>
          <Search size={18} color={theme.textSecondary} style={styles.searchIcon} />
          <TextInput
            placeholder={t('vocab.searchPlaceholder')}
            placeholderTextColor={theme.textSecondary}
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      )}

      {/* BAND FILTERS */}
      {!selectedTopic && activeTab === "topics" && (
        <View style={styles.bandFiltersWrapper}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.bandFiltersScroll}>
            {(['all', '5', '6', '7', '8'] as const).map((band) => {
              const isActive = activeBandFilter === band;
              const label = band === 'all'
                ? (i18n.language === 'vi' ? 'Chủ Đề Chung' : 'General')
                : `Band ${band}.0+`;
              return (
                <TouchableOpacity
                  key={band}
                  style={[styles.bandFilterButton, isActive && styles.bandFilterButtonActive]}
                  onPress={() => setActiveBandFilter(band)}
                >
                  <Text style={[styles.bandFilterButtonText, isActive && styles.bandFilterButtonTextActive]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      {loading || isTopicLoading ? (
        <View style={styles.loadingContainer}>
          <RefreshCw size={36} color={theme.primary} style={styles.loadingSpinner} />
          <Text style={styles.loadingText}>
            {isTopicLoading
              ? (i18n.language === 'vi' ? 'Đang tải danh sách từ...' : 'Loading words...')
              : t('vocab.loadingText')}
          </Text>
        </View>
      ) : (
        <View style={styles.body}>
          {/* A. SELECTED TOPIC DETAIL VIEW */}
          {selectedTopic ? (
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
              <View style={styles.detailHero}>
                <Text style={styles.detailTopicTitle}>{formatTopicName(selectedTopic.topic)}</Text>
                <Text style={styles.detailTopicStats}>
                  {t('vocab.detailStats', { count: selectedTopic.vocab_list.length })}
                </Text>
              </View>

              {selectedTopic.vocab_list.map((word) => (
                <View key={word.id} style={styles.wordCard}>
                  <View style={styles.wordHeader}>
                    <View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <Text style={styles.wordSpelling}>{word.word}</Text>
                        <TouchableOpacity activeOpacity={0.7} onPress={() => playPronunciation(word.word)}>
                          <Volume2 size={16} color={theme.primary} />
                        </TouchableOpacity>
                      </View>
                      <Text style={styles.wordPhonetics}>{word.pronunciation}</Text>
                    </View>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => handleToggleSave(selectedTopic.topic, word.id)}
                      style={styles.bookmarkButton}
                    >
                      <Heart
                        size={22}
                        color={word.isSaved ? "#ef4444" : theme.textSecondary}
                        fill={word.isSaved ? "#ef4444" : "transparent"}
                      />
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
              ))}
            </ScrollView>
          ) : (
            <>
              {/* B. TOPICS LIST VIEW */}
              {activeTab === "topics" && (
                <VocabTopicList
                  filteredTopics={filteredTopics}
                  setSelectedTopic={handleSelectTopic}
                  formatTopicName={formatTopicName}
                  t={t}
                  theme={theme}
                  styles={styles}
                />
              )}

              {/* C. FLASHCARDS SCREEN */}
              {activeTab === "flashcards" && (
                <VocabFlashcards
                  topics={topics}
                  savedWords={savedWords}
                  t={t}
                  theme={theme}
                  styles={styles}
                  handleToggleSave={handleToggleSave}
                />
              )}

              {/* D. MY NOTEBOOK VIEW */}
              {activeTab === "notebook" && (
                <VocabNotebook
                  savedWords={savedWords}
                  formatTopicName={formatTopicName}
                  handleToggleSave={handleToggleSave}
                  t={t}
                  theme={theme}
                  styles={styles}
                />
              )}
            </>
          )}
        </View>
      )}
    </Wrapper>
  )
}
