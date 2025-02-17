'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"flutter_bootstrap.js": "ecc0c6f763ee5991a375d0288ca91593",
"version.json": "833d166aca343b281bcffdb30a47a11c",
"index.html": "21c0a1e6764715e33f16fdc12e1a50b2",
"/": "21c0a1e6764715e33f16fdc12e1a50b2",
"main.dart.js": "043859bce00b90218f9aeb7ef10e4791",
"flutter.js": "f393d3c16b631f36852323de8e583132",
"favicon.png": "1d6224b703136b55a40886f768338054",
"icons/Icon-192.png": "88fe5ae1b8d5b77c6530f36aa3a9da97",
"icons/Icon-maskable-192.png": "88fe5ae1b8d5b77c6530f36aa3a9da97",
"icons/Icon-maskable-512.png": "c7cff5441c7edd5920b1cebfd7c0ee5c",
"icons/Icon-512.png": "c7cff5441c7edd5920b1cebfd7c0ee5c",
"manifest.json": "bfc4b162cd4eba0d9968c3ce229793b9",
"assets/dotenv": "fbca2a0af145833f8f8ef165e57691fb",
"assets/AssetManifest.json": "4c34e1418fac1de61baa9e1d5e861ea9",
"assets/NOTICES": "f3d965beef6ad48a62ce5330ea2fbf6e",
"assets/FontManifest.json": "932730277e20f8a8c3ed78f21c152df7",
"assets/AssetManifest.bin.json": "6e36d514bd501827c7cc4227c6048cef",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "e986ebe42ef785b27164c36a9abc7818",
"assets/packages/fluentui_system_icons/fonts/FluentSystemIcons-Filled.ttf": "bd5784fe2fde41ea11c1f41ebf757c5b",
"assets/packages/fluentui_system_icons/fonts/FluentSystemIcons-Regular.ttf": "9b9a5383a894157ae98988081da7c8d4",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"assets/AssetManifest.bin": "26659e649cf72925e0f5a8fe2561a7aa",
"assets/fonts/MaterialIcons-Regular.otf": "8ea08ea2444cc58ec5807fd7669e488f",
"assets/assets/images/pngs/logo.png": "006b2f27eea74d804f69e41b3bda3b54",
"assets/assets/images/pngs/comps_background.png": "54d18627a964835ff93a7ee86d96ba52",
"assets/assets/images/svgs/unknown_team.svg": "4bd3425dbdb342586b2ec294ff650bdd",
"assets/assets/images/svgs/image_placeholder.svg": "fea171f914954c9fbd8db8213dd975cf",
"assets/assets/images/svgs/settings_tab.svg": "3e3d0fad1d9713192cee17d6500faec4",
"assets/assets/images/svgs/back_arrow.svg": "28fdf325b48eab06913336d46db651d8",
"assets/assets/images/svgs/right_arrow.svg": "7b7b91f8655f8e7b44e49834b08c9e23",
"assets/assets/images/svgs/comp_background.svg": "2896bca13b91f7b4034e1403a4b418b3",
"assets/assets/images/svgs/comps_tab.svg": "274e61a938cba88439f1bbddcd0d93cc",
"assets/assets/images/svgs/tips_tab.svg": "ab984450e91c46852f7f7912c5754c15",
"assets/assets/images/svgs/question_mark.svg": "65a542c0b62d5714ba5da94c84c6dc80",
"assets/assets/images/svgs/tick.svg": "27638219e9a22c6a7044707eab66b654",
"assets/assets/images/svgs/warning.svg": "44627cc4fc6173b4bfa8b8c3032b8ac1",
"assets/assets/images/svgs/warning2.svg": "01a77f70b7b0e1b40875d5ffd3c7d0ac",
"assets/assets/images/svgs/eye.svg": "baa616789e571bc47746ffd4f147fc77",
"assets/assets/images/svgs/cross.svg": "715fe7dddc586c46fd198214dab746cf",
"assets/assets/fonts/Montserrat.ttf": "e6cb49ef6502d09136c7302d56f4197b",
"canvaskit/skwasm.js": "694fda5704053957c2594de355805228",
"canvaskit/skwasm.js.symbols": "262f4827a1317abb59d71d6c587a93e2",
"canvaskit/canvaskit.js.symbols": "48c83a2ce573d9692e8d970e288d75f7",
"canvaskit/skwasm.wasm": "9f0c0c02b82a910d12ce0543ec130e60",
"canvaskit/chromium/canvaskit.js.symbols": "a012ed99ccba193cf96bb2643003f6fc",
"canvaskit/chromium/canvaskit.js": "671c6b4f8fcc199dcc551c7bb125f239",
"canvaskit/chromium/canvaskit.wasm": "b1ac05b29c127d86df4bcfbf50dd902a",
"canvaskit/canvaskit.js": "66177750aff65a66cb07bb44b8c6422b",
"canvaskit/canvaskit.wasm": "1f237a213d7370cf95f443d896176460",
"canvaskit/skwasm.worker.js": "89990e8c92bcb123999aa81f7e203b1c"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"flutter_bootstrap.js",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
