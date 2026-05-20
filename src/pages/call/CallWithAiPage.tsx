import React, { useState, useEffect, useRef } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Animated
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { LinearGradient } from "expo-linear-gradient"
import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Award,
  ShieldAlert,
  CheckCircle,
  RefreshCw,
  MessageSquare,
  Server,
  Cpu,
  ChevronLeft
} from "lucide-react-native"
import { useTranslation } from "react-i18next"
import { useSpeakingStore } from "@/services/speaking/speaking.store"
import { useAudioCall } from "@/hooks/useAudioCall"

const { width } = Dimensions.get("window")

type ExaminerVoice = {
  id: string
  name: string
  accent: string
  description: string
  avatar: string
}

const EXAMINER_VOICES: ExaminerVoice[] = [
  { id: "sophia", name: "Sophia", accent: "American Accent", description: "Friendly, speaks clearly, perfect for intermediate level practice.", avatar: "S" },
  { id: "alex", name: "Alex", accent: "British Accent", description: "Academic and formal, simulated after a real IDP examiner.", avatar: "A" },
  { id: "david", name: "David", accent: "Australian Accent", description: "Natural tempo with mild dialect, great for advanced listeners.", avatar: "D" },
]

type DialogueTurn = {
  sender: "ai" | "user"
  text: string
  isPartial?: boolean
}

const SIMULATED_CONVO: DialogueTurn[] = [
  { sender: "ai", text: "Hello! Welcome to the AI speaking practice room. My name is Sophia. Can you tell me your full name, please?" },
  { sender: "user", text: "Hello. My name is Minh, and I am preparing for my IELTS exam next month." },
  { sender: "ai", text: "Great, Minh. Let's start with Part 1. Do you work or study at the moment?" },
  { sender: "user", text: "Currently, I am a university student majoring in Computer Science. It is quite challenging but very interesting!" },
  { sender: "ai", text: "Excellent. Now, let's talk about technology. How often do you use technology in your daily study?" },
  { sender: "user", text: "Oh, I use technology almost every hour! As a CS student, programming requires a laptop and a high-speed internet connection constantly." },
  { sender: "ai", text: "Thank you. That concludes our Part 1 simulation. I am calculating your grades and feedback right now." },
]

interface Props {
  navigation: any
}

