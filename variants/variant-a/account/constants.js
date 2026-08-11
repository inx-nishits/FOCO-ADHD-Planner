export const STORAGE_ACCOUNT = 'foco.account.profile';
export const STORAGE_SUBSCRIPTION = 'foco.account.subscription';
export const STORAGE_SETTINGS = 'foco.account.settings';
export const STORAGE_SESSION = 'foco.session.authenticated';

export const PLANS = {
  free: {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: '',
    tagline: 'One task. Full focus. Start small.',
  },
  monthly: {
    id: 'monthly',
    name: 'Premium Monthly',
    price: '$9.99',
    period: '/ month',
    tagline: 'Unlimited AI help when you’re stuck',
  },
  annual: {
    id: 'annual',
    name: 'Premium Annual',
    price: '$79.99',
    period: '/ year',
    tagline: 'Best value — never forget, stay in flow',
    badge: 'Popular',
  },
};

/** Freemium matrix (requirements-aligned — do not invent new limits) */
export const FEATURE_MATRIX = [
  { feature: 'Daily planner & anytime tasks', free: true, premium: true },
  { feature: 'Focus Mode — one timer, one task', free: true, premium: true },
  { feature: 'Break it down into first steps', free: true, premium: true },
  { feature: 'Recurring tasks & reminders', free: true, premium: true },
  { feature: 'AI chat — tell FOCO what’s stuck', free: 'Limited / day', premium: 'Unlimited', highlight: true },
  { feature: 'Chat it · Speak it · Scan it', free: 'Limited', premium: 'Unlimited', highlight: true },
  { feature: 'AI-generated subtasks', free: '3 / day', premium: 'Unlimited', highlight: true },
  { feature: 'AI daily planning', free: 'No', premium: 'Yes', highlight: true },
  { feature: 'AI task editing via chat', free: 'No', premium: 'Yes' },
  { feature: 'AI prioritization', free: 'No', premium: 'Yes', highlight: true },
  { feature: 'Category analytics', free: 'No', premium: 'Yes' },
  { feature: 'Weekly & monthly reports', free: 'No', premium: 'Yes' },
  { feature: 'Smart reminder suggestions', free: 'No', premium: 'Yes' },
  { feature: 'Focus environments (Silence → Rainy)', free: 'Silence + Study', premium: 'All 5', highlight: true },
  { feature: 'Stats — today / week / all time', free: 'Basic overview', premium: 'Advanced analytics', highlight: true },
];

export const PRICING = {
  monthly: { amount: '$9.99', cadence: 'Billed monthly. Cancel anytime.' },
  annual: { amount: '$79.99', cadence: 'Billed once per year. Cancel anytime.' },
};
