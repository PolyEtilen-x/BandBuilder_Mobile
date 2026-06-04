import React, { useState, useRef, useMemo } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Modal,
  StatusBar,
  Pressable,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { WebView } from "react-native-webview"
import { Audio } from "expo-av"
import {
  ChevronLeft,
  Mic,
  Sparkles,
  Volume2,
  Heart,
  X,
  Play,
  Pause,
  Repeat,
} from "lucide-react-native"
import { useTranslation } from "react-i18next"
import { useThemeColor } from "@/hooks/useThemeColor"
import { useVocabStore } from "@/services/vocab/vocab.store"
import { getDictionary } from "@/api/dictionary.api"
import { getStyles } from "./PronunciationPracticePage.style"

import { usePronunciationTopics, usePronunciationTopicDetail } from "@/hooks/usePronunciation"
import { useYoutubeShadowing } from "@/hooks/useYoutubeShadowing"

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds === null || seconds === undefined) return "00:00"
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
}

export default function PronunciationPracticePage({ navigation }: any) {
  const { t, i18n } = useTranslation()
  const theme = useThemeColor()
  const styles = useMemo(() => getStyles(theme), [theme])

  // Zustand Store
  const { savedWords, addWord, removeWord } = useVocabStore()

  // State Detail View
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null)

  // Fetch queries
  const { data: topics = [], isLoading: loadingTopics } = usePronunciationTopics()
  const { data: detail = null, isLoading: loadingDetail } = usePronunciationTopicDetail(selectedTopicId)

  // Active Workspace Tab inside Detail
  const [activeTab, setActiveTab] = useState<"shadowing" | "vocab">("shadowing")

  // Webview Ref
  const webViewRef = useRef<WebView | null>(null)

  // Use hook for Youtube Shadowing
  const {
    isPlayerReady,
    isPlaying,
    playbackSpeed,
    isLooping,
    currentTime,
    duration,
    selectedSentence,
    activeSentence,
    htmlSource,
    videoId,
    onWebViewMessage,
    togglePlay,
    toggleLoop,
    seekTo,
    setSpeed,
    playSentence,
    clearSelectedSentence
  } = useYoutubeShadowing(detail, webViewRef)

  // Translate State for sentences
  const [translations, setTranslations] = useState<Record<string, string>>({})
  const [translatingIds, setTranslatingIds] = useState<Record<string, boolean>>({})

  // Dictionary Lookup Modal State
  const [dictModalVisible, setDictModalVisible] = useState(false)
  const [selectedWord, setSelectedWord] = useState<string | null>(null)
  const [dictLoading, setDictLoading] = useState(false)
  const [dictResult, setDictResult] = useState<any | null>(null)

  // Audio helper using expo-av
  const playAudio = async (url: string) => {
    if (!url) return
    try {
      const { sound } = await Audio.Sound.createAsync({ uri: url })
      await sound.playAsync()
    } catch (e) {
      console.warn("Failed to play audio:", e)
    }
  }

  // Sentence translator
  const handleTranslate = async (sentenceId: string, text: string) => {
    if (translations[sentenceId]) {
      setTranslations((p) => {
        const n = { ...p }
        delete n[sentenceId]
        return n
      })
      return
    }

    setTranslatingIds((p) => ({ ...p, [sentenceId]: true }))
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=vi&dt=t&q=${encodeURIComponent(text)}`
      const res = await fetch(url)
      if (res.ok) {
        const data = await res.json()
        const translated = data[0]?.map((s: any) => s[0]).filter(Boolean).join("") || ""
        setTranslations((p) => ({ ...p, [sentenceId]: translated }))
      }
    } catch (e) {
      console.warn("Translation failed:", e)
    } finally {
      setTranslatingIds((p) => ({ ...p, [sentenceId]: false }))
    }
  }

  // Dictionary Lookup
  const handleWordClick = async (word: string, context: string) => {
    const cleanWord = word.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()?"'"]/g, "").trim()
    if (!cleanWord) return

    setSelectedWord(cleanWord)
    setDictModalVisible(true)
    setDictLoading(true)
    setDictResult(null)

    try {
      const result = await getDictionary(cleanWord, context)
      setDictResult(result)
    } catch (e) {
      console.warn("Dictionary look up failed:", e)
    } finally {
      setDictLoading(false)
    }
  }

  const isWordSaved = (word: string) => {
    return savedWords.some((w) => w.word.toLowerCase() === word.toLowerCase())
  }

  const handleToggleSaveWord = (wordObj: any) => {
    if (isWordSaved(wordObj.word)) {
      removeWord(wordObj.word)
    } else {
      addWord({
        word: wordObj.word,
        phonetic: wordObj.phonetic || "",
        audio: wordObj.audio || "",
        meaning: wordObj.meaning || "",
        related: wordObj.related || "",
        explainVN: wordObj.explainVN || "",
        example: wordObj.example || "",
        translation: wordObj.translation || "",
      })
    }
  }

  // Word token renderer
  const renderClickableText = (text: string) => {
    const words = text.split(/\s+/)
    return (
      <View style={styles.clickableWordsRow}>
        {words.map((word, i) => {
          return (
            <TouchableOpacity
              key={i}
              activeOpacity={0.6}
              onPress={() => handleWordClick(word, text)}
              style={styles.wordPressable}
            >
              <Text style={styles.wordText}>{word} </Text>
            </TouchableOpacity>
          )
        })}
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <StatusBar barStyle={theme.text === "#ffffff" ? "light-content" : "dark-content"} />

      {/* HEADER BAR */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (selectedTopicId) {
              setSelectedTopicId(null)
            } else {
              navigation.goBack()
            }
          }}
        >
          <ChevronLeft size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {detail ? detail.title : "YouTube Shadowing"}
        </Text>
        <View style={styles.headerRight}>
          <Sparkles size={18} color={theme.primary} />
        </View>
      </View>

      {/* A. LIST OF TOPICS VIEW */}
      {!selectedTopicId && (
        <>
          {loadingTopics ? (
            <View style={styles.listLoaderContainer}>
              <ActivityIndicator size="large" color={theme.primary} />
            </View>
          ) : (
            <FlatList
              data={topics}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              ListHeaderComponent={
                <View style={styles.pageIntro}>
                  <Text style={styles.pageTitle}>Luyện Phát Âm</Text>
                  <Text style={styles.pageDesc}>
                    Luyện phát âm shadowing qua video YouTube thực tế cùng transcript đồng bộ và tra cứu từ vựng thông minh.
                  </Text>
                </View>
              }
              renderItem={({ item }) => (
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.topicCard}
                  onPress={() => setSelectedTopicId(item.id)}
                >
                  <View style={styles.topicCardLeft}>
                    <View style={styles.topicIconWrap}>
                      <Mic size={20} color={theme.primary} />
                    </View>
                    <View style={styles.topicTitleCol}>
                      <Text style={styles.topicCardTitle} numberOfLines={1}>
                        {item.title}
                      </Text>
                      <View style={styles.topicCardMeta}>
                        <Text style={styles.topicCardBadge}>
                          📚 {item.vocabCount} từ vựng
                        </Text>
                        <Text style={styles.topicCardBadge}>
                          ·  🎙️ {item.sentencesCount} câu
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>Chưa có chủ đề luyện phát âm nào.</Text>
                </View>
              }
            />
          )}
        </>
      )}

      {/* B. TOPIC DETAIL VIEW */}
      {selectedTopicId && (
        <View style={{ flex: 1 }}>
          {loadingDetail ? (
            <View style={styles.listLoaderContainer}>
              <ActivityIndicator size="large" color={theme.primary} />
            </View>
          ) : (
            detail && (
              <View style={{ flex: 1 }}>
                {/* 1. Youtube Embedded WebView */}
                {videoId ? (
                  <View style={styles.videoCard}>
                    <WebView
                      ref={webViewRef}
                      source={{ html: htmlSource }}
                      originWhitelist={["*"]}
                      style={styles.webview}
                      allowsInlineMediaPlayback={true}
                      mediaPlaybackRequiresUserAction={false}
                      javaScriptEnabled={true}
                      domStorageEnabled={true}
                      onMessage={onWebViewMessage}
                    />
                  </View>
                ) : (
                  <View style={[styles.videoCard, { justifyContent: "center", alignItems: "center" }]}>
                    <Text style={{ color: "#ffffff" }}>Không tìm thấy video link</Text>
                  </View>
                )}

                {/* 2. Custom controls toolbar */}
                <View style={styles.controlsRow}>
                  <View style={styles.controlsLeft}>
                    <TouchableOpacity
                      style={[styles.controlBtn, isPlaying && styles.controlBtnActive]}
                      onPress={togglePlay}
                      disabled={!isPlayerReady}
                    >
                      {isPlaying ? (
                        <Pause size={14} color={isPlaying ? theme.primary : theme.text} />
                      ) : (
                        <Play size={14} color={theme.text} />
                      )}
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.controlBtn, isLooping && styles.controlBtnActive]}
                      onPress={toggleLoop}
                      disabled={!isPlayerReady}
                    >
                      <Repeat size={14} color={isLooping ? theme.primary : theme.text} />
                    </TouchableOpacity>

                    {selectedSentence && (
                      <TouchableOpacity style={styles.controlBtn} onPress={clearSelectedSentence}>
                        <X size={14} color={theme.text} />
                      </TouchableOpacity>
                    )}
                  </View>

                  <View style={styles.speedGroup}>
                    <Text style={styles.speedLabel}>Tốc độ:</Text>
                    {[0.75, 1, 1.25].map((s) => (
                      <TouchableOpacity
                        key={s}
                        style={[styles.speedBtn, playbackSpeed === s && styles.speedBtnActive]}
                        onPress={() => setSpeed(s)}
                        disabled={!isPlayerReady}
                      >
                        <Text style={[styles.speedBtnText, playbackSpeed === s && styles.speedBtnTextActive]}>
                          {s}x
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <Text style={styles.timerText}>
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </Text>
                </View>

                {/* 3. Segmented Navigation Tabs */}
                <View style={styles.workspaceTabs}>
                  <TouchableOpacity
                    style={[styles.workspaceTabBtn, activeTab === "shadowing" && styles.workspaceTabBtnActive]}
                    onPress={() => setActiveTab("shadowing")}
                  >
                    <Text style={[styles.workspaceTabBtnText, activeTab === "shadowing" && styles.workspaceTabBtnTextActive]}>
                      🎙️ Shadowing
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.workspaceTabBtn, activeTab === "vocab" && styles.workspaceTabBtnActive]}
                    onPress={() => setActiveTab("vocab")}
                  >
                    <Text style={[styles.workspaceTabBtnText, activeTab === "vocab" && styles.workspaceTabBtnTextActive]}>
                      📚 Từ Vựng ({detail.vocabs.length})
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* 4. Tab contents scrollview */}
                <ScrollView showsVerticalScrollIndicator={false}>
                  {/* C. SHADOWING SUB-TAB */}
                  {activeTab === "shadowing" && (
                    <View style={styles.shadowingList}>
                      {detail.sentences.map((sentence) => {
                        const isActive = activeSentence?.id === sentence.id
                        const isTranslating = translatingIds[sentence.id]
                        const hasTranslation = !!translations[sentence.id]

                        return (
                          <TouchableOpacity
                            key={sentence.id}
                            activeOpacity={0.9}
                            onPress={() => playSentence(sentence)}
                            style={[styles.sentenceRow, isActive && styles.sentenceRowActive]}
                          >
                            <View style={styles.sentenceHeader}>
                              <Text style={styles.sentenceTime}>
                                ⏱ {formatTime(sentence.startTime)} – {formatTime(sentence.endTime)}
                              </Text>

                              <TouchableOpacity
                                style={styles.translateBtn}
                                onPress={() => handleTranslate(sentence.id, sentence.text)}
                              >
                                <Text style={styles.translateBtnText}>
                                  {isTranslating ? "..." : hasTranslation ? "Ẩn" : "Dịch"}
                                </Text>
                              </TouchableOpacity>
                            </View>

                            {renderClickableText(sentence.text)}

                            {hasTranslation && (
                              <Text style={styles.sentenceTranslation}>
                                {translations[sentence.id]}
                              </Text>
                            )}
                          </TouchableOpacity>
                        )
                      })}
                    </View>
                  )}

                  {/* D. VOCABULARY SUB-TAB */}
                  {activeTab === "vocab" && (
                    <View style={styles.vocabList}>
                      {detail.vocabs.map((v) => {
                        const isSaved = isWordSaved(v.word)
                        return (
                          <View key={v.id} style={styles.vocabCard}>
                            <View style={styles.vocabCardHeader}>
                              <View style={styles.vocabWordCol}>
                                <Text style={styles.vocabWord}>{v.word}</Text>
                                <Text style={styles.vocabIpa}>{v.ipa}</Text>
                              </View>

                              <View style={styles.vocabActions}>
                                <TouchableOpacity
                                  style={styles.vocabAudioBtn}
                                  onPress={() => playAudio(v.audioUrl || "")}
                                >
                                  <Volume2 size={14} color={theme.primary} />
                                  <Text style={styles.vocabAudioBtnText}>Nghe</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                  style={styles.vocabSaveBtn}
                                  onPress={() => handleToggleSaveWord(v)}
                                >
                                  <Heart
                                    size={20}
                                    color={isSaved ? "#ef4444" : theme.textSecondary}
                                    fill={isSaved ? "#ef4444" : "transparent"}
                                  />
                                </TouchableOpacity>
                              </View>
                            </View>

                            <View style={styles.divider} />

                            <Text style={styles.vocabFieldLabel}>Định nghĩa / Meaning</Text>
                            <Text style={styles.vocabMeaning}>{v.meaning}</Text>

                            {v.example ? (
                              <View>
                                <Text style={styles.vocabFieldLabel}>Ví dụ / Example</Text>
                                <Text style={styles.vocabExample}>"{v.example}"</Text>
                                {v.exampleTranslation ? (
                                  <Text style={styles.vocabTranslation}>
                                    {v.exampleTranslation}
                                  </Text>
                                ) : null}
                              </View>
                            ) : null}
                          </View>
                        )
                      })}
                    </View>
                  )}
                </ScrollView>
              </View>
            )
          )}
        </View>
      )}

      {/* E. DICTIONARY LOOKUP BOTTOM MODAL */}
      <Modal
        visible={dictModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setDictModalVisible(false)}
      >
        <Pressable
          style={styles.dictModalContainer}
          onPress={() => setDictModalVisible(false)}
        >
          <Pressable style={styles.dictModalContent} onPress={(e) => e.stopPropagation()}>
            <View style={styles.dictModalHeader}>
              <Text style={styles.dictModalTitle} numberOfLines={1}>
                {selectedWord}
              </Text>
              
              {dictResult && (
                <TouchableOpacity
                  style={styles.dictModalSaveBtn}
                  onPress={() => handleToggleSaveWord(dictResult)}
                >
                  <Heart
                    size={22}
                    color={isWordSaved(dictResult.word) ? "#ef4444" : theme.textSecondary}
                    fill={isWordSaved(dictResult.word) ? "#ef4444" : "transparent"}
                  />
                </TouchableOpacity>
              )}
            </View>

            {dictLoading ? (
              <View style={styles.dictLoadingContainer}>
                <ActivityIndicator size="small" color={theme.primary} />
                <Text style={styles.dictLoadingText}>Đang tra cứu từ điển...</Text>
              </View>
            ) : (
              dictResult && (
                <ScrollView contentContainerStyle={styles.dictModalBody} showsVerticalScrollIndicator={false}>
                  {dictResult.phonetic ? (
                    <Text style={styles.dictPhonetics}>Phát âm: {dictResult.phonetic}</Text>
                  ) : null}

                  <View style={styles.dictSection}>
                    <Text style={styles.dictSectionLabel}>Định nghĩa (EN)</Text>
                    <Text style={styles.dictText}>{dictResult.meaning || "N/A"}</Text>
                  </View>

                  <View style={styles.dictSection}>
                    <Text style={styles.dictSectionLabel}>Giải thích (VI)</Text>
                    <Text style={styles.dictText}>{dictResult.explainVN || "N/A"}</Text>
                  </View>

                  {dictResult.example && dictResult.example !== "N/A" ? (
                    <View style={styles.dictSection}>
                      <Text style={styles.dictSectionLabel}>Ví dụ</Text>
                      <Text style={styles.dictExampleText}>"{dictResult.example}"</Text>
                      {dictResult.translation ? (
                        <Text style={styles.dictTranslateText}>
                          {dictResult.translation}
                        </Text>
                      ) : null}
                    </View>
                  ) : null}

                  {dictResult.related && dictResult.related !== "No synonyms found" ? (
                    <View style={styles.dictSection}>
                      <Text style={styles.dictSectionLabel}>Từ liên quan / Đồng nghĩa</Text>
                      <Text style={styles.dictText}>{dictResult.related}</Text>
                    </View>
                  ) : null}

                  {dictResult.audio ? (
                    <TouchableOpacity
                      style={[styles.closeModalBtn, { backgroundColor: theme.primary + "15", borderWidth: 1, borderColor: theme.primary, marginBottom: 8 }]}
                      onPress={() => playAudio(dictResult.audio)}
                    >
                      <Text style={[styles.closeModalBtnText, { color: theme.primary }]}>🔊 Nghe phát âm</Text>
                    </TouchableOpacity>
                  ) : null}
                </ScrollView>
              )
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  )
}
