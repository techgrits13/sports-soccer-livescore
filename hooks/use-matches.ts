/**
 * useMatches Hook
 * Custom hooks for fetching match data
 */

import { useState, useEffect, useCallback } from 'react';
import { Match } from '@/types/match';
import { MatchService } from '@/services/match-service';
import { APIError } from '@/services/api-client';
import { useToast } from '@/components/ui/toast';

export interface UseMatchesOptions {
  autoFetch?: boolean;
  refreshInterval?: number; // in milliseconds
}

export interface UseMatchesResult {
  matches: Match[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

/**
 * Hook to fetch live matches
 */
export function useLiveMatches(options: UseMatchesOptions = {}): UseMatchesResult {
  const { autoFetch = true, refreshInterval } = options;
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { show } = useToast();

  const fetchMatches = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await MatchService.getLiveMatches();
      setMatches(data || []);
      if (!data || data.length === 0) {
        show('No live matches at the moment', 2000);
      }
    } catch (err) {
      const errorMessage = err instanceof APIError
        ? err.message
        : 'Failed to fetch live matches';
      setError(errorMessage);
      console.error('Error in useLiveMatches:', err);
      setMatches([]);
      show(errorMessage, 2500);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchMatches();
    }
  }, [autoFetch, fetchMatches]);

  // Auto-refresh if interval is set
  useEffect(() => {
    if (refreshInterval && refreshInterval > 0) {
      const intervalId = setInterval(fetchMatches, refreshInterval);
      return () => clearInterval(intervalId);
    }
  }, [refreshInterval, fetchMatches]);

  return {
    matches,
    loading,
    error,
    refresh: fetchMatches,
  };
}

/**
 * Hook to fetch today's matches
 */
export function useTodaysMatches(options: UseMatchesOptions = {}): UseMatchesResult {
  const { autoFetch = true } = options;
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { show } = useToast();

  const fetchMatches = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await MatchService.getTodaysMatches();
      setMatches(data || []);
      if (!data || data.length === 0) {
        show('No matches scheduled for today', 2000);
      }
    } catch (err) {
      const errorMessage = err instanceof APIError
        ? err.message
        : 'Failed to fetch today\'s matches';
      setError(errorMessage);
      console.error('Error in useTodaysMatches:', err);
      setMatches([]);
      show(errorMessage, 2500);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchMatches();
    }
  }, [autoFetch, fetchMatches]);

  return {
    matches,
    loading,
    error,
    refresh: fetchMatches,
  };
}

/**
 * Hook to fetch upcoming matches
 */
export function useUpcomingMatches(options: UseMatchesOptions = {}): UseMatchesResult {
  const { autoFetch = true } = options;
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { show } = useToast();

  const fetchMatches = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await MatchService.getUpcomingMatches();
      setMatches(data || []);
      if (!data || data.length === 0) {
        show('No upcoming matches found', 2000);
      }
    } catch (err) {
      const errorMessage = err instanceof APIError
        ? err.message
        : 'Failed to fetch upcoming matches';
      setError(errorMessage);
      console.error('Error in useUpcomingMatches:', err);
      setMatches([]);
      show(errorMessage, 2500);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchMatches();
    }
  }, [autoFetch, fetchMatches]);

  return {
    matches,
    loading,
    error,
    refresh: fetchMatches,
  };
}

/**
 * Hook to fetch recent/finished matches
 */
export function useRecentMatches(options: UseMatchesOptions = {}): UseMatchesResult {
  const { autoFetch = true } = options;
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { show } = useToast();

  const fetchMatches = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await MatchService.getRecentMatches();
      setMatches(data || []);
      if (!data || data.length === 0) {
        show('No recent matches found', 2000);
      }
    } catch (err) {
      const errorMessage = err instanceof APIError
        ? err.message
        : 'Failed to fetch recent matches';
      setError(errorMessage);
      console.error('Error in useRecentMatches:', err);
      setMatches([]);
      show(errorMessage, 2500);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchMatches();
    }
  }, [autoFetch, fetchMatches]);

  return {
    matches,
    loading,
    error,
    refresh: fetchMatches,
  };
}

/**
 * Hook to fetch match by ID with complete details
 */
export function useMatchDetails(matchId: string | null) {
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMatch = useCallback(async () => {
    if (!matchId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await MatchService.getCompleteMatchDetails(matchId);
      setMatch(data);
    } catch (err) {
      const errorMessage = err instanceof APIError
        ? err.message
        : 'Failed to fetch match details';
      setError(errorMessage);
      console.error('Error in useMatchDetails:', err);
    } finally {
      setLoading(false);
    }
  }, [matchId]);

  useEffect(() => {
    if (matchId) {
      fetchMatch();
    }
  }, [matchId, fetchMatch]);

  return {
    match,
    loading,
    error,
    refresh: fetchMatch,
  };
}
