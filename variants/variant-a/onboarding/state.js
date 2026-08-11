import { navigate } from '../../../js/router.js';
import { ensureAccountBootstrap, isAuthenticated } from '../account/store.js';

export const ONBOARDING_STORAGE_KEY = 'foco.onboarding.complete';

/** After tour + auth, land on profile (scoped home) */
export const ROUTE_HOME = 'profile';

/** Survive accidental remounts while the tour is in progress */
let persistedStepIndex = 0;

export function getOnboardingSlideIndex() {
  return persistedStepIndex;
}

export function setOnboardingSlideIndex(index) {
  persistedStepIndex = Math.max(0, Number(index) || 0);
}

export function resetOnboardingSlide() {
  persistedStepIndex = 0;
}

export function isOnboardingComplete() {
  try {
    return localStorage.getItem(ONBOARDING_STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

export function markOnboardingComplete() {
  try {
    localStorage.setItem(ONBOARDING_STORAGE_KEY, '1');
  } catch {
    /* private mode */
  }
}

/**
 * Finish welcome tour:
 * - Signed in → profile
 * - Not signed in → auth landing
 */
export function finishOnboarding() {
  markOnboardingComplete();
  resetOnboardingSlide();
  if (isAuthenticated()) {
    ensureAccountBootstrap();
    navigate(ROUTE_HOME, { replace: true });
    return;
  }
  navigate('auth', { replace: true });
}

/** After auth, continue into the app (tour already ran on launch). */
export function routeAfterAuth() {
  ensureAccountBootstrap();
  return ROUTE_HOME;
}

export function resetOnboardingComplete() {
  try {
    localStorage.removeItem(ONBOARDING_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export function replayOnboarding() {
  resetOnboardingComplete();
  resetOnboardingSlide();
  navigate('onboarding', { replace: true });
}
