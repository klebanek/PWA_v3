const CACHE_NAME = 'inovit-esegregator-v1.0.1';
const urlsToCache = [
  './',
  './index.html',
  './centrum.html',
  './wprowadzenie.html',
  './opis_zakladu.html',
  './ghp_gmp.html',
  './schemat.html',
  './analiza.html',
  './rejestry.html',
  './korekty.html',
  './szkolenia.html',
  './audyty.html',
  './badania.html',
  './app.js',
  './manifest.json',
  './icon-32.png',
  './icon-64.png',
  './icon-128.png',
  './icon-192.png',
  './icon-256.png',
  './icon-512.png',
  './favicon.ico'
];

// Instalacja Service Workera - cachowanie zasobów
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Instalacja...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Cachowanie zasobów');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('[Service Worker] Wszystkie zasoby zostały zacachowane');
        return self.skipWaiting();
      })
  );
});

// Aktywacja Service Workera - usuwanie starych cache'y
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Aktywacja...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Usuwanie starego cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[Service Worker] Przejęcie kontroli nad wszystkimi klientami');
      return self.clients.claim();
    })
  );
});

// Strategia obsługi requestów: Cache First, potem Network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          // Zwróć z cache, ale zaktualizuj w tle
          event.waitUntil(
            fetch(event.request)
              .then((networkResponse) => {
                return caches.open(CACHE_NAME).then((cache) => {
                  cache.put(event.request, networkResponse.clone());
                  return networkResponse;
                });
              })
              .catch(() => {
                // Brak połączenia - nie rób nic
              })
          );
          return cachedResponse;
        }

        // Jeśli nie ma w cache, pobierz z sieci
        return fetch(event.request)
          .then((networkResponse) => {
            // Cachuj nowe zasoby (tylko GET)
            if (event.request.method === 'GET') {
              return caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, networkResponse.clone());
                return networkResponse;
              });
            }
            return networkResponse;
          })
          .catch((error) => {
            console.log('[Service Worker] Błąd pobierania:', error);
            // Tutaj można dodać fallback offline page
            if (event.request.destination === 'document') {
              return caches.match('./index.html');
            }
          });
      })
  );
});

// Obsługa wiadomości od klientów
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.delete(CACHE_NAME).then(() => {
        console.log('[Service Worker] Cache wyczyszczony');
        return self.clients.claim();
      })
    );
  }
});
