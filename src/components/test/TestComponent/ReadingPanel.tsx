import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

interface Props {
  passage: any;
}

export default function ReadingPanel({ passage }: Props) {
  if (!passage) return null;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title} selectable={true}>{passage.title || 'Reading Passage'}</Text>
      <Text style={styles.content} selectable={true}>{passage.content || 'No content available.'}</Text>
      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 16,
    lineHeight: 30,
  },
  content: {
    fontSize: 16,
    lineHeight: 26,
    color: '#334155',
    textAlign: 'justify',
  },
});
