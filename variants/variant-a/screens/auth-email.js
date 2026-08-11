import { navigate } from '../../../js/router.js';
import { authContext, setAuthEmail } from '../auth/state.js';
import { markAuthenticated } from '../account/store.js';
import { routeAfterAuth } from '../onboarding/state.js';
import { resetForgotPasswordFlow } from './forgot-password.js';
import {
  createAuthScreen,
  escapeHtml,
  formLabel,
  isValidEmail,
  mockDelay,
  passwordToggleButton,
  bindPasswordToggles,
  setButtonLoading,
} from '../auth/helpers.js';
import { iconSvg } from '../components/icons.js';

function fieldHtml(id, label, type = 'text', autocomplete = '', placeholder = '') {
  const ac = autocomplete ? ` autocomplete="${escapeHtml(autocomplete)}"` : '';
  const ph = placeholder ? ` placeholder="${escapeHtml(placeholder)}"` : '';
  const inputType = type === 'password' ? 'password' : type;
  const isPassword = type === 'password';
  const isEmail = type === 'email';
  const iconName = isPassword ? 'lock' : isEmail ? 'mail' : 'user';

  return `
    <div class="foco-field" data-field="${escapeHtml(id)}">
      ${formLabel(id, label)}
      <div class="foco-input-wrap foco-input-wrap--icon${isPassword ? ' foco-input-wrap--password' : ''}">
        <span class="foco-field__icon" aria-hidden="true">${iconSvg(iconName)}</span>
        <input
          class="foco-input"
          id="${escapeHtml(id)}"
          name="${escapeHtml(id)}"
          type="${inputType}"
          inputmode="${type === 'email' ? 'email' : 'text'}"
          ${ac}
          ${ph}
          ${isPassword ? 'data-password' : ''}
        />
        ${isPassword ? passwordToggleButton(id) : ''}
      </div>
      <p class="foco-field-error" id="${escapeHtml(id)}-error" role="alert" hidden></p>
    </div>
  `;
}

function setFieldError(root, id, message) {
  const wrap = root.querySelector(`[data-field="${id}"]`);
  const input = root.querySelector(`#${id}`);
  const err = root.querySelector(`#${id}-error`);
  if (!wrap || !input || !err) return;
  if (message) {
    wrap.classList.add('foco-field--error');
    wrap.classList.remove('foco-field--valid');
    input.setAttribute('aria-invalid', 'true');
    err.textContent = message;
    err.hidden = false;
  } else {
    wrap.classList.remove('foco-field--error');
    input.removeAttribute('aria-invalid');
    err.textContent = '';
    err.hidden = true;
  }
}

function clearErrors(root) {
  root.querySelectorAll('.foco-field').forEach((f) => {
    f.classList.remove('foco-field--error', 'foco-field--valid');
  });
  root.querySelectorAll('.foco-field-error').forEach((e) => {
    e.hidden = true;
    e.textContent = '';
  });
}

