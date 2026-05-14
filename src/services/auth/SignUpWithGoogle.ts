import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { useAuthStore } from './auth.store';

export async function loginWithGoogle() {
  try {
    const redirectUrl = Linking.createURL('loginsuccess');
    const authUrl = `${process.env.EXPO_PUBLIC_API_URL}/auth/google?mobileRedirect=${encodeURIComponent(redirectUrl)}`;

    console.log("Opening Auth Session:", authUrl);

    const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUrl);

    if (result.type === 'success' && result.url) {
      // Parse the token from the URL
      const { queryParams } = Linking.parse(result.url);
      const token = queryParams?.token;

      if (token) {
        console.log("Login success! Token received.");
        // Save token and init auth
        await useAuthStore.getState().initAuth();
      }
    }
  } catch (error) {
    console.error("Login with Google error:", error);
  }
}
