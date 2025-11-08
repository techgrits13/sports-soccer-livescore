/**
 * Data Transformers
 * Convert backend API responses to frontend data models
 */

import {
  APIMatch,
  APIMatchEvent,
  APIMatchStatistics,
  APIMatchLineup,
} from '@/types/api';
import {
  Match,
  MatchStatus,
  MatchEvent,
  MatchStats,
  Player,
} from '@/types/match';

/**
 * Transform backend match status to frontend status
 */
function transformMatchStatus(backendStatus: string): MatchStatus {
  const statusMap: Record<string, MatchStatus> = {
    'NS': 'UPCOMING',      // Not Started
    'TBD': 'UPCOMING',     // To Be Defined
    '1H': 'LIVE',          // First Half
    'HT': 'HALFTIME',      // Halftime
    '2H': 'LIVE',          // Second Half
    'ET': 'LIVE',          // Extra Time
    'P': 'LIVE',           // Penalty
    'FT': 'FINISHED',      // Full Time
    'AET': 'FINISHED',     // After Extra Time
    'PEN': 'FINISHED',     // After Penalties
    'SUSP': 'POSTPONED',   // Suspended
    'INT': 'POSTPONED',    // Interrupted
    'PST': 'POSTPONED',    // Postponed
    'CANC': 'POSTPONED',   // Cancelled
    'ABD': 'POSTPONED',    // Abandoned
    'AWD': 'FINISHED',     // Awarded
    'WO': 'FINISHED',      // WalkOver
    'LIVE': 'LIVE',        // Live (generic)
  };

  return statusMap[backendStatus] || 'UPCOMING';
}

/**
 * Transform backend event type to frontend event type
 */
function transformEventType(backendType: string, backendDetail: string): MatchEvent['type'] {
  if (backendType === 'Goal' || backendDetail.includes('Goal')) {
    return 'GOAL';
  }
  if (backendType === 'Card') {
    if (backendDetail === 'Yellow Card') return 'YELLOW_CARD';
    if (backendDetail === 'Red Card') return 'RED_CARD';
  }
  if (backendType === 'subst') {
    return 'SUBSTITUTION';
  }
  if (backendType === 'Var') {
    return 'VAR';
  }
  return 'SUBSTITUTION'; // Default
}

/**
 * Transform backend match to frontend match
 */
export function transformMatch(apiMatch: APIMatch): Match {
  const status = transformMatchStatus(apiMatch.status.short);
  
  return {
    id: apiMatch.id.toString(),
    homeTeam: {
      id: apiMatch.teams.home.id.toString(),
      name: apiMatch.teams.home.name,
      logo: apiMatch.teams.home.logo,
      shortName: apiMatch.teams.home.name.substring(0, 3).toUpperCase(),
    },
    awayTeam: {
      id: apiMatch.teams.away.id.toString(),
      name: apiMatch.teams.away.name,
      logo: apiMatch.teams.away.logo,
      shortName: apiMatch.teams.away.name.substring(0, 3).toUpperCase(),
    },
    homeScore: apiMatch.goals.home ?? 0,
    awayScore: apiMatch.goals.away ?? 0,
    status,
    minute: apiMatch.status.elapsed ?? undefined,
    league: {
      id: apiMatch.league.id.toString(),
      name: apiMatch.league.name,
      logo: apiMatch.league.logo,
      country: apiMatch.league.country,
      flag: apiMatch.league.flag,
    },
    startTime: apiMatch.date,
  };
}

/**
 * Transform multiple matches
 */
export function transformMatches(apiMatches: APIMatch[]): Match[] {
  return apiMatches.map(transformMatch);
}

/**
 * Transform backend match events to frontend events
 */
export function transformMatchEvents(apiEvents: APIMatchEvent[]): MatchEvent[] {
  return apiEvents.map((event, index) => ({
    id: index.toString(),
    type: transformEventType(event.type, event.detail),
    minute: event.time.elapsed,
    team: 'home', // You'd need to determine this based on team ID
    player: event.player.name,
    description: `${event.detail} by ${event.player.name}`,
    extraTime: event.time.extra ?? undefined,
  }));
}

/**
 * Transform backend match statistics to frontend stats
 */
export function transformMatchStatistics(
  apiStats: APIMatchStatistics[]
): MatchStats | undefined {
  if (!apiStats || apiStats.length < 2) return undefined;

  const homeStats = apiStats[0]?.statistics || {};
  const awayStats = apiStats[1]?.statistics || {};

  const getStat = (stats: any, key: string): number => {
    const value = stats[key];
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const parsed = parseInt(value.replace('%', ''), 10);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  };

  return {
    possession: {
      home: getStat(homeStats, 'ball_possession') || getStat(homeStats, 'possession'),
      away: getStat(awayStats, 'ball_possession') || getStat(awayStats, 'possession'),
    },
    shots: {
      home: getStat(homeStats, 'total_shots'),
      away: getStat(awayStats, 'total_shots'),
    },
    shotsOnTarget: {
      home: getStat(homeStats, 'shots_on_goal') || getStat(homeStats, 'shots_on_target'),
      away: getStat(awayStats, 'shots_on_goal') || getStat(awayStats, 'shots_on_target'),
    },
    corners: {
      home: getStat(homeStats, 'corner_kicks'),
      away: getStat(awayStats, 'corner_kicks'),
    },
    fouls: {
      home: getStat(homeStats, 'fouls'),
      away: getStat(awayStats, 'fouls'),
    },
    yellowCards: {
      home: getStat(homeStats, 'yellow_cards'),
      away: getStat(awayStats, 'yellow_cards'),
    },
    redCards: {
      home: getStat(homeStats, 'red_cards'),
      away: getStat(awayStats, 'red_cards'),
    },
  };
}

/**
 * Transform backend lineups to frontend players
 */
export function transformLineups(
  apiLineups: APIMatchLineup[]
): { homeLineup: Player[]; awayLineup: Player[] } | undefined {
  if (!apiLineups || apiLineups.length < 2) return undefined;

  const transformPlayers = (lineup: APIMatchLineup): Player[] => {
    return lineup.startXI.map((p, index) => ({
      id: p.player.id.toString(),
      name: p.player.name,
      number: p.player.number,
      position: p.player.pos,
    }));
  };

  return {
    homeLineup: transformPlayers(apiLineups[0]),
    awayLineup: transformPlayers(apiLineups[1]),
  };
}

/**
 * Transform complete match with all details
 */
export function transformMatchWithDetails(
  apiMatch: APIMatch,
  apiEvents?: APIMatchEvent[],
  apiStats?: APIMatchStatistics[],
  apiLineups?: APIMatchLineup[]
): Match {
  const match = transformMatch(apiMatch);

  if (apiEvents) {
    match.events = transformMatchEvents(apiEvents);
  }

  if (apiStats) {
    match.stats = transformMatchStatistics(apiStats);
  }

  if (apiLineups) {
    const lineups = transformLineups(apiLineups);
    if (lineups) {
      match.homeLineup = lineups.homeLineup;
      match.awayLineup = lineups.awayLineup;
    }
  }

  return match;
}
