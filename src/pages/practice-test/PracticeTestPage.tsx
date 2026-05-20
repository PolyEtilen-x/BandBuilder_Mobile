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
import { useNavigation } from '@react-navigation/native';
import { getStyles } from './style';
import { useThemeColor } from '@/hooks/useThemeColor';
import { usePracticeTest } from '@/hooks/usePracticeTest';
import ReadingPanel from '@/components/test/TestComponent/ReadingPanel';
import ListeningPanel from '@/components/test/TestComponent/ListeningPanel';
import QuestionPanel from '@/components/test/TestComponent/QuestionPanel';
import QuestionNavigator from '@/components/test/TestComponent/QuestionNavigator';
import PracticeToolbar, { ToolType } from '@/components/test/TestComponent/PracticeToolbar';

export default function PracticeTestPage() {
  const theme = useThemeColor();
  const styles = useMemo(() => getStyles(theme), [theme]);
  const navigation = useNavigation();

  const { test, currentUnit, isLoading, error, mode } = usePracticeTest();
  const [activeTab, setActiveTab] = useState<'content' | 'questions'>('content');
  const [activeTool, setActiveTool] = useState<ToolType>('highlight');

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
        >
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>

      {/* TOOLBAR - Chỉ hiển thị trong Practice Mode */}
      {!isExamMode && (
        <PracticeToolbar activeTool={activeTool} setActiveTool={handleToolChange} />
      )}

      {/* TABS */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'content' && styles.tabActive]}
          onPress={() => setActiveTab('content')}
        >
          <Text style={[styles.tabText, activeTab === 'content' && styles.tabTextActive]}>
            {isReading ? 'Passage' : 'Audio'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'questions' && styles.tabActive]}
          onPress={() => setActiveTab('questions')}
        >
          <Text style={[styles.tabText, activeTab === 'questions' && styles.tabTextActive]}>
            Questions
          </Text>
        </TouchableOpacity>
      </View>

      {/* MAIN CONTENT */}
      <View style={styles.content}>
        {activeTab === 'content' ? (
          isReading ? <ReadingPanel passage={currentUnit} /> : <ListeningPanel section={currentUnit} />
        ) : (
          <ScrollView style={styles.questionScroll} showsVerticalScrollIndicator={false}>
            <QuestionPanel questionBlocks={currentUnit?.question_blocks || []} mode={mode} />
          </ScrollView>
        )}
      </View>

      {/* FOOTER */}
      <View style={styles.footer}>
        <QuestionNavigator questionBlocks={currentUnit?.question_blocks || []} />
      </View>

      {/* DICTIONARY MODAL */}
      <Modal visible={isDictOpen} animationType="slide" transparent={true} onRequestClose={() => setIsDictOpen(false)}>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.dictionaryContent}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Dictionary</Text>
              <TouchableOpacity onPress={() => setIsDictOpen(false)} style={styles.modalCloseButton}>
                <X size={24} color={theme.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.searchBar}>
              <Search size={18} color={theme.textSecondary} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search word..."
                placeholderTextColor={theme.textSecondary}
                value={dictSearch}
                onChangeText={setDictSearch}
                autoFocus={true}
              />
            </View>

            <ScrollView style={styles.dictScrollView} showsVerticalScrollIndicator={false}>
              {dictSearch ? (
                <View>
                  <Text style={styles.dictResultWord}>{dictSearch}</Text>
                  <Text style={styles.dictResultPhonetic}>/ˈdɪkʃənəri/</Text>
                  <View style={styles.dictResultBox}>
                    <Text style={styles.dictResultText}>
                      Sample definition for "<Text style={styles.dictResultBoldText}>{dictSearch}</Text>". In a real app, this would call an API like Oxford or Cambridge dictionary.
                    </Text>
                  </View>
                </View>
              ) : (
                <View style={styles.dictEmptyState}>
                  <Book size={64} color={theme.border} strokeWidth={1} />
                  <Text style={styles.dictEmptyText}>Type a word to look up its meaning</Text>
                </View>
              )}
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* NOTES MODAL */}
      <Modal visible={isNoteOpen} animationType="slide" transparent={true} onRequestClose={() => setIsNoteOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.notesContent}>
            <View style={styles.modalHeaderRow}>
              <View style={styles.notesHeaderTitleGroup}>
                <StickyNote size={20} color={theme.primary} />
                <Text style={styles.modalTitle}>Your Notes</Text>
              </View>
              <TouchableOpacity onPress={() => setIsNoteOpen(false)} style={styles.modalCloseButton}>
                <X size={24} color={theme.text} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.notesInput}
              multiline
              placeholder="Write your notes here..."
              placeholderTextColor={theme.textSecondary}
              value={userNote}
              onChangeText={setUserNote}
            />

            <TouchableOpacity
              style={styles.notesSaveButton}
              onPress={() => setIsNoteOpen(false)}
            >
              <Save size={18} color="#fff" />
              <Text style={styles.notesSaveButtonText}>Save Note</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
