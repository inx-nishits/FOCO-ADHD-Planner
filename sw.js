/* Minimal app-shell service worker — static assets only, no API caching */
const CACHE_VERSION = 'app-foundation-v69';
const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.json',
  '/css/reset.css',
  '/css/tokens.css',
  '/css/app.css',
  '/css/device-frame.css',
  '/css/responsive.css',
  '/css/preview.css',
  '/css/animations.css',
  '/css/variants.css',
  '/js/app.js',
  '/js/config.js',
  '/js/variants.js',
  '/js/variant-manager.js',
  '/js/router.js',
  '/js/pwa.js',
  '/js/device-preview.js',
  '/js/preview-controls.js',
  '/js/version.js',
  '/variants/variant-a/variant.css',
  '/variants/variant-a/components.css',
  '/variants/variant-a/screens.css',
  '/variants/variant-a/screens/splash.js',
  '/variants/variant-a/screens/update.js',
  '/variants/variant-a/boot.js',
  '/variants/variant-a/app-guard.js',
  '/variants/variant-a/auth.css',
  '/variants/variant-a/auth/state.js',
  '/variants/variant-a/auth/helpers.js',
  '/variants/variant-a/screens/auth-landing.js',
  '/variants/variant-a/screens/auth-email.js',
  '/variants/variant-a/screens/verify.js',
  '/variants/variant-a/screens/forgot-password.js',
  '/variants/variant-a/screens/profile-completion.js',
  '/variants/variant-a/screens/onboarding.js',
  '/variants/variant-a/screens/home-gate.js',
  '/variants/variant-a/screens/empty-placeholders.js',
  '/variants/variant-a/empty-placeholders.css',
  '/variants/variant-a/onboarding.css',
  '/variants/variant-a/onboarding/state.js',
  '/variants/variant-a/onboarding/steps.js',
  '/variants/variant-a/onboarding/graphics.js',
  '/variants/variant-a/components/app-tab-bar.js',
  '/variants/variant-a/components/icons.js',
  '/variants/variant-a/account.css',
  '/variants/variant-a/account/constants.js',
  '/variants/variant-a/account/helpers.js',
  '/variants/variant-a/account/store.js',
  '/variants/variant-a/account/layout.js',
  '/variants/variant-a/screens/account.js',
  '/variants/variant-a/screens/account-profile.js',
  '/variants/variant-a/screens/account-logout.js',
  '/variants/variant-a/top-nav.css',
  '/variants/variant-a/evolution.css',
  '/variants/variant-a/tab-bar.css',
  '/variants/variant-a/visual-polish.css',
  '/variants/variant-b/variant.css',
  '/variants/variant-b/motion.css',
  '/variants/variant-b/components.css',
  '/variants/variant-b/screens.css',
  '/variants/variant-b/screens/splash.js',
  '/variants/variant-b/screens/update.js',
  '/variants/variant-b/screens/ready-to-focus.js',
  '/variants/variant-b/boot.js',
  '/variants/variant-b/app-guard.js',
  '/variants/variant-b/auth.css',
  '/variants/variant-b/auth/state.js',
  '/variants/variant-b/auth/helpers.js',
  '/variants/variant-b/screens/auth-landing.js',
  '/variants/variant-b/screens/auth-email.js',
  '/variants/variant-b/screens/verify.js',
  '/variants/variant-b/screens/forgot-password.js',
  '/variants/variant-b/screens/profile-completion.js',
  '/variants/variant-b/screens/onboarding.js',
  '/variants/variant-b/screens/home-gate.js',
  '/variants/variant-b/screens/empty-placeholders.js',
  '/variants/variant-b/screens/account.js',
  '/variants/variant-b/empty-placeholders.css',
  '/variants/variant-b/onboarding.css',
  '/variants/variant-b/onboarding/state.js',
  '/variants/variant-b/onboarding/steps.js',
  '/variants/variant-b/onboarding/graphics.js',
  '/variants/variant-b/components/app-tab-bar.js',
  '/variants/variant-b/components/icons.js',
  '/variants/variant-b/account.css',
  '/variants/variant-b/account/constants.js',
  '/variants/variant-b/account/helpers.js',
  '/variants/variant-b/account/store.js',
  '/variants/variant-b/account/layout.js',
  '/variants/variant-b/account/content.js',
  '/variants/variant-b/screens/account.js',
  '/variants/variant-b/screens/account-profile.js',
  '/variants/variant-b/screens/account-settings-hub.js',
  '/variants/variant-b/screens/account-password.js',
  '/variants/variant-b/screens/account-notifications.js',
  '/variants/variant-b/screens/account-preferences.js',
  '/variants/variant-b/screens/account-delete.js',
  '/variants/variant-b/screens/account-subscription.js',
  '/variants/variant-b/screens/account-support.js',
  '/variants/variant-b/screens/account-logout.js',
  '/variants/variant-b/top-nav.css',
  '/variants/variant-b/evolution.css',
  '/variants/variant-b/tab-bar.css',
  '/variants/variant-b/visual-polish.css',
  '/variants/variant-c/variant.css',
  '/assets/icons/icon-192.png',
  '/assets/icons/icon-512.png',
  '/assets/icons/apple-touch-icon.png',
  '/assets/icons/favicon.png',
  '/assets/icons/logo-foco.png',
  '/assets/icons/foco_state_a.png',
  '/assets/icons/foco_state_b.png',
  '/assets/icons/foco_state_c.png',
  '/assets/icons/foco_state_d.png',
  '/assets/images/foco-logo.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_VERSION);
      await Promise.all(
        APP_SHELL.map(async (url) => {
          try {
            await cache.add(url);
          } catch (err) {
            console.warn('[sw] skip cache', url, err);
          }
        }),
      );
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_VERSION).map((key) => caches.delete(key))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Never cache API-like paths (future-proof)
  if (url.pathname.startsWith('/api/')) return;

  event.respondWith(networkFirstWithCache(request));
});

async function networkFirstWithCache(request) {
  const cache = await caches.open(CACHE_VERSION);

  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (err) {
    const cached = await cache.match(request);
    if (cached) return cached;

    if (request.mode === 'navigate') {
      const shell = await cache.match('/index.html');
      if (shell) return shell;
    }

    throw err;
  }
}
