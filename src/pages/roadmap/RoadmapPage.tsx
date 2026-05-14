import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Check, Lock, Star } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { getStyles } from './style';
import { useThemeColor } from '@/hooks/useThemeColor';
import roadmapData from '@/data/roadmap/ielts_5_to_6.json';

export default function RoadmapPage() {
  const { t } = useTranslation();
  const theme = useThemeColor();
  const styles = useMemo(() => getStyles(theme), [theme]);

  // Xác định node hiện tại (node đầu tiên chưa hoàn thành)
  const firstUncompletedIndex = roadmapData.nodes.findIndex(node => !node.isCompleted);

  const renderNode = (node: any, index: number) => {
    const isCompleted = node.isCompleted;
    const isActive = index === firstUncompletedIndex;
    const isLocked = !isCompleted && !isActive;

    // Tính toán độ lệch ngang (Zigzag)
    let translateX = 0;
    const position = index % 4;
    if (position === 1) translateX = -50;
    else if (position === 3) translateX = 50;

    return (
      <View key={node.id} style={[styles.nodeContainer, { transform: [{ translateX }] }]}>
        {/* Đường nối */}
        {index < roadmapData.nodes.length - 1 && (
          <View style={[styles.line, { top: 70, height: 50 }]} />
        )}

        <TouchableOpacity 
          activeOpacity={0.8}
          disabled={isLocked}
          style={styles.nodeWrapper}
        >
          <View style={[
            styles.nodeCircle, 
            isCompleted && styles.completedNode,
            isActive && styles.activeNode,
            isLocked && styles.lockedNode
          ]}>
            <View style={[styles.nodeInner, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
              {isCompleted ? (
                <Check size={32} color="#fff" strokeWidth={3} />
              ) : isLocked ? (
                <Lock size={28} color={theme.tabIconDefault} />
              ) : (
                <Star size={32} color="#fff" fill="#fff" />
              )}
            </View>
          </View>
          <Text style={[styles.nodeLabel, isLocked && { color: theme.textSecondary }]}>
            {node.title}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={theme.text === '#ffffff' ? 'light-content' : 'dark-content'} />
      
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{roadmapData.title}</Text>
          <Text style={styles.headerSub}>{roadmapData.description}</Text>
        </View>

        {roadmapData.nodes.map((node, index) => renderNode(node, index))}
      </ScrollView>
    </SafeAreaView>
  );
}
