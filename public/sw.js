const CACHE_NAME = 'expense-tracker-v4'
const DYNAMIC_CACHE = 'expense-tracker-dynamic-v4'

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/icon-192.png',
  '/icon-512.png',
]

// INSTALL
self.addEventListener('install', event => {
  console.log('[SW] Installing...')
  self.skipWaiting()

  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  )
})

// ACTIVATE
self.addEventListener('activate', event => {
  console.log('[SW] Activating...')
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_NAME && k !== DYNAMIC_CACHE)
          .map(k => {
            console.log('[SW] Deleting old cache:', k)
            return caches.delete(k)
          })
      )
    )
  )
  self.clients.claim()
})

// FETCH
self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)

  // 🚨 1. SAMO GET
  if (request.method !== 'GET') {
    return
  }

  // 🚨 2. SAMO ISTI ORIGIN (nikad Supabase, API, CDN…)
  if (url.origin !== self.location.origin) {
    return
  }

  // 🟢 HTML / JS / CSS → NETWORK FIRST (uvijek svježe)
  if (
    request.destination === 'document' ||
    request.destination === 'script' ||
    request.destination === 'style'
  ) {
    event.respondWith(
      fetch(request)
        .then(response => {
          const clone = response.clone()
          caches.open(DYNAMIC_CACHE).then(cache => {
            cache.put(request, clone)
          })
          return response
        })
        .catch(() => caches.match(request))
    )
    return
  }

  // 🟢 Ostali statični resursi → CACHE FIRST
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached

      return fetch(request).then(response => {
        const clone = response.clone()
        caches.open(DYNAMIC_CACHE).then(cache => {
          cache.put(request, clone)
        })
        return response
      })
    })
  )
})
