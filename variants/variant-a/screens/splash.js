import { APP_CONFIG } from '../../../js/config.js';
import { getRoute, navigate } from '../../../js/router.js';
import { resetOnboardingSlide } from '../onboarding/state.js';
import { armHomeUpdateModal } from './update.js';

const REDUCED_MOTION = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let splashGeneration = 0;

/**
 * Premium FOCO splash — logo + full app name, then:
 * Splash → onboarding (always) → auth / home (+ update modal on home)
 */
export function renderSplash(root) {
  const generation = ++splashGeneration;
  const reduceMotion = REDUCED_MOTION();

  const section = document.createElement('section');
  section.id = 'screen';
  section.className = 'app-screen foco-splash';
  section.setAttribute('aria-label', 'FOCO: ADHD Planner & Focus AI');
  section.setAttribute('role', 'status');
  if (reduceMotion) {
    section.classList.add('foco-splash--reduced');
  }

  section.innerHTML = `
    <div class="foco-splash__atmosphere" aria-hidden="true"></div>
    <div class="foco-splash__stage">
      <div class="foco-splash__mark">
        <span class="foco-splash__halo" aria-hidden="true"></span>
        <span class="foco-splash__halo foco-splash__halo--soft" aria-hidden="true"></span>
        <span class="foco-splash__spark" aria-hidden="true">
          <i></i><i></i><i></i><i></i><i></i><i></i>
        </span>
        <div class="foco-splash__fluff">
          <img
            class="foco-logo foco-logo--xl foco-splash__logo"
            src="${APP_CONFIG.logoUrl}"
            alt=""
            width="96"
            height="92"
            decoding="async"
          />
        </div>
      </div>
      <p class="foco-splash__name">FOCO</p>
    </div>
    <p class="foco-splash__tagline">ADHD Planner &amp; Focus AI</p>
  `;

  root.replaceChildren(section);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      if (generation !== splashGeneration) return;
      section.classList.add('is-ready');
    });
  });

  const dwell = reduceMotion ? 1200 : 3200;
  window.setTimeout(() => {
    if (generation !== splashGeneration) return;
    proceedFromSplash();
  }, dwell);
}

function proceedFromSplash() {
  if (getRoute() !== 'splash') return;

  // Arm update modal for the next Profile visit after this launch
  armHomeUpdateModal();
  resetOnboardingSlide();
  navigate('onboarding', { replace: true });
}
