import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useTranslation } from 'react-i18next';
import { BookOpen, Sparkles } from 'lucide-react-native';
import { practiceApi } from '@/api/practice.api';
import { styles } from './SpeakingPanel.styles';

interface Props {
  test: any;
  currentUnit: any;
  mode?: 'exam' | 'practice';
}

export default function SpeakingPanel({ test, currentUnit, mode = 'practice' }: Props) {
  const theme = useThemeColor();
  const { t, i18n } = useTranslation();
  const isVi = i18n.language === 'vi';

  const [activeTab, setActiveTab] = useState<'prompt' | 'support'>('prompt');
  const [hintData, setHintData] = useState<any>(null);
  const [loadingHint, setLoadingHint] = useState(false);
  const [sampleAnswer, setSampleAnswer] = useState<any>(null);
  const [loadingSample, setLoadingSample] = useState(false);
  const [sampleBand, setSampleBand] = useState<number | null>(null);
  const [supportError, setSupportError] = useState<string | null>(null);

  const skillContentId = test?.skillContentId;
  const questionId = currentUnit?.id || currentUnit?.questionId || 'speaking_prompt';

  // Fetch hints on tab switch
  useEffect(() => {
    if (activeTab === 'support' && !hintData && skillContentId) {
      setLoadingHint(true);
      setSupportError(null);
      practiceApi.getSpeakingHint(skillContentId, questionId)
        .then((res) => {
          setHintData(res.data);
        })
        .catch((err) => {
          console.warn("No hints available for this question:", err);
        })
        .finally(() => {
          setLoadingHint(false);
        });
    }
  }, [activeTab, hintData, skillContentId, questionId]);

  // Fetch Sample Answer
  const handleFetchSample = (band: number) => {
    if (!skillContentId) return;
    setLoadingSample(true);
    setSampleBand(band);
    setSupportError(null);

    Alert.alert(
      isVi ? "Xem bài nói mẫu" : "View Sample Answer",
      isVi
        ? `Xem bài mẫu Band ${band} sẽ tốn 1 credit (nếu là lần đầu tiên). Bạn có chắc chắn muốn xem?`
        : `Viewing Band ${band} sample answer costs 1 credit (on first view). Do you want to proceed?`,
      [
        {
          text: isVi ? "Hủy" : "Cancel",
          style: "cancel",
          onPress: () => setLoadingSample(false)
        },
        {
          text: isVi ? "Xem" : "View",
          onPress: () => {
            practiceApi.getSpeakingSample(skillContentId, questionId, band)
              .then((res) => {
                setSampleAnswer(res.data);
              })
              .catch((err) => {
                const errorMsg = err?.response?.data?.message || err.message;
                setSupportError(
                  isVi
                    ? `Không thể tải bài mẫu: ${errorMsg}`
                    : `Failed to load sample answer: ${errorMsg}`
                );
              })
              .finally(() => {
                setLoadingSample(false);
              });
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* TABS HEADER */}
      <View style={[styles.tabBar, { borderBottomColor: theme.border }]}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.tabButton, activeTab === 'prompt' && { borderBottomColor: theme.primary }]}
          onPress={() => setActiveTab('prompt')}
        >
          <BookOpen size={16} color={activeTab === 'prompt' ? theme.primary : theme.textSecondary} />
          <Text style={[styles.tabText, { color: activeTab === 'prompt' ? theme.primary : theme.textSecondary }]}>
            {isVi ? "Đề bài Speaking" : "Speaking Prompt"}
          </Text>
        </TouchableOpacity>

        {mode === 'practice' && (
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.tabButton, activeTab === 'support' && { borderBottomColor: theme.primary }]}
            onPress={() => setActiveTab('support')}
          >
            <Sparkles size={16} color={activeTab === 'support' ? theme.primary : "#eab308"} />
            <Text style={[styles.tabText, { color: activeTab === 'support' ? theme.primary : theme.textSecondary }]}>
              {isVi ? "Gợi ý & Bài mẫu" : "Aids & Samples"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* =================== TAB 1: PROMPT =================== */}
        {activeTab === 'prompt' && (
          <View style={styles.promptContainer}>
            <View style={[styles.sectionMeta, { backgroundColor: theme.primary + '12' }]}>
              <Text style={[styles.metaText, { color: theme.primary }]}>TOPIC</Text>
            </View>
            <Text style={[styles.topicTitle, { color: theme.text }]}>
              {currentUnit?.topic || "General Discussion"}
            </Text>

            {currentUnit?.scenario && (
              <View style={[styles.scenarioBox, { borderColor: theme.border, backgroundColor: theme.backgroundAlt }]}>
                <Text style={[styles.boxTitle, { color: theme.textSecondary }]}>Scenario (Tình huống)</Text>
                <Text style={[styles.boxText, { color: theme.text }]}>{currentUnit.scenario}</Text>
              </View>
            )}

            {currentUnit?.candidate_prompts && currentUnit.candidate_prompts.length > 0 && (
              <View style={styles.promptsSection}>
                <Text style={[styles.sectionHeading, { color: theme.text }]}>
                  {isVi ? "Các gợi ý cần nói (Candidate Prompts):" : "Prompts to cover in your speech:"}
                </Text>
                <View style={styles.promptsList}>
                  {currentUnit.candidate_prompts.map((prompt: string, idx: number) => (
                    <View key={idx} style={styles.promptItemRow}>
                      <View style={[styles.bulletPoint, { backgroundColor: theme.primary }]} />
                      <Text style={[styles.promptItemText, { color: theme.text }]}>
                        {prompt}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {currentUnit?.examiner_notes?.clubs && (
              <View style={styles.notesSection}>
                <Text style={[styles.sectionHeading, { color: theme.text }]}>
                  Examiner Notes (Thông tin tham khảo):
                </Text>
                {currentUnit.examiner_notes.clubs.map((club: any, idx: number) => (
                  <View key={idx} style={[styles.noteClubCard, { borderLeftColor: theme.primary, backgroundColor: theme.backgroundAlt }]}>
                    <Text style={[styles.clubName, { color: theme.primary }]}>{club.name}</Text>
                    <Text style={[styles.clubDetails, { color: theme.textSecondary }]}>{club.details}</Text>
                  </View>
                ))}
              </View>
            )}
            <View style={{ height: 100 }} />
          </View>
        )}

        {/* =================== TAB 2: AIDS & SAMPLES =================== */}
        {activeTab === 'support' && (
          <View style={styles.supportContainer}>
            {/* 1. Hints */}
            <Text style={[styles.supportHeading, { color: theme.text }]}>💡 Từ vựng & Ngữ pháp gợi ý:</Text>
            {loadingHint ? (
              <View style={styles.loaderWrap}>
                <ActivityIndicator size="small" color={theme.primary} />
                <Text style={[styles.loaderText, { color: theme.textSecondary }]}>
                  {isVi ? "Đang tải gợi ý..." : "Loading hints..."}
                </Text>
              </View>
            ) : hintData ? (
              <View style={[styles.hintsDisplayBox, { borderColor: theme.success + '40', backgroundColor: theme.success + '08' }]}>
                {hintData.hints && hintData.hints.length > 0 && (
                  <View style={{ marginBottom: 12 }}>
                    <Text style={[styles.hintCategoryLabel, { color: theme.success }]}>TỪ VỰNG GỢI Ý</Text>
                    {hintData.hints.map((h: string, idx: number) => (
                      <Text key={idx} style={[styles.hintItemText, { color: theme.success }]}>• {h}</Text>
                    ))}
                  </View>
                )}
                {hintData.grammar_features && (
                  <View>
                    <Text style={[styles.hintCategoryLabel, { color: theme.success }]}>CẤU TRÚC NGỮ PHÁP</Text>
                    <Text style={[styles.hintGrammarText, { color: theme.success }]}>{hintData.grammar_features}</Text>
                  </View>
                )}
              </View>
            ) : (
              <Text style={[styles.emptyHintText, { color: theme.textSecondary }]}>
                {isVi ? "Không có gợi ý cụ thể cho đề này." : "No hints found for this prompt."}
              </Text>
            )}

            {/* 2. Sample Answer */}
            <Text style={[styles.supportHeading, { color: theme.text, marginTop: 12 }]}>
              🎓 Câu trả lời mẫu (Sample Answers):
            </Text>
            <View style={styles.bandSelectorRow}>
              {[6, 7, 8, 9].map((band) => {
                const isActive = sampleBand === band;
                return (
                  <TouchableOpacity
                    key={band}
                    activeOpacity={0.8}
                    disabled={loadingSample && sampleBand === band}
                    style={[
                      styles.bandBtn,
                      { borderColor: theme.border, backgroundColor: theme.card },
                      isActive && { borderColor: theme.primary, backgroundColor: theme.primary + '10' }
                    ]}
                    onPress={() => handleFetchSample(band)}
                  >
                    {loadingSample && sampleBand === band && (
                      <ActivityIndicator size="small" color={theme.primary} style={{ marginRight: 4 }} />
                    )}
                    <Text style={[
                      styles.bandBtnText,
                      { color: theme.textSecondary },
                      isActive && { color: theme.primary, fontWeight: '800' }
                    ]}>
                      Band {band}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {supportError && (
              <View style={[styles.errorBox, { backgroundColor: theme.error + '10', borderColor: theme.error + '20' }]}>
                <Text style={[styles.errorBoxText, { color: theme.error }]}>⚠️ {supportError}</Text>
              </View>
            )}

            {sampleAnswer && (
              <View style={[styles.sampleAnswerBox, { borderColor: theme.border, backgroundColor: theme.card }]}>
                <View style={styles.sampleHeaderRow}>
                  <Text style={[styles.sampleLabel, { color: theme.primary }]}>
                    BÀI NÓI MẪU (BAND {sampleAnswer.band})
                  </Text>
                  {sampleAnswer.charged && (
                    <Text style={[styles.chargedBadge, { color: theme.success }]}>-1 Credit</Text>
                  )}
                </View>
                <Text style={[styles.sampleAnswerText, { color: theme.text }]}>
                  "{sampleAnswer.answerText}"
                </Text>
                {sampleAnswer.tip && (
                  <View style={[styles.tipContainer, { borderTopColor: theme.border }]}>
                    <Text style={[styles.tipLabel, { color: theme.textSecondary }]}>LỜI KHUYÊN EXAMINER TIP</Text>
                    <Text style={[styles.tipText, { color: theme.textSecondary }]}>{sampleAnswer.tip}</Text>
                  </View>
                )}
              </View>
            )}
            <View style={{ height: 100 }} />
          </View>
        )}
      </ScrollView>
    </View>
  );
}
