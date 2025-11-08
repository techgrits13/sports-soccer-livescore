#!/bin/bash

echo ""
echo "========================================"
echo " Sport Soccer Livescore - Quick Setup"
echo "========================================"
echo ""

# Check if .env already exists
if [ -f .env ]; then
    echo "⚠️  WARNING: .env file already exists!"
    echo ""
    read -p "Do you want to overwrite it? (y/n): " OVERWRITE
    if [ "$OVERWRITE" != "y" ] && [ "$OVERWRITE" != "Y" ]; then
        echo ""
        echo "✅ Setup cancelled. Your existing .env file is unchanged."
        exit 0
    fi
fi

echo "Creating .env file with SportMonks API key..."
echo ""

# Copy from example
cp .env.example .env

# Update with the provided SportMonks API key
sed -i '' 's/your_sportmonks_api_key_here/DEIlvx84BFPHnraxU14OKUAwmneXhTznnxDZl4g21EPIbgpc2ruDeamDCyMD/g' .env 2>/dev/null || \
sed -i 's/your_sportmonks_api_key_here/DEIlvx84BFPHnraxU14OKUAwmneXhTznnxDZl4g21EPIbgpc2ruDeamDCyMD/g' .env

echo "✅ .env file created successfully!"
echo "✅ SportMonks API key configured"
echo ""
echo "Your API configuration:"
echo "- Primary: SportMonks (3000 requests/day)"
echo "- Secondary: API-Football (optional)"
echo "- Tertiary: Football-Data.org (optional)"
echo ""
echo "Next steps:"
echo "1. Run: npm install"
echo "2. Run: npm start"
echo ""
