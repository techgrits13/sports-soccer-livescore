import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useEffect } from 'react';
import { Platform } from 'react-native';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { ToastProvider } from '@/components/ui/toast';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  
  useEffect(() => {
    // Initialize AdMob - will work in development and production builds
    try {
      const mobileAds = require('react-native-google-mobile-ads').default;
      mobileAds()
        .initialize()
        .then(() => console.log('✅ AdMob initialized successfully'))
        .catch((e: any) => console.log('AdMob init error:', e));
    } catch (error) {
      console.log('AdMob not available in this environment (likely Expo Go)');
    }
  }, []);

  return (
    <ToastProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </ToastProvider>
  );
}
