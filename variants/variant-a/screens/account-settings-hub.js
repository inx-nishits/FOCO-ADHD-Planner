import { navigate } from '../../../js/router.js';
import { formLabel } from '../auth/helpers.js';
import { escapeHtml } from '../account/helpers.js';
import { getProfile, saveProfile } from '../account/store.js';
import { mountAccountScreen, settingsRow, bindSettingsRows } from '../account/layout.js';

export function renderSettingsHub(root) {
  const profile = getProfile();

  mountAccountScreen(root, {
    title: 'Settings',
    eyebrow: 'Account',
    back: 'profile',
    showTabs: false,
    className: 'foco-account--inner',
    bodyHtml: `
      <p class="foco-account-lede">Update your identity and manage account controls.</p>

      <section class="foco-panel">
        <div class="foco-panel__head">
          <p class="foco-panel__eyebrow">Profile</p>
          <h2 class="foco-panel__title">Personal details</h2>
        </div>
        <form class="foco-account-form" id="profile-form">
          <div class="foco-field">
            ${formLabel('pf-first', 'First name')}
            <input class="foco-input" id="pf-first" name="firstName" value="${escapeHtml(profile.firstName)}" autocomplete="given-name" />
          </div>
          <div class="foco-field">
            ${formLabel('pf-last', 'Last name')}
            <input class="foco-input" id="pf-last" name="lastName" value="${escapeHtml(profile.lastName)}" autocomplete="family-name" />
          </div>
          <div class="foco-field">
            ${formLabel('pf-email', 'Email')}
            <input class="foco-input" id="pf-email" name="email" type="email" value="${escapeHtml(profile.email)}" autocomplete="email" />
          </div>
          <button type="submit" class="foco-btn foco-btn--primary foco-panel__cta">Save profile</button>
        </form>
      </section>

      <p class="foco-caption foco-account-section-label">Security &amp; app</p>
      <div class="foco-account-list">
        ${settingsRow('Change password', 'Update your sign-in password', 'settings/password')}
        ${settingsRow('Notifications', 'Reminders and product alerts', 'settings/notifications')}
        ${settingsRow('Preferences', 'Haptics, sounds, and layout', 'settings/preferences')}
        ${settingsRow('Delete account', 'Permanent data removal', 'settings/delete', { destructive: true })}
      </div>
    `,
    bind(section) {
      bindSettingsRows(section);
      section.querySelector('#profile-form')?.addEventListener('submit', (event) => {
        event.preventDefault();
        const fd = new FormData(event.target);
        saveProfile({
          firstName: String(fd.get('firstName') || ''),
          lastName: String(fd.get('lastName') || ''),
          email: String(fd.get('email') || ''),
        });
        navigate('profile');
      });
    },
  });
}
