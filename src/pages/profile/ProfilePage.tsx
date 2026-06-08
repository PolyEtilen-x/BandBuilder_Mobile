import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  User,
  Settings,
  Globe,
  Moon,
  Sun,
  ShieldCheck,
  LogOut,
  ChevronRight,
  Target,
  Award,
  Zap,
  Sparkles
} from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { getStyles } from './style';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useAuthStore } from '@/services/auth/auth.store';
import { useThemeStore } from '@/services/theme/theme.store';
import { loginWithGoogle } from '@/services/auth/SignUpWithGoogle';
import roadmapData from '@/data/roadmap/ielts_5_to_6.json';
import { useQuery } from '@tanstack/react-query';
import { userApi } from '@/api/user.api';
import { UserProfileDTO } from '@/data/user/user.types';
import { useNavigation } from '@react-navigation/native';

export default function ProfilePage() {
  const { t, i18n } = useTranslation();
  const theme = useThemeColor();
  const styles = useMemo(() => getStyles(theme), [theme]);
  const navigation = useNavigation<any>();

  const { user, isAuthenticated, logout } = useAuthStore();
  const { mode, setMode } = useThemeStore();

  // Gọi API lấy thông tin Profile thật từ server
  const { data: profile, isLoading: profileLoading } = useQuery<UserProfileDTO>({
    queryKey: ['user-profile'],
    queryFn: () => userApi.getProfile().then(res => res.data),
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
  });

  // Đăng xuất với hộp thoại xác nhận chuyên nghiệp
  const handleLogout = () => {
    Alert.alert(
      t('profile.alert_title'),
      t('profile.alert_desc'),
      [
        { text: t('profile.cancel'), style: "cancel" },
        { text: t('profile.logout_btn'), style: "destructive", onPress: async () => await logout() }
      ]
    );
  };

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'vi' ? 'en' : 'vi';
    i18n.changeLanguage(nextLang);
  };

  const toggleTheme = () => {
    setMode(mode === 'light' ? 'dark' : 'light');
  };

  // Tính toán các chỉ số động từ dữ liệu lộ trình thực tế hoặc API
  const totalStages = roadmapData.nodes.length;
  const completedStages = roadmapData.nodes.filter(n => n.isCompleted).length;

  const statsData = useMemo(() => {
    if (profile) {
      return {
        avgBandScore: profile.stats.avgBandScore != null ? profile.stats.avgBandScore.toFixed(1) : (roadmapData.targetLevel || "6.0"),
        studyStreak: profile.stats.studyStreak || 0,
        testsCompleted: profile.stats.testsCompleted || completedStages,
        credits: profile.user.totalCredits - profile.user.usedCredits,
      };
    }
    return {
      avgBandScore: roadmapData.targetLevel || "6.0",
      studyStreak: completedStages > 0 ? completedStages * 3 + 1 : 0,
      testsCompleted: completedStages,
      credits: 0,
    };
  }, [profile, completedStages]);

  const displayUser = profile?.user || user;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle={theme.text === '#ffffff' ? 'light-content' : 'dark-content'} />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* TRẠNG THÁI CHƯA ĐĂNG NHẬP */}
        {!isAuthenticated ? (
          <View style={styles.loginCard}>
            <View style={styles.loginIconContainer}>
              <User size={32} color={theme.primary} />
            </View>
            <Text style={styles.loginTitle}>{t('profile.login_title')}</Text>
            <Text style={styles.loginDesc}>
              {t('profile.login_desc')}
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.googleButton}
              onPress={loginWithGoogle}
            >
              <Sparkles size={18} color="#ffffff" />
              <Text style={styles.googleButtonText}>{t('profile.google_button')}</Text>
            </TouchableOpacity>
          </View>
        ) : profileLoading ? (
          <View style={{ paddingVertical: 100, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={theme.primary} />
          </View>
        ) : (
          /* TRẠNG THÁI ĐÃ ĐĂNG NHẬP THÀNH CÔNG */
          <>
            {/* Header Section */}
            <View style={styles.header}>
              <View style={styles.avatarContainer}>
                {displayUser?.avatarUrl ? (
                  <Image
                    source={{ uri: displayUser.avatarUrl }}
                    style={styles.avatarImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.avatarInnerContainer}>
                    <Text style={styles.avatarText}>
                      {(displayUser?.fullName || displayUser?.email || "G").charAt(0).toUpperCase()}
                    </Text>
                  </View>
                )}
              </View>
              <Text style={styles.userName}>
                {displayUser?.fullName || displayUser?.email?.split('@')[0] || 'User'}
              </Text>
              <Text style={styles.userEmail}>{displayUser?.email || 'user@bandbuilder.io'}</Text>

              <View style={styles.proBadge}>
                <Text style={styles.proBadgeText}>{t('profile.premium_member')}</Text>
              </View>

              {/* Credits Row */}
              <View style={styles.creditsRow}>
                <Sparkles size={16} color="#fbbf24" fill="#fbbf24" />
                <Text style={styles.creditsText}>
                  {t('profile.credits_remaining', { credits: statsData.credits })}
                </Text>
              </View>
            </View>

            {/* Stats Section - Hiển thị chỉ số động */}
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Target size={20} color={theme.primary} style={styles.statIcon} />
                <Text style={styles.statValue}>Band {statsData.avgBandScore}</Text>
                <Text style={styles.statLabel}>{t('profile.target')}</Text>
              </View>
              <View style={styles.statCard}>
                <Zap size={20} color="#f97316" style={styles.statIcon} />
                <Text style={styles.statValue}>{statsData.studyStreak} {t('profile.days_unit')}</Text>
                <Text style={styles.statLabel}>{t('profile.streak')}</Text>
              </View>
              <View style={styles.statCard}>
                <Award size={20} color="#10b981" style={styles.statIcon} />
                <Text style={styles.statValue}>{statsData.testsCompleted}</Text>
                <Text style={styles.statLabel}>{t('profile.completed')}</Text>
              </View>
            </View>

            {/* Exam History Section */}
            {profile?.recentActivities && profile.recentActivities.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  {t('profile.exam_history')}
                </Text>
                <View style={styles.activityList}>
                  {profile.recentActivities.map((activity) => {
                    // Determine skill icon/color
                    let skillColor = theme.primary;
                    if (activity.skill === 'Writing') skillColor = '#ec4899';
                    else if (activity.skill === 'Speaking') skillColor = '#8b5cf6';
                    else if (activity.skill === 'Listening') skillColor = '#10b981';

                    return (
                      <TouchableOpacity
                        key={activity.id}
                        style={styles.activityItem}
                        activeOpacity={0.8}
                        onPress={() => navigation.navigate('PracticeResult', { attemptId: activity.id })}
                      >
                        <View style={styles.activityLeft}>
                          <View style={[styles.skillBadge, { backgroundColor: skillColor + '15' }]}>
                            <Text style={[styles.skillBadgeText, { color: skillColor }]}>
                              {activity.skill.charAt(0)}
                            </Text>
                          </View>
                          <View style={styles.activityMeta}>
                            <Text style={styles.activityTitle} numberOfLines={1}>
                              {activity.title}
                            </Text>
                            <Text style={styles.activityDate}>
                              {new Date(activity.date).toLocaleDateString(i18n.language === 'vi' ? 'vi-VN' : 'en-US')}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.activityRight}>
                          <Text style={styles.activityScore}>
                            {activity.score != null ? activity.score : 'N/A'}
                          </Text>
                          <ChevronRight size={16} color={theme.textSecondary} />
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}
          </>
        )}

        {/* Account Settings */}
        {isAuthenticated && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('profile.account')}</Text>
            <View style={styles.menuGroup}>
              <TouchableOpacity style={styles.menuItem}>
                <View style={[styles.menuIconContainer, { backgroundColor: theme.primary + '15' }]}>
                  <Settings size={20} color={theme.primary} />
                </View>
                <Text style={styles.menuText}>{t('profile.account_settings')}</Text>
                <ChevronRight size={18} color={theme.border} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem}>
                <View style={[styles.menuIconContainer, { backgroundColor: '#10b98115' }]}>
                  <ShieldCheck size={20} color="#10b981" />
                </View>
                <Text style={styles.menuText}>{t('profile.privacy_security')}</Text>
                <ChevronRight size={18} color={theme.border} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Preferences Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.app_preferences')}</Text>
          <View style={styles.menuGroup}>
            <TouchableOpacity style={styles.menuItem} onPress={toggleLanguage}>
              <View style={[styles.menuIconContainer, { backgroundColor: '#8b5cf615' }]}>
                <Globe size={20} color="#8b5cf6" />
              </View>
              <Text style={styles.menuText}>{t('profile.app_language')}</Text>
              <Text style={styles.menuValue}>{i18n.language === 'vi' ? 'Tiếng Việt' : 'English'}</Text>
              <ChevronRight size={18} color={theme.border} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={toggleTheme}>
              <View style={[styles.menuIconContainer, { backgroundColor: '#f59e0b15' }]}>
                {mode === 'dark' ? <Moon size={20} color="#f59e0b" /> : <Sun size={20} color="#f59e0b" />}
              </View>
              <Text style={styles.menuText}>{t('profile.theme')}</Text>
              <Text style={styles.menuValue}>{mode === 'dark' ? t('profile.dark') : t('profile.light')}</Text>
              <ChevronRight size={18} color={theme.border} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Nút Đăng xuất cho người dùng đã authenticated */}
        {isAuthenticated && (
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={20} color="#ef4444" />
            <Text style={styles.logoutText}>{t('profile.logout_btn')}</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
