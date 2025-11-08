import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { mockMatches } from '@/data/mockData';
import { MatchCard } from '@/components/match-card';
import { Match } from '@/types/match';
import {
  useLiveMatches,
  useTodaysMatches,
  useUpcomingMatches,
  useRecentMatches,
} from '@/hooks/use-matches';
import { AdBanner } from '@/components/ui/admob-banner';

type TabType = 'live' | 'upcoming' | 'results';
type DataMode = 'api' | 'mock';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [activeTab, setActiveTab] = useState<TabType>('live');
  const [dataMode, setDataMode] = useState<DataMode>('api');

  // Fetch data from API
  const liveMatches = useLiveMatches({
    autoFetch: dataMode === 'api' && activeTab === 'live',
    refreshInterval: activeTab === 'live' ? 30000 : undefined, // Refresh every 30s for live
  });
  
  const upcomingMatches = useUpcomingMatches({
    autoFetch: dataMode === 'api' && activeTab === 'upcoming',
  });
  
  const recentMatches = useRecentMatches({
    autoFetch: dataMode === 'api' && activeTab === 'results',
  });

  // Determine which data to use
  const getCurrentData = () => {
    if (dataMode === 'mock') {
      return getMockFilteredMatches();
    }

    switch (activeTab) {
      case 'live':
        return liveMatches;
      case 'upcoming':
        return upcomingMatches;
      case 'results':
        return recentMatches;
      default:
        return liveMatches;
    }
  };

  const getMockFilteredMatches = () => {
    let matches: Match[] = [];
    
    switch (activeTab) {
      case 'live':
        matches = mockMatches.filter(
          (m) => m.status === 'LIVE' || m.status === 'HALFTIME'
        );
        break;
      case 'upcoming':
        matches = mockMatches.filter((m) => m.status === 'UPCOMING');
        break;
      case 'results':
        matches = mockMatches.filter((m) => m.status === 'FINISHED');
        break;
      default:
        matches = mockMatches;
    }

    return {
      matches,
      loading: false,
      error: null,
      refresh: async () => {},
    };
  };

  const currentData = getCurrentData();
  const { matches: filteredMatches, loading, error, refresh } = currentData;

  const onRefresh = React.useCallback(async () => {
    if (dataMode === 'api') {
      await refresh();
    }
  }, [dataMode, refresh]);

  const renderTab = (tab: TabType, label: string) => {
    const isActive = activeTab === tab;
    return (
      <TouchableOpacity
        style={[
          styles.tab,
          {
            borderBottomColor: isActive ? colors.tint : 'transparent',
          },
        ]}
        onPress={() => setActiveTab(tab)}>
        <Text
          style={[
            styles.tabText,
            {
              color: isActive ? colors.tint : colors.icon,
              fontWeight: isActive ? '700' : '500',
            },
          ]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          ⚽ Live Scores
        </Text>
        
        {/* Data Mode Toggle */}
        <TouchableOpacity
          style={[styles.modeToggle, { backgroundColor: colors.icon + '20' }]}
          onPress={() => setDataMode(dataMode === 'api' ? 'mock' : 'api')}>
          <Text style={[styles.modeText, { color: colors.text }]}>
            {dataMode === 'api' ? '🌐 Live' : '📝 Mock'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.tabBar, { borderBottomColor: colors.icon + '30' }]}>
        {renderTab('live', 'Live')}
        {renderTab('upcoming', 'Upcoming')}
        {renderTab('results', 'Results')}
      </View>

      {/* Error Message */}
      {error && (
        <View style={[styles.errorContainer, { backgroundColor: '#ff4444' + '20' }]}>
          <Text style={[styles.errorText, { color: '#ff4444' }]}>
            ⚠️ {error}
          </Text>
          <TouchableOpacity onPress={onRefresh}>
            <Text style={[styles.retryText, { color: colors.tint }]}>
              Retry
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Loading Indicator */}
      {loading && !filteredMatches.length ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.tint} />
          <Text style={[styles.loadingText, { color: colors.icon }]}>
            Loading matches...
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredMatches}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <MatchCard match={item} />}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={onRefresh}
              tintColor={colors.tint}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: colors.icon }]}>
                {error ? 'Failed to load matches' : 'No matches available'}
              </Text>
              {dataMode === 'api' && !error && (
                <Text style={[styles.emptySubtext, { color: colors.icon }]}> 
                  Try switching to Mock mode or check if backend is running
                </Text>
              )}
            </View>
          }
          ListFooterComponent={<AdBanner />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  modeToggle: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  modeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    marginBottom: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 3,
  },
  tabText: {
    fontSize: 16,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
  },
  errorText: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  retryText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 12,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  loadingText: {
    fontSize: 14,
    marginTop: 12,
  },
  listContent: {
    paddingVertical: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
  },
});
