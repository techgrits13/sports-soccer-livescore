# ⚽ Sport Soccer Livescore

A modern, real-time soccer livescore application built with React Native and Expo.

## Features

### 📱 Screens

1. **Home / Live Matches Screen**
   - Primary landing screen with live, recent, and upcoming matches
   - Tabs for "Live," "Upcoming," and "Results"
   - Match cards showing team logos, scores, status, and time
   - Pull-to-refresh for updates

2. **Match Detail Screen**
   - Detailed scoreline with team information
   - Events timeline (goals, cards, substitutions)
   - Match statistics (possession, shots, corners, fouls)
   - Team lineups

3. **Leagues / Competitions Screen**
   - List of leagues with logos and flags
   - Search/filter functionality
   - Match count per league
   - Navigate to league-specific matches

4. **Favorites Screen**
   - View followed teams/leagues/matches
   - Prioritized live updates
   - Empty state with call-to-action

5. **Settings / Profile Screen**
   - Notification preferences management
   - Theme support (light/dark mode)
   - User profile
   - About/version information

## Get Started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the development server

   ```bash
   npx expo start
   ```

3. Run on your preferred platform
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Press `w` for web browser
   - Scan QR code with Expo Go app on your mobile device

## Tech Stack

- **React Native** - Cross-platform mobile framework
- **Expo** - Development platform and tooling
- **Expo Router** - File-based routing
- **TypeScript** - Type safety
- **React Navigation** - Navigation library

## Project Structure

```
├── app/
│   ├── (tabs)/           # Tab-based screens
│   │   ├── index.tsx     # Home/Live Matches
│   │   ├── leagues.tsx   # Leagues screen
│   │   ├── favorites.tsx # Favorites screen
│   │   └── settings.tsx  # Settings screen
│   ├── match-detail.tsx  # Match detail screen
│   └── league-matches.tsx # League matches screen
├── components/           # Reusable components
│   └── match-card.tsx    # Match card component
├── types/               # TypeScript types
│   └── match.ts         # Match-related types
├── data/                # Mock data
│   └── mockData.ts      # Sample matches and leagues
└── constants/           # App constants
    └── theme.ts         # Color themes

```

## Future Enhancements

- 🔴 Real-time API integration for live scores
- 🔔 Push notifications for match events
- 👤 User authentication and profile sync
- ⭐ Persistent favorites storage
- 🌍 Multiple language support
- 📊 Advanced statistics and analytics
- 🎥 Match highlights and video clips

## Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
