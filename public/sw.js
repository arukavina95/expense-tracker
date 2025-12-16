const CACHE_NAME = 'expense-tracker-v3' // Povećaj verziju kada se update-uje
const DYNAMIC_CACHE = 'expense-tracker-dynamic-v3'

const STATIC_ASSETS = [
  '/',
  '/manifest.webmanifest'
]

self.addEventListener('install', event => {
  console.log('[SW] Installing...')
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  )
  self.skipWaiting() // Odmah aktiviraj novi SW
})

self.addEventListener('activate', event => {
  console.log('[SW] Activating...')
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME && k !== DYNAMIC_CACHE).map(k => {
          console.log('[SW] Deleting old cache:', k)
          return caches.delete(k)
        })
      )
    )
  )
  self.clients.claim() // Odmah preuzmi kontrolu
})

self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)

  // Network-first strategija za HTML i JS/CSS (UVEK SVJEŽA VERZIJA)
  if (
    request.destination === 'document' ||
    url.pathname.includes('.js') ||
    url.pathname.includes('.css') ||
    url.pathname === '/' ||
    url.pathname === '/index.html'
  ) {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Keširaj novu verziju
          const responseClone = response.clone()
          caches.open(DYNAMIC_CACHE).then(cache => {
            cache.put(request, responseClone)
          })
          return response
        })
        .catch(() => {
          // Ako nema interneta, vrati keširanu verziju
          return caches.match(request)
        })
    )
    return
  }

  // Cache-first strategija za slike i ostale statične resurse
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) {
        return cached
      }
      return fetch(request).then(response => {
        // Keširaj za budućnost
        const responseClone = response.clone()
        caches.open(DYNAMIC_CACHE).then(cache => {
          cache.put(request, responseClone)
        })
        return response
      })
    })
  )
})
