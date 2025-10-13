# 📡 API Endpoints Reference

Base URL: `http://localhost:3000/api`

## 🏟️ Matches

| Endpoint | Description |
|----------|-------------|
| `GET /matches/live` | Get all live matches |
| `GET /matches?date=YYYY-MM-DD` | Get matches by date |
| `GET /matches?from=DATE&to=DATE` | Get matches in date range |
| `GET /matches/:id` | Get match details |
| `GET /matches/:id/statistics` | Get match stats |
| `GET /matches/:id/events` | Get goals, cards, subs |
| `GET /matches/:id/lineups` | Get team lineups |
| `GET /matches/league/:leagueId` | Get league matches |
| `GET /matches/team/:teamId` | Get team matches |

## 🏆 Leagues

| Endpoint | Description |
|----------|-------------|
| `GET /leagues` | Get all leagues |
| `GET /leagues/popular` | Get popular leagues |
| `GET /leagues/:id` | Get league details |
| `GET /leagues/country/:country` | Get country leagues |
| `GET /leagues/:id/standings` | Get standings table |
| `GET /leagues/:id/topscorers` | Get top scorers |
| `GET /leagues/:id/topassists` | Get top assists |

## 👥 Teams

| Endpoint | Description |
|----------|-------------|
| `GET /teams/:id` | Get team details |
| `GET /teams/search?name=` | Search teams |
| `GET /teams/:id/statistics?league=` | Get team stats |
| `GET /teams/:id/squad` | Get team squad |
| `GET /teams/league/:leagueId` | Get league teams |

## ⭐ Favorites

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/favorites/team` | POST | Add team favorite |
| `/favorites/league` | POST | Add league favorite |
| `/favorites/match` | POST | Add match favorite |
| `/favorites/:userId` | GET | Get user favorites |
| `/favorites/:userId/check` | GET | Check if favorited |
| `/favorites/:id` | DELETE | Remove favorite |

## 🔧 System

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/status` | GET | API quota & cache stats |
| `/cache/clear` | POST | Clear cache |
| `/health` | GET | Health check |

## Response Format

**Success:**
```json
{
  "success": true,
  "count": 10,
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "error": "Error message"
}
```

## Examples

### Get Live Matches
```bash
curl http://localhost:3000/api/matches/live
```

### Get Premier League Standings
```bash
curl http://localhost:3000/api/leagues/39/standings
```

### Add Team to Favorites
```bash
curl -X POST http://localhost:3000/api/favorites/team \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-123",
    "teamId": "33",
    "teamName": "Manchester United",
    "teamLogo": "https://..."
  }'
```

### Check API Status
```bash
curl http://localhost:3000/api/status
```

## Rate Limits

- General API: 100 requests / 15 minutes
- Live endpoints: 20 requests / minute
- System endpoints: 30 requests / 15 minutes

## Popular League IDs

- **39** - Premier League
- **140** - La Liga
- **135** - Serie A
- **78** - Bundesliga
- **61** - Ligue 1
- **2** - UEFA Champions League
- **3** - UEFA Europa League

For complete documentation, see `README.md`
