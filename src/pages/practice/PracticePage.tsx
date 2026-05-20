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
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  HelpCircle,
  Users,
  ChevronRight,
  Mic,
  Sparkles,
  BookOpen,
  BrainCircuit
} from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { FlashList } from '@shopify/flash-list';
import { getStyles } from './style';
import { useThemeColor } from '@/hooks/useThemeColor';
import { usePracticeSkills, useSkillPreview } from '@/hooks/usePractice';
import VocabPage from '@/pages/materials/vocab/VocabPage';
import GrammarPage from '@/pages/materials/grammar/GrammarPage';

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
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const [activeTopTab, setActiveTopTab] = useState<'practice' | 'material'>('practice');
  const [activeMaterialTab, setActiveMaterialTab] = useState<'vocab' | 'grammar'>('vocab');

  React.useEffect(() => {
    if (route.params?.activeTopTab) {
      setActiveTopTab(route.params.activeTopTab);
    }
    if (route.params?.activeMaterialTab) {
      setActiveMaterialTab(route.params.activeMaterialTab);
    }
  }, [route.params]);
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
      {/* Compact Mode Switch Row */}
      <View style={{ 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        paddingHorizontal: 24, 
        paddingTop: 8,
        paddingBottom: 16 
      }}>
        <Text style={{ fontSize: 15, fontWeight: '800', color: theme.text, letterSpacing: -0.2 }}>
          {isExamMode ? t('practice.real_exam_mode') : t('practice.practice_mode')}
        </Text>
        
        <TouchableOpacity 
          activeOpacity={0.9}
          style={[
            { 
              flexDirection: 'row', 
              alignItems: 'center', 
              backgroundColor: theme.backgroundAlt, 
              padding: 2, 
              borderRadius: 10, 
              borderWidth: 1, 
              borderColor: theme.border 
            },
            isExamMode && { borderColor: '#ef4444' }
          ]}
          onPress={() => setIsExamMode(!isExamMode)}
        >
          <View style={[
            { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
            !isExamMode && { backgroundColor: theme.primary }
          ]}>
            <Text style={{ fontSize: 10, fontWeight: '800', color: !isExamMode ? '#fff' : theme.textSecondary }}>{t('practice.practice_toggle')}</Text>
          </View>
          <View style={[
            { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
            isExamMode && { backgroundColor: '#ef4444' }
          ]}>
            <Text style={{ fontSize: 10, fontWeight: '800', color: isExamMode ? '#fff' : theme.textSecondary }}>{t('practice.real_exam_toggle')}</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* IELTS 4-skills tabs */}
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

      {/* AI Speaking Coach Premium banner inside Speaking Skill tab */}
      {activeSkill === 'speaking' && (
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.navigate('CallWithAi')}
          style={{
            marginHorizontal: 24,
            marginTop: 16,
            marginBottom: 8,
            padding: 20,
            borderRadius: 20,
            backgroundColor: theme.backgroundAlt,
            borderWidth: 1.5,
            borderColor: '#8b5cf650',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            shadowColor: '#8b5cf6',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.12,
            shadowRadius: 12,
            elevation: 4,
          }}
        >
          <View style={{ flex: 1, marginRight: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
              <Sparkles size={14} color="#8b5cf6" style={{ marginRight: 6 }} />
              <Text style={{ fontSize: 10, fontWeight: '800', color: '#8b5cf6', letterSpacing: 1 }}>
                {t('practice.ai_coach')}
              </Text>
            </View>
            <Text style={{ fontSize: 16, fontWeight: '700', color: theme.text, marginBottom: 4 }}>
              {t('practice.ai_coach_title')}
            </Text>
            <Text style={{ fontSize: 12, color: theme.textSecondary }}>
              {t('practice.ai_coach_desc')}
            </Text>
          </View>
          <View style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: '#8b5cf615',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Mic size={20} color="#8b5cf6" />
          </View>
        </TouchableOpacity>
      )}

      {/* Subsections Filters ScrollView */}
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
  ), [activeSkill, activeMode, isExamMode, theme, styles, navigation]);

  const OptimizedList = FlashList as any;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle={theme.text === '#ffffff' ? 'light-content' : 'dark-content'} />

      {/* Header title */}
      <View style={styles.header}>
        <Text style={styles.title}>{t('navigation.practice')}</Text>
        <Text style={styles.subtitle}>{t('practice.subtitle')}</Text>
      </View>

      {/* Top Segmented Tabs: Practice vs Material */}
      <View style={styles.topTabs}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.topTab, activeTopTab === 'practice' && styles.topTabActive]}
          onPress={() => setActiveTopTab('practice')}
        >
          <Text style={[styles.topTabText, activeTopTab === 'practice' && styles.topTabTextActive]}>
            {t('practice.practice_toggle')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.topTab, activeTopTab === 'material' && styles.topTabActive]}
          onPress={() => setActiveTopTab('material')}
        >
          <Text style={[styles.topTabText, activeTopTab === 'material' && styles.topTabTextActive]}>
            {t('practice.material_toggle')}
          </Text>
        </TouchableOpacity>
      </View>

      {activeTopTab === 'practice' ? (
        isLoading ? (
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
                  <Text style={styles.emptyText}>{t('practice.no_sessions')}</Text>
                </View>
              }
            />
          </View>
        )
      ) : (
        /* Material Mode with Inline Subcomponents */
        <View style={{ flex: 1 }}>
          {/* Sub-tab segmented bar for Vocab Lab vs Grammar Lab */}
          <View style={[styles.topTabs, { marginTop: 0, marginBottom: 12 }]}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.topTab, activeMaterialTab === 'vocab' && styles.topTabActive]}
              onPress={() => setActiveMaterialTab('vocab')}
            >
              <Text style={[styles.topTabText, activeMaterialTab === 'vocab' && styles.topTabTextActive, { fontSize: 12 }]}>
                VOCAB LAB
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.topTab, activeMaterialTab === 'grammar' && styles.topTabActive]}
              onPress={() => setActiveMaterialTab('grammar')}
            >
              <Text style={[styles.topTabText, activeMaterialTab === 'grammar' && styles.topTabTextActive, { fontSize: 12 }]}>
                GRAMMAR LAB
              </Text>
            </TouchableOpacity>
          </View>

          {/* Render inline Vocab/Grammar tab components directly */}
          <View style={{ flex: 1 }}>
            {activeMaterialTab === 'vocab' ? (
              <VocabPage isTab={true} />
            ) : (
              <GrammarPage isTab={true} />
            )}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
