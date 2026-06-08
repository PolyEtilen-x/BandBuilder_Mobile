import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft,
  Brain,
  Sparkles,
  Lightbulb,
  AlertTriangle
} from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { getStyles } from './ResultExplainPage.style';
import { useThemeColor } from '@/hooks/useThemeColor';
import { userApi } from '@/api/user.api';

interface ExplanationItem {
  questionId: string;
  userAnswer: string | null;
  correctAnswer: string;
  explanation: string;
  tip: string;
}

interface ExplanationResponse {
  attemptId: string;
  skill: string;
  charged: boolean;
  explanations: ExplanationItem[];
}

export default function ResultExplainPage() {
  const { t, i18n } = useTranslation();
  const theme = useThemeColor();
  const styles = useMemo(() => getStyles(theme), [theme]);
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const { attemptId } = route.params || {};
  const [filter, setFilter] = useState<'all' | 'incorrect' | 'correct'>('all');

  // 1. Fetch AI explanations for this attempt
  const { data: explanationData, isLoading, error } = useQuery<ExplanationResponse>({
    queryKey: ['attempt-explanation', attemptId],
    queryFn: () => userApi.getAttemptExplanation(attemptId).then((res) => res.data),
    enabled: !!attemptId,
    staleTime: 1000 * 60 * 30, // Cache for 30 minutes
    refetchOnWindowFocus: false,
    retry: false
  });

  // 2. Fetch detailed attempt details to get the exact score/band score
  const { data: attemptDetail } = useQuery({
    queryKey: ['attempt-detail', attemptId],
    queryFn: () => userApi.getAttemptDetail(attemptId).then((res) => res.data),
    enabled: !!attemptId,
    staleTime: 1000 * 60 * 5,
  });

  // Filter explanations based on selection
  const filteredExplanations = useMemo(() => {
    if (!explanationData?.explanations) return [];
    return explanationData.explanations.filter((item) => {
      const isCorrect = (item.userAnswer || '').trim().toLowerCase() === (item.correctAnswer || '').trim().toLowerCase();
      if (filter === 'correct') return isCorrect;
      if (filter === 'incorrect') return !isCorrect;
      return true;
    });
  }, [explanationData, filter]);

  // Compute local stats
  const stats = useMemo(() => {
    if (!explanationData?.explanations) return { correct: 0, incorrect: 0 };
    return explanationData.explanations.reduce(
      (acc, item) => {
        const isCorrect = (item.userAnswer || '').trim().toLowerCase() === (item.correctAnswer || '').trim().toLowerCase();
        if (isCorrect) acc.correct++;
        else acc.incorrect++;
        return acc;
      },
      { correct: 0, incorrect: 0 }
    );
  }, [explanationData]);

  const attemptScore = useMemo(() => {
    if (attemptDetail) {
      const score = attemptDetail.bandScore != null ? attemptDetail.bandScore : (attemptDetail.score != null ? attemptDetail.score : null);
      if (score != null) {
        return {
          score,
          isBand: attemptDetail.bandScore != null && attemptDetail.bandScore <= 9
        };
      }
    }
    // Fallback calculation
    const total = explanationData?.explanations.length || 0;
    const rawScore = total > 0 ? Math.round((stats.correct / total) * 100) : 0;
    return { score: rawScore, isBand: false };
  }, [attemptDetail, explanationData, stats.correct]);

  const recommendations = useMemo(() => {
    const isVi = i18n.language === 'vi';
    if (stats.incorrect === 0) {
      return [t('practice.explain_rec_perfect')];
    }
    return [
      t('practice.explain_rec_improve_1'),
      t('practice.explain_rec_improve_2')
    ];
  }, [stats, i18n.language]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <StatusBar barStyle={theme.text === '#ffffff' ? 'light-content' : 'dark-content'} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Brain size={36} color={theme.primary} style={{ marginTop: 20 }} />
          <Text style={styles.loadingText}>
            {t('practice.explain_loading_title')}
          </Text>
          <Text style={styles.loadingSubText}>
            {t('practice.explain_loading_desc')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !explanationData) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <View style={styles.errorContainer}>
          <AlertTriangle size={48} color={theme.error} />
          <Text style={[styles.heroTitle, { marginTop: 16 }]}>
            {t('practice.explain_error_title')}
          </Text>
          <Text style={styles.errorText}>
            {t('practice.explain_error_desc')}
          </Text>
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.btnPrimaryText}>
              {t('practice.explain_error_back')}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle={theme.text === '#ffffff' ? 'light-content' : 'dark-content'} />

      {/* HEADER BAR */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {t('practice.explain_hero_title')}
        </Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* HERO HEADER SUMMARY */}
        <View style={styles.heroCard}>
          <View style={styles.scoreWrapper}>
            <Text style={styles.scoreText}>{attemptScore.score}</Text>
            <Text style={styles.scoreUnit}>{attemptScore.isBand ? 'Band' : '%'}</Text>
          </View>
          <View style={styles.heroMeta}>
            <Text style={styles.heroTitle} numberOfLines={1}>
              {t('practice.explain_hero_card_title')}
            </Text>
            <Text style={styles.heroSubtitle}>
              {explanationData.skill} Attempt ID: {explanationData.attemptId.slice(0, 8)}
            </Text>
          </View>
        </View>

        {/* FILTER TAB BAR */}
        <View style={styles.filterPanel}>
          <Text style={styles.filterCount}>
            {t('practice.explain_filter_showing')} {filteredExplanations.length}
          </Text>
          <View style={styles.filterTabs}>
            <TouchableOpacity
              style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}
              onPress={() => setFilter('all')}
            >
              <Text
                style={[
                  styles.filterTabText,
                  filter === 'all' && styles.filterTabTextActive,
                ]}
              >
                {t('practice.explain_filter_all')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterTab,
                filter === 'incorrect' && styles.filterTabActiveIncorrect,
              ]}
              onPress={() => setFilter('incorrect')}
            >
              <Text
                style={[
                  styles.filterTabText,
                  filter === 'incorrect' && styles.filterTabTextActiveIncorrect,
                ]}
              >
                {t('practice.explain_filter_incorrect')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterTab,
                filter === 'correct' && styles.filterTabActiveCorrect,
              ]}
              onPress={() => setFilter('correct')}
            >
              <Text
                style={[
                  styles.filterTabText,
                  filter === 'correct' && styles.filterTabTextActiveCorrect,
                ]}
              >
                {t('practice.explain_filter_correct')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* AI STRATEGY ADVICE */}
        <View style={styles.adviceSection}>
          <View style={styles.adviceTitleRow}>
            <Sparkles size={16} color={theme.warning} />
            <Text style={styles.adviceTitle}>
              {t('practice.explain_advice_title')}
            </Text>
          </View>
          <View style={styles.adviceList}>
            {recommendations.map((rec, i) => (
              <View key={i} style={styles.adviceItem}>
                <Text style={styles.adviceBullet}>✓</Text>
                <Text style={styles.adviceText}>{rec}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* EXPLANATIONS LIST */}
        <View style={{ gap: 12 }}>
          {filteredExplanations.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Brain size={48} color={theme.tabIconDefault} />
              <Text style={styles.emptyText}>
                {t('practice.explain_empty_filter')}
              </Text>
            </View>
          ) : (
            filteredExplanations.map((item, idx) => {
              const isCorrect =
                (item.userAnswer || '').trim().toLowerCase() === (item.correctAnswer || '').trim().toLowerCase();

              return (
                <View
                  key={idx}
                  style={[
                    styles.explainCard,
                    isCorrect ? styles.explainCardCorrect : styles.explainCardIncorrect,
                  ]}
                >
                  {/* Header */}
                  <View style={styles.explainCardHeader}>
                    <View style={styles.explainCardInfo}>
                      <View
                        style={[
                          styles.numBadge,
                          isCorrect ? styles.numBadgeCorrect : styles.numBadgeIncorrect,
                        ]}
                      >
                        <Text style={styles.numBadgeText}>
                          {item.questionId.replace(/\D/g, '') || idx + 1}
                        </Text>
                      </View>
                      <Text style={styles.explainTitle} numberOfLines={1}>
                        {t('practice.explain_q_title')}
                        {item.questionId}
                      </Text>
                    </View>

                    <View style={styles.compareBox}>
                      <View style={styles.compareCol}>
                        <Text style={styles.compareLabel}>
                          {t('practice.explain_ans_yours')}
                        </Text>
                        <Text
                          style={[
                            styles.compareVal,
                            isCorrect ? styles.compareValCorrect : styles.compareValIncorrect,
                          ]}
                        >
                          {item.userAnswer || t('practice.explain_ans_skipped')}
                        </Text>
                      </View>
                      <View style={styles.compareCol}>
                        <Text style={styles.compareLabel}>
                          {t('practice.explain_ans_correct')}
                        </Text>
                        <Text style={[styles.compareVal, styles.compareValCorrect]}>
                          {item.correctAnswer}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Body */}
                  <View style={styles.aiAnalysisBlock}>
                    <View style={styles.aiAnalysisHeader}>
                      <Brain size={14} color={theme.primary} />
                      <Text style={styles.aiAnalysisLabel}>
                        {t('practice.explain_ai_analysis')}
                      </Text>
                    </View>
                    <Text style={styles.aiAnalysisText}>{item.explanation}</Text>

                    {/* Pro Tip */}
                    {item.tip ? (
                      <View style={styles.proTipBlock}>
                        <View style={styles.proTipHeader}>
                          <Lightbulb size={14} color={theme.warning} />
                          <Text style={styles.proTipLabel}>
                            {t('practice.explain_ai_tips')}
                          </Text>
                        </View>
                        <Text style={styles.proTipText}>{item.tip}</Text>
                      </View>
                    ) : null}
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
