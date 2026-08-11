import { APP_CONFIG } from '../../../js/config.js';
import { PLANS } from '../account/constants.js';
import { escapeHtml } from '../account/helpers.js';
import { getProfile, getSubscription, ensureAccountBootstrap } from '../account/store.js';
import { mountAccountScreen, settingsRow, bindSettingsRows } from '../account/layout.js';
import { showLogoutConfirm } from './account-logout.js';
import { maybeShowHomeUpdateModal } from './update.js';
import { iconSvg } from '../components/icons.js';

export function renderProfileHub(root) {
  ensureAccountBootstrap();
  const profile = getProfile();
  const sub = getSubscription();
  const plan = PLANS[sub.planId] || PLANS.free;
  const avatarUrl = profile.avatarUrl || APP_CONFIG.mockUserAvatarUrl;
  const avatarHtml = avatarUrl
    ? `<img class="foco-account-avatar foco-account-avatar--photo" src="${escapeHtml(avatarUrl)}" alt="" width="72" height="72" decoding="async" />`
    : `<div class="foco-account-avatar" aria-hidden="true">${escapeHtml(profile.avatarInitials)}</div>`;
  const memberSince = profile.memberSince
    ? new Date(profile.memberSince).toLocaleDateString(undefined, {
        month: 'short',
        year: 'numeric',
      })
    : '';

  mountAccountScreen(root, {
    title: 'Profile',
    eyebrow: 'You',
    back: false,
    showHeader: false,
    ariaLabel: 'Profile',
    className: 'foco-account--profile',
    bodyHtml: `
      <div class="foco-account-profile-card foco-account-profile-card--hero">
        <div class="foco-account-profile-card__glow" aria-hidden="true"></div>
        <div class="foco-account-profile-card__top">
          <div class="foco-account-avatar-wrap">
            ${avatarHtml}
            <span class="foco-account-avatar-ring" aria-hidden="true"></span>
          </div>
          <div class="foco-account-profile-card__meta">
            <h2 class="foco-account-profile-card__name">${escapeHtml(profile.firstName)} ${escapeHtml(profile.lastName)}</h2>
            <p class="foco-account-profile-card__email">${escapeHtml(profile.email)}</p>
            <div class="foco-account-profile-card__chips">
              <span class="foco-account-plan-chip">${escapeHtml(plan.name)}</span>
              ${memberSince ? `<span class="foco-account-meta-chip">Since ${escapeHtml(memberSince)}</span>` : ''}
            </div>
          </div>
          <button type="button" class="foco-account-profile-card__edit" data-go="settings" aria-label="Edit profile">
            ${iconSvg('edit')}
          </button>
        </div>
        ${
          profile.onboardingGoal
            ? `<div class="foco-account-profile-card__goal">
          <p class="foco-caption foco-account-profile-card__goal-label">Focus goal</p>
          <p class="foco-account-profile-card__goal-text">${escapeHtml(profile.onboardingGoal)}</p>
        </div>`
            : ''
        }
      </div>

      <p class="foco-caption foco-account-section-label">Account</p>
      <div class="foco-account-list foco-card">
        ${settingsRow('Settings', 'Password, notifications, preferences', 'settings')}
        ${settingsRow('Subscription', `${plan.name} · Manage plan`, 'subscription')}
        ${settingsRow('Notifications', 'Reminders & alerts', 'settings/notifications')}
        ${settingsRow('Preferences', 'Theme & app behavior', 'settings/preferences')}
      </div>

      <p class="foco-caption foco-account-section-label">Support</p>
      <div class="foco-account-list foco-card">
        ${settingsRow('About FOCO', 'App info & version', 'about')}
        ${settingsRow('FAQ', 'Common questions', 'faq')}
        ${settingsRow('Contact Us', 'support@tryfoco.app', 'contact')}
        ${settingsRow('Privacy Policy', 'How we handle data', 'privacy')}
        ${settingsRow('Terms & Conditions', 'Using FOCO', 'terms')}
      </div>

      <div class="foco-account-list foco-card foco-account-list--spaced">
        <button type="button" class="foco-account-row" id="profile-logout">
          <span class="foco-account-row__icon" aria-hidden="true">${iconSvg('logout')}</span>
          <span class="foco-account-row__text">
            <span class="foco-account-row__label">Log out</span>
            <span class="foco-caption foco-account-row__sub">Sign out on this device</span>
          </span>
          <span class="foco-account-row__chev" aria-hidden="true">›</span>
        </button>
      </div>
    `,
    bind(section) {
      bindSettingsRows(section);
      section.querySelector('#profile-logout')?.addEventListener('click', () => showLogoutConfirm(root));
      // After login → Profile: always show version update modal
      window.setTimeout(() => maybeShowHomeUpdateModal(), 120);
    },
  });
}
