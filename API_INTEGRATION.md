# 🔗 Frontend-Backend API Integration Guide

This document explains how the Sport Soccer Livescore frontend connects to the backend API.

## 📋 Overview

The frontend React Native app now has a complete API integration layer that communicates with the Node.js backend. The integration includes:

- ✅ **Type-safe API client** with Axios
- ✅ **Custom React hooks** for data fetching
- ✅ **Data transformers** to convert backend format to frontend format
- ✅ **Error handling** with user-friendly messages
- ✅ **Loading states** and refresh capabilities
- ✅ **Mock data fallback** for development/testing

## 🏗️ Architecture

```
Frontend (React Native)
│
├── Components (UI)
│   └── Uses hooks
│
├── Hooks (Custom)
│   ├── useLiveMatches
│   ├── useMatchDetails
│   └── useUpcomingMatches
│       └── Call Services
│
├── Services (API Layer)
│   ├── MatchService
│   ├── API Client (Axios)
│   └── Data Transformers
│       └── Make HTTP Requests
│
└── Backend API (Node.js + Express)
    ├── GET /api/matches/live
    ├── GET /api/matches/:id
    └── ... (other endpoints)
```

## 📁 File Structure

### New Files Created

```
sport-soccer-livescore/
├── config/
│   └── api.ts                    # API configuration and endpoints
├── types/
│   └── api.ts                    # Backend API response types
├── services/
│   ├── api-client.ts             # Axios client with interceptors
│   ├── match-service.ts          # Match API service layer
│   └── transformers.ts           # Data transformation utilities
└── hooks/
    └── use-matches.ts            # Custom React hooks for API calls
```

### Modified Files

```
app/
├── (tabs)/
│   └── index.tsx                 # Home screen with API integration
└── match-detail.tsx              # Match detail with API integration
```

## 🔧 Configuration

### 1. Backend URL Setup

Edit `config/api.ts` to set your backend URL:

```typescript
const getBaseURL = (): string => {
  if (__DEV__) {
    // For development:
    
    // Option 1: Localhost (iOS Simulator, Web)
    return 'http://localhost:3000';
    
    // Option 2: Your computer's IP (Physical devices, Expo Go)
    // const localIP = '192.168.1.100'; // Replace with your IP
    // return `http://${localIP}:3000`;
    
    // Option 3: Android Emulator
    // return 'http://10.0.2.2:3000';
  }
  
  // For production
  return 'https://your-production-api.com';
};
```

### 2. Find Your Local IP Address

**Windows:**
```bash
ipconfig
# Look for "IPv4 Address" under your active network adapter
```

**Mac/Linux:**
```bash
ifconfig
# Look for "inet" under your active network adapter (usually en0 or wlan0)
```

**Example:**
```typescript
const localIP = '192.168.1.105'; // Your computer's IP
return `http://${localIP}:3000`;
```

## 🚀 Usage

### In Components

#### Using Custom Hooks

```typescript
import { useLiveMatches } from '@/hooks/use-matches';

function MyComponent() {
  const { matches, loading, error, refresh } = useLiveMatches({
    autoFetch: true,
    refreshInterval: 30000 // Refresh every 30 seconds
  });

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return <MatchList matches={matches} />;
}
```

#### Available Hooks

```typescript
// Live matches (auto-refreshing)
const { matches, loading, error, refresh } = useLiveMatches({
  autoFetch: true,
  refreshInterval: 30000
});

// Today's matches
const { matches, loading, error, refresh } = useTodaysMatches();

// Upcoming matches (next 7 days)
const { matches, loading, error, refresh } = useUpcomingMatches();

// Recent matches (past 7 days)
const { matches, loading, error, refresh } = useRecentMatches();

// Match details with events, stats, lineups
const { match, loading, error, refresh } = useMatchDetails(matchId);
```

#### Direct Service Calls

```typescript
import { MatchService } from '@/services/match-service';

async function fetchData() {
  try {
    // Get live matches
    const liveMatches = await MatchService.getLiveMatches();
    
    // Get match by ID
    const match = await MatchService.getMatchById('12345');
    
    // Get complete match details
    const fullMatch = await MatchService.getCompleteMatchDetails('12345');
    
    // Get matches by date
    const matches = await MatchService.getMatchesByDate('2024-10-15');
    
  } catch (error) {
    console.error('API Error:', error);
  }
}
```

## 🔄 Data Flow

### 1. API Request Flow

```
Component
  ↓ (uses hook)
useMatchDetails(matchId)
  ↓ (calls service)
MatchService.getCompleteMatchDetails(matchId)
  ↓ (makes parallel requests)
