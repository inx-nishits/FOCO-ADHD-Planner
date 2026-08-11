import { navigate } from '../../../js/router.js';
import { fieldIcon, iconSvg } from '../components/icons.js';

export function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function formLabel(id, text) {
  return `<label class="b-field__label" for="${escapeHtml(id)}">${escapeHtml(text)}</label>`;
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
    button.innerHTML = `<span class="b-spinner" aria-hidden="true"></span><span>${escapeHtml(loadingLabel || 'Please wait…')}</span>`;
  } else {
    button.disabled = false;
    button.classList.remove('is-loading');
    button.textContent = button.dataset.defaultLabel || button.textContent;
  }
}

/** Flat, trendy long-arrow — no box, no border. */
export function backArrowSvg() {
  return `<svg class="b-back__icon" width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
    <path d="M16.5 6.5L9 14l7.5 7.5" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M9.25 14H23" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"/>
  </svg>`;
}

export function authAtmosphereHtml() {
  return `
    <div class="b-auth__bg" aria-hidden="true">
      <span class="b-auth__mesh"></span>
      <span class="b-auth__blob b-auth__blob--a"></span>
      <span class="b-auth__blob b-auth__blob--b"></span>
      <span class="b-auth__blob b-auth__blob--c"></span>
      <span class="b-auth__orbit"></span>
      <span class="b-auth__spark b-auth__spark--1"></span>
      <span class="b-auth__spark b-auth__spark--2"></span>
      <span class="b-auth__spark b-auth__spark--3"></span>
    </div>
  `;
}

export function passwordToggleButton(inputId) {
  return `<button type="button" class="b-field__toggle" data-toggle-for="${escapeHtml(inputId)}" aria-label="Show password" aria-pressed="false">${iconSvg('eye')}</button>`;
}

export function bindPasswordToggles(root) {
  root.querySelectorAll('[data-toggle-for]').forEach((btn) => {
    if (btn.dataset.bound === 'true') return;
    btn.dataset.bound = 'true';
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

function inferFieldIcon(type, autocomplete = '', id = '') {
  if (type === 'password') return 'lock';
  if (type === 'email' || autocomplete === 'email') return 'mail';
  if (
    autocomplete === 'given-name' ||
    autocomplete === 'family-name' ||
    autocomplete === 'name' ||
    /first|last|name|profile/i.test(id)
  ) {
    return 'user';
  }
  return 'spark';
}

/**
 * Native open auth shell (no cards).
 * - layout: 'landing' | 'form' (default)
 * - buddySrc / whisper: optional mascot companion strip on form screens
 */
export function createAuthScreen({
  ariaLabel,
  className = '',
  showBack = false,
  backRoute = 'auth',
  bodyHtml,
  footerHtml = '',
  layout = 'form',
  buddySrc = '',
  whisper = '',
}) {
  const section = document.createElement('section');
  section.id = 'screen';
  section.className = `b-screen b-auth ${className}`.trim();
  section.setAttribute('aria-label', ariaLabel);

  if (layout === 'landing') {
    section.innerHTML = `
      ${authAtmosphereHtml()}
      <div class="b-auth-landing__stage">
        ${bodyHtml}
      </div>
      ${footerHtml ? `<footer class="b-auth-landing__footer">${footerHtml}</footer>` : ''}
    `;
    return section;
  }

  const backBtn = showBack
    ? `<button type="button" class="b-back" data-back="${escapeHtml(backRoute)}" aria-label="Go back">
        ${backArrowSvg()}
      </button>`
    : '<span class="b-auth__spacer" aria-hidden="true"></span>';

  const buddy =
    buddySrc || whisper
      ? `<div class="b-auth__buddy" aria-hidden="${whisper ? 'false' : 'true'}">
          ${
            buddySrc
              ? `<span class="b-auth__buddyMark"><img class="b-auth__buddyImg" src="${escapeHtml(buddySrc)}" alt="" width="72" height="72" decoding="async" /></span>`
              : ''
          }
          ${whisper ? `<p class="b-auth__whisper">${escapeHtml(whisper)}</p>` : ''}
        </div>`
      : '';

  section.innerHTML = `
    ${authAtmosphereHtml()}
    <header class="b-auth__top b-auth__top--tight">
      ${backBtn}
      <div class="b-auth__topTitle" aria-hidden="true"></div>
      <span class="b-auth__spacer" aria-hidden="true"></span>
    </header>
    <div class="b-auth__stage">
      ${buddy}
      ${bodyHtml}
    </div>
    ${footerHtml ? `<footer class="b-auth__footer">${footerHtml}</footer>` : ''}
  `;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => section.classList.add('is-ready'));
  });

  section.querySelector('[data-back]')?.addEventListener('click', (event) => {
    navigate(event.currentTarget.dataset.back);
  });

  bindPasswordToggles(section);

  return section;
}

