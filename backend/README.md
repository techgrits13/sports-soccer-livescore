# ⚽ Sport Soccer Livescore Backend API

A robust Node.js + Express backend with intelligent API management, caching, and Supabase integration for the Sport Soccer Livescore application.

## 🌟 Features

### Smart API Management
- **Dual API Integration**: Seamlessly uses both API-Football.com and Football-Data.org
- **Intelligent Routing**: Automatically selects the best API for each request based on:
  - Data type requirements
  - Available quota
  - API priority for specific endpoints
- **Quota Protection**: Prevents quota depletion with smart tracking and fallback mechanisms
- **Aggressive Caching**: Multi-tier caching strategy to minimize API calls

### Core Features
- ✅ Live match scores and updates
- ✅ Match details, statistics, events, and lineups
- ✅ League standings and information
- ✅ Team data and statistics
- ✅ Top scorers and assists
- ✅ User favorites management
- ✅ Real-time quota monitoring

## 🚀 Getting Started

### Prerequisites
- Node.js 14+ installed
- Supabase account and project
- API keys from API-Football.com and Football-Data.org

### Installation

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Copy `.env.example` to `.env`
   ```bash
   cp .env.example .env
   ```
   
   - Edit `.env` and add your credentials:
   ```env
   PORT=3000
   NODE_ENV=development
   
   # Add your Supabase credentials
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_KEY=your_supabase_anon_key
   
   # API Keys (already configured)
   API_FOOTBALL_KEY=0a52086f1f715c501ff514a367484514
   FOOTBALL_DATA_KEY=eb5465774d0a43a89cdc1d2ff8275419
   
   # Adjust quota limits based on your API plans
   API_FOOTBALL_DAILY_LIMIT=100
   FOOTBALL_DATA_DAILY_LIMIT=10
   ```

4. **Set up Supabase database**
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Run the SQL from `supabase-schema.sql`
   
   Or use the initialization script:
   ```bash
   npm run init-db
   ```

5. **Start the server**
   
   Development mode with auto-reload:
   ```bash
   npm run dev
   ```
   
   Production mode:
   ```bash
   npm start
   ```

6. **Verify installation**
   - Open browser to http://localhost:3000
   - You should see the API documentation
   - Check health: http://localhost:3000/health
   - Monitor quota: http://localhost:3000/api/status

## 📡 API Endpoints

### Matches

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/matches/live` | Get all live matches |
| GET | `/api/matches?date=YYYY-MM-DD` | Get matches by date |
| GET | `/api/matches?from=DATE&to=DATE` | Get matches by date range |
| GET | `/api/matches/:id` | Get match details |
| GET | `/api/matches/:id/statistics` | Get match statistics |
| GET | `/api/matches/:id/events` | Get match events (goals, cards, etc.) |
| GET | `/api/matches/:id/lineups` | Get team lineups |
| GET | `/api/matches/league/:leagueId` | Get matches by league |
| GET | `/api/matches/team/:teamId` | Get matches by team |

### Leagues

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/leagues` | Get all leagues |
| GET | `/api/leagues/popular` | Get popular leagues |
| GET | `/api/leagues/:id` | Get league by ID |
| GET | `/api/leagues/country/:country` | Get leagues by country |
| GET | `/api/leagues/:id/standings` | Get league standings |
| GET | `/api/leagues/:id/topscorers` | Get top scorers |
| GET | `/api/leagues/:id/topassists` | Get top assists |

### Teams

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/teams/:id` | Get team by ID |
| GET | `/api/teams/search?name=` | Search teams by name |
| GET | `/api/teams/:id/statistics?league=` | Get team statistics |
| GET | `/api/teams/:id/squad` | Get team squad |
| GET | `/api/teams/league/:leagueId` | Get teams by league |

### Favorites

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/favorites/team` | Add team to favorites |
| POST | `/api/favorites/league` | Add league to favorites |
| POST | `/api/favorites/match` | Add match to favorites |
| GET | `/api/favorites/:userId` | Get user favorites |
| GET | `/api/favorites/:userId/check` | Check if favorited |
| DELETE | `/api/favorites/:id` | Remove favorite |

