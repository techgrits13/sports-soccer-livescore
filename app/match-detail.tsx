import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { mockMatches } from '@/data/mockData';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useMatchDetails } from '@/hooks/use-matches';
import { FavoritesService } from '@/services/favorites-service';
import { AdBanner } from '@/components/ui/admob-banner';

export default function MatchDetailScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { matchId } = useLocalSearchParams();
  const [useMockData, setUseMockData] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Fetch from API
  const { match: apiMatch, loading, error } = useMatchDetails(
    typeof matchId === 'string' && !useMockData ? matchId : null
  );

  // Fallback to mock data
  const mockMatch = mockMatches.find((m) => m.id === matchId);
  const match = useMockData || error ? mockMatch : apiMatch;

  useEffect(() => {
    const checkFav = async () => {
      if (typeof matchId !== 'string') return;
      try {
        const favored = await FavoritesService.isFavorited(matchId, 'match');
        setIsFavorite(favored);
      } catch {}
    };
    checkFav();
  }, [matchId]);

  const toggleFavorite = async () => {
    if (typeof matchId !== 'string' || !match) return;
    try {
      if (isFavorite) {
        await FavoritesService.removeFavoriteByEntity(matchId, 'match');
        setIsFavorite(false);
      } else {
        await FavoritesService.addMatchFavorite(matchId, {
          homeTeam: match.homeTeam.name,
          awayTeam: match.awayTeam.name,
          league: match.league.name,
          startTime: match.startTime,
        });
        setIsFavorite(true);
      }
    } catch {}
  };

  if (loading) {
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
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Match Details
          </Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.tint} />
          <Text style={[styles.loadingText, { color: colors.icon }]}>
            Loading match details...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!match) {
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
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Match Details
          </Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.emptyContainer}>
          <Text style={[styles.errorText, { color: colors.text }]}>
            {error ? `⚠️ ${error}` : 'Match not found'}
          </Text>
          {error && (
            <TouchableOpacity
              style={[styles.retryButton, { backgroundColor: colors.tint }]}
              onPress={() => setUseMockData(true)}>
              <Text style={[styles.retryButtonText, { color: '#fff' }]}>
                Use Mock Data
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    );
  }

  const getStatusDisplay = () => {
    switch (match.status) {
      case 'LIVE':
        return `${match.minute}'`;
      case 'HALFTIME':
        return 'Half Time';
      case 'FINISHED':
        return 'Full Time';
      case 'UPCOMING':
        const startTime = new Date(match.startTime);
        return startTime.toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
      default:
        return match.status;
    }
  };

  const renderStatBar = (label: string, home: number, away: number) => {
    const total = home + away || 1;
    const homePercent = (home / total) * 100;
    const awayPercent = (away / total) * 100;

    return (
      <View style={styles.statRow}>
        <Text style={[styles.statValue, { color: colors.text }]}>{home}</Text>
        <View style={styles.statCenter}>
          <Text style={[styles.statLabel, { color: colors.icon }]}>
            {label}
          </Text>
          <View style={styles.statBarContainer}>
            <View
              style={[
                styles.statBar,
                styles.statBarHome,
                { width: `${homePercent}%`, backgroundColor: colors.tint },
              ]}
            />
            <View
              style={[
                styles.statBar,
                styles.statBarAway,
                { width: `${awayPercent}%`, backgroundColor: '#ff8800' },
              ]}
            />
          </View>
        </View>
        <Text style={[styles.statValue, { color: colors.text }]}>{away}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[styles.header, { borderBottomColor: colors.icon + '20' }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}> 
          Match Details
        </Text>
        <View style={{ width: 40, flexDirection: 'row', justifyContent: 'flex-end' }}>
          <TouchableOpacity onPress={toggleFavorite} style={{ marginRight: 8 }}>
            <Text style={{ fontSize: 20 }}>{isFavorite ? '⭐' : '☆'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setUseMockData(!useMockData)}>
            <Text style={{ fontSize: 20 }}>
              {useMockData ? '📝' : '🌐'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* League Info */}
        <View style={styles.leagueInfo}>
          <Text style={[styles.leagueName, { color: colors.icon }]}>
            {match.league.name}
          </Text>
        </View>

        {/* Score Section */}
        <View style={styles.scoreSection}>
          {/* Home Team */}
          <View style={styles.teamColumn}>
            <Text style={styles.teamLogo}>{match.homeTeam.logo}</Text>
            <Text style={[styles.teamNameLarge, { color: colors.text }]}>
              {match.homeTeam.name}
            </Text>
          </View>

          {/* Score */}
          <View style={styles.scoreColumn}>
            {match.status === 'UPCOMING' ? (
              <Text style={[styles.vsText, { color: colors.icon }]}>VS</Text>
            ) : (
              <View style={styles.scoreDisplay}>
                <Text style={[styles.scoreTextLarge, { color: colors.text }]}>
                  {match.homeScore}
                </Text>
                <Text
                  style={[styles.scoreSeparatorLarge, { color: colors.icon }]}>
                  -
                </Text>
                <Text style={[styles.scoreTextLarge, { color: colors.text }]}>
                  {match.awayScore}
                </Text>
              </View>
            )}
            <Text
              style={[
                styles.statusText,
                {
                  color:
                    match.status === 'LIVE' ? '#00C851' : colors.icon,
                },
              ]}>
              {getStatusDisplay()}
            </Text>
          </View>

          {/* Away Team */}
          <View style={styles.teamColumn}>
            <Text style={styles.teamLogo}>{match.awayTeam.logo}</Text>
            <Text style={[styles.teamNameLarge, { color: colors.text }]}>
              {match.awayTeam.name}
            </Text>
          </View>
        </View>

        {/* Events Timeline */}
        {match.events && match.events.length > 0 && (
          <View
            style={[
              styles.section,
              { backgroundColor: colors.background, borderColor: colors.icon + '20' },
            ]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Match Events
            </Text>
            {match.events.map((event) => (
              <View key={event.id} style={styles.eventRow}>
                <Text style={[styles.eventMinute, { color: colors.icon }]}>
                  {event.minute}
                  {event.extraTime ? `+${event.extraTime}` : ''}'
                </Text>
                <View style={styles.eventContent}>
                  <Text style={[styles.eventIcon, { color: colors.text }]}>
                    {event.type === 'GOAL'
                      ? '⚽'
                      : event.type === 'YELLOW_CARD'
                      ? '🟨'
                      : event.type === 'RED_CARD'
                      ? '🟥'
                      : '🔄'}
                  </Text>
                  <Text style={[styles.eventPlayer, { color: colors.text }]}>
                    {event.player}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Match Stats */}
        {match.stats && (
          <View
            style={[
              styles.section,
              { backgroundColor: colors.background, borderColor: colors.icon + '20' },
            ]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Match Statistics
            </Text>
            {renderStatBar(
              'Possession',
              match.stats.possession.home,
              match.stats.possession.away
            )}
            {renderStatBar(
              'Shots',
              match.stats.shots.home,
              match.stats.shots.away
            )}
            {renderStatBar(
              'Shots on Target',
              match.stats.shotsOnTarget.home,
              match.stats.shotsOnTarget.away
            )}
            {renderStatBar(
              'Corners',
              match.stats.corners.home,
              match.stats.corners.away
            )}
            {renderStatBar(
              'Fouls',
              match.stats.fouls.home,
              match.stats.fouls.away
            )}
            {renderStatBar(
              'Yellow Cards',
              match.stats.yellowCards.home,
              match.stats.yellowCards.away
            )}
          </View>
        )}

        {/* Lineups */}
        {match.homeLineup && match.awayLineup && (
          <View
            style={[
              styles.section,
              { backgroundColor: colors.background, borderColor: colors.icon + '20' },
            ]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Lineups
            </Text>
            <View style={styles.lineupsContainer}>
              {/* Home Lineup */}
              <View style={styles.lineupColumn}>
                <Text style={[styles.lineupTeam, { color: colors.tint }]}>
                  {match.homeTeam.shortName}
                </Text>
                {match.homeLineup.map((player) => (
                  <View key={player.id} style={styles.playerRow}>
                    <Text style={[styles.playerNumber, { color: colors.icon }]}>
                      {player.number}
                    </Text>
                    <Text style={[styles.playerName, { color: colors.text }]}>
                      {player.name}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Away Lineup */}
              <View style={styles.lineupColumn}>
                <Text style={[styles.lineupTeam, { color: '#ff8800' }]}>
                  {match.awayTeam.shortName}
                </Text>
                {match.awayLineup.map((player) => (
                  <View key={player.id} style={styles.playerRow}>
                    <Text style={[styles.playerNumber, { color: colors.icon }]}>
                      {player.number}
                    </Text>
                    <Text style={[styles.playerName, { color: colors.text }]}>
                      {player.name}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  leagueInfo: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  leagueName: {
    fontSize: 14,
    fontWeight: '500',
  },
  scoreSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  teamColumn: {
    flex: 1,
    alignItems: 'center',
    gap: 12,
  },
  teamLogo: {
    fontSize: 48,
  },
  teamNameLarge: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  scoreColumn: {
    width: 100,
    alignItems: 'center',
    gap: 8,
  },
  scoreDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  scoreTextLarge: {
    fontSize: 40,
    fontWeight: '700',
  },
  scoreSeparatorLarge: {
    fontSize: 32,
    fontWeight: '600',
  },
  vsText: {
    fontSize: 24,
    fontWeight: '600',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
  },
  eventMinute: {
    fontSize: 14,
    fontWeight: '600',
    width: 40,
  },
  eventContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  eventIcon: {
    fontSize: 18,
  },
  eventPlayer: {
    fontSize: 14,
    fontWeight: '500',
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    width: 30,
    textAlign: 'center',
  },
  statCenter: {
    flex: 1,
    gap: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  statBarContainer: {
    height: 6,
    flexDirection: 'row',
    borderRadius: 3,
    overflow: 'hidden',
  },
  statBar: {
    height: '100%',
  },
  statBarHome: {
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
  },
  statBarAway: {
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
  },
  lineupsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  lineupColumn: {
    flex: 1,
  },
  lineupTeam: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    gap: 8,
  },
  playerNumber: {
    fontSize: 12,
    fontWeight: '600',
    width: 24,
  },
  playerName: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 48,
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
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
