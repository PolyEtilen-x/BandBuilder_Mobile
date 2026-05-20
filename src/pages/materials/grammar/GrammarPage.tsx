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
import { getStyles } from "./GrammarPage.styles"
import { useThemeColor } from "@/hooks/useThemeColor"

interface Props {
  navigation?: any
  isTab?: boolean
}

type TabType = "basics" | "tenses" | "mistakes"

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

  // UI States (Expandable card lists trackers)
  const [expandedBasicId, setExpandedBasicId] = useState<string | null>(null)
  const [expandedTenseId, setExpandedTenseId] = useState<string | null>(null)
  const [expandedMistakeId, setExpandedMistakeId] = useState<string | null>(null)

  // Load Grammar data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const basicsData = await grammarApi.getBasics()
        const tensesData = await grammarApi.getTenses()
        const mistakesData = await grammarApi.getMistakes()

        setBasics(basicsData)
        setTenses(tensesData)
        setMistakes(mistakesData)
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
        {(["basics", "tenses", "mistakes"] as TabType[]).map((tab) => {
          const isActive = activeTab === tab
          const label = tab === "basics" 
            ? t('grammar.tabBasics') 
            : tab === "tenses" 
              ? t('grammar.tabTenses') 
              : t('grammar.tabMistakes')
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
            <View style={styles.listContainer}>
              <View style={styles.heroBadgeRow}>
                <BookOpen size={16} color={theme.primary} />
                <Text style={styles.heroBadgeText}>{t('grammar.basicsBadge')}</Text>
              </View>

              {basics.map((item) => {
                const isExpanded = expandedBasicId === item.id
                return (
                  <View key={item.id} style={[styles.itemCard, isExpanded && styles.itemCardExpanded]}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => toggleExpandBasic(item.id)}
                      style={styles.cardHeaderTrigger}
                    >
                      <View style={styles.cardHeaderTitleCol}>
                        <Text style={styles.itemTitle}>{item.title}</Text>
                        <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
                      </View>
                      {isExpanded ? (
                        <ChevronUp size={20} color="#94a3b8" />
                      ) : (
                        <ChevronDown size={20} color="#475569" />
                      )}
                    </TouchableOpacity>

                    {isExpanded && (
                      <View style={styles.cardBody}>
                        <View style={styles.divider} />
                        
                        <Text style={styles.sectionLabel}>{t('grammar.explanationLabel')}</Text>
                        <Text style={styles.explanationText}>{item.content}</Text>

                        {item.examples && item.examples.length > 0 && (
                          <View style={styles.examplesContainer}>
                            <Text style={styles.sectionLabel}>{t('grammar.examplesLabel')}</Text>
                            {item.examples.map((ex: string, index: number) => (
                              <View key={index} style={styles.exampleBulletRow}>
                                <View style={styles.bulletDot} />
                                <Text style={styles.exampleBulletText}>{ex}</Text>
                              </View>
                            ))}
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                )
              })}
            </View>
          )}

          {/* B. TENSES MASTERCLASS TAB */}
          {activeTab === "tenses" && (
            <View style={styles.listContainer}>
              <View style={styles.heroBadgeRow}>
                <Clock size={16} color={theme.primary} />
                <Text style={styles.heroBadgeText}>{t('grammar.tensesBadge')}</Text>
              </View>

              {tenses.map((tense) => {
                const isExpanded = expandedTenseId === tense.id
                return (
                  <View key={tense.id} style={[styles.itemCard, isExpanded && styles.itemCardExpanded]}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => toggleExpandTense(tense.id)}
                      style={styles.cardHeaderTrigger}
                    >
                      <View style={styles.cardHeaderTitleCol}>
                        <Text style={styles.itemTitle}>{tense.title}</Text>
                        <Text style={styles.formulaText}>{tense.formula}</Text>
                      </View>
                      {isExpanded ? (
                        <ChevronUp size={20} color="#94a3b8" />
                      ) : (
                        <ChevronDown size={20} color="#475569" />
                      )}
                    </TouchableOpacity>

                    {isExpanded && (
                      <View style={styles.cardBody}>
                        <View style={styles.divider} />

                        <Text style={styles.sectionLabel}>{t('grammar.formulaLabel')}</Text>
                        <View style={styles.formulaBox}>
                          <Text style={styles.formulaBoxText}>{tense.formula}</Text>
                        </View>

                        <Text style={styles.sectionLabel}>{t('grammar.usageLabel')}</Text>
                        <Text style={styles.explanationText}>{tense.use}</Text>

                        {tense.examples && tense.examples.length > 0 && (
                          <View style={styles.examplesContainer}>
                            <Text style={styles.sectionLabel}>{t('grammar.tensesExamplesLabel')}</Text>
                            {tense.examples.map((ex: string, idx: number) => (
                              <View key={idx} style={styles.exampleBulletRow}>
                                <View style={[styles.bulletDot, { backgroundColor: theme.primary }]} />
                                <Text style={styles.exampleBulletText}>{ex}</Text>
                              </View>
                            ))}
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                )
              })}
            </View>
          )}

          {/* C. COMMON MISTAKES TAB */}
          {activeTab === "mistakes" && (
            <View style={styles.listContainer}>
              <View style={styles.heroBadgeRow}>
                <AlertTriangle size={16} color={theme.warning} />
                <Text style={styles.heroBadgeText}>{t('grammar.mistakesBadge')}</Text>
              </View>

              {mistakes.map((category) => {
                const isExpanded = expandedMistakeId === category.category
                return (
                  <View key={category.category} style={[styles.itemCard, isExpanded && styles.itemCardExpanded]}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => toggleExpandMistake(category.category)}
                      style={styles.cardHeaderTrigger}
                    >
                      <View style={styles.cardHeaderTitleCol}>
                        <Text style={styles.itemTitle}>{category.category}</Text>
                        <Text style={styles.itemSubtitle}>
                          {t('grammar.mistakesCount', { count: category.mistakes.length })}
                        </Text>
                      </View>
                      {isExpanded ? (
                        <ChevronUp size={20} color="#94a3b8" />
                      ) : (
                        <ChevronDown size={20} color="#475569" />
                      )}
                    </TouchableOpacity>

                    {isExpanded && (
                      <View style={styles.cardBody}>
                        <View style={styles.divider} />

                        {category.mistakes.map((item: Mistake, idx: number) => (
                          <View key={idx} style={styles.mistakeBlock}>
                            <Text style={styles.mistakeHeading}>
                              {t('grammar.mistakeIndex', { idx: idx + 1 })}
                            </Text>
                            
                            {/* WRONG EX */}
                            <View style={styles.errorSideRow}>
                              <XCircle size={15} color="#f87171" style={styles.errorSideIcon} />
                              <Text style={styles.errorWrongText}>{item.incorrect}</Text>
                            </View>

                            {/* RIGHT EX */}
                            <View style={styles.errorSideRow}>
                              <CheckCircle size={15} color="#34d399" style={styles.errorSideIcon} />
                              <Text style={styles.errorCorrectText}>{item.correct}</Text>
                            </View>

                            {/* EXPLANATION */}
                            <View style={styles.mistakeExplainBox}>
                              <Text style={styles.mistakeExplainLabel}>{t('grammar.whyLabel')}</Text>
                              <Text style={styles.mistakeExplainText}>{item.note}</Text>
                            </View>
                            
                            {idx < category.mistakes.length - 1 && <View style={styles.subDivider} />}
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                )
              })}
            </View>
          )}

        </ScrollView>
      )}
    </Wrapper>
  )
}
