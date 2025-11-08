@echo off
echo.
echo 🔄 Restarting Backend Server...
echo.

REM Kill any existing node processes on port 3000
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3000" ^| find "LISTENING"') do taskkill /F /PID %%a 2>nul

echo ✓ Cleared port 3000
echo.
echo 🚀 Starting server...
echo.

npm run dev
