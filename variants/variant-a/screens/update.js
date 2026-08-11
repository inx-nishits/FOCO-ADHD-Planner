import { APP_CONFIG } from '../../../js/config.js';
import { navigate } from '../../../js/router.js';
import { checkVersion, performUpdate } from '../../../js/version.js';
import { ROUTE_HOME } from '../onboarding/state.js';

const UPDATE_MODAL_PENDING_KEY = 'foco.updateModal.pending';

let updateModalOpen = false;

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Arm once — next Profile visit shows the modal (login / cold launch). */
export function armHomeUpdateModal() {
  try {
    sessionStorage.setItem(UPDATE_MODAL_PENDING_KEY, '1');
  } catch {
    /* ignore */
  }
}

function consumeHomeUpdateModalPending() {
  try {
    if (sessionStorage.getItem(UPDATE_MODAL_PENDING_KEY) !== '1') return false;
    sessionStorage.removeItem(UPDATE_MODAL_PENDING_KEY);
    return true;
  } catch {
    return true;
  }
}

/**
 * Compact required-update modal over the current home screen.
 * Standard CTAs: Update (primary) + Later (dismiss for this visit).
 */
export function showUpdateModal({ force = false } = {}) {
  const info = checkVersion();
  if (!force && !info.updateRequired) return false;

  const host = document.getElementById('app');
  if (!host) return false;

  const existing = host.querySelector('.foco-update-backdrop');
  if (existing) {
    existing.remove();
    updateModalOpen = false;
  }

  const latest = APP_CONFIG.latestVersion || info.latestVersion || APP_CONFIG.appVersion;
  const current = APP_CONFIG.appVersion;
  const platform = info.platform || 'web';
  const ctaLabel =
    platform === 'ios'
      ? 'Update in App Store'
      : platform === 'android'
        ? 'Update in Play Store'
        : 'Update now';

  updateModalOpen = true;

  const backdrop = document.createElement('div');
  backdrop.className = 'foco-dialog-backdrop foco-update-backdrop';
  backdrop.innerHTML = `
    <div
      class="foco-modal foco-update-modal"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="foco-update-title"
      aria-describedby="foco-update-desc"
    >
      <img
        class="foco-logo foco-logo--sm foco-update-modal__logo"
        src="${APP_CONFIG.logoUrl}"
        alt=""
        width="32"
        height="31"
        decoding="async"
      />
      <h2 class="foco-update-modal__title" id="foco-update-title">Update required</h2>
      <p class="foco-body-secondary foco-update-modal__copy" id="foco-update-desc">
        A newer version of FOCO is ready
        <span class="foco-update-modal__versions">${escapeHtml(current)} → ${escapeHtml(latest)}</span>
      </p>
      <div class="foco-dialog__actions foco-update-modal__actions">
        <button type="button" class="foco-btn foco-btn--ghost" data-update-later>Later</button>
        <button type="button" class="foco-btn foco-btn--primary" data-update-cta>${escapeHtml(ctaLabel)}</button>
      </div>
    </div>
  `;

  const close = () => {
    updateModalOpen = false;
    backdrop.classList.remove('is-visible');
    window.setTimeout(() => backdrop.remove(), 200);
  };

  const laterBtn = backdrop.querySelector('[data-update-later]');
  const ctaBtn = backdrop.querySelector('[data-update-cta]');

  laterBtn?.addEventListener('click', () => {
    laterBtn.disabled = true;
    ctaBtn.disabled = true;
    close();
  });

  ctaBtn?.addEventListener('click', () => {
    laterBtn.disabled = true;
    ctaBtn.disabled = true;
    ctaBtn.textContent = 'Opening…';
    performUpdate();
  });

  host.appendChild(backdrop);
  requestAnimationFrame(() => backdrop.classList.add('is-visible'));
  window.setTimeout(() => ctaBtn?.focus(), 80);
  return true;
}

/**
 * Deep-link / legacy #/update — go home, then open the modal on top.
 */
export function renderUpdate(root) {
  armHomeUpdateModal();
  navigate(ROUTE_HOME, { replace: true });
  window.setTimeout(() => {
    showUpdateModal({ force: true });
    try {
      sessionStorage.removeItem(UPDATE_MODAL_PENDING_KEY);
    } catch {
      /* ignore */
    }
  }, 60);
  void root;
}

/**
 * Profile after login / cold launch — show once.
 * Navigating back to Profile from other pages does not show again
 * until the next login or app refresh (splash).
 */
export function maybeShowHomeUpdateModal() {
  if (!consumeHomeUpdateModalPending()) return false;
  return showUpdateModal({ force: true });
}
