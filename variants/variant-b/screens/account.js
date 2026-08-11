import { APP_CONFIG } from '../../../js/config.js';
import { getRoute, navigate } from '../../../js/router.js';
import { requireAppAccess } from '../app-guard.js';
import { parseAccountRoute } from '../account/helpers.js';
import { backArrowSvg } from '../auth/helpers.js';
import { renderAppTabBar, bindAppTabBar } from '../components/app-tab-bar.js';
import {
  clearSession,
  getProfile,
  getSettings,
  saveSettings,
} from '../account/store.js';

const escapeHtml = (v) =>
  String(v || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

function section(root, html) {
  const s = document.createElement('section');
  s.id = 'screen';
  s.className = 'b-screen b-profile';
  s.innerHTML = html;
  root.replaceChildren(s);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => s.classList.add('is-ready'));
  });
}

function navItem({ title, subtitle = '', actionId = null, icon = '' }) {
  return `
    <button class="b-navItem" type="button" data-action="${escapeHtml(actionId || '')}">
      <span class="b-navItem__icon" aria-hidden="true">${icon}</span>
      <span class="b-navItem__body">
        <span class="b-navItem__title">${escapeHtml(title)}</span>
        ${subtitle ? `<span class="b-navItem__sub">${escapeHtml(subtitle)}</span>` : ''}
      </span>
      <span class="b-navItem__chev" aria-hidden="true">›</span>
    </button>
  `;
}

const ICONS = {
  settings: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" stroke="currentColor" stroke-width="1.8"/><path d="M19.4 13.5a7.7 7.7 0 0 0 .05-1.5l2.05-1.55-2-3.45-2.4.75a7.6 7.6 0 0 0-1.3-.75L15.2 3h-4.4l-.6 2.5c-.46.2-.9.45-1.3.75l-2.4-.75-2 3.45L6.55 12a7.7 7.7 0 0 0 0 1.5L4.5 15.05l2 3.45 2.4-.75c.4.3.84.55 1.3.75l.6 2.5h4.4l.6-2.5c.46-.2.9-.45 1.3-.75l2.4.75 2-3.45L19.4 13.5Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>`,
  subscription: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="18" height="12" rx="3" stroke="currentColor" stroke-width="1.8"/><path d="M3 10h18" stroke="currentColor" stroke-width="1.8"/><path d="M8 15h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  support: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/><path d="M9.2 9.2a2.8 2.8 0 0 1 5.4 1.1c0 1.7-2.1 2.2-2.1 3.4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="12.5" cy="17" r="1" fill="currentColor"/></svg>`,
};

