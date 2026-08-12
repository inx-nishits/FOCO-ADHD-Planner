/**
 * Variant C presentation shell — desktop iPhone frame + variant switcher.
 * Does not alter C screen UI; only wraps presentation chrome.
 */
import { initDevicePreview } from '/js/device-preview.js';
import { initPreviewControls } from '/js/preview-controls.js';
import { persistVariant } from '/js/variant-manager.js';
import { isStandaloneDisplay } from '/js/pwa.js';

document.documentElement.dataset.variant = 'c';
document.body.dataset.variant = 'c';
persistVariant('c');

document.documentElement.dataset.standalone = String(isStandaloneDisplay());

/** Sync dynamic viewport height for mobile Safari / PWA (Variant C only). */
function syncViewportHeight() {
  const height = window.visualViewport?.height ?? window.innerHeight;
  document.documentElement.style.setProperty('--vc-vh', `${height}px`);
}

syncViewportHeight();
window.addEventListener('resize', syncViewportHeight, { passive: true });
window.visualViewport?.addEventListener('resize', syncViewportHeight, { passive: true });
window.visualViewport?.addEventListener('scroll', syncViewportHeight, { passive: true });

/** Block iOS Safari pinch-to-zoom on Variant C (mobile/PWA only). */
function blockPinchZoom() {
  if (document.documentElement.dataset.deviceFrame !== 'off') return;
  const prevent = (event) => event.preventDefault();
  document.addEventListener('gesturestart', prevent, { passive: false });
  document.addEventListener('gesturechange', prevent, { passive: false });
  document.addEventListener('gestureend', prevent, { passive: false });
}

initDevicePreview();
initPreviewControls();
blockPinchZoom();

document.addEventListener('deviceframechange', syncViewportHeight);
