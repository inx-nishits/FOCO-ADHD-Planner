import { navigate } from '../../../js/router.js';
import { authContext, setAuthEmail } from '../auth/state.js';
import { markAuthenticated } from '../account/store.js';
import { routeAfterAuth } from '../onboarding/state.js';
import {
  createAuthScreen,
  escapeHtml,
  mockDelay,
  setButtonLoading,
} from '../auth/helpers.js';

/**
 * Email verification after signup.
 */
export function renderVerify(root) {
  const email = authContext.email || 'your email';

  const section = createAuthScreen({
    ariaLabel: 'Verify your email',
    className: 'foco-auth-verify',
    showBack: true,
    backRoute: 'signup',
    bodyHtml: `
      <div class="foco-auth-status">
        <span class="foco-chip foco-auth-status__badge">Almost there</span>
        <h1 class="foco-h2">Check your email</h1>
        <p class="foco-body-secondary foco-auth-status__copy">
          We sent a verification link to
          <strong class="foco-auth-email">${escapeHtml(email)}</strong>.
          Open it to activate your account.
        </p>
        <div class="foco-auth-status__actions">
          <button type="button" class="foco-btn foco-btn--secondary" id="verify-resend">
            Resend email
          </button>
          <button type="button" class="foco-link foco-auth-link-btn" id="verify-change">
            Use a different email
          </button>
        </div>
      </div>
    `,
    footerHtml: `
      <button type="button" class="foco-btn foco-btn--primary foco-auth-footer__cta" id="verify-continue">
        I verified my email
      </button>
    `,
  });

  root.replaceChildren(section);

  section.querySelector('#verify-change')?.addEventListener('click', () => navigate('signup'));
  section.querySelector('#verify-resend')?.addEventListener('click', async (event) => {
    const btn = event.currentTarget;
    setButtonLoading(btn, true, 'Sending…');
    await mockDelay(500);
    setButtonLoading(btn, false);
    btn.textContent = 'Email sent';
    window.setTimeout(() => {
      btn.textContent = 'Resend email';
    }, 2000);
  });

  section.querySelector('#verify-continue')?.addEventListener('click', async (event) => {
    const btn = event.currentTarget;
    setButtonLoading(btn, true, 'Checking…');
    await mockDelay();
    setButtonLoading(btn, false);
    markAuthenticated();
    navigate(routeAfterAuth(), { replace: true });
  });
}
