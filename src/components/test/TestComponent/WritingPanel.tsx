import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

interface Visual {
  type: string;
  label: string;
}

interface WritingTask {
  task?: number;
  min_words?: number;
  time_minutes?: number;
  instruction?: string;
  prompt?: string;
  visual_description?: string;
  visuals?: Visual[];
  note?: string;
}

interface Props {
  content: WritingTask;
  taskNumber?: number;
}

export default function WritingPanel({ content, taskNumber }: Props) {
  const theme = useThemeColor();

  const task = taskNumber ?? content.task ?? 1;
  const minWords = content.min_words ?? (task === 1 ? 150 : 250);
  const timeMinutes = content.time_minutes ?? (task === 1 ? 20 : 40);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {/* Task Badge */}
      <View style={[styles.taskBadge, { backgroundColor: theme.primary + '15' }]}>
        <Text style={[styles.taskBadgeText, { color: theme.primary }]}>
          ✍️ Writing Task {task}
        </Text>
      </View>

      {/* Info Row (Time & Min Words) */}
      <View style={styles.infoRow}>
        <View style={[styles.infoChip, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.chipLabel, { color: theme.textSecondary }]}>Time</Text>
          <Text style={[styles.chipValue, { color: theme.text }]}>{timeMinutes}</Text>
          <Text style={[styles.chipUnit, { color: theme.textSecondary }]}>minutes</Text>
        </View>
        <View style={[styles.infoChip, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.chipLabel, { color: theme.textSecondary }]}>Min Words</Text>
          <Text style={[styles.chipValue, { color: theme.text }]}>{minWords}</Text>
          <Text style={[styles.chipUnit, { color: theme.textSecondary }]}>words</Text>
        </View>
      </View>

      {/* Instruction Card */}
      {content.instruction ? (
        <View style={[styles.instructionCard, { backgroundColor: theme.backgroundAlt, borderColor: theme.border }]}>
          <Text style={styles.instructionIcon}>💡</Text>
          <Text style={[styles.instructionText, { color: theme.text }]}>{content.instruction}</Text>
        </View>
      ) : null}

      {/* Prompt Card */}
      {content.prompt ? (
        <View style={[styles.promptCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>
            {task === 1 ? 'Task Description' : 'Essay Question'}
          </Text>
          <Text style={[styles.promptText, { color: theme.text }]}>{content.prompt}</Text>
        </View>
      ) : null}

      {/* Task 1: Chart description & Visuals */}
      {task === 1 && (content.visual_description || (content.visuals && content.visuals.length > 0)) ? (
        <View style={[styles.visualCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Charts & Visuals</Text>
          {content.visual_description ? (
            <Text style={[styles.visualDesc, { color: theme.textSecondary }]}>
              {content.visual_description}
            </Text>
          ) : null}
          {content.visuals && content.visuals.length > 0 ? (
            <View style={styles.visualList}>
              {content.visuals.map((v, i) => (
                <View key={i} style={styles.visualListItem}>
                  <View style={[styles.visualBadge, { backgroundColor: theme.primary + '10' }]}>
                    <Text style={[styles.visualBadgeText, { color: theme.primary }]}>
                      {v.type.replace(/_/g, ' ')}
                    </Text>
                  </View>
                  <Text style={[styles.visualLabel, { color: theme.text }]}>{v.label}</Text>
                </View>
              ))}
            </View>
          ) : null}
        </View>
      ) : null}

      {/* Task 2: Notes */}
      {task === 2 && content.note ? (
        <View style={[styles.instructionCard, { backgroundColor: theme.backgroundAlt, borderColor: theme.border }]}>
          <Text style={styles.instructionIcon}>📝</Text>
          <Text style={[styles.instructionText, { color: theme.textSecondary }]}>{content.note}</Text>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  taskBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  taskBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  infoRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  infoChip: {
    flex: 1,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  chipLabel: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  chipValue: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 2,
  },
  chipUnit: {
    fontSize: 11,
    fontWeight: '500',
  },
  instructionCard: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
    marginBottom: 20,
  },
  instructionIcon: {
    fontSize: 18,
  },
  instructionText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  promptCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  promptText: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
  },
  visualCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 20,
  },
  visualDesc: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  visualList: {
    gap: 8,
  },
  visualListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  visualBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  visualBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  visualLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
  },
});
