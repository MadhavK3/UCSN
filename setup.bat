@echo off
REM Setup script for Indradhanu project

REM Backend setup: create virtual environment and install requirements
if not exist "backend\.venv" (
  echo Creating Python virtual environment at backend\.venv
  python -m venv "backend\.venv"
) else (
  echo Virtual environment already exists at backend\.venv
)

REM Use the venv Python if available, otherwise system Python
if exist "backend\.venv\Scripts\python.exe" (
  set BACKEND_PY="backend\.venv\Scripts\python.exe"
) else (
  set BACKEND_PY=python
)

%BACKEND_PY% -m pip install --upgrade pip
%BACKEND_PY% -m pip install -r "backend\requirements.txt"

REM Frontend setup
pushd frontend
npm install
popd

echo Setup complete.
echo You can now start the backend and frontend servers.