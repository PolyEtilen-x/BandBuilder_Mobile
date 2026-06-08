import React, { useMemo, useEffect } from 'react';
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
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  ChevronRight,
  AlertTriangle
} from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { getStyles } from './ResultPage.style';
import { useThemeColor } from '@/hooks/useThemeColor';
import { userApi } from '@/api/user.api';
import { practiceApi } from '@/api/practice.api';
import { usePracticeStore } from '@/services/practice/practice.store';

export default function ResultPage() {
  const { t, i18n } = useTranslation();
  const theme = useThemeColor();
  const styles = useMemo(() => getStyles(theme), [theme]);
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const { attemptId, examId, skill, localAnswers, timeSpentSec } = route.params || {};
  const { clearAnswers } = usePracticeStore();

  // 1. Fetch detailed attempt details from API
  const { data: attemptDetail, isLoading, error } = useQuery({
    queryKey: ['attempt-detail', attemptId],
    queryFn: () => userApi.getAttemptDetail(attemptId).then((res) => res.data),
    enabled: !!attemptId,
    staleTime: 1000 * 60 * 5,
  });

  // 2. Clear answers on mount since session is finished
  useEffect(() => {
    clearAnswers();
  }, []);

  const stats = useMemo(() => {
    if (attemptDetail) {
      const serverAnswers = attemptDetail.answers || [];
      const total = serverAnswers.length;
      const correct = serverAnswers.filter((a: any) => a.isCorrect === true).length;
      const wrong = serverAnswers.filter((a: any) => a.isCorrect === false).length;
      const skipped = serverAnswers.filter((a: any) => !a.userAnswer).length;

      const rawScore = total > 0 ? Math.round((correct / total) * 100) : 0;
      const score = attemptDetail.bandScore != null ? attemptDetail.bandScore : rawScore;
      const isBand = attemptDetail.bandScore != null && attemptDetail.bandScore <= 9;

      return { total, correct, wrong, skipped, score, isBand };
    }

    // Fallback: if no attemptDetail is found or loading fails
    return null;
  }, [attemptDetail]);

  const recommendations = useMemo(() => {
    if (!stats) return [];
    const acc = stats.total > 0 ? (stats.correct / stats.total) * 100 : 0;
    const isVi = i18n.language === 'vi';

    if (acc >= 80) {
      return [
        t('practice.result_rec_excellent_1'),
        t('practice.result_rec_excellent_2'),
        t('practice.result_rec_excellent_3')
      ];
    } else if (acc >= 50) {
      return [
        t('practice.result_rec_good_1'),
        t('practice.result_rec_good_2'),
        t('practice.result_rec_good_3')
      ];
    } else {
      return [
        t('practice.result_rec_poor_1'),
        t('practice.result_rec_poor_2'),
        t('practice.result_rec_poor_3')
      ];
    }
  }, [stats, i18n.language]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={styles.loadingText}>
            {t('practice.result_loading_title')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !stats) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <View style={styles.errorContainer}>
          <AlertTriangle size={48} color={theme.error} />
          <Text style={[styles.heroTitle, { marginTop: 16 }]}>
            {t('practice.result_error_title')}
          </Text>
          <Text style={styles.errorText}>
            {t('practice.result_error_desc')}
          </Text>
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={() => navigation.reset({
              index: 0,
              routes: [{ name: 'Main', params: { screen: 'Practice' } }]
            })}
          >
            <Text style={styles.btnPrimaryText}>
              {t('practice.result_error_back')}
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
          {t('practice.result_hero_title')}
        </Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* HERO CARD */}
        <View style={styles.heroCard}>
          <View style={styles.scoreWrapper}>
            <Text style={styles.scoreText}>{stats.score}</Text>
            <Text style={styles.scoreUnit}>{stats.isBand ? 'Band' : '%'}</Text>
          </View>
          <Text style={styles.heroTitle}>
            {stats.score >= (stats.isBand ? 7.5 : 80)
              ? t('practice.result_hero_excellent')
              : stats.score >= (stats.isBand ? 5.5 : 50)
              ? t('practice.result_hero_good')
              : t('practice.result_hero_poor')}
          </Text>
          <Text style={styles.heroSubtitle}>
            {stats.isBand
              ? `${t('practice.result_hero_band_prefix')} ${stats.score}`
              : `${t('practice.result_hero_acc_prefix')} ${stats.score}%`}
          </Text>

          <View style={styles.heroActions}>
            <TouchableOpacity
              style={styles.btnPrimary}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('PracticeResultExplain', { attemptId })}
            >
              <Sparkles size={18} color="#ffffff" />
              <Text style={styles.btnPrimaryText}>
                {attemptDetail?.hasExplanation
                  ? t('practice.result_btn_explain_free')
                  : t('practice.result_btn_explain_credit')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btnSecondary}
              activeOpacity={0.8}
              onPress={() => navigation.reset({
                index: 0,
                routes: [{ name: 'Main', params: { screen: 'Practice' } }]
              })}
            >
              <Text style={styles.btnSecondaryText}>
                {t('practice.result_btn_continue')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* STATS ROW */}
        <View style={styles.statsRow}>
          {/* Correct */}
          <View style={styles.statBox}>
            <View style={[styles.statBoxIconWrap, { backgroundColor: theme.success + '15' }]}>
              <CheckCircle2 size={18} color={theme.success} />
            </View>
            <Text style={styles.statBoxValue}>{stats.correct}</Text>
            <Text style={styles.statBoxLabel}>
              {t('practice.result_stat_correct')}
            </Text>
          </View>

          {/* Wrong */}
          <View style={styles.statBox}>
            <View style={[styles.statBoxIconWrap, { backgroundColor: theme.error + '15' }]}>
              <XCircle size={18} color={theme.error} />
            </View>
            <Text style={styles.statBoxValue}>{stats.wrong}</Text>
            <Text style={styles.statBoxLabel}>
              {t('practice.result_stat_wrong')}
            </Text>
          </View>

          {/* Skipped */}
          <View style={styles.statBox}>
            <View style={[styles.statBoxIconWrap, { backgroundColor: theme.tabIconDefault + '15' }]}>
              <HelpCircle size={18} color={theme.tabIconDefault} />
            </View>
            <Text style={styles.statBoxValue}>{stats.skipped}</Text>
            <Text style={styles.statBoxLabel}>
              {t('practice.result_stat_skipped')}
            </Text>
          </View>
        </View>

        {/* ACCURACY BY QUESTION TYPE */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {t('practice.result_acc_title')}
            </Text>
          </View>
          <View style={styles.metricRow}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricType}>
                {attemptDetail?.skill || skill || 'IELTS Skill'}
              </Text>
              <Text style={styles.metricCount}>
                {stats.total} {t('practice.result_acc_questions')}
              </Text>
            </View>
            <View style={styles.progressWrapper}>
              <View style={styles.progressBg}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${stats.total > 0 ? (stats.correct / stats.total) * 100 : 0}%`,
                      backgroundColor:
                        (stats.correct / stats.total) >= 0.8
                          ? theme.success
                          : (stats.correct / stats.total) >= 0.5
                          ? theme.warning
                          : theme.error,
                    },
                  ]}
                />
              </View>
              <Text style={styles.progressLabel}>
                {stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0}%
              </Text>
            </View>
          </View>
        </View>

        {/* AI RECOMMENDATIONS */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {t('practice.result_rec_title')}
            </Text>
          </View>
          <Text style={styles.recIntro}>
            {t('practice.result_rec_intro')}
          </Text>
          <View style={styles.recList}>
            {recommendations.map((rec, i) => (
              <View key={i} style={styles.recItem}>
                <Text style={styles.recBullet}>{i + 1}</Text>
                <Text style={styles.recText}>{rec}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* DETAILED ANSWER REVIEW */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {t('practice.result_review_title')}
            </Text>
          </View>
          <View style={styles.questionList}>
            {(attemptDetail.answers || []).map((ans: any, idx: number) => (
              <View key={idx} style={styles.questionRow}>
                <View style={styles.qLeft}>
                  <View
                    style={[
                      styles.qBadge,
                      {
                        backgroundColor:
                          ans.isCorrect === true
                            ? theme.success
                            : ans.isCorrect === false
                            ? theme.error
                            : theme.tabIconDefault,
                      },
                    ]}
                  >
                    <Text style={styles.qBadgeText}>{idx + 1}</Text>
                  </View>
                  <View style={styles.qMeta}>
                    <View style={styles.qTitleRow}>
                      <Text style={styles.qTitle}>
                        {t('practice.result_review_q')}{idx + 1}
                      </Text>
                      <Text style={styles.qId} numberOfLines={1}>
                        ({ans.questionId})
                      </Text>
                    </View>
                    <View style={styles.qUserAnsRow}>
                      <Text style={styles.qUserAnsLabel}>
                        {t('practice.result_review_yours')}
                      </Text>
                      <Text
                        style={[
                          styles.qUserAnsVal,
                          {
                            color:
                              ans.isCorrect === true
                                ? theme.success
                                : ans.isCorrect === false
                                ? theme.error
                                : theme.textSecondary,
                          },
                        ]}
                      >
                        {ans.userAnswer || t('practice.result_review_skipped')}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.qRight}>
                  <View style={styles.qCorrectAnsRow}>
                    <Text style={styles.qCorrectLabel}>
                      {t('practice.result_review_correct')}
                    </Text>
                    <Text style={styles.qCorrectVal}>{ans.correctAnswer || 'N/A'}</Text>
                  </View>
                  {ans.timeSpentSec != null && (
                    <Text style={styles.timeSpent}>⏱️ {ans.timeSpentSec}s</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
