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
  FolderOpen
} from "lucide-react-native"
import { useTranslation } from "react-i18next"
import { vocabApi } from "@/api/vocab.api"
import { VocabTopic } from "@/data/vocab/vocab.model"
import { styles } from "./VocabPage.styles"
import { vocabTranslations } from "./VocabPage.translations"

interface Props {
  navigation?: any
  isTab?: boolean
}

type TabType = "topics" | "flashcards" | "notebook"

export default function VocabPage({ navigation, isTab = false }: Props) {
  const { i18n } = useTranslation()
  const isVi = i18n.language === "vi"
  const t = vocabTranslations[isVi ? "vi" : "en"]

  const [activeTab, setActiveTab] = useState<TabType>("topics")
  const [topics, setTopics] = useState<VocabTopic[]>([])
  const [selectedTopic, setSelectedTopic] = useState<VocabTopic | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  // Flashcards state
  const [flashcardIndex, setFlashcardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)

  // Fetch topics
  const loadData = async () => {
    try {
      setLoading(true)
      const data = await vocabApi.getTopics()
      // Filter out code prefixes if any
      const filtered = data.filter((t) => !/^(LR|SW)_\d+/.test(t.topic))
      setTopics(filtered)
    } catch (err) {
      console.error("Failed to load vocabulary:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Flattened words for general notebook/flashcard operations
  const allWords = useMemo(() => {
    return topics.flatMap((t) => t.vocab_list.map((w) => ({ ...w, topicName: t.topic })))
  }, [topics])

  const savedWords = useMemo(() => {
    return allWords.filter((w) => w.isSaved)
  }, [allWords])

  // Filtered topics based on search
  const filteredTopics = useMemo(() => {
    if (!searchQuery) return topics
    return topics.filter((t) =>
      t.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.vocab_list.some((w) => w.word.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  }, [topics, searchQuery])

  // Bookmark toggle handler
  const handleToggleSave = async (topicName: string, wordId: number) => {
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

  // Flashcards configuration
  const currentFlashcard = useMemo(() => {
    if (savedWords.length > 0) {
      return savedWords[flashcardIndex % savedWords.length]
    }
    if (allWords.length > 0) {
      return allWords[flashcardIndex % allWords.length]
    }
    return null
  }, [savedWords, allWords, flashcardIndex])

  const handleNextFlashcard = () => {
    setIsFlipped(false)
    setFlashcardIndex((prev) => prev + 1)
  }

  const handleFlipCard = () => {
    setIsFlipped(!isFlipped)
  }

  const Wrapper: any = isTab ? View : SafeAreaView;

  return (
    <Wrapper style={styles.container} {...(!isTab ? { edges: ["top", "bottom"] } : {})}>
      {!isTab && <StatusBar barStyle="light-content" />}
      <LinearGradient colors={["#0f172a", "#1e293b"]} style={StyleSheet.absoluteFillObject} />

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
            <ChevronLeft size={24} color="#f8fafc" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {selectedTopic ? selectedTopic.topic : t.headerTitle}
          </Text>
          <View style={styles.headerRight}>
            <Sparkles size={18} color="#3b82f6" />
          </View>
        </View>
      )}

      {/* NAVIGATION TABS */}
      {!selectedTopic && (
        <View style={styles.tabsRow}>
          {(["topics", "flashcards", "notebook"] as TabType[]).map((tab) => {
            const isActive = activeTab === tab
            const label = tab === "topics" ? t.tabTopics : tab === "flashcards" ? t.tabFlashcards : t.tabNotebook
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
          <Search size={18} color="#64748b" style={styles.searchIcon} />
          <TextInput
            placeholder={t.searchPlaceholder}
            placeholderTextColor="#64748b"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      )}

      {loading ? (
        <View style={styles.loadingContainer}>
          <RefreshCw size={36} color="#3b82f6" style={styles.loadingSpinner} />
          <Text style={styles.loadingText}>{t.loadingText}</Text>
        </View>
      ) : (
        <View style={styles.body}>
          {/* A. SELECTED TOPIC DETAIL VIEW */}
          {selectedTopic ? (
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
              <View style={styles.detailHero}>
                <Text style={styles.detailTopicTitle}>{selectedTopic.topic}</Text>
                <Text style={styles.detailTopicStats}>
                  {t.detailStats(selectedTopic.vocab_list.length)}
                </Text>
              </View>

              {selectedTopic.vocab_list.map((word) => (
                <View key={word.id} style={styles.wordCard}>
                  <View style={styles.wordHeader}>
                    <View>
                      <Text style={styles.wordSpelling}>{word.word}</Text>
                      <Text style={styles.wordPhonetics}>{word.pronunciation}</Text>
                    </View>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => handleToggleSave(selectedTopic.topic, word.id)}
                      style={styles.bookmarkButton}
                    >
                      <Heart
                        size={22}
                        color={word.isSaved ? "#ef4444" : "#94a3b8"}
                        fill={word.isSaved ? "#ef4444" : "transparent"}
                      />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.divider} />

                  <Text style={styles.meaningLabel}>{t.meaningLabel}</Text>
                  <Text style={styles.wordMeaning}>{word.meaning}</Text>

                  {word.example && (
                    <>
                      <Text style={styles.exampleLabel}>{t.exampleLabel}</Text>
                      <Text style={styles.wordExample}>"{word.example}"</Text>
                    </>
                  )}

                  {word.synonyms && word.synonyms.length > 0 && (
                    <View style={styles.synonymsRow}>
                      <Text style={styles.synonymsLabel}>{t.synonymsLabel}</Text>
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
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                  <View style={styles.topicsGrid}>
                    {filteredTopics.map((topic, index) => {
                      const total = topic.vocab_list.length
                      const saved = topic.numberSaved ?? 0
                      const progress = total ? Math.round((saved / total) * 100) : 0

                      return (
                        <TouchableOpacity
                          key={index}
                          activeOpacity={0.85}
                          style={styles.topicCard}
                          onPress={() => {
                            setSelectedTopic(topic)
                          }}
                        >
                          <View style={styles.topicCardHeader}>
                            <FolderOpen size={20} color="#3b82f6" />
                            <Text style={styles.topicCardTitle}>{topic.topic}</Text>
                          </View>

                          <View style={styles.progressBarBg}>
                            <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
                          </View>

                          <View style={styles.topicCardMeta}>
                            <Text style={styles.topicCardCount}>
                              {t.savedMeta(saved, total)}
                            </Text>
                            <ChevronRight size={16} color="#475569" />
                          </View>
                        </TouchableOpacity>
                      )
                    })}
                  </View>
                </ScrollView>
              )}

              {/* C. FLASHCARDS SCREEN */}
              {activeTab === "flashcards" && (
                <View style={styles.flashcardsContainer}>
                  {currentFlashcard ? (
                    <View style={styles.flashcardView}>
                      <TouchableOpacity
                        activeOpacity={0.95}
                        onPress={handleFlipCard}
                        style={[styles.flashcard, isFlipped && styles.flashcardFlipped]}
                      >
                        <LinearGradient
                          colors={isFlipped ? ["#1e293b", "#0f172a"] : ["#1e40af", "#1e3a8a"]}
                          style={styles.flashcardGradient}
                        >
                          {!isFlipped ? (
                            <View style={styles.cardSide}>
                              <BookOpen size={48} color="#93c5fd" style={styles.cardIcon} />
                              <Text style={styles.cardSpelling}>{currentFlashcard.word}</Text>
                              <Text style={styles.cardPhonetics}>{currentFlashcard.pronunciation}</Text>
                              <Text style={styles.tapToFlipText}>{t.tapToFlip}</Text>
                            </View>
                          ) : (
                            <View style={styles.cardSide}>
                              <Bookmark size={40} color="#f87171" style={styles.cardIcon} />
                              <Text style={styles.cardMeaning}>{currentFlashcard.meaning}</Text>
                              {currentFlashcard.example && (
                                <Text style={styles.cardExample}>"{currentFlashcard.example}"</Text>
                              )}
                              <Text style={styles.tapToFlipText}>{t.tapToFlipBack}</Text>
                            </View>
                          )}
                        </LinearGradient>
                      </TouchableOpacity>

                      <View style={styles.flashcardControls}>
                        <TouchableOpacity
                          activeOpacity={0.8}
                          onPress={handleNextFlashcard}
                          style={styles.nextCardButton}
                        >
                          <Text style={styles.nextCardButtonText}>{t.nextCard}</Text>
                          <ChevronRight size={18} color="#0f172a" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : (
                    <View style={styles.emptyContainer}>
                      <BookOpen size={48} color="#475569" />
                      <Text style={styles.emptyText}>{t.emptyWords}</Text>
                    </View>
                  )}
                </View>
              )}

              {/* D. MY NOTEBOOK VIEW */}
              {activeTab === "notebook" && (
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                  {savedWords.length > 0 ? (
                    savedWords.map((word) => (
                      <View key={word.id} style={styles.wordCard}>
                        <View style={styles.wordHeader}>
                          <View>
                            <Text style={styles.wordSpelling}>{word.word}</Text>
                            <View style={styles.notebookBadgeRow}>
                              <Text style={styles.wordPhonetics}>{word.pronunciation}</Text>
                              <View style={styles.topicBadge}>
                                <Text style={styles.topicBadgeText}>{word.topicName}</Text>
                              </View>
                            </View>
                          </View>
                          <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => handleToggleSave(word.topicName || "", word.id)}
                            style={styles.bookmarkButton}
                          >
                            <Heart size={22} color="#ef4444" fill="#ef4444" />
                          </TouchableOpacity>
                        </View>

                        <View style={styles.divider} />

                        <Text style={styles.meaningLabel}>{t.meaningLabel}</Text>
                        <Text style={styles.wordMeaning}>{word.meaning}</Text>
                        {word.example && <Text style={styles.wordExample}>"{word.example}"</Text>}
                      </View>
                    ))
                  ) : (
                    <View style={styles.emptyContainer}>
                      <Heart size={48} color="#475569" />
                      <Text style={styles.emptyText}>{t.notebookEmpty}</Text>
                    </View>
                  )}
                </ScrollView>
              )}
            </>
          )}
        </View>
      )}
    </Wrapper>
  )
}
