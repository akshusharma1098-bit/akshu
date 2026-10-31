@echo off
title Push SmartCommute to GitHub
color 0b
echo =======================================================
echo   SmartCommute - Push to GitHub
echo   Repository: https://github.com/akshusharma1098-bit/akshu.git
echo =======================================================
echo.
cd /d "D:\project"

echo Checking Git status...
git status
echo.

echo Setting branch to main...
git branch -M main

echo.
echo Pushing to GitHub (A browser login / token prompt may appear)...
echo.
git push -u origin main

echo.
echo =======================================================
if %ERRORLEVEL% EQU 0 (
    echo [SUCCESS] Code pushed successfully to GitHub!
) else (
    echo [NOTE] If it asks for password/token, use your GitHub Personal Access Token.
)
echo =======================================================
pause
