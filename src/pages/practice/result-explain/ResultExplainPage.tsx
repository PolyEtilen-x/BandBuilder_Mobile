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
  const { i18n } = useTranslation();
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
      return isVi
        ? ['Hoàn hảo! Bạn đã đạt điểm tuyệt đối. Hãy tiếp tục giải đề khác để duy trì phong độ và phản xạ.']
        : ['Perfect! You achieved a perfect score. Continue practicing other modules to maintain your speed.'];
    }
    return isVi
      ? [
          'Tập trung học phương pháp định vị từ khóa đồng nghĩa (Synonyms/Paraphrasing) được mô tả trong các mẹo tránh bẫy của AI.',
          'Phân tích kỹ lưỡng các đáp án gây nhiễu (distractors) để học cách loại trừ triệt để.'
        ]
      : [
          'Focus on mastering synonym keyword-matching described in the AI pro tips of incorrect answers.',
          'Thoroughly analyze structural distractors to learn precise process-of-elimination techniques.'
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
            {i18n.language === 'vi' ? 'Đang phân tích lỗi bằng AI...' : 'Analyzing errors with AI...'}
          </Text>
          <Text style={styles.loadingSubText}>
            {i18n.language === 'vi'
              ? 'Giám khảo AI của BandBuilder đang đối chiếu ngữ pháp và biên soạn lời giải thích chi tiết cho bạn.'
              : "BandBuilder's AI Examiner is matching grammar pathways and drafting detailed explanations for you."}
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
            {i18n.language === 'vi' ? 'Lỗi tải lời giải thích' : 'Failed to load explanation'}
          </Text>
          <Text style={styles.errorText}>
            {i18n.language === 'vi'
              ? 'Không thể truy xuất giải thích từ máy chủ. Vui lòng kiểm tra lại kết nối mạng hoặc số dư credit.'
              : 'Failed to fetch AI feedback. Please check your network connection or credit balance.'}
          </Text>
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.btnPrimaryText}>
              {i18n.language === 'vi' ? 'Quay lại' : 'Go Back'}
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
          {i18n.language === 'vi' ? 'AI Giải Thích Đáp Án' : 'AI Explanations'}
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
              {i18n.language === 'vi' ? 'Phân Tích Lời Giải AI' : 'AI Explanation Analysis'}
            </Text>
            <Text style={styles.heroSubtitle}>
              {explanationData.skill} Attempt ID: {explanationData.attemptId.slice(0, 8)}
            </Text>
          </View>
        </View>

        {/* FILTER TAB BAR */}
        <View style={styles.filterPanel}>
          <Text style={styles.filterCount}>
            {i18n.language === 'vi'
              ? `Hiện: ${filteredExplanations.length} câu`
              : `Showing: ${filteredExplanations.length} Qs`}
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
                {i18n.language === 'vi' ? 'Tất cả' : 'All'}
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
                {i18n.language === 'vi' ? 'Câu Sai' : 'Incorrect'}
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
                {i18n.language === 'vi' ? 'Câu Đúng' : 'Correct'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* AI STRATEGY ADVICE */}
        <View style={styles.adviceSection}>
          <View style={styles.adviceTitleRow}>
            <Sparkles size={16} color={theme.warning} />
            <Text style={styles.adviceTitle}>
              {i18n.language === 'vi' ? 'Lời Khuyên Luyện Thi AI' : 'AI Examiner Advice'}
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
                {i18n.language === 'vi'
                  ? 'Không tìm thấy câu hỏi nào thỏa mãn bộ lọc.'
                  : 'No questions match the active filter.'}
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
                        {i18n.language === 'vi' ? 'Câu hỏi: ' : 'Question: '}
                        {item.questionId}
                      </Text>
                    </View>

                    <View style={styles.compareBox}>
                      <View style={styles.compareCol}>
                        <Text style={styles.compareLabel}>
                          {i18n.language === 'vi' ? 'Bạn chọn:' : 'You chose:'}
                        </Text>
                        <Text
                          style={[
                            styles.compareVal,
                            isCorrect ? styles.compareValCorrect : styles.compareValIncorrect,
                          ]}
                        >
                          {item.userAnswer || (i18n.language === 'vi' ? 'Bỏ qua' : 'Skipped')}
                        </Text>
                      </View>
                      <View style={styles.compareCol}>
                        <Text style={styles.compareLabel}>
                          {i18n.language === 'vi' ? 'Đáp án đúng:' : 'Correct:'}
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
                        {i18n.language === 'vi' ? 'Phân Tích Chi Tiết AI' : 'AI Examiner Breakdown'}
                      </Text>
                    </View>
                    <Text style={styles.aiAnalysisText}>{item.explanation}</Text>

                    {/* Pro Tip */}
                    {item.tip ? (
                      <View style={styles.proTipBlock}>
                        <View style={styles.proTipHeader}>
                          <Lightbulb size={14} color={theme.warning} />
                          <Text style={styles.proTipLabel}>
                            {i18n.language === 'vi' ? 'Mẹo Tránh Bẫy' : 'Trap Avoidance Tip'}
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
