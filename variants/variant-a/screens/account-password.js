import { navigate } from '../../../js/router.js';
import {
  formLabel,
  passwordToggleButton,
  bindPasswordToggles,
  showAppToast,
} from '../auth/helpers.js';
import { mountAccountScreen } from '../account/layout.js';

export function renderPasswordSettings(root) {
  mountAccountScreen(root, {
    title: 'Change password',
    eyebrow: 'Settings',
    back: 'settings',
    showTabs: false,
    className: 'foco-account--inner',
    bodyHtml: `
      <p class="foco-account-lede">Use at least 8 characters. You’ll use this password the next time you sign in.</p>
      <section class="foco-panel">
        <div class="foco-panel__head">
          <p class="foco-panel__eyebrow">Security</p>
          <h2 class="foco-panel__title">Update password</h2>
        </div>
        <form class="foco-account-form" id="password-form">
          <div class="foco-field">
            ${formLabel('pw-current', 'Current password')}
            <div class="foco-input-wrap foco-input-wrap--password">
              <input class="foco-input" id="pw-current" name="current" type="password" autocomplete="current-password" required />
              ${passwordToggleButton('pw-current')}
            </div>
          </div>
          <div class="foco-field">
            ${formLabel('pw-new', 'New password')}
            <div class="foco-input-wrap foco-input-wrap--password">
              <input class="foco-input" id="pw-new" name="new" type="password" autocomplete="new-password" minlength="8" required />
              ${passwordToggleButton('pw-new')}
            </div>
          </div>
          <div class="foco-field">
            ${formLabel('pw-confirm', 'Confirm new password')}
            <div class="foco-input-wrap foco-input-wrap--password">
              <input class="foco-input" id="pw-confirm" name="confirm" type="password" autocomplete="new-password" minlength="8" required />
              ${passwordToggleButton('pw-confirm')}
            </div>
          </div>
        </form>
      </section>
    `,
    footerHtml: `
      <button type="submit" form="password-form" class="foco-btn foco-btn--primary">Save password</button>
    `,
    bind(section) {
      bindPasswordToggles(section);
      section.querySelector('#password-form')?.addEventListener('submit', (event) => {
        event.preventDefault();
        const fd = new FormData(event.target);
        const current = String(fd.get('current') || '');
        const nw = String(fd.get('new') || '');
        const cf = String(fd.get('confirm') || '');
        if (!current) {
          showAppToast('Enter your current password.', { type: 'error' });
          return;
        }
        if (nw !== cf) {
          showAppToast('New passwords do not match.', { type: 'error' });
          return;
        }
        if (nw.length < 8) {
          showAppToast('Use at least 8 characters.', { type: 'error' });
          return;
        }
        if (nw === current) {
          showAppToast('Choose a password different from your current one.', { type: 'error' });
          return;
        }
        try {
          localStorage.setItem('foco.account.passwordUpdatedAt', new Date().toISOString());
        } catch {
          /* ignore */
        }
        showAppToast('Password updated');
        navigate('settings');
      });
    },
  });
}
