@echo off
echo ========================================
echo Deploying Backend - Cache Disabled
echo ========================================
echo.

echo Step 1: Adding changes...
git add src/services/apiManager.js
echo.

echo Step 2: Committing...
git commit -m "Disable caching for debugging live matches timeout"
echo.

echo Step 3: Pushing to Render...
git push
echo.

echo ========================================
echo Done! Wait 2-3 minutes for Render to deploy.
echo Then run: cd .. && node test-all-endpoints.js
echo ========================================
pause
