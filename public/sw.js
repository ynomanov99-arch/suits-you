// ===== SUITS YOU — Service Worker =====
const CACHE_NAME = 'suits-you-v1';
const STATIC_ASSETS = [
  '/',
  '/css/style.css',
  '/js/app.js',
  '/manifest.json'
];

// Install — cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — network first, cache fallback
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // API so'rovlarini cache qilmaymiz
  if (url.pathname.startsWith('/api/')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(res => {
        // Muvaffaqiyatli response ni cache ga yozamiz
        const cloned = res.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, cloned);
        });
        return res;
      })
      .catch(() => {
        // Network yo'q — cache dan olamiz
        return caches.match(event.request).then(cached => {
          if (cached) return cached;
          // Hech narsa yo'q — offline sahifa
          return new Response(
            `<!DOCTYPE html>
            <html>
              <head><meta charset="UTF-8"><title>SUITS YOU</title>
              <style>
                body { background: #0f0f0f; color: #e5e5e5; font-family: sans-serif;
                       display: flex; align-items: center; justify-content: center;
                       min-height: 100vh; margin: 0; text-align: center; }
                h1 { color: #c9a84c; font-size: 2rem; margin-bottom: 1rem; }
                p { color: #888; }
              </style></head>
              <body>
                <div>
                  <h1>SUITS YOU</h1>
                  <p>Internet ulanishi yo'q. Iltimos, ulanishni tekshiring.</p>
                </div>
              </body>
            </html>`,
            { headers: { 'Content-Type': 'text/html' } }
          );
        });
      })
  );
});
