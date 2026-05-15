import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

interface Props {
  question: any;
  value: any;
  onChange: (id: string, value: any) => void;
  isReview?: boolean;
}

export default function FillBlankQuestion({ question, value, onChange, isReview }: Props) {
  const theme = useThemeColor();

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={[styles.numberBadge, { backgroundColor: theme.primary }]}>
          <Text style={styles.numberText}>{question.number}</Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.input,
              { color: theme.text, backgroundColor: theme.card, borderColor: theme.border },
              value && { borderColor: theme.primary }
            ]}
            value={value || ''}
            onChangeText={(text) => !isReview && onChange(question.id || String(question.number), text)}
            placeholder="Type your answer..."
            placeholderTextColor={theme.textSecondary}
            editable={!isReview}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      </View>
      {question.text ? (
         <Text style={[styles.helperText, { color: theme.textSecondary }]}>{question.text}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
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
  helperText: {
    fontSize: 14,
    marginTop: 8,
    marginLeft: 36,
    lineHeight: 20,
  },
});
