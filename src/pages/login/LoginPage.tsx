import React, { useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Image,
} from 'react-native';
import { Globe } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { getStyles } from './style';
import { useThemeColor } from '@/hooks/useThemeColor';
import { loginWithGoogle } from '@/services/auth/SignUpWithGoogle';

export default function LoginPage() {
  const { t } = useTranslation();
  const theme = useThemeColor();
  const styles = useMemo(() => getStyles(theme), [theme]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <View style={styles.header}>
          <Image
            source={require('@/assets/logo_GoIelts.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>{t('login.title')}</Text>
          <Text style={styles.subtitle}>{t('login.subtitle')}</Text>
        </View>

        <View style={styles.form}>
          <TouchableOpacity 
            style={styles.googleButton} 
            onPress={loginWithGoogle}
          >
            <Globe size={24} color={theme.primary} />
            <Text style={styles.googleButtonText}>{t('login.google_button')}</Text>
          </TouchableOpacity>
          
          <Text style={styles.disclaimer}>{t('login.disclaimer')}</Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>BANDBUILDER v1.0.0</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
