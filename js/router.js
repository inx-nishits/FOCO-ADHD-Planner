import { APP_CONFIG } from './config.js';

/**
 * Lightweight hash router for future screens.
 * Routes live under #/… so they compose with variant path URLs:
 *   /variant-b/#/home
 */
const listeners = new Set();

/** Fallback when a removed or unknown hash is opened */
const UNKNOWN_ROUTE_FALLBACK = 'profile';

export function getRoute() {
  const hash = window.location.hash || '';
  const prefix = APP_CONFIG.hashPrefix;

  if (!hash || hash === '#' || hash === '#/') {
    return APP_CONFIG.defaultRoute;
  }

  if (hash.startsWith(prefix)) {
    const route = hash.slice(prefix.length).split('?')[0].replace(/\/+$/, '');
    return route || APP_CONFIG.defaultRoute;
  }

  return APP_CONFIG.defaultRoute;
}

export function navigate(route, { replace = false } = {}) {
  const clean = String(route || APP_CONFIG.defaultRoute).replace(/^\/+|\/+$/g, '');
  const nextHash = `${APP_CONFIG.hashPrefix}${clean}`;

  if (replace) {
    const url = `${window.location.pathname}${window.location.search}${nextHash}`;
    history.replaceState(history.state, '', url);
    notify();
    return;
  }

  if (window.location.hash !== nextHash) {
    // hashchange listener calls notify — avoid double render
    window.location.hash = nextHash;
    return;
  }

  notify();
}

export function onRouteChange(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function notify() {
  const route = getRoute();
  document.body.dataset.route = route;
  document.dispatchEvent(
    new CustomEvent('routechange', { detail: { route } }),
  );
  listeners.forEach((cb) => {
    try {
      cb(route);
    } catch (err) {
      console.error('[router]', err);
    }
  });
}

export function initRouter() {
  window.addEventListener('hashchange', notify);

  if (!window.location.hash || window.location.hash === '#') {
    const url = `${window.location.pathname}${window.location.search}${APP_CONFIG.hashPrefix}${APP_CONFIG.defaultRoute}`;
    history.replaceState(history.state, '', url);
  }

  notify();
}

/**
 * Future screens: register renderers here.
 * Foundation phase keeps a blank #screen.
 */
const screens = new Map();

export function registerScreen(name, render) {
  screens.set(name, render);
}

export function renderActiveScreen(root) {
  const route = getRoute();
  let renderer = screens.get(route);

  if (!renderer && isVariantAAccountRoute(route)) {
    renderer = screens.get('account');
  }

  if (typeof renderer === 'function') {
    root.replaceChildren();
    renderer(root, { route });
    return;
  }

  // Unknown / removed route → valid kept screen (auth gate runs there)
  if (route !== UNKNOWN_ROUTE_FALLBACK) {
    navigate(UNKNOWN_ROUTE_FALLBACK, { replace: true });
    return;
  }

  root.replaceChildren();
  const section = document.createElement('section');
  section.id = 'screen';
  section.className = 'app-screen';
  section.setAttribute('aria-label', 'Application');
  root.appendChild(section);
}

/** Variant A account area */
function isVariantAAccountRoute(route) {
  if (route === 'profile' || route === 'settings' || route === 'subscription') return true;
  if (route === 'about' || route === 'privacy' || route === 'terms' || route === 'faq' || route === 'contact') {
    return true;
  }
  if (route.startsWith('settings/') || route.startsWith('subscription/')) return true;
  return false;
}
