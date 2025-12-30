# 🚀 INSTRUKCJA WDROŻENIA - INOVIT e-Segregator PWA

## 📦 Zawartość Pakietu

Ten pakiet zawiera **pełną aplikację PWA** gotową do wdrożenia na dowolnym serwerze WWW.

### Pliki Aplikacji (wymagane na serwerze)

#### Strony HTML
- `index.html` - Strona główna
- `centrum.html` - Centrum dokumentacji
- `wprowadzenie.html` - Wprowadzenie do HACCP
- `opis_zakladu.html` - Opis zakładu
- `ghp_gmp.html` - Program GHP/GMP
- `schemat.html` - Schemat technologiczny
- `analiza.html` - Analiza zagrożeń
- `rejestry.html` - Rejestry i zapisy
- `korekty.html` - Działania korygujące
- `szkolenia.html` - Szkolenia pracowników
- `audyty.html` - Audyty i weryfikacja
- `badania.html` - Plan i rejestr badań

#### Pliki JavaScript
- `app.js` - Główna logika aplikacji
- `service-worker.js` - Service Worker (obsługa offline)

#### Konfiguracja PWA
- `manifest.json` - Manifest aplikacji PWA

#### Grafiki
- `favicon.ico` - Ikona strony
- `icon-32.png` - Ikona 32x32
- `icon-64.png` - Ikona 64x64
- `icon-128.png` - Ikona 128x128
- `icon-192.png` - Ikona 192x192
- `icon-256.png` - Ikona 256x256
- `icon-512.png` - Ikona 512x512

#### Narzędzia Lokalne (opcjonalne)
- `server.js` - Serwer Node.js do testów lokalnych
- `package.json` - Konfiguracja NPM
- `start-local.sh` - Skrypt startowy Linux/macOS
- `start-local.bat` - Skrypt startowy Windows

#### Dokumentacja
- `README_LOCAL.md` - Instrukcja uruchomienia lokalnego
- `QUICK_START.md` - Szybki start
- `DEPLOY.md` - Ten plik

---

## 🌐 WDROŻENIE NA SERWER WWW

### Krok 1: Przygotowanie Plików

Rozpakuj archiwum ZIP:
```bash
unzip inovit-esegregator-pwa.zip
```

### Krok 2: Upload na Serwer

Prześlij **wszystkie pliki** na serwer WWW (FTP, SFTP, panel hostingu):

```
twoja-domena.pl/
├── index.html
├── centrum.html
├── wprowadzenie.html
├── opis_zakladu.html
├── ghp_gmp.html
├── schemat.html
├── analiza.html
├── rejestry.html
├── korekty.html
├── szkolenia.html
├── audyty.html
├── badania.html
├── app.js
├── service-worker.js
├── manifest.json
├── favicon.ico
└── icon-*.png (wszystkie ikony)
```

### Krok 3: Konfiguracja Serwera

#### ✅ HTTPS jest WYMAGANE!

PWA wymaga HTTPS (lub localhost). Upewnij się, że:
- Certyfikat SSL jest zainstalowany
- Strona działa przez `https://`

#### Konfiguracja MIME Types

**Apache (.htaccess)**
```apache
# PWA MIME Types
<IfModule mod_mime.c>
  AddType application/manifest+json .webmanifest .json
  AddType application/javascript .js
  AddType text/html .html
  AddType image/png .png
</IfModule>

# Cache headers dla PWA
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/x-icon "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType text/html "access plus 0 seconds"
</IfModule>

# Service Worker - nie cache'uj
<Files "service-worker.js">
  Header set Cache-Control "no-cache, no-store, must-revalidate"
  Header set Pragma "no-cache"
  Header set Expires 0
</Files>
```

**Nginx (nginx.conf)**
```nginx
# PWA MIME Types
types {
  application/manifest+json  webmanifest json;
  application/javascript     js;
  text/html                  html;
  image/png                  png;
  image/x-icon              ico;
}

# Service Worker - nie cache'uj
location = /service-worker.js {
  add_header Cache-Control "no-cache, no-store, must-revalidate";
  add_header Pragma "no-cache";
  add_header Expires 0;
}

# Statyczne zasoby - cache
location ~* \.(png|jpg|jpeg|gif|ico)$ {
  expires 1y;
  add_header Cache-Control "public, immutable";
}
```

### Krok 4: Weryfikacja

Otwórz aplikację w przeglądarce:
```
https://twoja-domena.pl
```

