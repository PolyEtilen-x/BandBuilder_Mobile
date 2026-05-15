import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

interface Props {
  question: any;
  value: any;
  onChange: (id: string, value: any) => void;
  extra: any;
  isReview?: boolean;
}

export default function MCQQuestion({ question, value, onChange, extra, isReview }: Props) {
  const theme = useThemeColor();
  const options = question.options || extra.options || [];

  const handleSelect = (optionValue: string) => {
    if (isReview) return;
    onChange(question.id || String(question.number), optionValue);
  };

  return (
    <View style={styles.container}>
      <View style={styles.questionHeader}>
        <View style={[styles.numberBadge, { backgroundColor: theme.primary }]}>
          <Text style={styles.numberText}>{question.number}</Text>
        </View>
        <Text style={[styles.questionText, { color: theme.text }]}>{question.text}</Text>
      </View>

      <View style={styles.optionsContainer}>
        {options.map((option: any, index: number) => {
          const isSelected = value === (option.value || option.label || option);
          const optionLabel = option.label || option.text || option;
          const optionValue = option.value || option.label || option;

          return (
            <TouchableOpacity
              key={index}
              activeOpacity={0.7}
              style={[
                styles.optionItem,
                { borderColor: theme.border, backgroundColor: theme.card },
                isSelected && { borderColor: theme.primary, backgroundColor: theme.primary + '10' }
              ]}
              onPress={() => handleSelect(optionValue)}
            >
              <View style={[
                styles.radio,
                { borderColor: theme.border },
                isSelected && { borderColor: theme.primary, backgroundColor: theme.primary }
              ]}>
                {isSelected && <View style={styles.radioInner} />}
              </View>
              <Text style={[
                styles.optionText,
                { color: theme.text },
                isSelected && { color: theme.primary, fontWeight: '700' }
              ]}>
                {optionLabel}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
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
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  optionText: {
    fontSize: 15,
    flex: 1,
  },
});
