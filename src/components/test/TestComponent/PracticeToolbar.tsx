import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Highlighter, StickyNote, Book } from 'lucide-react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

export type ToolType = 'highlight' | 'note' | 'dict';

interface Props {
  activeTool: ToolType;
  setActiveTool: (tool: ToolType) => void;
}

export default function PracticeToolbar({ activeTool, setActiveTool }: Props) {
  const theme = useThemeColor();

  const tools = [
    { id: 'highlight', label: 'Highlight', icon: Highlighter },
    { id: 'note', label: 'Notes', icon: StickyNote },
    { id: 'dict', label: 'Dict', icon: Book },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <Text style={styles.title}>TOOLS</Text>
      <View style={styles.toolsWrapper}>
        {tools.map((tool) => {
          const isActive = activeTool === tool.id;
          const Icon = tool.icon;
          return (
            <TouchableOpacity
              key={tool.id}
              activeOpacity={0.7}
              style={[
                styles.toolBtn,
                isActive && { backgroundColor: theme.primary + '15', borderColor: theme.primary }
              ]}
              onPress={() => setActiveTool(tool.id as ToolType)}
            >
              <Icon size={16} color={isActive ? theme.primary : theme.textSecondary} />
              <Text style={[
                styles.toolLabel,
                { color: isActive ? theme.primary : theme.textSecondary }
              ]}>
                {tool.label}
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 10,
    fontWeight: '900',
    color: '#64748b',
    marginRight: 16,
    letterSpacing: 1,
  },
  toolsWrapper: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
  },
  toolBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
    gap: 6,
  },
  toolLabel: {
    fontSize: 11,
    fontWeight: '700',
  },
});