Sprawdź w DevTools (F12):
1. **Application → Manifest** - powinien być widoczny manifest
2. **Application → Service Workers** - powinien być zarejestrowany
3. **Console** - brak błędów

---

## 📱 INSTALACJA JAKO PWA

### Desktop (Chrome, Edge, Opera, Firefox)

Po otwarciu strony:
1. Pojawi się ikona instalacji w pasku adresu (➕)
2. Lub: Menu → "Zainstaluj INOVIT e-Segregator"
3. Kliknij "Instaluj"
4. Aplikacja pojawi się jako samodzielna aplikacja desktop

### Android (Chrome, Edge, Samsung Internet)

1. Otwórz stronę w przeglądarce
2. Menu (⋮) → "Dodaj do ekranu głównego"
3. Potwierdź instalację
4. Aplikacja pojawi się na ekranie głównym

### iOS (Safari)

1. Otwórz stronę w Safari
2. Kliknij przycisk "Udostępnij" (⬆️)
3. "Dodaj do ekranu głównego"
4. Potwierdź
5. Aplikacja pojawi się na ekranie głównym

---

## 🧪 TESTOWANIE LOKALNE PRZED WDROŻENIEM

Przed wrzuceniem na serwer, przetestuj lokalnie:

### Metoda 1: Node.js
```bash
node server.js
# Otwórz: http://localhost:8080
```

### Metoda 2: Python
```bash
python3 -m http.server 8080
# Otwórz: http://localhost:8080
```

### Metoda 3: NPM
```bash
npm start
# Otwórz: http://localhost:8080
```

### Metoda 4: Skrypty
```bash
# Linux/macOS
./start-local.sh

# Windows
start-local.bat
```

---

## 🔧 KONFIGURACJA APLIKACJI

### Zmiana Nazwy/Brandingu

Edytuj `manifest.json`:
```json
{
  "name": "Twoja Nazwa Aplikacji",
  "short_name": "Krótka Nazwa",
  "description": "Opis aplikacji",
  "theme_color": "#004F5D",
  "background_color": "#004F5D"
}
```

### Zmiana Ikon

Zastąp pliki `icon-*.png` swoimi ikonami (zachowaj wymiary):
- icon-32.png (32x32)
- icon-64.png (64x64)
- icon-128.png (128x128)
- icon-192.png (192x192)
- icon-256.png (256x256)
- icon-512.png (512x512)

### Zmiana Wersji (dla aktualizacji)

Edytuj `service-worker.js` (linia 1):
```javascript
const CACHE_NAME = 'inovit-esegregator-v1.0.2'; // Zwiększ numer wersji
```

Po każdej zmianie zwiększ wersję, aby wymusić aktualizację u użytkowników.

---

## 📊 DANE UŻYTKOWNIKÓW

### Gdzie są przechowywane?

- **LocalStorage** w przeglądarce użytkownika
- Dane **NIE** są wysyłane na serwer
- Każdy użytkownik ma własne, niezależne dane

### Backup i Restore

Użytkownicy mogą:
1. **Eksportować** dane do pliku JSON (w aplikacji)
2. **Importować** dane z pliku JSON
3. Przenosić dane między urządzeniami

### RODO

✅ Aplikacja jest **RODO-compliant**:
- Wszystkie dane przechowywane lokalnie
- Brak wysyłania danych do zewnętrznych serwerów
- Brak cookies śledzących
- Brak analytics (jeśli nie dodano)

---

## 🔄 AKTUALIZACJA APLIKACJI

### Jak zaktualizować aplikację na serwerze?

1. **Zwiększ wersję** w `service-worker.js`:
   ```javascript
   const CACHE_NAME = 'inovit-esegregator-v1.0.2';
   ```

2. **Prześlij zmienione pliki** na serwer

3. **Użytkownicy zostaną powiadomieni** o aktualizacji przy następnym otwarciu aplikacji

4. Pojawi się prompt: "Dostępna jest nowa wersja aplikacji. Odświeżyć teraz?"

### Wymuszenie aktualizacji

Jeśli chcesz wymusić aktualizację natychmiast:
- Wyczyść cache Service Workera (zmień CACHE_NAME)
- Użytkownicy przy następnym otwarciu pobiorą nową wersję

---

## 🛠️ ROZWIĄZYWANIE PROBLEMÓW

### Service Worker się nie rejestruje

