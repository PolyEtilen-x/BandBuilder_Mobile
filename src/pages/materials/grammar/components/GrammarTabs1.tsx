import React from "react"
import { View, Text, TouchableOpacity } from "react-native"
import { BookOpen, Clock, AlertTriangle, ChevronDown, ChevronUp, CheckCircle, XCircle } from "lucide-react-native"
import { MistakeCategory, Mistake } from "@/data/grammar/mistake.model"

export const GrammarBasics = ({ basics, expandedId, toggleExpand, t, theme, styles }: any) => (
  <View style={styles.listContainer}>
    <View style={styles.heroBadgeRow}>
      <BookOpen size={16} color={theme.primary} />
      <Text style={styles.heroBadgeText}>{t('grammar.basicsBadge')}</Text>
    </View>

    {(basics || []).map((item: any) => {
      const isExpanded = expandedId === item.id
      return (
        <View key={item.id} style={[styles.itemCard, isExpanded && styles.itemCardExpanded]}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => toggleExpand(item.id)}
            style={styles.cardHeaderTrigger}
          >
            <View style={styles.cardHeaderTitleCol}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
            </View>
            {isExpanded ? <ChevronUp size={20} color="#94a3b8" /> : <ChevronDown size={20} color="#475569" />}
          </TouchableOpacity>

          {isExpanded && (
            <View style={styles.cardBody}>
              <View style={styles.divider} />
              <Text style={styles.sectionLabel}>{t('grammar.explanationLabel')}</Text>
              <Text style={styles.explanationText}>{item.content}</Text>
              {item.examples && item.examples.length > 0 && (
                <View style={styles.examplesContainer}>
                  <Text style={styles.sectionLabel}>{t('grammar.examplesLabel')}</Text>
                  {(item.examples || []).map((ex: string, index: number) => (
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
)

export const GrammarTenses = ({ tenses, expandedId, toggleExpand, t, theme, styles }: any) => (
  <View style={styles.listContainer}>
    <View style={styles.heroBadgeRow}>
      <Clock size={16} color={theme.primary} />
      <Text style={styles.heroBadgeText}>{t('grammar.tensesBadge')}</Text>
    </View>

    {(tenses || []).map((tense: any) => {
      const isExpanded = expandedId === tense.id
      return (
        <View key={tense.id} style={[styles.itemCard, isExpanded && styles.itemCardExpanded]}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => toggleExpand(tense.id)}
            style={styles.cardHeaderTrigger}
          >
            <View style={styles.cardHeaderTitleCol}>
              <Text style={styles.itemTitle}>{tense.title}</Text>
              <Text style={styles.formulaText}>{tense.formula}</Text>
            </View>
            {isExpanded ? <ChevronUp size={20} color="#94a3b8" /> : <ChevronDown size={20} color="#475569" />}
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
                  <Text style={styles.sectionLabel}>{t('grammar.examplesLabel')}</Text>
                  {(tense.examples || []).map((ex: string, index: number) => (
                    <View key={index} style={styles.exampleBulletRow}>
                      <View style={styles.bulletDot} />
                      <Text style={styles.exampleBulletText}>{ex}</Text>
                    </View>
                  ))}
                </View>
              )}
              {tense.signals && (
                <View style={styles.signalsContainer}>
                  <Text style={styles.sectionLabel}>{t('grammar.signalsLabel')}</Text>
                  <Text style={styles.signalsText}>{tense.signals}</Text>
                </View>
              )}
            </View>
          )}
        </View>
      )
    })}
  </View>
)
