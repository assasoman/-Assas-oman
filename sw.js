/* أساس عُمان — service worker بسيط: الشبكة أولًا، والنسخة المحفوظة إذا انقطع النت */
const C='asas-v2';
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(['/','/admin.html','/img/app/icon-192.png']).catch(()=>{})));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);if(u.origin!==location.origin)return;
  if(r.mode==='navigate'){e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put(r,cp)).catch(()=>{});return res}).catch(()=>caches.match(r).then(m=>m||caches.match(u.pathname.startsWith('/admin')?'/admin.html':'/'))));return}
  if(/\.(png|jpg|jpeg|webp|svg|woff2?)$/i.test(u.pathname)){e.respondWith(caches.open(C).then(c=>c.match(r).then(m=>{const net=fetch(r).then(res=>{if(res.ok)c.put(r,res.clone());return res}).catch(()=>m);return m||net})))}
});
