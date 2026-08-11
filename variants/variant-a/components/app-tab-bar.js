import { navigate } from '../../../js/router.js';

const TAB_ICONS = {
  planner: `<svg class="foco-dock__svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3.5v2.5M16 3.5v2.5"/><rect x="4" y="5.5" width="16" height="14.5" rx="3.5"/><path d="M4 10h16"/></svg>`,
  ai: `<svg class="foco-dock__svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3.5l1.2 3.1 3.3.25-2.55 2.1.85 3.15L12 10.7 9.2 12.1l.85-3.15-2.55-2.1 3.3-.25L12 3.5z"/><path d="M5.2 16.4l.75 1.9 2 .15-1.55 1.25.55 1.95-1.75-1-1.75 1 .55-1.95-1.55-1.25 2-.15.75-1.9z"/><path d="M18.4 14.8l.55 1.45 1.55.1-1.2.95.4 1.5-1.3-.75-1.3.75.4-1.5-1.2-.95 1.55-.1.55-1.45z"/></svg>`,
  stats: `<svg class="foco-dock__svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 18V11.5M12 18V7M18 18v-4.5"/></svg>`,
  profile: `<svg class="foco-dock__svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8.2" r="3.2"/><path d="M5.2 19c.95-3.05 3.5-4.8 6.8-4.8s5.85 1.75 6.8 4.8"/></svg>`,
};

const TABS = [
  { id: 'planner', label: 'Daily', route: 'planner' },
  { id: 'ai', label: 'AI', route: 'ai' },
  { id: 'stats', label: 'Stats', route: 'stats' },
  { id: 'profile', label: 'You', route: 'profile' },
];

export function renderAppTabBar(active = 'profile') {
  return `
    <nav class="foco-dock" aria-label="Main navigation" data-active="${active}">
      <div class="foco-dock__row">
        ${TABS.map((tab) => {
          const isActive = active === tab.id;
          return `
          <button
            type="button"
            class="foco-dock__item${isActive ? ' is-active' : ''}"
            data-nav="${tab.id}"
            data-route="${tab.route}"
            aria-label="${tab.label}"
            ${isActive ? 'aria-current="page"' : ''}
          >
            <span class="foco-dock__well" aria-hidden="true">
              <span class="foco-dock__icon">${TAB_ICONS[tab.id]}</span>
            </span>
            <span class="foco-dock__label">${tab.label}</span>
          </button>`;
        }).join('')}
      </div>
    </nav>
  `;
}

export function bindAppTabBar(root) {
  const nav = root.querySelector('.foco-dock');
  if (!nav) return;

  root.querySelectorAll('.foco-dock [data-nav]').forEach((btn) => {
    const clearPress = () => btn.classList.remove('is-pressing');

    btn.addEventListener('pointerdown', () => btn.classList.add('is-pressing'));
    btn.addEventListener('pointerup', clearPress);
    btn.addEventListener('pointercancel', clearPress);
    btn.addEventListener('pointerleave', clearPress);

    btn.addEventListener('click', () => {
      const dest = btn.dataset.nav;
      const route = btn.dataset.route || dest;
      const alreadyActive = btn.classList.contains('is-active') || btn.getAttribute('aria-current') === 'page';

      if (!alreadyActive) {
        nav.querySelectorAll('.foco-dock__item').forEach((item) => {
          item.classList.remove('is-active');
          item.removeAttribute('aria-current');
        });
        btn.classList.add('is-active');
        btn.setAttribute('aria-current', 'page');
        nav.dataset.active = dest;
      }

      if (route === 'planner') navigate('planner');
      else if (route === 'ai') navigate('ai');
      else if (route === 'stats') navigate('stats');
      else if (route === 'profile') navigate('profile');
    });
  });
}
