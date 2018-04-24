var cacheName = 'csound-serviceworker-1';
var filesToCache = [
  '/csound-serviceworker/', 
  '/csound-serviceworker/index.html',
  '/csound-serviceworker/csound/CsoundObj.js',
  '/csound-serviceworker/csound/CsoundProcessor.js',
  '/csound-serviceworker/csound/libcsound.js',
  '/csound-serviceworker/csound/libcsound.wasm',
  '/csound-serviceworker/csound/libcsound-worklet.base64.js',
  '/csound-serviceworker/csound/libcsound-worklet.js',
];

self.addEventListener('install', function(e) {
    console.log('[ServiceWorker] Install');
    e.waitUntil(
          caches.open(cacheName).then(function(cache) {
                  console.log('[ServiceWorker] Caching app shell');
                  return cache.addAll(filesToCache);
                })
        );
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  console.log('[ServiceWorker] Fetch', e.request.url);
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});
