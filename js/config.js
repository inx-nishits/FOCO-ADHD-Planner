/**
 * Application configuration
 * Flip developmentPreview to false for production builds.
 */
export const APP_CONFIG = {
  /** Product name — FOCO brand */
  appName: 'FOCO',
  shortName: 'FOCO',
  description: 'ADHD Planner & Focus AI — plan the day, focus on one thing, tell FOCO what’s stuck',

  /** Official FOCO logo (mascot mark) — do not replace or regenerate */
  logoUrl: '/assets/images/foco-logo.png',

  /** Variant B splash / brand wordmark (character + FOCO) */
  logoFocoUrl: '/assets/icons/logo-foco.png',

  /** Variant B character state icons */
  focoStates: {
    calm: '/assets/icons/foco_state_a.png',
    happy: '/assets/icons/foco_state_b.png',
    ready: '/assets/icons/foco_state_c.png',
    focus: '/assets/icons/foco_state_d.png',
  },

  /** Demo profile photo for Alex Rivera (Variant A account hub) */
  mockUserAvatarUrl: '/assets/images/mock-user-alex.png',

  /** Variant IDs shown in the versions switcher */
  previewVariantIds: ['a', 'b'],

  /** Show variant switcher (dev / client demos) */
  developmentPreview: true,

  /** Used when no URL variant and no saved preference exist */
  defaultVariant: 'a',

  /** localStorage key for last-selected variant (URL always wins) */
  storageKey: 'app.variant',

  /** Hash-based screen routing prefix for future screens */
  hashPrefix: '#/',

  /** Fallback route when no hash is present */
  defaultRoute: 'splash',

  /** Service worker path (root-relative) */
  serviceWorkerUrl: '/sw.js',

  /** Cache version bump when shell assets change */
  cacheVersion: 'v75',

  /* ---------- Version / update gate (Phase 02) ---------- */

  /** Currently running app version (bundled build) */
  appVersion: '1.0.0',

  /** Minimum version allowed to continue past splash */
  minRequiredVersion: '1.1.0',

  /** Latest available version (shown on update screen) */
  latestVersion: '1.1.0',

  /**
   * Force the update gate on every launch.
   * Prefer #/update or ?update=1 for demos so Update→reload does not loop.
   */
  forceUpdate: false,

  /**
   * Store / download destinations for the Update CTA.
   * Web prototype opens the matching link, then marks the session updated.
   */
  storeUrls: {
    ios: 'https://apps.apple.com/app/foco-adhd-planner/id0000000000',
    android: 'https://play.google.com/store/apps/details?id=app.tryfoco.android',
    web: 'https://tryfoco.com',
  },

  /** Mock release notes shown on the update gate */
  releaseNotes: [
    'Clearer focus messaging — one timer, one task',
    'Tell FOCO: chat it, speak it, or scan it',
    'Break-it-down planning and reminder improvements',
  ],

  /**
   * Update CTA behavior:
   * { type: 'store' } — open platform store URL, then continue (default)
   * { type: 'url', url: 'https://…' } — open a specific URL
   * { type: 'reload' } — soft refresh only
   */
  updateAction: {
    type: 'store',
  },
};
