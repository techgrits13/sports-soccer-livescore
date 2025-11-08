@echo off
echo.
echo ========================================
echo  Sport Soccer Livescore - Quick Setup
echo ========================================
echo.

REM Check if .env already exists
if exist .env (
    echo WARNING: .env file already exists!
    echo.
    set /p OVERWRITE="Do you want to overwrite it? (Y/N): "
    if /i not "%OVERWRITE%"=="Y" (
        echo.
        echo Setup cancelled. Your existing .env file is unchanged.
        pause
        exit /b
    )
)

echo Creating .env file with SportMonks API key...
echo.

REM Copy from example
copy .env.example .env >nul

REM Update with the provided SportMonks API key
powershell -Command "(gc .env) -replace 'your_sportmonks_api_key_here', 'DEIlvx84BFPHnraxU14OKUAwmneXhTznnxDZl4g21EPIbgpc2ruDeamDCyMD' | Out-File -encoding ASCII .env"

echo ✓ .env file created successfully!
echo ✓ SportMonks API key configured
echo.
echo Your API configuration:
echo - Primary: SportMonks (3000 requests/day)
echo - Secondary: API-Football (optional)
echo - Tertiary: Football-Data.org (optional)
echo.
echo Next steps:
echo 1. Run: npm install
echo 2. Run: npm start
echo.
pause
