# 🚀 Quick Start Guide

## Setup in 5 Minutes

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
Create `.env` file:
```env
PORT=3000
NODE_ENV=development

# Get these from https://supabase.com
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_anon_key

# Already provided
API_FOOTBALL_KEY=0a52086f1f715c501ff514a367484514
FOOTBALL_DATA_KEY=eb5465774d0a43a89cdc1d2ff8275419

# Adjust based on your API plans
API_FOOTBALL_DAILY_LIMIT=100
FOOTBALL_DATA_DAILY_LIMIT=10
```

### 3. Setup Supabase Database
1. Go to https://supabase.com and create a project
2. Copy your project URL and anon key to `.env`
3. In Supabase Dashboard → SQL Editor → Run the SQL from `supabase-schema.sql`

### 4. Start Server
```bash
npm run dev
```

Server runs at: http://localhost:3000

## Test It Works

```bash
# Check health
curl http://localhost:3000/health

# Get live matches
curl http://localhost:3000/api/matches/live

# Check API status
curl http://localhost:3000/api/status
```

## Key Endpoints

- **Live Matches**: `GET /api/matches/live`
- **Match Details**: `GET /api/matches/:id`
- **Leagues**: `GET /api/leagues/popular`
- **Standings**: `GET /api/leagues/:id/standings`
- **Team Info**: `GET /api/teams/:id`
- **API Status**: `GET /api/status`

## Smart Features

✅ **Auto API Selection** - Uses best API for each request
✅ **Intelligent Caching** - Minimizes API calls
✅ **Quota Protection** - Prevents hitting rate limits
✅ **Auto Fallback** - Switches APIs if one fails

## Monitor Usage

```bash
curl http://localhost:3000/api/status
```

Shows:
- API quota usage for both providers
- Cache hit rate
- Remaining requests

## Troubleshooting

**Can't connect to database?**
- Check SUPABASE_URL and SUPABASE_KEY in `.env`
- Verify tables are created (run `supabase-schema.sql`)

**API quota exceeded?**
- Check usage: `GET /api/status`
- Clear cache: `POST /api/cache/clear`
- Increase limits in `.env`

**Port already in use?**
- Change PORT in `.env` file

## Next Steps

1. Connect your React Native app to `http://localhost:3000/api`
2. Monitor quota at `/api/status`
3. Adjust cache TTL in `.env` if needed
4. Read full `README.md` for all features

---

**Questions?** Check `README.md` or open an issue.
