export type MatchStatus = 'LIVE' | 'UPCOMING' | 'FINISHED' | 'HALFTIME' | 'POSTPONED';

export interface Team {
  id: string;
  name: string;
  logo: string;
  shortName: string;
}

export interface MatchEvent {
  id: string;
  type: 'GOAL' | 'YELLOW_CARD' | 'RED_CARD' | 'SUBSTITUTION' | 'VAR';
  minute: number;
  team: 'home' | 'away';
  player: string;
  description: string;
  extraTime?: number;
}

export interface MatchStats {
  possession: { home: number; away: number };
  shots: { home: number; away: number };
  shotsOnTarget: { home: number; away: number };
  corners: { home: number; away: number };
  fouls: { home: number; away: number };
  yellowCards: { home: number; away: number };
  redCards: { home: number; away: number };
}

export interface Player {
  id: string;
  name: string;
  number: number;
  position: string;
}

export interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number;
  awayScore: number;
  status: MatchStatus;
  minute?: number;
  league: {
    id: string;
    name: string;
    logo: string;
    country: string;
    flag: string;
  };
  startTime: string;
  events?: MatchEvent[];
  stats?: MatchStats;
  homeLineup?: Player[];
  awayLineup?: Player[];
}

export interface League {
  id: string;
  name: string;
  logo: string;
  country: string;
  flag: string;
}