/** Compact proof strip used on form auth screens to fill empty mid-space. */
export function authSignalsHtml(items = []) {
  if (!items.length) return '';
  return `<ul class="b-auth__signals" role="list">
    ${items
      .map((item) => {
        const entry = normalizeSignal(item);
        const mark = entry.icon
          ? `<span class="b-auth__signalIcon" aria-hidden="true">${iconSvg(entry.icon)}</span>`
          : `<span class="b-auth__signalDot" aria-hidden="true"></span>`;
        return `<li class="b-auth__signal">
      ${mark}
      <span>${escapeHtml(entry.label)}</span>
    </li>`;
      })
      .join('')}
  </ul>`;
}

function normalizeSignal(item) {
  if (item && typeof item === 'object') {
    return {
      label: String(item.label || item.text || ''),
      icon: item.icon || '',
    };
  }
  const label = String(item || '');
  return { label, icon: signalIconForLabel(label) };
}

function signalIconForLabel(label) {
  const key = label.trim().toLowerCase();
  const map = {
    plan: 'calendar',
    focus: 'target',
    unstick: 'message',
    'plan the day': 'calendar',
    'focus one thing': 'target',
    'unstick with foco': 'message',
    'one thing mode': 'target',
    'soft reminders': 'bell',
    'foco ai': 'spark',
    'your name': 'user',
    'your vibe': 'spark',
    'your focus': 'target',
    'secure link': 'shield',
    'expires soon': 'bell',
    'back to focus': 'target',
    'inbox check': 'inbox',
    'one tap verify': 'shield',
    'then focus': 'target',
  };
  return map[key] || '';
}

export function googleIconSvg() {
  return `<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>`;
}

export function appleIconSvg() {
  return `<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
  </svg>`;
}

export function fieldHtml(id, label, type = 'text', autocomplete = '', placeholder = '', readonly = false, icon = '') {
  const ac = autocomplete ? ` autocomplete="${escapeHtml(autocomplete)}"` : '';
  const ph = placeholder ? ` placeholder="${escapeHtml(placeholder)}"` : '';
  const ro = readonly ? ' readonly aria-readonly="true"' : '';
  const isPassword = type === 'password';
  const iconName = icon || inferFieldIcon(type, autocomplete, id);
  const wrapMods = [
    'b-field__control',
    'b-field__control--icon',
    isPassword ? 'b-field__control--password' : '',
    readonly ? 'b-field__control--readonly' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return `
    <div class="b-field" data-field="${escapeHtml(id)}">
      ${formLabel(id, label)}
      <div class="${wrapMods}">
        ${fieldIcon(iconName)}
        <input
          class="b-field__input"
          id="${escapeHtml(id)}"
          name="${escapeHtml(id)}"
          type="${isPassword ? 'password' : type}"
          inputmode="${type === 'email' ? 'email' : 'text'}"
          ${ac}
          ${ph}
          ${ro}
        />
        ${isPassword ? passwordToggleButton(id) : ''}
      </div>
      <p class="b-field__error" id="${escapeHtml(id)}-error" role="alert" hidden></p>
    </div>
  `;
}

export function setFieldError(root, id, message) {
  const wrap = root.querySelector(`[data-field="${id}"]`);
  const input = root.querySelector(`#${id}`);
  const err = root.querySelector(`#${id}-error`);
  if (!wrap || !input || !err) return;
  if (message) {
    wrap.classList.add('b-field--error');
    input.setAttribute('aria-invalid', 'true');
    err.textContent = message;
    err.hidden = false;
  } else {
    wrap.classList.remove('b-field--error');
    input.removeAttribute('aria-invalid');
    err.textContent = '';
    err.hidden = true;
  }
}

export function clearErrors(root) {
  root.querySelectorAll('.b-field').forEach((field) => field.classList.remove('b-field--error'));
  root.querySelectorAll('.b-field__error').forEach((err) => {
    err.hidden = true;
    err.textContent = '';
  });
}
