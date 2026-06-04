import React, { useState, useEffect, useMemo } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator,
  StatusBar,
  TextInput,
  Image,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import {
  ChevronLeft,
  Search,
  BookOpen,
  FileText,
  X,
} from "lucide-react-native"
import { useThemeColor } from "@/hooks/useThemeColor"
import {
  practiceGeneralApi,
  WritingTaskType,
  WritingSampleTopicListItemDto,
  WritingSampleTopicDetailDto,
  WritingEssayDto,
} from "@/api/practiceGeneral.api"
import { getStyles } from "./WritingSamplesPage.style"

const BAND_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  "6": { bg: "#f9fafb", border: "#e5e7eb", text: "#4b5563" },
  "7": { bg: "#eff6ff", border: "#bfdbfe", text: "#1e40af" },
  "8": { bg: "#ecfdf5", border: "#a7f3d0", text: "#065f46" },
}

function getBandColor(score: number) {
  const key = String(Math.floor(score))
  return BAND_COLORS[key] ?? { bg: "#f5f3ff", border: "#ddd6fe", text: "#5b21b6" }
}

const renderParagraphs = (text: string, styles: any) => {
  if (!text) return null
  return text.split(/\n+/).map((para, i) => {
    const trimmed = para.trim()
    if (!trimmed) return null
    return (
      <Text key={i} style={styles.paragraph}>
        {trimmed}
      </Text>
    )
  })
}

