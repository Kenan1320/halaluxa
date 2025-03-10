// Service Worker for Halvi PWA
const CACHE_NAME = 'halvi-cache-v1';

// Assets to cache on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/logo-dots.svg',
  '/pwa-icons/icon-192x192.png',
  '/pwa-icons/icon-512x512.png'
];

// Install event - precache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
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
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', event => {
  // Skip non-GET requests and browser extension/chrome requests
  if (
    event.request.method !== 'GET' ||
    event.request.url.startsWith('chrome-extension') ||
    event.request.url.includes('extension')
  ) {
    return;
  }

  // For API requests, use network first, fallback to offline page
  if (event.request.url.includes('/api/')) {
    return event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match('/offline.html');
        })
    );
  }

  // For navigation requests (HTML), use network first with cache fallback
  if (event.request.mode === 'navigate') {
    return event.respondWith(
      fetch(event.request)
        .then(response => {
          // Cache the page for next time
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, clone);
            });
          }
          return response;
        })
        .catch(() => {
          // If offline, try to serve from cache
          return caches.match(event.request)
            .then(cachedResponse => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // If not in cache, serve offline page
              return caches.match('/offline.html');
            });
        })
    );
  }

  // For everything else, use cache first, fallback to network
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Return from cache if available
        if (cachedResponse) {
          return cachedResponse;
        }

        // Otherwise fetch from network
        return fetch(event.request)
          .then(response => {
            // If it's a valid response, clone and cache it
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(error => {
            console.error('Fetch failed:', error);
            // For image requests, return a fallback image
            if (event.request.url.match(/\.(jpg|jpeg|png|gif|svg)$/)) {
              return caches.match('/placeholder.svg');
            }
            // For other requests, we don't handle specifically
            throw error;
          });
      })
  );
});

// Push notification event
self.addEventListener('push', event => {
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/pwa-icons/icon-192x192.png',
    badge: '/pwa-icons/badge-72x72.png',
    data: {
      url: data.url || '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click event - open the app to the relevant page
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  // Open the app and navigate to the URL from the notification
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
