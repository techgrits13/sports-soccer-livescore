/**
 * AdMob Banner Component
 * 
 * This component handles Google AdMob banner ads with intelligent environment detection.
 * 
 * Environment Behavior:
 * - Expo Go: Returns null (AdMob not supported in Expo Go)
 * - Development Builds: Shows test ads
 * - Production Builds: Shows real ads
 * 
 * Note: AdMob requires native modules and won't work in Expo Go.
 * Use development builds (expo run:android/ios) or production builds to see ads.
 */
import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';

const PROD_UNIT_ID = 'ca-app-pub-1810197362148301/8733652206';

// Check if we're in Expo Go (AdMob won't work)
// More accurate detection for both Android and iOS
const isExpoGo = Platform.OS === 'android' 
  ? !('DeviceEventManagerModule' in (global as any))
  : !('RNGestureHandlerModule' in (global as any));

export function AdBanner() {
  // Try to load AdMob - it will work in development and production builds
  try {
    const { BannerAd, BannerAdSize, TestIds } = require('react-native-google-mobile-ads');
    const adUnitId = __DEV__ ? TestIds.BANNER : PROD_UNIT_ID;

    return (
      <View style={styles.container}>
        <BannerAd
          unitId={adUnitId}
          size={BannerAdSize.ADAPTIVE_BANNER}
          onAdFailedToLoad={(err: any) => console.log('Ad error', err)}
        />
      </View>
    );
  } catch (error) {
    // Silently fail if AdMob not available (e.g., in Expo Go)
    console.log('AdMob not available in this environment');
    return null;
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
});