**Przyczyny:**
- Brak HTTPS (wymagane poza localhost)
- Nieprawidłowa ścieżka do service-worker.js
- Błędy JavaScript w konsoli

**Rozwiązanie:**
1. Włącz HTTPS
2. Sprawdź DevTools → Console
3. Sprawdź DevTools → Application → Service Workers

### Aplikacja nie działa offline

**Przyczyny:**
- Service Worker nie jest aktywny
- Zasoby nie zostały zacachowane

**Rozwiązanie:**
1. Sprawdź Application → Service Workers
2. Sprawdź Application → Cache Storage
3. Upewnij się że wszystkie pliki z `urlsToCache` istnieją

### Instalacja PWA nie pojawia się

**Przyczyny:**
- Brak HTTPS
- Błędny manifest.json
- Service Worker nie działa
- Przeglądarka nie obsługuje PWA

**Rozwiązanie:**
1. Sprawdź DevTools → Application → Manifest
2. Sprawdź czy wszystkie pola manifestu są poprawne
3. Sprawdź czy ikony są dostępne
4. Użyj Chrome/Edge (najlepsza obsługa)

### Dane użytkowników znikają

**Przyczyny:**
- Przeglądarka czyści localStorage automatycznie
- Użytkownik wyczyścił dane przeglądarki
- Tryb prywatny/incognito

**Rozwiązanie:**
1. Poinformuj użytkowników o regularnym backupie (eksport JSON)
2. Nie używaj trybu incognito
3. Nie czyść danych przeglądarki

---

## 📈 MONITORING I ANALYTICS

### Dodanie Google Analytics (opcjonalnie)

W każdym pliku HTML, przed `</head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

Zamień `GA_MEASUREMENT_ID` na swój ID.

---

## ✅ CHECKLIST WDROŻENIA

Przed udostępnieniem publicznym:

- [ ] Wszystkie pliki przesłane na serwer
- [ ] HTTPS włączony i działający
- [ ] Manifest.json poprawnie skonfigurowany
- [ ] Service Worker rejestruje się poprawnie
- [ ] Wszystkie ikony są dostępne
- [ ] Aplikacja działa w przeglądarce
- [ ] Instalacja PWA działa
- [ ] Funkcjonalność offline działa
- [ ] Wszystkie podstrony działają
- [ ] LocalStorage zapisuje dane
- [ ] Eksport/Import danych działa
- [ ] Aplikacja testowana na mobile
- [ ] Brak błędów w konsoli przeglądarki

---

## 🎯 WSPARCIE PRZEGLĄDAREK

| Przeglądarka | Desktop | Mobile | Instalacja PWA |
|--------------|---------|--------|----------------|
| Chrome       | ✅      | ✅     | ✅             |
| Edge         | ✅      | ✅     | ✅             |
| Firefox      | ✅      | ✅     | ⚠️ Ograniczona |
| Safari       | ✅      | ✅     | ✅ (iOS 11.3+) |
| Opera        | ✅      | ✅     | ✅             |

---

## 📞 DODATKOWE INFORMACJE

### Wymagania systemowe serwera

- **Serwer WWW:** Apache, Nginx, IIS, lub dowolny statyczny hosting
- **HTTPS:** Wymagane (certyfikat SSL)
- **Miejsce:** ~1 MB
- **Bazy danych:** Nie wymagane (wszystko w localStorage)
- **PHP/Node.js:** Nie wymagane (statyczna aplikacja)

### Hosting - Rekomendacje

Aplikacja działa na **dowolnym** hostingu obsługującym pliki statyczne:

- ✅ GitHub Pages (darmowy)
- ✅ Netlify (darmowy)
- ✅ Vercel (darmowy)
- ✅ Cloudflare Pages (darmowy)
- ✅ Własny hosting WWW
- ✅ VPS

### Koszty

- **Darmowe hostingi:** 0 zł/miesiąc (GitHub Pages, Netlify, etc.)
- **Podstawowy hosting:** 10-30 zł/miesiąc
- **Brak kosztów backendowych** - aplikacja działa w pełni frontend

---

## 📝 Historia Zmian

### v1.0.0 (2025-12-30)
- Pierwsza wersja produkcyjna
- Pełna funkcjonalność offline
- Wsparcie dla instalacji PWA
- LocalStorage dla danych
- Eksport/Import JSON

---

**INOVIT e-Segregator © 2025**
**Dokument wersja:** 1.0.0
**Data:** 2025-12-30
