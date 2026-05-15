import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import QuestionRenderer from './QuestionRenderer';
import { usePracticeStore } from '@/services/practice/practice.store';

interface Props {
  questionBlocks: any[];
  mode?: "exam" | "practice";
  isReview?: boolean;
}

export default function QuestionPanel({ questionBlocks = [], mode = "practice", isReview = false }: Props) {
  const answers = usePracticeStore(state => state.answers);
  const updateAnswer = usePracticeStore(state => state.setAnswer);

  const parseRange = (range: string) => {
    if (!range) return [];
    const parts = range.split('-').map(p => parseInt(p.trim()));
    if (parts.length === 1) return [parts[0]];
    if (parts.length === 2) {
      const result = [];
      for (let i = parts[0]; i <= parts[1]; i++) {
        result.push(i);
      }
      return result;
    }
    return [];
  };

  if (!questionBlocks.length) {
    return <Text style={styles.noQuestions}>No questions available.</Text>;
  }

  return (
    <View style={styles.container}>
      {questionBlocks.map((block: any, index: number) => {
        const questionsFromRange = !block.questions || block.questions.length === 0
          ? parseRange(block.questions_range).map(num => ({
            id: `${block.id || index}_${num}`,
            number: num,
            text: "",
          }))
          : [];

        const displayQuestions = block.questions?.length > 0 ? block.questions : questionsFromRange;

        return (
          <View key={index} style={styles.block}>
            <View style={styles.instructionContainer}>
              <Text style={styles.instructionText}>{block.instruction}</Text>
            </View>

            {displayQuestions.map((q: any) => (
              <QuestionRenderer
                key={q.id || q.number}
                question={q}
                type={block.question_type}
                value={answers[q.id || q.number]}
                onChange={updateAnswer}
                extra={block}
                isReview={isReview}
              />
            ))}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
  },
  block: {
    marginBottom: 32,
  },
  instructionContainer: {
    paddingBottom: 12,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  instructionText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
    lineHeight: 24,
  },
  noQuestions: {
    textAlign: 'center',
    marginTop: 40,
    color: '#64748b',
  },
});
