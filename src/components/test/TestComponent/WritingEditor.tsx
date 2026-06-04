import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { usePracticeStore } from '@/services/practice/practice.store';

interface WritingTask {
  task?: number;
  min_words?: number;
}

interface Props {
  content: WritingTask;
  taskNumber?: number;
}

export default function WritingEditor({ content, taskNumber }: Props) {
  const theme = useThemeColor();
  const { answers, setAnswer } = usePracticeStore();

  const task = taskNumber ?? content.task ?? 1;
  const minWords = content.min_words ?? (task === 1 ? 150 : 250);

  const storageKey = `task${task}` as 'task1' | 'task2';
  const essay: string = (answers[storageKey] as string) ?? '';

  const wordCount = essay.trim() === '' ? 0 : essay.trim().split(/\s+/).length;
  const isUnderMin = wordCount < minWords;
  const isWarn = wordCount > 0 && isUnderMin;

  const handleChange = (text: string) => {
    setAnswer(storageKey, text);
  };

  return (
    <View style={styles.container}>
      {/* Header with counter */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Your Essay — Task {task}</Text>
        <View
          style={[
            styles.wordCounter,
            { backgroundColor: theme.backgroundAlt },
            isWarn && styles.wordCounterWarn,
          ]}
        >
          <Text
            style={[
              styles.countCurrent,
              { color: isWarn ? theme.error : theme.success },
            ]}
          >
            {wordCount}
          </Text>
          <Text style={[styles.countSeparator, { color: theme.textSecondary }]}>/</Text>
          <Text style={[styles.countMin, { color: theme.textSecondary }]}>{minWords} min</Text>
        </View>
      </View>

      {/* Text Area */}
      <TextInput
        style={[
          styles.textarea,
          {
            color: theme.text,
            backgroundColor: theme.card,
            borderColor: theme.border,
          },
        ]}
        multiline
        placeholder="Begin writing your response here..."
        placeholderTextColor={theme.textSecondary}
        value={essay}
        onChangeText={handleChange}
        textAlignVertical="top"
        autoCapitalize="sentences"
        autoCorrect={true}
      />

      {/* Warnings & Status */}
      {wordCount === 0 ? (
        <View style={[styles.warningBox, { backgroundColor: theme.error + '10', borderColor: theme.error + '30' }]}>
          <Text style={[styles.warningText, { color: theme.error }]}>
            ⚠️ You need at least {minWords} words to submit this task.
          </Text>
        </View>
      ) : isUnderMin ? (
        <View style={[styles.warningBox, { backgroundColor: theme.warning + '10', borderColor: theme.warning + '30' }]}>
          <Text style={[styles.warningText, { color: theme.warning }]}>
            ⚠️ {wordCount} words written — need at least {minWords} ({minWords - wordCount} more to go).
          </Text>
        </View>
      ) : (
        <View style={[styles.okBox, { backgroundColor: theme.success + '10', borderColor: theme.success + '30' }]}>
          <Text style={[styles.okText, { color: theme.success }]}>
            ✅ Word count met ({wordCount} / {minWords}+). You may submit when ready.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
  },
  wordCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  wordCounterWarn: {
    backgroundColor: '#fecaca30',
  },
  countCurrent: {
    fontSize: 14,
    fontWeight: '800',
  },
  countSeparator: {
    fontSize: 12,
  },
  countMin: {
    fontSize: 11,
    fontWeight: '600',
  },
  textarea: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },
  warningBox: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  warningText: {
    fontSize: 12,
    fontWeight: '600',
  },
  okBox: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  okText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
