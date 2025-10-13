# 📱 Frontend Integration Guide

How to connect your React Native app to this backend.

## Setup API Client

### 1. Create API Configuration

Create `constants/api.ts` in your React Native project:

```typescript
// constants/api.ts
export const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api'  // Development
  : 'https://your-production-api.com/api';  // Production

export const API_ENDPOINTS = {
  // Matches
  MATCHES_LIVE: '/matches/live',
  MATCHES_BY_DATE: '/matches',
  MATCH_DETAILS: (id: string) => `/matches/${id}`,
  MATCH_STATISTICS: (id: string) => `/matches/${id}/statistics`,
  MATCH_EVENTS: (id: string) => `/matches/${id}/events`,
  MATCH_LINEUPS: (id: string) => `/matches/${id}/lineups`,
  
  // Leagues
  LEAGUES_ALL: '/leagues',
  LEAGUES_POPULAR: '/leagues/popular',
  LEAGUE_DETAILS: (id: string) => `/leagues/${id}`,
  LEAGUE_STANDINGS: (id: string) => `/leagues/${id}/standings`,
  LEAGUE_TOP_SCORERS: (id: string) => `/leagues/${id}/topscorers`,
  
  // Teams
  TEAM_DETAILS: (id: string) => `/teams/${id}`,
  TEAM_SEARCH: '/teams/search',
  TEAM_STATISTICS: (id: string) => `/teams/${id}/statistics`,
  TEAM_SQUAD: (id: string) => `/teams/${id}/squad`,
  
  // Favorites
  FAVORITES_ADD_TEAM: '/favorites/team',
  FAVORITES_ADD_LEAGUE: '/favorites/league',
  FAVORITES_GET: (userId: string) => `/favorites/${userId}`,
  FAVORITES_REMOVE: (id: string) => `/favorites/${id}`,
  
  // System
  API_STATUS: '/status',
};
```

### 2. Create API Service

Create `services/apiService.ts`:

```typescript
// services/apiService.ts
import { API_BASE_URL, API_ENDPOINTS } from '../constants/api';

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error?.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Matches
  async getLiveMatches() {
    return this.request(API_ENDPOINTS.MATCHES_LIVE);
  }

  async getMatchesByDate(date: string) {
    return this.request(`${API_ENDPOINTS.MATCHES_BY_DATE}?date=${date}`);
  }

  async getMatchDetails(matchId: string) {
    return this.request(API_ENDPOINTS.MATCH_DETAILS(matchId));
  }

  async getMatchStatistics(matchId: string) {
    return this.request(API_ENDPOINTS.MATCH_STATISTICS(matchId));
  }

  async getMatchEvents(matchId: string) {
    return this.request(API_ENDPOINTS.MATCH_EVENTS(matchId));
  }

  async getMatchLineups(matchId: string) {
    return this.request(API_ENDPOINTS.MATCH_LINEUPS(matchId));
  }

  // Leagues
  async getPopularLeagues() {
    return this.request(API_ENDPOINTS.LEAGUES_POPULAR);
  }

  async getLeagueStandings(leagueId: string, season?: string) {
    const query = season ? `?season=${season}` : '';
    return this.request(`${API_ENDPOINTS.LEAGUE_STANDINGS(leagueId)}${query}`);
  }

  async getTopScorers(leagueId: string) {
    return this.request(API_ENDPOINTS.LEAGUE_TOP_SCORERS(leagueId));
  }

  // Teams
  async getTeamDetails(teamId: string) {
    return this.request(API_ENDPOINTS.TEAM_DETAILS(teamId));
  }

  async searchTeams(name: string) {
    return this.request(`${API_ENDPOINTS.TEAM_SEARCH}?name=${name}`);
  }

  async getTeamStatistics(teamId: string, leagueId: string) {
    return this.request(
      `${API_ENDPOINTS.TEAM_STATISTICS(teamId)}?league=${leagueId}`
    );
  }

  // Favorites
  async addTeamFavorite(userId: string, teamId: string, teamName: string, teamLogo: string) {
    return this.request(API_ENDPOINTS.FAVORITES_ADD_TEAM, {
      method: 'POST',
      body: JSON.stringify({ userId, teamId, teamName, teamLogo }),
    });
  }

  async getUserFavorites(userId: string, type?: string) {
    const query = type ? `?type=${type}` : '';
    return this.request(`${API_ENDPOINTS.FAVORITES_GET(userId)}${query}`);
  }

  async removeFavorite(userId: string, favoriteId: string) {
    return this.request(API_ENDPOINTS.FAVORITES_REMOVE(favoriteId), {
      method: 'DELETE',
      body: JSON.stringify({ userId }),
    });
  }

  // System
  async getApiStatus() {
    return this.request(API_ENDPOINTS.API_STATUS);
  }
}

export default new ApiService();
```

## Usage Examples

### 1. Update Home Screen (Live Matches)

Update `app/(tabs)/index.tsx`:

```typescript
import { useState, useEffect } from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import apiService from '@/services/apiService';
import MatchCard from '@/components/MatchCard';

export default function HomeScreen() {
  const [liveMatches, setLiveMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadLiveMatches();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadLiveMatches, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadLiveMatches = async () => {
    try {
      const response = await apiService.getLiveMatches();
      setLiveMatches(response.data);
    } catch (error) {
      console.error('Error loading live matches:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadLiveMatches();
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={liveMatches}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <MatchCard match={item} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}
```

### 2. Update Leagues Screen

Update `app/(tabs)/leagues.tsx`:

