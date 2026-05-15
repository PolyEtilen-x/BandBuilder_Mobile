import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

interface Props {
  question: any;
  value: any;
  onChange: (id: string, value: any) => void;
  type: string;
  isReview?: boolean;
}

export default function TFQuestion({ question, value, onChange, type, isReview }: Props) {
  const theme = useThemeColor();
  const options = type === 'yes_no_not_given' 
    ? ['YES', 'NO', 'NOT GIVEN'] 
    : ['TRUE', 'FALSE', 'NOT GIVEN'];

  const handleSelect = (option: string) => {
    if (isReview) return;
    onChange(question.id || String(question.number), option);
  };

  return (
    <View style={styles.container}>
      <View style={styles.questionHeader}>
        <View style={[styles.numberBadge, { backgroundColor: theme.primary }]}>
          <Text style={styles.numberText}>{question.number}</Text>
        </View>
        <Text style={[styles.questionText, { color: theme.text }]}>{question.text}</Text>
      </View>

      <View style={styles.optionsGrid}>
        {options.map((option) => {
          const isSelected = value === option;
          return (
            <TouchableOpacity
              key={option}
              activeOpacity={0.7}
              style={[
                styles.optionButton,
                { borderColor: theme.border, backgroundColor: theme.card },
                isSelected && { borderColor: theme.primary, backgroundColor: theme.primary + '10' }
              ]}
              onPress={() => handleSelect(option)}
            >
              <Text style={[
                styles.optionText,
                { color: theme.textSecondary },
                isSelected && { color: theme.primary, fontWeight: '800' }
              ]}>
                {option}
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
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '600',
  },
  optionsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  optionButton: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
