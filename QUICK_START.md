# ⚡ Quick Start Guide - Frontend + Backend Integration

## 🎯 What's New

Your Sport Soccer Livescore app now connects to a real backend API! You can:
- ✅ Fetch live match data from real football APIs
- ✅ View match details, statistics, and lineups
- ✅ Toggle between API and Mock data modes
- ✅ Auto-refresh live matches every 30 seconds

## 🚀 Getting Started (5 Minutes)

### Step 1: Configure the API URL

Open `config/api.ts` and update the `getBaseURL()` function:

**If testing on your phone/device:**
```typescript
const getBaseURL = (): string => {
  if (__DEV__) {
    const localIP = '192.168.1.XXX'; // ← Replace with YOUR computer's IP
    return `http://${localIP}:3000`;
  }
  return 'https://your-production-api.com';
};
```

**Find your IP address:**
- **Windows:** Open CMD and type `ipconfig`
- **Mac:** Open Terminal and type `ifconfig | grep inet`
- Look for something like `192.168.1.105`

**If testing on iOS Simulator or web:**
```typescript
return 'http://localhost:3000';
```

**If testing on Android Emulator:**
```typescript
return 'http://10.0.2.2:3000';
```

### Step 2: Start the Backend

Open a **new terminal** window:

```bash
cd backend
npm run dev
```

You should see:
```
🚀 Server is running on port 3000
✓ Database connection successful
✨ Backend refinements applied successfully
```

### Step 3: Start the Frontend

In your **original terminal** window:

```bash
npm start
```

Press:
- **`a`** for Android
- **`i`** for iOS
- **`w`** for Web

### Step 4: Test the Connection

1. **Open the app**
2. **Look for the toggle** in the top-right: **🌐 Live**
3. **If you see an error:**
   - Click the **📝 Mock** button to use sample data
   - Go back and check your API URL in Step 1
4. **If it works:**
   - You should see "Loading matches..."
   - Then either real match data or "No matches available"

## 🎛️ Features

### Toggle Between API and Mock Data

**Home Screen:**
- **🌐 Live** = Real API data
- **📝 Mock** = Sample data (works offline)

**Match Detail Screen:**
- Click the icon in top-right to toggle

### Pull to Refresh

Pull down on any screen to refresh the data.

### Auto-Refresh

Live matches automatically refresh every 30 seconds.

## 🐛 Troubleshooting

### "Unable to connect to server"

**Solution 1: Check backend is running**
```bash
cd backend
npm run dev
```

**Solution 2: Check your IP in config/api.ts**
- Make sure it matches your computer's IP
- Make sure phone and computer are on same WiFi

**Solution 3: Test backend directly**
Open in browser: `http://YOUR_IP:3000/health`

Should return:
```json
{"success": true, "message": "Server is running"}
```

**Solution 4: Use Mock data while debugging**
Click **📝 Mock** button to use sample data and continue testing.

### Backend returns no matches

This is normal! The backend calls real football APIs which may have:
- No live matches at this time
- API quota limits reached
- No matches scheduled

**Solutions:**
- Check different tabs: Live / Upcoming / Results
- Use **📝 Mock** mode to see sample data
- Check backend logs for API errors

### Network request failed

**Solutions:**
- Ensure phone and computer on same WiFi
- Check firewall isn't blocking port 3000
- Try restarting Expo: press `r` in terminal
- Check the URL has `http://` not `https://`

## 📁 Project Structure

```
sport-soccer-livescore/
├── config/
│   └── api.ts                  ← Configure API URL here
├── services/
│   ├── api-client.ts           ← Axios HTTP client
│   ├── match-service.ts        ← Match API calls
│   └── transformers.ts         ← Data transformation
├── hooks/
│   └── use-matches.ts          ← React hooks for API
├── app/
│   ├── (tabs)/index.tsx        ← Home screen with API
│   └── match-detail.tsx        ← Match detail with API
└── backend/                    ← Backend API server
    ├── src/server.js
    └── ...
```

## 🎓 Usage Examples

### In Your Components

```typescript
import { useLiveMatches } from '@/hooks/use-matches';

function MyComponent() {
  const { matches, loading, error, refresh } = useLiveMatches();

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error}</Text>;
  
  return <MatchList matches={matches} />;
}
```

### Available Hooks

```typescript
// Live matches (auto-refreshing)
useLiveMatches({ refreshInterval: 30000 })

// Today's matches
useTodaysMatches()

// Upcoming matches (next 7 days)
useUpcomingMatches()

// Recent matches (past 7 days)
useRecentMatches()

// Match details
useMatchDetails(matchId)
```

## 📚 Documentation

- **Full Integration Guide:** `API_INTEGRATION.md`
- **Backend Documentation:** `backend/BACKEND_REFINEMENTS.md`
- **API Endpoints:** `backend/API_ENDPOINTS.md`

## ✅ Checklist

- [ ] Backend is running on port 3000
- [ ] API URL is configured in `config/api.ts`
- [ ] Frontend app is running
- [ ] Can toggle between 🌐 API and 📝 Mock modes
- [ ] Pull-to-refresh works
- [ ] Can view match details

## 🎉 Next Steps

1. **Customize the API:**
   - Add more endpoints (leagues, teams)
   - Add user authentication
   - Add favorites sync

2. **Enhance the UI:**
   - Add animations
   - Improve error states
   - Add more match statistics

3. **Deploy:**
   - Deploy backend to production
   - Update API URL for production
   - Build and publish the app

---

**Need Help?**
- Read `API_INTEGRATION.md` for detailed troubleshooting
- Check backend logs in `backend/logs/` folder
- Test endpoints directly with `curl` or Postman

**Everything working?** Great! You're ready to build awesome features! 🚀⚽
