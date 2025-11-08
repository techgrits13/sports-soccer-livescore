@echo off
echo.
echo Updating App Icons...
echo.

REM Backup old icon
copy "assets\images\icon.png" "assets\images\icon-old.png" >nul 2>&1

REM Copy new icon
copy /Y "assets\images\icon.png.jpg" "assets\images\icon.png" >nul

REM Copy splash icon
copy /Y "assets\images\icon.png.jpg" "assets\images\splash-icon.png" >nul

echo ✓ App icon updated
echo ✓ Splash icon updated
echo.
echo Next steps:
echo 1. Stop Expo (Ctrl+C in the running terminal)
echo 2. Run: npx expo start -c
echo.
pause
