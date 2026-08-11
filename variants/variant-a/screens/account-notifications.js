import { getSettings, saveSettings } from '../account/store.js';
import { mountAccountScreen } from '../account/layout.js';

export function renderNotificationSettings(root) {
  const { notifications: n } = getSettings();

  mountAccountScreen(root, {
    title: 'Notifications',
    eyebrow: 'Settings',
    back: 'settings',
    showTabs: false,
    className: 'foco-account--inner',
    bodyHtml: `
      <p class="foco-account-lede">Choose which reminders FOCO may send — task nudges, focus session end, daily planning, and wins. Device permission is still required for real push alerts.</p>

      <p class="foco-caption foco-account-section-label">Reminders</p>
      <div class="foco-account-toggles">
        ${toggle('taskReminders', 'Task reminders', 'Get notified before timed and anytime tasks', n.taskReminders)}
        ${toggle('focusSessionEnd', 'Focus session end', 'When a focus timer completes — pause or done', n.focusSessionEnd)}
        ${toggle('dailyPlanning', 'Daily planning', 'Morning nudge to simplify your day', n.dailyPlanning)}
      </div>

      <p class="foco-caption foco-account-section-label">Motivation</p>
      <div class="foco-account-toggles">
        ${toggle('streaks', 'Streak celebrations', 'Positive streak milestones', n.streaks)}
        ${toggle('productUpdates', 'Product updates', 'Occasional FOCO news', n.productUpdates)}
      </div>
    `,
    bind(section) {
      section.querySelectorAll('[data-toggle]').forEach((input) => {
        input.addEventListener('change', () => {
          saveSettings({
            notifications: { [input.dataset.toggle]: input.checked },
          });
        });
      });
    },
  });
}

function toggle(id, label, sub, on) {
  return `
    <label class="foco-account-toggle">
      <span class="foco-account-toggle__copy">
        <span class="foco-account-toggle__label">${label}</span>
        <span class="foco-caption">${sub}</span>
      </span>
      <span class="foco-switch">
        <input type="checkbox" data-toggle="${id}" ${on ? 'checked' : ''} />
        <span class="foco-switch__track" aria-hidden="true"><span class="foco-switch__thumb"></span></span>
      </span>
    </label>`;
}
