#!/bin/bash
# INOVIT e-Segregator - Skrypt uruchamiający lokalny serwer

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║   INOVIT e-Segregator HACCP - Uruchamianie serwera...        ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Sprawdź który serwer jest dostępny
if command -v python3 &> /dev/null; then
    echo "✓ Wykryto Python 3"
    echo "▶ Uruchamianie serwera na http://localhost:8000"
    echo ""
    echo "Naciśnij Ctrl+C aby zatrzymać serwer"
    echo "─────────────────────────────────────────────────────────────"
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    echo "✓ Wykryto Python 2"
    echo "▶ Uruchamianie serwera na http://localhost:8000"
    echo ""
    echo "Naciśnij Ctrl+C aby zatrzymać serwer"
    echo "─────────────────────────────────────────────────────────────"
    python -m SimpleHTTPServer 8000
elif command -v php &> /dev/null; then
    echo "✓ Wykryto PHP"
    echo "▶ Uruchamianie serwera na http://localhost:8000"
    echo ""
    echo "Naciśnij Ctrl+C aby zatrzymać serwer"
    echo "─────────────────────────────────────────────────────────────"
    php -S localhost:8000
elif command -v npx &> /dev/null; then
    echo "✓ Wykryto Node.js/npx"
    echo "▶ Uruchamianie serwera na http://localhost:8000"
    echo ""
    echo "Naciśnij Ctrl+C aby zatrzymać serwer"
    echo "─────────────────────────────────────────────────────────────"
    npx http-server -p 8000
else
    echo "❌ BŁĄD: Nie znaleziono Python, PHP ani Node.js"
    echo ""
    echo "Zainstaluj jeden z nich:"
    echo "  • Python 3: https://www.python.org/downloads/"
    echo "  • Node.js: https://nodejs.org/"
    echo "  • PHP: https://www.php.net/"
    echo ""
    exit 1
fi
