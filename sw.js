const CACHE_NAME = 'storynest-v3-cache';
const ASSETS = [
  './',
  './index.html'
];

// Install Event - Caching essentials
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).then(() => {
      // Forcefully activate standard container immediately
      return self.skipWaiting();
    })
  );
});

// Activate Event - Clean old caches automatically
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch Event - Essential for PWA installation validation
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => {
      return res || fetch(e.request).catch(() => {
        // Fallback for offline mode if asset is missing
        return caches.match('./index.html');
      });
    })
  );
});