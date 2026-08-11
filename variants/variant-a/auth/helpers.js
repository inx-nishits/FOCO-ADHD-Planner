import { APP_CONFIG } from '../../../js/config.js';
import { navigate } from '../../../js/router.js';
import { iconSvg } from '../components/icons.js';

export function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Form label with the FOCO accent dot */
export function formLabel(id, text) {
  return `<label class="foco-label" for="${escapeHtml(id)}"><span class="foco-label__mark" aria-hidden="true"></span>${escapeHtml(text)}</label>`;
}

export function passwordToggleButton(inputId) {
  return `<button type="button" class="foco-input-toggle" data-toggle-for="${escapeHtml(inputId)}" aria-label="Show password" aria-pressed="false">${iconSvg('eye')}</button>`;
}

export function bindPasswordToggles(root) {
  root.querySelectorAll('[data-toggle-for]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const input = root.querySelector(`#${CSS.escape(btn.dataset.toggleFor)}`);
      if (!input) return;
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      btn.innerHTML = show ? iconSvg('eyeOff') : iconSvg('eye');
      btn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
      btn.setAttribute('aria-pressed', show ? 'true' : 'false');
    });
  });
}

export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
}

export function mockDelay(ms = 650) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export function setButtonLoading(button, loading, loadingLabel) {
  if (!button) return;
  if (loading) {
    button.dataset.defaultLabel = button.textContent;
    button.disabled = true;
    button.classList.add('is-loading');
    button.innerHTML = `<span class="foco-spinner" aria-hidden="true"></span><span>${escapeHtml(loadingLabel || 'Please wait…')}</span>`;
  } else {
    button.disabled = false;
    button.classList.remove('is-loading');
    button.textContent = button.dataset.defaultLabel || button.textContent;
  }
}

export function bindKeyboardScroll(container) {
  if (!container || container.dataset.keyboardBound) return;
  container.dataset.keyboardBound = 'true';

  const sync = () => {
    const active = document.activeElement;
    const focused =
      active &&
      container.contains(active) &&
      (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.tagName === 'SELECT');
    container.classList.toggle('foco-auth-scroll--keyboard', Boolean(focused));
  };

  container.addEventListener('focusin', sync);
  container.addEventListener('focusout', () => {
    window.setTimeout(sync, 80);
  });

  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', sync);
  }
}

/**
 * Shared auth screen shell.
 */
export function createAuthScreen({
  ariaLabel,
  className = '',
  showBack = false,
  backRoute = 'auth',
  bodyHtml,
  footerHtml = '',
}) {
  const section = document.createElement('section');
  section.id = 'screen';
  section.className = `app-screen foco-auth-screen ${className}`.trim();
  section.setAttribute('aria-label', ariaLabel);

  const backBtn = showBack
    ? `<button type="button" class="foco-icon-btn foco-auth-back" data-back="${escapeHtml(backRoute)}" aria-label="Go back">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>`
    : `<span class="foco-auth-header__spacer" aria-hidden="true"></span>`;

  const headerLogo = showBack
    ? `<img class="foco-logo foco-logo--lg foco-auth-logo foco-auth-header__logo" src="${APP_CONFIG.logoUrl}" alt="FOCO" width="72" height="69" decoding="async" />`
    : `<span class="foco-auth-header__spacer" aria-hidden="true"></span>`;

  section.innerHTML = `
    <header class="foco-auth-header${showBack ? ' foco-auth-header--nav' : ''}">
      ${backBtn}
      ${headerLogo}
    </header>
    <div class="foco-auth-scroll" tabindex="-1">
      ${bodyHtml}
    </div>
    ${footerHtml ? `<footer class="foco-auth-footer">${footerHtml}</footer>` : ''}
  `;

  const back = section.querySelector('[data-back]');
  back?.addEventListener('click', () => navigate(back.dataset.back));

  const scroll = section.querySelector('.foco-auth-scroll');
  bindKeyboardScroll(scroll);

  return section;
}

export function googleIconSvg() {
  return `<svg class="foco-google-icon" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>`;
}

export function logoBlock(sizeClass = 'foco-logo--md') {
  return `<img class="foco-logo ${sizeClass} foco-auth-logo" src="${APP_CONFIG.logoUrl}" alt="" width="48" height="46" decoding="async" />`;
}

export function appleIconSvg() {
  return `<svg class="foco-apple-icon" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
  </svg>`;
}

/**
 * Accessible in-app confirmation (replaces window.confirm for product flows).
 * Resolves true when the primary action is chosen, false on cancel/backdrop.
 */
export function showConfirmDialog({
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
} = {}) {
  return new Promise((resolve) => {
    const host = document.getElementById('app');
    if (!host) {
      resolve(false);
      return;
    }

    let settled = false;
    const finish = (ok) => {
      if (settled) return;
      settled = true;
      backdrop.classList.remove('is-visible');
      window.setTimeout(() => {
        backdrop.remove();
        resolve(ok);
      }, 200);
    };

    const backdrop = document.createElement('div');
    backdrop.className = 'foco-dialog-backdrop';
    backdrop.innerHTML = `
      <div class="foco-modal foco-dialog" role="alertdialog" aria-modal="true" aria-labelledby="foco-dialog-title" aria-describedby="foco-dialog-desc">
        <h2 class="foco-h3 foco-dialog__title" id="foco-dialog-title">${escapeHtml(title || 'Confirm')}</h2>
        <p class="foco-body-secondary foco-dialog__message" id="foco-dialog-desc">${escapeHtml(message || '')}</p>
        <div class="foco-dialog__actions">
          <button type="button" class="foco-btn foco-btn--ghost" data-dialog-cancel>${escapeHtml(cancelLabel)}</button>
          <button type="button" class="foco-btn ${destructive ? 'foco-btn--danger' : 'foco-btn--primary'}" data-dialog-confirm>${escapeHtml(confirmLabel)}</button>
        </div>
      </div>`;

    const cancelBtn = backdrop.querySelector('[data-dialog-cancel]');
    const confirmBtn = backdrop.querySelector('[data-dialog-confirm]');

    const lock = () => {
      cancelBtn.disabled = true;
      confirmBtn.disabled = true;
    };

    cancelBtn.addEventListener('click', () => {
      lock();
      finish(false);
    });
    confirmBtn.addEventListener('click', () => {
      lock();
      finish(true);
    });
    backdrop.addEventListener('click', (event) => {
      if (event.target === backdrop) {
        lock();
        finish(false);
      }
    });

    host.appendChild(backdrop);
    requestAnimationFrame(() => backdrop.classList.add('is-visible'));
    window.setTimeout(() => confirmBtn.focus(), 80);
  });
}

/** Lightweight in-app feedback (reuses .foco-toast styles) */
export function showAppToast(message, { type = 'success', duration = 2800 } = {}) {
  const host = document.getElementById('app');
  if (!host) return;
  const wrap = document.createElement('div');
  wrap.className = 'foco-toast-host';
  wrap.setAttribute('role', 'status');
  const toast = document.createElement('div');
  toast.className = `foco-toast foco-toast--${type}`;
  toast.textContent = message;
  wrap.appendChild(toast);
  host.appendChild(wrap);
  requestAnimationFrame(() => wrap.classList.add('is-visible'));
  window.setTimeout(() => {
    wrap.classList.remove('is-visible');
    window.setTimeout(() => wrap.remove(), 220);
  }, duration);
}
