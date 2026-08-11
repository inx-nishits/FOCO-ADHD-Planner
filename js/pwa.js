/**
 * PWA install / display mode utilities (foundation only — no install UI).
 */
export function isStandaloneDisplay() {
  const mediaStandalone = window.matchMedia('(display-mode: standalone)').matches;
  const mediaFullscreen = window.matchMedia('(display-mode: fullscreen)').matches;
  const mediaMinimal = window.matchMedia('(display-mode: minimal-ui)').matches;
  const iosStandalone = window.navigator.standalone === true;

  return mediaStandalone || mediaFullscreen || mediaMinimal || iosStandalone;
}

export function getDisplayMode() {
  if (window.navigator.standalone === true) return 'standalone-ios';
  if (window.matchMedia('(display-mode: standalone)').matches) return 'standalone';
  if (window.matchMedia('(display-mode: fullscreen)').matches) return 'fullscreen';
  if (window.matchMedia('(display-mode: minimal-ui)').matches) return 'minimal-ui';
  if (window.matchMedia('(display-mode: browser)').matches) return 'browser';
  return 'unknown';
}

export function getInstallState() {
  return {
    displayMode: getDisplayMode(),
    isStandalone: isStandaloneDisplay(),
    canInstall: Boolean(window.__deferredInstallPrompt),
    isOnline: navigator.onLine,
  };
}

export function initPwa() {
  document.documentElement.dataset.displayMode = getDisplayMode();
  document.documentElement.dataset.standalone = String(isStandaloneDisplay());

  const mq = window.matchMedia('(display-mode: standalone)');
  const sync = () => {
    document.documentElement.dataset.displayMode = getDisplayMode();
    document.documentElement.dataset.standalone = String(isStandaloneDisplay());
  };

  if (typeof mq.addEventListener === 'function') {
    mq.addEventListener('change', sync);
  } else if (typeof mq.addListener === 'function') {
    mq.addListener(sync);
  }

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    window.__deferredInstallPrompt = event;
    document.dispatchEvent(new CustomEvent('pwainstallavailable'));
  });

  window.addEventListener('appinstalled', () => {
    window.__deferredInstallPrompt = null;
    document.dispatchEvent(new CustomEvent('pwainstalled'));
  });

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.warn('[pwa] SW registration failed:', err);
      });
    });
  }
}
