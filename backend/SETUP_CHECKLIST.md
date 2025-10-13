# ✅ Backend Setup Checklist

Follow these steps to get your backend running:

## Prerequisites
- [ ] Node.js 14+ installed
- [ ] Supabase account created
- [ ] API keys obtained (already provided)

## Installation Steps

### 1. Install Dependencies
```bash
cd backend
npm install
```
**Status:** ⏳ Waiting

---

### 2. Configure Environment Variables
Create a `.env` file in the `backend` directory:

```env
# Server
PORT=3000
NODE_ENV=development

# Supabase - GET FROM YOUR PROJECT
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_anon_key

# API Keys - Already Configured
API_FOOTBALL_KEY=0a52086f1f715c501ff514a367484514
FOOTBALL_DATA_KEY=eb5465774d0a43a89cdc1d2ff8275419

# Quota Limits
API_FOOTBALL_DAILY_LIMIT=100
FOOTBALL_DATA_DAILY_LIMIT=10
```

**Get Supabase credentials:**
1. Go to https://supabase.com/dashboard
2. Create new project (or select existing)
3. Go to Settings → API
4. Copy "Project URL" → Use as SUPABASE_URL
5. Copy "anon/public" key → Use as SUPABASE_KEY

**Status:** ⏳ Waiting

---

### 3. Setup Supabase Database

**Option A: Using Supabase Dashboard (Recommended)**
1. Open your Supabase project
2. Go to SQL Editor
3. Click "New query"
4. Copy entire contents of `supabase-schema.sql`
5. Paste and click "Run"

**Option B: Using Init Script**
```bash
npm run init-db
```

**Verify:**
- Check Tables in Supabase Dashboard → Database → Tables
- Should see: users, favorites, api_usage, notifications, user_settings, match_cache

**Status:** ⏳ Waiting

---

### 4. Create Logs Directory
```bash
mkdir logs
```

**Status:** ⏳ Waiting

---

### 5. Start Development Server
```bash
npm run dev
```

You should see:
```
🚀 Server is running on port 3000
📝 Environment: development
🔗 API Documentation: http://localhost:3000/
❤️  Health Check: http://localhost:3000/health
```

**Status:** ⏳ Waiting

---

### 6. Test the Backend

**Test 1: Health Check**
```bash
curl http://localhost:3000/health
```
Expected: `{"success":true,"message":"Server is running",...}`

**Test 2: API Status**
```bash
curl http://localhost:3000/api/status
```
Expected: Quota information for both APIs

**Test 3: Get Popular Leagues**
```bash
curl http://localhost:3000/api/leagues/popular
```
Expected: List of popular football leagues

**Status:** ⏳ Waiting

---

## Troubleshooting

### ❌ "Missing Supabase credentials"
- Check `.env` file exists in `backend/` directory
- Verify SUPABASE_URL and SUPABASE_KEY are set
- Make sure there are no extra spaces or quotes

### ❌ "Cannot find module"
- Run `npm install` again
- Delete `node_modules` and run `npm install`

### ❌ "Could not query api_usage table"
- Database tables not created
- Run the SQL from `supabase-schema.sql` in Supabase SQL Editor

### ❌ "Port 3000 already in use"
- Change PORT in `.env` file to 3001 or another port
- Or stop the process using port 3000

### ❌ "API quota exceeded"
- Check current usage: `curl http://localhost:3000/api/status`
- Wait for quota to reset (resets daily)
- Adjust cache TTL to reduce API calls

---

## Next Steps

Once all tests pass:

1. **Connect Frontend**
   - Update your React Native app to use `http://localhost:3000/api`
   - Use the endpoints from `API_ENDPOINTS.md`

2. **Monitor Usage**
   - Regularly check `/api/status`
   - Watch for quota warnings

3. **Customize Settings**
   - Adjust cache TTL in `.env`
   - Modify rate limits in `src/middleware/rateLimiter.js`

4. **Deploy to Production**
   - Use a service like Railway, Render, or Heroku
   - Update SUPABASE credentials for production
   - Set NODE_ENV=production
   - Configure CORS_ORIGIN

---

## Files Created

✅ Package configuration
✅ Smart API Manager
✅ All services (Match, League, Team, Favorite)
✅ All controllers
✅ All routes
✅ Middleware (errors, rate limiting)
✅ Express server
✅ Database schema
✅ Configuration files
✅ Documentation

**Total Files:** 30+

---

## Support

- **Full Documentation:** `README.md`
- **API Reference:** `API_ENDPOINTS.md`
- **Quick Start:** `QUICK_START.md`

---

**Ready to build something amazing! 🚀⚽**
