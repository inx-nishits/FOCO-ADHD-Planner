import { APP_CONFIG } from './config.js';
import { VARIANTS, getVariant, isValidVariant } from './variants.js';

export { getVariant, isValidVariant, VARIANTS };

const VARIANT_LINK_ID = 'variant-stylesheet';
const PATH_PATTERN = /^\/variant-([a-z0-9]+)\/?/i;

/**
 * Resolve active variant with priority:
 * 1. Explicit URL path (/variant-b/)
 * 2. Explicit query (?variant=b)
 * 3. localStorage
 * 4. APP_CONFIG.defaultVariant
 */
export function detectVariantFromLocation(location = window.location) {
  const pathMatch = location.pathname.match(PATH_PATTERN);
  if (pathMatch && isValidVariant(pathMatch[1].toLowerCase())) {
    return {
      id: pathMatch[1].toLowerCase(),
      source: 'url-path',
    };
  }

  const params = new URLSearchParams(location.search);
  const queryVariant = (params.get('variant') || '').toLowerCase();
  if (queryVariant && isValidVariant(queryVariant)) {
    return {
      id: queryVariant,
      source: 'url-query',
    };
  }

  try {
    const stored = localStorage.getItem(APP_CONFIG.storageKey);
    if (stored && isValidVariant(stored)) {
      return { id: stored, source: 'storage' };
    }
  } catch {
    /* private mode / blocked storage */
  }

  return {
    id: APP_CONFIG.defaultVariant,
    source: 'default',
  };
}

export function persistVariant(id) {
  if (!isValidVariant(id)) return;
  try {
    localStorage.setItem(APP_CONFIG.storageKey, id);
  } catch {
    /* ignore */
  }
}

function stylesheetHref(path) {
  const version = APP_CONFIG.cacheVersion || '1';
  const sep = path.includes('?') ? '&' : '?';
  return `${path}${sep}v=${encodeURIComponent(version)}`;
}

/**
 * Apply variant document attrs + stylesheet.
 * Returns the variant descriptor. Await `ready` (on the return value) if you
 * need the stylesheet to finish loading before rendering.
 */
export function applyVariant(id, { updateDocument = true } = {}) {
  if (!isValidVariant(id)) {
    id = APP_CONFIG.defaultVariant;
  }

  const variant = getVariant(id);

  if (updateDocument) {
    document.documentElement.dataset.variant = id;
    document.body.dataset.variant = id;
    document.title = `${APP_CONFIG.appName} · ${variant.name}`;
  }

  const ready = Promise.resolve(ensureVariantStylesheet(stylesheetHref(variant.stylesheet))).then(() => {
    document.dispatchEvent(
      new CustomEvent('variantchange', {
        detail: { id, variant, ready: Promise.resolve(variant) },
      }),
    );
    return variant;
  });

  persistVariant(id);
  return Object.assign({}, variant, { ready });
}

function ensureVariantStylesheet(href) {
  let link = document.getElementById(VARIANT_LINK_ID);
  if (!link) {
    link = document.createElement('link');
    link.id = VARIANT_LINK_ID;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }

  if (link.getAttribute('href') === href) {
    // Already current — still wait if the sheet hasn't finished loading
    if (link.sheet) return Promise.resolve();
    return waitForLink(link);
  }

  return new Promise((resolve) => {
    const settle = () => resolve();
    link.onload = settle;
    link.onerror = settle;
    link.setAttribute('href', href);
    // Cached sheets may not fire load in some browsers
    requestAnimationFrame(() => {
      if (link.sheet) settle();
    });
  });
}

function waitForLink(link) {
  if (link.sheet) return Promise.resolve();
  return new Promise((resolve) => {
    const settle = () => resolve();
    link.addEventListener('load', settle, { once: true });
    link.addEventListener('error', settle, { once: true });
  });
}

/**
 * Switch UI variant.
 * Uses a full page load so boot + stylesheet always initialize cleanly
 * (avoids stale screens / half-loaded CSS that previously needed a manual refresh).
 */
export function navigateToVariant(id, { replace = false, syncFromPopstate = false } = {}) {
  if (!isValidVariant(id)) return null;

  const variant = getVariant(id);

  if (syncFromPopstate) {
    applyVariant(id);
    return variant;
  }

  persistVariant(id);

  const url = new URL(window.location.href);
  url.pathname = variant.path;
  url.searchParams.delete('variant');
  url.hash = `${APP_CONFIG.hashPrefix}splash`;

  const href = `${url.pathname}${url.search}${url.hash}`;
  if (replace) {
    window.location.replace(href);
  } else {
    window.location.assign(href);
  }

  return variant;
}

export function normalizePath(pathname) {
  if (!pathname || pathname === '/') return '/';
  return pathname.endsWith('/') ? pathname : `${pathname}/`;
}

export function getAllVariants() {
  return Object.values(VARIANTS);
}

export function getCurrentVariantId() {
  return document.body?.dataset?.variant || APP_CONFIG.defaultVariant;
}
