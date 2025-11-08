# Build Android .aab File for Play Store

## Prerequisites

1. ✅ Expo Account (free at https://expo.dev)
2. ✅ Node.js installed
3. ✅ EAS CLI installed: `npm install -g eas-cli`

---

## Step 1: Update API Base URL for Production

Before building, update your API to point to Render backend:

**File: `config/api.ts`**

```typescript
const API_BASE_URL = Platform.select({
  android: 'https://sports-soccer-livescore-1.onrender.com',
  ios: 'https://sports-soccer-livescore-1.onrender.com',
  default: 'https://sports-soccer-livescore-1.onrender.com',
});
```

---

## Step 2: Login to Expo

```bash
eas login
```

Enter your Expo credentials.

---

## Step 3: Configure EAS Build

```bash
eas build:configure
```

This creates `eas.json` file. If it exists, verify it looks like this:

**File: `eas.json`**

```json
{
  "cli": {
    "version": ">= 5.2.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "aab"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

---

## Step 4: Update app.json (Important!)

**File: `app.json`**

Update these fields:

```json
{
  "expo": {
    "name": "Sport Soccer Livescore",
    "slug": "sport-soccer-livescore",
    "version": "1.0.0",
    "android": {
      "package": "com.yourname.sportsoccer",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/icon.png",
        "backgroundColor": "#ffffff"
      },
      "permissions": [
        "INTERNET",
        "ACCESS_NETWORK_STATE"
      ]
    }
  }
}
```

⚠️ **Change `com.yourname.sportsoccer` to your unique package name!**

---

## Step 5: Build the .aab File

### Option A: Build in Cloud (Recommended - Easier)

```bash
eas build --platform android --profile production
```

This will:
1. Upload your code to Expo servers
2. Build the .aab in the cloud
3. Generate a download link
4. Time: ~10-15 minutes

### Option B: Build Locally (Requires Android Studio)

```bash
eas build --platform android --profile production --local
```

---

## Step 6: Download Your .aab

After build completes:

```bash
# EAS will provide a download link like:
https://expo.dev/artifacts/eas/[build-id].aab
```

Or check your builds at: https://expo.dev/accounts/[your-username]/projects/sport-soccer-livescore/builds

---

## Step 7: Test the .aab (Optional but Recommended)

### Convert .aab to .apk for testing:

```bash
# Install bundletool
npm install -g bundletool

# Generate APK from AAB
bundletool build-apks --bundle=app.aab --output=app.apks --mode=universal

# Extract the APK
unzip app.apks -d output
```

Install the universal APK on your device:
```bash
adb install output/universal.apk
```

---

## Step 8: Upload to Google Play Console

1. Go to https://play.google.com/console
2. Create new app or select existing
3. Go to **"Release" → "Production"**
4. Click **"Create new release"**
5. Upload your `.aab` file
6. Fill in release notes
7. Review and rollout

---

## Common Issues & Solutions

### Issue: "Cannot find package name"
**Solution:** Make sure `app.json` has `android.package` field

### Issue: "Build failed - missing credentials"
**Solution:** Run `eas credentials` to set up signing keys

### Issue: "API URL not updating"
**Solution:** Clear cache: `expo start --clear`

### Issue: "App crashes on production"
**Solution:** Check if backend URL is correct and accessible

---

## Quick Commands Reference

```bash
# Login to Expo
eas login

# Configure EAS
eas build:configure

# Build production .aab
eas build --platform android --profile production

# Check build status
eas build:list

# View build logs
eas build:view [build-id]

# Generate credentials (if needed)
eas credentials
```

---

## Production Checklist ✅

Before submitting to Play Store:

- [ ] Backend deployed to Render and accessible
- [ ] API_BASE_URL points to Render URL
- [ ] Package name is unique (com.yourname.sportsoccer)
- [ ] Version code incremented
- [ ] App icon is set
- [ ] Splash screen configured
- [ ] Privacy policy URL added (if required)
- [ ] Tested .aab on real device
- [ ] All API keys working in production
- [ ] Error handling tested
- [ ] No console.log statements (use logger)

---

## Estimated Timeline

| Task | Time |
|------|------|
| Update API URL | 2 minutes |
| Configure EAS | 5 minutes |
| Build .aab (cloud) | 10-15 minutes |
| Download | 2 minutes |
| Test locally | 10 minutes |
| Upload to Play Store | 15 minutes |
| **Total** | **~45-60 minutes** |

---

## Support Links

- EAS Build Docs: https://docs.expo.dev/build/introduction/
- Play Store Console: https://play.google.com/console
- Expo Dashboard: https://expo.dev
- Render Dashboard: https://dashboard.render.com