API Client → [GET /api/matches/:id,
             GET /api/matches/:id/events,
             GET /api/matches/:id/statistics,
             GET /api/matches/:id/lineups]
  ↓ (receives responses)
Backend API
  ↓ (transforms data)
Transformers.transformMatchWithDetails()
  ↓ (returns to component)
Match Object (Frontend Format)
```

### 2. Data Transformation

Backend API returns data in API-Football format:
```json
{
  "success": true,
  "data": {
    "id": 12345,
    "teams": {
      "home": { "id": 33, "name": "Manchester United", "logo": "..." },
      "away": { "id": 34, "name": "Liverpool", "logo": "..." }
    },
    "goals": { "home": 2, "away": 1 },
    "status": { "short": "FT", "long": "Full Time", "elapsed": 90 }
  }
}
```

Transformer converts to frontend format:
```json
{
  "id": "12345",
  "homeTeam": { "id": "33", "name": "Manchester United", "logo": "..." },
  "awayTeam": { "id": "34", "name": "Liverpool", "logo": "..." },
  "homeScore": 2,
  "awayScore": 1,
  "status": "FINISHED",
  "minute": 90
}
```

## 🎛️ Features

### 1. Mode Switching (API vs Mock)

Both Home Screen and Match Detail have toggles:

**Home Screen:**
- Click **🌐 Live** to use real API
- Click **📝 Mock** to use mock data

**Match Detail:**
- Click **🌐** icon to use real API
- Click **📝** icon to use mock data

### 2. Auto-Refresh

Live matches refresh automatically every 30 seconds:
```typescript
useLiveMatches({
  refreshInterval: 30000 // 30 seconds
});
```

### 3. Pull-to-Refresh

Pull down on any screen to manually refresh data.

### 4. Error Handling

Errors are displayed with retry options:
```
⚠️ Unable to connect to server
[Retry] [Use Mock Data]
```

### 5. Loading States

- Initial load: Full-screen spinner
- Refresh: Pull-to-refresh indicator
- Empty state: Helpful message

## 🐛 Troubleshooting

### Issue 1: "Unable to connect to server"

**Symptoms:**
- Error message on app launch
- Can't fetch any data

**Solutions:**

1. **Check backend is running:**
   ```bash
   cd backend
   npm run dev
   # Should see: "Server is running on port 3000"
   ```

2. **Verify backend URL in `config/api.ts`:**
   - If using physical device or Expo Go: Use your computer's IP
   - If using iOS Simulator: Use `localhost`
   - If using Android Emulator: Use `10.0.2.2`

3. **Check firewall:**
   - Make sure port 3000 is not blocked
   - Disable firewall temporarily to test

4. **Test backend directly:**
   ```bash
   # From your phone's browser or Postman
   http://YOUR_IP:3000/health
   # Should return: {"success": true, "message": "Server is running"}
   ```

### Issue 2: Network Request Failed

**Solution:**
- Make sure your phone and computer are on the same WiFi network
- Check if `http://` (not `https://`) is used in dev mode
- Restart Expo dev server: `r` in terminal

### Issue 3: No Matches Showing

**Possible Causes:**

1. **Backend has no data:**
   - Backend makes real API calls which might return no matches
   - Switch to Mock mode to see sample data

2. **API quota exceeded:**
   - Check backend logs
   - Check `/api/status` endpoint
   - Wait for quota reset or use Mock mode

3. **Date/time mismatch:**
   - Live matches only show if there are actual live games
   - Try "Upcoming" or "Results" tabs

### Issue 4: TypeScript Errors

If you see type errors after pulling changes:

```bash
# Clear TypeScript cache
npx expo start --clear

# Or restart VS Code TypeScript server
# Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"
```

## 🧪 Testing

### Test API Connection

1. **Start backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start frontend:**
   ```bash
   cd ..
   npm start
   ```

3. **Test in app:**
   - Open app
   - Should see loading indicator
   - Then matches or error message

### Test Mock vs API Mode

1. **Switch to Mock mode** (📝 icon)
   - Should immediately show mock matches
   - No loading time

2. **Switch to API mode** (🌐 icon)
   - Should show loading
   - Then real data or error

### Test Endpoints Manually

```bash
# Health check
curl http://localhost:3000/health

# Live matches
curl http://localhost:3000/api/matches/live

# Match by ID
curl http://localhost:3000/api/matches/12345

# API status
curl http://localhost:3000/api/status
```

## 📊 Performance

### Caching Strategy

The API client automatically caches responses:

```typescript
CACHE_DURATION = {
  LIVE_MATCHES: 30 * 1000,        // 30 seconds
  UPCOMING_MATCHES: 5 * 60 * 1000, // 5 minutes
  FINISHED_MATCHES: 60 * 60 * 1000, // 1 hour
  LEAGUE_DATA: 24 * 60 * 60 * 1000, // 24 hours
  TEAM_DATA: 24 * 60 * 60 * 1000,   // 24 hours
}
```

