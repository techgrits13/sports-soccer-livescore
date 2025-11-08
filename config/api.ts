/**
 * API Configuration
 * 
 * Configure your backend URL using environment variables:
 * 
 * Production:
 *   EXPO_PUBLIC_API_BASE_URL - Full production URL (default: Render deployment)
 * 
 * Development:
 *   EXPO_PUBLIC_DEV_API_URL - Override local backend URL
 *   Examples:
 *     - Physical device: http://192.168.1.100:3000
 *     - Android emulator: http://10.0.2.2:3000
 *     - iOS Simulator/Web: http://localhost:3000 (default)
 */

// Get the base URL based on environment
const getBaseURL = (): string => {
  // Check if running in development mode
  const isDev = __DEV__;
  // Prefer Expo public env var when provided
  const envUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
  
  if (isDev) {
    // If a dev override is provided, use it
    if (envUrl && envUrl.trim().length > 0) return envUrl;
    
    // For Expo development - defaults to localhost
    // Set EXPO_PUBLIC_DEV_API_URL environment variable to override (e.g., http://192.168.1.100:3000)
    const devApiUrl = process.env.EXPO_PUBLIC_DEV_API_URL;
    if (devApiUrl && devApiUrl.trim().length > 0) return devApiUrl;
    
    // Default to localhost (works for iOS Simulator and web)
    // For physical devices: Set EXPO_PUBLIC_DEV_API_URL=http://YOUR_IP:3000
    // For Android Emulator: Set EXPO_PUBLIC_DEV_API_URL=http://10.0.2.2:3000
    
    // For Expo Go on Android: Use your computer's local IP
    // Your IP: 192.168.1.100 (from ipconfig)
    return 'http://192.168.1.100:3000';
  }
  
  // For production, use your deployed backend URL
  if (envUrl && envUrl.trim().length > 0) return envUrl;
  return 'https://sports-soccer-livescore-1.onrender.com';
};

export const API_CONFIG = {
  BASE_URL: getBaseURL(),
  TIMEOUT: 10000, // 10 seconds
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

// API Endpoints
export const API_ENDPOINTS = {
  // Matches
  MATCHES: {
    LIVE: '/api/matches/live',
    BY_DATE: '/api/matches',
    BY_DATE_RANGE: '/api/matches',
    BY_ID: (id: string) => `/api/matches/${id}`,
    STATISTICS: (id: string) => `/api/matches/${id}/statistics`,
    EVENTS: (id: string) => `/api/matches/${id}/events`,
    LINEUPS: (id: string) => `/api/matches/${id}/lineups`,
    BY_LEAGUE: (leagueId: string) => `/api/matches/league/${leagueId}`,
    BY_TEAM: (teamId: string) => `/api/matches/team/${teamId}`,
  },
  
  // Leagues
  LEAGUES: {
    ALL: '/api/leagues',
    POPULAR: '/api/leagues/popular',
    BY_ID: (id: string) => `/api/leagues/${id}`,
    BY_COUNTRY: (country: string) => `/api/leagues/country/${country}`,
    STANDINGS: (id: string) => `/api/leagues/${id}/standings`,
    TOP_SCORERS: (id: string) => `/api/leagues/${id}/topscorers`,
    TOP_ASSISTS: (id: string) => `/api/leagues/${id}/topassists`,
  },
  
  // Teams
  TEAMS: {
    BY_ID: (id: string) => `/api/teams/${id}`,
    SEARCH: '/api/teams/search',
    STATISTICS: (id: string) => `/api/teams/${id}/statistics`,
    SQUAD: (id: string) => `/api/teams/${id}/squad`,
    BY_LEAGUE: (leagueId: string) => `/api/teams/league/${leagueId}`,
  },
  
  // Favorites
  FAVORITES: {
    ADD_TEAM: '/api/favorites/team',
    ADD_LEAGUE: '/api/favorites/league',
    ADD_MATCH: '/api/favorites/match',
    GET: (userId: string) => `/api/favorites/${userId}`,
    CHECK: (userId: string) => `/api/favorites/${userId}/check`,
    REMOVE: (id: string) => `/api/favorites/${id}`,
  },
  
  // System
  SYSTEM: {
    STATUS: '/api/status',
    HEALTH: '/health',
  },
};

// Cache durations (in milliseconds)
export const CACHE_DURATION = {
  LIVE_MATCHES: 30 * 1000, // 30 seconds
  UPCOMING_MATCHES: 5 * 60 * 1000, // 5 minutes
  FINISHED_MATCHES: 60 * 60 * 1000, // 1 hour
  LEAGUE_DATA: 24 * 60 * 60 * 1000, // 24 hours
  TEAM_DATA: 24 * 60 * 60 * 1000, // 24 hours
};
