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

// Static boot wiring avoids dynamic `import()` fetch failures.
import { initVariantA } from '../variants/variant-a/boot.js';
import { initVariantB } from '../variants/variant-b/boot.js';

async function bootstrap() {
  document.documentElement.classList.add('js');

  // In dev preview mode, ensure we don't get blocked by an old SW cache.
  // We must do this before any dynamic `import()` variant boot wiring.
  if (APP_CONFIG.developmentPreview && 'serviceWorker' in navigator) {
    try {
      const UNREGISTERED_FLAG = 'foco.devPreview.swUnregistered';
      if (!sessionStorage.getItem(UNREGISTERED_FLAG)) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map((r) => r.unregister()));

        sessionStorage.setItem(UNREGISTERED_FLAG, '1');
        // Reload so the page is no longer controlled by the previous SW.
        window.location.reload();
        return;
      }
    } catch {
      /* ignore */
    }
  }

  initPwa();

  const detection = detectVariantFromLocation();
  applyVariant(detection.id);

  // Canonicalize root / query-only entry onto clean variant URLs
  canonicalizeEntryUrl(detection);

  initRouter();
  initDevicePreview();
  initPreviewControls();

  // Variant-specific launch
  try {
    if (detection.id === 'a') {
      initVariantA();
    } else if (detection.id === 'b') {
      initVariantB();
    }
  } catch (err) {
    console.error('[boot] variant init failed', err);
    showBootError(err);
    return;
  }

  // Soft variant changes (e.g. browser back/forward via popstate):
  // wait for stylesheet, re-register screens, and force a fresh render.
  let activeVariantId = detection.id;
  document.addEventListener('variantchange', async (event) => {
    const nextId = event?.detail?.id;
    if (!nextId || nextId === activeVariantId) return;
    activeVariantId = nextId;

    const appRoot = document.getElementById('app');
    try {
      if (nextId === 'a') {
        initVariantA();
      } else if (nextId === 'b') {
        initVariantB();
      } else if (nextId === 'c') {
        // Variant C is stylesheet-only for now — keep last screen registry
        // but still remount so tokens/layout pick up cleanly.
      }

      if (appRoot) {
        renderActiveScreen(appRoot);
      }
    } catch (err) {
      console.error('[variant] failed to init', nextId, err);
    }
  });

  const appRoot = document.getElementById('app');
  if (appRoot) {
    try {
      renderActiveScreen(appRoot);
      onRouteChange(() => renderActiveScreen(appRoot));
    } catch (err) {
      console.error('[boot] render failed', err);
      showBootError(err);
      return;
    }
  }

  window.addEventListener('popstate', () => {
    const next = detectVariantFromLocation();
    if (next.id !== activeVariantId) {
      // Path variant changed via history — full reload for a clean boot
      window.location.reload();
      return;
    }
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

function showBootError(err) {
  const appRoot = document.getElementById('app');
  if (!appRoot) return;
  appRoot.replaceChildren();

  const pre = document.createElement('pre');
  pre.textContent = `Variant boot error:\n${err?.stack || err}`;
  pre.style.cssText = [
    'margin:0',
    'padding:16px',
    'white-space:pre-wrap',
    'font:600 12px/1.45 ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace',
    'color:#ef4444',
    'background:rgba(255,255,255,0.92)',
  ].join(';');
  appRoot.appendChild(pre);
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
