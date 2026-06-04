import React from "react"
import { View, Text, TouchableOpacity } from "react-native"
import { AlertTriangle, BookOpen, ChevronDown, ChevronUp, CheckCircle, XCircle } from "lucide-react-native"
import { MistakeCategory, Mistake } from "@/data/grammar/mistake.model"

export const GrammarMistakes = ({ mistakes, expandedId, toggleExpand, t, theme, styles }: any) => (
  <View style={styles.listContainer}>
    <View style={styles.heroBadgeRow}>
      <AlertTriangle size={16} color="#f59e0b" />
      <Text style={[styles.heroBadgeText, { color: "#d97706" }]}>{t('grammar.mistakesBadge')}</Text>
    </View>

    {(mistakes || []).map((cat: MistakeCategory, catIndex: number) => {
      const isExpanded = expandedId === catIndex.toString()
      return (
        <View key={catIndex} style={[styles.itemCard, isExpanded && styles.itemCardExpanded]}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => toggleExpand(catIndex.toString())}
            style={styles.cardHeaderTrigger}
          >
            <View style={styles.cardHeaderTitleCol}>
              <Text style={styles.itemTitle}>{cat.category}</Text>
              <Text style={styles.itemSubtitle}>{(cat.mistakes || []).length} common mistakes</Text>
            </View>
            {isExpanded ? <ChevronUp size={20} color="#94a3b8" /> : <ChevronDown size={20} color="#475569" />}
          </TouchableOpacity>

          {isExpanded && (
            <View style={styles.cardBody}>
              <View style={styles.divider} />
              {(cat.mistakes || []).map((item: Mistake, idx: number) => (
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
                  
                  {idx < (cat.mistakes || []).length - 1 && <View style={styles.subDivider} />}
                </View>
              ))}
            </View>
          )}
        </View>
      )
    })}
  </View>
)

export const GrammarSentences = ({ sentences, expandedId, toggleExpand, t, theme, styles }: any) => (
  <View style={styles.listContainer}>
    <View style={styles.heroBadgeRow}>
      <BookOpen size={16} color={theme.primary} />
      <Text style={styles.heroBadgeText}>{t('grammar.sentencesBadge')}</Text>
    </View>

    {(sentences || []).map((item: any) => {
      const isExpanded = expandedId === item.category
      return (
        <View key={item.category} style={[styles.itemCard, isExpanded && styles.itemCardExpanded]}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => toggleExpand(item.category)}
            style={styles.cardHeaderTrigger}
          >
            <View style={styles.cardHeaderTitleCol}>
              <Text style={styles.itemTitle}>{item.category}</Text>
              <Text style={styles.formulaText} numberOfLines={1}>{item.structure}</Text>
            </View>
            {isExpanded ? <ChevronUp size={20} color="#94a3b8" /> : <ChevronDown size={20} color="#475569" />}
          </TouchableOpacity>

          {isExpanded && (
            <View style={styles.cardBody}>
              <View style={styles.divider} />
              <Text style={styles.sectionLabel}>{t('grammar.formulaLabel')}</Text>
              <View style={styles.formulaBox}>
                <Text style={styles.formulaBoxText}>{item.structure}</Text>
              </View>
              <Text style={styles.sectionLabel}>Ứng dụng IELTS / IELTS Application:</Text>
              <Text style={styles.explanationText}>{item.ielts_application}</Text>
              {item.examples && item.examples.length > 0 && (
                <View style={styles.examplesContainer}>
                  <Text style={styles.sectionLabel}>{t('grammar.examplesLabel')}</Text>
                  {(item.examples || []).map((ex: any, idx: number) => (
                    <View key={idx} style={styles.exampleBulletRow}>
                      <View style={[styles.bulletDot, { backgroundColor: theme.primary }]} />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.exampleBulletText}>"{ex.sentence}"</Text>
                        {(ex.logic || ex.type) && (
                          <Text style={{ fontSize: 11, color: theme.textSecondary, marginTop: 4, fontWeight: '600' }}>
                            👉 {ex.logic || ex.type}
                          </Text>
                        )}
                      </View>
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
)
