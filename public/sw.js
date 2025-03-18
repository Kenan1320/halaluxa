
const CACHE_NAME = 'halvi-cache-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/src/index.css',
  '/src/styles/globals.css',
  '/lovable-uploads/256c0ffd-bafb-4348-94a6-074e92d4b6e3.png',
  '/placeholder.svg',
  '/favicon.ico'
];

// Install a service worker
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching app shell...');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('Service Worker: Installation completed');
        return self.skipWaiting();
      })
  );
});

// Activate the service worker
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Service Worker: Clearing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Now ready to handle fetches!');
      return self.clients.claim();
    })
  );
});

// Cache and return requests
self.addEventListener('fetch', event => {
  console.log('Service Worker: Fetching', event.request.url);
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          console.log('Service Worker: Found in cache:', event.request.url);
          return response;
        }
        
        // Clone the request because it's a one-time use
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          response => {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response because it's a one-time use
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                console.log('Service Worker: Caching new resource:', event.request.url);
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        ).catch(err => {
          console.log('Service Worker: Fetch failed; returning offline page instead.', err);
          // You could return a custom offline page here
        });
      })
    );
});

// Update push notification icon
self.addEventListener('push', event => {
  console.log('Service Worker: Push Received.');
  const title = 'Halvi';
  const options = {
    body: event.data ? event.data.text() : 'New update from Halvi!',
    icon: '/lovable-uploads/256c0ffd-bafb-4348-94a6-074e92d4b6e3.png',
    badge: '/lovable-uploads/256c0ffd-bafb-4348-94a6-074e92d4b6e3.png'
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  console.log('Service Worker: Notification click Received.');

  event.notification.close();

  event.waitUntil(
    clients.openWindow('/')
  );
});
