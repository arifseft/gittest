'use strict';

importScripts('scripts/sw-toolbox.js');
importScripts('scripts/cache-polyfill.js');

var dataCacheName = 'vivaData-v1';
var cacheName = 'vivaPWA-1';
var filesToCache = [
  //'/',
  'index.html',
  'scripts/jquery-2.1.4.js',
  /*'scripts/app.js',
  'images/clear.png',
  'images/cloudy-scattered-showers.png',
  'images/cloudy.png',
  'images/fog.png',
  'images/ic_add_white_24px.svg',
  'images/ic_refresh_white_24px.svg',
  'images/partly-cloudy.png',
  'images/rain.png',
  'images/scattered-showers.png',
  'images/sleet.png',
  'images/snow.png',
  'images/thunderstorm.png',
  'images/wind.png'*/
];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching App Shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        console.log('[ServiceWorker] Removing old cache', key);
        if (key !== cacheName) {
          return caches.delete(key);
        }
      }));
    })
  );
});

/*cahe list file*/
//toolbox.options.debug = true;
toolbox.precache(filesToCache);

/*toolbox.router.get('/api.php(.*)', toolbox.fastest);
toolbox.router.get('/notif.php(.*)', toolbox.networkFirst);
toolbox.router.get('/tips/(.*)', toolbox.cacheFirst);
toolbox.router.get('/all/(.*)', toolbox.cacheFirst);
toolbox.router.get('/news/(.*)', toolbox.cacheFirst);
toolbox.router.get('/apps/(.*)', toolbox.cacheFirst);
toolbox.router.get('/games/(.*)', toolbox.cacheFirst);
toolbox.router.get('/gadgets/(.*)', toolbox.cacheFirst);
toolbox.router.get('/gokil/(.*)', toolbox.cacheFirst);
toolbox.router.get('/public/(.*)', toolbox.cacheFirst , {
  cache: {
    name: 'publicassets',
    maxAgeSeconds: 60 * 60 * 24 * 3
  }
});
toolbox.router.get('/(.*)', toolbox.cacheFirst , {
  origin : 'https://fonts.googleapis.com',
  cache: {
    name: 'font'
  }
});*/
toolbox.router.get('/(.*)', toolbox.cacheFirst, {
  origin: 'http://cdn-media.viva.id',
  cache: {
    name: 'imageassets',
    maxAgeSeconds: 60 * 60 * 24 * 3
  }
});
toolbox.router.get('/(.*)', toolbox.cacheFirst, {
  origin: 'http://api.viva.co.id',
  cache: {
    name: 'apiassets',
    maxAgeSeconds: 60
  }
});
toolbox.router.get('(.*)', toolbox.fastest);

/*self.addEventListener('fetch', function(e) {
  console.log('[ServiceWorker] Fetch', e.request.url);
  //var dataUrl = 'https://publicdata-weather.firebaseio.com/';
  var dataUrl = 'http://api.viva.co.id/v/901/terbarulist';
  //var dataUrl = 'http://localhost/pwa-viva/contoh.json';
  //var dataUrl = 'http://192.168.204.7/pwa-viva/contoh.json';
  if (e.request.url.indexOf(dataUrl) === 0) {
    e.respondWith(
      fetch(e.request)
        .then(function(response) {
          return caches.open(dataCacheName).then(function(cache) {
            cache.put(e.request.url, response.clone());
            console.log('[ServiceWorker] Fetched&Cached Data');
            return response;
          });
        })
    );
  } else {
    e.respondWith(
      caches.match(e.request).then(function(response) {
        return response || fetch(e.request);
      })
    );
  }
});*/
