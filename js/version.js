/**
 * App version check — launch gate foundation.
 * Supports force/required updates and mock store update completion.
 */

import { APP_CONFIG } from './config.js';

const UPDATED_SESSION_KEY = 'foco.app.updatedTo';

/**
 * Compare semver-like strings: a < b → -1, a === b → 0, a > b → 1
 */
export function compareVersions(a, b) {
  const pa = String(a || '0').split('.').map((n) => parseInt(n, 10) || 0);
  const pb = String(b || '0').split('.').map((n) => parseInt(n, 10) || 0);
  const len = Math.max(pa.length, pb.length);

  for (let i = 0; i < len; i += 1) {
    const x = pa[i] || 0;
    const y = pb[i] || 0;
    if (x < y) return -1;
    if (x > y) return 1;
  }
  return 0;
}

function getEffectiveAppVersion() {
  try {
    const applied = sessionStorage.getItem(UPDATED_SESSION_KEY);
    if (applied && compareVersions(applied, APP_CONFIG.appVersion) >= 0) {
      return applied;
    }
  } catch {
    /* ignore */
  }
  return APP_CONFIG.appVersion;
}

/** Detect store target for CTA copy + deep link */
export function detectUpdatePlatform() {
  const ua = navigator.userAgent || '';
  if (/iPhone|iPad|iPod/i.test(ua)) return 'ios';
  if (/Android/i.test(ua)) return 'android';
  return 'web';
}

export function getStoreUpdateUrl(platform = detectUpdatePlatform()) {
  const stores = APP_CONFIG.storeUrls || {};
  if (platform === 'ios') return stores.ios || stores.web || '';
  if (platform === 'android') return stores.android || stores.web || '';
  return stores.web || stores.ios || stores.android || '';
}

/**
 * Determine whether an update gate should block continuation.
 * Priority:
 * 1. ?update=1 query (dev / demo)
 * 2. APP_CONFIG.forceUpdate
 * 3. effective appVersion < minRequiredVersion
 */
export function checkVersion(location = window.location) {
  const params = new URLSearchParams(location.search);
  const demoForce =
    params.get('update') === '1' || params.get('update') === 'true';

  const current = getEffectiveAppVersion();
  const required = APP_CONFIG.minRequiredVersion;
  const latest = APP_CONFIG.latestVersion || required;
  const forced = Boolean(APP_CONFIG.forceUpdate) || demoForce;
  const behindRequired = compareVersions(current, required) < 0;
  const behindLatest = compareVersions(current, latest) < 0;

  // Demo force always shows gate even if already "updated" this session —
  // unless user completed update in this same session after demo open.
  let updateRequired = forced || behindRequired;
  if (demoForce) {
    try {
      const applied = sessionStorage.getItem(UPDATED_SESSION_KEY);
      if (applied && compareVersions(applied, latest) >= 0) {
        updateRequired = false;
      } else {
        updateRequired = true;
      }
    } catch {
      updateRequired = true;
    }
  }

  const platform = detectUpdatePlatform();

  return {
    updateRequired,
    currentVersion: current,
    latestVersion: latest,
    minRequiredVersion: required,
    behindLatest,
    platform,
    storeUrl: getStoreUpdateUrl(platform),
    releaseNotes: APP_CONFIG.releaseNotes || [],
    reason: demoForce
      ? 'demo'
      : APP_CONFIG.forceUpdate
        ? 'forced'
        : behindRequired
          ? 'required'
          : 'current',
  };
}

/** Mark this session as updated to latest (mock store install complete). */
export function markUpdateApplied(version = APP_CONFIG.latestVersion) {
  try {
    sessionStorage.setItem(UPDATED_SESSION_KEY, String(version || APP_CONFIG.latestVersion));
  } catch {
    /* ignore */
  }
}

/**
 * Perform the Update CTA action.
 * Opens store URL when configured, then marks update applied and reloads
 * so splash can continue past the gate.
 */
export function performUpdate() {
  const info = checkVersion();
  const action = APP_CONFIG.updateAction || { type: 'store' };
  const url =
    (action.type === 'url' && action.url) ||
    info.storeUrl ||
    getStoreUpdateUrl();

  markUpdateApplied(info.latestVersion);

  if (url && (action.type === 'url' || action.type === 'store' || info.platform !== 'web')) {
    // Open store in a new tab when possible; still complete the mock gate.
    try {
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch {
      window.location.assign(url);
      return;
    }
  }

  // Soft refresh so splash re-runs version check with applied version
  window.setTimeout(() => {
    window.location.hash = '#/splash';
    window.location.reload();
  }, 280);
}
