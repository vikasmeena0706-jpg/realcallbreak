const CACHE = 'callbreak-v1';
const FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.png',
];

// Install — cache core files
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(FILES))
  );
  self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — network first, fallback to cache
// Socket.io and game API calls always go to network
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Always use network for socket.io and API calls
  if (url.pathname.startsWith('/socket.io')) {
    e.respondWith(fetch(e.request));
    return;
  }

  // Network first for everything else
  e.respondWith(
    fetch(e.request)
      .then(response => {
        // Cache successful responses
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(e.request))
  );
});
