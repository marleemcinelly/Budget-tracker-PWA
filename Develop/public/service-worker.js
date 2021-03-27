let cache_name = "BudgetAPP";

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cache_name).then((cache) => {
        console.log('Install!');
        return cache.addAll([
          '/index.html',
          '/icons/icon-192x192.png',
          '/icons/icon-512x512.png',
          '/styles.css',
          '/'
          
         ])
         .then(() => self.skipWaiting());
    })
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keyList => {
      return Promise.all(
          keyList.map(key => {
              if (key !== cache_name) {
                console.log('Activate!');
                return caches.delete(key);
              }
          })
      )
  }))
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    const {url} = event.request;
    if (url.includes("/all") || url.includes("/find")) {
        event.respondWith(
          caches.open(cache_name).then(cache => {
            return fetch(event.request)
              .then(response => {
                if (response.status === 200) {
                  cache.put(event.request, response.clone());
                }
    
                return response;
              })
              .catch(err => {
                return cache.match(event.request);
              });
          }).catch(err => console.log(err))
        );
      } else {
        event.respondWith(
          caches.open(cache_name).then(cache => {
            return cache.match(event.request).then(response => {
              return response || fetch(event.request);
            });
          })
        );
      }

//   event.respondWith(
//     caches.match(event.request).then((res) => {
//           console.log('Fetching resource: '+event.request.url);
//       return res || fetch(event.request).then((response) => {
//                 return caches.open(cache_name).then((cache) => {
//           console.log('Caching new resource: '+event.request.url);
//           cache.put(event.request, response.clone());
//           return response;
//         });
//       });
//     })
//   );
});
