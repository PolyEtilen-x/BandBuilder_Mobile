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
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={{ marginTop: 16, color: theme.textSecondary, fontWeight: '600' }}>
          Preparing your {isExamMode ? 'Exam' : 'Practice'} session...
        </Text>
      </View>
    );
  }

  if (error || !test || !currentUnit) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 24 }]}>
        <Info size={48} color="#ef4444" style={{ marginBottom: 16 }} />
        <Text style={{ color: '#ef4444', fontSize: 16, fontWeight: '700', textAlign: 'center' }}>
          Failed to load test data. Please try again.
        </Text>
        <TouchableOpacity
          style={[styles.submitButton, { marginTop: 24, marginLeft: 0, paddingHorizontal: 32 }]}
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
      <View style={[styles.header, isExamMode && { backgroundColor: '#1e293b', borderBottomWidth: 0 }]}>
        <TouchableOpacity onPress={handleExit}>
          <ChevronLeft size={24} color={isExamMode ? '#fff' : theme.text} />
        </TouchableOpacity>

        <View style={styles.headerLeft}>
          <Text style={[styles.testTitle, isExamMode && { color: '#fff' }]} numberOfLines={1}>
            {isExamMode ? 'REAL EXAM' : (test.source || 'PRACTICE')}
          </Text>
        </View>

        <View style={[styles.timerContainer, isExamMode && { backgroundColor: 'rgba(255,255,255,0.1)' }]}>
          <TimerIcon size={14} color={isExamMode ? '#fff' : theme.primary} />
          <Text style={[styles.timerText, isExamMode && { color: '#fff' }]}>{formatTime(timeLeft)}</Text>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, isExamMode && { backgroundColor: '#3b82f6' }]}
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
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ backgroundColor: theme.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, height: '70%' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <Text style={{ fontSize: 18, fontWeight: '800', color: theme.text }}>Dictionary</Text>
              <TouchableOpacity onPress={() => setIsDictOpen(false)} style={{ padding: 4 }}>
                <X size={24} color={theme.text} />
              </TouchableOpacity>
            </View>

            <View style={{ flexDirection: 'row', backgroundColor: theme.backgroundAlt, borderRadius: 12, paddingHorizontal: 12, alignItems: 'center', borderWidth: 1, borderColor: theme.border }}>
              <Search size={18} color={theme.textSecondary} />
              <TextInput
                style={{ flex: 1, height: 44, paddingHorizontal: 10, color: theme.text, fontWeight: '600' }}
                placeholder="Search word..."
                placeholderTextColor={theme.textSecondary}
                value={dictSearch}
                onChangeText={setDictSearch}
                autoFocus={true}
              />
            </View>

            <ScrollView style={{ flex: 1, marginTop: 20 }} showsVerticalScrollIndicator={false}>
              {dictSearch ? (
                <View>
                  <Text style={{ fontSize: 20, fontWeight: '800', color: theme.primary }}>{dictSearch}</Text>
                  <Text style={{ fontSize: 14, color: theme.textSecondary, marginTop: 4, fontStyle: 'italic' }}>/ˈdɪkʃənəri/</Text>
                  <View style={{ marginTop: 16, padding: 16, backgroundColor: theme.backgroundAlt, borderRadius: 12, borderWidth: 1, borderColor: theme.border }}>
                    <Text style={{ fontSize: 15, lineHeight: 24, color: theme.text }}>
                      Sample definition for "<Text style={{ fontWeight: '700' }}>{dictSearch}</Text>". In a real app, this would call an API like Oxford or Cambridge dictionary.
                    </Text>
                  </View>
                </View>
              ) : (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 100 }}>
                  <Book size={64} color={theme.border} strokeWidth={1} />
                  <Text style={{ marginTop: 16, color: theme.textSecondary, fontSize: 15, fontWeight: '500' }}>Type a word to look up its meaning</Text>
                </View>
              )}
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* NOTES MODAL */}
      <Modal visible={isNoteOpen} animationType="slide" transparent={true} onRequestClose={() => setIsNoteOpen(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: theme.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, height: '60%' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <StickyNote size={20} color={theme.primary} />
                <Text style={{ fontSize: 18, fontWeight: '800', color: theme.text }}>Your Notes</Text>
              </View>
              <TouchableOpacity onPress={() => setIsNoteOpen(false)} style={{ padding: 4 }}>
                <X size={24} color={theme.text} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={{ flex: 1, backgroundColor: theme.backgroundAlt, borderRadius: 12, padding: 16, color: theme.text, fontSize: 16, textAlignVertical: 'top', borderWidth: 1, borderColor: theme.border, lineHeight: 24 }}
              multiline
              placeholder="Write your notes here..."
              placeholderTextColor={theme.textSecondary}
              value={userNote}
              onChangeText={setUserNote}
            />

            <TouchableOpacity
              style={{ backgroundColor: theme.primary, height: 50, borderRadius: 12, marginTop: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              onPress={() => setIsNoteOpen(false)}
            >
              <Save size={18} color="#fff" />
              <Text style={{ color: '#fff', fontWeight: '800', fontSize: 16 }}>Save Note</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
