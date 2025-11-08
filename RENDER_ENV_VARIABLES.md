# Render.com Environment Variables

Copy these **exactly** into Render's Environment Variables section:

## Required Variables:

```env
# Node Environment
NODE_ENV=production
PORT=3000

# Supabase Database
SUPABASE_URL=https://gzrhoycnpvjfjctxqsge.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6cmhveWNucHZqZmpjdHhxc2dlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA5MDU2MzYsImV4cCI6MjA0NjQ4MTYzNn0.Nfn9cjX6kx_lGpOGS8NpZz8hb6f1WuuAzWqExBWfpOg

# SoccersAPI (Primary)
SOCCERS_API_USER=qUlfO
SOCCERS_API_TOKEN=NgK0qEkAg2
SOCCERS_API_BASE_URL=https://api.soccersapi.com/v2.2
SOCCERS_DAILY_LIMIT=3000

# Livescore API (Secondary - if you activate it)
LIVESCORE_API_KEY=6c9510e4bca93f2d49e8687289dbb6269a3434c155c0892465b059bf9e422247
LIVESCORE_API_SECRET=your_secret_here_if_available
LIVESCORE_API_BASE_URL=https://livescore-api.com/api-client
LIVESCORE_DAILY_LIMIT=10000

# Cache Settings (optimize for free tier)
CACHE_ENABLED=true
CACHE_LIVE_TTL=30
CACHE_FIXTURES_TTL=1800
CACHE_LEAGUES_TTL=86400
CACHE_STANDINGS_TTL=3600
CACHE_STATISTICS_TTL=1800

# API Request Settings
API_TIMEOUT=10000
API_RETRY_ATTEMPTS=3
API_RETRY_DELAY=1000

# Logging
LOG_LEVEL=info
```

## How to Add in Render:

1. Go to https://dashboard.render.com/
2. Select your service (or create new Web Service)
3. Click **"Environment"** tab
4. Click **"Add Environment Variable"**
5. Copy each variable name and value from above
6. Click **"Save Changes"**

## Important Notes:

- ✅ PORT must be 3000 (Render will map it automatically)
- ✅ NODE_ENV must be "production"
- ✅ All cache settings optimize for free tier (reduce API calls)
- ⚠️ NEVER commit .env files to git (they're in .gitignore)
- 🔒 Keep these variables secure - they contain API keys!

## After Deploy:

Your backend will be available at:
```
https://sports-soccer-livescore-1.onrender.com
```

Test it:
```bash
curl https://sports-soccer-livescore-1.onrender.com/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-11-08T..."
}
```
