import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
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
  Languages,
  Sparkles,
  ArrowRight
} from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { getStyles } from './style';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useAuthStore } from '@/services/auth/auth.store';
import { useThemeStore } from '@/services/theme/theme.store';

const TOOLS = [
  { id: 'speaking', icon: <Mic size={24} color="#8b5cf6" />, title: "AI Speaking Coach", color: "#8b5cf6", desc: "Luyện nói 1:1 với AI examiner, nhận phản hồi phát âm, từ vựng và ngữ pháp IELTS." },
  { id: 'vocab', icon: <BookOpen size={24} color="#10b981" />, title: "Vocab Lab", color: "#10b981", desc: "Học từ vựng theo chủ đề qua Flashcards thông minh & lưu từ vựng vào Sổ tay." },
  { id: 'grammar', icon: <PenLine size={24} color="#3b82f6" />, title: "Grammar Lab", color: "#3b82f6", desc: "Chinh phục 12 thì tiếng Anh, cấu trúc câu & phân tích lỗi sai ngữ pháp chi tiết." },
  { id: 'writing', icon: <PenLine size={24} color="#f97316" />, title: "AI Writing Coach", color: "#f97316", desc: "Chấm điểm và sửa lỗi Essay Task 1 & 2 chi tiết từng câu (Sắp ra mắt)." },
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
  const navigation = useNavigation<any>();

  const toggleTheme = () => {
    setMode(mode === 'light' ? 'dark' : 'light');
  };

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'vi' ? 'en' : 'vi';
    i18n.changeLanguage(nextLang);
  };

  const handleToolPress = (toolId: string) => {
    if (toolId === 'speaking') {
      navigation.navigate('CallWithAi');
    } else if (toolId === 'vocab') {
      navigation.navigate('Practice', { activeTopTab: 'material', activeMaterialTab: 'vocab' });
    } else if (toolId === 'grammar') {
      navigation.navigate('Practice', { activeTopTab: 'material', activeMaterialTab: 'grammar' });
    } else if (toolId === 'upgrade') {
      navigation.navigate('Upgrade');
    }
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

        {/* Premium Upgrade Banner */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => handleToolPress('upgrade')}
          style={{
            marginHorizontal: 20,
            marginBottom: 24,
            padding: 20,
            borderRadius: 20,
            backgroundColor: theme.backgroundAlt,
            borderWidth: 1,
            borderColor: theme.warning + '30',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            shadowColor: theme.warning,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 4,
          }}
        >
          <View style={{ flex: 1, marginRight: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
              <Sparkles size={16} color={theme.warning} style={{ marginRight: 6 }} />
              <Text style={{ fontSize: 12, fontWeight: '800', color: theme.warning, letterSpacing: 1 }}>
                MỞ KHÓA BẢN PREMIUM
              </Text>
            </View>
            <Text style={{ fontSize: 16, fontWeight: '700', color: theme.text, marginBottom: 4 }}>
              Trải nghiệm AI speaking & tài liệu nâng cao
            </Text>
            <Text style={{ fontSize: 12, color: theme.textSecondary }}>
              Luyện nói không giới hạn và nhận phản hồi chấm điểm IELTS chuyên sâu.
            </Text>
          </View>
          <View style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: theme.warning + '15',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ArrowRight size={20} color={theme.warning} />
          </View>
        </TouchableOpacity>

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
              <TouchableOpacity
                key={t.id}
                style={styles.toolCard}
                activeOpacity={0.7}
                onPress={() => handleToolPress(t.id)}
              >
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
            onPress={() => navigation.navigate('Roadmap')}
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
