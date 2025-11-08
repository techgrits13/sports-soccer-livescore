# 🚀 Deployment Guide - Fresh Start

This guide will help you deploy your Sport Soccer Livescore backend to Render.com with the new API configuration.

## 📋 Prerequisites

- [x] Supabase account and project (already set up)
- [x] Livescore API key: `6c9510e4bca93f2d49e8687289dbb6269a3434c155c0892465b059bf9e422247`
- [x] API-Football key: `NgK0qEkAg2`
- [ ] Render.com account (free tier works)
- [ ] GitHub account for deployment

---

## 🗄️ Step 1: Update Supabase Database

Run the migration script to add new API tracking columns:

1. Go to your Supabase project: https://olkfxyoskuhrgycopsox.supabase.co
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `backend/MIGRATION_SQL.sql`
4. Click **Run** to execute the migration

This adds `livescore_requests` and `api_football_requests` columns to track your new APIs.

---

## 🔧 Step 2: Configure Local Environment

### Option A: Use the new .env file

Copy the new environment file:

```bash
cd backend
cp .env.new .env
```

### Option B: Manual setup

Create `backend/.env` with these values:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
SUPABASE_URL=https://olkfxyoskuhrgycopsox.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sa2Z4eW9za3Vocmd5Y29wc294Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyNDkwODIsImV4cCI6MjA3NTgyNTA4Mn0.KZBa01B7RlfnvYSGAj4MFYxEdIcEiM28TaXaSNGZYoE

# Primary API
LIVESCORE_API_KEY=6c9510e4bca93f2d49e8687289dbb6269a3434c155c0892465b059bf9e422247
LIVESCORE_API_SECRET=
LIVESCORE_DAILY_LIMIT=10000

# Failover API
API_FOOTBALL_KEY=NgK0qEkAg2
API_FOOTBALL_DAILY_LIMIT=100

# Caching
CACHE_TTL_LIVE=30
CACHE_TTL_FIXTURES=1800
CACHE_TTL_STANDINGS=3600
```

---

## 🧪 Step 3: Test Locally

Make sure everything works before deploying:

```bash
cd backend

# Install dependencies
npm install

# Start the server
npm start
```

Test the endpoints:

```bash
# Health check
curl http://localhost:3000/health

# API status (check quota)
curl http://localhost:3000/api/status

# Live matches (if any are live)
curl http://localhost:3000/api/matches/live
```

You should see:
- ✅ Server running on port 3000
- ✅ Connected to Supabase
- ✅ API quota showing for both providers
- ✅ No errors in console

---

## 🌐 Step 4: Deploy to Render.com

### 4.1 Create New Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Select the repository with your code

### 4.2 Configure Service

**Basic Settings:**
- **Name:** `sport-soccer-livescore` (or your preferred name)
- **Environment:** `Node`
- **Region:** Choose closest to your users
- **Branch:** `main` (or your default branch)
- **Root Directory:** `backend`
- **Build Command:** `npm install`
- **Start Command:** `npm start`

**Advanced Settings:**
- **Plan:** Free (or paid for better performance)
- **Auto-Deploy:** Yes

### 4.3 Add Environment Variables

In Render dashboard, add these environment variables:

**Required Variables:**

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `3000` |
| `SUPABASE_URL` | `https://olkfxyoskuhrgycopsox.supabase.co` |
| `SUPABASE_KEY` | Your Supabase anon key |
| `LIVESCORE_API_KEY` | `6c9510e4bca93f2d49e8687289dbb6269a3434c155c0892465b059bf9e422247` |
| `API_FOOTBALL_KEY` | `NgK0qEkAg2` |

**Optional Variables:**

| Key | Value |
|-----|-------|
| `LIVESCORE_API_SECRET` | (if you have one) |
| `LIVESCORE_DAILY_LIMIT` | `10000` |
| `API_FOOTBALL_DAILY_LIMIT` | `100` |
| `CACHE_TTL_LIVE` | `30` |
| `CACHE_TTL_FIXTURES` | `1800` |
| `CORS_ORIGIN` | `*` |

### 4.4 Deploy

1. Click **Create Web Service**
2. Wait for deployment (usually 2-5 minutes)
3. Your backend URL will be: `https://your-service-name.onrender.com`

