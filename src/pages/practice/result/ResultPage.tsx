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
      return isVi
        ? [
            'Xuất sắc! Bạn đã làm chủ hoàn toàn kỹ năng này với độ chính xác cực cao.',
            'Hãy duy trì phong độ bằng cách thử thách các đề thi đầy đủ (Full Practice Tests) dưới áp lực phòng thi thật.',
            'Xem lại các lỗi sai nhỏ (nếu có) để triệt tiêu hoàn toàn những sơ suất không đáng có.'
          ]
        : [
            'Outstanding! You have fully mastered this skill with exceptional accuracy.',
            'Keep up the momentum by challenging yourself with Full Practice Tests under real exam conditions.',
            'Review minor slip-ups (if any) to eliminate any remaining careless mistakes.'
          ];
    } else if (acc >= 50) {
      return isVi
        ? [
            'Kỹ năng nền tảng khá tốt, tuy nhiên bạn vẫn có thể mắc phải các "bẫy thông tin" (distractors) hoặc hiểu sai ý từ khóa.',
            'Nên tập trung luyện tập lại các dạng câu hỏi có phần trăm chính xác thấp nhất ở bảng dưới.',
            'Sử dụng tính năng "Giải thích bằng AI" bên dưới để sửa đổi tư duy chọn đáp án.'
          ]
        : [
            'Your foundation is decent, but you are still prone to information distractors or misinterpreting keywords.',
            'Focus on practicing the specific question types that yielded the lowest accuracy in the metrics below.',
            'Use the "Explain with AI" feature to correct and refine your answer selection mindset.'
          ];
    } else {
      return isVi
        ? [
            'Kỹ năng hiện tại cần được củng cố kỹ lưỡng hơn về cả từ vựng và phương pháp định vị thông tin.',
            'Hãy học thuộc các bộ từ khóa và đồng nghĩa (synonyms) trước khi tiếp tục làm đề tính giờ.',
            'Kích hoạt "Giải thích bằng AI" cho các câu sai để nắm rõ lộ trình tư duy giải câu hỏi.'
          ]
        : [
            'Your current skill level requires rigorous reinforcement of both vocabulary and keyword-matching strategies.',
            'Learn essential synonyms and paraphrasing groups before taking more timed quizzes.',
            'Activate "Explain with AI" on incorrect answers to fully comprehend the logic pathway.'
          ];
    }
  }, [stats, i18n.language]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={styles.loadingText}>
            {i18n.language === 'vi' ? 'Đang phân tích kết quả...' : 'Analyzing results...'}
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
            {i18n.language === 'vi' ? 'Thiếu Dữ Liệu' : 'Missing Data'}
          </Text>
          <Text style={styles.errorText}>
            {i18n.language === 'vi'
              ? 'Không tìm thấy dữ liệu hoặc có lỗi xảy ra khi chấm điểm.'
              : 'No attempt data found or an error occurred while grading.'}
          </Text>
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={() => navigation.reset({
              index: 0,
              routes: [{ name: 'Main', params: { screen: 'Practice' } }]
            })}
          >
            <Text style={styles.btnPrimaryText}>
              {i18n.language === 'vi' ? 'Quay lại Luyện tập' : 'Back to Practice'}
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
          {i18n.language === 'vi' ? 'Kết Quả Luyện Tập' : 'Practice Results'}
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
              ? (i18n.language === 'vi' ? 'Xuất Sắc!' : 'Excellent!')
              : stats.score >= (stats.isBand ? 5.5 : 50)
              ? (i18n.language === 'vi' ? 'Khá Tốt!' : 'Good Job!')
              : (i18n.language === 'vi' ? 'Cố Gắng Lên!' : 'Keep Trying!')}
          </Text>
          <Text style={styles.heroSubtitle}>
            {stats.isBand
              ? `${i18n.language === 'vi' ? 'Bạn đã đạt mức điểm Band Score cực kỳ ấn tượng:' : 'You achieved an impressive Band Score of:'} ${stats.score}`
              : `${i18n.language === 'vi' ? 'Bạn đạt độ chính xác:' : 'You reached an accuracy of:'} ${stats.score}%`}
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
                  ? (i18n.language === 'vi' ? 'Xem giải thích AI (Miễn phí)' : 'View AI Explanation (Free)')
                  : (i18n.language === 'vi' ? 'Giải thích bằng AI (1 Credit)' : 'Explain with AI (1 Credit)')}
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
                {i18n.language === 'vi' ? 'Luyện tập tiếp' : 'Continue Practice'}
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
              {i18n.language === 'vi' ? 'Đúng' : 'Correct'}
            </Text>
          </View>

          {/* Wrong */}
          <View style={styles.statBox}>
            <View style={[styles.statBoxIconWrap, { backgroundColor: theme.error + '15' }]}>
              <XCircle size={18} color={theme.error} />
            </View>
            <Text style={styles.statBoxValue}>{stats.wrong}</Text>
            <Text style={styles.statBoxLabel}>
              {i18n.language === 'vi' ? 'Sai' : 'Incorrect'}
            </Text>
          </View>

          {/* Skipped */}
          <View style={styles.statBox}>
            <View style={[styles.statBoxIconWrap, { backgroundColor: theme.tabIconDefault + '15' }]}>
              <HelpCircle size={18} color={theme.tabIconDefault} />
            </View>
            <Text style={styles.statBoxValue}>{stats.skipped}</Text>
            <Text style={styles.statBoxLabel}>
              {i18n.language === 'vi' ? 'Bỏ qua' : 'Skipped'}
            </Text>
          </View>
        </View>

        {/* ACCURACY BY QUESTION TYPE */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {i18n.language === 'vi' ? 'Độ Chính Xác' : 'Accuracy'}
            </Text>
          </View>
          <View style={styles.metricRow}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricType}>
                {attemptDetail?.skill || skill || 'IELTS Skill'}
              </Text>
              <Text style={styles.metricCount}>
                {stats.total} {i18n.language === 'vi' ? 'câu hỏi' : 'questions'}
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
              {i18n.language === 'vi' ? 'Đề Xuất Từ Giám Khảo AI' : 'AI Examiner Recommendations'}
            </Text>
          </View>
          <Text style={styles.recIntro}>
            {i18n.language === 'vi'
              ? 'Dựa trên phân tích kết quả bài thi của bạn, Giám khảo AI khuyên bạn nên thực hiện:'
              : 'Based on your test session analytics, the AI Examiner recommends following these steps:'}
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
              {i18n.language === 'vi' ? 'Xem Đáp Án Chi Tiết' : 'Detailed Answer Review'}
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
                        {i18n.language === 'vi' ? `Câu ${idx + 1}` : `Question ${idx + 1}`}
                      </Text>
                      <Text style={styles.qId} numberOfLines={1}>
                        ({ans.questionId})
                      </Text>
                    </View>
                    <View style={styles.qUserAnsRow}>
                      <Text style={styles.qUserAnsLabel}>
                        {i18n.language === 'vi' ? 'Bạn chọn: ' : 'Your Choice: '}
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
                        {ans.userAnswer || (i18n.language === 'vi' ? 'Bỏ qua' : 'Skipped')}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.qRight}>
                  <View style={styles.qCorrectAnsRow}>
                    <Text style={styles.qCorrectLabel}>
                      {i18n.language === 'vi' ? 'Đáp án đúng:' : 'Correct:'}
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
