import { APP_CONFIG } from '../../../js/config.js';
import { getRoute, navigate } from '../../../js/router.js';
import { requireAppAccess } from '../app-guard.js';
import { renderAppTabBar, bindAppTabBar } from '../components/app-tab-bar.js';
import { authAtmosphereHtml } from '../auth/helpers.js';

const escapeHtml = (v) =>
  String(v || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const EMPTY_PAGES = {
  planner: {
    tab: 'planner',
    eyebrow: 'Daily',
    title: 'Your day',
    heading: 'Your day, simplified',
    body: 'Timed tasks, anytime lists, and break-it-down plans will live here — everything you need to do, in one place.',
    cta: { to: 'ready-to-focus', label: 'Ready to focus' },
    art: 'ready',
    motif: 'timeline',
  },
  ai: {
    tab: 'ai',
    eyebrow: 'AI',
    title: 'Tell FOCO',
    heading: 'Stuck? Tell FOCO',
    body: 'Chat it, speak it, or scan it. Name the task you’re procrastinating on — FOCO helps you begin.',
    cta: { to: 'profile', label: 'Back to You' },
    art: 'calm',
    motif: 'spark',
  },
  stats: {
    tab: 'stats',
    eyebrow: 'Stats',
    title: 'Your stats',
    heading: 'Build momentum',
    body: 'Track focus time, tasks, and steps — today, this week, and all time — so progress stays visible.',
    cta: { to: 'profile', label: 'Back to You' },
    art: 'happy',
    motif: 'bars',
  },
};

function motifHtml(kind) {
  if (kind === 'timeline') {
    return `<div class="b-empty__motif b-empty__motif--timeline" aria-hidden="true"><span></span><span></span><span></span></div>`;
  }
  if (kind === 'bars') {
    return `<div class="b-empty__motif b-empty__motif--bars" aria-hidden="true"><i></i><i></i><i></i><i></i></div>`;
  }
  return `<div class="b-empty__motif b-empty__motif--spark" aria-hidden="true"><i></i><i></i><i></i></div>`;
}

function renderEmptyPlaceholder(root, pageKey) {
  const route = getRoute();
  if (!requireAppAccess(route)) return;

  const page = EMPTY_PAGES[pageKey];
  if (!page) return;

  const art = APP_CONFIG.focoStates[page.art] || APP_CONFIG.focoStates.happy;

  const section = document.createElement('section');
  section.id = 'screen';
  section.className = `b-screen b-empty b-empty--${pageKey}`;
  section.setAttribute('aria-label', page.title);

  section.innerHTML = `
    ${authAtmosphereHtml()}
    <header class="b-empty__header">
      <p class="b-empty__eyebrow">${escapeHtml(page.eyebrow)}</p>
      <h1 class="b-empty__title">${escapeHtml(page.title)}</h1>
    </header>
    <div class="b-empty__body">
      <div class="b-empty__state" role="status">
        <div class="b-empty__mark" aria-hidden="true">
          <img class="b-empty__logo" src="${art}" alt="" width="120" height="120" decoding="async" />
        </div>
        ${motifHtml(page.motif)}
        <h2 class="b-empty__heading">${escapeHtml(page.heading)}</h2>
        <p class="b-empty__copy">${escapeHtml(page.body)}</p>
        <button type="button" class="b-btn b-btn--primary b-empty__cta" id="b-empty-cta">
          ${escapeHtml(page.cta.label)}
        </button>
      </div>
    </div>
    <footer class="b-tab-dock-host">
      ${renderAppTabBar(page.tab)}
    </footer>
  `;

  root.replaceChildren(section);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => section.classList.add('is-ready'));
  });

  section.querySelector('#b-empty-cta')?.addEventListener('click', () => navigate(page.cta.to));
  bindAppTabBar(section);
}

export function renderPlannerEmpty(root) {
  renderEmptyPlaceholder(root, 'planner');
}

export function renderAiEmpty(root) {
  renderEmptyPlaceholder(root, 'ai');
}

export function renderStatsEmpty(root) {
  renderEmptyPlaceholder(root, 'stats');
}
