import { navigate } from '../../../js/router.js';
import { ensureAccountBootstrap } from '../account/store.js';

/**
 * Post-auth entry → Profile (scoped home).
 */
export function renderHomeGate(root) {
  ensureAccountBootstrap();
  navigate('profile', { replace: true });
  void root;
}
