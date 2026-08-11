import { APP_CONFIG } from '../../../js/config.js';
import { navigate } from '../../../js/router.js';
import { authContext, setAuthEmail } from '../auth/state.js';
import { markAuthenticated } from '../account/store.js';
import { routeAfterAuth } from '../onboarding/state.js';
import { resetForgotPasswordFlow } from './forgot-password.js';
import {
  createAuthScreen,
  fieldHtml,
  setFieldError,
  clearErrors,
  isValidEmail,
  mockDelay,
  setButtonLoading,
  authSignalsHtml,
} from '../auth/helpers.js';

export function renderLogin(root) {
  authContext.fromGoogle = false;
  resetForgotPasswordFlow();

  const section = createAuthScreen({
    ariaLabel: 'Log in',
    className: 'b-auth-login',
    showBack: true,
    backRoute: 'auth',
    buddySrc: APP_CONFIG.focoStates.ready,
    whisper: 'Pick up where you left off — one task, no overwhelm.',
    bodyHtml: `
      <div class="b-auth__titles">
        <div class="b-auth__eyebrow">Welcome back</div>
        <h1 class="b-auth__title">Log in</h1>
        <span class="b-auth__titleAccent" aria-hidden="true"></span>
        <p class="b-auth__lead">Ready to focus? Your day is waiting.</p>
      </div>
      ${authSignalsHtml(['One Thing Mode', 'Soft reminders', 'FOCO AI'])}
      <form class="b-auth__form" id="b-login-form" novalidate>
        ${fieldHtml('b-login-email', 'Email address', 'email', 'email', 'you@email.com')}
        ${fieldHtml('b-login-password', 'Password', 'password', 'current-password', 'Enter your password')}
        <button type="button" class="b-link b-auth__forgot" id="b-login-forgot">Forgot password?</button>
        <p class="b-auth__error" id="b-login-error" role="alert"></p>
      </form>
    `,
    footerHtml: `
      <button type="submit" form="b-login-form" class="b-btn b-btn--primary b-auth__primary" id="b-login-submit">
        Log in
      </button>
      <p class="b-auth__switch">
        New to FOCO?
        <button type="button" class="b-link" id="b-login-signup">Sign up</button>
      </p>
    `,
  });

  root.replaceChildren(section);

  section.querySelector('#b-login-forgot')?.addEventListener('click', () => navigate('forgot-password'));
  section.querySelector('#b-login-signup')?.addEventListener('click', () => navigate('signup'));

  section.querySelector('#b-login-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearErrors(section);

    const email = section.querySelector('#b-login-email')?.value?.trim() || '';
    const password = section.querySelector('#b-login-password')?.value || '';
    let valid = true;

    if (!email) {
      setFieldError(section, 'b-login-email', 'Email is required.');
      valid = false;
    } else if (!isValidEmail(email)) {
      setFieldError(section, 'b-login-email', 'Enter a valid email address.');
      valid = false;
    }

    if (!password) {
      setFieldError(section, 'b-login-password', 'Password is required.');
      valid = false;
    } else if (password.length < 8) {
      setFieldError(section, 'b-login-password', 'Incorrect password. Try again.');
      valid = false;
    }

    if (!valid) return;

    const btn = section.querySelector('#b-login-submit');
    setButtonLoading(btn, true, 'Logging in…');
    setAuthEmail(email);
    await mockDelay();

    if (password === 'wrong123') {
      setButtonLoading(btn, false);
      setFieldError(section, 'b-login-password', 'Incorrect password. Try again.');
      return;
    }

    setButtonLoading(btn, false);
    markAuthenticated();
    navigate(routeAfterAuth(), { replace: true });
  });
}

export function renderSignup(root) {
  authContext.fromGoogle = false;

  const section = createAuthScreen({
    ariaLabel: 'Create account',
    className: 'b-auth-signup',
    showBack: true,
    backRoute: 'auth',
    buddySrc: APP_CONFIG.focoStates.happy,
    whisper: 'Start before your brain talks you out of it.',
    bodyHtml: `
      <div class="b-auth__titles">
        <div class="b-auth__eyebrow">Get started</div>
        <h1 class="b-auth__title">Create account</h1>
        <span class="b-auth__titleAccent" aria-hidden="true"></span>
        <p class="b-auth__lead">A calm setup — then straight into focus.</p>
      </div>
      ${authSignalsHtml(['Plan the day', 'Focus one thing', 'Unstick with FOCO'])}
      <form class="b-auth__form" id="b-signup-form" novalidate>
        <div class="b-auth__row">
          ${fieldHtml('b-signup-first', 'First name', 'text', 'given-name', 'Alex')}
          ${fieldHtml('b-signup-last', 'Last name', 'text', 'family-name', 'Rivera')}
        </div>
        ${fieldHtml('b-signup-email', 'Email address', 'email', 'email', 'you@email.com')}
        <div class="b-auth__row">
          ${fieldHtml('b-signup-password', 'Password', 'password', 'new-password', 'Min. 8 chars')}
          ${fieldHtml('b-signup-confirm', 'Confirm', 'password', 'new-password', 'Re-enter')}
        </div>
      </form>
    `,
    footerHtml: `
      <button type="submit" form="b-signup-form" class="b-btn b-btn--primary b-auth__primary" id="b-signup-submit">
        Create account
      </button>
      <p class="b-auth__switch">
        Already have an account?
        <button type="button" class="b-link" id="b-signup-login">Log in</button>
      </p>
    `,
  });

  root.replaceChildren(section);

  section.querySelector('#b-signup-login')?.addEventListener('click', () => navigate('login'));

  section.querySelector('#b-signup-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearErrors(section);

    const first = section.querySelector('#b-signup-first')?.value?.trim() || '';
    const last = section.querySelector('#b-signup-last')?.value?.trim() || '';
    const email = section.querySelector('#b-signup-email')?.value?.trim() || '';
    const password = section.querySelector('#b-signup-password')?.value || '';
    const confirm = section.querySelector('#b-signup-confirm')?.value || '';
    let valid = true;

    if (!first) {
      setFieldError(section, 'b-signup-first', 'First name is required.');
      valid = false;
    }
    if (!last) {
      setFieldError(section, 'b-signup-last', 'Last name is required.');
      valid = false;
    }
    if (!email) {
      setFieldError(section, 'b-signup-email', 'Email is required.');
      valid = false;
    } else if (!isValidEmail(email)) {
      setFieldError(section, 'b-signup-email', 'Enter a valid email address.');
      valid = false;
    }
    if (!password) {
      setFieldError(section, 'b-signup-password', 'Password is required.');
      valid = false;
    } else if (password.length < 8) {
      setFieldError(section, 'b-signup-password', 'Use at least 8 characters.');
      valid = false;
    }
    if (confirm !== password) {
      setFieldError(section, 'b-signup-confirm', 'Passwords do not match.');
      valid = false;
    }

    if (!valid) return;

    const btn = section.querySelector('#b-signup-submit');
    setButtonLoading(btn, true, 'Creating account…');
    authContext.firstName = first;
    authContext.lastName = last;
    setAuthEmail(email);
    await mockDelay();
    setButtonLoading(btn, false);
    navigate('verify', { replace: true });
  });
}
