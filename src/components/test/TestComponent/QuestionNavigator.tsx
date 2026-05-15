import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { usePracticeStore } from '@/services/practice/practice.store';

interface Props {
  questionBlocks: any[];
}

export default function QuestionNavigator({ questionBlocks = [] }: Props) {
  const answers = usePracticeStore(state => state.answers);

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

  const allQuestions = questionBlocks.flatMap(block => {
    if (block.questions?.length > 0) {
      return block.questions.map((q: any) => ({ id: q.id || q.number, number: q.number }));
    }
    return parseRange(block.questions_range).map(num => ({ id: num, number: num }));
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Question Map</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {allQuestions.map((q) => {
          const isAnswered = !!answers[q.id];
          return (
            <TouchableOpacity 
              key={q.number} 
              style={[
                styles.item, 
                isAnswered && styles.itemAnswered
              ]}
            >
              <Text style={[
                styles.itemText,
                isAnswered && styles.itemTextAnswered
              ]}>{q.number}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  title: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
    marginLeft: 16,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  scroll: {
    paddingHorizontal: 12,
  },
  item: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    backgroundColor: '#fff',
  },
  itemAnswered: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  itemText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  itemTextAnswered: {
    color: '#fff',
  },
});
