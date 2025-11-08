import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { League } from '@/types/match';
import { router } from 'expo-router';
import { LeagueService } from '@/services/league-service';
import { useToast } from '@/components/ui/toast';
import { AdBanner } from '@/components/ui/admob-banner';

export default function LeaguesScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [searchQuery, setSearchQuery] = useState('');
  const [leagues, setLeagues] = useState<League[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { show } = useToast();

  useEffect(() => {
    const fetchLeagues = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await LeagueService.getPopularLeagues();
        // Fallback to all if popular not available
        if (!data || data.length === 0) {
          const all = await LeagueService.getAllLeagues();
          setLeagues(all);
        } else {
          setLeagues(data);
        }
      } catch (e: any) {
        setError('Failed to load leagues');
        setLeagues([]);
        show('Failed to load leagues from server', 2500);
      } finally {
        setLoading(false);
      }
    };
    fetchLeagues();
  }, []);

  const filteredLeagues = leagues.filter((league) => {
    const countryName = typeof league.country === 'object' && league.country !== null 
      ? (league.country as any).name 
      : (league.country as string) || '';
    return league.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      countryName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getLeagueMatchCount = (leagueId: string) => {
    // Real match count would come from API
    return 0;
  };

  const handleLeaguePress = (league: League) => {
    router.push({
      pathname: '/league-matches' as any,
      params: { leagueId: league.id },
    });
  };

  const renderLeagueCard = ({ item }: { item: League }) => {
    const matchCount = getLeagueMatchCount(item.id);
    const cardBackground = colorScheme === 'dark' ? '#1C1C1E' : '#FFFFFF';

    return (
      <TouchableOpacity
        style={[styles.leagueCard, { backgroundColor: cardBackground }]}
        onPress={() => handleLeaguePress(item)}
        activeOpacity={0.7}>
        <View style={styles.leagueIcon}>
          <Text style={styles.leagueLogo}>{item.logo}</Text>
        </View>
        <View style={styles.leagueInfo}>
          <Text style={[styles.leagueName, { color: colors.text }]}>
            {item.name}
          </Text>
          <Text style={[styles.leagueCountry, { color: colors.icon }]}>
            {typeof item.country === 'object' && item.country !== null ? (item.country as any).flag : ''} {typeof item.country === 'object' && item.country !== null ? (item.country as any).name : item.country || ''}
          </Text>
        </View>
        <View style={styles.leagueStats}>
          <Text style={[styles.matchCount, { color: colors.tint }]}>
            {matchCount}
          </Text>
          <Text style={[styles.matchLabel, { color: colors.icon }]}>
            {matchCount === 1 ? 'match' : 'matches'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          🏆 Leagues
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <View
          style={[
            styles.searchBar,
            {
              backgroundColor: colorScheme === 'dark' ? '#2C2C2E' : '#F2F2F7',
            },
          ]}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search leagues..."
            placeholderTextColor={colors.icon}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={filteredLeagues}
        keyExtractor={(item) => item.id}
        renderItem={renderLeagueCard}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.icon }]}>
              {loading ? 'Loading leagues...' : error ? 'Failed to load leagues' : 'No leagues found'}
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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 8,
  },
  searchIcon: {
    fontSize: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  clearIcon: {
    fontSize: 18,
    color: '#8E8E93',
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  leagueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    gap: 16,
  },
  leagueIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leagueLogo: {
    fontSize: 28,
  },
  leagueInfo: {
    flex: 1,
    gap: 4,
  },
  leagueName: {
    fontSize: 16,
    fontWeight: '600',
  },
  leagueCountry: {
    fontSize: 14,
  },
  leagueStats: {
    alignItems: 'flex-end',
    gap: 2,
  },
  matchCount: {
    fontSize: 20,
    fontWeight: '700',
  },
  matchLabel: {
    fontSize: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
  },
});
