import { navigate } from '../../../js/router.js';
import { deleteAllAccountData } from '../account/store.js';
import { resetAuthContext } from '../auth/state.js';
import { showAppToast, showConfirmDialog } from '../auth/helpers.js';
import { mountAccountScreen } from '../account/layout.js';

export function renderDeleteAccount(root) {
  mountAccountScreen(root, {
    title: 'Delete account',
    back: 'settings',
    showTabs: false,
    className: 'foco-account--danger',
    bodyHtml: `
      <div class="foco-card foco-account-delete-copy">
        <h2 class="foco-h3">This permanently removes your account</h2>
        <ul class="foco-account-delete-list">
          <li>Profile and account settings</li>
          <li>Planner tasks, focus history, and statistics</li>
          <li>AI chat history and preferences</li>
          <li>Local subscription status on this device</li>
        </ul>
        <p class="foco-body-secondary">This action cannot be undone. Export anything you need before continuing. Store subscriptions may still need to be cancelled in the App Store or Google Play.</p>
      </div>
      <button type="button" class="foco-btn foco-btn--secondary foco-account-delete-cta" id="delete-continue">
        Continue to confirmation
      </button>
    `,
    bind(section) {
      section.querySelector('#delete-continue')?.addEventListener('click', () => {
        navigate('settings/delete/confirm');
      });
    },
  });
}

export function renderDeleteConfirm(root) {
  mountAccountScreen(root, {
    title: 'Confirm deletion',
    back: 'settings/delete',
    showTabs: false,
    className: 'foco-account--danger',
    bodyHtml: `
      <div class="foco-card foco-account-delete-copy">
        <p class="foco-body-secondary">Type <strong>DELETE</strong> to confirm permanent removal of your account and associated data.</p>
        <div class="foco-field">
          <label class="foco-label visually-hidden" for="delete-confirm-input">Confirmation</label>
          <input class="foco-input foco-input--danger" id="delete-confirm-input" placeholder="DELETE" autocomplete="off" />
        </div>
        <label class="foco-check foco-account-delete-check">
          <input type="checkbox" id="delete-understand" />
          <span>I understand this will permanently remove my information.</span>
        </label>
      </div>
      <button type="button" class="foco-btn foco-btn--ghost foco-account-delete-final" id="delete-final" disabled>
        Delete my account permanently
      </button>
    `,
    bind(section) {
      const input = section.querySelector('#delete-confirm-input');
      const check = section.querySelector('#delete-understand');
      const btn = section.querySelector('#delete-final');
      const sync = () => {
        const ok = input?.value?.trim() === 'DELETE' && check?.checked;
        if (btn) btn.disabled = !ok;
      };
      input?.addEventListener('input', sync);
      check?.addEventListener('change', sync);
      btn?.addEventListener('click', async () => {
        if (btn.disabled) return;
        const sure = await showConfirmDialog({
          title: 'Delete account?',
          message: 'Your account and associated data on this device will be permanently removed.',
          confirmLabel: 'Delete account',
          cancelLabel: 'Cancel',
          destructive: true,
        });
        if (!sure) return;
        deleteAllAccountData();
        resetAuthContext();
        showAppToast('Account deleted');
        navigate('auth', { replace: true });
      });
    },
  });
}
