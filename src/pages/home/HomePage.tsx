import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  User,
  ChevronRight,
  BookOpen,
  Headphones,
  PenLine,
  Mic,
  Zap,
  Flame,
  Sun,
  Moon,
  Languages
} from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { getStyles } from './style';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useAuthStore } from '@/services/auth/auth.store';
import { useThemeStore } from '@/services/theme/theme.store';

const TOOLS = [
  { id: '1', icon: <PenLine size={24} color="#f97316" />, title: "AI Writing Coach", color: "#f97316", desc: "Chấm điểm và sửa lỗi Essay Task 1 & 2 chi tiết từng câu." },
  { id: '2', icon: <Mic size={24} color="#8b5cf6" />, title: "Speaking Simulator", color: "#8b5cf6", desc: "Luyện nói với AI examiner, nhận phản hồi về phát âm và độ trôi chảy." },
  { id: '3', icon: <BookOpen size={24} color="#10b981" />, title: "Reading Lab", color: "#10b981", desc: "Hơn 200 bài đọc học thuật kèm giải thích đáp án chi tiết." },
  { id: '4', icon: <Headphones size={24} color="#3b82f6" />, title: "Listening Practice", color: "#3b82f6", desc: "Luyện nghe với audio chuẩn IELTS và phân tích lỗi sai." },
];

const STATS = [
  { label: 'Target', value: '7.5' },
  { label: 'Current', value: '6.0' },
  { label: 'Days left', value: '45' },
];

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const theme = useThemeColor();
  const styles = useMemo(() => getStyles(theme), [theme]);
  const { isAuthenticated, user } = useAuthStore();
  const { mode, setMode } = useThemeStore();

  const toggleTheme = () => {
    setMode(mode === 'light' ? 'dark' : 'light');
  };

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'vi' ? 'en' : 'vi';
    i18n.changeLanguage(nextLang);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={theme.text === '#ffffff' ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <User size={20} color={theme.textSecondary} />
          </View>
          <View>
            <Text style={styles.userWelcome}>{t('common.welcome')}</Text>
            <Text style={styles.userName}>
              {isAuthenticated ? user?.email : t('common.user')}
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 12 }}>
          <TouchableOpacity onPress={toggleTheme} style={styles.avatar}>
            {mode === 'dark' ? (
              <Sun size={20} color={theme.warning} />
            ) : (
              <Moon size={20} color={theme.primary} />
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleLanguage} style={styles.avatar}>
            <Languages size={20} color={theme.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Hero Card */}
        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>{t('home.hero_title')}</Text>
          <Text style={styles.heroSub}>{t('home.hero_sub')}</Text>

          <View style={styles.heroStats}>
            {STATS.map((s, i) => (
              <View key={i} style={styles.heroStatItem}>
                <Text style={styles.heroStatValue}>{s.value}</Text>
                <Text style={styles.heroStatLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Flame size={20} color="#f97316" />
            <Text style={styles.statBoxValue}>12</Text>
            <Text style={styles.statBoxLabel}>{t('home.streak')}</Text>
          </View>
          <View style={styles.statBox}>
            <Zap size={20} color="#f59e0b" />
            <Text style={styles.statBoxValue}>850</Text>
            <Text style={styles.statBoxLabel}>{t('home.xp')}</Text>
          </View>
        </View>

        {/* Tools Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('home.tools')}</Text>
            <TouchableOpacity>
              <Text style={styles.sectionLink}>{t('common.all')}</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 20 }}
          >
            {TOOLS.map((t) => (
              <TouchableOpacity key={t.id} style={styles.toolCard}>
                <View style={[styles.toolIconWrap, { backgroundColor: t.color + '15' }]}>
                  {t.icon}
                </View>
                <Text style={styles.toolTitle}>{t.title}</Text>
                <Text style={styles.toolDesc}>{t.desc}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Next Lesson / Roadmap Preview */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('home.next_lesson')}</Text>
            <TouchableOpacity>
              <ChevronRight size={24} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.toolCard, { width: '90%', marginLeft: 20, flexDirection: 'row', alignItems: 'center' }]}
          >
            <View style={[styles.toolIconWrap, { marginBottom: 0, marginRight: 16, backgroundColor: theme.primary + '15' }]}>
              <BookOpen size={24} color={theme.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.toolTitle}>Reading: Multiple Choice</Text>
              <Text style={styles.toolDesc}>Bài 5: Phân tích các bẫy thường gặp</Text>
            </View>
            <ChevronRight size={20} color={theme.border} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
