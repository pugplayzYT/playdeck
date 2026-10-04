/* The build generates a content-hashed catalog of all local game assets. */
importScripts('./precache.js');
var prefix = 'playdeck:' + self.registration.scope + ':', cacheName = prefix + PRECACHE_VERSION;
var urls = PRECACHE_FILES.map(function (file) { return new URL(file, self.registration.scope).href; });
self.addEventListener('install', function (event) {
  event.waitUntil((async function () {
    try {
      var cache = await caches.open(cacheName);
      await cache.addAll(urls.map(function (url) { return new Request(url, {cache:'reload'}); }));
    } catch (error) { await caches.delete(cacheName); throw error; }
  })());
});
self.addEventListener('activate', function (event) {
  event.waitUntil((async function () {
    var keys = await caches.keys();
    await Promise.all(keys.filter(function (key) { return key.startsWith(prefix) && key !== cacheName; }).map(function (key) { return caches.delete(key); }));
    await self.clients.claim();
  })());
});
// Do not reload an active game automatically when an update arrives.
self.addEventListener('message', function (event) { if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting(); });
self.addEventListener('fetch', function (event) {
  var request = event.request, url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin || !url.href.startsWith(self.registration.scope)) return;
  if (url.pathname.endsWith('/')) url.pathname += 'index.html';
  url.search = ''; url.hash = '';
  event.respondWith((async function () {
    var cache = await caches.open(cacheName);
    var saved = await cache.match(url.href);
    if (saved) return saved;
    try { return await fetch(request); }
    catch (error) {
      if (request.mode === 'navigate') return await cache.match(new URL('offline.html', self.registration.scope).href);
      return Response.error();
    }
  })());
});
