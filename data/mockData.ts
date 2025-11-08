/**
 * Mock Data for Development & Testing
 * 
 * This file provides sample data for:
 * 1. Development without backend running
 * 2. Testing UI components
 * 3. User toggle between API/Mock modes (useful for demos)
 * 4. Fallback when API errors occur
 * 
 * Note: App primarily uses real API data. Mock data is secondary.
 */
import { Match, League, MatchEvent, MatchStats, Player } from '@/types/match';

export const mockLeagues: League[] = [
  {
    id: '1',
    name: 'Premier League',
    logo: '⚽',
    country: 'England',
    flag: '🏴󐁧󐁢󐁥󐁮󐁧󐁿',
  },
  {
    id: '2',
    name: 'La Liga',
    logo: '⚽',
    country: 'Spain',
    flag: '🇪🇸',
  },
  {
    id: '3',
    name: 'Serie A',
    logo: '⚽',
    country: 'Italy',
    flag: '🇮🇹',
  },
  {
    id: '4',
    name: 'Bundesliga',
    logo: '⚽',
    country: 'Germany',
    flag: '🇩🇪',
  },
  {
    id: '5',
    name: 'Ligue 1',
    logo: '⚽',
    country: 'France',
    flag: '🇫🇷',
  },
  {
    id: '6',
    name: 'Champions League',
    logo: '🏆',
    country: 'Europe',
    flag: '🇪🇺',
  },
];

const mockEvents: MatchEvent[] = [
  {
    id: '1',
    type: 'GOAL',
    minute: 12,
    team: 'home',
    player: 'M. Salah',
    description: 'Goal by M. Salah',
  },
  {
    id: '2',
    type: 'YELLOW_CARD',
    minute: 23,
    team: 'away',
    player: 'K. De Bruyne',
    description: 'Yellow card for K. De Bruyne',
  },
  {
    id: '3',
    type: 'GOAL',
    minute: 35,
    team: 'away',
    player: 'E. Haaland',
    description: 'Goal by E. Haaland',
  },
  {
    id: '4',
    type: 'GOAL',
    minute: 45,
    team: 'home',
    player: 'D. Núñez',
    description: 'Goal by D. Núñez',
    extraTime: 2,
  },
];

const mockStats: MatchStats = {
  possession: { home: 48, away: 52 },
  shots: { home: 14, away: 16 },
  shotsOnTarget: { home: 6, away: 8 },
  corners: { home: 5, away: 7 },
  fouls: { home: 11, away: 9 },
  yellowCards: { home: 2, away: 3 },
  redCards: { home: 0, away: 0 },
};

const mockHomeLineup: Player[] = [
  { id: '1', name: 'Alisson', number: 1, position: 'GK' },
  { id: '2', name: 'T. Alexander-Arnold', number: 66, position: 'RB' },
  { id: '3', name: 'V. van Dijk', number: 4, position: 'CB' },
  { id: '4', name: 'I. Konaté', number: 5, position: 'CB' },
  { id: '5', name: 'A. Robertson', number: 26, position: 'LB' },
  { id: '6', name: 'M. Salah', number: 11, position: 'RW' },
  { id: '7', name: 'D. Núñez', number: 9, position: 'ST' },
];

const mockAwayLineup: Player[] = [
  { id: '8', name: 'Ederson', number: 31, position: 'GK' },
  { id: '9', name: 'K. Walker', number: 2, position: 'RB' },
  { id: '10', name: 'R. Dias', number: 3, position: 'CB' },
  { id: '11', name: 'N. Aké', number: 6, position: 'CB' },
  { id: '12', name: 'J. Cancelo', number: 7, position: 'LB' },
  { id: '13', name: 'K. De Bruyne', number: 17, position: 'CM' },
  { id: '14', name: 'E. Haaland', number: 9, position: 'ST' },
];

export const mockMatches: Match[] = [
  // Live Matches
  {
    id: '1',
    homeTeam: {
      id: 't1',
      name: 'Liverpool',
      logo: '🔴',
      shortName: 'LIV',
    },
    awayTeam: {
      id: 't2',
      name: 'Manchester City',
      logo: '🔵',
      shortName: 'MCI',
    },
    homeScore: 2,
    awayScore: 1,
    status: 'LIVE',
    minute: 67,
    league: mockLeagues[0],
    startTime: new Date().toISOString(),
    events: mockEvents,
    stats: mockStats,
    homeLineup: mockHomeLineup,
    awayLineup: mockAwayLineup,
  },
  {
    id: '2',
    homeTeam: {
      id: 't3',
      name: 'Real Madrid',
      logo: '⚪',
      shortName: 'RMA',
    },
    awayTeam: {
      id: 't4',
      name: 'Barcelona',
      logo: '🔵',
      shortName: 'BAR',
    },
    homeScore: 1,
    awayScore: 1,
    status: 'HALFTIME',
    minute: 45,
    league: mockLeagues[1],
    startTime: new Date().toISOString(),
  },
  {
    id: '3',
    homeTeam: {
      id: 't5',
      name: 'AC Milan',
      logo: '🔴',
      shortName: 'MIL',
    },
    awayTeam: {
      id: 't6',
      name: 'Inter Milan',
      logo: '🔵',
      shortName: 'INT',
    },
    homeScore: 0,
    awayScore: 0,
    status: 'LIVE',
    minute: 23,
    league: mockLeagues[2],
    startTime: new Date().toISOString(),
  },
  // Upcoming Matches
  {
    id: '4',
    homeTeam: {
      id: 't7',
      name: 'Bayern Munich',
      logo: '🔴',
      shortName: 'BAY',
    },
    awayTeam: {
      id: 't8',
      name: 'Borussia Dortmund',
      logo: '🟡',
      shortName: 'DOR',
    },
    homeScore: 0,
    awayScore: 0,
    status: 'UPCOMING',
    league: mockLeagues[3],
    startTime: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
  },
  {
    id: '5',
    homeTeam: {
      id: 't9',
      name: 'PSG',
      logo: '🔵',
      shortName: 'PSG',
    },
    awayTeam: {
      id: 't10',
      name: 'Marseille',
      logo: '⚪',
      shortName: 'MAR',
    },
    homeScore: 0,
    awayScore: 0,
    status: 'UPCOMING',
    league: mockLeagues[4],
    startTime: new Date(Date.now() + 7200000).toISOString(), // 2 hours from now
  },
  // Finished Matches
  {
    id: '6',
    homeTeam: {
      id: 't11',
      name: 'Arsenal',
      logo: '🔴',
      shortName: 'ARS',
    },
    awayTeam: {
      id: 't12',
      name: 'Chelsea',
      logo: '🔵',
      shortName: 'CHE',
    },
    homeScore: 3,
    awayScore: 1,
    status: 'FINISHED',
    league: mockLeagues[0],
    startTime: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
  },
  {
    id: '7',
    homeTeam: {
      id: 't13',
      name: 'Juventus',
      logo: '⚫',
      shortName: 'JUV',
    },
    awayTeam: {
      id: 't14',
      name: 'AS Roma',
      logo: '🟡',
      shortName: 'ROM',
    },
    homeScore: 2,
    awayScore: 2,
    status: 'FINISHED',
    league: mockLeagues[2],
    startTime: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
  },
];
