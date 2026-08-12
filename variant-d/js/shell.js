/**
 * Variant D presentation shell — desktop iPhone frame + variant switcher.
 * Does not alter D screen UI; only wraps presentation chrome.
 */
import { initDevicePreview } from '/js/device-preview.js';
import { initPreviewControls } from '/js/preview-controls.js';
import { persistVariant } from '/js/variant-manager.js';
import { isStandaloneDisplay } from '/js/pwa.js';

document.documentElement.dataset.variant = 'd';
document.body.dataset.variant = 'd';
persistVariant('d');

document.documentElement.dataset.standalone = String(isStandaloneDisplay());

/** Sync dynamic viewport height for mobile Safari / PWA (Variant D only). */
function syncViewportHeight() {
  const height = window.visualViewport?.height ?? window.innerHeight;
  document.documentElement.style.setProperty('--vd-vh', `${height}px`);
}

syncViewportHeight();
window.addEventListener('resize', syncViewportHeight, { passive: true });
window.visualViewport?.addEventListener('resize', syncViewportHeight, { passive: true });
window.visualViewport?.addEventListener('scroll', syncViewportHeight, { passive: true });

/** Block iOS Safari pinch-to-zoom on Variant D (mobile/PWA only). */
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

/**
 * Keep PWA / Android status-bar theme-color in sync with the active screen
 * (white app screens vs purple splash) so safe-area chrome matches natively.
 */
const THEME_COLOR_SCREEN = '#FFFFFF';
const THEME_COLOR_SPLASH = '#6C4CF1';

function syncThemeColor() {
  const splashOn = document.getElementById('splash-screen')?.classList.contains('active');
  const color = splashOn ? THEME_COLOR_SPLASH : THEME_COLOR_SCREEN;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta && meta.getAttribute('content') !== color) {
    meta.setAttribute('content', color);
  }
}

syncThemeColor();
const appContainer = document.getElementById('app-container');
if (appContainer) {
  new MutationObserver(syncThemeColor).observe(appContainer, {
    subtree: true,
    attributes: true,
    attributeFilter: ['class'],
  });
}
