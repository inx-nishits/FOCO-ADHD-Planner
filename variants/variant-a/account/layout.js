import { navigate } from '../../../js/router.js';
import { escapeHtml } from './helpers.js';
import { renderAppTabBar, bindAppTabBar } from '../components/app-tab-bar.js';
import { iconForRoute } from '../components/icons.js';

export function accountShell({
  title,
  eyebrow = 'Account',
  back = 'profile',
  showTabs = true,
  showHeader = true,
  bodyHtml,
  footerHtml = '',
}) {
  const tabs = showTabs ? renderAppTabBar('profile') : '';
  const footerInner = `${footerHtml || ''}${tabs}`;
  const footer = footerInner.trim()
    ? `<footer class="foco-account__footer foco-tab-dock-host">${footerInner}</footer>`
    : '';
  const showBack = back !== false && back != null;

  if (!showHeader) {
    return `
    <div class="foco-account__scroll foco-account__scroll--flush">${bodyHtml}</div>
    ${footer}
  `;
  }

  if (!showBack) {
    return `
    <header class="foco-account__header foco-account__header--solo">
      <div class="foco-account__head-text">
        <p class="foco-caption foco-account__eyebrow">${escapeHtml(eyebrow)}</p>
        <h1 class="foco-title">${escapeHtml(title)}</h1>
      </div>
    </header>
    <div class="foco-account__scroll">${bodyHtml}</div>
    ${footer}
  `;
  }

  return `
    <header class="foco-account__header">
      <button type="button" class="foco-icon-btn" data-account-back aria-label="Back">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      </button>
      <div class="foco-account__head-text">
        <p class="foco-caption foco-account__eyebrow">${escapeHtml(eyebrow)}</p>
        <h1 class="foco-title">${escapeHtml(title)}</h1>
      </div>
      <span class="foco-account__spacer" aria-hidden="true"></span>
    </header>
    <div class="foco-account__scroll">${bodyHtml}</div>
    ${footer}
  `;
}

export function mountAccountScreen(root, options) {
  const section = document.createElement('section');
  section.id = 'screen';
  section.className = `app-screen foco-account ${options.className || ''}`.trim();
  section.setAttribute('aria-label', options.ariaLabel || options.title);
  section.innerHTML = accountShell(options);
  root.replaceChildren(section);

  bindAppTabBar(section);
  if (options.back !== false && options.back != null) {
    section.querySelector('[data-account-back]')?.addEventListener('click', () => {
      navigate(options.back || 'profile');
    });
  }

  options.bind?.(section);
  return section;
}

export function settingsRow(label, sub, route, { destructive = false } = {}) {
  return `
    <button type="button" class="foco-account-row ${destructive ? 'foco-account-row--danger' : ''}" data-go="${escapeHtml(route)}">
      <span class="foco-account-row__icon" aria-hidden="true">${iconForRoute(route)}</span>
      <span class="foco-account-row__text">
        <span class="foco-account-row__label">${escapeHtml(label)}</span>
        ${sub ? `<span class="foco-caption foco-account-row__sub">${escapeHtml(sub)}</span>` : ''}
      </span>
      <span class="foco-account-row__chev" aria-hidden="true">›</span>
    </button>`;
}

export function bindSettingsRows(section) {
  section.querySelectorAll('[data-go]').forEach((btn) => {
    btn.addEventListener('click', () => navigate(btn.dataset.go));
  });
}
