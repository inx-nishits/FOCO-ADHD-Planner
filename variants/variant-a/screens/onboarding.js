import { APP_CONFIG } from '../../../js/config.js';
import { navigate } from '../../../js/router.js';
import { ONBOARDING_STEPS, ONBOARDING_TOTAL } from '../onboarding/steps.js';
import { renderOnboardingGraphic } from '../onboarding/graphics.js';
import { iconSvg } from '../components/icons.js';
import {
  finishOnboarding,
  getOnboardingSlideIndex,
  resetOnboardingSlide,
  setOnboardingSlideIndex,
} from '../onboarding/state.js';

const REDUCED_MOTION = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let activeController = null;

/**
 * FOCO welcome — 3 horizontal slides after splash.
 * Always shown on every launch (logged in or not).
 * Prev / Next / Skip / Get Started / swipe → auth or profile.
 */
export function renderOnboarding(root) {
  resetOnboardingSlide();
  activeController?.destroy();
  activeController = createOnboardingController(root);
  activeController.mount();
}

function createOnboardingController(root) {
  let stepIndex = Math.min(
    Math.max(0, getOnboardingSlideIndex()),
    ONBOARDING_TOTAL - 1,
  );
  let animating = false;

  const section = document.createElement('section');
  section.id = 'screen';
  section.className = 'app-screen foco-onboarding foco-onboarding--slides';
  section.setAttribute('aria-label', 'Welcome to FOCO');
  section.dataset.tone = ONBOARDING_STEPS[0].tone;

  section.innerHTML = `
    <div class="foco-onboarding__atmosphere" aria-hidden="true"></div>
    <div class="foco-onboarding__orb foco-onboarding__orb--a" aria-hidden="true"></div>
    <div class="foco-onboarding__orb foco-onboarding__orb--b" aria-hidden="true"></div>
    <div class="foco-onboarding__orb foco-onboarding__orb--c" aria-hidden="true"></div>

    <header class="foco-onboarding__header">
      <img class="foco-logo foco-logo--sm foco-onboarding__brand" src="${APP_CONFIG.logoUrl}" alt="" width="28" height="27" decoding="async" />
      <button type="button" class="foco-link foco-onboarding__skip" id="onboarding-skip">Skip</button>
    </header>

    <div class="foco-onboarding__viewport" id="onboarding-viewport">
      <div class="foco-onboarding__track" id="onboarding-track" style="--slide-index: 0">
        ${ONBOARDING_STEPS.map((step, i) => renderSlide(step, i)).join('')}
      </div>
    </div>

    <footer class="foco-onboarding__footer">
      <div class="foco-onboarding__dots" id="onboarding-dots" role="tablist" aria-label="Slides">
        ${ONBOARDING_STEPS.map(
          (_, i) =>
            `<button type="button" class="foco-onboarding__dot ${i === 0 ? 'is-active' : ''}" data-go-slide="${i}" aria-label="Go to slide ${i + 1}" ${i === 0 ? 'aria-current="true"' : ''}></button>`,
        ).join('')}
      </div>
      <div class="foco-onboarding__actions">
        <button type="button" class="foco-btn foco-btn--ghost foco-onboarding__prev is-hidden" id="onboarding-prev" hidden aria-hidden="true">
          Previous
        </button>
        <button type="button" class="foco-btn foco-btn--primary foco-onboarding__next" id="onboarding-next" aria-label="Next">
          <span class="foco-onboarding__next-icon" aria-hidden="true">${iconSvg('arrowRight')}</span>
        </button>
      </div>
    </footer>
  `;

  const track = section.querySelector('#onboarding-track');
  const viewport = section.querySelector('#onboarding-viewport');
  const dotsRoot = section.querySelector('#onboarding-dots');
  const btnPrev = section.querySelector('#onboarding-prev');
  const btnNext = section.querySelector('#onboarding-next');
  const btnSkip = section.querySelector('#onboarding-skip');

  const swipe = bindSwipe(viewport, {
    onNext: () => go(1),
    onPrev: () => go(-1),
    onDrag: (dx, width) => {
      if (REDUCED_MOTION() || animating) return;
      const base = -stepIndex * 100;
      const pct = (dx / Math.max(width, 1)) * 100;
      track.style.transition = 'none';
      track.style.transform = `translate3d(calc(${base}% + ${pct}%), 0, 0)`;
    },
    onDragEnd: () => {
      track.style.transition = '';
      applySlide(false);
    },
  });

  function applySlide(animate = true) {
    const step = ONBOARDING_STEPS[stepIndex];
    const isLast = stepIndex === ONBOARDING_TOTAL - 1;

    section.dataset.tone = step.tone;
    section.dataset.step = step.id;

    if (!animate || REDUCED_MOTION()) {
      track.style.transition = 'none';
    }
    track.style.setProperty('--slide-index', String(stepIndex));
    track.style.transform = `translate3d(-${stepIndex * 100}%, 0, 0)`;

    if (!animate || REDUCED_MOTION()) {
      requestAnimationFrame(() => {
        track.style.transition = '';
      });
    }

    btnPrev.hidden = stepIndex === 0;
    btnPrev.disabled = stepIndex === 0;
    btnPrev.classList.toggle('is-hidden', stepIndex === 0);
    btnPrev.setAttribute('aria-hidden', stepIndex === 0 ? 'true' : 'false');
    btnNext.classList.toggle('foco-onboarding__next--finish', isLast);
    btnNext.classList.toggle('foco-onboarding__next--icon', !isLast);
    if (isLast) {
      btnNext.setAttribute('aria-label', 'Get started');
      btnNext.innerHTML = 'Get Started';
      btnSkip.hidden = true;
    } else {
      btnNext.setAttribute('aria-label', 'Next');
      btnNext.innerHTML = `<span class="foco-onboarding__next-icon" aria-hidden="true">${iconSvg('arrowRight')}</span>`;
      btnSkip.hidden = false;
    }

    dotsRoot.querySelectorAll('.foco-onboarding__dot').forEach((dot, i) => {
      const active = i === stepIndex;
      dot.classList.toggle('is-active', active);
      if (active) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });

    section.querySelectorAll('.foco-onboarding__slide').forEach((slide, i) => {
      slide.classList.toggle('is-active', i === stepIndex);
      slide.setAttribute('aria-hidden', i === stepIndex ? 'false' : 'true');
    });
  }

  function go(delta) {
    if (animating) return;
    const next = stepIndex + delta;
    if (next < 0 || next >= ONBOARDING_TOTAL) {
      applySlide(true);
      return;
    }

    animating = true;
    stepIndex = next;
    setOnboardingSlideIndex(stepIndex);
    applySlide(true);

    window.setTimeout(
      () => {
        animating = false;
      },
      REDUCED_MOTION() ? 0 : 340,
    );
  }

  function goTo(index) {
    if (animating || index === stepIndex) return;
    if (index < 0 || index >= ONBOARDING_TOTAL) return;
    animating = true;
    stepIndex = index;
    setOnboardingSlideIndex(stepIndex);
    applySlide(true);
    window.setTimeout(
      () => {
        animating = false;
      },
      REDUCED_MOTION() ? 0 : 340,
    );
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

  dotsRoot.querySelectorAll('[data-go-slide]').forEach((dot) => {
    dot.addEventListener('click', () => goTo(Number(dot.dataset.goSlide)));
  });

  return {
    mount() {
      root.replaceChildren(section);
      applySlide(false);
    },
    destroy() {
      swipe.destroy();
      section.remove();
    },
  };
}

function renderSlide(step, index) {
  const points = (step.points || [])
    .map(
      (point) => `
        <li class="foco-onboarding__point">
          <span class="foco-onboarding__point-icon" aria-hidden="true">${iconSvg(point.icon)}</span>
          <span class="foco-onboarding__point-text">${escapeHtml(point.text)}</span>
        </li>`,
    )
    .join('');

  return `
    <article class="foco-onboarding__slide ${index === 0 ? 'is-active' : ''}" data-slide="${index}" aria-hidden="${index === 0 ? 'false' : 'true'}">
      <div class="foco-onboarding__visual foco-onboarding__visual--${step.layout}">
        <div class="foco-onboarding__visual-stage">
          <div class="foco-onboarding__visual-glow" aria-hidden="true"></div>
          <div class="foco-onboarding__graphic">${renderOnboardingGraphic(step.id)}</div>
        </div>
      </div>
      <div class="foco-onboarding__copy">
        <p class="foco-onboarding__eyebrow"><span>${escapeHtml(step.eyebrow)}</span></p>
        <h1 class="foco-onboarding__title">${escapeHtml(step.title)}</h1>
        <p class="foco-onboarding__lead">${escapeHtml(step.lead)}</p>
        ${points ? `<ul class="foco-onboarding__points">${points}</ul>` : ''}
        ${step.ctaHint ? `<p class="foco-onboarding__hint">${escapeHtml(step.ctaHint)}</p>` : ''}
      </div>
    </article>
  `;
}

function bindSwipe(element, { onNext, onPrev, onDrag, onDragEnd }) {
  if (!element) return { destroy() {} };

  let startX = 0;
  let startY = 0;
  let tracking = false;
  let dragging = false;

  const onPointerDown = (event) => {
    if (event.target.closest('button, a, input')) return;
    tracking = true;
    dragging = false;
    startX = event.clientX;
    startY = event.clientY;
    element.setPointerCapture?.(event.pointerId);
  };

  const onPointerMove = (event) => {
    if (!tracking) return;
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;
    if (!dragging) {
      if (Math.abs(dx) < 8) return;
      if (Math.abs(dx) < Math.abs(dy) * 1.1) {
        tracking = false;
        return;
      }
      dragging = true;
    }
    onDrag?.(dx, element.clientWidth);
  };

  const onPointerUp = (event) => {
    if (!tracking) return;
    tracking = false;
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;
    onDragEnd?.();

    if (!dragging) return;
    if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy) * 1.15) return;
    if (dx < 0) onNext();
    else onPrev();
  };

  element.addEventListener('pointerdown', onPointerDown);
  element.addEventListener('pointermove', onPointerMove);
  element.addEventListener('pointerup', onPointerUp);
  element.addEventListener('pointercancel', onPointerUp);

  return {
    destroy() {
      element.removeEventListener('pointerdown', onPointerDown);
      element.removeEventListener('pointermove', onPointerMove);
      element.removeEventListener('pointerup', onPointerUp);
      element.removeEventListener('pointercancel', onPointerUp);
    },
  };
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
