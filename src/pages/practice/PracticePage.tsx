import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  HelpCircle,
  Users,
  ChevronRight
} from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { FlashList } from '@shopify/flash-list';
import { getStyles } from './style';
import { useThemeColor } from '@/hooks/useThemeColor';
import { usePracticeSkills, useSkillPreview } from '@/hooks/usePractice';

interface PracticeSkill {
  id: string;
  _id?: string;
  skillContentId: string;
  title: string;
  skillType: string;
  numberOfVisits?: number;
}

const SKILL_CONFIG: any = {
  listening: { label: 'Listening', color: '#3b82f6', subSections: ['Section 1', 'Section 2', 'Section 3', 'Section 4'], hasFull: true },
  reading: { label: 'Reading', color: '#10b981', subSections: ['Passage 1', 'Passage 2', 'Passage 3'], hasFull: true },
  writing: { label: 'Writing', color: '#f97316', subSections: ['Task 1', 'Task 2'], hasFull: false },
  speaking: { label: 'Speaking', color: '#8b5cf6', subSections: ['Part 1', 'Part 2', 'Part 3'], hasFull: true },
};

const SKILLS = ['listening', 'reading', 'writing', 'speaking'];

// Component thẻ bài tập - Logic y hệt FE (SkillCardGroup)
const PracticeCardItem = React.memo(({ skill, activeSkill, activeMode, isExamMode, theme, styles }: any) => {
  const navigation = useNavigation<any>();
  const skillId = skill.skillContentId || skill.id || skill._id;
  const { data: enriched, isLoading } = useSkillPreview(skillId);

  const cfg = SKILL_CONFIG[activeSkill];
  const accentColor = cfg?.color || theme.primary;

  const handlePress = (unitId: string | number) => {
    navigation.navigate('PracticeTest', {
      id: skillId,
      unit: unitId,
      mode: isExamMode ? 'exam' : 'practice'
    });
  };

  // Trạng thái đang tải dữ liệu chi tiết
  if (isLoading) {
    return (
      <View style={[styles.practiceCard, { opacity: 0.6 }]}>
        <View style={[styles.cardAccent, { backgroundColor: theme.border }]} />
        <View style={styles.cardMainContent}>
          <ActivityIndicator size="small" color={accentColor} style={{ alignSelf: 'flex-start', marginBottom: 10 }} />
          <View style={{ height: 16, backgroundColor: theme.backgroundAlt, borderRadius: 4, width: '80%' }} />
        </View>
      </View>
    );
  }

  if (!enriched) return null;

  // Lọc cards giống hệt logic FE
  const units = enriched.units || [];
  const cardData = activeMode === 'full'
    ? {
      id: 'full',
      title: enriched.source || skill.title,
      questions: units.flatMap((u: any) => u.questionBlocks?.flatMap((b: any) => b.questions || []) || []).length,
      isFull: true
    }
    : units.filter((u: any) => String(u.id) === activeMode).map((u: any) => ({
      id: u.id,
      title: u.title,
      questions: u.questionBlocks?.flatMap((b: any) => b.questions || [])?.length || 0,
      isFull: false
    }))[0]; // Mobile chỉ hiển thị 1 unit tại 1 thời điểm theo filter

  if (!cardData) return null;

  return (
    <TouchableOpacity
      style={styles.practiceCard}
      activeOpacity={0.7}
      onPress={() => handlePress(cardData.id)}
    >
      <View style={[styles.cardAccent, { backgroundColor: accentColor }]} />

      <View style={styles.cardMainContent}>
        <View style={styles.cardTopRow}>
          <View style={styles.badge}>
            <Text style={[styles.badgeText, { color: accentColor }]}>
              {cardData.isFull ? 'FULL TEST' : 'NEW'}
            </Text>
          </View>
        </View>

        <Text style={styles.cardTitle} numberOfLines={2}>
          {cardData.title}
        </Text>

        <View style={styles.cardStats}>
          <View style={styles.statItem}>
            <HelpCircle size={14} color={theme.textSecondary} />
            <Text style={styles.statText}>{cardData.questions} Ques</Text>
          </View>
          <View style={styles.statItem}>
            <Users size={14} color={theme.textSecondary} />
            <Text style={styles.statText}>{skill.numberOfVisits || 0} Users</Text>
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
  const [activeMode, setActiveMode] = useState('full');
  const [isExamMode, setIsExamMode] = useState(false);

  const { data: rawSkills = [], isLoading } = usePracticeSkills();

  const filteredSkills = useMemo(() => {
    return (rawSkills as PracticeSkill[]).filter(
      (s) => s.skillType.toLowerCase() === activeSkill
    );
  }, [rawSkills, activeSkill]);

  const renderItem = useCallback(({ item }: { item: PracticeSkill }) => (
    <PracticeCardItem
      skill={item}
      activeSkill={activeSkill}
      activeMode={activeMode}
      isExamMode={isExamMode}
      theme={theme}
      styles={styles}
    />
  ), [activeSkill, activeMode, isExamMode, theme, styles]);

  const ListHeader = useMemo(() => (
    <View>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{t('navigation.practice')}</Text>
          <Text style={styles.subtitle}>Cải thiện kỹ năng IELTS của bạn</Text>
        </View>
        
        {/* Toggle Mode Thi/Luyện tập */}
        <TouchableOpacity 
          style={[
            { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.backgroundAlt, padding: 4, borderRadius: 12, borderWidth: 1, borderColor: theme.border },
            isExamMode && { borderColor: '#ef4444' }
          ]}
          onPress={() => setIsExamMode(!isExamMode)}
        >
          <View style={[
            { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
            !isExamMode && { backgroundColor: theme.primary }
          ]}>
            <Text style={{ fontSize: 11, fontWeight: '700', color: !isExamMode ? '#fff' : theme.textSecondary }}>PRACTICE</Text>
          </View>
          <View style={[
            { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
            isExamMode && { backgroundColor: '#ef4444' }
          ]}>
            <Text style={{ fontSize: 11, fontWeight: '700', color: isExamMode ? '#fff' : theme.textSecondary }}>REAL EXAM</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={[styles.skillTabsContainer, { paddingBottom: 0 }]}>
        <View style={styles.skillTabs}>
          {SKILLS.map((s) => (
            <TouchableOpacity
              key={s}
              style={[
                styles.skillTab,
                activeSkill === s && styles.skillTabActive,
              ]}
              onPress={() => {
                setActiveSkill(s);
                setActiveMode(SKILL_CONFIG[s].hasFull ? 'full' : '1');
              }}
            >
              <Text style={[
                styles.skillTabText,
                activeSkill === s && styles.skillTabTextActive,
              ]}>
                {SKILL_CONFIG[s].label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={{ paddingVertical: 16 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, gap: 8 }}>
          {SKILL_CONFIG[activeSkill].hasFull && (
            <TouchableOpacity
              onPress={() => setActiveMode('full')}
              style={[
                { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: theme.border },
                activeMode === 'full' && { backgroundColor: theme.primary, borderColor: theme.primary }
              ]}
            >
              <Text style={{ fontSize: 13, fontWeight: '600', color: activeMode === 'full' ? '#fff' : theme.textSecondary }}>
                Full Test
              </Text>
            </TouchableOpacity>
          )}

          {SKILL_CONFIG[activeSkill].subSections.map((label: string, i: number) => (
            <TouchableOpacity
              key={label}
              onPress={() => setActiveMode(String(i + 1))}
              style={[
                { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: theme.border },
                activeMode === String(i + 1) && { backgroundColor: theme.primary, borderColor: theme.primary }
              ]}
            >
              <Text style={{ fontSize: 13, fontWeight: '600', color: activeMode === String(i + 1) ? '#fff' : theme.textSecondary }}>
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  ), [activeSkill, activeMode, theme, styles, t]);

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
            keyExtractor={(item: PracticeSkill) => item.skillContentId || item.id || item._id}
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
