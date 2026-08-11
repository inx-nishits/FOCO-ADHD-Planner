import { APP_CONFIG } from '../../../js/config.js';
import { getRoute } from '../../../js/router.js';
import { requireAppAccess } from '../app-guard.js';
import { renderAppTabBar, bindAppTabBar } from '../components/app-tab-bar.js';
import { escapeHtml } from '../account/helpers.js';

const EMPTY_PAGES = {
  planner: {
    tab: 'planner',
    eyebrow: 'Daily',
    title: 'Your day',
    heading: 'Your day, simplified',
    body: 'Timed tasks, anytime lists, and break-it-down plans will live here — everything you need to do, in one place.',
    motif: 'timeline',
  },
  ai: {
    tab: 'ai',
    eyebrow: 'AI',
    title: 'Tell FOCO',
    heading: 'Stuck? Tell FOCO',
    body: 'Chat it, speak it, or scan it. Name the task you’re procrastinating on — FOCO helps you begin.',
    motif: 'spark',
  },
  stats: {
    tab: 'stats',
    eyebrow: 'Stats',
    title: 'Your stats',
    heading: 'Build momentum',
    body: 'Track focus time, tasks, and steps — today, this week, and all time — so progress stays visible.',
    motif: 'bars',
  },
};

function motifHtml(kind) {
  if (kind === 'timeline') {
    return `
      <div class="foco-empty-motif foco-empty-motif--timeline" aria-hidden="true">
        <span></span><span></span><span></span>
      </div>`;
  }
  if (kind === 'bars') {
    return `
      <div class="foco-empty-motif foco-empty-motif--bars" aria-hidden="true">
        <i></i><i></i><i></i><i></i>
      </div>`;
  }
  return `
    <div class="foco-empty-motif foco-empty-motif--spark" aria-hidden="true">
      <i></i><i></i><i></i>
    </div>`;
}

function renderEmptyPlaceholder(root, pageKey) {
  const route = getRoute();
  if (!requireAppAccess(route)) return;

  const page = EMPTY_PAGES[pageKey];
  if (!page) return;

  const section = document.createElement('section');
  section.id = 'screen';
  section.className = `app-screen foco-empty-page foco-empty-page--${pageKey}`;
  section.setAttribute('aria-label', page.title);

  section.innerHTML = `
    <header class="foco-empty-page__header">
      <p class="foco-caption foco-empty-page__eyebrow">${escapeHtml(page.eyebrow)}</p>
      <h1 class="foco-title">${escapeHtml(page.title)}</h1>
    </header>
    <div class="foco-empty-page__body">
      <div class="foco-empty-atmosphere" aria-hidden="true"></div>
      <div class="foco-empty-state" role="status">
        <div class="foco-empty-state__mark">
          <span class="foco-empty-state__halo" aria-hidden="true"></span>
          <img
            class="foco-logo foco-empty-state__logo"
            src="${APP_CONFIG.logoUrl}"
            alt=""
            width="88"
            height="84"
            decoding="async"
          />
        </div>
        ${motifHtml(page.motif)}
        <h2 class="foco-empty-state__heading">${escapeHtml(page.heading)}</h2>
        <p class="foco-empty-state__copy">${escapeHtml(page.body)}</p>
      </div>
    </div>
    <footer class="foco-empty-page__footer foco-tab-dock-host">
      ${renderAppTabBar(page.tab)}
    </footer>
  `;

  root.replaceChildren(section);
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
