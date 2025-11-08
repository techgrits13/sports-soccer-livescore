# Caching System Guide

## ✅ Caching is Already Implemented!

Your backend has intelligent caching that **automatically saves your API quota**.

---

## 🎯 How It Works

### First Request (Cache Miss)
```
User → Backend → API Call → SoccersAPI
                     ↓
                  Cache Store (30min-24h)
                     ↓
              Uses 1 API Request
```

### Subsequent Requests (Cache Hit)
```
User → Backend → Cache → Response
              ↓
       Uses 0 API Requests ✅
```

---

## ⏱️ Cache Durations

| Data Type | Cache Duration | Reason |
|-----------|---------------|---------|
| **Live Matches** | 30 seconds | Updates frequently during games |
| **Fixtures** | 30 minutes | Match schedules don't change often |
| **Standings** | 1 hour | League tables update slowly |
| **Teams** | 24 hours | Team info rarely changes |
| **Leagues** | 24 hours | League data is static |
| **Players** | 24 hours | Player info rarely changes |
| **Statistics** | 5 minutes | Stats update periodically |

---

## 💰 Quota Protection

With **100 requests/day** on Free Plan:

### Without Caching ❌
- 10 users × 10 requests = **100 requests in minutes**
- Quota exhausted quickly!

### With Caching ✅
- First request: 1 API call
- Next 100 requests (within TTL): **0 API calls**
- **Saves 99+ requests!**

---

## 📊 Monitor Cache Performance

### View Cache Stats
```bash
curl http://192.168.1.100:3000/api/test/cache-stats
```

Response:
```json
{
  "success": true,
  "cacheStats": {
    "hits": 45,
    "misses": 5,
    "keys": 8,
    "size": "1.2 MB"
  },
  "cacheTTLs": {
    "live": 30,
    "fixtures": 1800,
    "standings": 3600,
    "teams": 86400,
    "leagues": 86400
  }
}
```

**Hit Rate**: `45/(45+5) = 90%` → **90% of requests saved!**

---

## 🔍 See Caching in Action

Watch your backend terminal:

### Cache Miss (First Request)
```
❌ Cache MISS for fixtures - fetching from API
🌐 No cache, calling API for fixtures
Making request to SoccersAPI for fixtures
💾 Cached fixtures for 30m 0s
```

### Cache Hit (Subsequent Requests)
```
✅ Cache HIT for fixtures - API call saved!
💰 Cache saved API request for fixtures
```

---

## 🧪 Test Caching

### 1. Make a request
```bash
curl http://192.168.1.100:3000/api/leagues/popular
```
**Result**: Cache MISS → Uses 1 API request

### 2. Make the same request again
```bash
curl http://192.168.1.100:3000/api/leagues/popular
```
**Result**: Cache HIT → Uses 0 API requests ✅

### 3. Check your SoccersAPI dashboard
You'll see only **1 request** was made!

---

## 🗑️ Clear Cache (For Testing)

### Clear All Cache
```bash
curl -X POST http://192.168.1.100:3000/api/test/clear-cache
```

### Clear Specific Data Type
```bash
curl -X POST "http://192.168.1.100:3000/api/test/clear-cache?dataType=fixtures"
```

---

## 🎛️ Adjust Cache Duration

Edit `backend/src/services/apiManager.js`:

```javascript
this.cacheTTL = {
  live: 30,           // Increase to 60 for less frequent updates
  fixtures: 1800,     // Increase to 3600 for more caching
  standings: 3600,    // Adjust as needed
  // ...
};
```

Or set via environment variables in `.env`:
```
CACHE_TTL_LIVE=30
CACHE_TTL_FIXTURES=1800
CACHE_TTL_STANDINGS=3600
```

---

## 📈 Best Practices

### 1. **Don't Disable Cache**
Unless debugging, always keep caching enabled.

### 2. **Monitor Hit Rate**
Aim for **80%+ cache hit rate** to maximize quota savings.

### 3. **Adjust TTLs Based on Usage**
- High traffic? → Increase TTLs
- Need fresh data? → Decrease TTLs

### 4. **Use Background Refresh**
For critical data, refresh cache in background before expiry.

---

## 🚨 Quota Alerts

Backend automatically warns when quota is low:

```
⚠️  Warning: SoccersAPI quota at 90% (90/100 requests)
❌ Error: SoccersAPI quota exceeded! Using cached data only.
```

---

## ✅ Summary

- ✅ **Caching is automatic** - no code changes needed
- ✅ **Saves 80-95% of API requests**
- ✅ **Configurable TTLs** for different data types
- ✅ **Real-time monitoring** via endpoints
- ✅ **Intelligent fallback** to cache when quota exceeded

Your Free Plan quota is protected! 🎉
