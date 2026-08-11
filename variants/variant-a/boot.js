import { navigate, registerScreen } from '../../js/router.js';
import { renderSplash } from './screens/splash.js';
import { renderUpdate } from './screens/update.js';
import { renderAuthLanding } from './screens/auth-landing.js';
import { renderLogin, renderSignup } from './screens/auth-email.js';
import { renderVerify } from './screens/verify.js';
import { renderForgotPassword } from './screens/forgot-password.js';
import { renderProfileCompletion } from './screens/profile-completion.js';
import { renderOnboarding } from './screens/onboarding.js';
import { renderHomeGate } from './screens/home-gate.js';
import { renderAccountFlow } from './screens/account.js';
import {
  renderPlannerEmpty,
  renderAiEmpty,
  renderStatsEmpty,
} from './screens/empty-placeholders.js';

/**
 * Variant A wiring (scoped):
 * Splash → Onboarding → Auth → Profile (+ empty Daily/AI/Stats)
 */
export function initVariantA() {
  registerScreen('splash', renderSplash);
  registerScreen('update', renderUpdate);
  registerScreen('auth', renderAuthLanding);
  registerScreen('login', renderLogin);
  registerScreen('signup', renderSignup);
  registerScreen('verify', renderVerify);
  registerScreen('forgot-password', renderForgotPassword);
  registerScreen('profile-completion', renderProfileCompletion);
  registerScreen('onboarding', renderOnboarding);
  registerScreen('home', renderHomeGate);
  registerScreen('planner', renderPlannerEmpty);
  registerScreen('ai', renderAiEmpty);
  registerScreen('stats', renderStatsEmpty);
  registerScreen('account', renderAccountFlow);

  // Every load/refresh starts on splash (ignore restored hash)
  navigate('splash', { replace: true });
  return { startRoute: 'splash' };
}
