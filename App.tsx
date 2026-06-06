import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
import { useAuthStore } from './src/services/auth/auth.store';
import { useEffect } from 'react';
import * as Linking from 'expo-linking';
import AsyncStorage from '@react-native-async-storage/async-storage';
import './src/locales/i18n';

const queryClient = new QueryClient();

export default function App() {
  const initAuth = useAuthStore((s) => s.initAuth);

  useEffect(() => {
    // 1. Khởi tạo session auth từ token sẵn có
    initAuth();

    // 2. Lắng nghe deep link callback từ trình duyệt hệ thống sau khi Google login
    const handleDeepLink = async (event: { url: string }) => {
      console.log("🔗 Deep link received:", event.url);
      if (event.url.includes("loginsuccess")) {
        const { queryParams } = Linking.parse(event.url);
        
        // Regex dự phòng để tách token nếu queryParams bị rỗng
        const getParam = (url: string, key: string) => {
          const match = url.match(new RegExp(`[?&]${key}=([^&]+)`));
          return match ? decodeURIComponent(match[1]) : null;
        };

        const token = queryParams?.token || getParam(event.url, "token");
        const refreshToken = queryParams?.refreshToken || getParam(event.url, "refreshToken");

        if (token) {
          await AsyncStorage.setItem("auth_token", token as string);
          console.log("🔑 Access token saved via deep link");
        }
        if (refreshToken) {
          await AsyncStorage.setItem("refresh_token", refreshToken as string);
          console.log("🔑 Refresh token saved via deep link");
        }

        // Cập nhật lại Zustand auth store
        await useAuthStore.getState().initAuth();
      }
    };

    // Đăng ký event listener cho Linking
    const subscription = Linking.addEventListener("url", handleDeepLink);

    // Kiểm tra link lúc mở app lần đầu (cold boot)
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink({ url });
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <StatusBar style="dark" />
        <RootNavigator />
      </NavigationContainer>
    </QueryClientProvider>
  );
}
