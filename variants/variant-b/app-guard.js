import { navigate } from '../../js/router.js';
import { isAuthenticated, ensureAccountBootstrap } from './account/store.js';
import { isOnboardingComplete } from './onboarding/state.js';

const PUBLIC_ROUTES = new Set([
  'splash',
  'onboarding',
  'ready-to-focus',
  'auth',
  'login',
  'signup',
  'verify',
  'forgot-password',
  'profile-completion',
]);

export function isPublicAppRoute(route) {
  return PUBLIC_ROUTES.has(route);
}

/**
 * Gate main app modules — redirects to auth or onboarding when needed.
 * @returns {boolean} true when the caller should continue rendering
 */
export function requireAppAccess(route) {
  if (isPublicAppRoute(route)) return true;

  if (!isAuthenticated()) {
    navigate('auth', { replace: true });
    return false;
  }

  if (!isOnboardingComplete()) {
    navigate('onboarding', { replace: true });
    return false;
  }

  ensureAccountBootstrap();
  return true;
}

/** Resume after auth landing when session is already valid. */
export function resumeAuthenticatedRoute() {
  if (!isAuthenticated()) return null;
  ensureAccountBootstrap();
  return 'profile';
}
