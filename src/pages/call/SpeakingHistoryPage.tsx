import React, { useState, useMemo } from "react"
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { LinearGradient } from "expo-linear-gradient"
import {
  ArrowLeft,
  Calendar,
  Award,
  ShieldAlert,
  MessageSquare,
  CheckCircle,
  RefreshCw,
  Phone
} from "lucide-react-native"
import { useTranslation } from "react-i18next"
import { useSpeakingHistory } from "@/hooks/useSpeakingHistory"
import { useThemeColor } from "@/hooks/useThemeColor"
import { styles } from "./SpeakingHistoryPage.styles"

const EXAMINER_VOICES: Record<string, { name: string; accent: string; avatar: string }> = {
  sophia: { name: "Sophia", accent: "American Accent", avatar: "S" },
  alex: { name: "Alex", accent: "British Accent", avatar: "A" },
  david: { name: "David", accent: "Australian Accent", avatar: "D" },
}

interface Props {
  navigation: any
}

export default function SpeakingHistoryPage({ navigation }: Props) {
  const { t, i18n } = useTranslation()
  const isVi = i18n.language === "vi"
  const theme = useThemeColor()

  const { data: history, isLoading, error, refetch, isRefetching } = useSpeakingHistory()
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null)

  const selectedSession = useMemo(() => {
    return history?.find(s => s.id === selectedSessionId)
  }, [history, selectedSessionId])

  const formatDateTime = (isoString: string) => {
    try {
      const d = new Date(isoString)
      return d.toLocaleDateString(isVi ? "vi-VN" : "en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })
    } catch {
      return isoString
    }
  }

  const renderHighlightedTextForHistory = (text: string, lowConfWords?: string[]) => {
    if (!lowConfWords || !lowConfWords.length) {
      return <Text style={styles.bubbleText}>{text}</Text>
    }
    const words = text.split(" ")
    return (
      <Text style={styles.bubbleText}>
        {words.map((word, idx) => {
          const cleanWord = word.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, "")
          const isMispronounced = lowConfWords.includes(cleanWord)
          return (
            <Text
              key={idx}
              style={isMispronounced ? styles.mispronouncedText : null}
            >
              {word}{" "}
            </Text>
          )
        })}
      </Text>
    )
  }

  const voice = selectedSession
    ? EXAMINER_VOICES[selectedSession.voiceId] || { name: selectedSession.voiceId, accent: "", avatar: "AI" }
    : null

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={["#0f172a", "#1e293b"]} style={styles.container} />

      {/* HEADER BAR */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (selectedSessionId) {
              setSelectedSessionId(null)
            } else {
              navigation.goBack()
            }
          }}
        >
          <ArrowLeft size={24} color="#f8fafc" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {selectedSessionId
            ? (isVi ? "Chi Tiết Cuộc Gọi" : "Call Report")
            : (isVi ? "Lịch Sử Luyện Nói" : "Speaking History")}
        </Text>
        {!selectedSessionId && (
          <TouchableOpacity onPress={() => refetch()} style={{ padding: 4 }}>
            {(isLoading || isRefetching) ? (
              <ActivityIndicator size="small" color="#3b82f6" />
            ) : (
              <RefreshCw size={18} color="#f8fafc" />
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* MAIN CONTENT AREA */}
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {selectedSession && voice ? (
          /* =================== A. DETAIL REPORT VIEW =================== */
          <View style={styles.card}>
            <View style={styles.detailHeader}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => setSelectedSessionId(null)}
              >
                <ArrowLeft size={14} color="#3b82f6" />
                <Text style={styles.backButtonText}>{isVi ? "Quay lại" : "Back"}</Text>
              </TouchableOpacity>
              <View style={styles.dateTag}>
                <Calendar size={12} color="#60a5fa" />
                <Text style={styles.dateTagText}>{formatDateTime(selectedSession.createdAt)}</Text>
              </View>
            </View>

            <View style={styles.reportHeader}>
              <View style={{ flex: 1, paddingRight: 8 }}>
                <View style={styles.reportBadge}>
                  <Text style={styles.reportBadgeText}>
                    {isVi ? "CHI TIẾT LỊCH SỬ" : "EXAMINER REPORT"}
                  </Text>
                </View>
                <Text style={styles.reportTitle}>
                  {isVi ? "Báo Cáo Kết Quả" : "IELTS speaking Card"}
                </Text>
                <Text style={styles.reportSub}>
                  {isVi
                    ? `Giám khảo: ${voice.name} (${voice.accent})`
                    : `Examiner: ${voice.name} (${voice.accent})`}
                </Text>
              </View>

              <View style={styles.overallBandGroup}>
                <Text style={styles.overallBandLabel}>{isVi ? "ĐIỂM CHUNG" : "OVERALL"}</Text>
                <Text style={styles.overallBandValue}>{selectedSession.overallBand}</Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>
              {isVi ? "Tiêu Chí Chấm Điểm Chi Tiết" : "Core Grading Criteria"}
            </Text>

            <View style={styles.subMetricsGrid}>
              <View style={styles.metricCard}>
                <Text style={styles.subMetricName}>Fluency & Coherence</Text>
                <Text style={styles.subMetricVal}>{selectedSession.fluency}</Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.subMetricName}>Lexical Resource</Text>
                <Text style={styles.subMetricVal}>{selectedSession.lexical}</Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.subMetricName}>Grammatical Range</Text>
                <Text style={styles.subMetricVal}>{selectedSession.grammar}</Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.subMetricName}>Pronunciation</Text>
                <Text style={styles.subMetricVal}>{selectedSession.pronunciation}</Text>
              </View>
            </View>

            {/* Scrollable Dialogue Transcript */}
            <Text style={styles.sectionTitle}>
              {isVi ? "Đoạn Hội Thoại & Phát Âm" : "Dialogue & Pronunciation"}
            </Text>

            <View style={styles.transcriptBox}>
              <ScrollView
                nestedScrollEnabled={true}
                contentContainerStyle={styles.transcriptScrollContent}
                showsVerticalScrollIndicator={true}
              >
                {selectedSession.dialogue.map((turn, index) => {
                  const isAi = turn.sender === "ai"
                  const senderName = isAi ? voice.name : (isVi ? "BẠN" : "YOU")
                  return (
                    <View
                      key={index}
                      style={[styles.chatBubble, isAi ? styles.bubbleAi : styles.bubbleUser]}
                    >
                      <Text style={styles.bubbleAuthor}>{senderName}</Text>
                      {turn.sender === "user"
                        ? renderHighlightedTextForHistory(turn.text, turn.lowConfidenceWords)
                        : <Text style={styles.bubbleText}>{turn.text}</Text>}
                    </View>
                  )
                })}
              </ScrollView>
            </View>

            {/* AI Corrections Feedback */}
            <View style={styles.correctionsSection}>
              <View style={styles.correctionHeaderRow}>
                <Award size={18} color="#3b82f6" />
                <Text style={styles.correctionsMainTitle}>
                  {isVi ? "AI Nhận Xét & Gợi Ý Lỗi Sai" : "AI Corrections & Vocabulary Polish"}
                </Text>
              </View>

              {selectedSession.corrections && selectedSession.corrections.length > 0 ? (
                selectedSession.corrections.map((corr, idx) => {
                  const isGrammar = corr.type === "grammar"
                  const isVocab = corr.type === "vocab"
                  const accentColor = isGrammar ? "#ef4444" : isVocab ? "#3b82f6" : "#10b981"
                  return (
                    <View key={idx} style={[styles.corrCard, { borderLeftColor: accentColor }]}>
                      <View style={styles.corrTypeRow}>
                        {isGrammar && <ShieldAlert size={14} color="#ef4444" />}
                        {isVocab && <MessageSquare size={14} color="#3b82f6" />}
                        {corr.type === "positive" && <CheckCircle size={14} color="#10b981" />}
                        <Text style={[styles.corrTypeText, { color: accentColor }]}>
                          {corr.type === "grammar"
                            ? (isVi ? "Lỗi Ngữ Pháp" : "Grammar Correction")
                            : corr.type === "vocab"
                              ? (isVi ? "Nâng Cấp Từ Vựng" : "Vocabulary Upgrade")
                              : (isVi ? "Ưu Điểm Nói" : "Speech Highlight")}
                        </Text>
                      </View>
                      {corr.original && (
                        <Text style={styles.corrOriginal}>
                          <Text style={styles.corrBold}>{isVi ? "Bạn nói: " : "You said: "}</Text>
                          "{corr.original}"
                        </Text>
                      )}
                      {corr.correction && (
                        <Text style={styles.corrCorrection}>
                          <Text style={styles.corrBold}>{isVi ? "Gợi ý: " : "Suggested: "}</Text>
                          "{corr.correction}"
                        </Text>
                      )}
                      <Text style={styles.corrExplanation}>{corr.explanation}</Text>
                    </View>
                  )
                })
              ) : (
                <Text style={styles.noCorrectionsText}>
                  {isVi ? "Không phát hiện lỗi sai nghiêm trọng nào." : "No critical corrections found."}
                </Text>
              )}
            </View>
          </View>
        ) : (
          /* =================== B. SESSIONS LIST VIEW =================== */
          <View style={styles.card}>
            <View style={styles.tagGroup}>
              <View style={styles.badgeHistory}>
                <Text style={styles.badgeText}>{isVi ? "LỊCH SỬ" : "HISTORY"}</Text>
              </View>
              <Text style={styles.subtitle}>IELTS Speaking AI Practice History</Text>
            </View>

            <Text style={styles.title}>
              {isVi ? "Lịch Sử Luyện Nói Với AI" : "Practice History"}
            </Text>
            <Text style={styles.desc}>
              {isVi
                ? "Danh sách các cuộc gọi giả lập IELTS Speaking đã hoàn thành. Hãy xem lại điểm số và nhận xét chi tiết của từng cuộc gọi."
                : "Review your completed IELTS speaking simulator sessions. Click on any session to review your detailed feedback."}
            </Text>

            {error && (
              <Text style={styles.errorCard}>
                ⚠️ {isVi ? "Không thể tải dữ liệu lịch sử." : "Failed to load speaking history."}
              </Text>
            )}

            {isLoading ? (
              <View style={styles.historyList}>
                {Array.from({ length: 4 }).map((_, idx) => (
                  <View key={idx} style={styles.skeletonCard}>
                    <View style={styles.skeletonCircle} />
                    <View style={styles.skeletonLines}>
                      <View style={styles.skeletonLineShort} />
                      <View style={styles.skeletonLineLong} />
                    </View>
                  </View>
                ))}
              </View>
            ) : history && history.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>📭</Text>
                <Text style={styles.emptyTitle}>{isVi ? "Chưa Có Lịch Sử" : "No Sessions Yet"}</Text>
                <Text style={styles.emptyText}>
                  {isVi
                    ? "Bạn chưa thực hiện cuộc gọi nào với Giám khảo AI."
                    : "You haven't completed any sessions with the AI examiner."}
                </Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.startPracticeBtn}
                  onPress={() => navigation.navigate("CallWithAi")}
                >
                  <Phone size={16} color="#0f172a" />
                  <Text style={styles.startPracticeBtnText}>
                    {isVi ? "Luyện Nói Ngay" : "Start Calling"}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.historyList}>
                {history?.map((session) => {
                  const ev = EXAMINER_VOICES[session.voiceId] || { name: session.voiceId, accent: "", avatar: "AI" }
                  return (
                    <View key={session.id} style={styles.historyCard}>
                      <View style={styles.cardLeft}>
                        <View style={styles.avatarCircle}>
                          <Text style={styles.avatarText}>{ev.avatar}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.examinerName} numberOfLines={1}>
                            {isVi ? `Giám khảo ${ev.name}` : `Examiner ${ev.name}`}
                          </Text>
                          <View style={styles.dateRow}>
                            <Calendar size={12} color="#94a3b8" />
                            <Text style={styles.dateText}>{formatDateTime(session.createdAt)}</Text>
                          </View>
                        </View>
                      </View>

                      <View style={styles.cardRight}>
                        <View style={styles.scoreBadge}>
                          <Text style={styles.scoreLabel}>IELTS BAND</Text>
                          <Text style={styles.scoreValue}>{session.overallBand}</Text>
                        </View>
                        <TouchableOpacity
                          activeOpacity={0.8}
                          style={styles.viewDetailsBtn}
                          onPress={() => setSelectedSessionId(session.id)}
                        >
                          <Text style={styles.viewDetailsBtnText}>
                            {isVi ? "Chi tiết" : "Details"}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )
                })}
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}
