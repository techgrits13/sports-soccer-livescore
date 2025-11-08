@echo off
echo ========================================
echo Deploying Backend Rate Limiter Fix
echo ========================================
echo.

cd backend

echo Step 1: Checking git status...
git status
echo.

echo Step 2: Adding changes...
git add src/middleware/rateLimiter.js
echo.

echo Step 3: Committing changes...
git commit -m "Fix rate limiter trust proxy configuration for Render deployment"
echo.

echo Step 4: Pushing to trigger Render redeploy...
git push
echo.

echo ========================================
echo Done! Render should now redeploy.
echo Check your Render dashboard for deployment status.
echo ========================================
pause
