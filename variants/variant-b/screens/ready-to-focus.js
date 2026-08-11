import { APP_CONFIG } from '../../../js/config.js';
import { navigate } from '../../../js/router.js';
import { requireAppAccess } from '../app-guard.js';

export function renderReadyToFocus(root) {
  const route = 'ready-to-focus';
  if (!requireAppAccess(route)) return;

  const section = document.createElement('section');
  section.id = 'screen';
  section.className = 'b-screen b-ready';
  section.setAttribute('aria-label', 'Ready to focus');

  section.innerHTML = `
    <div class="b-ready__bg" aria-hidden="true">
      <span class="b-ready__blob b-ready__blob--a"></span>
      <span class="b-ready__blob b-ready__blob--b"></span>
      <span class="b-ready__orbit"></span>
    </div>

    <header class="b-ready__top">
      <button type="button" class="b-back" id="b-ready-back" aria-label="Go back">
        <svg class="b-back__icon" width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <path d="M16.5 6.5L9 14l7.5 7.5" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M9.25 14H23" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"/>
        </svg>
      </button>
      <p class="b-ready__eyebrow"><span class="b-ready__live" aria-hidden="true"></span> Focus session</p>
      <span class="b-ready__topSpacer" aria-hidden="true"></span>
    </header>

    <div class="b-ready__stage">
      <div class="b-ready__hero">
        <img
          class="b-ready__mascot"
          src="${APP_CONFIG.focoStates.ready}"
          alt=""
          width="104"
          height="104"
          decoding="async"
        />
        <div class="b-ready__timer">
          <div class="b-ready__time">25</div>
          <div class="b-ready__unit">minutes</div>
        </div>
        <div class="b-ready__ring" aria-hidden="true">
          <svg viewBox="0 0 120 120">
            <circle class="b-ready__ringTrack" cx="60" cy="60" r="52" />
            <circle class="b-ready__ringFill" cx="60" cy="60" r="52" />
          </svg>
        </div>
      </div>

      <div class="b-ready__copy">
        <h1 class="b-ready__title">Ready to focus</h1>
        <p class="b-ready__lead">One timer. One task. Start before your brain talks you out of it.</p>
      </div>

      <div class="b-ready__meta">
        <span class="b-ready__chip">One Thing Mode</span>
        <span class="b-ready__chip b-ready__chip--soft">Soft start</span>
      </div>

      <div class="b-ready__task">
        <p class="b-ready__taskLabel">Current task</p>
        <p class="b-ready__taskValue">Finish the first small step</p>
      </div>

      <p class="b-ready__hint"><span class="b-ready__microPulse" aria-hidden="true"></span> Stay with it — great things take focus</p>
    </div>

    <footer class="b-ready__footer">
      <button type="button" class="b-btn b-btn--ghost b-ready__later" id="b-ready-later">Later</button>
      <button type="button" class="b-btn b-btn--primary b-ready__start" id="b-ready-start">Start focus</button>
    </footer>
  `;

  root.replaceChildren(section);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => section.classList.add('is-ready'));
  });

  section.querySelector('#b-ready-back')?.addEventListener('click', () => navigate('profile'));
  section.querySelector('#b-ready-later')?.addEventListener('click', () => navigate('profile'));
  section.querySelector('#b-ready-start')?.addEventListener('click', () => navigate('planner'));
}
