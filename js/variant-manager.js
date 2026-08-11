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

  ensureVariantStylesheet(variant.stylesheet);
  persistVariant(id);

  document.dispatchEvent(
    new CustomEvent('variantchange', {
      detail: { id, variant },
    }),
  );

  return variant;
}

function ensureVariantStylesheet(href) {
  let link = document.getElementById(VARIANT_LINK_ID);
  if (!link) {
    link = document.createElement('link');
    link.id = VARIANT_LINK_ID;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }
  if (link.getAttribute('href') !== href) {
    link.setAttribute('href', href);
  }
}

/**
 * Navigate to a variant URL. Uses History API when possible.
 * For root → /variant-x/ and cross-path switches, uses pushState + popstate handling.
 */
export function navigateToVariant(id, { replace = false, syncFromPopstate = false } = {}) {
  if (!isValidVariant(id)) return null;

  const variant = getVariant(id);
  const targetPath = variant.path;
  const currentPath = normalizePath(window.location.pathname);
  const nextPath = normalizePath(targetPath);

  applyVariant(id);

  if (syncFromPopstate) {
    return variant;
  }

  if (currentPath !== nextPath) {
    const url = new URL(window.location.href);
    url.pathname = targetPath;
    // Drop ?variant= when using clean path URLs
    url.searchParams.delete('variant');

    const method = replace ? 'replaceState' : 'pushState';
    history[method]({ variant: id }, '', url.pathname + url.search + url.hash);
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
