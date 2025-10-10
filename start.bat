@echo off
REM Start script for Indradhanu project

REM This script starts the backend and frontend each in their own PowerShell window
REM and writes their PIDs to files so we can terminate them when this script stops.

title Indradhanu - Controller
echo Starting backend in a new cmd window...
start "Indradhanu - Backend" cmd /k "cd /d %~dp0backend && if exist .venv\Scripts\python.exe ( .venv\Scripts\python.exe -m uvicorn main:app --reload ) else ( python -m uvicorn main:app --reload )"

echo Starting frontend in a new cmd window...
start "Indradhanu - Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo Both backend and frontend servers are starting in separate windows.
echo Press any key here to stop both servers and close their windows...
pause >nul

echo Stopping servers by window title...
REM Kill cmd windows (and their child processes) that were started with these titles
taskkill /FI "WINDOWTITLE eq Indradhanu - Backend" /T /F >nul 2>&1 || echo No backend window found.
taskkill /FI "WINDOWTITLE eq Indradhanu - Frontend" /T /F >nul 2>&1 || echo No frontend window found.

echo Servers stopped.

REM Start a hidden watcher process that will kill servers if this controller window is closed
:end

