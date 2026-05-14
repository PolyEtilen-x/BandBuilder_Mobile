import React from 'react';
import { Modal, StyleSheet, View, TouchableOpacity, Text, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';
import { X } from 'lucide-react-native';

interface LoginWebViewProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function LoginWebView({ visible, onClose, onSuccess }: LoginWebViewProps) {
  const loginUrl = `${process.env.EXPO_PUBLIC_API_URL}/auth/google`;
  const successUrlPattern = 'loginsuccess';

  const handleNavigationStateChange = (navState: any) => {
    // If URL contains loginsuccess, it means login was successful on web
    if (navState.url.includes(successUrlPattern)) {
      console.log("Detected success URL:", navState.url);
      
      // Give it a moment to let the server set cookies in the WebView session
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Đăng nhập Google</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#64748b" />
          </TouchableOpacity>
        </View>
        
        <WebView
          source={{ uri: loginUrl }}
          onNavigationStateChange={handleNavigationStateChange}
          startInLoadingState={true}
          domStorageEnabled={true}
          javaScriptEnabled={true}
          incognito={false} // Keep cookies to avoid repeated logins
        />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },
  closeButton: {
    padding: 4,
  },
});
