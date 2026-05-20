import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
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

export default function ProfilePage() {
  const { t, i18n } = useTranslation();
  const theme = useThemeColor();
  const styles = useMemo(() => getStyles(theme), [theme]);

  const { user, isAuthenticated, logout } = useAuthStore();
  const { mode, setMode } = useThemeStore();

  // Đăng xuất với hộp thoại xác nhận chuyên nghiệp
  const handleLogout = () => {
    Alert.alert(
      "Đăng xuất",
      "Bạn có chắc chắn muốn đăng xuất khỏi tài khoản không?",
      [
        { text: "Hủy bỏ", style: "cancel" },
        { text: "Đăng xuất", style: "destructive", onPress: async () => await logout() }
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

  // Tính toán các chỉ số động từ dữ liệu lộ trình thực tế
  const totalStages = roadmapData.nodes.length;
  const completedStages = roadmapData.nodes.filter(n => n.isCompleted).length;
  const targetBand = roadmapData.targetLevel || "6.0";
  const learningStreak = completedStages > 0 ? completedStages * 3 + 1 : 0; // Dynamic mock streak based on completed stages

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle={theme.text === '#ffffff' ? 'light-content' : 'dark-content'} />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* TRẠNG THÁI CHƯA ĐĂNG NHẬP */}
        {!isAuthenticated ? (
          <View style={styles.loginCard}>
            <View style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor: theme.primary + '15',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 12
            }}>
              <User size={32} color={theme.primary} />
            </View>
            <Text style={styles.loginTitle}>Bắt đầu hành trình IELTS</Text>
            <Text style={styles.loginDesc}>
              Đăng nhập để theo dõi lộ trình học cá nhân hóa bằng AI, lưu lại từ vựng và luyện nói trực tiếp cùng AI Speaking Coach.
            </Text>
            <TouchableOpacity 
              activeOpacity={0.8}
              style={styles.googleButton}
              onPress={loginWithGoogle}
            >
              <Sparkles size={18} color="#ffffff" />
              <Text style={styles.googleButtonText}>Đăng nhập bằng Google</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* TRẠNG THÁI ĐÃ ĐĂNG NHẬP THÀNH CÔNG */
          <>
            {/* Header Section */}
            <View style={styles.header}>
              <View style={styles.avatarContainer}>
                <View style={{ 
                  width: '100%', 
                  height: '100%', 
                  backgroundColor: theme.primary + '20', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>
                  <Text style={{ fontSize: 32, fontWeight: '800', color: theme.primary }}>
                    {(user?.name || user?.fullName || user?.email || 'U').charAt(0).toUpperCase()}
                  </Text>
                </View>
              </View>
              <Text style={styles.userName}>
                {user?.name || user?.fullName || user?.email?.split('@')[0] || 'User'}
              </Text>
              <Text style={styles.userEmail}>{user?.email || 'user@bandbuilder.io'}</Text>

              <View style={styles.proBadge}>
                <Text style={styles.proBadgeText}>Premium Member</Text>
              </View>
            </View>

            {/* Stats Section - Hiển thị chỉ số động */}
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Target size={20} color={theme.primary} style={{ marginBottom: 8 }} />
                <Text style={styles.statValue}>Band {targetBand}</Text>
                <Text style={styles.statLabel}>Mục tiêu</Text>
              </View>
              <View style={styles.statCard}>
                <Zap size={20} color="#f97316" style={{ marginBottom: 8 }} />
                <Text style={styles.statValue}>{learningStreak} ngày</Text>
                <Text style={styles.statLabel}>Streak</Text>
              </View>
              <View style={styles.statCard}>
                <Award size={20} color="#10b981" style={{ marginBottom: 8 }} />
                <Text style={styles.statValue}>{completedStages}/{totalStages}</Text>
                <Text style={styles.statLabel}>Hoàn thành</Text>
              </View>
            </View>
          </>
        )}

        {/* Account Settings */}
        {isAuthenticated && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tài khoản</Text>
            <View style={styles.menuGroup}>
              <TouchableOpacity style={styles.menuItem}>
                <View style={[styles.menuIconContainer, { backgroundColor: theme.primary + '15' }]}>
                  <Settings size={20} color={theme.primary} />
                </View>
                <Text style={styles.menuText}>Thiết lập tài khoản</Text>
                <ChevronRight size={18} color={theme.border} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem}>
                <View style={[styles.menuIconContainer, { backgroundColor: '#10b98115' }]}>
                  <ShieldCheck size={20} color="#10b981" />
                </View>
                <Text style={styles.menuText}>Bảo mật & Quyền riêng tư</Text>
                <ChevronRight size={18} color={theme.border} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Preferences Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tùy chỉnh ứng dụng</Text>
          <View style={styles.menuGroup}>
            <TouchableOpacity style={styles.menuItem} onPress={toggleLanguage}>
              <View style={[styles.menuIconContainer, { backgroundColor: '#8b5cf615' }]}>
                <Globe size={20} color="#8b5cf6" />
              </View>
              <Text style={styles.menuText}>Ngôn ngữ ứng dụng</Text>
              <Text style={styles.menuValue}>{i18n.language === 'vi' ? 'Tiếng Việt' : 'English'}</Text>
              <ChevronRight size={18} color={theme.border} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={toggleTheme}>
              <View style={[styles.menuIconContainer, { backgroundColor: '#f59e0b15' }]}>
                {mode === 'dark' ? <Moon size={20} color="#f59e0b" /> : <Sun size={20} color="#f59e0b" />}
              </View>
              <Text style={styles.menuText}>Giao diện (Theme)</Text>
              <Text style={styles.menuValue}>{mode === 'dark' ? 'Tối' : 'Sáng'}</Text>
              <ChevronRight size={18} color={theme.border} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Nút Đăng xuất cho người dùng đã authenticated */}
        {isAuthenticated && (
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={20} color="#ef4444" />
            <Text style={styles.logoutText}>Đăng xuất tài khoản</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
