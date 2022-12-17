// configuration
const
  version = '1.2.1',
  CACHE = version + '::PWAsite',
  installFilesEssential = [
    '/',
    '/js/main.js',
    '/sw.js',
    'https://cdn.jsdelivr.net/npm/zepto@1.2.0/dist/zepto.min.js',
    'https://cdn.jsdelivr.net/gh/alfg/ping.js@0.2.2/dist/ping.min.js'
  ],
  installFilesDesirable = [
    '/favicon.ico',
    '/img/ico_1.png',
    '/img/ico_2.png',
    '/img/ico_3.png',
    '/img/so-zhihu.png',
    '/img/so-youtube.png',
    '/img/so-weibo.png',
    '/img/so-translate.png',
    '/img/so-xiachufang.png',
    '/img/so-taobao.png',
    '/img/so-handian.png',
    '/img/so-google.png',
    '/img/so-douban.png',
    '/img/so-dogedoge.png',
    '/img/so-bing.png',
    '/img/so-baidu.png',
    '/img/logo-google.png',
    '/img/logo-dogedoge.png',
    '/img/logo-bing.png',
    '/img/logo-baidu.png',
  ];

// install static assets
function installStaticFiles() {
  return caches.open(CACHE)
    .then(cache => {
      // cache desirable files
      cache.addAll(installFilesDesirable);

      // cache essential files
      return cache.addAll(installFilesEssential);
    });
}

// clear old caches
function clearOldCaches() {
  return caches.keys()
    .then(keylist => {

      return Promise.all(
        keylist
        .filter(key => key !== CACHE)
        .map(key => caches.delete(key))
      );
    });
}

// application installation
self.addEventListener('install', event => {
  console.log('service worker: install');

  // cache core files
  event.waitUntil(
    installStaticFiles()
    .then(() => self.skipWaiting())
  );
});

// application activated
self.addEventListener('activate', event => {
  console.log('service worker: activate');

  // delete old caches
  event.waitUntil(
    clearOldCaches()
    .then(() => self.clients.claim())
  );
});

// application fetch network data
self.addEventListener('fetch', event => {

  // abandon non-GET requests
  if (event.request.method !== 'GET') return;

  let url = event.request.url;

  event.respondWith(

    caches.open(CACHE)
    .then(cache => {

      return cache.match(event.request)
        .then(response => {

          if (response) {
            // return cached file
            console.log('cache fetch: ' + url);
            return response;
          }

          // make network request
          return fetch(event.request)
            .then(newreq => {

              console.log('network fetch: ' + url);
              if (newreq.ok && !/youtube\.com/.test(url) && !/so\.wenboz\.com\/data/.test(url)) {
                console.log('cache: ' + url)
                cache.put(event.request, newreq.clone());
              }
              return newreq;
            })
            // app is offline
            .catch(() => {throw new Error('network error: ' + url)});
        });
    })
  );
});
