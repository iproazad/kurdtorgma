const CACHE_NAME = 'gemini-translator-v1';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/assets/icon.svg',
  '/index.js',
  '/src/app.component.ts',
  '/src/app.component.html',
  '/src/services/translation.service.ts',
  '/src/language-selector/language-selector.component.ts',
  '/src/language-selector/language-selector.component.html',
  // Dependencies from importmap
  "https://cdn.tailwindcss.com",
  "https://cdn.jsdelivr.net/npm/systemjs@6.15.1/dist/system.min.js",
  "https://unpkg.com/systemjs-plugin-typescript@latest/plugin.js",
  "https://unpkg.com/typescript@latest/lib/typescript.js",
  "https://esm.sh/rxjs@7.8.1",
  "https://esm.sh/rxjs@7.8.1/operators",
  "https://esm.sh/rxjs@7.8.1/ajax",
  "https://esm.sh/rxjs@7.8.1/webSocket",
  "https://esm.sh/rxjs@7.8.1/testing",
  "https://esm.sh/rxjs@7.8.1/fetch",
  "https://esm.sh/@google/genai@1.19.0",
  "https://esm.sh/@angular/compiler@20.1.6",
  "https://esm.sh/@angular/core@20.1.6",
  "https://esm.sh/@angular/common@20.1.6",
  "https://esm.sh/@angular/common@20.1.6/http",
  "https://esm.sh/@angular/platform-browser@20.1.6"
];

// Install service worker and cache all static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        // Use { cache: 'reload' } to bypass browser's HTTP cache for CDN scripts.
        const requests = URLS_TO_CACHE.map(url => new Request(url, { cache: 'reload' }));
        return cache.addAll(requests);
      })
      .catch(err => {
        console.error('Failed to cache resources on install:', err);
      })
  );
});

// Clear old caches on activation
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Serve cached content when offline (cache-first strategy)
self.addEventListener('fetch', event => {
  // We only handle GET requests
  if (event.request.method !== 'GET') {
      return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return response from cache, or fetch from network if not in cache
        return response || fetch(event.request);
      })
  );
});