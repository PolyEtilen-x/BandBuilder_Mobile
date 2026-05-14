import React from 'react';
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
import { styles } from './style';
import { loginWithGoogle } from '@/services/auth/SignUpWithGoogle';

export default function LoginPage() {
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
          <Text style={styles.title}>BandBuilder</Text>
          <Text style={styles.subtitle}>
            Chinh phục IELTS theo lộ trình cá nhân hóa hoàn toàn miễn phí.
          </Text>
        </View>

        <View style={styles.form}>
          <TouchableOpacity style={styles.googleButton} onPress={loginWithGoogle}>
            <Globe size={24} color="#174593" />
            <Text style={styles.googleButtonText}>Tiếp tục với Google</Text>
          </TouchableOpacity>

          <Text style={styles.disclaimer}>
            Bằng cách tiếp tục, bạn đồng ý với Điều khoản dịch vụ và Chính sách bảo mật của chúng tôi.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>BANDBUILDER v1.0.0</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
