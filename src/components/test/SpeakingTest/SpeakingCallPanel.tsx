import React, { useState, useEffect, useRef } from "react"
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  ActivityIndicator
} from "react-native"
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
  Server,
  Cpu,
  MessageSquare
} from "lucide-react-native"
import { useTranslation } from "react-i18next"
import { useSpeakingStore } from "@/services/speaking/speaking.store"
import { useAudioCall } from "@/hooks/useAudioCall"
import { useThemeColor } from "@/hooks/useThemeColor"
import { LinearGradient } from "expo-linear-gradient"
import { styles } from "./SpeakingCallPanel.styles"

interface Props {
  test: any;
  currentUnit: any;
  mode?: "exam" | "practice";
}

export default function SpeakingCallPanel({ test, currentUnit, mode = "practice" }: Props) {
  const { t, i18n } = useTranslation()
  const isVi = i18n.language === "vi"
  const theme = useThemeColor()

  const {
    isConnected,
    callState,
    dialogue,
    timer,
    isMuted,
    isSpeakerOn,
    overallBand,
    metrics,
    corrections,
    isEvaluating,
    isTtsPlaying,
    initSocket,
    startCall,
    stopRecording: stopLiveRecording,
    hangUp,
    setMuted,
    setSpeakerOn,
    incrementTimer,
    resetStore
  } = useSpeakingStore()

  // Live mic metering hook
  const { isRecording, rmsVolume } = useAudioCall()

  const [waveVolume, setWaveVolume] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const scrollViewRef = useRef<ScrollView | null>(null)
  const pulseAnim = useRef(new Animated.Value(1)).current

  // Socket init
  useEffect(() => {
    initSocket()
    return () => {
      resetStore()
    }
  }, [])

  // Auto-scroll transcript
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true })
    }, 150)
  }, [dialogue, callState])

  // Call timer
  useEffect(() => {
    if (callState === "active") {
      timerRef.current = setInterval(() => {
        incrementTimer()
      }, 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [callState])

  // Pulsating profile animation
  useEffect(() => {
    if (callState === "calling" || callState === "active") {
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
  }, [callState])

  // Waveform logic: user speaking RMS vs AI speaking simulated waves
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (callState === "active" && isRecording) {
      setWaveVolume(rmsVolume)
    } else if (callState === "active" && isTtsPlaying) {
      interval = setInterval(() => {
        setWaveVolume(0.02 + Math.random() * 0.18)
      }, 100)
    } else {
      setWaveVolume(0)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [callState, isRecording, rmsVolume, isTtsPlaying])

  const scaleValue = 1 + waveVolume * 6

  // Start Call Handler
  const handleStartCall = () => {
    const context = {
      topic: currentUnit?.topic || "IELTS Speaking Practice",
      scenario: currentUnit?.scenario || "",
      prompts: currentUnit?.candidate_prompts || [],
    }
    startCall("sophia", context)
  }

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0")
    const s = (secs % 60).toString().padStart(2, "0")
    return `${m}:${s}`
  }

  return (
    <View style={styles.container}>
      {/* 1. IDLE STATE - START CALL BOARD */}
      {callState === "idle" && (
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.headerStatusWrap}>
              {isConnected ? (
                <View style={[styles.statusBadge, styles.statusLive]}>
                  <Server size={10} color="#10b981" />
                  <Text style={styles.statusBadgeText}>{t('call.statusLive')}</Text>
                </View>
              ) : (
                <View style={[styles.statusBadge, styles.statusOffline]}>
                  <Cpu size={10} color="#a78bfa" />
                  <Text style={styles.statusBadgeText}>{t('call.statusOffline')}</Text>
                </View>
              )}
            </View>

            <Text style={[styles.title, { color: theme.text }]}>
              {isVi ? "Giám Khảo IELTS AI" : "AI Examiner Practice"}
            </Text>
            <Text style={[styles.desc, { color: theme.textSecondary }]}>
              {isVi
                ? "Giám khảo AI Sophia (giọng Mỹ) đã sẵn sàng phỏng vấn bạn. Hãy bấm kết nối cuộc gọi để làm bài kiểm tra nói IELTS cho chủ đề này."
                : "AI Examiner Sophia (American Accent) is ready to interview you. Press Start Call to begin your IELTS speaking test."}
            </Text>

            <TouchableOpacity activeOpacity={0.9} onPress={handleStartCall} style={styles.startCallButtonWrap}>
              <LinearGradient
                colors={isConnected ? ["#10b981", "#059669"] : ["#3b82f6", "#2563eb"]}
                style={styles.startCallButton}
              >
                <Phone size={20} color="#fff" />
                <Text style={styles.startCallButtonText}>
                  {isConnected
                    ? (isVi ? "Bắt Đầu Gọi Live (WebSocket)" : "Call AI Examiner (Live)")
                    : t('call.startCallText')}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {/* 2. DIALING STATE */}
      {callState === "calling" && (
        <View style={styles.fullScreenOverlay}>
          <Animated.View style={[styles.pulseRing, { transform: [{ scale: pulseAnim }] }]}>
            <View style={styles.avatarDialWrap}>
              <Text style={styles.avatarDialText}>S</Text>
            </View>
          </Animated.View>
          <Text style={[styles.dialName, { color: theme.text }]}>Sophia</Text>
          <Text style={styles.dialStatus}>{t('call.connectingText')}</Text>
          <TouchableOpacity onPress={hangUp} style={[styles.circleButton, styles.hangUpButton]}>
            <PhoneOff size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      )}

      {/* 3. ACTIVE VOICE CALL SCREEN */}
      {(callState === "active" || (callState === "thinking" && !isEvaluating)) && (
        <View style={styles.activeCallContainer}>
          <View style={styles.callHeader}>
            <View style={styles.speakingIndicatorRow}>
              <View style={[styles.speakingDot, isRecording ? styles.speakingDotActive : (callState === "thinking" ? styles.speakingDotThinking : null)]} />
              <Text style={[styles.speakingStatusText, { color: theme.textSecondary }]}>
                {isRecording 
                  ? t('call.listeningText') 
                  : (callState === "thinking" ? t('call.processingText') : t('call.examinerSpeaking', { name: "Sophia" }))}
              </Text>
            </View>
            <Text style={[styles.timerText, { color: theme.text }]}>{formatTime(timer)}</Text>
          </View>

          {/* Mini examiner profile */}
          <View style={styles.callerProfile}>
            <Animated.View style={[styles.miniAvatar, { transform: [{ scale: pulseAnim }] }]}>
              <Text style={styles.miniAvatarText}>S</Text>
            </Animated.View>
            <Text style={[styles.callerName, { color: theme.text }]}>Sophia</Text>
            <Text style={[styles.callerAccent, { color: theme.textSecondary }]}>American Accent</Text>
          </View>

          {/* Waveform Equalizer */}
          <View style={styles.waveformContainer}>
            <View style={[styles.waveBar, { transform: [{ scaleY: scaleValue * 0.7 }] }]} />
            <View style={[styles.waveBar, { transform: [{ scaleY: scaleValue * 1.4 }] }]} />
            <View style={[styles.waveBar, { transform: [{ scaleY: scaleValue * 2.2 }] }]} />
            <View style={[styles.waveBar, { transform: [{ scaleY: scaleValue * 1.3 }] }]} />
            <View style={[styles.waveBar, { transform: [{ scaleY: scaleValue * 0.8 }] }]} />
          </View>

          {/* Transcripts dialogue */}
          <ScrollView
            ref={scrollViewRef}
            style={[styles.chatScroll, { backgroundColor: theme.backgroundAlt }]}
            contentContainerStyle={styles.chatScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {dialogue.map((turn, idx) => {
              const isAi = turn.sender === "ai"
              return (
                <View key={idx} style={[styles.chatBubble, isAi ? styles.bubbleAi : styles.bubbleUser]}>
                  <Text style={styles.bubbleAuthor}>
                    {isAi ? "Sophia" : (isVi ? "BẠN" : "YOU")}
                  </Text>
                  {turn.sender === "user" ? (
                    (() => {
                      const lowConfWords = turn.lowConfidenceWords
                      if (!lowConfWords || !lowConfWords.length) {
                        return <Text style={styles.bubbleText}>{turn.text}</Text>
                      }
                      const words = turn.text.split(" ")
                      return (
                        <Text style={styles.bubbleText}>
                          {words.map((word, wordIdx) => {
                            const cleanWord = word.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, "")
                            const isMispronounced = lowConfWords.includes(cleanWord)
                            return (
                              <Text
                                key={wordIdx}
                                style={isMispronounced ? { color: "#f87171", fontWeight: "700", textDecorationLine: "underline" } : null}
                              >
                                {word}{" "}
                              </Text>
                            )
                          })}
                        </Text>
                      )
                    })()
                  ) : (
                    <Text style={styles.bubbleText}>{turn.text}</Text>
                  )}
                </View>
              )
            })}
            {callState === "thinking" && !isEvaluating && (
              <View style={[styles.chatBubble, styles.bubbleAi]}>
                <Text style={styles.bubbleAuthor}>Sophia</Text>
                <Text style={styles.bubbleText}>...</Text>
              </View>
            )}
          </ScrollView>

          {/* Controller options */}
          <View style={styles.controlsBar}>
            <TouchableOpacity
              onPress={() => setMuted(!isMuted)}
              style={[styles.circleButtonSmall, isMuted && styles.controlActive]}
              disabled={callState === "thinking" || isEvaluating}
            >
              {isMuted ? <MicOff size={22} color="#fff" /> : <Mic size={22} color="#fff" />}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={hangUp}
              style={[styles.circleButton, styles.hangUpButton]}
              disabled={callState === "thinking" || isEvaluating}
            >
              <PhoneOff size={24} color="#fff" />
            </TouchableOpacity>

            {isRecording && (
              <TouchableOpacity
                onPress={stopLiveRecording}
                style={[styles.circleButton, styles.submitButton]}
                disabled={callState === "thinking" || isEvaluating}
              >
                <CheckCircle size={24} color="#fff" />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={() => setSpeakerOn(!isSpeakerOn)}
              style={[styles.circleButtonSmall, !isSpeakerOn && styles.controlActive]}
              disabled={callState === "thinking" || isEvaluating}
            >
              {isSpeakerOn ? <Volume2 size={22} color="#fff" /> : <VolumeX size={22} color="#fff" />}
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* 4. THINKING & EVALUATING STATE */}
      {callState === "thinking" && isEvaluating && (
        <View style={styles.fullScreenOverlay}>
          <ActivityIndicator size="large" color={theme.primary} style={{ marginBottom: 20 }} />
          <Text style={[styles.dialName, { color: theme.text }]}>{t('call.feedbackLoaderTitle')}</Text>
          <Text style={styles.thinkingDesc}>{t('call.feedbackLoaderDesc')}</Text>
        </View>
      )}

      {/* 5. FEEDBACK REPORT SCREEN */}
      {callState === "feedback" && (
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.reportHeader}>
              <View style={{ flex: 1, paddingRight: 8 }}>
                <View style={styles.completedBadge}>
                  <Text style={styles.completedBadgeText}>{t('call.completedBadge')}</Text>
                </View>
                <Text style={[styles.reportTitle, { color: theme.text }]}>{t('call.reportTitle')}</Text>
                <Text style={styles.reportSub}>AI Examiner: Sophia</Text>
              </View>

              <View style={[styles.overallScoreBox, { borderColor: theme.primary }]}>
                <Text style={styles.overallLabel}>{t('call.overallLabel')}</Text>
                <Text style={styles.overallScoreText}>{overallBand}</Text>
              </View>
            </View>

            <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('call.criteriaBreakdown')}</Text>

            <View style={styles.subMetricsGrid}>
              <View style={[styles.metricCard, { borderColor: theme.border }]}>
                <Text style={styles.subMetricName}>{t('call.fluencyLabel')}</Text>
                <Text style={[styles.subMetricVal, { color: theme.text }]}>{metrics.fluency}</Text>
              </View>
              <View style={[styles.metricCard, { borderColor: theme.border }]}>
                <Text style={styles.subMetricName}>{t('call.lexicalLabel')}</Text>
                <Text style={[styles.subMetricVal, { color: theme.text }]}>{metrics.lexical}</Text>
              </View>
              <View style={[styles.metricCard, { borderColor: theme.border }]}>
                <Text style={styles.subMetricName}>{t('call.grammarLabel')}</Text>
                <Text style={[styles.subMetricVal, { color: theme.text }]}>{metrics.grammar}</Text>
              </View>
              <View style={[styles.metricCard, { borderColor: theme.border }]}>
                <Text style={styles.subMetricName}>{t('call.pronunciationLabel')}</Text>
                <Text style={[styles.subMetricVal, { color: theme.text }]}>{metrics.pronunciation}</Text>
              </View>
            </View>

            {/* Corrections */}
            <View style={styles.correctionsSection}>
              <View style={styles.correctionHeaderRow}>
                <Award size={20} color={theme.primary} />
                <Text style={[styles.correctionsMainTitle, { color: theme.text }]}>{t('call.correctionsTitle')}</Text>
              </View>

              {corrections && corrections.length > 0 ? (
                corrections.map((corr, idx) => {
                  const isGrammar = corr.type === "grammar"
                  const isVocab = corr.type === "vocab"
                  const accentColor = isGrammar ? theme.error : isVocab ? theme.primary : theme.success
                  return (
                    <View key={idx} style={[styles.corrCard, { borderLeftColor: accentColor }]}>
                      <View style={styles.corrTypeRow}>
                        {isGrammar && <ShieldAlert size={14} color={theme.error} />}
                        {isVocab && <MessageSquare size={14} color={theme.primary} />}
                        {corr.type === "positive" && <CheckCircle size={14} color={theme.success} />}
                        <Text style={[styles.corrTypeText, { color: accentColor }]}>
                          {corr.type === "grammar"
                            ? t('call.grammarCorr')
                            : corr.type === "vocab"
                              ? t('call.vocabCorr')
                              : t('call.positiveCorr')}
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
                <Text style={[styles.noCorrectionsText, { color: theme.textSecondary }]}>
                  {isVi ? "Không phát hiện lỗi sai nghiêm trọng nào." : "No critical mistakes detected."}
                </Text>
              )}
            </View>

            <TouchableOpacity activeOpacity={0.8} style={[styles.restartButton, { backgroundColor: theme.primary }]} onPress={hangUp}>
              <RefreshCw size={16} color="#ffffff" />
              <Text style={styles.restartButtonText}>{t('call.restartBtnText')}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </View>
  )
}
