import { APP_CONFIG } from './config.js';
import { getAllVariants, getCurrentVariantId, navigateToVariant } from './variant-manager.js';
import { navigate } from './router.js';

/**
 * Floating development / client-demo control.
 * Custom variant menu + reset icon (bottom-right).
 * Gated by APP_CONFIG.developmentPreview.
 */

const CHEVRON_ICON = `
  <svg class="dev-preview__chevron" viewBox="0 0 16 16" width="9" height="9" aria-hidden="true" focusable="false">
    <path fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" d="M4 6l4 4 4-4" />
  </svg>
`;

const RESET_ICON = `
  <svg class="dev-preview__reset-icon" viewBox="0 0 24 24" width="12" height="12" aria-hidden="true" focusable="false">
    <path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"
      d="M21 12a9 9 0 1 1-2.64-6.36M21 3v6h-6" />
  </svg>
`;

export function initPreviewControls() {
  if (!APP_CONFIG.developmentPreview) {
    document.getElementById('dev-preview')?.remove();
    document.documentElement.dataset.devPreview = 'off';
    return;
  }

  document.documentElement.dataset.devPreview = 'on';

  let root = document.getElementById('dev-preview');
  if (!root) {
    root = document.createElement('aside');
    root.id = 'dev-preview';
    root.className = 'dev-preview';
    root.setAttribute('aria-label', 'Version controls');
    document.body.appendChild(root);
  }

  const variants = getAllVariants().filter((v) =>
    (APP_CONFIG.previewVariantIds || ['a']).includes(v.id),
  );

  const currentId = getCurrentVariantId();
  const current = variants.find((v) => v.id === currentId) || variants[0];

  root.innerHTML = `
    <div class="dev-preview__menu" id="dev-variant-menu" role="listbox" aria-label="UI variants" hidden>
      ${variants
        .map(
          (v) => `
        <button
          type="button"
          class="dev-preview__option ${v.id === current?.id ? 'is-active' : ''}"
          role="option"
          data-variant="${escapeHtml(v.id)}"
          aria-selected="${v.id === current?.id ? 'true' : 'false'}"
        >
          <span class="dev-preview__option-name">${escapeHtml(v.name)}</span>
          <span class="dev-preview__option-check" aria-hidden="true"></span>
        </button>
      `,
        )
        .join('')}
    </div>
    <div class="dev-preview__bar">
      <button
        type="button"
        class="dev-preview__trigger"
        id="dev-variant-trigger"
        aria-haspopup="listbox"
        aria-expanded="false"
        aria-controls="dev-variant-menu"
      >
        <span class="dev-preview__trigger-label" id="dev-variant-label">${escapeHtml(current?.name || 'Variant')}</span>
        ${CHEVRON_ICON}
      </button>
      <button type="button" class="dev-preview__reset" id="dev-reset-demo" title="Reset demo" aria-label="Reset demo">
        ${RESET_ICON}
      </button>
    </div>
  `;

  const trigger = root.querySelector('#dev-variant-trigger');
  const menu = root.querySelector('#dev-variant-menu');
  const label = root.querySelector('#dev-variant-label');
  const resetBtn = root.querySelector('#dev-reset-demo');

  const setOpen = (open) => {
    root.classList.toggle('is-open', open);
    trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    menu.hidden = !open;
  };

  const syncActive = (id) => {
    const match = variants.find((v) => v.id === id) || variants[0];
    if (!match) return;
    label.textContent = match.name;
    root.querySelectorAll('.dev-preview__option').forEach((btn) => {
      const active = btn.dataset.variant === match.id;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-selected', active ? 'true' : 'false');
    });
  };

  trigger.addEventListener('click', (event) => {
    event.stopPropagation();
    setOpen(!root.classList.contains('is-open'));
  });

  menu.addEventListener('click', (event) => {
    const option = event.target.closest('[data-variant]');
    if (!option) return;
    const id = option.dataset.variant;
    setOpen(false);
    if (id && id !== getCurrentVariantId()) {
      navigateToVariant(id);
    }
  });

  resetBtn?.addEventListener('click', () => {
    setOpen(false);
    resetDemoState();
    navigate('splash', { replace: true });
    window.location.reload();
  });

  document.addEventListener('click', (event) => {
    if (!root.contains(event.target)) setOpen(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setOpen(false);
  });

  document.addEventListener('variantchange', (event) => {
    syncActive(event.detail.id);
  });
}

function resetDemoState() {
  try {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && (k.startsWith('foco.') || k === 'app.variant')) keys.push(k);
    }
    keys.forEach((k) => localStorage.removeItem(k));
    sessionStorage.clear();
  } catch {
    /* ignore */
  }
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
