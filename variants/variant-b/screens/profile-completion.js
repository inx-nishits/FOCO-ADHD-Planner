import { APP_CONFIG } from '../../../js/config.js';
import { navigate } from '../../../js/router.js';
import { authContext } from '../auth/state.js';
import { markAuthenticated, saveProfile } from '../account/store.js';
import { routeAfterAuth } from '../onboarding/state.js';
import {
  createAuthScreen,
  fieldHtml,
  mockDelay,
  setButtonLoading,
  setFieldError,
  clearErrors,
  authSignalsHtml,
} from '../auth/helpers.js';

export function renderProfileCompletion(root) {
  const section = createAuthScreen({
    ariaLabel: 'Complete your profile',
    className: 'b-auth-profile',
    showBack: true,
    backRoute: 'auth',
    buddySrc: APP_CONFIG.focoStates.happy,
    whisper: 'A few details — then FOCO can personalize your focus.',
    bodyHtml: `
      <div class="b-auth__titles">
        <div class="b-auth__eyebrow">Almost done</div>
        <h1 class="b-auth__title">Complete your profile</h1>
        <span class="b-auth__titleAccent" aria-hidden="true"></span>
        <p class="b-auth__lead">So we know who we’re cheering for.</p>
      </div>
      ${authSignalsHtml(['Your name', 'Your vibe', 'Your focus'])}
      <form class="b-auth__form" id="b-profile-form" novalidate>
        ${fieldHtml('b-profile-first', 'First name', 'text', 'given-name', 'Alex', false, 'user')}
        ${fieldHtml('b-profile-last', 'Last name', 'text', 'family-name', 'Rivera', false, 'user')}
        ${fieldHtml('b-profile-email', 'Email', 'email', 'email', '', true, 'mail')}
      </form>
    `,
    footerHtml: `
      <button type="submit" form="b-profile-form" class="b-btn b-btn--primary b-auth__primary" id="b-profile-submit">
        Continue
      </button>
    `,
  });

  root.replaceChildren(section);

  const firstInput = section.querySelector('#b-profile-first');
  const lastInput = section.querySelector('#b-profile-last');
  const emailInput = section.querySelector('#b-profile-email');
  if (firstInput) firstInput.value = authContext.firstName || '';
  if (lastInput) lastInput.value = authContext.lastName || '';
  if (emailInput) emailInput.value = authContext.email || '';

  section.querySelector('#b-profile-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearErrors(section);

    const first = firstInput?.value?.trim() || '';
    const last = lastInput?.value?.trim() || '';
    let ok = true;

    if (!first) {
      setFieldError(section, 'b-profile-first', 'First name is required.');
      ok = false;
    }
    if (!last) {
      setFieldError(section, 'b-profile-last', 'Last name is required.');
      ok = false;
    }
    if (!ok) return;

    authContext.firstName = first;
    authContext.lastName = last;
    saveProfile({ firstName: first, lastName: last, email: authContext.email });

    const btn = section.querySelector('#b-profile-submit');
    setButtonLoading(btn, true, 'Saving…');
    await mockDelay();
    setButtonLoading(btn, false);
    authContext.fromGoogle = false;
    markAuthenticated();
    navigate(routeAfterAuth(), { replace: true });
  });
}
