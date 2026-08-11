import { authContext } from '../auth/state.js';
import {
  STORAGE_ACCOUNT,
  STORAGE_SESSION,
  STORAGE_SETTINGS,
  STORAGE_SUBSCRIPTION,
} from './constants.js';

const defaultProfile = () => ({
  firstName: authContext.firstName || 'Alex',
  lastName: authContext.lastName || 'Rivera',
  email: authContext.email || 'alex@tryfoco.app',
  avatarInitials: 'AR',
  avatarUrl: '/assets/images/mock-user-alex.png',
  onboardingGoal: 'Ready to focus — one task at a time',
  timezone: 'Auto (device)',
  memberSince: '2026-03-12',
  focusStyle: 'One Thing Mode',
});

const defaultSubscription = () => ({
  planId: 'free',
  status: 'active',
  renewsAt: null,
  pendingChange: null,
  hadPurchase: true,
});

const defaultSettings = () => ({
  notifications: {
    taskReminders: true,
    focusSessionEnd: true,
    dailyPlanning: true,
    streaks: false,
    productUpdates: true,
  },
  preferences: {
    haptics: true,
    soundEffects: false,
    weekStartsMonday: true,
    compactPlanner: false,
  },
});

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return { ...fallback(), ...JSON.parse(raw) };
  } catch {
    /* ignore */
  }
  return fallback();
}

function write(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    /* ignore */
  }
  document.dispatchEvent(new CustomEvent('accountchange'));
}

export function isAuthenticated() {
  try {
    return localStorage.getItem(STORAGE_SESSION) === '1';
  } catch {
    return false;
  }
}

export function markAuthenticated() {
  try {
    localStorage.setItem(STORAGE_SESSION, '1');
  } catch {
    /* ignore */
  }
  // Next Profile land after login should show the update modal once
  try {
    sessionStorage.setItem('foco.updateModal.pending', '1');
  } catch {
    /* ignore */
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(STORAGE_SESSION);
  } catch {
    /* ignore */
  }
}

export function getProfile() {
  return read(STORAGE_ACCOUNT, defaultProfile);
}

export function saveProfile(patch) {
  const next = { ...getProfile(), ...patch };
  if (next.firstName || next.lastName) {
    next.avatarInitials = `${(next.firstName || '')[0] || ''}${(next.lastName || '')[0] || ''}`.toUpperCase() || 'FO';
  }
  write(STORAGE_ACCOUNT, next);
  return next;
}

export function getSubscription() {
  return read(STORAGE_SUBSCRIPTION, defaultSubscription);
}

export function saveSubscription(patch) {
  const next = { ...getSubscription(), ...patch };
  write(STORAGE_SUBSCRIPTION, next);
  return next;
}

export function getSettings() {
  return read(STORAGE_SETTINGS, defaultSettings);
}

export function saveSettings(patch) {
  const current = getSettings();
  const next = {
    notifications: { ...current.notifications, ...(patch.notifications || {}) },
    preferences: { ...current.preferences, ...(patch.preferences || {}) },
  };
  write(STORAGE_SETTINGS, next);
  return next;
}

let pendingPlan = 'monthly';

export function setPendingPlan(planId) {
  pendingPlan = planId === 'annual' ? 'annual' : 'monthly';
}

export function getPendingPlan() {
  return pendingPlan;
}

export function upgradeToPlan(planId) {
  const renews = new Date();
  if (planId === 'annual') renews.setFullYear(renews.getFullYear() + 1);
  else renews.setMonth(renews.getMonth() + 1);
  return saveSubscription({
    planId,
    status: 'active',
    renewsAt: renews.toISOString(),
    pendingChange: null,
  });
}

export function scheduleDowngrade() {
  return saveSubscription({
    pendingChange: 'downgrade_free',
  });
}

export function cancelPendingChange() {
  return saveSubscription({ pendingChange: null });
}

export function restorePurchasesMock() {
  const sub = getSubscription();
  if (sub.hadPurchase && sub.planId !== 'free') {
    return { ok: true, message: 'Your Premium subscription has been restored.' };
  }
  if (sub.hadPurchase) {
    upgradeToPlan('annual');
    return { ok: true, message: 'Premium Annual restored from your App Store account.' };
  }
  return { ok: false, message: 'No previous purchases found for this account.' };
}

export function deleteAllAccountData() {
  const keys = [
    STORAGE_ACCOUNT,
    STORAGE_SUBSCRIPTION,
    STORAGE_SETTINGS,
    STORAGE_SESSION,
    'foco.planner.tasks',
    'foco.planner.selectedDate',
    'foco.planner.expanded',
    'foco.stats.analytics',
    'foco.ai.threads',
    'foco.ai.activeThreadId',
    'foco.onboarding.complete',
    'foco.ai.usageDay',
    'foco.ai.voiceDay',
    'foco.ai.subtasksDay',
  ];
  keys.forEach((k) => {
    try {
      localStorage.removeItem(k);
    } catch {
      /* ignore */
    }
  });
  try {
    sessionStorage.clear();
  } catch {
    /* ignore */
  }
}

/** Call once after onboarding completes — wire from existing flow without editing onboarding screen */
export function ensureAccountBootstrap() {
  if (!isAuthenticated()) {
    markAuthenticated();
    getProfile();
    getSubscription();
    getSettings();
  }
}