export function renderLogin(root) {
  authContext.fromGoogle = false;
  resetForgotPasswordFlow();

  const section = createAuthScreen({
    ariaLabel: 'Log in',
    className: 'foco-auth-login',
    showBack: true,
    backRoute: 'auth',
    bodyHtml: `
      <div class="foco-auth-form-head">
        <h1 class="foco-title">Log in</h1>
        <p class="foco-body-secondary">Welcome back. Ready to focus?</p>
      </div>
      <form class="foco-auth-form" id="login-form" novalidate>
        ${fieldHtml('login-email', 'Email address', 'email', 'email', 'you@email.com')}
        ${fieldHtml('login-password', 'Password', 'password', 'current-password', 'Enter your password')}
        <p class="foco-auth-inline">
          <button type="button" class="foco-link" id="login-forgot">Forgot password?</button>
        </p>
      </form>
    `,
    footerHtml: `
      <button type="submit" form="login-form" class="foco-btn foco-btn--primary foco-auth-footer__cta" id="login-submit">
        Log in
      </button>
      <p class="foco-auth-switch">
        New to FOCO?
        <button type="button" class="foco-link" id="login-signup">Sign up</button>
      </p>
    `,
  });

  root.replaceChildren(section);
  bindPasswordToggles(section);

  section.querySelector('#login-forgot')?.addEventListener('click', () => {
    resetForgotPasswordFlow();
    navigate('forgot-password');
  });
  section.querySelector('#login-signup')?.addEventListener('click', () => navigate('signup'));

  section.querySelector('#login-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearErrors(section);

    const email = section.querySelector('#login-email')?.value?.trim() || '';
    const password = section.querySelector('#login-password')?.value || '';
    let valid = true;

    if (!email) {
      setFieldError(section, 'login-email', 'Email is required.');
      valid = false;
    } else if (!isValidEmail(email)) {
      setFieldError(section, 'login-email', 'Enter a valid email address.');
      valid = false;
    }

    if (!password) {
      setFieldError(section, 'login-password', 'Password is required.');
      valid = false;
    } else if (password.length < 8) {
      setFieldError(section, 'login-password', 'Incorrect password. Try again.');
      valid = false;
    }

    if (!valid) return;

    const btn = section.querySelector('#login-submit');
    setButtonLoading(btn, true, 'Logging in…');
    setAuthEmail(email);
    await mockDelay();

    // Mock: demo password for invalid state testing
    if (password === 'wrong123') {
      setButtonLoading(btn, false);
      setFieldError(section, 'login-password', 'Incorrect password. Try again.');
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
    className: 'foco-auth-signup',
    showBack: true,
    backRoute: 'auth',
    bodyHtml: `
      <div class="foco-auth-form-head">
        <h1 class="foco-title">Create account</h1>
        <p class="foco-body-secondary">Start before your brain talks you out of it.</p>
      </div>
      <form class="foco-auth-form" id="signup-form" novalidate>
        <div class="foco-auth-form__row">
          ${fieldHtml('signup-first', 'First name', 'text', 'given-name', 'Alex')}
          ${fieldHtml('signup-last', 'Last name', 'text', 'family-name', 'Rivera')}
        </div>
        ${fieldHtml('signup-email', 'Email address', 'email', 'email', 'you@email.com')}
        ${fieldHtml('signup-password', 'Password', 'password', 'new-password', 'At least 8 characters')}
        ${fieldHtml('signup-confirm', 'Confirm password', 'password', 'new-password', 'Re-enter password')}
      </form>
    `,
    footerHtml: `
      <button type="submit" form="signup-form" class="foco-btn foco-btn--primary foco-auth-footer__cta" id="signup-submit">
        Create account
      </button>
      <p class="foco-auth-switch">
        Already have an account?
        <button type="button" class="foco-link" id="signup-login">Log in</button>
      </p>
    `,
  });

  root.replaceChildren(section);
  bindPasswordToggles(section);

  section.querySelector('#signup-login')?.addEventListener('click', () => navigate('login'));

  section.querySelector('#signup-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearErrors(section);

    const first = section.querySelector('#signup-first')?.value?.trim() || '';
    const last = section.querySelector('#signup-last')?.value?.trim() || '';
    const email = section.querySelector('#signup-email')?.value?.trim() || '';
    const password = section.querySelector('#signup-password')?.value || '';
    const confirm = section.querySelector('#signup-confirm')?.value || '';
    let valid = true;

    if (!first) {
      setFieldError(section, 'signup-first', 'First name is required.');
      valid = false;
    }
    if (!last) {
      setFieldError(section, 'signup-last', 'Last name is required.');
      valid = false;
    }
    if (!email) {
      setFieldError(section, 'signup-email', 'Email is required.');
      valid = false;
    } else if (!isValidEmail(email)) {
      setFieldError(section, 'signup-email', 'Enter a valid email address.');
      valid = false;
    }
    if (!password) {
      setFieldError(section, 'signup-password', 'Password is required.');
      valid = false;
    } else if (password.length < 8) {
      setFieldError(section, 'signup-password', 'Use at least 8 characters.');
      valid = false;
    }
    if (confirm !== password) {
      setFieldError(section, 'signup-confirm', 'Passwords do not match.');
      valid = false;
    }

    if (!valid) return;

    const btn = section.querySelector('#signup-submit');
    setButtonLoading(btn, true, 'Creating account…');
    authContext.firstName = first;
    authContext.lastName = last;
    setAuthEmail(email);
    await mockDelay();
    setButtonLoading(btn, false);
    navigate('verify', { replace: true });
  });
}
