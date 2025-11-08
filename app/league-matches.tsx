import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { mockMatches, mockLeagues } from '@/data/mockData';
import { MatchCard } from '@/components/match-card';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Match } from '@/types/match';
import { MatchService } from '@/services/match-service';
import { AdBanner } from '@/components/ui/admob-banner';

export default function LeagueMatchesScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { leagueId } = useLocalSearchParams();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const league = mockLeagues.find((l) => l.id === leagueId);

  useEffect(() => {
    const fetchMatches = async () => {
      if (typeof leagueId !== 'string') return;
      try {
        setLoading(true);
        setError(null);
        const data = await MatchService.getMatchesByLeague(leagueId);
        if (!data || data.length === 0) {
          // Fallback to mock
          setMatches(mockMatches.filter((m) => m.league.id === leagueId));
        } else {
          setMatches(data);
        }
      } catch (e: any) {
        setError('Failed to load league matches');
        setMatches(mockMatches.filter((m) => m.league.id === leagueId));
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, [leagueId]);

  if (!league) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>
          League not found
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[styles.header, { borderBottomColor: colors.icon + '20' }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.leagueLogo}>{league.logo}</Text>
          <View>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              {league.name}
            </Text>
            <Text style={[styles.headerSubtitle, { color: colors.icon }]}>
              {league.flag} {league.country}
            </Text>
          </View>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={matches}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MatchCard match={item} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.icon }]}>
              {loading ? 'Loading matches...' : error ? 'Failed to load matches' : 'No matches available for this league'}
            </Text>
          </View>
        }
        ListFooterComponent={<AdBanner />}
      />
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
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  leagueLogo: {
    fontSize: 32,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerSubtitle: {
    fontSize: 14,
  },
  listContent: {
    paddingVertical: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 48,
  },
});
