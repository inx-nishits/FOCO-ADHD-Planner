/**
 * Open illustrations for the 3-screen welcome tour (no framed cards).
 */

export function renderOnboardingGraphic(stepId) {
  const common =
    'viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg" class="foco-onboarding__graphic-svg"';

  switch (stepId) {
    case 'intro':
    case 'focus':
      return `<svg viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg" class="foco-onboarding__graphic-svg foco-onb-focus" aria-hidden="true">
        <defs>
          <linearGradient id="foco-onb-focus-beam" x1="140" y1="0" x2="140" y2="150" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="rgba(167,139,250,0.42)"/>
            <stop offset="55%" stop-color="rgba(124,58,237,0.14)"/>
            <stop offset="100%" stop-color="rgba(124,58,237,0)"/>
          </linearGradient>
          <linearGradient id="foco-onb-focus-card" x1="56" y1="88" x2="224" y2="140" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="rgba(196,181,253,0.22)"/>
            <stop offset="100%" stop-color="rgba(76,29,149,0.35)"/>
          </linearGradient>
          <linearGradient id="foco-onb-focus-edge" x1="56" y1="88" x2="224" y2="140" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#ddd6fe"/>
            <stop offset="100%" stop-color="#7c3aed"/>
          </linearGradient>
          <linearGradient id="foco-onb-focus-badge" x1="0" y1="0" x2="1" y2="1">
            <stop stop-color="#c4b5fd"/>
            <stop offset="1" stop-color="#7c3aed"/>
          </linearGradient>
          <filter id="foco-onb-focus-soft" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2"/>
          </filter>
        </defs>

        <ellipse cx="140" cy="168" rx="92" ry="14" fill="rgba(124,58,237,0.16)" filter="url(#foco-onb-focus-soft)"/>

        <g class="foco-onb-focus__noise" opacity="0.55">
          <rect x="44" y="46" width="118" height="10" rx="5" fill="rgba(245,243,255,0.14)"/>
          <rect x="72" y="66" width="146" height="8" rx="4" fill="rgba(245,243,255,0.1)"/>
          <rect x="58" y="152" width="132" height="9" rx="4.5" fill="rgba(245,243,255,0.12)"/>
          <rect x="86" y="168" width="96" height="7" rx="3.5" fill="rgba(245,243,255,0.08)"/>
        </g>

        <path class="foco-onb-focus__beam" d="M140 6 L228 138 L52 138 Z" fill="url(#foco-onb-focus-beam)"/>

        <g class="foco-onb-focus__waves">
          <path class="foco-onb-focus__wave foco-onb-focus__wave--1" d="M68 178c24-10 48-10 72 0s48 10 72 0" stroke="rgba(167,139,250,0.35)" stroke-width="2" stroke-linecap="round"/>
          <path class="foco-onb-focus__wave foco-onb-focus__wave--2" d="M82 186c20-8 40-8 60 0s40 8 60 0" stroke="rgba(196,181,253,0.28)" stroke-width="1.6" stroke-linecap="round"/>
          <path class="foco-onb-focus__wave foco-onb-focus__wave--3" d="M96 193c16-6 32-6 48 0s32 6 48 0" stroke="rgba(216,180,254,0.22)" stroke-width="1.3" stroke-linecap="round"/>
        </g>

        <g class="foco-onb-focus__hero">
          <rect x="56" y="86" width="168" height="54" rx="16" fill="url(#foco-onb-focus-card)" stroke="url(#foco-onb-focus-edge)" stroke-width="1.5"/>
          <rect x="72" y="104" width="88" height="8" rx="4" fill="rgba(255,255,255,0.88)"/>
          <rect x="72" y="118" width="58" height="6" rx="3" fill="rgba(245,243,255,0.38)"/>
          <circle cx="198" cy="113" r="17" fill="url(#foco-onb-focus-badge)"/>
          <circle cx="198" cy="113" r="17" fill="none" stroke="rgba(255,255,255,0.28)" stroke-width="1.2"/>
          <text x="198" y="109" text-anchor="middle" fill="#fff" font-family="Inter,system-ui,sans-serif" font-size="13" font-weight="700">25</text>
          <text x="198" y="120" text-anchor="middle" fill="rgba(255,255,255,0.82)" font-family="Inter,system-ui,sans-serif" font-size="7" font-weight="600" letter-spacing="0.08em">MIN</text>
        </g>

        <circle class="foco-onb-focus__dot foco-onb-focus__dot--a" cx="92" cy="58" r="3" fill="#a78bfa"/>
        <circle class="foco-onb-focus__dot foco-onb-focus__dot--b" cx="196" cy="64" r="2.5" fill="rgba(167,139,250,0.55)"/>
        <circle class="foco-onb-focus__dot foco-onb-focus__dot--c" cx="228" cy="148" r="2" fill="rgba(196,181,253,0.45)"/>
      </svg>`;
    case 'features':
    case 'planner':
      return `<svg ${common} aria-hidden="true">
        <defs>
          <linearGradient id="foco-onb-plan-a" x1="0" y1="0" x2="1" y2="1">
            <stop stop-color="#c4b5fd"/>
            <stop offset="1" stop-color="#7c3aed"/>
          </linearGradient>
          <linearGradient id="foco-onb-plan-b" x1="0" y1="0" x2="0" y2="1">
            <stop stop-color="rgba(167,139,250,0.45)"/>
            <stop offset="1" stop-color="rgba(124,58,237,0.05)"/>
          </linearGradient>
          <filter id="foco-onb-soft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.2"/>
          </filter>
        </defs>
        <ellipse cx="140" cy="168" rx="88" ry="12" fill="rgba(124,58,237,0.18)" filter="url(#foco-onb-soft)"/>
        <path d="M62 58c0-10 8-18 18-18h120c10 0 18 8 18 18v78c0 10-8 18-18 18H80c-10 0-18-8-18-18V58z"
          fill="url(#foco-onb-plan-b)" opacity="0.35"/>
        <path d="M78 72h124" stroke="rgba(196,181,253,0.35)" stroke-width="3" stroke-linecap="round"/>
        <path d="M78 96h98" stroke="rgba(245,243,255,0.55)" stroke-width="8" stroke-linecap="round"/>
        <path d="M78 122h132" stroke="rgba(245,243,255,0.28)" stroke-width="8" stroke-linecap="round"/>
        <path d="M78 148h72" stroke="rgba(245,243,255,0.18)" stroke-width="8" stroke-linecap="round"/>
        <circle cx="208" cy="108" r="28" fill="url(#foco-onb-plan-a)" opacity="0.95"/>
        <circle cx="208" cy="108" r="28" fill="none" stroke="rgba(255,255,255,0.28)" stroke-width="1.5"/>
        <path d="M198 108h20M208 98v20" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>
        <circle cx="96" cy="48" r="4" fill="#a78bfa"/>
        <circle cx="114" cy="48" r="4" fill="rgba(167,139,250,0.45)"/>
        <circle cx="132" cy="48" r="4" fill="rgba(167,139,250,0.25)"/>
      </svg>`;
    case 'personal':
    case 'ai':
      return `<svg ${common} aria-hidden="true">
        <defs>
          <linearGradient id="foco-onb-ai" x1="0" y1="0" x2="1" y2="1">
            <stop stop-color="#c4b5fd"/>
            <stop offset="1" stop-color="#6366f1"/>
          </linearGradient>
          <radialGradient id="foco-onb-ai-glow" cx="0.5" cy="0.4" r="0.55">
            <stop stop-color="rgba(167,139,250,0.4)"/>
            <stop offset="1" stop-color="rgba(124,58,237,0)"/>
          </radialGradient>
        </defs>
        <ellipse cx="140" cy="108" rx="100" ry="70" fill="url(#foco-onb-ai-glow)"/>
        <path d="M140 36l18 48 52 8-40 34 10 50-40-22-40 22 10-50-40-34 52-8z"
          fill="url(#foco-onb-ai)" fill-opacity="0.22" stroke="url(#foco-onb-ai)" stroke-width="2"/>
        <path d="M140 58l10 28 30 4-24 20 6 30-22-12-22 12 6-30-24-20 30-4z"
          fill="url(#foco-onb-ai)" fill-opacity="0.55" stroke="rgba(255,255,255,0.35)" stroke-width="1"/>
        <path d="M52 156c30-26 72-26 96 0s66 26 90 0" stroke="rgba(129,140,248,0.55)" stroke-width="2.5" stroke-linecap="round"/>
        <circle cx="78" cy="132" r="5" fill="#a78bfa"/>
        <circle cx="202" cy="132" r="5" fill="#818cf8"/>
        <circle cx="140" cy="148" r="3.5" fill="#c4b5fd"/>
      </svg>`;
    default:
      return '';
  }
}
