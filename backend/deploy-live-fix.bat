@echo off
echo ========================================
echo Deploying Live Matches Fix
echo ========================================
echo.

echo Step 1: Adding all backend changes...
git add -A
echo.

echo Step 2: Committing...
git commit -m "Fix live matches endpoint - use 'today' parameter instead of 'inplay'"
echo.

echo Step 3: Pushing to Render...
git push
echo.

echo ========================================
echo Done! Wait 2-3 minutes for Render to deploy.
echo Then test: cd .. ^&^& node test-all-endpoints.js
echo ========================================
pause
