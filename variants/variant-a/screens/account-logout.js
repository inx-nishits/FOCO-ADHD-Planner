import { navigate } from '../../../js/router.js';
import { showConfirmDialog, showAppToast } from '../auth/helpers.js';
import { resetAuthContext } from '../auth/state.js';
import { clearSession } from '../account/store.js';

export async function showLogoutConfirm(root) {
  const ok = await showConfirmDialog({
    title: 'Log out?',
    message: 'You will need to sign in again to access your account on this device.',
    confirmLabel: 'Log out',
    cancelLabel: 'Stay signed in',
    destructive: true,
  });
  if (!ok) return;
  clearSession();
  resetAuthContext();
  showAppToast('Signed out');
  navigate('auth', { replace: true });
  void root;
}