### System

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/status` | Get API quota and cache status |
| POST | `/api/cache/clear` | Clear cache (admin) |
| GET | `/health` | Health check |

## 🎯 Smart API Management

### How It Works

The backend uses a sophisticated API manager that:

1. **Analyzes each request** to determine the required data type
2. **Checks quota availability** for both APIs
3. **Selects the optimal API** based on:
   - Data type priority (each API excels at different data)
   - Remaining quota
   - API-specific features
4. **Implements fallback** if the primary API fails
5. **Caches responses** with intelligent TTL per data type

### Cache Strategy

| Data Type | Cache Duration | Reason |
|-----------|---------------|--------|
| Live Matches | 30 seconds | Real-time updates needed |
| Match Fixtures | 30 minutes | Changes infrequently |
| Standings | 1 hour | Updated after matches |
| Match Statistics | 5 minutes | Updates during match |
| Teams/Leagues | 24 hours | Static data |
| Player Data | 24 hours | Rarely changes |

### API Priority Routing

**API-Football.com** is prioritized for:
- Live match scores
- Detailed match data
- Team lineups
- Player statistics
- Match events

**Football-Data.org** is prioritized for:
- Competition/league data
- League standings
- Team information

This ensures optimal use of each API's strengths while preserving quota.

## 📊 Monitoring

### Check API Status

```bash
curl http://localhost:3000/api/status
```

Response:
```json
{
  "success": true,
  "data": {
    "quota": {
      "apiFootball": {
        "used": 45,
        "limit": 100,
        "remaining": 55,
        "percentage": 45
      },
      "footballData": {
        "used": 3,
        "limit": 10,
        "remaining": 7,
        "percentage": 30
      }
    },
    "cache": {
      "keys": 127,
      "hits": 1543,
      "misses": 98,
      "hitRate": 0.94
    }
  }
}
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3000 |
| `NODE_ENV` | Environment | development |
| `SUPABASE_URL` | Supabase project URL | - |
| `SUPABASE_KEY` | Supabase anon key | - |
| `API_FOOTBALL_KEY` | API-Football key | (provided) |
| `FOOTBALL_DATA_KEY` | Football-Data key | (provided) |
| `API_FOOTBALL_DAILY_LIMIT` | Daily request limit | 100 |
| `FOOTBALL_DATA_DAILY_LIMIT` | Daily request limit | 10 |
| `CACHE_TTL_SHORT` | Short cache (seconds) | 300 |
| `CACHE_TTL_MEDIUM` | Medium cache (seconds) | 1800 |
| `CACHE_TTL_LONG` | Long cache (seconds) | 3600 |
| `CACHE_TTL_VERY_LONG` | Very long cache (seconds) | 86400 |

## 🔐 Security Features

- **Helmet.js**: Security headers
- **CORS**: Configurable cross-origin requests
- **Rate Limiting**: Prevents API abuse
  - General API: 100 req/15min per IP
  - Live endpoints: 20 req/minute per IP
  - Admin endpoints: 30 req/15min per IP
- **Input Validation**: Request parameter validation
- **Error Handling**: Comprehensive error handling
- **Logging**: Winston logger for all requests

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js       # Supabase configuration
│   │   └── logger.js          # Winston logger setup
│   ├── controllers/
│   │   ├── matchController.js
│   │   ├── leagueController.js
│   │   ├── teamController.js
│   │   └── favoriteController.js
│   ├── services/
│   │   ├── apiManager.js      # Smart API management
│   │   ├── matchService.js
│   │   ├── leagueService.js
│   │   ├── teamService.js
│   │   └── favoriteService.js
│   ├── routes/
│   │   ├── matchRoutes.js
│   │   ├── leagueRoutes.js
│   │   ├── teamRoutes.js
│   │   ├── favoriteRoutes.js
│   │   └── apiRoutes.js
│   ├── middleware/
│   │   ├── errorHandler.js
│   │   └── rateLimiter.js
│   ├── scripts/
│   │   └── initDatabase.js
│   └── server.js              # Main server file
├── logs/                       # Log files
├── supabase-schema.sql        # Database schema
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

## 🎓 Usage Examples

### Get Live Matches

```javascript
fetch('http://localhost:3000/api/matches/live')
  .then(res => res.json())
  .then(data => console.log(data));
```

### Get Match Details

```javascript
fetch('http://localhost:3000/api/matches/12345')
  .then(res => res.json())
  .then(data => console.log(data));
```

### Add Team to Favorites

```javascript
fetch('http://localhost:3000/api/favorites/team', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 'user-uuid',
    teamId: '33',
    teamName: 'Manchester United',
    teamLogo: 'https://...'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

## 🐛 Troubleshooting

### API Quota Issues

If you're hitting quota limits:
1. Check current usage: `GET /api/status`
2. Clear cache to force new requests: `POST /api/cache/clear`
3. Adjust cache TTL in `.env`
4. Increase `API_FOOTBALL_DAILY_LIMIT` or `FOOTBALL_DATA_DAILY_LIMIT`

### Database Connection Issues

1. Verify Supabase credentials in `.env`
2. Check if tables are created: Run `npm run init-db`
3. Verify network connectivity to Supabase

### Cache Issues

Clear cache:
```bash
curl -X POST http://localhost:3000/api/cache/clear
```

## 📝 License

This project is for educational purposes.

## 🤝 Support

For issues or questions, please check the logs in `logs/` directory or open an issue.

---

**Built with ❤️ for football fans worldwide**
