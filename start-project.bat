@echo off
title SmartMess - Mess Management Dashboard
echo ====================================================
echo      🍽️ SmartMess System চালু হচ্ছে...
echo ====================================================
echo.
cd /d "%~dp0frontend"
start "SmartMess Frontend" cmd /k "npm run dev"
echo [OK] Vite Dev Server চালু হয়েছে।
echo [OK] ব্রাউজারে সাইট ওপেন হচ্ছে...
timeout /t 3 >nul
start http://localhost:5173
exit
