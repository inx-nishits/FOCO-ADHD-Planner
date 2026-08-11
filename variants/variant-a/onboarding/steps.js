/**
 * FOCO welcome tour — 3 slides after splash.
 * Content inspired by FOCO product messaging (not screenshot UI).
 * 1) Start / focus
 * 2) Day & break-it-down planning
 * 3) Tell FOCO (chat / speak / scan)
 */
export const ONBOARDING_STEPS = [
  {
    id: 'intro',
    layout: 'hero',
    tone: 'focus',
    eyebrow: 'Focus',
    title: 'Start before your brain talks you out of it',
    lead: 'One timer. One task. Zero overwhelm. Take the first step and stay with it.',
    points: [
      { icon: 'clock', text: 'Start a focus session on a single priority' },
      { icon: 'spark', text: 'Pick a sound — silence, study, chill, or rain' },
    ],
    ctaHint: 'Stay with it. Great things take focus.',
  },
  {
    id: 'features',
    layout: 'hero',
    tone: 'plan',
    eyebrow: 'Your day',
    title: 'Your day, simplified',
    lead: 'Everything you need to do, in one place — then break overwhelming tasks into simple first steps.',
    points: [
      { icon: 'calendar', text: 'See timed work and anytime tasks together' },
      { icon: 'check', text: 'Break it down into small, startable steps' },
      { icon: 'bell', text: 'Recurring tasks and reminders so you never forget' },
    ],
    ctaHint: 'Small enough to actually start',
  },
  {
    id: 'personal',
    layout: 'hero',
    tone: 'ai',
    eyebrow: 'FOCO AI',
    title: 'Stuck? Tell FOCO',
    lead: 'Chat it. Speak it. Scan it. FOCO turns what’s on your mind into a task you can begin.',
    points: [
      { icon: 'chat', text: 'Type the task you’re procrastinating on' },
      { icon: 'phone', text: 'Say it out loud — FOCO gets it' },
      { icon: 'note', text: 'Snap a note or list and we’ll handle it' },
    ],
    ctaHint: 'Ready when you are',
  },
];

export const ONBOARDING_TOTAL = ONBOARDING_STEPS.length;
