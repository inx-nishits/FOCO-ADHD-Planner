import { APP_CONFIG } from '../../../js/config.js';
import { ONBOARDING_STEPS, ONBOARDING_TOTAL } from '../onboarding/steps.js';
import {
  finishOnboarding,
  getOnboardingSlideIndex,
  resetOnboardingSlide,
  setOnboardingSlideIndex,
} from '../onboarding/state.js';

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Content-matched artwork:
 * - Focus / start → ready (alert zen energy)
 * - Your day → happy (positive, simplified day)
 * - FOCO AI / stuck → calm (wrapped, ask for help) + focus rings vibe in header
 */
const STEP_ART = {
  intro: APP_CONFIG.focoStates.ready,
  features: APP_CONFIG.focoStates.happy,
  personal: APP_CONFIG.focoStates.calm,
};

const STEP_ALT = {
  intro: 'FOCO ready to start a focus session',
  features: 'FOCO happy about a simplified day',
  personal: 'FOCO cozy and ready to help when you’re stuck',
};

function slideGraphic(id) {
  const src = STEP_ART[id] || APP_CONFIG.focoStates.focus;
  const alt = STEP_ALT[id] || '';
  return `
    <img
      class="b-onb__art"
      src="${src}"
      alt="${escapeHtml(alt)}"
      width="280"
      height="280"
      decoding="async"
    />
  `;
}

export function renderOnboarding(root) {
  resetOnboardingSlide();
  let stepIndex = Math.min(Math.max(0, getOnboardingSlideIndex()), ONBOARDING_TOTAL - 1);

  const section = document.createElement('section');
  section.id = 'screen';
  section.className = 'b-screen b-onb';
  section.setAttribute('aria-label', 'Welcome to FOCO');

  section.innerHTML = `
    <div class="b-onb__bg" aria-hidden="true"></div>
    <header class="b-onb__top">
      <div class="b-onb__progress" id="b-onb-progress">
        ${ONBOARDING_STEPS.map((_, i) => `<span class="b-onb__seg ${i === 0 ? 'is-active' : ''}" data-seg="${i}"></span>`).join('')}
      </div>
      <button type="button" class="b-link" id="b-onb-skip">Skip</button>
    </header>
    <div class="b-onb__viewport">
      <div class="b-onb__track" id="b-onb-track">
        ${ONBOARDING_STEPS.map((step, i) => renderSlide(step, i)).join('')}
      </div>
    </div>
    <footer class="b-onb__bottom">
      <button type="button" class="b-onb__prev is-hidden" id="b-onb-prev" hidden>Previous</button>
      <span class="b-onb__spacer"></span>
      <button type="button" class="b-btn b-btn--primary b-onb__next" id="b-onb-next">
        Next <span class="b-onb__arrow" aria-hidden="true">→</span>
      </button>
    </footer>
  `;

  root.replaceChildren(section);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => section.classList.add('is-ready'));
  });

  const track = section.querySelector('#b-onb-track');
  const btnPrev = section.querySelector('#b-onb-prev');
  const btnNext = section.querySelector('#b-onb-next');
  const btnSkip = section.querySelector('#b-onb-skip');

  function applySlide() {
    track.style.transform = `translate3d(-${stepIndex * (100 / ONBOARDING_TOTAL)}%, 0, 0)`;

    section.querySelectorAll('.b-onb__seg').forEach((seg, i) => {
      seg.classList.toggle('is-active', i <= stepIndex);
    });

    section.querySelectorAll('.b-onb__slide').forEach((slide, i) => {
      slide.classList.toggle('is-active', i === stepIndex);
    });

    const isLast = stepIndex === ONBOARDING_TOTAL - 1;
    btnPrev.hidden = stepIndex === 0;
    btnPrev.classList.toggle('is-hidden', stepIndex === 0);
    if (isLast) {
      btnNext.textContent = 'Get started';
    } else {
      btnNext.innerHTML = 'Next <span class="b-onb__arrow" aria-hidden="true">→</span>';
    }
    btnSkip.hidden = isLast;
  }

  function go(delta) {
    const next = stepIndex + delta;
    if (next < 0 || next >= ONBOARDING_TOTAL) return;
    stepIndex = next;
    setOnboardingSlideIndex(stepIndex);
    applySlide();
  }

  btnNext.addEventListener('click', () => {
    if (stepIndex === ONBOARDING_TOTAL - 1) {
      finishOnboarding();
      return;
    }
    go(1);
  });
  btnPrev.addEventListener('click', () => go(-1));
  btnSkip.addEventListener('click', () => finishOnboarding());

  applySlide();
}

function renderSlide(step, index) {
  const bullets = (step.points || [])
    .map((point) => `<li class="b-onb__bullet">${escapeHtml(point.text)}</li>`)
    .join('');

  return `
    <article class="b-onb__slide ${index === 0 ? 'is-active' : ''}" data-slide="${index}" data-step="${escapeHtml(step.id)}">
      <div class="b-onb__visual">
        <div class="b-onb__graphic">${slideGraphic(step.id)}</div>
      </div>
      <div class="b-onb__copy">
        <div class="b-onb__eyebrow">${escapeHtml(step.eyebrow)}</div>
        <h1 class="b-onb__title">${escapeHtml(step.title)}</h1>
        <p class="b-onb__lead">${escapeHtml(step.lead)}</p>
        ${bullets ? `<ul class="b-onb__bullets">${bullets}</ul>` : ''}
        ${step.ctaHint ? `<div class="b-onb__hint">${escapeHtml(step.ctaHint)}</div>` : ''}
      </div>
    </article>
  `;
}
