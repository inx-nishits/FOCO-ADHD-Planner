import { navigate, registerScreen } from '../../js/router.js';

import { renderSplash } from './screens/splash.js';
import { renderOnboarding } from './screens/onboarding.js';
import { renderReadyToFocus } from './screens/ready-to-focus.js';

import { renderAuthLanding } from './screens/auth-landing.js';
import { renderLogin, renderSignup } from './screens/auth-email.js';
import { renderVerify } from './screens/verify.js';
import { renderForgotPassword } from './screens/forgot-password.js';
import { renderProfileCompletion } from './screens/profile-completion.js';

import { renderProfileFlow } from './screens/account.js';
import { renderPlannerEmpty, renderAiEmpty, renderStatsEmpty } from './screens/empty-placeholders.js';

/**
 * Variant B wiring (scoped):
 * Splash → Onboarding → Ready to Focus → Auth → Profile hub
 * with bottom dock: Daily / AI / Stats / You (+ empty states)
 */
export function initVariantB() {
  // Core flow
  registerScreen('splash', renderSplash);
  registerScreen('onboarding', renderOnboarding);
  registerScreen('ready-to-focus', renderReadyToFocus);

  // Auth
  registerScreen('auth', renderAuthLanding);
  registerScreen('login', renderLogin);
  registerScreen('signup', renderSignup);
  registerScreen('verify', renderVerify);
  registerScreen('forgot-password', renderForgotPassword);
  registerScreen('profile-completion', renderProfileCompletion);

  // Profile / account hub (route-based inside renderProfileFlow)
  registerScreen('profile', renderProfileFlow);
  registerScreen('settings', renderProfileFlow);
  registerScreen('password', renderProfileFlow);
  registerScreen('notifications', renderProfileFlow);
  registerScreen('preferences', renderProfileFlow);
  registerScreen('delete', renderProfileFlow);
  registerScreen('deleteConfirm', renderProfileFlow);
  registerScreen('subscription', renderProfileFlow);
  registerScreen('subPlans', renderProfileFlow);
  registerScreen('subReview', renderProfileFlow);
  registerScreen('subSuccess', renderProfileFlow);
  registerScreen('subManage', renderProfileFlow);
  registerScreen('subRestore', renderProfileFlow);
  registerScreen('about', renderProfileFlow);
  registerScreen('privacy', renderProfileFlow);
  registerScreen('terms', renderProfileFlow);
  registerScreen('faq', renderProfileFlow);
  registerScreen('contact', renderProfileFlow);

  // Placeholder main modules
  registerScreen('planner', renderPlannerEmpty);
  registerScreen('ai', renderAiEmpty);
  registerScreen('stats', renderStatsEmpty);

  // Always start on splash on every load/refresh
  navigate('splash', { replace: true });
  return { startRoute: 'splash' };
}

