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
  Settings,
  Globe,
  Moon,
  Sun,
  ShieldCheck,
  LogOut,
  ChevronRight,
  Target,
  Award,
  Zap
} from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { getStyles } from './style';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useAuthStore } from '@/services/auth/auth.store';
import { useThemeStore } from '@/services/theme/theme.store';

export default function ProfilePage() {
  const { t, i18n } = useTranslation();
  const theme = useThemeColor();
  const styles = useMemo(() => getStyles(theme), [theme]);

  const { user, logout } = useAuthStore();
  const { mode, setMode } = useThemeStore();

  // const handleLogout = () => {
  //   Alert.alert(
  //     "Đăng xuất",
  //     "Bạn có chắc chắn muốn đăng xuất không?",
  //     [
  //       { text: "Hủy", style: "cancel" },
  //       { text: "Đăng xuất", style: "destructive", onPress: () => logout() }
  //     ]
  //   );
  // };

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'vi' ? 'en' : 'vi';
    i18n.changeLanguage(nextLang);
  };

  const toggleTheme = () => {
    setMode(mode === 'light' ? 'dark' : 'light');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle={theme.text === '#ffffff' ? 'light-content' : 'dark-content'} />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <User size={50} color={theme.primary} />
          </View>
          <Text style={styles.userName}>{user?.email?.split('@')[0] || 'User'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'user@bandbuilder.io'}</Text>

          <View style={styles.proBadge}>
            <Text style={styles.proBadgeText}>Premium Member</Text>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Target size={20} color="#3b82f6" style={{ marginBottom: 8 }} />
            <Text style={styles.statValue}>7.5</Text>
            <Text style={styles.statLabel}>Target</Text>
          </View>
          <View style={styles.statCard}>
            <Zap size={20} color="#f97316" style={{ marginBottom: 8 }} />
            <Text style={styles.statValue}>24</Text>
            <Text style={styles.statLabel}>Streak</Text>
          </View>
          <View style={styles.statCard}>
            <Award size={20} color="#10b981" style={{ marginBottom: 8 }} />
            <Text style={styles.statValue}>15</Text>
            <Text style={styles.statLabel}>Done</Text>
          </View>
        </View>

        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.menuGroup}>
            <TouchableOpacity style={styles.menuItem}>
              <View style={[styles.menuIconContainer, { backgroundColor: '#3b82f615' }]}>
                <Settings size={20} color="#3b82f6" />
              </View>
              <Text style={styles.menuText}>Account Settings</Text>
              <ChevronRight size={18} color={theme.border} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <View style={[styles.menuIconContainer, { backgroundColor: '#10b98115' }]}>
                <ShieldCheck size={20} color="#10b981" />
              </View>
              <Text style={styles.menuText}>Security & Privacy</Text>
              <ChevronRight size={18} color={theme.border} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Preferences Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.menuGroup}>
            <TouchableOpacity style={styles.menuItem} onPress={toggleLanguage}>
              <View style={[styles.menuIconContainer, { backgroundColor: '#8b5cf615' }]}>
                <Globe size={20} color="#8b5cf6" />
              </View>
              <Text style={styles.menuText}>App Language</Text>
              <Text style={styles.menuValue}>{i18n.language === 'vi' ? 'Tiếng Việt' : 'English'}</Text>
              <ChevronRight size={18} color={theme.border} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={toggleTheme}>
              <View style={[styles.menuIconContainer, { backgroundColor: '#f59e0b15' }]}>
                {mode === 'dark' ? <Moon size={20} color="#f59e0b" /> : <Sun size={20} color="#f59e0b" />}
              </View>
              <Text style={styles.menuText}>Theme Mode</Text>
              <Text style={styles.menuValue}>{mode === 'dark' ? 'Dark' : 'Light'}</Text>
              <ChevronRight size={18} color={theme.border} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <LogOut size={20} color="#ef4444" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
