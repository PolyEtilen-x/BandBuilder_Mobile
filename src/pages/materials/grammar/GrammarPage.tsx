import React, { useState, useEffect, useMemo } from "react"
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  UIManager,
  ActivityIndicator,
  StyleSheet
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { LinearGradient } from "expo-linear-gradient"
import {
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Sparkles,
  BookOpen,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react-native"
import { useTranslation } from "react-i18next"
import { grammarApi } from "@/api/grammar.api"
import { MistakeCategory, Mistake } from "@/data/grammar/mistake.model"
import { GrammarBasics, GrammarTenses } from "./components/GrammarTabs1"
import { GrammarMistakes, GrammarSentences } from "./components/GrammarTabs2"
import { getStyles } from "./GrammarPage.styles"
import { useThemeColor } from "@/hooks/useThemeColor"

interface Props {
  navigation?: any
  isTab?: boolean
}

type TabType = "basics" | "tenses" | "mistakes" | "sentences"

export default function GrammarPage({ navigation, isTab = false }: Props) {
  const { t } = useTranslation()
  const theme = useThemeColor()
  const styles = useMemo(() => getStyles(theme), [theme])

  const [activeTab, setActiveTab] = useState<TabType>("basics")
  const [loading, setLoading] = useState(true)

  // Data States
  const [basics, setBasics] = useState<any[]>([])
  const [tenses, setTenses] = useState<any[]>([])
  const [mistakes, setMistakes] = useState<MistakeCategory[]>([])
  const [sentences, setSentences] = useState<any[]>([])

  // UI States (Expandable card lists trackers)
  const [expandedBasicId, setExpandedBasicId] = useState<string | null>(null)
  const [expandedTenseId, setExpandedTenseId] = useState<string | null>(null)
  const [expandedMistakeId, setExpandedMistakeId] = useState<string | null>(null)
  const [expandedSentenceId, setExpandedSentenceId] = useState<string | null>(null)

  // Load Grammar data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const basicsData = await grammarApi.getBasics()
        const tensesData = await grammarApi.getTenses()
        const mistakesData = await grammarApi.getMistakes()
        const sentencesData = await grammarApi.getSentences()

        setBasics(basicsData)
        setTenses(tensesData)
        setMistakes(mistakesData)
        setSentences(sentencesData)
      } catch (err) {
        console.error("Failed to load grammar data:", err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const toggleExpandBasic = (id: string) => {
    setExpandedBasicId(expandedBasicId === id ? null : id)
  }

  const toggleExpandTense = (id: string) => {
    setExpandedTenseId(expandedTenseId === id ? null : id)
  }

  const toggleExpandMistake = (id: string) => {
    setExpandedMistakeId(expandedMistakeId === id ? null : id)
  }

  const toggleExpandSentence = (category: string) => {
    setExpandedSentenceId(expandedSentenceId === category ? null : category)
  }

  const Wrapper: any = isTab ? View : SafeAreaView;

  return (
    <Wrapper style={styles.container} {...(!isTab ? { edges: ["top", "bottom"] } : {})}>
      {!isTab && <StatusBar barStyle={theme.text === '#ffffff' ? "light-content" : "dark-content"} />}
      {!isTab && (
        <LinearGradient colors={["#0f172a", "#1e293b"]} style={StyleSheet.absoluteFillObject} />
      )}

      {/* HEADER BAR */}
      {!isTab && (
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation?.goBack()}>
            <ChevronLeft size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('grammar.headerTitle')}</Text>
          <View style={styles.headerRight}>
            <Sparkles size={18} color={theme.primary} />
          </View>
        </View>
      )}

      {/* TABS ROW */}
      <View style={styles.tabsRow}>
        {(["basics", "tenses", "mistakes", "sentences"] as TabType[]).map((tab) => {
          const isActive = activeTab === tab
          const label = tab === "basics" 
            ? t('grammar.tabBasics') 
            : tab === "tenses" 
              ? t('grammar.tabTenses') 
              : tab === "mistakes"
                ? t('grammar.tabMistakes')
                : t('grammar.tabSentences')
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

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={styles.loadingText}>{t('grammar.loadingText')}</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* A. GRAMMAR BASICS TAB */}
          {activeTab === "basics" && (
            <GrammarBasics
              basics={basics}
              expandedId={expandedBasicId}
              toggleExpand={toggleExpandBasic}
              t={t}
              theme={theme}
              styles={styles}
            />
          )}

          {/* B. TENSES MASTERCLASS TAB */}
          {activeTab === "tenses" && (
            <GrammarTenses
              tenses={tenses}
              expandedId={expandedTenseId}
              toggleExpand={toggleExpandTense}
              t={t}
              theme={theme}
              styles={styles}
            />
          )}

          {/* C. COMMON MISTAKES TAB */}
          {activeTab === "mistakes" && (
            <GrammarMistakes
              mistakes={mistakes}
              expandedId={expandedMistakeId}
              toggleExpand={toggleExpandMistake}
              t={t}
              theme={theme}
              styles={styles}
            />
          )}

          {/* D. IELTS SENTENCE STRUCTURES TAB */}
          {activeTab === "sentences" && (
            <GrammarSentences
              sentences={sentences}
              expandedId={expandedSentenceId}
              toggleExpand={toggleExpandSentence}
              t={t}
              theme={theme}
              styles={styles}
            />
          )}

        </ScrollView>
      )}
    </Wrapper>
  )
}
