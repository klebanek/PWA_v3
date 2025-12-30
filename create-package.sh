#!/bin/bash

# INOVIT e-Segregator - Skrypt pakowania do ZIP
# Ten skrypt tworzy gotowy pakiet do wdrożenia

echo "=========================================="
echo "  INOVIT e-Segregator - Pakowanie"
echo "=========================================="
echo ""

# Nazwa pakietu
PACKAGE_NAME="inovit-esegregator-pwa"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
VERSION="1.0.0"

# Katalog roboczy
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Katalog tymczasowy
TEMP_DIR="/tmp/${PACKAGE_NAME}_${TIMESTAMP}"
mkdir -p "$TEMP_DIR"

echo "📦 Kopiowanie plików..."

# Pliki HTML - wymagane
echo "  → Strony HTML..."
cp -v *.html "$TEMP_DIR/" 2>/dev/null | grep -v "^\." || true

# JavaScript - wymagane
echo "  → Pliki JavaScript..."
cp -v app.js "$TEMP_DIR/"
cp -v service-worker.js "$TEMP_DIR/"

# Konfiguracja PWA - wymagane
echo "  → Konfiguracja PWA..."
cp -v manifest.json "$TEMP_DIR/"

# Grafiki - wymagane
echo "  → Ikony i grafiki..."
cp -v favicon.ico "$TEMP_DIR/"
cp -v icon-*.png "$TEMP_DIR/"

# Dokumentacja
echo "  → Dokumentacja..."
cp -v README_LOCAL.md "$TEMP_DIR/" 2>/dev/null || true
cp -v QUICK_START.md "$TEMP_DIR/" 2>/dev/null || true
cp -v DEPLOY.md "$TEMP_DIR/" 2>/dev/null || true

# Narzędzia lokalne (opcjonalne, ale przydatne)
echo "  → Narzędzia lokalne..."
cp -v server.js "$TEMP_DIR/" 2>/dev/null || true
cp -v package.json "$TEMP_DIR/" 2>/dev/null || true
cp -v start-local.sh "$TEMP_DIR/" 2>/dev/null || true
cp -v start-local.bat "$TEMP_DIR/" 2>/dev/null || true

# .htaccess dla Apache (stworzymy)
echo "  → Konfiguracja serwera..."
cat > "$TEMP_DIR/.htaccess" << 'HTACCESS_EOF'
# INOVIT e-Segregator - Apache Configuration

# PWA MIME Types
<IfModule mod_mime.c>
  AddType application/manifest+json .webmanifest .json
  AddType application/javascript .js
  AddType text/html .html
  AddType image/png .png
  AddType image/x-icon .ico
</IfModule>

# Cache headers
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/x-icon "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType text/html "access plus 0 seconds"
</IfModule>

# Service Worker - nigdy nie cache'uj
<Files "service-worker.js">
  <IfModule mod_headers.c>
    Header set Cache-Control "no-cache, no-store, must-revalidate"
    Header set Pragma "no-cache"
    Header set Expires 0
  </IfModule>
</Files>

# Kompresja GZIP
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/css application/javascript application/json
</IfModule>

# Security Headers
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-XSS-Protection "1; mode=block"
</IfModule>
HTACCESS_EOF

# Lista plików
echo "  → Lista plików..."
cat > "$TEMP_DIR/LISTA_PLIKOW.txt" << 'EOF'
INOVIT e-Segregator - Lista Plików w Pakiecie
==============================================

PLIKI WYMAGANE NA SERWERZE:
---------------------------

Strony HTML (12 plików):
  ✓ index.html - Strona główna
  ✓ centrum.html - Centrum dokumentacji
  ✓ wprowadzenie.html - Wprowadzenie do HACCP
  ✓ opis_zakladu.html - Opis zakładu
  ✓ ghp_gmp.html - Program GHP/GMP
  ✓ schemat.html - Schemat technologiczny
  ✓ analiza.html - Analiza zagrożeń
  ✓ rejestry.html - Rejestry i zapisy
  ✓ korekty.html - Działania korygujące
  ✓ szkolenia.html - Szkolenia pracowników
  ✓ audyty.html - Audyty i weryfikacja
  ✓ badania.html - Plan i rejestr badań

JavaScript (2 pliki):
  ✓ app.js - Główna logika aplikacji
  ✓ service-worker.js - Service Worker (offline)

