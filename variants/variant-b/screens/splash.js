import { APP_CONFIG } from '../../../js/config.js';
import { getRoute, navigate } from '../../../js/router.js';
import { resetOnboardingSlide } from '../onboarding/state.js';

const REDUCED_MOTION = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let splashGeneration = 0;

export function renderSplash(root) {
  const generation = ++splashGeneration;
  const reduceMotion = REDUCED_MOTION();

  const section = document.createElement('section');
  section.id = 'screen';
  section.className = 'b-screen b-splash';
  section.setAttribute('aria-label', `${APP_CONFIG.appName} — loading`);
  section.setAttribute('role', 'status');

  section.innerHTML = `
    <div class="b-splash__bg" aria-hidden="true"></div>
    <div class="b-splash__stage">
      <div class="b-splash__brandBlock">
        <div class="b-splash__logoWrap" aria-hidden="true">
          <span class="b-splash__fluff">
            <img
              class="b-splash__logo b-splash__logo--wordmark"
              src="${APP_CONFIG.logoFocoUrl}"
              alt="${APP_CONFIG.appName}"
              width="220"
              height="96"
              decoding="async"
            />
          </span>
        </div>
        <div class="b-splash__brand">
          <div class="b-splash__sub">${APP_CONFIG.description}</div>
        </div>
      </div>
    </div>
    <div class="b-splash__loader">
      <div class="b-splash__dots" aria-hidden="true"><span></span><span></span><span></span></div>
      <div class="b-splash__bar"><span class="b-splash__barFill"></span></div>
      <div class="b-splash__hint">Getting things ready…</div>
    </div>
  `;

  root.replaceChildren(section);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      if (generation !== splashGeneration) return;
      section.classList.add('is-ready');
    });
  });

  const dwell = reduceMotion ? 1200 : 2800;
  window.setTimeout(() => {
    if (generation !== splashGeneration) return;
    proceedFromSplash();
  }, dwell);
}

function proceedFromSplash() {
  if (getRoute() !== 'splash') return;
  resetOnboardingSlide();
  navigate('onboarding', { replace: true });
}
