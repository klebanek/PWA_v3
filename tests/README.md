# Testy dla INOVIT e-Segregator PWA

## Przegląd

Ten katalog zawiera testy jednostkowe i integracyjne dla aplikacji INOVIT e-Segregator PWA.

## Struktura

```
tests/
├── unit/
│   └── storage.test.js    # Testy modułu Storage (37 testów)
└── README.md
```

## Uruchamianie testów

### Instalacja zależności

```bash
npm install
```

### Uruchomienie wszystkich testów

```bash
npm test
```

### Uruchomienie testów w trybie watch (automatyczne odświeżanie)

```bash
npm run test:watch
```

### Uruchomienie testów z raportem pokrycia

```bash
npm run test:coverage
```

### Uruchomienie testów z interfejsem UI

```bash
npm run test:ui
```

## Aktualny stan pokrycia testami

### Moduł Storage (app.js:16-99)
✅ **100% pokrycia** - 37 testów

Testowane funkcjonalności:
- ✅ `save()` - Zapisywanie danych (8 testów)
- ✅ `load()` - Odczytywanie danych (7 testów)
- ✅ `remove()` - Usuwanie danych (4 testy)
- ✅ `clearAll()` - Czyszczenie wszystkich danych (5 testów)
- ✅ `getAllKeys()` - Pobieranie kluczy (5 testów)
- ✅ Testy integracyjne CRUD (3 testy)
- ✅ Edge cases i przypadki brzegowe (5 testów)

### Pozostałe moduły
- ⏳ DateTime - Do zaimplementowania
- ⏳ Facility - Do zaimplementowania
- ⏳ Registry - Do zaimplementowania
- ⏳ Export - Do zaimplementowania
- ⏳ Import - Do zaimplementowania
- ⏳ Notifications - Do zaimplementowania
- ⏳ Service Worker - Do zaimplementowania

## Technologie

- **Framework testowy**: [Vitest](https://vitest.dev/) v1.0.0
- **Środowisko DOM**: [Happy DOM](https://github.com/capricorn86/happy-dom) v12.10.3
- **Pokrycie kodu**: [@vitest/coverage-v8](https://vitest.dev/guide/coverage.html)
- **UI testowy**: [@vitest/ui](https://vitest.dev/guide/ui.html)

## Kluczowe testy Storage

### 1. Zapisywanie danych
- Proste i złożone obiekty
- Tablice
- Dane z polskimi znakami (UTF-8)
- Obsługa błędów (QuotaExceededError)

### 2. Odczytywanie danych
- Prawidłowa deserializacja JSON
- Obsługa brakujących kluczy (zwraca null)
- Obsługa uszkodzonych danych JSON

### 3. Usuwanie danych
- Usuwanie pojedynczych kluczy
- Brak wpływu na inne klucze

### 4. Czyszczenie wszystkich danych
- Usuwanie tylko kluczy aplikacji (z prefiksem `inovit_esegregator_`)
- Zachowanie kluczy innych aplikacji

### 5. Pobieranie kluczy
- Filtrowanie według prefiksu
- Zwracanie kluczy bez prefiksu
- Obsługa pustego localStorage

### 6. Edge cases
- Bardzo długie klucze
- Duże ilości danych (1000+ wpisów)
- Znaki specjalne w kluczach
- Unicode i emoji
- Różne typy wartości (string, number, boolean, null, array, object)

## Przykłady użycia

### Uruchomienie konkretnego pliku testowego

```bash
npx vitest run tests/unit/storage.test.js
```

### Debugowanie testów

```bash
npx vitest --inspect-brk
```

### Generowanie raportu HTML

```bash
npm run test:coverage
# Otwórz coverage/index.html w przeglądarce
```

## Dobre praktyki

1. **Każdy test powinien być niezależny** - używamy `beforeEach()` do czyszczenia localStorage
2. **Testy powinny być czytelne** - używamy opisowych nazw w języku polskim
3. **Testujemy zarówno happy path jak i edge cases**
4. **Mockujemy console.error** aby uniknąć zaśmiecania outputu testów
5. **Przywracamy oryginalne implementacje** po testach z mockami

## Troubleshooting

### Problem: Testy nie znajdują localStorage
**Rozwiązanie**: Upewnij się, że w `vitest.config.js` jest ustawione `environment: 'happy-dom'`

### Problem: Testy są niestabilne
**Rozwiązanie**: Sprawdź czy używasz `beforeEach()` do czyszczenia stanu przed każdym testem

### Problem: Pokrycie kodu wynosi 0%
**Rozwiązanie**: Upewnij się, że testy importują rzeczywisty kod z `app.js`, a nie duplikują implementacji

## Roadmap

### Faza 1: Testy jednostkowe (aktualna) ✅
- [x] Storage module
- [ ] DateTime module
- [ ] Registry module
- [ ] Export module
- [ ] Import module
- [ ] Facility module

### Faza 2: Testy Service Worker
- [ ] Instalacja i cachowanie
- [ ] Strategia fetch (cache-first)
- [ ] Obsługa wiadomości
- [ ] Aktualizacje

### Faza 3: Testy integracyjne/E2E
- [ ] CRUD operacje przez UI
- [ ] Eksport/import danych
- [ ] Funkcjonalność offline
- [ ] Responsywność

### Faza 4: Testy wydajnościowe
- [ ] Duże zbiory danych (10000+ wpisów)
- [ ] Wydajność eksportu
- [ ] Limity cache

## Kontakt

Dla pytań dotyczących testów, skontaktuj się z zespołem deweloperskim INOVIT.