Konfiguracja PWA (1 plik):
  ✓ manifest.json - Manifest aplikacji

Grafiki (7 plików):
  ✓ favicon.ico - Ikona strony
  ✓ icon-32.png - Ikona 32x32
  ✓ icon-64.png - Ikona 64x64
  ✓ icon-128.png - Ikona 128x128
  ✓ icon-192.png - Ikona 192x192
  ✓ icon-256.png - Ikona 256x256
  ✓ icon-512.png - Ikona 512x512

Konfiguracja serwera (1 plik):
  ✓ .htaccess - Konfiguracja Apache (opcjonalnie)

PLIKI OPCJONALNE (do testów lokalnych):
---------------------------------------

Serwery lokalne:
  ✓ server.js - Serwer Node.js
  ✓ start-local.sh - Skrypt startowy Linux/macOS
  ✓ start-local.bat - Skrypt startowy Windows

Konfiguracja:
  ✓ package.json - Konfiguracja NPM

Dokumentacja:
  ✓ README_LOCAL.md - Instrukcja lokalna
  ✓ QUICK_START.md - Szybki start
  ✓ DEPLOY.md - Instrukcja wdrożenia
  ✓ LISTA_PLIKOW.txt - Ten plik

ROZMIAR PAKIETU: ~300 KB

WDROŻENIE:
----------
1. Rozpakuj ZIP
2. Prześlij wszystkie pliki na serwer WWW (FTP/SFTP)
3. Upewnij się że masz HTTPS
4. Otwórz w przeglądarce
5. Zainstaluj jako PWA

Szczegóły w pliku DEPLOY.md
EOF

# Informacja o wersji
cat > "$TEMP_DIR/VERSION.txt" << EOF
INOVIT e-Segregator PWA
Wersja: ${VERSION}
Data pakietu: $(date +"%Y-%m-%d %H:%M:%S")
Timestamp: ${TIMESTAMP}
EOF

echo ""
echo "📊 Podsumowanie:"
echo "  Plików skopiowanych: $(ls -1 "$TEMP_DIR" | wc -l)"
echo "  Rozmiar: $(du -sh "$TEMP_DIR" | cut -f1)"
echo ""

# Tworzenie archiwum ZIP
echo "🗜️  Tworzenie archiwum ZIP..."
cd /tmp
ZIP_NAME="${PACKAGE_NAME}_${VERSION}_${TIMESTAMP}.zip"
zip -r "$ZIP_NAME" "$(basename $TEMP_DIR)" -q

# Sprawdź czy ZIP został utworzony
if [ -f "/tmp/$ZIP_NAME" ]; then
    # Przenieś do katalogu projektu
    mv "/tmp/$ZIP_NAME" "$SCRIPT_DIR/"

    echo "✅ Archiwum utworzone pomyślnie!"
    echo ""
    echo "📦 Plik: $ZIP_NAME"
    echo "📊 Rozmiar: $(du -sh "$SCRIPT_DIR/$ZIP_NAME" | cut -f1)"
    echo "📍 Lokalizacja: $SCRIPT_DIR/$ZIP_NAME"
    echo ""

    # Wyświetl zawartość
    echo "📋 Zawartość archiwum:"
    unzip -l "$SCRIPT_DIR/$ZIP_NAME" | tail -n +4 | head -n -2
    echo ""

    # Stwórz również wersję bez timestampu (łatwiejsza do znalezienia)
    SIMPLE_NAME="${PACKAGE_NAME}_${VERSION}.zip"
    cp "$SCRIPT_DIR/$ZIP_NAME" "$SCRIPT_DIR/$SIMPLE_NAME"
    echo "📦 Utworzono również: $SIMPLE_NAME"
    echo ""
else
    echo "❌ Błąd tworzenia archiwum!"
    exit 1
fi

# Sprzątanie
rm -rf "$TEMP_DIR"

echo "=========================================="
echo "✅ Pakiet gotowy do wdrożenia!"
echo "=========================================="
echo ""
echo "Następne kroki:"
echo "1. Pobierz plik: $SIMPLE_NAME"
echo "2. Przeczytaj DEPLOY.md (w archiwum)"
echo "3. Prześlij pliki na serwer WWW"
echo "4. Uruchom aplikację przez HTTPS"
echo ""
