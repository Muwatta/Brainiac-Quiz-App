self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('quiz-app-cache').then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/src/index.css',
        '/src/main.jsx',
        '/src/App.jsx',
        '/manifest.json',
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
