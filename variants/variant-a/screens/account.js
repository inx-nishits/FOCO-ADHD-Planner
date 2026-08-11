import { getRoute, navigate } from '../../../js/router.js';
import { requireAppAccess } from '../app-guard.js';
import { parseAccountRoute } from '../account/helpers.js';
import { renderProfileHub } from './account-profile.js';
import { renderSettingsHub } from './account-settings-hub.js';
import { renderPasswordSettings } from './account-password.js';
import { renderNotificationSettings } from './account-notifications.js';
import { renderPreferenceSettings } from './account-preferences.js';
import { renderDeleteAccount, renderDeleteConfirm } from './account-delete.js';
import {
  renderSubscriptionHome,
  renderSubscriptionPlans,
  renderSubscriptionReview,
  renderSubscriptionSuccess,
  renderSubscriptionManage,
  renderSubscriptionRestore,
} from './account-subscription.js';
import { renderAbout, renderPrivacy, renderTerms, renderFaq, renderContact } from './account-support.js';

export function renderAccountFlow(root) {
  if (!requireAppAccess(getRoute())) return;

  const route = getRoute();
  const { view } = parseAccountRoute(route);

  const map = {
    profile: renderProfileHub,
    settings: renderSettingsHub,
    password: renderPasswordSettings,
    notifications: renderNotificationSettings,
    preferences: renderPreferenceSettings,
    delete: renderDeleteAccount,
    deleteConfirm: renderDeleteConfirm,
    subscription: renderSubscriptionHome,
    subPlans: renderSubscriptionPlans,
    subReview: renderSubscriptionReview,
    subSuccess: renderSubscriptionSuccess,
    subManage: renderSubscriptionManage,
    subRestore: renderSubscriptionRestore,
    about: renderAbout,
    privacy: renderPrivacy,
    terms: renderTerms,
    faq: renderFaq,
    contact: renderContact,
  };

  const renderer = map[view];
  if (!renderer) {
    navigate('profile', { replace: true });
    return;
  }
  renderer(root);
}

export function isAccountRoute(route) {
  return parseAccountRoute(route).view !== 'unknown';
}
