import { APP_CONFIG } from '../../../js/config.js';
import { navigate } from '../../../js/router.js';
import { resumeAuthenticatedRoute } from '../app-guard.js';
import { markAuthenticated } from '../account/store.js';
import { authContext } from '../auth/state.js';
import {
  createAuthScreen,
  googleIconSvg,
  appleIconSvg,
  mockDelay,
  setButtonLoading,
  authSignalsHtml,
} from '../auth/helpers.js';

export function renderAuthLanding(root) {
  const resume = resumeAuthenticatedRoute();
  if (resume) {
    navigate(resume, { replace: true });
    return;
  }

  const section = createAuthScreen({
    ariaLabel: 'Welcome to FOCO',
    className: 'b-auth-landing',
    layout: 'landing',
    bodyHtml: `
      <div class="b-auth-landing__hero">
        <div class="b-auth-landing__mark" aria-hidden="true">
          <span class="b-auth-landing__fluff">
            <img
              class="b-auth-landing__logo"
              src="${APP_CONFIG.focoStates.focus}"
              alt=""
              width="148"
              height="148"
              decoding="async"
            />
          </span>
        </div>
        <div class="b-auth-landing__copy">
          <p class="b-auth-landing__eyebrow">Ready to focus?</p>
          <h1 class="b-auth-landing__title">Start before your brain talks you out of it</h1>
          <p class="b-auth-landing__lead">
            Plan the day, focus on one thing, and tell FOCO what's stuck — chat it, speak it, or scan it.
          </p>
          ${authSignalsHtml([
            { label: 'Plan', icon: 'calendar' },
            { label: 'Focus', icon: 'target' },
            { label: 'Unstick', icon: 'message' },
          ]).replace(
            'class="b-auth__signals"',
            'class="b-auth__signals b-auth-landing__signals"',
          )}
        </div>
      </div>
    `,
    footerHtml: `
      <div class="b-auth-landing__actions">
        <button type="button" class="b-btn b-btn--apple b-auth__socialBtn" id="b-auth-apple">
          ${appleIconSvg()} <span>Continue with Apple</span>
        </button>
        <button type="button" class="b-btn b-btn--google b-auth__socialBtn" id="b-auth-google">
          ${googleIconSvg()} <span>Continue with Google</span>
        </button>
        <div class="b-auth__divider" role="separator"><span></span><span>or</span><span></span></div>
        <button type="button" class="b-btn b-btn--primary b-auth__primary" id="b-auth-email">
          Continue with Email
        </button>
      </div>
      <p class="b-auth__switch">
        Already have an account?
        <button type="button" class="b-link" id="b-auth-login">Log in</button>
      </p>
    `,
  });

  root.replaceChildren(section);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => section.classList.add('is-ready'));
  });

  section.querySelector('#b-auth-email')?.addEventListener('click', () => navigate('login'));
  section.querySelector('#b-auth-login')?.addEventListener('click', () => navigate('login'));

  section.querySelector('#b-auth-google')?.addEventListener('click', async (event) => {
    const btn = event.currentTarget;
    setButtonLoading(btn, true, 'Connecting…');
    authContext.fromGoogle = true;
    authContext.email = 'alex.rivera@gmail.com';
    await mockDelay();
    setButtonLoading(btn, false);
    markAuthenticated();
    navigate('profile-completion');
  });

  section.querySelector('#b-auth-apple')?.addEventListener('click', async (event) => {
    const btn = event.currentTarget;
    setButtonLoading(btn, true, 'Connecting…');
    authContext.fromGoogle = true;
    authContext.email = 'alex.rivera@icloud.com';
    await mockDelay();
    setButtonLoading(btn, false);
    markAuthenticated();
    navigate('profile-completion');
  });
}
