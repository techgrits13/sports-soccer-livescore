import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { AdBanner } from '@/components/ui/admob-banner';
import { APIStatusService, APIStatus, APIProviderStatus } from '@/services/api-status';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  // Settings state
  const [pushNotifications, setPushNotifications] = useState(true);
  const [liveScoreUpdates, setLiveScoreUpdates] = useState(true);
  const [matchStartReminders, setMatchStartReminders] = useState(true);
  const [goalNotifications, setGoalNotifications] = useState(true);
  
  // API Status state
  const [apiStatus, setApiStatus] = useState<APIStatus | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(false);

  // Fetch API status on mount
  useEffect(() => {
    fetchAPIStatus();
  }, []);

  const fetchAPIStatus = async () => {
    setLoadingStatus(true);
    try {
      const status = await APIStatusService.getAPIStatus();
      setApiStatus(status);
    } catch (error) {
      console.error('Failed to fetch API status:', error);
    } finally {
      setLoadingStatus(false);
    }
  };

  const SettingsSection = ({ title }: { title: string }) => (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: colors.icon }]}>
        {title}
      </Text>
    </View>
  );

  const SettingsRow = ({
    icon,
    title,
    subtitle,
    value,
    onValueChange,
    hasSwitch,
    onPress,
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    value?: boolean;
    onValueChange?: (value: boolean) => void;
    hasSwitch?: boolean;
    onPress?: () => void;
  }) => (
    <TouchableOpacity
      style={[
        styles.settingsRow,
        { backgroundColor: colors.background },
      ]}
      onPress={onPress}
      disabled={hasSwitch}
      activeOpacity={hasSwitch ? 1 : 0.7}>
      <View style={styles.rowLeft}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: colors.tint + '20' },
          ]}>
          <Text style={styles.rowIcon}>{icon}</Text>
        </View>
        <View style={styles.rowContent}>
          <Text style={[styles.rowTitle, { color: colors.text }]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[styles.rowSubtitle, { color: colors.icon }]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      {hasSwitch ? (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: colors.icon + '40', true: colors.tint + '80' }}
          thumbColor={value ? colors.tint : '#f4f3f4'}
        />
      ) : (
        <IconSymbol
          name="chevron.right"
          size={20}
          color={colors.icon}
        />
      )}
    </TouchableOpacity>
  );

  const handleThemePress = () => {
    Alert.alert(
      'Theme',
      'Theme switching is handled automatically by your device settings.',
      [{ text: 'OK' }]
    );
  };

  const handleLanguagePress = () => {
    Alert.alert('Language', 'Language selection coming soon!', [
      { text: 'OK' },
    ]);
  };

  const handleAboutPress = () => {
    Alert.alert(
      'About',
      'Sport Soccer Livescore\nVersion 1.0.0\n\nYour go-to app for live football scores and updates.',
      [{ text: 'OK' }]
    );
  };

  const APIProviderCard = ({ 
    name, 
    provider, 
    isPrimary 
  }: { 
    name: string; 
    provider?: APIProviderStatus; 
    isPrimary?: boolean;
  }) => {
    if (!provider) return null;

    const status = APIStatusService.formatStatus(provider);

    return (
      <View
        style={[
          styles.apiCard,
          { backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#fff' },
        ]}>
        <View style={styles.apiCardHeader}>
          <View>
            <Text style={[styles.apiName, { color: colors.text }]}>
              {name} {isPrimary && '⭐'}
            </Text>
            <Text style={[styles.apiSubtext, { color: colors.icon }]}>
              {isPrimary ? 'Primary Provider' : 'Backup Provider'}
            </Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: status.color + '20' },
            ]}>
            <Text style={[styles.statusText, { color: status.color }]}>
              {status.text}
            </Text>
          </View>
        </View>
        <View style={styles.quotaBar}>
          <View style={styles.quotaBarBackground}>
            <View
              style={[
                styles.quotaBarFill,
                {
                  width: `${provider.percentage}%`,
                  backgroundColor: status.color,
                },
              ]}
            />
          </View>
        </View>
        <View style={styles.quotaStats}>
          <Text style={[styles.quotaText, { color: colors.icon }]}>
            {provider.used.toLocaleString()} / {provider.limit.toLocaleString()} requests
          </Text>
          <Text style={[styles.quotaText, { color: colors.icon }]}>
            {provider.remaining.toLocaleString()} remaining
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}> 
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          ⚙️ Settings
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Section */}
        <SettingsSection title="PROFILE" />
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: colors.text }]}>
              Guest User
            </Text>
            <Text style={[styles.profileEmail, { color: colors.icon }]}>
              Sign in to sync your favorites
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.signInButton,
              { backgroundColor: colors.tint },
            ]}>
            <Text style={styles.signInText}>Sign In</Text>
          </TouchableOpacity>
        </View>

        {/* Notifications Section */}
        <SettingsSection title="NOTIFICATIONS" />
        <View
          style={[
            styles.settingsGroup,
            { backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#fff' },
          ]}>
          <SettingsRow
            icon="🔔"
            title="Push Notifications"
            subtitle="Receive notifications for your favorites"
            value={pushNotifications}
            onValueChange={setPushNotifications}
            hasSwitch
          />
          <View
            style={[
              styles.divider,
              { backgroundColor: colors.icon + '20' },
            ]}
          />
          <SettingsRow
            icon="⚡"
            title="Live Score Updates"
            subtitle="Get real-time score updates"
            value={liveScoreUpdates}
            onValueChange={setLiveScoreUpdates}
            hasSwitch
          />
          <View
            style={[
              styles.divider,
              { backgroundColor: colors.icon + '20' },
            ]}
          />
          <SettingsRow
            icon="⏰"
            title="Match Start Reminders"
            subtitle="Notify before match starts"
            value={matchStartReminders}
            onValueChange={setMatchStartReminders}
            hasSwitch
          />
          <View
            style={[
              styles.divider,
              { backgroundColor: colors.icon + '20' },
            ]}
          />
          <SettingsRow
            icon="⚽"
            title="Goal Notifications"
            subtitle="Instant alerts for goals"
            value={goalNotifications}
            onValueChange={setGoalNotifications}
            hasSwitch
          />
        </View>

        {/* Appearance Section */}
        <SettingsSection title="APPEARANCE" />
        <View
          style={[
            styles.settingsGroup,
            { backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#fff' },
          ]}>
          <SettingsRow
            icon="🎨"
            title="Theme"
            subtitle={`Current: ${colorScheme === 'dark' ? 'Dark' : 'Light'}`}
            onPress={handleThemePress}
          />
          <View
            style={[
              styles.divider,
              { backgroundColor: colors.icon + '20' },
            ]}
          />
          <SettingsRow
            icon="🌐"
            title="Language"
            subtitle="English"
            onPress={handleLanguagePress}
          />
        </View>

        {/* API Status Section */}
        <SettingsSection title="API PROVIDERS" />
        {loadingStatus ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.tint} />
          </View>
        ) : apiStatus ? (
          <View style={styles.apiContainer}>
            <APIProviderCard
              name="SportMonks"
              provider={apiStatus.sportMonks}
              isPrimary
            />
            <APIProviderCard
              name="API-Football"
              provider={apiStatus.apiFootball}
            />
            <APIProviderCard
              name="Football-Data.org"
              provider={apiStatus.footballData}
            />
            <TouchableOpacity
              style={[styles.refreshButton, { backgroundColor: colors.tint }]}
              onPress={fetchAPIStatus}>
              <Text style={styles.refreshButtonText}>🔄 Refresh Status</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.errorContainer}>
            <Text style={[styles.errorText, { color: colors.icon }]}>
              Unable to fetch API status
            </Text>
          </View>
        )}

        {/* General Section */}
        <SettingsSection title="GENERAL" />
        <View
          style={[
            styles.settingsGroup,
            { backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#fff' },
          ]}>
          <SettingsRow
            icon="ℹ️"
            title="About"
            subtitle="App version and info"
            onPress={handleAboutPress}
          />
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.icon }]}>
            Made with ⚽ for football fans
          </Text>
          <Text style={[styles.footerText, { color: colors.icon }]}>
            Version 1.0.0
          </Text>
        </View>
      </ScrollView>
      <AdBanner />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  scrollContent: {
    paddingBottom: 32,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#007AFF20',
    gap: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 28,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 13,
  },
  signInButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  signInText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  settingsGroup: {
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowIcon: {
    fontSize: 18,
  },
  rowContent: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  rowSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  divider: {
    height: 1,
    marginLeft: 64,
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
    gap: 4,
  },
  footerText: {
    fontSize: 13,
  },
  // API Status styles
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  apiContainer: {
    marginHorizontal: 16,
    gap: 12,
  },
  apiCard: {
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  apiCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  apiName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  apiSubtext: {
    fontSize: 12,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  quotaBar: {
    marginBottom: 8,
  },
  quotaBarBackground: {
    height: 6,
    backgroundColor: '#E5E5EA',
    borderRadius: 3,
    overflow: 'hidden',
  },
  quotaBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  quotaStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quotaText: {
    fontSize: 12,
  },
  refreshButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  errorContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
  },
});