Backend also caches API responses to minimize external API calls.

### Network Optimization

- Parallel requests for match details (events, stats, lineups fetched together)
- Automatic retry with exponential backoff
- Request deduplication (same request won't fire twice)

## 🔒 Security

### API Keys

API keys are stored on the backend only. Frontend never exposes API keys.

### CORS

Backend is configured to accept requests from any origin in development:
```javascript
cors({ origin: '*' })
```

For production, update backend CORS settings to only allow your app's domain.

## 🚢 Production Deployment

### 1. Update API URL

In `config/api.ts`:
```typescript
const getBaseURL = (): string => {
  if (__DEV__) {
    return 'http://localhost:3000';
  }
  return 'https://your-production-api.com'; // Your deployed backend
};
```

### 2. Deploy Backend

Deploy your backend to:
- Heroku
- Railway
- Vercel
- AWS/GCP/Azure
- Any Node.js hosting

### 3. Update Frontend

Update the production URL and rebuild the app.

### 4. Environment Variables

Consider using environment variables:
```typescript
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
```

Then in `.env`:
```
EXPO_PUBLIC_API_URL=https://your-production-api.com
```

## 🎓 Best Practices

### 1. Always Handle Errors

```typescript
const { matches, error } = useLiveMatches();

if (error) {
  return <ErrorScreen error={error} onRetry={() => refresh()} />;
}
```

### 2. Show Loading States

```typescript
if (loading) {
  return <LoadingSpinner />;
}
```

### 3. Provide Fallbacks

```typescript
const match = useMockData || error ? mockMatch : apiMatch;
```

### 4. Use Pull-to-Refresh

```typescript
<FlatList
  refreshControl={
    <RefreshControl refreshing={loading} onRefresh={refresh} />
  }
/>
```

### 5. Auto-Refresh Live Data

```typescript
useLiveMatches({
  refreshInterval: 30000 // Only for live data
});
```

## 📚 API Reference

### MatchService

```typescript
class MatchService {
  // Get live matches
  static async getLiveMatches(): Promise<Match[]>
  
  // Get matches by date (YYYY-MM-DD)
  static async getMatchesByDate(date: string): Promise<Match[]>
  
  // Get matches by date range
  static async getMatchesByDateRange(from: string, to: string): Promise<Match[]>
  
  // Get match by ID
  static async getMatchById(matchId: string): Promise<Match | null>
  
  // Get complete match details (with events, stats, lineups)
  static async getCompleteMatchDetails(matchId: string): Promise<Match | null>
  
  // Get today's matches
  static async getTodaysMatches(): Promise<Match[]>
  
  // Get upcoming matches (next 7 days)
  static async getUpcomingMatches(): Promise<Match[]>
  
  // Get recent matches (past 7 days)
  static async getRecentMatches(): Promise<Match[]>
}
```

### API Client

```typescript
// Generic request
const response = await api.get<APIMatch[]>('/api/matches/live');

// With parameters
const response = await api.get<APIMatch[]>('/api/matches', { 
  date: '2024-10-15' 
});

// Check API health
const isHealthy = await checkAPIHealth();
```

## 🎯 Next Steps

1. **Add more endpoints:**
   - Leagues service
   - Teams service
   - Favorites service

2. **Add offline support:**
   - AsyncStorage for caching
   - Offline-first architecture

3. **Add authentication:**
   - User login/signup
   - JWT tokens
   - Protected routes

4. **Add real-time updates:**
   - WebSocket connection
   - Push notifications
   - Live score updates

5. **Performance monitoring:**
   - Track API response times
   - Error rate monitoring
   - User analytics

---

## ✅ Summary

Your frontend is now fully integrated with the backend! 🎉

**What's Working:**
- ✅ API client with error handling
- ✅ Custom hooks for easy data fetching
- ✅ Data transformation from backend to frontend
- ✅ Loading states and error messages
- ✅ Mock data fallback for development
- ✅ Auto-refresh for live matches
- ✅ Pull-to-refresh on all screens

**To Start Using:**
1. Start backend: `cd backend && npm run dev`
2. Update API URL in `config/api.ts`
3. Start frontend: `npm start`
4. Toggle between API (🌐) and Mock (📝) modes

**Need Help?**
- Check troubleshooting section above
- Review backend documentation: `backend/BACKEND_REFINEMENTS.md`
- Check API endpoints: `backend/API_ENDPOINTS.md`

---

**Happy coding! 🚀⚽**
