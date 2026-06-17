// Service worker minimal : rend l'app installable (PWA) et sert le cache de base.
const CACHE="garde-manger-v1";
const ASSETS=["./","./index.html","./manifest.json"];

self.addEventListener("install",e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).catch(()=>{}));
  self.skipWaiting();
});
self.addEventListener("activate",e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener("fetch",e=>{
  // Réseau d'abord (pour que les données Firebase soient toujours fraîches),
  // cache en secours si hors ligne.
  if(e.request.method!=="GET")return;
  e.respondWith(
    fetch(e.request).catch(()=>caches.match(e.request).then(r=>r||caches.match("./index.html")))
  );
});
