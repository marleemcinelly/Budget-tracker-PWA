let cache_name = "EvolveAppSW";

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cache_name).then((cache) => {
        console.log('Install!');
        return cache.addAll([
          '/index.html',
          '/icons/icon-192x192.png',
          '/icons/icon-512x512.png',
          '/styles.css'
          
         ])
         .then(() => self.skipWaiting());
    })
  );
});

self.addEventListener("activate", event => {
  console.log('Activate!');
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((res) => {
          console.log('Fetching resource: '+event.request.url);
      return res || fetch(event.request).then((response) => {
                return caches.open(cache_name).then((cache) => {
          console.log('Caching new resource: '+event.request.url);
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
});
