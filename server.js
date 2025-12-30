#!/usr/bin/env node

/**
 * INOVIT e-Segregator - Lokalny serwer Node.js
 * Prosty serwer HTTP z poprawną obsługą MIME types dla PWA
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0';

// MIME types dla różnych rozszerzeń plików
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8'
};

const server = http.createServer((req, res) => {
  // Usuń query string i dekoduj URL
  let filePath = decodeURIComponent(req.url.split('?')[0]);

  // Jeśli żądanie to /, przekieruj na index.html
  if (filePath === '/') {
    filePath = '/index.html';
  }

  // Pełna ścieżka do pliku
  const fullPath = path.join(__dirname, filePath);

  // Rozszerzenie pliku
  const ext = path.extname(filePath).toLowerCase();
  const mimeType = MIME_TYPES[ext] || 'application/octet-stream';

  // Sprawdź czy plik istnieje
  fs.access(fullPath, fs.constants.F_OK, (err) => {
    if (err) {
      // Plik nie istnieje - 404
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`
        <!DOCTYPE html>
        <html lang="pl">
        <head>
          <meta charset="UTF-8">
          <title>404 - Nie znaleziono</title>
          <style>
            body {
              font-family: 'Segoe UI', sans-serif;
              text-align: center;
              padding: 50px;
              background-color: #f5f5f5;
            }
            h1 { color: #004F5D; }
            p { color: #666; }
            a { color: #007380; text-decoration: none; font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>404 - Nie znaleziono strony</h1>
          <p>Strona <code>${filePath}</code> nie istnieje.</p>
          <p><a href="/">← Powrót do strony głównej</a></p>
        </body>
        </html>
      `);
      console.log(`❌ 404: ${filePath}`);
      return;
    }

    // Plik istnieje - odczytaj i wyślij
    fs.readFile(fullPath, (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('Błąd serwera');
        console.error(`❌ Błąd odczytu: ${filePath}`, err);
        return;
      }

      // Wyślij plik z odpowiednim MIME type
      res.writeHead(200, {
        'Content-Type': mimeType,
        'Cache-Control': 'no-cache'
      });
      res.end(data);
      console.log(`✓ ${req.method} ${filePath} [${mimeType}]`);
    });
  });
});

server.listen(PORT, HOST, () => {
  console.log('==========================================');
  console.log('  INOVIT e-Segregator - Serwer lokalny');
  console.log('==========================================');
  console.log('');
  console.log('Serwer uruchomiony!');
  console.log('');
  console.log(`  👉 http://localhost:${PORT}`);
  console.log(`  👉 http://127.0.0.1:${PORT}`);
  console.log('');
  console.log('Aby zatrzymać serwer, naciśnij CTRL+C');
  console.log('==========================================');
  console.log('');
});

// Obsługa zamknięcia serwera
process.on('SIGINT', () => {
  console.log('\n\n🛑 Zatrzymywanie serwera...');
  server.close(() => {
    console.log('✓ Serwer zatrzymany');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\n\n🛑 Zatrzymywanie serwera...');
  server.close(() => {
    console.log('✓ Serwer zatrzymany');
    process.exit(0);
  });
});
