@echo off
setlocal

set PYTHON_EXE=C:\Users\ACER\AppData\Local\Programs\Python\Python314\python.exe
set PORT=8000
set SITE_DIR=F:\Heisenberg Labs\Website\heisenberglabs.github.io

if not exist "%PYTHON_EXE%" (
  echo Could not find Python at %PYTHON_EXE%
  echo Falling back to "python" from PATH instead...
  set PYTHON_EXE=python
)

if not exist "%SITE_DIR%\index.html" (
  echo ERROR: index.html not found in %SITE_DIR%
  echo This script is hardcoded to that folder - if you moved the project, edit SITE_DIR above.
  pause
  exit /b 1
)

echo ============================================
echo  Heisenberg Labs site - local preview server
echo ============================================
echo Serving:  %SITE_DIR%
echo URL:      http://localhost:%PORT%/
echo.
echo This window must stay open while you browse the site.
echo Press Ctrl+C here (then Y) to stop the server when you're done.
echo ============================================
echo.

start "" "http://localhost:%PORT%/"
"%PYTHON_EXE%" -m http.server %PORT% --directory "%SITE_DIR%"

pause
