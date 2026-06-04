import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StatusBar,
  Alert,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Timer as TimerIcon, ChevronLeft, Info, X, Search, Save, Book, StickyNote } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getStyles } from './style';
import { useThemeColor } from '@/hooks/useThemeColor';
import { usePracticeTest } from '@/hooks/usePracticeTest';
import ReadingPanel from '@/components/test/TestComponent/ReadingPanel';
import ListeningPanel from '@/components/test/TestComponent/ListeningPanel';
import QuestionPanel from '@/components/test/TestComponent/QuestionPanel';
import QuestionNavigator from '@/components/test/TestComponent/QuestionNavigator';
import PracticeToolbar, { ToolType } from '@/components/test/TestComponent/PracticeToolbar';
import WritingPanel from '@/components/test/TestComponent/WritingPanel';
import WritingEditor from '@/components/test/TestComponent/WritingEditor';
import { DictionaryModal } from './components/DictionaryModal';
import { NotesModal } from './components/NotesModal';
import { usePracticeStore } from '@/services/practice/practice.store';
import { practiceApi } from '@/api/practice.api';

export default function PracticeTestPage() {
  const theme = useThemeColor();
  const styles = useMemo(() => getStyles(theme), [theme]);
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const { test, currentUnit, isLoading, error, mode, id } = usePracticeTest();
  const answers = usePracticeStore(state => state.answers);
  const clearAnswers = usePracticeStore(state => state.clearAnswers);

  const [activeTab, setActiveTab] = useState<'content' | 'questions'>('content');
  const [activeTool, setActiveTool] = useState<ToolType>('highlight');
  const [isSubmitting, setIsSubmitting] = useState(false);


  // States cho Tools
  const [isDictOpen, setIsDictOpen] = useState(false);
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [dictSearch, setDictSearch] = useState('');
  const [userNote, setUserNote] = useState('');

  // Xử lý khi nhấn vào Tool
  const handleToolChange = (tool: ToolType) => {
    setActiveTool(tool);
    if (tool === 'dict') setIsDictOpen(true);
    if (tool === 'note') setIsNoteOpen(true);
  };

  const { practiceTestId: routePracticeTestId } = route.params || {};
  const isWriting = test?.skillType === 'Writing' || test?.skill === 'Writing';
  const taskNumber = Number(route.params?.unit || 1);

  const handleSubmit = async () => {
    Alert.alert(
      "Submit Test",
      "Are you sure you want to finish and submit the test?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Submit",
          onPress: async () => {
            try {
              setIsSubmitting(true);
              const timeSpentSec = durationSeconds - timeLeft;

              // 1. Resolve practiceTestId
              let practiceTestId = routePracticeTestId;
              if (!practiceTestId) {
                const skillsRes = await practiceApi.getSkills();
                const matchedSkill = skillsRes.data?.data?.find(
                  (s: any) => s.skillContentId === id
                );
                practiceTestId = matchedSkill?.practiceTests?.[0]?.practiceTestId || matchedSkill?.testId || matchedSkill?.id;
              }

              if (!practiceTestId) {
                throw new Error("Could not find practiceTestId");
              }

              // 2. Start test session
              let sessionTestId = "";
              try {
                const startSessionRes = await practiceApi.startTestSession(practiceTestId);
                sessionTestId = startSessionRes.data.testId;
              } catch (err: any) {
                const errorMessage = err?.response?.data?.message || "";
                const match = errorMessage.match(/testId:\s*([a-fA-F0-9-]+)/) || errorMessage.match(/testId:\s*([^)]+)/);
                if (err?.response?.status === 409 && match && match[1]) {
                  sessionTestId = match[1];
                } else {
                  throw err;
                }
              }

              const skillType = test?.skillType || (isReading ? "Reading" : isListening ? "Listening" : "Writing");

              // 3. Start skill attempt
              try {
                await practiceApi.startSkillAttempt(sessionTestId, skillType);
              } catch (err: any) {
                if (err?.response?.status !== 409) {
                  throw err;
                }
              }

              // 4. Format and submit answers based on skill type
              if (isWriting) {
                const storageKey = `task${taskNumber}`;
                const essay = String(answers[storageKey] || "").trim();
                const wordCount = essay === "" ? 0 : essay.split(/\s+/).length;
                const minWords = taskNumber === 1 ? 100 : 200;

                if (wordCount < minWords) {
                  setIsSubmitting(false);
                  Alert.alert(
                    "Essay Too Short",
                    `Your essay is too short (${wordCount} words). You need at least ${minWords} words for Task ${taskNumber}.`
                  );
                  return;
                }

                const formattedAnswers = [{ questionId: storageKey, userAnswer: essay }];

                try {
                  if (taskNumber === 1) {
                    await practiceApi.submitWritingTask1(sessionTestId, {
                      answers: formattedAnswers,
                      timeSpentSec
                    });
                  } else {
                    await practiceApi.submitWritingTask2(sessionTestId, {
                      answers: formattedAnswers,
                      timeSpentSec
                    });
                  }
                } catch (err: any) {
                  if (err?.response?.status !== 409) {
                    throw err;
                  }
                }
              } else {
                const formattedAnswers = Object.entries(answers).map(([qId, val]) => ({
                  questionId: qId,
                  userAnswer: String(val)
                }));

                try {
                  await practiceApi.submitSkillAnswers(sessionTestId, skillType, {
                    answers: formattedAnswers,
                    timeSpentSec
                  });
                } catch (err: any) {
                  if (err?.response?.status !== 409) {
                    throw err;
                  }
                }
              }

              // 5. Fetch session details to get the exact attemptId
              let attemptId = sessionTestId;
              try {
                const sessionRes = await practiceApi.getTestSessionContent(sessionTestId);
                const activeSkillItem = sessionRes.data?.skills?.find(
                  (s: any) => s.skillType.toLowerCase() === skillType.toLowerCase()
                );
                if (activeSkillItem?.attemptId) {
                  attemptId = activeSkillItem.attemptId;
                }
              } catch (err) {
                console.log("Failed to fetch session content for attemptId lookup, falling back to sessionTestId:", err);
              }

              setIsSubmitting(false);

              // 6. Navigate to results screen
              navigation.navigate('PracticeResult', {
                attemptId,
                examId: id,
                skill: skillType,
                localAnswers: answers,
                timeSpentSec
              });

            } catch (err) {
              setIsSubmitting(false);
              console.error("Submit failed:", err);
              Alert.alert("Error", "Failed to submit test results. Please try again.");
            }
          }
        }
      ]
    );
  };


  // Thời gian bài thi (mặc định 60 phút nếu không có dữ liệu)
  const durationSeconds = (currentUnit?.time_suggested_minutes || 60) * 60;
  const [timeLeft, setTimeLeft] = useState(durationSeconds);

  const isReading = !!test?.content?.passages;
  const isListening = !!test?.content?.sections;
  const isExamMode = mode === 'exam';

  useEffect(() => {
    if (isLoading) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          Alert.alert("Time's up!", "Your time for this section has finished.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isLoading]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleExit = () => {
    Alert.alert(
      "Exit Test",
      "Are you sure you want to exit? Your progress will be saved.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Exit", style: "destructive", onPress: () => navigation.goBack() }
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loaderContainer]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={styles.loaderText}>
          Preparing your {isExamMode ? 'Exam' : 'Practice'} session...
        </Text>
      </View>
    );
  }

  if (error || !test || !currentUnit) {
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <Info size={48} color="#ef4444" style={styles.errorIcon} />
        <Text style={styles.errorText}>
          Failed to load test data. Please try again.
        </Text>
        <TouchableOpacity
          style={[styles.submitButton, styles.errorSubmitButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.submitButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle={theme.text === '#ffffff' ? 'light-content' : 'dark-content'} />

      {/* HEADER - Tùy chỉnh theo Mode */}
      <View style={[styles.header, isExamMode && styles.examHeader]}>
        <TouchableOpacity onPress={handleExit}>
          <ChevronLeft size={24} color={isExamMode ? '#fff' : theme.text} />
        </TouchableOpacity>

        <View style={styles.headerLeft}>
          <Text style={[styles.testTitle, isExamMode && styles.examTestTitle]} numberOfLines={1}>
            {isExamMode ? 'REAL EXAM' : (test.source || 'PRACTICE')}
          </Text>
        </View>

        <View style={[styles.timerContainer, isExamMode && styles.examTimerContainer]}>
          <TimerIcon size={14} color={isExamMode ? '#fff' : theme.primary} />
          <Text style={[styles.timerText, isExamMode && styles.examTimerText]}>{formatTime(timeLeft)}</Text>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, isExamMode && styles.examSubmitButton]}
          activeOpacity={0.8}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.submitButtonText}>Submit</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* TOOLBAR - Chỉ hiển thị trong Practice Mode */}
      {!isExamMode && !isWriting && (
        <PracticeToolbar activeTool={activeTool} setActiveTool={handleToolChange} />
      )}

      {/* TABS */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'content' && styles.tabActive]}
          onPress={() => setActiveTab('content')}
        >
          <Text style={[styles.tabText, activeTab === 'content' && styles.tabTextActive]}>
            {isWriting ? 'Prompt' : isReading ? 'Passage' : 'Audio'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'questions' && styles.tabActive]}
          onPress={() => setActiveTab('questions')}
        >
          <Text style={[styles.tabText, activeTab === 'questions' && styles.tabTextActive]}>
            {isWriting ? 'Write' : 'Questions'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* MAIN CONTENT */}
      <View style={styles.content}>
        {activeTab === 'content' ? (
          isWriting ? (
            <WritingPanel content={(currentUnit || test?.content || {}) as any} taskNumber={taskNumber} />
          ) : isReading ? (
            <ReadingPanel passage={currentUnit} />
          ) : (
            <ListeningPanel section={currentUnit} />
          )
        ) : isWriting ? (
          <WritingEditor content={(currentUnit || test?.content || {}) as any} taskNumber={taskNumber} />
        ) : (
          <ScrollView style={styles.questionScroll} showsVerticalScrollIndicator={false}>
            <QuestionPanel questionBlocks={currentUnit?.question_blocks || []} mode={mode} />
          </ScrollView>
        )}
      </View>

      {/* FOOTER */}
      {!isWriting ? (
        <View style={styles.footer}>
          <QuestionNavigator questionBlocks={currentUnit?.question_blocks || []} />
        </View>
      ) : (
        <View style={[styles.footer, { justifyContent: 'center', alignItems: 'center', paddingVertical: 12 }]}>
          {(() => {
            const storageKey = `task${taskNumber}`;
            const essay = String(answers[storageKey] || '').trim();
            const wordCount = essay === '' ? 0 : essay.split(/\s+/).length;
            const minWords = taskNumber === 1 ? 100 : 200;
            const ready = wordCount >= minWords;
            return (
              <Text style={{ fontSize: 13, color: ready ? theme.success : theme.textSecondary, fontWeight: '700' }}>
                {ready
                  ? `✅ Task ${taskNumber} ready — ${wordCount} words written`
                  : `✍️ Task ${taskNumber} — ${wordCount} / ${minWords} min words`}
              </Text>
            );
          })()}
        </View>
      )}

      {/* DICTIONARY MODAL */}
      <DictionaryModal
        isOpen={isDictOpen}
        onClose={() => setIsDictOpen(false)}
        searchQuery={dictSearch}
        setSearchQuery={setDictSearch}
        theme={theme}
        styles={styles}
      />

      {/* NOTES MODAL */}
      <NotesModal
        isOpen={isNoteOpen}
        onClose={() => setIsNoteOpen(false)}
        note={userNote}
        setNote={setUserNote}
        theme={theme}
        styles={styles}
      />
    </SafeAreaView>
  );
}
