/**
 * Match Service
 * API service for match-related operations
 */

import { api } from './api-client';
import { API_ENDPOINTS } from '@/config/api';
import {
  APIMatch,
  APIMatchEvent,
  APIMatchStatistics,
  APIMatchLineup,
} from '@/types/api';
import { Match } from '@/types/match';
import {
  transformMatches,
  transformMatch,
  transformMatchWithDetails,
  transformMatchEvents,
  transformMatchStatistics,
  transformLineups,
} from './transformers';

export class MatchService {
  /**
   * Get live matches
   */
  static async getLiveMatches(): Promise<Match[]> {
    try {
      const response = await api.get<APIMatch[]>(API_ENDPOINTS.MATCHES.LIVE);
      
      if (response.success && response.data) {
        return transformMatches(response.data);
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching live matches:', error);
      throw error;
    }
  }

  /**
   * Get matches by date
   * @param date - Date in YYYY-MM-DD format
   */
  static async getMatchesByDate(date: string): Promise<Match[]> {
    try {
      const response = await api.get<APIMatch[]>(API_ENDPOINTS.MATCHES.BY_DATE, { date });
      
      if (response.success && response.data) {
        return transformMatches(response.data);
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching matches by date:', error);
      throw error;
    }
  }

  /**
   * Get matches by date range
   */
  static async getMatchesByDateRange(from: string, to: string): Promise<Match[]> {
    try {
      const response = await api.get<APIMatch[]>(API_ENDPOINTS.MATCHES.BY_DATE_RANGE, {
        from,
        to,
      });
      
      if (response.success && response.data) {
        return transformMatches(response.data);
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching matches by date range:', error);
      throw error;
    }
  }

  /**
   * Get match details by ID
   */
  static async getMatchById(matchId: string): Promise<Match | null> {
    try {
      const response = await api.get<APIMatch>(API_ENDPOINTS.MATCHES.BY_ID(matchId));
      
      if (response.success && response.data) {
        return transformMatch(response.data);
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching match details:', error);
      throw error;
    }
  }

  /**
   * Get complete match details with events, stats, and lineups
   */
  static async getCompleteMatchDetails(matchId: string): Promise<Match | null> {
    try {
      // Fetch all data in parallel
      const [matchResponse, eventsResponse, statsResponse, lineupsResponse] = 
        await Promise.allSettled([
          api.get<APIMatch>(API_ENDPOINTS.MATCHES.BY_ID(matchId)),
          api.get<APIMatchEvent[]>(API_ENDPOINTS.MATCHES.EVENTS(matchId)),
          api.get<APIMatchStatistics[]>(API_ENDPOINTS.MATCHES.STATISTICS(matchId)),
          api.get<APIMatchLineup[]>(API_ENDPOINTS.MATCHES.LINEUPS(matchId)),
        ]);

      // Extract match data
      if (matchResponse.status !== 'fulfilled' || !matchResponse.value.success) {
        return null;
      }

      const match = matchResponse.value.data;
      if (!match) return null;

      // Extract events
      const events = eventsResponse.status === 'fulfilled' && eventsResponse.value.success
        ? eventsResponse.value.data
        : undefined;

      // Extract statistics
      const stats = statsResponse.status === 'fulfilled' && statsResponse.value.success
        ? statsResponse.value.data
        : undefined;

      // Extract lineups
      const lineups = lineupsResponse.status === 'fulfilled' && lineupsResponse.value.success
        ? lineupsResponse.value.data
        : undefined;

      return transformMatchWithDetails(match, events, stats, lineups);
    } catch (error) {
      console.error('Error fetching complete match details:', error);
      throw error;
    }
  }

  /**
   * Get match statistics
   */
  static async getMatchStatistics(matchId: string) {
    try {
      const response = await api.get<APIMatchStatistics[]>(
        API_ENDPOINTS.MATCHES.STATISTICS(matchId)
      );
      
      if (response.success && response.data) {
        return transformMatchStatistics(response.data);
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching match statistics:', error);
      throw error;
    }
  }

  /**
   * Get match events
   */
  static async getMatchEvents(matchId: string) {
    try {
      const response = await api.get<APIMatchEvent[]>(
        API_ENDPOINTS.MATCHES.EVENTS(matchId)
      );
      
      if (response.success && response.data) {
        return transformMatchEvents(response.data);
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching match events:', error);
      throw error;
    }
  }

  /**
   * Get match lineups
   */
  static async getMatchLineups(matchId: string) {
    try {
      const response = await api.get<APIMatchLineup[]>(
        API_ENDPOINTS.MATCHES.LINEUPS(matchId)
      );
      
      if (response.success && response.data) {
        return transformLineups(response.data);
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching match lineups:', error);
      throw error;
    }
  }

  /**
   * Get matches by league
   */
  static async getMatchesByLeague(
    leagueId: string,
    season?: string
  ): Promise<Match[]> {
    try {
      const params = season ? { season } : undefined;
      const response = await api.get<APIMatch[]>(
        API_ENDPOINTS.MATCHES.BY_LEAGUE(leagueId),
        params
      );
      
      if (response.success && response.data) {
        return transformMatches(response.data);
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching matches by league:', error);
      throw error;
    }
  }

  /**
   * Get matches by team
   */
  static async getMatchesByTeam(
    teamId: string,
    season?: string
  ): Promise<Match[]> {
    try {
      const params = season ? { season } : undefined;
      const response = await api.get<APIMatch[]>(
        API_ENDPOINTS.MATCHES.BY_TEAM(teamId),
        params
      );
      
      if (response.success && response.data) {
        return transformMatches(response.data);
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching matches by team:', error);
      throw error;
    }
  }

  /**
   * Get today's matches
   */
  static async getTodaysMatches(): Promise<Match[]> {
    const today = new Date().toISOString().split('T')[0];
    return this.getMatchesByDate(today);
  }

  /**
   * Get upcoming matches (next 7 days)
   */
  static async getUpcomingMatches(): Promise<Match[]> {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    const from = today.toISOString().split('T')[0];
    const to = nextWeek.toISOString().split('T')[0];
    
    return this.getMatchesByDateRange(from, to);
  }

  /**
   * Get recent matches (past 7 days)
   */
  static async getRecentMatches(): Promise<Match[]> {
    const today = new Date();
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const from = lastWeek.toISOString().split('T')[0];
    const to = today.toISOString().split('T')[0];
    
    return this.getMatchesByDateRange(from, to);
  }
}
