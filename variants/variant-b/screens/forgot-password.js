import { APP_CONFIG } from '../../../js/config.js';
import { navigate } from '../../../js/router.js';
import { authContext, setAuthEmail } from '../auth/state.js';
import {
  createAuthScreen,
  escapeHtml,
  fieldHtml,
  isValidEmail,
  mockDelay,
  setButtonLoading,
  authSignalsHtml,
} from '../auth/helpers.js';

let forgotStep = 'form';

export function renderForgotPassword(root) {
  if (forgotStep === 'success') {
    renderForgotSuccess(root);
    return;
  }

  const section = createAuthScreen({
    ariaLabel: 'Reset password',
    className: 'b-auth-forgot',
    showBack: true,
    backRoute: 'login',
    buddySrc: APP_CONFIG.focoStates.calm,
    whisper: 'No stress — we’ll get you back in.',
    bodyHtml: `
      <div class="b-auth__titles">
        <div class="b-auth__eyebrow">Account recovery</div>
        <h1 class="b-auth__title">Forgot password?</h1>
        <span class="b-auth__titleAccent" aria-hidden="true"></span>
        <p class="b-auth__lead">Enter your email and we will send a link to reset your password.</p>
      </div>
      ${authSignalsHtml(['Secure link', 'Expires soon', 'Back to focus'])}
      <form class="b-auth__form" id="b-forgot-form" novalidate>
        ${fieldHtml('b-forgot-email', 'Email address', 'email', 'email', 'you@email.com')}
      </form>
    `,
    footerHtml: `
      <button type="submit" form="b-forgot-form" class="b-btn b-btn--primary b-auth__primary" id="b-forgot-submit">
        Send reset link
      </button>
    `,
  });

  root.replaceChildren(section);

  section.querySelector('#b-forgot-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = section.querySelector('#b-forgot-email')?.value?.trim() || '';
    const err = section.querySelector('#b-forgot-email-error');
    const wrap = section.querySelector('[data-field="b-forgot-email"]');

    if (!email) {
      wrap?.classList.add('b-field--error');
      err.textContent = 'Email is required.';
      err.hidden = false;
      return;
    }
    if (!isValidEmail(email)) {
      wrap?.classList.add('b-field--error');
      err.textContent = 'Enter a valid email address.';
      err.hidden = false;
      return;
    }

    const btn = section.querySelector('#b-forgot-submit');
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
    className: 'b-auth-forgot-success',
    showBack: true,
    backRoute: 'login',
    buddySrc: APP_CONFIG.focoStates.happy,
    whisper: 'Check your inbox — the link is on its way.',
    bodyHtml: `
      <div class="b-auth__titles">
        <span class="b-chip">Email sent</span>
        <h1 class="b-auth__title">Check your email</h1>
        <span class="b-auth__titleAccent" aria-hidden="true"></span>
        <p class="b-auth__lead">
          If an account exists for
          <strong>${escapeHtml(email)}</strong>,
          you will receive a password reset link shortly.
        </p>
      </div>
      <div class="b-auth__visual" aria-hidden="true">
        <div class="b-auth__visualMark">
          <span class="b-auth__visualRing"></span>
          <img
            class="b-auth__visualImg"
            src="${APP_CONFIG.focoStates.ready}"
            alt=""
            width="120"
            height="120"
            decoding="async"
          />
        </div>
      </div>
    `,
    footerHtml: `
      <button type="button" class="b-btn b-btn--primary b-auth__primary" id="b-forgot-done">
        Back to log in
      </button>
    `,
  });

  root.replaceChildren(section);

  section.querySelector('#b-forgot-done')?.addEventListener('click', () => {
    forgotStep = 'form';
    navigate('login');
  });
}

export function resetForgotPasswordFlow() {
  forgotStep = 'form';
}
