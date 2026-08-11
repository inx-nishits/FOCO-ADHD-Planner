import { navigate } from '../../../js/router.js';
import { resumeAuthenticatedRoute } from '../app-guard.js';
import { markAuthenticated } from '../account/store.js';
import { authContext } from '../auth/state.js';
import {
  createAuthScreen,
  googleIconSvg,
  appleIconSvg,
  logoBlock,
  mockDelay,
  setButtonLoading,
} from '../auth/helpers.js';

/**
 * Authentication landing — distinct from splash layout.
 */
export function renderAuthLanding(root) {
  const resume = resumeAuthenticatedRoute();
  if (resume) {
    navigate(resume, { replace: true });
    return;
  }

  const section = createAuthScreen({
    ariaLabel: 'Welcome to FOCO',
    className: 'foco-auth-landing',
    showBack: false,
    bodyHtml: `
      <div class="foco-auth-landing__atmosphere" aria-hidden="true">
        <span class="foco-auth-landing__bubble foco-auth-landing__bubble--a"></span>
        <span class="foco-auth-landing__bubble foco-auth-landing__bubble--b"></span>
        <span class="foco-auth-landing__bubble foco-auth-landing__bubble--c"></span>
      </div>
      <div class="foco-auth-landing__hero">
        <div class="foco-auth-landing__mark">
          ${logoBlock('foco-logo--xl')}
        </div>
        <p class="foco-auth-landing__eyebrow">Ready to focus?</p>
        <h1 class="foco-auth-landing__title">Start before your brain talks you out of it</h1>
        <p class="foco-auth-landing__lead">
          Plan the day, focus on one thing, and tell FOCO what’s stuck — chat it, speak it, or scan it.
        </p>
      </div>
    `,
    footerHtml: `
      <div class="foco-auth-actions">
        <button type="button" class="foco-btn foco-btn--apple" id="auth-apple">
          ${appleIconSvg()}
          <span>Continue with Apple</span>
        </button>
        <button type="button" class="foco-btn foco-btn--google" id="auth-google">
          ${googleIconSvg()}
          <span>Continue with Google</span>
        </button>
        <button type="button" class="foco-btn foco-btn--primary foco-btn--email" id="auth-email">
          Continue with Email
        </button>
      </div>
      <p class="foco-auth-switch">
        Already have an account?
        <button type="button" class="foco-link" id="auth-login">Log in</button>
      </p>
    `,
  });

  root.replaceChildren(section);

  section.querySelector('#auth-email')?.addEventListener('click', () => {
    navigate('login');
  });

  section.querySelector('#auth-login')?.addEventListener('click', () => {
    navigate('login');
  });

  section.querySelector('#auth-google')?.addEventListener('click', async (event) => {
    const btn = event.currentTarget;
    setButtonLoading(btn, true, 'Connecting…');
    authContext.fromGoogle = true;
    authContext.email = 'alex.rivera@gmail.com';
    await mockDelay();
    setButtonLoading(btn, false);
    markAuthenticated();
    navigate('profile-completion');
  });

  section.querySelector('#auth-apple')?.addEventListener('click', async (event) => {
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
