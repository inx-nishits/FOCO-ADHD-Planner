import { navigate } from '../../../js/router.js';
import { authContext } from '../auth/state.js';
import { markAuthenticated, saveProfile } from '../account/store.js';
import { routeAfterAuth } from '../onboarding/state.js';
import {
  createAuthScreen,
  escapeHtml,
  formLabel,
  mockDelay,
  setButtonLoading,
} from '../auth/helpers.js';

/**
 * Profile completion after Google / social sign-in (UI only).
 */
export function renderProfileCompletion(root) {
  const section = createAuthScreen({
    ariaLabel: 'Complete your profile',
    className: 'foco-auth-profile',
    showBack: true,
    backRoute: 'auth',
    bodyHtml: `
      <div class="foco-auth-form-head">
        <h1 class="foco-title">Complete your profile</h1>
        <p class="foco-body-secondary">
          A few details help FOCO personalize your focus experience.
        </p>
      </div>
      <form class="foco-auth-form" id="profile-form" novalidate>
        <div class="foco-field" data-field="profile-first">
          ${formLabel('profile-first', 'First name')}
          <input class="foco-input" id="profile-first" name="profile-first" type="text" autocomplete="given-name" value="${escapeHtml(authContext.firstName)}" placeholder="Alex" />
          <p class="foco-field-error" id="profile-first-error" role="alert" hidden></p>
        </div>
        <div class="foco-field" data-field="profile-last">
          ${formLabel('profile-last', 'Last name')}
          <input class="foco-input" id="profile-last" name="profile-last" type="text" autocomplete="family-name" value="${escapeHtml(authContext.lastName)}" placeholder="Rivera" />
          <p class="foco-field-error" id="profile-last-error" role="alert" hidden></p>
        </div>
        <div class="foco-field" data-field="profile-email">
          ${formLabel('profile-email', 'Email')}
          <input
            class="foco-input foco-input--disabled"
            id="profile-email"
            type="email"
            value="${escapeHtml(authContext.email || '')}"
            readonly
            aria-readonly="true"
          />
        </div>
      </form>
    `,
    footerHtml: `
      <button type="submit" form="profile-form" class="foco-btn foco-btn--primary foco-auth-footer__cta" id="profile-submit">
        Continue
      </button>
    `,
  });

  root.replaceChildren(section);

  section.querySelector('#profile-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const first = section.querySelector('#profile-first')?.value?.trim() || '';
    const last = section.querySelector('#profile-last')?.value?.trim() || '';
    let ok = true;

    const setErr = (id, msg) => {
      const wrap = section.querySelector(`[data-field="${id}"]`);
      const err = section.querySelector(`#${id}-error`);
      if (msg) {
        wrap?.classList.add('foco-field--error');
        err.textContent = msg;
        err.hidden = false;
        ok = false;
      }
    };

    if (!first) setErr('profile-first', 'First name is required.');
    if (!last) setErr('profile-last', 'Last name is required.');
    if (!ok) return;

    authContext.firstName = first;
    authContext.lastName = last;
    saveProfile({ firstName: first, lastName: last, email: authContext.email });

    const btn = section.querySelector('#profile-submit');
    setButtonLoading(btn, true, 'Saving…');
    await mockDelay();
    setButtonLoading(btn, false);
    authContext.fromGoogle = false;
    markAuthenticated();
    navigate(routeAfterAuth(), { replace: true });
  });
}
