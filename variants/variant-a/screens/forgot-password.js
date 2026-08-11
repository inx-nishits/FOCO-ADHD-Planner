import { navigate } from '../../../js/router.js';
import { authContext, setAuthEmail } from '../auth/state.js';
import {
  createAuthScreen,
  escapeHtml,
  formLabel,
  isValidEmail,
  mockDelay,
  setButtonLoading,
} from '../auth/helpers.js';

let forgotStep = 'form';

/**
 * Forgot password — form → success confirmation.
 */
export function renderForgotPassword(root) {
  if (forgotStep === 'success') {
    renderForgotSuccess(root);
    return;
  }

  const section = createAuthScreen({
    ariaLabel: 'Reset password',
    className: 'foco-auth-forgot',
    showBack: true,
    backRoute: 'login',
    bodyHtml: `
      <div class="foco-auth-form-head">
        <h1 class="foco-title">Forgot password?</h1>
        <p class="foco-body-secondary">
          Enter your email and we will send a link to reset your password.
        </p>
      </div>
      <form class="foco-auth-form" id="forgot-form" novalidate>
        <div class="foco-field" data-field="forgot-email">
          ${formLabel('forgot-email', 'Email address')}
          <input
            class="foco-input"
            id="forgot-email"
            name="forgot-email"
            type="email"
            inputmode="email"
            autocomplete="email"
            placeholder="you@email.com"
          />
          <p class="foco-field-error" id="forgot-email-error" role="alert" hidden></p>
        </div>
      </form>
    `,
    footerHtml: `
      <button type="submit" form="forgot-form" class="foco-btn foco-btn--primary foco-auth-footer__cta" id="forgot-submit">
        Send reset link
      </button>
    `,
  });

  root.replaceChildren(section);

  section.querySelector('#forgot-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = section.querySelector('#forgot-email')?.value?.trim() || '';
    const err = section.querySelector('#forgot-email-error');
    const wrap = section.querySelector('[data-field="forgot-email"]');

    if (!email) {
      wrap?.classList.add('foco-field--error');
      err.textContent = 'Email is required.';
      err.hidden = false;
      return;
    }
    if (!isValidEmail(email)) {
      wrap?.classList.add('foco-field--error');
      err.textContent = 'Enter a valid email address.';
      err.hidden = false;
      return;
    }

    const btn = section.querySelector('#forgot-submit');
    setButtonLoading(btn, true, 'Sending…');
    setAuthEmail(email);
    await mockDelay();
    setButtonLoading(btn, false);
    forgotStep = 'success';
    renderForgotPassword(root);
  });
}

function renderForgotSuccess(root) {
  const email = authContext.email || 'your email';

  const section = createAuthScreen({
    ariaLabel: 'Reset link sent',
    className: 'foco-auth-forgot foco-auth-forgot--success',
    showBack: true,
    backRoute: 'login',
    bodyHtml: `
      <div class="foco-auth-status">
        <span class="foco-chip foco-auth-status__badge foco-chip--active">Email sent</span>
        <h1 class="foco-h2">Check your email</h1>
        <p class="foco-body-secondary foco-auth-status__copy">
          If an account exists for
          <strong class="foco-auth-email">${escapeHtml(email)}</strong>,
          you will receive a password reset link shortly.
        </p>
      </div>
    `,
    footerHtml: `
      <button type="button" class="foco-btn foco-btn--primary foco-auth-footer__cta" id="forgot-done">
        Back to log in
      </button>
    `,
  });

  root.replaceChildren(section);

  section.querySelector('#forgot-done')?.addEventListener('click', () => {
    forgotStep = 'form';
    navigate('login');
  });
}

/** Reset forgot flow when entering from login fresh */
export function resetForgotPasswordFlow() {
  forgotStep = 'form';
}
