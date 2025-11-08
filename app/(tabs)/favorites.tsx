import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { MatchCard } from '@/components/match-card';
import { Match } from '@/types/match';
import { FavoritesService } from '@/services/favorites-service';
import { MatchService } from '@/services/match-service';
import { AdBanner } from '@/components/ui/admob-banner';

export default function FavoritesScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [favoriteMatches, setFavoriteMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        setError(null);
        const favs = await FavoritesService.getFavorites('match');
        if (!favs || favs.length === 0) {
          setFavoriteMatches([]);
          return;
        }
        // Fetch current matches for each favorited entity id
        const results = await Promise.allSettled(
          favs.map((f) => MatchService.getMatchById(f.entityId))
        );
        const matches: Match[] = [];
        for (const r of results) {
          if (r.status === 'fulfilled' && r.value) matches.push(r.value);
        }
        setFavoriteMatches(matches);
      } catch (e: any) {
        setError('Failed to load favorites');
        setFavoriteMatches([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>⭐</Text>
      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        No Favorites Yet
      </Text>
      <Text style={[styles.emptyText, { color: colors.icon }]}>
        Add teams, leagues, or matches to see them here
      </Text>
      <TouchableOpacity
        style={[
          styles.addButton,
          { backgroundColor: colors.tint },
        ]}>
        <Text style={styles.addButtonText}>Browse Matches</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          ⭐ Favorites
        </Text>
        <Text style={[styles.subtitle, { color: colors.icon }]}>
          Your followed teams and leagues
        </Text>
      </View>

      {favoriteMatches.length === 0 && !loading && !error ? (
        <EmptyState />
      ) : (
        <FlatList
          data={favoriteMatches}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <MatchCard match={item} />}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Favorites</Text>
              <View
                style={[
                  styles.liveBadge,
                  { backgroundColor: '#00C851' + '20' },
                ]}>
                <View style={styles.liveDot} />
                <Text style={[styles.liveText, { color: '#00C851' }]}>LIVE</Text>
              </View>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: colors.icon }]}>
                {loading ? 'Loading favorites...' : error ? 'Failed to load favorites' : 'No favorites'}
              </Text>
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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 6,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00C851',
  },
  liveText: {
    fontSize: 12,
    fontWeight: '700',
  },
  listContent: {
    paddingBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: 64,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  addButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
