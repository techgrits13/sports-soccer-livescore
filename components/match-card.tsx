import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Match } from '@/types/match';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { router } from 'expo-router';

interface MatchCardProps {
  match: Match;
}

export function MatchCard({ match }: MatchCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const getStatusDisplay = () => {
    switch (match.status) {
      case 'LIVE':
        return `${match.minute}'`;
      case 'HALFTIME':
        return 'HT';
      case 'FINISHED':
        return 'FT';
      case 'UPCOMING':
        const startTime = new Date(match.startTime);
        return startTime.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        });
      default:
        return match.status;
    }
  };

  const getStatusColor = () => {
    if (match.status === 'LIVE') return '#00C851';
    if (match.status === 'HALFTIME') return '#ff8800';
    if (match.status === 'FINISHED') return colors.icon;
    return colors.text;
  };

  const handlePress = () => {
    router.push({
      pathname: '/match-detail' as any,
      params: { matchId: match.id },
    });
  };

  const cardBackground = colorScheme === 'dark' ? '#1C1C1E' : '#FFFFFF';

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: cardBackground }]}
      onPress={handlePress}
      activeOpacity={0.7}>
      <View style={styles.header}>
        <Text style={[styles.leagueName, { color: colors.icon }]}>
          {match.league.flag} {match.league.name}
        </Text>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                match.status === 'LIVE' || match.status === 'HALFTIME'
                  ? getStatusColor() + '20'
                  : 'transparent',
            },
          ]}>
          <Text style={[styles.statusText, { color: getStatusColor() }]}>
            {getStatusDisplay()}
          </Text>
        </View>
      </View>

      <View style={styles.matchInfo}>
        {/* Home Team */}
        <View style={styles.team}>
          <Text style={styles.teamLogo}>{match.homeTeam.logo}</Text>
          <Text
            style={[styles.teamName, { color: colors.text }]}
            numberOfLines={1}>
            {match.homeTeam.name}
          </Text>
        </View>

        {/* Score */}
        <View style={styles.scoreContainer}>
          {match.status === 'UPCOMING' ? (
            <Text style={[styles.vsText, { color: colors.icon }]}>VS</Text>
          ) : (
            <View style={styles.score}>
              <Text style={[styles.scoreText, { color: colors.text }]}>
                {match.homeScore}
              </Text>
              <Text style={[styles.scoreSeparator, { color: colors.icon }]}>
                -
              </Text>
              <Text style={[styles.scoreText, { color: colors.text }]}>
                {match.awayScore}
              </Text>
            </View>
          )}
        </View>

        {/* Away Team */}
        <View style={styles.team}>
          <Text style={styles.teamLogo}>{match.awayTeam.logo}</Text>
          <Text
            style={[styles.teamName, { color: colors.text }]}
            numberOfLines={1}>
            {match.awayTeam.name}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  leagueName: {
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  matchInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  team: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  teamLogo: {
    fontSize: 32,
  },
  teamName: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  scoreContainer: {
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  score: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scoreText: {
    fontSize: 28,
    fontWeight: '700',
  },
  scoreSeparator: {
    fontSize: 24,
    fontWeight: '600',
  },
  vsText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