---

## ✅ Step 5: Verify Deployment

Test your deployed backend:

```bash
# Replace with your actual Render URL
export BACKEND_URL=https://your-service-name.onrender.com

# Health check
curl $BACKEND_URL/health

# API status
curl $BACKEND_URL/api/status

# Live matches
curl $BACKEND_URL/api/matches/live
```

Expected responses:
```json
// Health
{"success":true,"message":"Server is running","timestamp":"..."}

// Status
{
  "success": true,
  "apis": {
    "livescoreApi": {
      "used": 0,
      "limit": 10000,
      "remaining": 10000,
      "percentage": 0
    },
    "apiFootball": {
      "used": 0,
      "limit": 100,
      "remaining": 100,
      "percentage": 0
    }
  }
}
```

---

## 📱 Step 6: Update Frontend

Update your frontend to use the new backend URL:

**For development:**
```bash
# In project root
export EXPO_PUBLIC_API_BASE_URL=https://your-service-name.onrender.com
npm start
```

**For production builds:**
Update `eas.json`:
```json
{
  "build": {
    "production": {
      "env": {
        "EXPO_PUBLIC_API_BASE_URL": "https://your-service-name.onrender.com"
      }
    }
  }
}
```

---

## 🔍 Monitoring & Maintenance

### Check API Usage

Visit: `https://your-service-name.onrender.com/api/status`

This shows:
- Current quota usage for both APIs
- Remaining requests
- Percentage used
- Last reset time

### View Logs

In Render dashboard:
1. Select your service
2. Click **Logs** tab
3. Monitor for errors or API issues

### Cache Performance

The system uses aggressive caching:
- **Live matches:** 30 seconds
- **Fixtures:** 30 minutes
- **Standings:** 1 hour
- **Static data:** 24 hours

This significantly reduces API usage!

### API Failover

The system automatically:
1. Tries **Livescore API** first
2. Falls back to **API-Football** if quota exceeded
3. Logs which API is being used

---

## 🐛 Troubleshooting

### "Cannot connect to database"
- Check Supabase URL and key in environment variables
- Verify Supabase project is running
- Run the migration SQL script

### "API quota exceeded"
- Check `/api/status` to see usage
- Wait for daily reset (midnight UTC)
- Caching should prevent this with normal usage

### "No matches returned"
- Some APIs may need specific endpoint formats
- Check logs for API errors
- Verify API keys are correct

### "Deployment failed"
- Check Render logs for specific error
- Verify all environment variables are set
- Ensure `backend/package.json` has all dependencies

---

## 📊 API Information

### Livescore API (Primary)
- **Base URL:** `https://livescore-api.com/api-client`
- **Daily Limit:** 10,000 requests
- **Authentication:** Key + Secret (URL parameters)
- **Documentation:** https://live-score-api.com/documentation

### API-Football (Failover)
- **Base URL:** `https://v3.football.api-sports.io`
- **Daily Limit:** 100 requests
- **Authentication:** `x-apisports-key` header
- **Documentation:** https://www.api-football.com/documentation-v3

---

## 🎯 Next Steps

After successful deployment:

1. ✅ Monitor initial API usage
2. ✅ Test all endpoints
3. ✅ Update frontend configuration
4. ✅ Test mobile app with production backend
5. ✅ Set up monitoring/alerts (optional)
6. ✅ Consider Redis for better caching (optional)

---

## 💡 Tips for Production

### Optimize API Usage
- Cache is your friend - default settings are aggressive
- Monitor quota daily via `/api/status`
- Most requests should be served from cache

### Scaling
- Free tier should handle development/testing
- Consider paid tier for production traffic
- Add Redis for distributed caching if needed

### Security
- Never commit `.env` file
- Rotate API keys periodically
- Use CORS to restrict frontend origins in production

---

## 📞 Support

If you encounter issues:
1. Check Render logs
2. Check Supabase logs
3. Verify API keys are valid
4. Test endpoints with curl/Postman

---

**You're all set! 🎉**

Your backend is now configured with:
- ✅ Livescore API (primary)
- ✅ API-Football (failover)
- ✅ Supabase database
- ✅ Aggressive caching
- ✅ Quota tracking
- ✅ Ready for Render deployment