export function renderProfileFlow(root) {
  const route = getRoute();
  if (!requireAppAccess(route)) return;

  const { view } = parseAccountRoute(route);
  const profile = getProfile();
  const settings = getSettings();
  const backToProfile = view !== 'profile';
  const headerTitle =
    view === 'profile'
      ? 'Profile'
      : view === 'settings'
        ? 'Settings'
        : view === 'subscription'
          ? 'Subscription'
          : view === 'about'
            ? 'Support'
            : 'Account';

  const header = `
    <header class="b-profile__header">
      <div class="b-profile__headerRow">
        ${
          backToProfile
            ? `<button class="b-back b-profile__side b-profile__side--start" type="button" id="b-profile-back" aria-label="Go back">${backArrowSvg()}</button>`
            : `<span class="b-profile__side" aria-hidden="true"></span>`
        }
        <div class="b-profile__headerTitle">${escapeHtml(headerTitle)}</div>
        <span class="b-profile__side" aria-hidden="true"></span>
      </div>
    </header>
  `;

  if (view === 'profile') {
    const avatarUrl = profile.avatarUrl || APP_CONFIG.mockUserAvatarUrl;
    const avatarHtml = avatarUrl
      ? `<img class="b-avatar__photo" src="${escapeHtml(avatarUrl)}" alt="" width="88" height="88" decoding="async" />`
      : `<span class="b-avatar__initials">${escapeHtml(profile.avatarInitials)}</span>`;

    section(
      root,
      `
        <div class="b-profile__bg" aria-hidden="true"></div>
        ${header}
        <div class="b-profile__content">
          <div class="b-identity">
            <div class="b-avatar${avatarUrl ? ' b-avatar--photo' : ''}" aria-hidden="true">
              <span class="b-avatar__ring"></span>
              ${avatarHtml}
            </div>
            <h1 class="b-identity__name">${escapeHtml(profile.firstName)} ${escapeHtml(profile.lastName)}</h1>
            <p class="b-identity__email">${escapeHtml(profile.email)}</p>
          </div>

          <div class="b-focus">
            <p class="b-focus__eyebrow">Your focus style</p>
            <h2 class="b-focus__title">${escapeHtml(profile.focusStyle || 'One Thing Mode')}</h2>
            <p class="b-focus__goal">${escapeHtml(profile.onboardingGoal || 'Ready to focus — one task at a time')}</p>
            <button class="b-btn b-btn--primary b-focus__cta" type="button" id="b-profile-start">Ready to focus</button>
          </div>

          <div class="b-navGroup" role="list">
            <p class="b-navGroup__label">Account</p>
            ${navItem({ title: 'Settings', subtitle: 'Notifications, preferences & more', actionId: 'go-settings', icon: ICONS.settings })}
            ${navItem({ title: 'Subscription', subtitle: 'Manage plan and billing', actionId: 'go-subscription', icon: ICONS.subscription })}
            ${navItem({ title: 'Support', subtitle: 'About, FAQ, contact', actionId: 'go-support', icon: ICONS.support })}
          </div>

          <div class="b-profile__logoutWrap">
            <button class="b-profile__logout" type="button" id="b-profile-logout">Log out</button>
          </div>

          <p class="b-footerNote">Tip: keep one task open at a time.</p>
        </div>
        <footer class="b-tab-dock-host">
          ${renderAppTabBar('profile')}
        </footer>
      `,
    );

    root.querySelector('#b-profile-start')?.addEventListener('click', () => navigate('ready-to-focus'));
    root.querySelector('#b-profile-logout')?.addEventListener('click', () => {
      clearSession();
      navigate('auth', { replace: true });
    });

    root.querySelectorAll('.b-navItem').forEach((btn) => {
      const action = btn.dataset.action;
      if (action === 'go-settings') btn.addEventListener('click', () => navigate('settings'));
      if (action === 'go-subscription') btn.addEventListener('click', () => navigate('subscription'));
      if (action === 'go-support') btn.addEventListener('click', () => navigate('about'));
    });

    bindAppTabBar(root);
    return;
  }

  if (view === 'settings') {
    section(
      root,
      `
        <div class="b-profile__bg" aria-hidden="true"></div>
        ${header}
        <div class="b-profile__content b-profile__content--page">
          <div class="b-prefs">
            <p class="b-navGroup__label">Notifications</p>
            <div class="b-prefRow">
              <div class="b-prefRow__text">
                <div class="b-prefRow__title">Task reminders</div>
                <div class="b-prefRow__sub">Gentle nudges when it’s time to start.</div>
              </div>
              <label class="b-switch">
                <input type="checkbox" id="b-toggle-reminders" ${settings.notifications?.taskReminders ? 'checked' : ''} />
                <span class="b-switch__track" aria-hidden="true"></span>
              </label>
            </div>

            <p class="b-navGroup__label b-navGroup__label--spaced">Preferences</p>
            <div class="b-prefRow">
              <div class="b-prefRow__text">
                <div class="b-prefRow__title">Haptics</div>
                <div class="b-prefRow__sub">Small tactile feedback on actions.</div>
              </div>
              <label class="b-switch">
                <input type="checkbox" id="b-toggle-haptics" ${settings.preferences?.haptics ? 'checked' : ''} />
                <span class="b-switch__track" aria-hidden="true"></span>
              </label>
            </div>
          </div>

          <div class="b-actionsSticky">
            <button class="b-btn b-btn--primary" type="button" id="b-save-settings">Save changes</button>
          </div>
        </div>
      `,
    );

    root.querySelector('#b-profile-back')?.addEventListener('click', () => navigate('profile'));
    root.querySelector('#b-save-settings')?.addEventListener('click', () => {
      const reminders = root.querySelector('#b-toggle-reminders')?.checked ?? true;
      const haptics = root.querySelector('#b-toggle-haptics')?.checked ?? true;
      saveSettings({
        notifications: { taskReminders: reminders },
        preferences: { haptics },
      });
      navigate('profile', { replace: true });
    });

    return;
  }

  const title =
    view === 'password'
      ? 'Password'
      : view === 'notifications'
        ? 'Notifications'
        : view === 'preferences'
          ? 'Preferences'
          : view === 'subscription'
            ? 'Subscription'
            : view === 'about'
              ? 'About'
              : view === 'faq'
                ? 'FAQ'
                : view === 'contact'
                  ? 'Contact'
                  : view === 'privacy'
                    ? 'Privacy'
                    : view === 'terms'
                      ? 'Terms'
                      : 'Info';

  section(
    root,
    `
      <div class="b-profile__bg" aria-hidden="true"></div>
      ${header}
      <div class="b-profile__content b-profile__content--page">
        <h1 class="b-pageTitle">${escapeHtml(title)}</h1>
        <p class="b-prose">
          This section is part of the Variant B premium flow. UI is intentionally open and minimal for now.
        </p>
        <p class="b-prose b-prose--small">You can extend each view with fully designed screens next.</p>
        <div class="b-actionsSticky">
          <button class="b-btn b-btn--primary" type="button" id="b-profile-close">Back to profile</button>
        </div>
      </div>
    `,
  );

  root.querySelector('#b-profile-back')?.addEventListener('click', () => navigate('profile'));
  root.querySelector('#b-profile-close')?.addEventListener('click', () => navigate('profile'));
}
