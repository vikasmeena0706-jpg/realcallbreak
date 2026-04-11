const CACHE = 'realcallbreak-v1';
const FILES = [
  '/realcallbreak/',
  '/realcallbreak/index.html',
  '/realcallbreak/manifest.json',
  '/realcallbreak/icon-192.png',
  '/realcallbreak/icon-512.png',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(FILES))
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
