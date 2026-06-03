import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from './auth.store';

// Đảm bảo trình duyệt kết thúc phiên làm việc sau khi login
WebBrowser.maybeCompleteAuthSession();

export async function loginWithGoogle() {
  try {
    // 1. Tạo deep link để quay lại app
    const redirectUrl = Linking.createURL('loginsuccess');
    
    // 2. URL của Backend (Server cần được báo để redirect về link này)
    const authUrl = `${process.env.EXPO_PUBLIC_API_URL}/auth/google?mobileRedirect=${encodeURIComponent(redirectUrl)}`;

    console.log("🚀 Starting System Auth Session...");
    
    // 3. Mở trình duyệt hệ thống (Hiện bảng thông báo "BandBuilder" muốn sử dụng "google.com")
    const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUrl);

    if (result.type === 'success' && result.url) {
      console.log("✅ Auth Success! URL:", result.url);
      
      // 4. Phân tích Token từ URL trả về (Nếu backend redirect kèm token)
      const { queryParams } = Linking.parse(result.url);
      const token = queryParams?.token;
      const refreshToken = queryParams?.refreshToken;

      if (token) {
        // Lưu token vào AsyncStorage để duy trì phiên đăng nhập và tự động gửi kèm các API requests sau
        await AsyncStorage.setItem("auth_token", token as string);
        console.log("🔑 Token received & saved to AsyncStorage");
      }
      
      if (refreshToken) {
        await AsyncStorage.setItem("refresh_token", refreshToken as string);
        console.log("🔑 Refresh Token received & saved to AsyncStorage");
      }

      // 5. Cập nhật trạng thái User
      await useAuthStore.getState().initAuth();
    } else {
      console.log("ℹ️ User cancelled or dismissed login.");
    }
  } catch (error) {
    console.error("❌ Google Login Error:", error);
  }
}
