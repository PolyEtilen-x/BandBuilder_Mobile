import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

interface Props {
  question: any;
  effects: string[];
  value: any;
  onChange: (id: string, value: any) => void;
  isReview?: boolean;
}

export default function MatchingCauseEffectQuestion({
  question,
  effects = [],
  value,
  onChange,
  isReview = false
}: Props) {
  const theme = useThemeColor();
  const [modalVisible, setModalVisible] = useState(false);

  const correctAnswer = question.correct_answer?.toString();
  const isCorrect = value?.toString() === correctAnswer;

  const handleSelect = (option: string) => {
    onChange(question.id || String(question.number || question.question_number), option);
    setModalVisible(false);
  };

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

  return (
    <View style={styles.container}>
      <View style={[
        styles.card,
        {
          borderColor: getBorderColor(),
          backgroundColor: getBackgroundColor()
        }
      ]}>
        <View style={styles.row}>
          <View style={styles.leftContent}>
            <View style={[styles.numberBadge, { backgroundColor: theme.primary }]}>
              <Text style={styles.numberText}>{question.number || question.question_number}</Text>
            </View>
            <Text style={[styles.questionText, { color: theme.text }]}>
              {question.cause || question.text || "Choose the correct effect"}
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            disabled={isReview}
            onPress={() => setModalVisible(true)}
            style={[
              styles.pickerButton,
              {
                borderColor: isReview ? (isCorrect ? theme.success : theme.error) : theme.border,
                backgroundColor: theme.card
              }
            ]}
          >
            <Text style={[
              styles.pickerButtonText,
              {
                color: isReview
                  ? (isCorrect ? theme.success : theme.error)
                  : (value ? theme.text : theme.textSecondary)
              }
            ]} numberOfLines={1}>
              {value || 'Select effect...'}
            </Text>
          </TouchableOpacity>
        </View>

        {isReview && !isCorrect && (
          <View style={styles.answerRow}>
            <Text style={[styles.answerText, { color: theme.success }]}>
              Correct Answer: {correctAnswer}
            </Text>
          </View>
        )}
      </View>

      {isReview && question.explanation && (
        <View style={[styles.explanationBox, { borderLeftColor: theme.primary, backgroundColor: theme.backgroundAlt }]}>
          <Text style={[styles.explanationTitle, { color: theme.primary }]}>EXPLANATION:</Text>
          <Text style={[styles.explanationText, { color: theme.textSecondary }]}>{question.explanation}</Text>
        </View>
      )}

      {/* EFFECTS SELECT MODAL */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Select Corresponding Effect</Text>
            <ScrollView style={styles.optionsScroll} showsVerticalScrollIndicator={false}>
              {effects.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.optionRow,
                    { borderBottomColor: theme.border },
                    value === option && { backgroundColor: theme.primary + '10' }
                  ]}
                  onPress={() => handleSelect(option)}
                >
                  <Text style={[
                    styles.optionText,
                    { color: theme.text },
                    value === option && { color: theme.primary, fontWeight: '700' }
                  ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: theme.border }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={[styles.closeButtonText, { color: theme.text }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 12,
  },
  numberBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  numberText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
  },
  questionText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
  pickerButton: {
    minWidth: 120,
    maxWidth: 160,
    height: 38,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  pickerButtonText: {
    fontSize: 13,
    fontWeight: '700',
  },
  answerRow: {
    marginTop: 8,
    paddingLeft: 34,
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
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    maxHeight: '70%',
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 16,
    textAlign: 'center',
  },
  optionsScroll: {
    marginBottom: 16,
  },
  optionRow: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  optionText: {
    fontSize: 15,
  },
  closeButton: {
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
