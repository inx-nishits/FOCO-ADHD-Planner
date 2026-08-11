import { APP_CONFIG } from '../../../js/config.js';
import { navigate } from '../../../js/router.js';
import { authContext } from '../auth/state.js';
import { markAuthenticated } from '../account/store.js';
import { routeAfterAuth } from '../onboarding/state.js';
import {
  createAuthScreen,
  escapeHtml,
  mockDelay,
  setButtonLoading,
  authSignalsHtml,
} from '../auth/helpers.js';

export function renderVerify(root) {
  const email = authContext.email || 'your email';

  const section = createAuthScreen({
    ariaLabel: 'Verify your email',
    className: 'b-auth-verify',
    showBack: true,
    backRoute: 'signup',
    buddySrc: APP_CONFIG.focoStates.calm,
    whisper: 'Tap the link — then we get you into focus.',
    bodyHtml: `
      <div class="b-auth__titles">
        <span class="b-chip">Almost there</span>
        <h1 class="b-auth__title">Check your email</h1>
        <span class="b-auth__titleAccent" aria-hidden="true"></span>
        <p class="b-auth__lead">
          We sent a verification link to
          <strong>${escapeHtml(email)}</strong>.
          Open it to activate your account.
        </p>
      </div>
      <div class="b-auth__visual" aria-hidden="true">
        <div class="b-auth__visualMark">
          <span class="b-auth__visualRing"></span>
          <img
            class="b-auth__visualImg"
            src="${APP_CONFIG.focoStates.focus}"
            alt=""
            width="120"
            height="120"
            decoding="async"
          />
        </div>
      </div>
      ${authSignalsHtml(['Inbox check', 'One tap verify', 'Then focus'])}
      <div class="b-auth__secondaryActions">
        <button type="button" class="b-btn b-btn--secondary" id="b-verify-resend">Resend email</button>
        <button type="button" class="b-link" id="b-verify-change">Use a different email</button>
      </div>
    `,
    footerHtml: `
      <button type="button" class="b-btn b-btn--primary b-auth__primary" id="b-verify-continue">
        I verified my email
      </button>
    `,
  });

  root.replaceChildren(section);

  section.querySelector('#b-verify-change')?.addEventListener('click', () => navigate('signup'));
  section.querySelector('#b-verify-resend')?.addEventListener('click', async (event) => {
    const btn = event.currentTarget;
    setButtonLoading(btn, true, 'Sending…');
    await mockDelay(500);
    setButtonLoading(btn, false);
    btn.textContent = 'Email sent';
    window.setTimeout(() => {
      btn.textContent = 'Resend email';
    }, 2000);
  });

  section.querySelector('#b-verify-continue')?.addEventListener('click', async (event) => {
    const btn = event.currentTarget;
    setButtonLoading(btn, true, 'Checking…');
    await mockDelay();
    setButtonLoading(btn, false);
    markAuthenticated();
    navigate(routeAfterAuth(), { replace: true });
  });
}
