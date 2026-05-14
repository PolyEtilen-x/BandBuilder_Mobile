import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/services/auth/auth.store';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Languages, LogOut, ChevronRight } from 'lucide-react-native';

export default function ProfilePage() {
  const { t, i18n } = useTranslation();
  const logout = useAuthStore(s => s.logout);
  const theme = useThemeColor();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background
    },
    header: {
      padding: 24,
      paddingTop: 40,
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
    },
    avatarText: {
      fontSize: 32,
      fontWeight: '800',
      color: '#fff',
    },
    name: {
      fontSize: 24,
      fontWeight: '800',
      color: theme.text,
    },
    section: {
      padding: 20,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: theme.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 16,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.card,
      padding: 16,
      borderRadius: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: theme.border,
    },
    menuIcon: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: theme.backgroundAlt,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    menuText: {
      flex: 1,
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
    },
    langButtons: {
      flexDirection: 'row',
      gap: 10,
    },
    langButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.border,
    },
    langButtonActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    langButtonText: {
      fontSize: 12,
      fontWeight: '700',
      color: theme.text,
    },
    langButtonTextActive: {
      color: '#fff',
    },
    logoutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 20,
      padding: 16,
      backgroundColor: theme.error + '15',
      borderRadius: 16,
    },
    logoutText: {
      marginLeft: 8,
      fontSize: 16,
      fontWeight: '700',
      color: theme.error,
    },
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>L</Text>
        </View>
        <Text style={styles.name}>Linh Nguyen</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cài đặt hệ thống</Text>

        {/* Language Switcher */}
        <View style={styles.menuItem}>
          <View style={styles.menuIcon}>
            <Languages size={20} color={theme.primary} />
          </View>
          <Text style={styles.menuText}>Ngôn ngữ</Text>
          <View style={styles.langButtons}>
            <TouchableOpacity
              onPress={() => changeLanguage('vi')}
              style={[styles.langButton, i18n.language === 'vi' && styles.langButtonActive]}
            >
              <Text style={[styles.langButtonText, i18n.language === 'vi' && styles.langButtonTextActive]}>VI</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => changeLanguage('en')}
              style={[styles.langButton, i18n.language === 'en' && styles.langButtonActive]}
            >
              <Text style={[styles.langButtonText, i18n.language === 'en' && styles.langButtonTextActive]}>EN</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <LogOut size={20} color={theme.error} />
          <Text style={styles.logoutText}>{t('common.logout')}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