```typescript
import { useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, Image, Text } from 'react-native';
import apiService from '@/services/apiService';
import { useRouter } from 'expo-router';

export default function LeaguesScreen() {
  const [leagues, setLeagues] = useState([]);
  const router = useRouter();

  useEffect(() => {
    loadLeagues();
  }, []);

  const loadLeagues = async () => {
    try {
      const response = await apiService.getPopularLeagues();
      setLeagues(response.data);
    } catch (error) {
      console.error('Error loading leagues:', error);
    }
  };

  const navigateToLeague = (leagueId: string) => {
    router.push({
      pathname: '/league-detail',
      params: { leagueId },
    });
  };

  return (
    <FlatList
      data={leagues}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity 
          onPress={() => navigateToLeague(item.id)}
          style={{ flexDirection: 'row', padding: 16 }}
        >
          <Image source={{ uri: item.logo }} style={{ width: 40, height: 40 }} />
          <View style={{ marginLeft: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.name}</Text>
            <Text style={{ color: '#666' }}>{item.country.name}</Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
}
```

### 3. Create Match Detail Screen

Create `app/match-detail.tsx`:

```typescript
import { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import apiService from '@/services/apiService';

export default function MatchDetailScreen() {
  const { matchId } = useLocalSearchParams();
  const [match, setMatch] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMatchData();
  }, [matchId]);

  const loadMatchData = async () => {
    try {
      const [matchRes, statsRes, eventsRes] = await Promise.all([
        apiService.getMatchDetails(matchId as string),
        apiService.getMatchStatistics(matchId as string),
        apiService.getMatchEvents(matchId as string),
      ]);

      setMatch(matchRes.data);
      setStatistics(statsRes.data);
      setEvents(eventsRes.data);
    } catch (error) {
      console.error('Error loading match data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <ScrollView>
      {/* Display match details, statistics, and events */}
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
          {match?.teams.home.name} vs {match?.teams.away.name}
        </Text>
        <Text style={{ fontSize: 32, textAlign: 'center', marginVertical: 20 }}>
          {match?.goals.home} - {match?.goals.away}
        </Text>
        
        {/* Add statistics and events display here */}
      </View>
    </ScrollView>
  );
}
```

### 4. Add Favorites Functionality

```typescript
// In any component
import apiService from '@/services/apiService';

const addToFavorites = async (teamId: string, teamName: string, teamLogo: string) => {
  try {
    const userId = 'your-user-id'; // Get from auth context
    await apiService.addTeamFavorite(userId, teamId, teamName, teamLogo);
    alert('Added to favorites!');
  } catch (error) {
    alert('Error adding to favorites');
  }
};
```

## React Hooks for Data Fetching

Create `hooks/useMatches.ts`:

```typescript
import { useState, useEffect } from 'react';
import apiService from '@/services/apiService';

export function useLiveMatches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchMatches = async () => {
      try {
        const response = await apiService.getLiveMatches();
        if (isMounted) {
          setMatches(response.data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchMatches();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchMatches, 30000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return { matches, loading, error };
}
```

Usage:

```typescript
import { useLiveMatches } from '@/hooks/useMatches';

export default function HomeScreen() {
  const { matches, loading, error } = useLiveMatches();

  if (loading) return <ActivityIndicator />;
  if (error) return <Text>Error loading matches</Text>;

  return (
    <FlatList
      data={matches}
      renderItem={({ item }) => <MatchCard match={item} />}
    />
  );
}
```

## Testing Backend Connection

Create a test screen to verify connection:

```typescript
// app/test-api.tsx
import { useState } from 'react';
import { View, Text, Button } from 'react-native';
import apiService from '@/services/apiService';

export default function TestApiScreen() {
  const [status, setStatus] = useState('');

  const testConnection = async () => {
    try {
      const response = await fetch('http://localhost:3000/health');
      const data = await response.json();
      setStatus(data.success ? '✅ Connected!' : '❌ Failed');
    } catch (error) {
      setStatus('❌ Connection Error: ' + error.message);
    }
  };

  const testApiStatus = async () => {
    try {
      const response = await apiService.getApiStatus();
      setStatus(`✅ API Status:\nAPI-Football: ${response.data.quota.apiFootball.remaining} remaining`);
    } catch (error) {
      setStatus('❌ API Status Error: ' + error.message);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
      <Button title="Test Health" onPress={testConnection} />
      <Button title="Test API Status" onPress={testApiStatus} />
      <Text style={{ marginTop: 20 }}>{status}</Text>
    </View>
  );
}
```

## Environment Variables

For production deployment, use environment variables:

```typescript
// app.config.js or app.json
export default {
  extra: {
    apiUrl: process.env.API_URL || 'http://localhost:3000/api',
  },
};

// Access in code
import Constants from 'expo-constants';

const API_BASE_URL = Constants.expoConfig?.extra?.apiUrl;
```

## Error Handling

Add global error handling:

```typescript
// utils/errorHandler.ts
export const handleApiError = (error: any) => {
  if (error.message?.includes('quota exceeded')) {
    return 'API limit reached. Please try again later.';
  }
  
  if (error.message?.includes('Network')) {
    return 'Network error. Check your connection.';
  }
  
  return error.message || 'An error occurred';
};
```

## Next Steps

1. Replace mock data in your components with API calls
2. Add loading states and error handling
3. Implement pull-to-refresh on lists
4. Add offline caching with AsyncStorage
5. Test on both iOS and Android
6. Deploy backend to production before app release

---

**You're ready to connect your frontend to the backend!** 🚀
