const CACHE_NAME = 'tokenapp-v12';
const SHELL_URLS = ['/', '/offline.html', '/manifest.json', '/icons/icon-192.png', '/icons/icon-512.png', '/icons/icon-512-maskable.png', '/sounds/next.mp3', '/sounds/now.mp3'];
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(SHELL_URLS);
    const home = await fetch('/', { credentials: 'omit', cache: 'reload' });
    if (home.ok && !home.redirected) {
      await cache.put('/', home.clone());
      const html = await home.text();
      const styles = [...html.matchAll(/href="([^"]+\.css[^"]*)"/g)].map(match => match[1]);
      for (const path of styles) {
        try {
          const stylesheet = await fetch(path, { credentials: 'omit' });
          if (!stylesheet.ok) continue;
          await cache.put(path, stylesheet.clone());
          const css = await stylesheet.text();
          const fonts = [...new Set(css.match(/\/_next\/static\/media\/[^)'" ]+\.(?:woff2?|ttf|otf)/g) || [])];
          await Promise.all(fonts.map(async font => { try { const file = await fetch(font); if (file.ok) await cache.put(font, file); } catch {} }));
        } catch {}
      }
    }
    const guide = await fetch('/app/guide', { credentials: 'omit', cache: 'reload' });
    if (guide.ok && !guide.redirected && guide.headers.get('content-type')?.includes('text/html')) await cache.put('/app/guide', guide);
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter(name => name.startsWith('tokenapp-') && name !== CACHE_NAME).map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;
  const cacheable = url.pathname === '/' || url.pathname === '/app/guide' || url.pathname === '/offline.html' || url.pathname === '/manifest.json' || url.pathname.startsWith('/icons/') || url.pathname.startsWith('/sounds/') || url.pathname.startsWith('/_next/static/');
  if (!cacheable) return;
  event.respondWith(fetch(request).then(response => {
    if (response.ok && !response.redirected) void caches.open(CACHE_NAME).then(cache => cache.put(request, response.clone()));
    return response;
  }).catch(async () => {
    const cached = await caches.match(request, { ignoreSearch: request.url.includes('/app/guide') });
    if (cached) return cached;
    if (request.mode === 'navigate') return (await caches.match('/offline.html')) || Response.error();
    return Response.error();
  }));
});
