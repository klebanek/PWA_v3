@echo off
REM INOVIT e-Segregator - Skrypt uruchamiający lokalny serwer (Windows)

echo ╔═══════════════════════════════════════════════════════════════╗
echo ║   INOVIT e-Segregator HACCP - Uruchamianie serwera...        ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.

REM Sprawdź Python 3
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Wykryto Python
    echo ▶ Uruchamianie serwera na http://localhost:8000
    echo.
    echo Naciśnij Ctrl+C aby zatrzymać serwer
    echo ─────────────────────────────────────────────────────────────
    python -m http.server 8000
    goto :end
)

REM Sprawdź PHP
php --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Wykryto PHP
    echo ▶ Uruchamianie serwera na http://localhost:8000
    echo.
    echo Naciśnij Ctrl+C aby zatrzymać serwer
    echo ─────────────────────────────────────────────────────────────
    php -S localhost:8000
    goto :end
)

REM Sprawdź Node.js
npx --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Wykryto Node.js
    echo ▶ Uruchamianie serwera na http://localhost:8000
    echo.
    echo Naciśnij Ctrl+C aby zatrzymać serwer
    echo ─────────────────────────────────────────────────────────────
    npx http-server -p 8000
    goto :end
)

REM Nie znaleziono żadnego serwera
echo ❌ BŁĄD: Nie znaleziono Python, PHP ani Node.js
echo.
echo Zainstaluj jeden z nich:
echo   • Python 3: https://www.python.org/downloads/
echo   • Node.js: https://nodejs.org/
echo   • PHP: https://www.php.net/
echo.
pause
exit /b 1

:end
pause
