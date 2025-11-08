# Deploy Backend to Render.com - Step by Step

## 🚀 Quick Deploy (5 Minutes)

### Step 1: Push Code to GitHub

```bash
cd backend
git add .
git commit -m "Ready for Render deployment with SoccersAPI"
git push origin backend-only
```

---

## Step 2: Create Render Account

1. Go to https://render.com/
2. Click **"Get Started"**
3. Sign up with GitHub

---

## Step 3: Create New Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `techgrits13/sports-soccer-livescore`
3. Click **"Connect"** next to your repo

---

## Step 4: Configure Service

Fill in these settings:

| Field | Value |
|-------|-------|
| **Name** | `sports-soccer-livescore` |
| **Region** | Choose closest to you |
| **Branch** | `backend-only` |
| **Root Directory** | `backend` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `node src/server.js` |
| **Instance Type** | `Free` |

---

## Step 5: Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Copy these exactly:

```
NODE_ENV=production
PORT=3000
SUPABASE_URL=https://gzrhoycnpvjfjctxqsge.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6cmhveWNucHZqZmpjdHhxc2dlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA5MDU2MzYsImV4cCI6MjA0NjQ4MTYzNn0.Nfn9cjX6kx_lGpOGS8NpZz8hb6f1WuuAzWqExBWfpOg
SOCCERS_API_USER=qUlfO
SOCCERS_API_TOKEN=NgK0qEkAg2
SOCCERS_API_BASE_URL=https://api.soccersapi.com/v2.2
SOCCERS_DAILY_LIMIT=3000
LIVESCORE_API_KEY=6c9510e4bca93f2d49e8687289dbb6269a3434c155c0892465b059bf9e422247
LIVESCORE_API_BASE_URL=https://livescore-api.com/api-client
LIVESCORE_DAILY_LIMIT=10000
CACHE_ENABLED=true
CACHE_LIVE_TTL=30
CACHE_FIXTURES_TTL=1800
CACHE_LEAGUES_TTL=86400
API_TIMEOUT=10000
LOG_LEVEL=info
```

**Pro Tip:** Use the "Bulk Add" feature:
1. Click **"Add from .env"**
2. Paste all variables at once
3. Click **"Add Variables"**

---

## Step 6: Deploy!

1. Click **"Create Web Service"**
2. Wait 5-10 minutes for first deploy
3. Watch the logs for any errors

---

## Step 7: Verify Deployment

### Test Health Endpoint

Your backend URL will be: `https://sports-soccer-livescore-1.onrender.com`

```bash
curl https://sports-soccer-livescore-1.onrender.com/health
```

Expected:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-11-08T..."
}
```

### Test Matches Endpoint

```bash
curl https://sports-soccer-livescore-1.onrender.com/api/matches/live
```

Should return match data!

---

## Step 8: Update Frontend to Use Render URL

**File: `config/api.ts`**

```typescript
const API_BASE_URL = Platform.select({
  android: __DEV__ 
    ? 'http://192.168.1.100:3000'  // Local development
    : 'https://sports-soccer-livescore-1.onrender.com',  // Production
  ios: __DEV__
    ? 'http://localhost:3000'
    : 'https://sports-soccer-livescore-1.onrender.com',
  default: 'https://sports-soccer-livescore-1.onrender.com',
});
```

---

## 🎯 Important Notes

### Free Tier Limits:
- ✅ 750 hours/month (always on!)
- ✅ Automatic HTTPS
- ✅ Auto-deploys on git push
- ⚠️ Spins down after 15 min inactivity
- ⚠️ First request after sleep: ~30 seconds

### Keep Backend Alive (Optional):

Add a cron job to ping your backend every 10 minutes:

1. Go to https://cron-job.org/
2. Create free account
3. Add job: `https://sports-soccer-livescore-1.onrender.com/health`
4. Schedule: Every 10 minutes

This prevents the backend from sleeping!

---

## 📊 Monitoring

### View Logs:
1. Go to Render Dashboard
2. Click your service
3. Click **"Logs"** tab
4. See real-time logs

### Metrics:
- Click **"Metrics"** tab
- See CPU, Memory, Response times

### Restart Service:
- Click **"Manual Deploy"** → **"Deploy latest commit"**

---

## 🔧 Troubleshooting

### Issue: Build Failed
**Check:**
- Root directory is set to `backend`
- Build command is `npm install`
- All dependencies in package.json

### Issue: Server Not Starting
**Check:**
- Start command is `node src/server.js`
- PORT environment variable is set
- Logs for specific errors

### Issue: Database Connection Failed
**Check:**
- SUPABASE_URL is correct
- SUPABASE_KEY is correct
- Supabase project is active

### Issue: API Returns Empty Data
**Check:**
- Environment variables are all set
- SoccersAPI credentials are valid
- Check quota: https://soccersapi.com/dashboard

---

## 🎉 Success Checklist

- [ ] Backend deployed successfully
- [ ] Health endpoint returns 200
- [ ] Matches endpoint returns data
- [ ] Logs show no errors
- [ ] Database connected
- [ ] API quota sufficient
- [ ] Frontend updated with Render URL
- [ ] App tested with production backend

---

## Auto-Deploy Setup

Render automatically deploys when you push to GitHub!

```bash
# Make changes locally
git add .
git commit -m "Update feature"
git push origin backend-only

# Render automatically:
# 1. Detects the push
# 2. Builds your app
# 3. Deploys new version
# 4. ~3-5 minutes total
```

---

## Cost Optimization Tips

1. **Use Caching Aggressively**
   - Cache live scores: 30 seconds
   - Cache fixtures: 30 minutes  
   - Cache leagues: 24 hours
   - Reduces API calls by 90%!

2. **Monitor API Usage**
   - Check `/api/test/api-manager` endpoint
   - Watch quota status
   - Adjust cache TTL if needed

3. **Optimize Database Queries**
   - Use indexes on Supabase
   - Limit result sets
   - Cache frequent queries

---

## Support

- **Render Docs:** https://render.com/docs
- **Render Discord:** https://discord.gg/render
- **Render Status:** https://status.render.com

Your backend is now live globally! 🌍