export default function WritingSamplesPage({ navigation }: any) {
  const theme = useThemeColor()
  const styles = useMemo(() => getStyles(theme), [theme])

  // List State
  const [activeTask, setActiveTask] = useState<WritingTaskType | "ALL">("ALL")
  const [topics, setTopics] = useState<WritingSampleTopicListItemDto[]>([])
  const [loadingList, setLoadingList] = useState(false)
  
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  // Detail State
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null)
  const [detail, setDetail] = useState<WritingSampleTopicDetailDto | null>(null)
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [activeBand, setActiveBand] = useState<number | null>(null)

  useEffect(() => {
    const fetchList = async () => {
      try {
        setLoadingList(true)
        const taskType = activeTask === "ALL" ? undefined : activeTask
        const data = await practiceGeneralApi.getWritingSampleTopics(taskType)
        setTopics(data)
        setSelectedCategory("All")
      } catch (e) {
        console.error("Failed to fetch writing topics:", e)
      } finally {
        setLoadingList(false)
      }
    }
    fetchList()
  }, [activeTask])

  useEffect(() => {
    if (!selectedTopicId) {
      setDetail(null)
      return
    }
    const fetchDetail = async () => {
      try {
        setLoadingDetail(true)
        const data = await practiceGeneralApi.getWritingSampleTopicDetail(selectedTopicId)
        setDetail(data)
      } catch (e) {
        console.error("Failed to fetch writing detail:", e)
      } finally {
        setLoadingDetail(false)
      }
    }
    fetchDetail()
  }, [selectedTopicId])

  const categories = useMemo(() => {
    const cats = topics.map((t) => t.category).filter(Boolean)
    return ["All", ...Array.from(new Set(cats))]
  }, [topics])

  const filteredTopics = useMemo(() => {
    return topics.filter((t) => {
      const matchesCategory =
        selectedCategory === "All" ||
        (t.category && t.category.toLowerCase() === selectedCategory.toLowerCase())

      const matchesSearch =
        searchQuery.trim() === "" ||
        (t.category && t.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (t.prompt && t.prompt.toLowerCase().includes(searchQuery.toLowerCase()))

      return matchesCategory && matchesSearch
    })
  }, [topics, selectedCategory, searchQuery])

  // Setup initial active band when detail loads
  useEffect(() => {
    if (detail && detail.essays.length > 0) {
      const highest = Math.max(...detail.essays.map((e) => e.bandScore))
      setActiveBand(highest)
    }
  }, [detail])

  const bands = useMemo(() => {
    if (!detail) return []
    const list = [...new Set(detail.essays.map((e) => e.bandScore))]
    return list.sort((a, b) => b - a)
  }, [detail])

  const visibleEssays = useMemo(() => {
    if (!detail) return []
    if (activeBand !== null) {
      return detail.essays.filter((e) => e.bandScore === activeBand)
    }
    return detail.essays
  }, [detail, activeBand])

  const renderEssayCard = (essay: WritingEssayDto) => {
    const wordCount = essay.essayText ? essay.essayText.trim().split(/\s+/).filter(Boolean).length : 0
    let sectionCounter = 0
    const nextSec = () => { sectionCounter++; return sectionCounter }

    const hasSec1 = !!essay.analysis
    const hasSec3 = !!(essay.essayTranslation)
    const hasSec4 = !!(essay.analysis?.keyVocabulary && essay.analysis.keyVocabulary.length > 0)

    return (
      <View key={essay.id} style={styles.essayCard}>
        {/* 1. Dàn ý & Phân tích */}
        {hasSec1 && (
          <View style={{ marginBottom: 24 }}>
            <Text style={styles.sectionTitle}>
              <Text style={styles.sectionNumber}>{nextSec()}.</Text> Dàn ý & Phân tích chi tiết
            </Text>

            <View style={styles.analysisBox}>
              {essay.analysis!.outline && (
                <View style={{ marginBottom: 16 }}>
                  <Text style={styles.outlineTitle}>📋 Dàn ý (Outline)</Text>
                  {renderParagraphs(essay.analysis!.outline, styles)}
                </View>
              )}

              {essay.analysis!.overallComment && (
                <View style={{ marginBottom: 16 }}>
                  <Text style={[styles.paragraph, { fontStyle: "italic", color: theme.textSecondary }]}>
                    {essay.analysis!.overallComment}
                  </Text>
                </View>
              )}

              {/* Criteria */}
              {[
                { label: "Task Achievement / Response", score: essay.analysis!.taskAchievement },
                { label: "Coherence & Cohesion", score: essay.analysis!.coherenceCohesion },
                { label: "Lexical Resource", score: essay.analysis!.lexicalResource },
                { label: "Grammatical Range & Accuracy", score: essay.analysis!.grammaticalRange },
              ].map((c, idx) => {
                if (c.score === undefined || c.score === null) return null
                const percentage = (c.score / 9) * 100
                let barColor = theme.primary
                if (c.score >= 8.0) barColor = "#10b981"
                else if (c.score >= 7.0) barColor = "#3b82f6"
                else if (c.score >= 6.0) barColor = "#f59e0b"

                return (
                  <View key={idx} style={styles.scoreRow}>
                    <View style={styles.scoreInfo}>
                      <Text style={styles.scoreLabel}>{c.label}</Text>
                      <Text style={styles.scoreVal}>Band {c.score.toFixed(1)}</Text>
                    </View>
                    <View style={styles.progressTrack}>
                      <View style={[styles.progressFill, { width: `${percentage}%`, backgroundColor: barColor }]} />
                    </View>
                  </View>
                )
              })}

              {/* Strengths & Improvements */}
              {essay.analysis!.strengths && essay.analysis!.strengths.length > 0 && (
                <View style={[styles.feedbackCol, { backgroundColor: "#ecfdf5" }]}>
                  <Text style={[styles.feedbackTitle, { color: "#065f46" }]}>✓ Điểm mạnh nổi bật</Text>
                  {essay.analysis!.strengths.map((s, i) => (
                    <Text key={i} style={[styles.feedbackItem, { color: "#064e3b" }]}>• {s}</Text>
                  ))}
                </View>
              )}

              {essay.analysis!.improvements && essay.analysis!.improvements.length > 0 && (
                <View style={[styles.feedbackCol, { backgroundColor: "#fffbeb" }]}>
                  <Text style={[styles.feedbackTitle, { color: "#b45309" }]}>! Điểm cần cải thiện</Text>
                  {essay.analysis!.improvements.map((imp, i) => (
                    <Text key={i} style={[styles.feedbackItem, { color: "#78350f" }]}>• {imp}</Text>
                  ))}
                </View>
              )}
            </View>
          </View>
        )}

        {/* 2. Bài viết mẫu */}
        <View style={{ marginBottom: 24 }}>
          <View style={styles.essayHeaderRow}>
            <Text style={styles.sectionTitle}>
              <Text style={styles.sectionNumber}>{nextSec()}.</Text> Bài viết mẫu (Band {essay.bandScore.toFixed(1)})
            </Text>
            <View style={styles.wordCountBadge}>
              <FileText size={12} color={theme.textSecondary} />
              <Text style={styles.wordCountText}>{wordCount} words</Text>
            </View>
          </View>
          {renderParagraphs(essay.essayText, styles)}
        </View>

        {/* 3. Bản dịch */}
        {hasSec3 && (
          <View style={{ marginBottom: 24 }}>
            <Text style={styles.sectionTitle}>
              <Text style={styles.sectionNumber}>{nextSec()}.</Text> Bản dịch tiếng Việt
            </Text>
            <View style={styles.translationBox}>
              {renderParagraphs(essay.essayTranslation!, styles)}
            </View>
          </View>
        )}

        {/* 4. Từ vựng */}
        {hasSec4 && (
          <View style={{ marginBottom: 24 }}>
            <Text style={styles.sectionTitle}>
              <Text style={styles.sectionNumber}>{nextSec()}.</Text> Từ vựng & Cấu trúc "ăn điểm"
            </Text>
            <View style={styles.vocabTable}>
              {essay.analysis!.keyVocabulary!.map((item, i) => (
                <View key={i} style={styles.vocabRow}>
                  <Text style={styles.vocabPhrase}>{item.phrase}</Text>
                  <Text style={styles.vocabMeaning}>{item.meaning}</Text>
                  <Text style={styles.vocabContext}>"{item.context}"</Text>
                </View>
              ))}
            </View>
          </View>
        )}
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
          {detail ? "Chi tiết bài mẫu" : "Bài mẫu Writing"}
        </Text>
        <View style={styles.headerRight} />
      </View>

      {/* LIST VIEW */}
      {!selectedTopicId && (
        <FlatList
          data={filteredTopics}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <View>
              <View style={styles.pageIntro}>
                <Text style={styles.pageTitle}>Bài mẫu Writing</Text>
                <Text style={styles.pageDesc}>
                  Nghiên cứu các bài viết mẫu Band 6.0+ đến 8.5+ cho IELTS Writing Task 1 & Task 2.
                </Text>
              </View>

              <View style={styles.searchContainer}>
                <Search size={18} color={theme.textSecondary} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Tìm kiếm chủ đề..."
                  placeholderTextColor={theme.textSecondary}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery("")}>
                    <X size={18} color={theme.textSecondary} />
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.tabsContainer}>
                {(["ALL", "TASK_1", "TASK_2"] as const).map((type) => {
                  const isActive = activeTask === type
                  const label = type === "ALL" ? "Tất cả" : type === "TASK_1" ? "Task 1" : "Task 2"
                  return (
                    <TouchableOpacity
                      key={type}
                      style={[styles.tabBtn, isActive && styles.tabBtnActive]}
                      onPress={() => setActiveTask(type)}
                    >
                      <Text style={[styles.tabBtnText, isActive && styles.tabBtnTextActive]}>
                        {label}
                      </Text>
                    </TouchableOpacity>
                  )
                })}
              </View>

              {categories.length > 1 && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
                  {categories.map((cat) => {
                    const isActive = selectedCategory === cat
                    return (
                      <TouchableOpacity
                        key={cat}
                        style={[styles.catChip, isActive && styles.catChipActive]}
                        onPress={() => setSelectedCategory(cat)}
                      >
                        <Text style={[styles.catChipText, isActive && styles.catChipTextActive]}>
                          {cat}
                        </Text>
                      </TouchableOpacity>
                    )
                  })}
                </ScrollView>
              )}
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.topicCard}
              onPress={() => setSelectedTopicId(item.id)}
            >
              <View style={styles.topicCardMeta}>
                <View style={item.taskType === "TASK_1" ? styles.taskBadge1 : styles.taskBadge2}>
                  <Text style={item.taskType === "TASK_1" ? styles.taskBadge1Text : styles.taskBadge2Text}>
                    {item.taskType === "TASK_1" ? "Task 1" : "Task 2"}
                  </Text>
                </View>
                <Text style={styles.topicCategory}>{item.category}</Text>
              </View>
              <Text style={styles.topicPrompt} numberOfLines={3}>
                {item.prompt}
              </Text>
              <View style={styles.topicFooter}>
                <Text style={styles.topicCount}>
                  <BookOpen size={14} color={theme.textSecondary} style={{ marginRight: 4 }} />
                  {item.essayCount} Bài mẫu
                </Text>
                <Text style={styles.topicAction}>Học ngay →</Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            loadingList ? (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={theme.primary} />
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>Không tìm thấy bài mẫu nào.</Text>
              </View>
            )
          }
        />
      )}

      {/* DETAIL VIEW */}
      {selectedTopicId && (
        <ScrollView style={styles.detailScroll} contentContainerStyle={styles.detailContent}>
          {loadingDetail ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color={theme.primary} />
            </View>
          ) : detail && (
            <View>
              {/* Prompt Card */}
              <View style={styles.promptCard}>
                <View style={styles.promptHeader}>
                  <Text style={styles.promptLabel}>Đề thi IELTS Writing</Text>
                  <View style={styles.promptMetaChip}>
                    <Text style={{ fontSize: 12, color: theme.textSecondary }}>
                      {detail.taskType === "TASK_1" ? "⏱ 20 Min · ✍️ Min 150 words" : "⏱ 40 Min · ✍️ Min 250 words"}
                    </Text>
                  </View>
                </View>
                <Text style={styles.promptText}>{detail.prompt}</Text>
                {detail.imageUrl && (
                  <Image source={{ uri: detail.imageUrl }} style={styles.promptImage} resizeMode="cover" />
                )}
                {detail.chartDescription && (
                  <View style={styles.chartDescBox}>
                    <Text style={styles.chartDescTitle}>📊 Mô tả biểu đồ</Text>
                    {renderParagraphs(detail.chartDescription, styles)}
                  </View>
                )}
              </View>

              {/* Band Filter */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bandFilterScroll}>
                <TouchableOpacity
                  style={[
                    styles.bandBtn,
                    { backgroundColor: activeBand === null ? theme.text : theme.background, borderColor: theme.border }
                  ]}
                  onPress={() => setActiveBand(null)}
                >
                  <Text style={{ color: activeBand === null ? "#ffffff" : theme.textSecondary, fontWeight: "600" }}>
                    Tất cả bài mẫu
                  </Text>
                </TouchableOpacity>
                {bands.map((b) => {
                  const isActive = activeBand === b
                  const colors = getBandColor(b)
                  return (
                    <TouchableOpacity
                      key={b}
                      style={[
                        styles.bandBtn,
                        isActive ? { backgroundColor: colors.text, borderColor: colors.text } : { backgroundColor: theme.background, borderColor: colors.border }
                      ]}
                      onPress={() => setActiveBand(b)}
                    >
                      <Text style={{ color: isActive ? "#ffffff" : colors.text, fontWeight: "600" }}>
                        Band {b.toFixed(1)}
                      </Text>
                    </TouchableOpacity>
                  )
                })}
              </ScrollView>

              {/* Essays */}
              {visibleEssays.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>Chưa có bài mẫu nào cho mức điểm này.</Text>
                </View>
              ) : (
                visibleEssays.map(renderEssayCard)
              )}
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  )
}
