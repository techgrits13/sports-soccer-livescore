#!/bin/bash

echo ""
echo "🔧 Fixing and Restarting App..."
echo ""

# Clear all caches
echo "1. Clearing Metro bundler cache..."
rm -rf node_modules/.cache
rm -rf .expo

echo "2. Clearing watchman cache..."
watchman watch-del-all 2>/dev/null || echo "   (Watchman not installed, skipping)"

echo "3. Clearing temp files..."
rm -rf /tmp/metro-* 2>/dev/null || true
rm -rf /tmp/haste-* 2>/dev/null || true

echo ""
echo "✅ Cache cleared!"
echo ""
echo "Starting Expo with clean cache..."
echo ""

# Restart Expo
npx expo start -c
