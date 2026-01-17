#!/bin/bash

# INOVIT e-Segregator - Lokalny serwer
# Ten skrypt uruchamia lokalny serwer HTTP dla aplikacji PWA

echo "=========================================="
echo "  INOVIT e-Segregator - Serwer lokalny"
echo "=========================================="
echo ""

# Sprawdź czy Python jest dostępny
if command -v python3 &> /dev/null; then
    PORT=8080
    echo "Uruchamianie serwera na porcie $PORT..."
    echo ""
    echo "Aplikacja będzie dostępna pod adresem:"
    echo "  👉 http://localhost:$PORT"
    echo ""
    echo "Aby zatrzymać serwer, naciśnij CTRL+C"
    echo "=========================================="
    echo ""

    # Uruchom serwer Python
    python3 -m http.server $PORT
else
    echo "❌ Python3 nie jest zainstalowany!"
    echo "Zainstaluj Python3 lub użyj innego serwera HTTP"
    exit 1
fi
