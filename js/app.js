import { APP_CONFIG } from './config.js';
import {
  detectVariantFromLocation,
  applyVariant,
  navigateToVariant,
  normalizePath,
  getVariant,
  isValidVariant,
} from './variant-manager.js';
import { initRouter, renderActiveScreen, onRouteChange } from './router.js';
import { initPwa, isStandaloneDisplay } from './pwa.js';
import { initDevicePreview } from './device-preview.js';
import { initPreviewControls } from './preview-controls.js';

async function bootstrap() {
  document.documentElement.classList.add('js');

  initPwa();

  const detection = detectVariantFromLocation();
  applyVariant(detection.id);

  // Canonicalize root / query-only entry onto clean variant URLs
  canonicalizeEntryUrl(detection);

  initRouter();
  initDevicePreview();
  initPreviewControls();

  // Variant-specific launch (A: splash → version → auth gate)
  if (detection.id === 'a') {
    const { initVariantA } = await import('../variants/variant-a/boot.js');
    initVariantA();
  }

  const appRoot = document.getElementById('app');
  if (appRoot) {
    renderActiveScreen(appRoot);
    onRouteChange(() => renderActiveScreen(appRoot));
  }

  window.addEventListener('popstate', () => {
    const next = detectVariantFromLocation();
    navigateToVariant(next.id, { syncFromPopstate: true });
  });

  // Reflect standalone / touch context on shell
  document.documentElement.dataset.standalone = String(isStandaloneDisplay());

  document.dispatchEvent(
    new CustomEvent('appready', {
      detail: {
        variant: detection.id,
        developmentPreview: APP_CONFIG.developmentPreview,
      },
    }),
  );
}

/**
 * Prefer shareable /variant-x/ URLs.
 * - /?variant=b  → /variant-b/
 * - /            → /variant-{stored|default}/ when not already on a variant path
 */
function canonicalizeEntryUrl(detection) {
  const path = normalizePath(window.location.pathname);
  const onVariantPath = /^\/variant-[a-z0-9]+\/$/i.test(path);

  if (onVariantPath) {
    return;
  }

  if (detection.source === 'url-query' || path === '/') {
    const variant = getVariant(detection.id);
    if (!variant) return;

    const url = new URL(window.location.href);
    url.pathname = variant.path;
    url.searchParams.delete('variant');
    history.replaceState({ variant: detection.id }, '', url.pathname + url.search + url.hash);
  }
}

// Re-export helpers useful for future app code
export {
  APP_CONFIG,
  navigateToVariant,
  detectVariantFromLocation,
  getVariant,
  isValidVariant,
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
