@echo off
REM INOVIT e-Segregator - Lokalny serwer (Windows)

echo ==========================================
echo   INOVIT e-Segregator - Serwer lokalny
echo ==========================================
echo.

REM Sprawdź czy Python jest dostępny
where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    set PORT=8080
    echo Uruchamianie serwera na porcie %PORT%...
    echo.
    echo Aplikacja bedzie dostepna pod adresem:
    echo   http://localhost:%PORT%
    echo.
    echo Aby zatrzymac serwer, nacisnij CTRL+C
    echo ==========================================
    echo.

    python -m http.server %PORT%
) else (
    echo Python nie jest zainstalowany!
    echo Zainstaluj Python lub uzyj innego serwera HTTP
    pause
    exit /b 1
)
