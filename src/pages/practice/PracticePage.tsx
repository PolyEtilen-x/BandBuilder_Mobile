import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  HelpCircle, 
  Users,
  ChevronRight
} from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { FlashList } from '@shopify/flash-list';
import { getStyles } from './style';
import { useThemeColor } from '@/hooks/useThemeColor';
import { usePracticeSkills } from '@/hooks/usePractice';

// Định nghĩa Interface chuẩn Senior
interface PracticeSkill {
  id: string;
  _id?: string;
  title: string;
  skillType: string;
  numberOfVisits?: number;
  questions?: number;
  progress?: number;
}

const SKILLS = [
  { id: 'listening', label: 'Nghe', color: '#3b82f6' },
  { id: 'reading', label: 'Đọc', color: '#10b981' },
  { id: 'writing', label: 'Viết', color: '#f97316' },
  { id: 'speaking', label: 'Nói', color: '#8b5cf6' },
];

const PracticeCardItem = React.memo(({ item, activeSkill, theme, styles }: { item: PracticeSkill, activeSkill: string, theme: any, styles: any }) => {
  const skillInfo = SKILLS.find(s => s.id === activeSkill);
  const accentColor = skillInfo?.color || theme.primary;
  const progress = item.progress || 0;

  return (
    <TouchableOpacity style={styles.practiceCard} activeOpacity={0.7}>
      {/* Thanh nhấn màu bên trái tạo vẻ cứng cáp */}
      <View style={[styles.cardAccent, { backgroundColor: accentColor }]} />
      
      <View style={styles.cardMainContent}>
        <View style={styles.cardTopRow}>
          <View style={styles.badge}>
            <Text style={[styles.badgeText, { color: accentColor }]}>
              {progress > 0 ? `${progress}% Completed` : 'New'}
            </Text>
          </View>
        </View>

        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.title}
        </Text>

        <View style={styles.cardStats}>
          <View style={styles.statItem}>
            <HelpCircle size={14} color={theme.textSecondary} />
            <Text style={styles.statText}>{item.questions || 10} Ques</Text>
          </View>
          <View style={styles.statItem}>
            <Users size={14} color={theme.textSecondary} />
            <Text style={styles.statText}>{item.numberOfVisits || 0} Users</Text>
          </View>
        </View>
      </View>

      <View style={styles.chevronContainer}>
        <ChevronRight size={20} color={theme.border} />
      </View>
    </TouchableOpacity>
  );
});

export default function PracticePage() {
  const { t } = useTranslation();
  const theme = useThemeColor();
  const styles = useMemo(() => getStyles(theme), [theme]);
  const [activeSkill, setActiveSkill] = useState('listening');

  const { data: rawSkills = [], isLoading } = usePracticeSkills();

  const filteredSkills = useMemo(() => {
    return (rawSkills as PracticeSkill[]).filter(
      (s) => s.skillType.toLowerCase() === activeSkill
    );
  }, [rawSkills, activeSkill]);

  const renderItem = useCallback(({ item }: { item: PracticeSkill }) => (
    <PracticeCardItem 
      item={item} 
      activeSkill={activeSkill} 
      theme={theme} 
      styles={styles} 
    />
  ), [activeSkill, theme, styles]);

  // Header với thanh Segmented Control sang trọng
  const ListHeader = useMemo(() => (
    <View>
      <View style={styles.header}>
        <Text style={styles.title}>{t('navigation.practice')}</Text>
      </View>
      
      <View style={styles.skillTabsContainer}>
        <View style={styles.skillTabs}>
          {SKILLS.map((skill) => (
            <TouchableOpacity
              key={skill.id}
              style={[
                styles.skillTab,
                activeSkill === skill.id && styles.skillTabActive,
              ]}
              onPress={() => setActiveSkill(skill.id)}
            >
              <Text style={[
                styles.skillTabText,
                activeSkill === skill.id && styles.skillTabTextActive,
              ]}>
                {skill.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  ), [activeSkill, theme, styles, t]);

  const OptimizedList = FlashList as any;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={theme.text === '#ffffff' ? 'light-content' : 'dark-content'} />
      
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <OptimizedList
            data={filteredSkills}
            renderItem={renderItem}
            keyExtractor={(item: PracticeSkill) => item.id || item._id || Math.random().toString()}
            ListHeaderComponent={ListHeader}
            contentContainerStyle={styles.listContent}
            estimatedItemSize={120}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No practice sessions found.</Text>
              </View>
            }
          />
        </View>
      )}
    </SafeAreaView>
  );
}
