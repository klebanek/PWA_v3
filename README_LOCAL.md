# INOVIT e-Segregator - Wersja Lokalna

> Profesjonalny system dokumentacji HACCP działający w pełni offline na Twoim komputerze

## 🚀 Szybki Start

### Metoda 1: Python (Najprostsza)

#### Linux / macOS
```bash
chmod +x start-local.sh
./start-local.sh
```

#### Windows
```cmd
start-local.bat
```

Lub bezpośrednio:
```bash
python3 -m http.server 8080
```

### Metoda 2: Node.js (Zalecana)

```bash
node server.js
```

Lub (jeśli masz uprawnienia):
```bash
chmod +x server.js
./server.js
```

## 📱 Dostęp do Aplikacji

Po uruchomieniu serwera, otwórz przeglądarkę i przejdź do:

- **http://localhost:8080**
- **http://127.0.0.1:8080**

## 💾 Instalacja jako PWA

### Desktop (Chrome, Edge, Opera)

1. Otwórz aplikację w przeglądarce
2. Kliknij ikonę instalacji w pasku adresu (po prawej stronie)
3. Lub: Menu → "Zainstaluj INOVIT e-Segregator"
4. Aplikacja pojawi się jako samodzielna aplikacja desktop

### Mobile (Android)

1. Otwórz aplikację w Chrome/Edge
2. Kliknij menu (⋮) → "Dodaj do ekranu głównego"
3. Aplikacja pojawi się na ekranie głównym jak natywna aplikacja

### Mobile (iOS/Safari)

1. Otwórz aplikację w Safari
2. Kliknij przycisk "Udostępnij" (⬆️)
3. Wybierz "Dodaj do ekranu głównego"
4. Aplikacja pojawi się na ekranie głównym

## ✨ Funkcje Offline

Po zainstalowaniu jako PWA, aplikacja:

- ✅ Działa w pełni offline (bez internetu)
- ✅ Zapisuje wszystkie dane lokalnie w przeglądarce
- ✅ Automatycznie aktualizuje się gdy jest dostępna nowa wersja
- ✅ Działa jak natywna aplikacja mobilna/desktopowa
- ✅ Szybkie ładowanie dzięki cache

## 📂 Struktura Plików

```
PWA_v3/
├── index.html              # Strona główna
├── centrum.html            # Centrum dokumentacji
├── wprowadzenie.html       # Wprowadzenie do HACCP
├── opis_zakladu.html       # Opis zakładu
├── ghp_gmp.html           # Program GHP/GMP
├── schemat.html           # Schemat technologiczny
├── analiza.html           # Analiza zagrożeń
├── rejestry.html          # Rejestry i zapisy
├── korekty.html           # Działania korygujące
├── szkolenia.html         # Szkolenia pracowników
├── audyty.html            # Audyty i weryfikacja
├── badania.html           # Plan i rejestr badań
├── app.js                 # Główna logika aplikacji
├── service-worker.js      # Service Worker (offline)
├── manifest.json          # Manifest PWA
├── server.js              # Serwer Node.js
├── start-local.sh         # Skrypt startowy (Linux/macOS)
├── start-local.bat        # Skrypt startowy (Windows)
└── icon-*.png            # Ikony aplikacji
```

## 🔧 Wymagania

### Minimalne
- Przeglądarka obsługująca PWA (Chrome, Edge, Safari, Firefox)
- Python 3.x LUB Node.js (do uruchomienia serwera)

### Zalecane
- Chrome/Edge (najlepsza obsługa PWA)
- Node.js 14+ (dla server.js)

## 💡 Wskazówki

### Debugowanie
- Otwórz DevTools (F12) → Application → Service Workers
- Sprawdź czy Service Worker jest aktywny
- W zakładce Storage → IndexedDB/LocalStorage zobaczysz zapisane dane

### Aktualizacja
- Gdy aplikacja wykryje nową wersję, pojawi się prompt z pytaniem o odświeżenie
- Dane lokalne zostaną zachowane

### Backup Danych
- Użyj funkcji eksportu w aplikacji (JSON)
- Zapisz plik w bezpiecznym miejscu
- Importuj dane gdy potrzeba

### Reset Aplikacji
Jeśli coś działa nieprawidłowo:

1. Otwórz DevTools (F12)
2. Application → Storage → Clear storage
3. Zaznacz wszystko i kliknij "Clear site data"
4. Odśwież stronę (F5)

## 🌐 Dostęp z Innych Urządzeń (Sieć Lokalna)

Jeśli chcesz uzyskać dostęp z telefonu/tabletu w tej samej sieci Wi-Fi:

1. Znajdź IP swojego komputera:
   - Linux/macOS: `ifconfig` lub `ip addr`
   - Windows: `ipconfig`

2. Na urządzeniu mobilnym otwórz:
   ```
   http://[TWOJE_IP]:8080
   ```
   Przykład: `http://192.168.1.100:8080`

3. Zainstaluj jako PWA na urządzeniu mobilnym

## 📊 Zarządzanie Danymi

### Gdzie są przechowywane dane?
- Wszystkie dane są zapisywane w **localStorage** przeglądarki
- Dane są przypisane do domeny (localhost:8080)
- Każda przeglądarka ma własne oddzielne dane

### Eksport/Import Danych
Aplikacja posiada wbudowane funkcje:
- **Eksport** → Zapisz wszystkie dane do pliku JSON
- **Import** → Wczytaj dane z pliku JSON
- Backup automatyczny przed każdą większą zmianą

### Synchronizacja między urządzeniami
Aplikacja **nie synchronizuje** danych automatycznie między urządzeniami.
Aby przenieść dane:
1. Wyeksportuj dane na urządzeniu źródłowym
2. Prześlij plik JSON na docelowe urządzenie
3. Zaimportuj dane na docelowym urządzeniu

## 🔒 Bezpieczeństwo i Prywatność

- ✅ Wszystkie dane przechowywane **lokalnie**
- ✅ **Brak** wysyłania danych do internetu
- ✅ Pełna kontrola nad danymi
- ✅ Działa **w pełni offline**
- ✅ RODO-compliant (dane nie opuszczają urządzenia)

## 🆘 Rozwiązywanie Problemów

### Serwer nie startuje
- Sprawdź czy port 8080 jest wolny
- Zmień port: `python3 -m http.server 3000`
- Lub w server.js: `PORT=3000 node server.js`

### Service Worker się nie rejestruje
- HTTPS/localhost jest wymagane dla SW
- Sprawdź konsolę przeglądarki (F12)
- Upewnij się że plik `service-worker.js` istnieje

### Aplikacja nie działa offline
- Sprawdź czy Service Worker jest aktywny (DevTools → Application)
- Odśwież stronę kilka razy
- Wyczyść cache i spróbuj ponownie

### Dane znikają po zamknięciu
- Sprawdź czy przeglądarka nie czyści localStorage
- Upewnij się że "Clear cookies on exit" jest wyłączone
- Użyj funkcji eksportu jako backup

## 📞 Wsparcie

W razie problemów:
1. Sprawdź konsolę przeglądarki (F12)
2. Sprawdź czy wszystkie pliki są dostępne
3. Upewnij się że serwer działa poprawnie
4. Sprawdź czy Service Worker jest aktywny

## 📄 Licencja

INOVIT e-Segregator © 2025
Wszystkie prawa zastrzeżone.

---

**Wersja dokumentacji:** 1.0.0
**Data aktualizacji:** 2025-12-30
