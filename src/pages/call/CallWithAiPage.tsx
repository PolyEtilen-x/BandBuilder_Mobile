import React, { useState, useEffect, useRef } from "react"
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
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
import { styles } from "./CallWithAiPage.styles"
import { callTranslations, ExaminerVoice } from "./CallWithAiPage.translations"

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
  const t = isVi ? callTranslations.vi : callTranslations.en

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
  const [selectedVoice, setSelectedVoice] = useState<ExaminerVoice>(t.examiners[0])
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

  // Sync selected voice details dynamically depending on translation language
  const currentVoice = t.examiners.find(v => v.id === selectedVoice.id) || t.examiners[0]
  const activeDialogue = isConnected ? liveDialogue : simDialogue
  const activeTimer = isConnected ? liveTimer : simTimer
  const activeVoice = isConnected
    ? (t.examiners.find(v => v.id === selectedVoiceId) || currentVoice)
    : currentVoice

  // Call Handlers
  const handleStartCall = () => {
    if (isConnected) {
      startLiveCall(currentVoice.id)
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
      <LinearGradient colors={["#0f172a", "#1e293b"]} style={styles.container} />

      {/* HEADER BAR */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color="#f8fafc" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.headerTitle}</Text>
        <View style={styles.headerStatusWrap}>
          {isConnected ? (
            <View style={[styles.statusBadge, styles.statusLive]}>
              <Server size={10} color="#10b981" />
              <Text style={styles.statusBadgeText}>{t.statusLive}</Text>
            </View>
          ) : (
            <View style={[styles.statusBadge, styles.statusOffline]}>
              <Cpu size={10} color="#a78bfa" />
              <Text style={styles.statusBadgeText}>{t.statusOffline}</Text>
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
              <Text style={styles.subtitle}>{t.subTitle}</Text>
            </View>

            <Text style={styles.heroTitle}>{t.heroTitle}</Text>
            <Text style={styles.heroDesc}>{t.heroDesc}</Text>

            <Text style={styles.sectionTitle}>{t.selectExaminerTitle}</Text>

            {t.examiners.map((voice) => {
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
                    : t.startCallText}
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
          <Text style={styles.dialStatus}>{t.connectingText}</Text>

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
                {isRecording ? t.listeningText : t.examinerSpeaking(activeVoice.name)}
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
          <Text style={styles.dialName}>{t.feedbackLoaderTitle}</Text>
          <Text style={styles.thinkingDesc}>{t.feedbackLoaderDesc}</Text>
        </View>
      )}

      {/* 5. FEEDBACK SCREEN */}
      {activeState === "feedback" && (
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <View style={styles.reportHeader}>
              <View>
                <View style={styles.completedBadge}>
                  <Text style={styles.completedBadgeText}>{t.completedBadge}</Text>
                </View>
                <Text style={styles.reportTitle}>{t.reportTitle}</Text>
                <Text style={styles.reportSub}>{t.reportSub}</Text>
              </View>

              <View style={styles.overallScoreBox}>
                <Text style={styles.overallLabel}>{t.overallLabel}</Text>
                <Text style={styles.overallScoreText}>{isConnected ? liveBand : 7.5}</Text>
              </View>
            </View>

            {/* Metrics breaking down */}
            <Text style={styles.sectionTitle}>{isVi ? "Chi Tiết Điểm Tiêu Criteria" : "Criteria breakdown"}</Text>

            <View style={styles.subMetricsGrid}>
              <View style={styles.metricCard}>
                <Text style={styles.subMetricName}>{t.fluencyLabel}</Text>
                <Text style={styles.subMetricVal}>{isConnected ? liveMetrics.fluency : 7.5}</Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.subMetricName}>{t.lexicalLabel}</Text>
                <Text style={styles.subMetricVal}>{isConnected ? liveMetrics.lexical : 7.0}</Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.subMetricName}>{t.grammarLabel}</Text>
                <Text style={styles.subMetricVal}>{isConnected ? liveMetrics.grammar : 7.5}</Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.subMetricName}>{t.pronunciationLabel}</Text>
                <Text style={styles.subMetricVal}>{isConnected ? liveMetrics.pronunciation : 8.0}</Text>
              </View>
            </View>

            {/* AI Corrections feedback */}
            <View style={styles.correctionsSection}>
              <View style={styles.correctionHeaderRow}>
                <Award size={20} color="#3b82f6" />
                <Text style={styles.correctionsMainTitle}>{t.correctionsTitle}</Text>
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
                            ? t.grammarCorr
                            : corr.type === "vocab"
                              ? t.vocabCorr
                              : t.positiveCorr}
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
                      <Text style={[styles.corrTypeText, { color: "#f87171" }]}>{t.grammarCorr}</Text>
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
                      <Text style={[styles.corrTypeText, { color: "#60a5fa" }]}>{t.vocabCorr}</Text>
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
                      <Text style={[styles.corrTypeText, { color: "#34d399" }]}>{t.positiveCorr}</Text>
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
              <Text style={styles.restartButtonText}>{t.restartBtnText}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  )
}