export default function CallWithAiPage({ navigation }: Props) {
  const { i18n } = useTranslation()
  const isVi = i18n.language === "vi"

  const {
    isConnected,
    callState: liveState,
    selectedVoiceId,
    dialogue: liveDialogue,
    timer: liveTimer,
    isMuted,
    isSpeakerOn,
    overallBand: liveBand,
    metrics: liveMetrics,
    corrections: liveCorrections,
    initSocket,
    startCall: startLiveCall,
    stopRecording: stopLiveRecording,
    hangUp: hangUpLive,
    setMuted,
    setSpeakerOn,
    incrementTimer,
    resetStore
  } = useSpeakingStore()

  // Initialize socket connection on mount
  useEffect(() => {
    initSocket()
    return () => {
      resetStore()
    }
  }, [])

  // Live mic and VAD hook
  const { isRecording, rmsVolume } = useAudioCall()

  // Offline Simulation States
  const [selectedVoice, setSelectedVoice] = useState<ExaminerVoice>(EXAMINER_VOICES[0])
  const [simState, setSimState] = useState<"idle" | "calling" | "active" | "feedback">("idle")
  const [simDialogue, setSimDialogue] = useState<DialogueTurn[]>([])
  const [simTimer, setSimTimer] = useState(0)

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const simDialogueRef = useRef<NodeJS.Timeout | null>(null)
  const scrollViewRef = useRef<ScrollView | null>(null)

  // Pulsating animation ref
  const pulseAnim = useRef(new Animated.Value(1)).current

  // Trigger pulse animation during call states
  useEffect(() => {
    const activeState = isConnected ? liveState : simState
    if (activeState === "calling" || activeState === "active") {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 1000,
            useNativeDriver: true
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true
          })
        ])
      ).start()
    } else {
      pulseAnim.setValue(1)
    }
  }, [liveState, simState, isConnected])

  // Auto-scroll ScrollView when dialogue updates
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true })
    }, 150)
  }, [liveDialogue, simDialogue, liveState, simState])

  // Timer runner
  const activeState = isConnected ? liveState : simState
  useEffect(() => {
    if (activeState === "active") {
      timerRef.current = setInterval(() => {
        if (isConnected) {
          incrementTimer()
        } else {
          setSimTimer((prev) => prev + 1)
        }
      }, 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
      setSimTimer(0)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [activeState, isConnected])

  // Offline Simulation Dialogue Timeline
  useEffect(() => {
    if (!isConnected && simState === "active") {
      setSimDialogue([SIMULATED_CONVO[0]])

      const triggerNextTurn = (idx: number) => {
        if (idx >= SIMULATED_CONVO.length) {
          simDialogueRef.current = setTimeout(() => {
            setSimState("feedback")
          }, 3500)
          return
        }

        simDialogueRef.current = setTimeout(() => {
          setSimDialogue((prev) => [...prev, SIMULATED_CONVO[idx]])
          triggerNextTurn(idx + 1)
        }, 5000)
      }

      triggerNextTurn(1)
    } else {
      if (simDialogueRef.current) clearTimeout(simDialogueRef.current)
      setSimDialogue([])
    }

    return () => {
      if (simDialogueRef.current) clearTimeout(simDialogueRef.current)
    }
  }, [simState, isConnected])

  // Selectors
  const activeDialogue = isConnected ? liveDialogue : simDialogue
  const activeTimer = isConnected ? liveTimer : simTimer
  const activeVoice = isConnected
    ? (EXAMINER_VOICES.find(v => v.id === selectedVoiceId) || selectedVoice)
    : selectedVoice

  // Call Handlers
  const handleStartCall = () => {
    if (isConnected) {
      startLiveCall(selectedVoice.id)
    } else {
      setSimState("calling")
      setTimeout(() => {
        setSimState("active")
      }, 2000)
    }
  }

  const handleEndCall = () => {
    if (isConnected) {
      stopLiveRecording()
    } else {
      setSimState("feedback")
    }
  }

  const handleHangUp = () => {
    if (isConnected) {
      hangUpLive()
    } else {
      setSimState("idle")
    }
  }

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0")
    const s = (secs % 60).toString().padStart(2, "0")
    return `${m}:${s}`
  }

  // Visual Waveform scaling based on RMS volume
  const scaleValue = isConnected && isRecording ? Math.min(1 + rmsVolume * 6, 2.5) : 1

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={["#0f172a", "#1e293b"]} style={StyleSheet.absoluteFillObject} />

      {/* HEADER BAR */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color="#f8fafc" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isVi ? "Giám Khảo Luyện Nói AI" : "AI Speaking examiner"}
        </Text>
        <View style={styles.headerStatusWrap}>
          {isConnected ? (
            <View style={[styles.statusBadge, styles.statusLive]}>
              <Server size={10} color="#10b981" />
              <Text style={styles.statusBadgeText}>Live</Text>
            </View>
          ) : (
            <View style={[styles.statusBadge, styles.statusOffline]}>
              <Cpu size={10} color="#a78bfa" />
              <Text style={styles.statusBadgeText}>Simulated</Text>
            </View>
          )}
        </View>
      </View>

      {/* 1. IDLE / PRE-CALL MENU */}
      {activeState === "idle" && (
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <View style={styles.badgeRow}>
              <View style={styles.newBadge}>
                <Text style={styles.newBadgeText}>{isVi ? "MỚI" : "NEW"}</Text>
              </View>
              <Text style={styles.subtitle}>IELTS Speaking Realtime Simulator</Text>
            </View>

            <Text style={styles.heroTitle}>
              {isVi ? "Luyện Nói IELTS Call with AI" : "IELTS Call with AI examiner"}
            </Text>
            <Text style={styles.heroDesc}>
              {isVi
                ? "Luyện tập phản xạ nói IELTS mặt đối mặt trực tuyến với Giám khảo AI. Nhận ngay điểm số Band Score và phân tích các lỗi phát âm, từ vựng, ngữ pháp tức thì."
                : "Practice IELTS Speaking face-to-face online with our advanced AI Examiner. Get your dynamic Band Score, pronunciation analysis, and detailed corrections instantly."}
            </Text>

            <Text style={styles.sectionTitle}>
              {isVi ? "1. Chọn Giọng Giám Khảo" : "1. Select Examiner Voice"}
            </Text>

            {EXAMINER_VOICES.map((voice) => {
              const isSelected = selectedVoice.id === voice.id
              return (
                <TouchableOpacity
                  key={voice.id}
                  activeOpacity={0.8}
                  style={[styles.voiceCard, isSelected && styles.voiceCardSelected]}
                  onPress={() => setSelectedVoice(voice)}
                >
                  <View style={styles.voiceHeader}>
                    <View style={styles.avatarCircle}>
                      <Text style={styles.avatarText}>{voice.avatar}</Text>
                    </View>
                    <View style={styles.voiceMeta}>
                      <Text style={styles.voiceName}>{voice.name}</Text>
                      <Text style={styles.voiceAccent}>{voice.accent}</Text>
                    </View>
                  </View>
                  <Text style={styles.voiceDesc}>{voice.description}</Text>
                </TouchableOpacity>
              )
            })}

            <TouchableOpacity activeOpacity={0.9} onPress={handleStartCall} style={styles.startCallButtonWrap}>
              <LinearGradient
                colors={isConnected ? ["#10b981", "#059669"] : ["#3b82f6", "#2563eb"]}
                style={styles.startCallButton}
              >
                <Phone size={20} color="#fff" />
                <Text style={styles.startCallButtonText}>
                  {isConnected
                    ? (isVi ? "Bắt Đầu Gọi Live (WebSocket)" : "Call AI Examiner (Live)")
                    : (isVi ? "Thử Giả Lập Ngay (Simulate)" : "Start Practice Session")}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {/* 2. DIALING STATE */}
      {activeState === "calling" && (
        <View style={styles.fullScreenOverlay}>
          <Animated.View style={[styles.pulseRing, { transform: [{ scale: pulseAnim }] }]}>
            <View style={styles.avatarDialWrap}>
              <Text style={styles.avatarDialText}>{activeVoice.avatar}</Text>
            </View>
          </Animated.View>

          <Text style={styles.dialName}>{activeVoice.name}</Text>
          <Text style={styles.dialStatus}>
            {isVi ? "ĐANG KẾT NỐI ĐƯỜNG TRUYỀN..." : "ESTABLISHING CONNECTING..."}
          </Text>

          <TouchableOpacity onPress={handleHangUp} style={[styles.circleButton, styles.hangUpButton]}>
            <PhoneOff size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      )}

      {/* 3. ACTIVE VOICE CALL SCREEN */}
      {activeState === "active" && (
        <View style={styles.activeCallContainer}>
          <View style={styles.callHeader}>
            <View style={styles.speakingIndicatorRow}>
              <View style={[styles.speakingDot, isRecording && styles.speakingDotActive]} />
              <Text style={styles.speakingStatusText}>
                {isRecording
                  ? (isVi ? "BẠN ĐANG NÓI..." : "SPEAK NOW...")
                  : (isVi ? "AI ĐANG NÓI / CHỜ..." : "WAITING...")}
              </Text>
            </View>
            <Text style={styles.timerText}>{formatTime(activeTimer)}</Text>
          </View>

          {/* Mini Examiner profile */}
          <View style={styles.callerProfile}>
            <Animated.View style={[styles.miniAvatar, { transform: [{ scale: pulseAnim }] }]}>
              <Text style={styles.miniAvatarText}>{activeVoice.avatar}</Text>
            </Animated.View>
            <Text style={styles.callerName}>{activeVoice.name}</Text>
            <Text style={styles.callerAccent}>{activeVoice.accent}</Text>
          </View>

          {/* Waveform Equalizer */}
          <View style={styles.waveformContainer}>
            <View style={[styles.waveBar, { transform: [{ scaleY: scaleValue * 0.7 }] }]} />
            <View style={[styles.waveBar, { transform: [{ scaleY: scaleValue * 1.4 }] }]} />
            <View style={[styles.waveBar, { transform: [{ scaleY: scaleValue * 2.2 }] }]} />
            <View style={[styles.waveBar, { transform: [{ scaleY: scaleValue * 1.3 }] }]} />
            <View style={[styles.waveBar, { transform: [{ scaleY: scaleValue * 0.8 }] }]} />
          </View>

          {/* Scrolling dialogues */}
          <ScrollView
            ref={(ref) => { scrollViewRef.current = ref; }}
            style={styles.chatScroll}
            contentContainerStyle={styles.chatScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {activeDialogue.map((turn, idx) => {
              const isAi = turn.sender === "ai"
              return (
                <View key={idx} style={[styles.chatBubble, isAi ? styles.bubbleAi : styles.bubbleUser]}>
                  <Text style={styles.bubbleAuthor}>
                    {isAi ? activeVoice.name : (isVi ? "BẠN" : "YOU")}
                  </Text>
                  <Text style={styles.bubbleText}>{turn.text}</Text>
                </View>
              )
            })}
          </ScrollView>

          {/* Controller keys */}
          <View style={styles.controlsBar}>
            <TouchableOpacity
              onPress={() => setMuted(!isMuted)}
              style={[styles.circleButtonSmall, isMuted && styles.controlActive]}
            >
              {isMuted ? <MicOff size={22} color="#fff" /> : <Mic size={22} color="#fff" />}
            </TouchableOpacity>

            <TouchableOpacity onPress={handleEndCall} style={[styles.circleButton, styles.hangUpButton]}>
              <PhoneOff size={24} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setSpeakerOn(!isSpeakerOn)}
              style={[styles.circleButtonSmall, !isSpeakerOn && styles.controlActive]}
            >
              {isSpeakerOn ? <Volume2 size={22} color="#fff" /> : <VolumeX size={22} color="#fff" />}
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* 4. THINKING STATE */}
      {activeState === "thinking" && (
        <View style={styles.fullScreenOverlay}>
          <View style={styles.thinkingSpinnerWrap}>
            <RefreshCw size={44} color="#3b82f6" style={styles.spinner} />
          </View>
          <Text style={styles.dialName}>{isVi ? "Giám Khảo Đang Chấm Điểm..." : "AI Grading Speech..."}</Text>
          <Text style={styles.thinkingDesc}>
            {isVi
              ? "Giám khảo đang phân tích cấu trúc, phát âm và chuẩn bị bảng đánh giá phản hồi chi tiết."
              : "Examiner is evaluating your pronunciation and formulating detailed corrections."}
          </Text>
        </View>
      )}

      {/* 5. FEEDBACK SCREEN */}
      {activeState === "feedback" && (
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <View style={styles.reportHeader}>
              <View>
                <View style={styles.completedBadge}>
                  <Text style={styles.completedBadgeText}>
                    {isVi ? "ĐÃ HOÀN THÀNH" : "EVALUATION COMPLETE"}
                  </Text>
                </View>
                <Text style={styles.reportTitle}>
                  {isVi ? "Báo Cáo IELTS Speaking" : "IELTS Speaking Report"}
                </Text>
                <Text style={styles.reportSub}>
                  {isVi ? `Examiner: ${activeVoice.name}` : `Examiner: ${activeVoice.name}`}
                </Text>
              </View>

              <View style={styles.overallScoreBox}>
                <Text style={styles.overallLabel}>{isVi ? "BAND SỐ" : "OVERALL"}</Text>
                <Text style={styles.overallScoreText}>{isConnected ? liveBand : 7.5}</Text>
              </View>
            </View>

            {/* Metrics breaking down */}
            <Text style={styles.sectionTitle}>
              {isVi ? "Chi Tiết Điểm Tiêu Chí" : "Criteria breakdown"}
            </Text>

            <View style={styles.subMetricsGrid}>
              <View style={styles.metricCard}>
                <Text style={styles.subMetricName}>Fluency & Coherence</Text>
                <Text style={styles.subMetricVal}>{isConnected ? liveMetrics.fluency : 7.5}</Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.subMetricName}>Lexical Resource</Text>
                <Text style={styles.subMetricVal}>{isConnected ? liveMetrics.lexical : 7.0}</Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.subMetricName}>Grammatical Range</Text>
                <Text style={styles.subMetricVal}>{isConnected ? liveMetrics.grammar : 7.5}</Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.subMetricName}>Pronunciation</Text>
                <Text style={styles.subMetricVal}>{isConnected ? liveMetrics.pronunciation : 8.0}</Text>
              </View>
            </View>

            {/* AI Corrections feedback */}
            <View style={styles.correctionsSection}>
              <View style={styles.correctionHeaderRow}>
                <Award size={20} color="#3b82f6" />
                <Text style={styles.correctionsMainTitle}>
                  {isVi ? "Nhận Xét & Sửa Lỗi Chi Tiết" : "AI Corrections & Feedback"}
                </Text>
              </View>

              {/* Dynamic or Offline list */}
              {isConnected && liveCorrections.length > 0 ? (
                liveCorrections.map((corr, idx) => {
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
                            ? (isVi ? "Sửa Lỗi Ngữ Pháp" : "Grammar Correction")
                            : corr.type === "vocab"
                              ? (isVi ? "Nâng Cấp Từ Vựng" : "Vocabulary Upgrade")
                              : (isVi ? "Điểm Cộng Phát Âm" : "Good Pronunciation")}
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
                          <Text style={styles.corrBold}>{isVi ? "Gợi ý sửa: " : "Suggested: "}</Text>
                          "{corr.correction}"
                        </Text>
                      )}
                      <Text style={styles.corrExplanation}>{corr.explanation}</Text>
                    </View>
                  )
                })
              ) : (
                <>
                  <View style={[styles.corrCard, { borderLeftColor: "#ef4444" }]}>
                    <View style={styles.corrTypeRow}>
                      <ShieldAlert size={14} color="#ef4444" />
                      <Text style={[styles.corrTypeText, { color: "#f87171" }]}>
                        {isVi ? "Lỗi Ngữ Pháp / Cách Dùng Từ" : "Grammar / Word Choice"}
                      </Text>
                    </View>
                    <Text style={styles.corrOriginal}>
                      <Text style={styles.corrBold}>{isVi ? "Bạn nói: " : "You said: "}</Text>
                      "I use technology almost every hour."
                    </Text>
                    <Text style={styles.corrCorrection}>
                      <Text style={styles.corrBold}>{isVi ? "Gợi ý sửa: " : "Suggested: "}</Text>
                      "I use technology on an hourly basis."
                    </Text>
                    <Text style={styles.corrExplanation}>
                      {isVi ? "Tránh lặp cấu trúc đơn giản, giúp câu nói tự nhiên và học thuật hơn." : "Creates a more formal, academic tone."}
                    </Text>
                  </View>

                  <View style={[styles.corrCard, { borderLeftColor: "#3b82f6" }]}>
                    <View style={styles.corrTypeRow}>
                      <MessageSquare size={14} color="#3b82f6" />
                      <Text style={[styles.corrTypeText, { color: "#60a5fa" }]}>
                        {isVi ? "Nâng Cấp Từ Vựng" : "Lexical Resource Upgrade"}
                      </Text>
                    </View>
                    <Text style={styles.corrOriginal}>
                      <Text style={styles.corrBold}>{isVi ? "Bạn nói: " : "You said: "}</Text>
                      "programming requires a laptop..."
                    </Text>
                    <Text style={styles.corrCorrection}>
                      <Text style={styles.corrBold}>{isVi ? "Nâng cấp: " : "Upgrade: "}</Text>
                      "programming demands constant access to a laptop and robust high-speed internet connectivity."
                    </Text>
                  </View>

                  <View style={[styles.corrCard, { borderLeftColor: "#10b981" }]}>
                    <View style={styles.corrTypeRow}>
                      <CheckCircle size={14} color="#10b981" />
                      <Text style={[styles.corrTypeText, { color: "#34d399" }]}>
                        {isVi ? "Ưu Điểm Nổi Bật" : "Speech Highlights"}
                      </Text>
                    </View>
                    <Text style={styles.corrExplanation}>
                      {isVi
                        ? "Phát âm rất lưu loát các âm kép. Sử dụng tốt cấu trúc bổ trợ 'challenging but very interesting' giúp tăng sự mạch lạc."
                        : "Excellent pronunciation of consonant clusters. Strong coherence when linking transitions."}
                    </Text>
                  </View>
                </>
              )}
            </View>

            <TouchableOpacity activeOpacity={0.8} style={styles.restartButton} onPress={handleHangUp}>
              <RefreshCw size={16} color="#0f172a" />
              <Text style={styles.restartButtonText}>{isVi ? "Hoàn Thành & Trở Về" : "Start Over"}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.08)",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    color: "#f8fafc",
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 12,
    flex: 1,
  },
  headerStatusWrap: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusLive: {
    backgroundColor: "rgba(16, 185, 129, 0.12)",
  },
  statusOffline: {
    backgroundColor: "rgba(167, 139, 250, 0.12)",
  },
  statusBadgeText: {
    color: "#f8fafc",
    fontSize: 10,
    fontWeight: "700",
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "rgba(30, 41, 59, 0.65)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
    borderRadius: 24,
    padding: 20,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  newBadge: {
    backgroundColor: "#10b981",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 8,
  },
  newBadgeText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "800",
  },
  subtitle: {
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: "600",
  },
  heroTitle: {
    color: "#f8fafc",
    fontSize: 24,
    fontWeight: "800",
    lineHeight: 32,
    marginBottom: 10,
  },
  heroDesc: {
    color: "#cbd5e1",
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 24,
  },
  sectionTitle: {
    color: "#f8fafc",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 8,
    marginBottom: 16,
  },
  voiceCard: {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  voiceCardSelected: {
    backgroundColor: "rgba(59, 130, 246, 0.08)",
    borderColor: "#3b82f6",
  },
  voiceHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#3b82f6",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
  },
  voiceMeta: {
    marginLeft: 12,
  },
  voiceName: {
    color: "#f8fafc",
    fontSize: 16,
    fontWeight: "700",
  },
  voiceAccent: {
    color: "#94a3b8",
    fontSize: 12,
  },
  voiceDesc: {
    color: "#cbd5e1",
    fontSize: 13,
    lineHeight: 18,
  },
  startCallButtonWrap: {
    marginTop: 16,
    borderRadius: 16,
    overflow: "hidden",
  },
  startCallButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 10,
  },
  startCallButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  fullScreenOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  pulseRing: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(59, 130, 246, 0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  avatarDialWrap: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#3b82f6",
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  avatarDialText: {
    color: "#ffffff",
    fontSize: 40,
    fontWeight: "800",
  },
  dialName: {
    color: "#f8fafc",
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 8,
  },
  dialStatus: {
    color: "#94a3b8",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 1.5,
    marginBottom: 60,
  },
  circleButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  circleButtonSmall: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    justifyContent: "center",
    alignItems: "center",
  },
  hangUpButton: {
    backgroundColor: "#ef4444",
  },
  controlActive: {
    backgroundColor: "#ef4444",
    borderColor: "#ef4444",
  },
  activeCallContainer: {
    flex: 1,
    padding: 16,
    justifyContent: "space-between",
  },
  callHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  speakingIndicatorRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.04)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 8,
  },
  speakingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#64748b",
  },
  speakingDotActive: {
    backgroundColor: "#10b981",
  },
  speakingStatusText: {
    color: "#cbd5e1",
    fontSize: 11,
    fontWeight: "700",
  },
  timerText: {
    color: "#f8fafc",
    fontSize: 16,
    fontWeight: "700",
  },
  callerProfile: {
    alignItems: "center",
    marginVertical: 12,
  },
  miniAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#3b82f6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  miniAvatarText: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "700",
  },
  callerName: {
    color: "#f8fafc",
    fontSize: 18,
    fontWeight: "800",
  },
  callerAccent: {
    color: "#cbd5e1",
    fontSize: 12,
  },
  waveformContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    height: 48,
  },
  waveBar: {
    width: 6,
    height: 24,
    borderRadius: 3,
    backgroundColor: "#3b82f6",
  },
  chatScroll: {
    flex: 1,
    marginVertical: 16,
    backgroundColor: "rgba(15, 23, 42, 0.4)",
    borderRadius: 16,
    padding: 12,
  },
  chatScrollContent: {
    paddingBottom: 20,
  },
  chatBubble: {
    padding: 12,
    borderRadius: 16,
    maxWidth: "85%",
    marginBottom: 12,
  },
  bubbleAi: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.03)",
    alignSelf: "flex-start",
  },
  bubbleUser: {
    backgroundColor: "rgba(59, 130, 246, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.2)",
    alignSelf: "flex-end",
  },
  bubbleAuthor: {
    color: "#3b82f6",
    fontSize: 10,
    fontWeight: "800",
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  bubbleText: {
    color: "#cbd5e1",
    fontSize: 13,
    lineHeight: 18,
  },
  controlsBar: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginBottom: 12,
  },
  thinkingSpinnerWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  spinner: {},
  thinkingDesc: {
    color: "#94a3b8",
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    paddingHorizontal: 24,
    marginTop: 12,
  },
  reportHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  completedBadge: {
    backgroundColor: "rgba(16, 185, 129, 0.12)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  completedBadgeText: {
    color: "#34d399",
    fontSize: 10,
    fontWeight: "800",
  },
  reportTitle: {
    color: "#f8fafc",
    fontSize: 20,
    fontWeight: "800",
  },
  reportSub: {
    color: "#94a3b8",
    fontSize: 12,
  },
  overallScoreBox: {
    width: 72,
    height: 72,
    borderRadius: 16,
    backgroundColor: "#1e293b",
    borderWidth: 2,
    borderColor: "#3b82f6",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  overallLabel: {
    color: "#3b82f6",
    fontSize: 9,
    fontWeight: "800",
  },
  overallScoreText: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "800",
  },
  subMetricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
    gap: 10,
  },
  metricCard: {
    backgroundColor: "rgba(255,255,255,0.03)",
    width: "48%",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.04)",
  },
  subMetricName: {
    color: "#cbd5e1",
    fontSize: 11,
    fontWeight: "600",
    marginBottom: 4,
  },
  subMetricVal: {
    color: "#f8fafc",
    fontSize: 18,
    fontWeight: "800",
  },
  correctionsSection: {
    marginTop: 8,
  },
  correctionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  correctionsMainTitle: {
    color: "#f8fafc",
    fontSize: 15,
    fontWeight: "700",
  },
  corrCard: {
    backgroundColor: "rgba(255,255,255,0.02)",
    borderLeftWidth: 4,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  corrTypeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  corrTypeText: {
    fontSize: 11,
    fontWeight: "800",
  },
  corrOriginal: {
    color: "#cbd5e1",
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 6,
  },
  corrCorrection: {
    color: "#cbd5e1",
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 6,
  },
  corrExplanation: {
    color: "#cbd5e1",
    fontSize: 12,
    lineHeight: 16,
  },
  corrBold: {
    fontWeight: "700",
  },
  restartButton: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 16,
    gap: 8,
  },
  restartButtonText: {
    color: "#0f172a",
    fontSize: 14,
    fontWeight: "700",
  }
})
