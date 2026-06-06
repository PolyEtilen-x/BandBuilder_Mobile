import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

interface Props {
  question: any;
  value: any;
  onChange: (id: string, value: any) => void;
  isReview?: boolean;
}

export default function TableComQuestion({
  question,
  value,
  onChange,
  isReview = false
}: Props) {
  const theme = useThemeColor();

  const correctAnswer = question.correct_answer?.toString().trim().toLowerCase();
  const isCorrect = value?.toString().trim().toLowerCase() === correctAnswer;

  const getBorderColor = () => {
    if (isReview) {
      return isCorrect ? theme.success : theme.error;
    }
    return value ? theme.primary : theme.border;
  };

  const getBackgroundColor = () => {
    if (isReview) {
      return isCorrect ? theme.success + '08' : theme.error + '08';
    }
    return theme.card;
  };

  const getTextColor = () => {
    if (isReview) {
      return isCorrect ? theme.success : theme.error;
    }
    return theme.text;
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={[styles.numberBadge, { backgroundColor: theme.primary }]}>
          <Text style={styles.numberText}>{question.number || question.question_number}</Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.input,
              {
                color: getTextColor(),
                backgroundColor: getBackgroundColor(),
                borderColor: getBorderColor()
              }
            ]}
            value={value || ''}
            onChangeText={(text) => !isReview && onChange(question.id || String(question.number || question.question_number), text)}
            placeholder="..."
            placeholderTextColor={theme.textSecondary}
            editable={!isReview}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      </View>

      {isReview && !isCorrect && (
        <View style={styles.answerRow}>
          <Text style={[styles.answerText, { color: theme.success }]}>
            Correct answer: {question.correct_answer}
          </Text>
        </View>
      )}

      {isReview && question.explanation && (
        <View style={[styles.explanationBox, { borderLeftColor: theme.primary, backgroundColor: theme.backgroundAlt }]}>
          <Text style={[styles.explanationTitle, { color: theme.primary }]}>EXPLANATION:</Text>
          <Text style={[styles.explanationText, { color: theme.textSecondary }]}>{question.explanation}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  numberBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  numberText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
  },
  inputContainer: {
    flex: 1,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 15,
    fontWeight: '600',
  },
  answerRow: {
    marginTop: 8,
    paddingLeft: 36,
  },
  answerText: {
    fontSize: 12,
    fontWeight: '800',
  },
  explanationBox: {
    marginTop: 10,
    padding: 12,
    borderLeftWidth: 4,
    borderRadius: 8,
    marginLeft: 36,
  },
  explanationTitle: {
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 4,
  },
  explanationText: {
    fontSize: 13,
    lineHeight: 18,
  },
});
