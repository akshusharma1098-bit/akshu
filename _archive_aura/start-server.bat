@echo off
title Aura Studio Web Server
echo Starting Aura Studio local server on http://localhost:8080...
echo You can stop the server anytime by closing this window or pressing Ctrl+C.
echo.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0server.ps1"
pause
