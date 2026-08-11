import { getSettings, saveSettings } from '../account/store.js';
import { mountAccountScreen } from '../account/layout.js';

export function renderPreferenceSettings(root) {
  const { preferences: p } = getSettings();

  mountAccountScreen(root, {
    title: 'Preferences',
    eyebrow: 'Settings',
    back: 'settings',
    showTabs: false,
    className: 'foco-account--inner',
    bodyHtml: `
      <p class="foco-account-lede">Tune how FOCO feels on this device.</p>

      <p class="foco-caption foco-account-section-label">App feedback</p>
      <div class="foco-account-toggles">
        ${toggle('haptics', 'Haptics', 'Subtle taps on key actions', p.haptics)}
        ${toggle('soundEffects', 'Sound effects', 'Focus and completion sounds', p.soundEffects)}
      </div>

      <p class="foco-caption foco-account-section-label">Calendar &amp; layout</p>
      <div class="foco-account-toggles">
        ${toggle('weekStartsMonday', 'Week starts Monday', 'Planner and statistics calendars', p.weekStartsMonday)}
        ${toggle('compactPlanner', 'Compact planner', 'Denser task cards', p.compactPlanner)}
      </div>

      <section class="foco-panel foco-panel--note">
        <p class="foco-panel__eyebrow">Theme</p>
        <h2 class="foco-panel__title">FOCO Dark</h2>
        <p class="foco-body-secondary">Calm surfaces for deep focus — one task, one timer, less visual noise.</p>
      </section>
    `,
    bind(section) {
      section.querySelectorAll('[data-toggle]').forEach((input) => {
        input.addEventListener('change', () => {
          saveSettings({
            preferences: { [input.dataset.toggle]: input.checked },
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
