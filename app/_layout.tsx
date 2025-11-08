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

// Check if we're in Expo Go
const isExpoGo = Platform.OS === 'android' 
  ? !('DeviceEventManagerModule' in (global as any))
  : true;

export default function RootLayout() {
  const colorScheme = useColorScheme();
  
  useEffect(() => {
    // Skip AdMob initialization in Expo Go
    if (isExpoGo) {
      console.log('Running in Expo Go - AdMob disabled');
      return;
    }

    // Only initialize AdMob in actual builds
    try {
      const mobileAds = require('react-native-google-mobile-ads').default;
      mobileAds()
        .initialize()
        .then(() => console.log('AdMob initialized'))
        .catch((e: any) => console.log('AdMob init error:', e));
    } catch (error) {
      console.log('AdMob initialization failed');
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
