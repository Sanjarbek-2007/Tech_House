@echo off
echo ========================================
echo   Starting Local Web Server
echo ========================================
echo.
echo Your website will be available at:
echo   http://localhost:8000
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

cd /d "%~dp0"
python -m http.server 8000

pause
