import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(registration => registration.unregister());
  });

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then(() => {
        console.log('Service Worker registered successfully.');
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
  }); 
}

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('brainiac-quiz-cache').then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/static/js/bundle.js',
        '/static/css/main.css',
        '/favicon.ico',
        '/leaderboard',
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    }).catch(() => {
      if (event.request.url.includes('/leaderboard')) {
        return new Response(
          JSON.stringify([]),
          { headers: { 'Content-Type': 'application/json' } }
        );
      }
    })
  );
});
