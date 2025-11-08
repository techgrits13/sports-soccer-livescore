#!/bin/bash

echo ""
echo "Updating App Icons..."
echo ""

# Backup old icon
cp "assets/images/icon.png" "assets/images/icon-old.png" 2>/dev/null

# Copy new icon
cp "assets/images/icon.png.jpg" "assets/images/icon.png"

# Copy splash icon
cp "assets/images/icon.png.jpg" "assets/images/splash-icon.png"

echo "✓ App icon updated"
echo "✓ Splash icon updated"
echo ""
echo "Next steps:"
echo "1. Stop Expo (Ctrl+C in the running terminal)"
echo "2. Run: npx expo start -c"
echo ""
