/* Fimapa – funcionamento offline.
   - App (página e biblioteca do mapa): busca na internet e guarda a última versão; sem internet, usa a guardada.
   - Imagens do mapa: guarda as que você visualizou e usa a cópia quando estiver sem internet.
     Não há download em massa: só fica salvo o que foi visto. */
var SHELL = 'rg-app-v6';
var TILES = 'rg-mapa-v1';
var MAX_TILES = 8000;                       // ~150–250 MB no máximo
var SHELL_URLS = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png', './icon-180.png', './icon-maskable-512.png',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css', 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'];

function isTile(url){ return /\/MapServer\/tile\/\d+\/\d+\/\d+/.test(url) || /tile\.openstreetmap\.org\/\d+\/\d+\/\d+\.png/.test(url) || /elevation-tiles-prod\/terrarium\/\d+\/\d+\/\d+\.png/.test(url); }
function tileKey(url){ return url.split('?')[0]; }   // mesma imagem com ou sem parâmetros

self.addEventListener('install', function(e){
  e.waitUntil(caches.open(SHELL).then(function(c){
    return Promise.all(SHELL_URLS.map(function(u){ return c.add(new Request(u, {mode: /^https?:/.test(u) && u.indexOf(self.location.origin)!==0 ? 'cors' : 'same-origin'})).catch(function(){}); }));
  }).then(function(){ return self.skipWaiting(); }));
});
self.addEventListener('activate', function(e){
  e.waitUntil(caches.keys().then(function(ks){ return Promise.all(ks.filter(function(k){ return k.indexOf('rg-')===0 && k!==SHELL && k!==TILES; }).map(function(k){ return caches.delete(k); })); })
    .then(function(){ return self.clients.claim(); }));
});

var trimming = false;
function trim(){ if(trimming) return; trimming = true;
  caches.open(TILES).then(function(c){ return c.keys().then(function(ks){
    var extra = ks.length - MAX_TILES; if(extra <= 0) return;
    return Promise.all(ks.slice(0, extra + 200).map(function(k){ return c.delete(k); }));   // remove as mais antigas
  }); }).then(function(){ trimming = false; }, function(){ trimming = false; });
}

self.addEventListener('fetch', function(e){
  var req = e.request; if(req.method !== 'GET') return;
  var url = req.url;

  if(isTile(url)){
    var key = tileKey(url);
    e.respondWith(caches.open(TILES).then(function(c){
      return c.match(key).then(function(hit){
        var net = fetch(req).then(function(res){
          if(res && res.ok && res.type !== 'opaque'){ c.put(key, res.clone()).then(trim); }
          return res;
        }, function(){ return new Response('', {status: 504, statusText: 'offline'}); });   // sem internet e sem cópia
        if(hit){ net.catch(function(){}); return hit; }   // já salva: responde na hora e atualiza em segundo plano
        return net;
      });
    }));
    return;
  }

  var bare = url.split('?')[0];
  var isShell = req.mode === 'navigate' || SHELL_URLS.some(function(u){ return url === u || bare === new URL(u, self.location).href; });
  if(isShell){
    // Sinal fraco no campo: se a internet não responder em 4 s, abre a cópia salva.
    var fromCache = function(){ return caches.open(SHELL).then(function(c){ return c.match(req.mode === 'navigate' ? './index.html' : req, {ignoreSearch: true}); }); };
    var timed = new Promise(function(res){ setTimeout(function(){ fromCache().then(function(r){ if(r) res(r); }); }, 4000); });
    e.respondWith(Promise.race([timed,
      fetch(req).then(function(res){
        if(res && res.ok){ var cp = res.clone(); caches.open(SHELL).then(function(c){ c.put(req.mode === 'navigate' ? './index.html' : req, cp); }); }
        return res;
      }).catch(fromCache)
    ]));
  }
});

// Mensagens da página: tamanho do mapa salvo e limpar.
self.addEventListener('message', function(e){
  var port = e.ports && e.ports[0]; if(!port) return;
  if(e.data === 'contar'){ caches.open(TILES).then(function(c){ return c.keys(); }).then(function(ks){ port.postMessage({tiles: ks.length}); }); }
  if(e.data === 'apagar'){ caches.delete(TILES).then(function(){ port.postMessage({ok: true}); }); }
});
