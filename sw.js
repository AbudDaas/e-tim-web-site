/* Çevrimdışı çalışma.
   Dosyalar ilk açılışta önbelleğe alınır; sonraki açılışlarda internet
   olmasa da site açılır. Firestore istekleri her zaman ağdan gider. */
const SURUM = "zihin-20260815o";
const DOSYALAR = [
  "./", "./index.html", "./manifest.json", "./favicon.svg", "./favicon.png", "./favicon-32.png", "./apple-touch-icon.png", "./ikon-192.png", "./ikon-512.png",
  "./css/style.css",
  "./js/config.js", "./js/ikonlar.js", "./js/i18n.js", "./js/data.js", "./js/util.js", "./js/state.js",
  "./js/store.js", "./js/engine.js", "./js/abakus.js", "./js/araclar.js", "./js/tekrar.js",
  "./js/mufredat.js", "./js/canli.js", "./js/views-site.js", "./js/views-exam.js", "./js/admin.js", "./js/exam.js", "./js/app.js"
];

self.addEventListener("install", e=>{
  e.waitUntil(caches.open(SURUM).then(c=>c.addAll(DOSYALAR)).then(()=>self.skipWaiting()));
});
self.addEventListener("activate", e=>{
  e.waitUntil(caches.keys().then(a=>Promise.all(
    a.filter(k=>k!==SURUM).map(k=>caches.delete(k))
  )).then(()=>self.clients.claim()));
});
self.addEventListener("fetch", e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=="GET") return;
  /* veri ve yazı tipi istekleri ağdan; site dosyaları önbellekten */
  if(/firestore|identitytoolkit|googleapis|qrserver/.test(u.host)) return;
  e.respondWith(
    caches.match(e.request).then(c=> c || fetch(e.request).then(y=>{
      const kopya=y.clone();
      caches.open(SURUM).then(x=>x.put(e.request,kopya)).catch(()=>{});
      return y;
    }).catch(()=> caches.match("./index.html")))
  );
});