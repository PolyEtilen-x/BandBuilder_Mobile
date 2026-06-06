import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Check } from 'lucide-react-native';

interface Props {
  question: any;
  options: string[];
  value: string[];
  onChange: (id: string, value: string[]) => void;
  isReview?: boolean;
}

export default function SelectingFactorsQuestion({
  question,
  options = [],
  value = [],
  onChange,
  isReview = false
}: Props) {
  const theme = useThemeColor();

  const correctAnswers = useMemo(() => {
    if (!question.correct_answer) return [];
    if (Array.isArray(question.correct_answer)) {
      return question.correct_answer.map(String);
    }
    return [String(question.correct_answer)];
  }, [question.correct_answer]);

  function toggle(op: string) {
    if (isReview) return;
    const currentValues = Array.isArray(value) ? value : [];
    if (currentValues.includes(op)) {
      onChange(question.id || String(question.number || question.question_number), currentValues.filter((v: string) => v !== op));
    } else {
      onChange(question.id || String(question.number || question.question_number), [...currentValues, op]);
    }
  }

  const answersList = Array.isArray(value) ? value : [];

  return (
    <View style={styles.container}>
      <View style={styles.questionHeader}>
        <View style={[styles.numberBadge, { backgroundColor: theme.primary }]}>
          <Text style={styles.numberText}>{question.number || question.question_number}</Text>
        </View>
        <Text style={[styles.questionText, { color: theme.text }]}>
          {question.text || "Select the correct factors:"}
        </Text>
      </View>

      <View style={styles.optionsContainer}>
        {options.map((option) => {
          const isSelected = answersList.includes(option);
          const isCorrect = correctAnswers.includes(option);

          let borderColor = isSelected ? theme.primary : theme.border;
          let bgColor = isSelected ? theme.primary + '10' : theme.card;
          let textColor = theme.text;

          if (isReview) {
            if (isCorrect) {
              borderColor = theme.success;
              bgColor = theme.success + '10';
              textColor = theme.success;
            } else if (isSelected && !isCorrect) {
              borderColor = theme.error;
              bgColor = theme.error + '10';
              textColor = theme.error;
            }
          }

          return (
            <TouchableOpacity
              key={option}
              activeOpacity={isReview ? 1 : 0.7}
              style={[
                styles.optionRow,
                {
                  borderColor,
                  backgroundColor: bgColor,
                }
              ]}
              onPress={() => toggle(option)}
            >
              <View style={[
                styles.checkbox,
                { borderColor: isReview && isCorrect ? theme.success : (isSelected ? theme.primary : theme.border) },
                isSelected && { backgroundColor: theme.primary },
                isReview && isCorrect && { backgroundColor: theme.success },
                isReview && isSelected && !isCorrect && { backgroundColor: theme.error }
              ]}>
                {(isSelected || (isReview && isCorrect)) && (
                  <Check size={12} color="#fff" strokeWidth={3} />
                )}
              </View>
              <Text style={[
                styles.optionText,
                { color: textColor },
                (isSelected || (isReview && isCorrect)) && { fontWeight: '700' }
              ]}>
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

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
    marginBottom: 24,
  },
  questionHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  numberBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  numberText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
  },
  questionText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  optionsContainer: {
    gap: 10,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 15,
    flex: 1,
  },
  explanationBox: {
    marginTop: 12,
    padding: 12,
    borderLeftWidth: 4,
    borderRadius: 8,
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
