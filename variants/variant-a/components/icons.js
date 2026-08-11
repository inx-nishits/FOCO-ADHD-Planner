/**
 * FOCO Variant A icon set — Lucide-inspired, consistent 24×24 viewBox.
 * Sized by CSS wells (.foco-ico / parent boxes), not hardcoded width/height.
 */

const ATTR = `viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="foco-ico"`;

export const ICONS = {
  mail: `<svg ${ATTR}><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m4 7.5 8 6 8-6"/></svg>`,

  lock: `<svg ${ATTR}><rect x="5" y="11" width="14" height="10" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/><circle cx="12" cy="16" r="1.15" fill="currentColor" stroke="none"/></svg>`,

  user: `<svg ${ATTR}><circle cx="12" cy="8" r="3.5"/><path d="M5 19.5c1.1-3.4 3.7-5 7-5s5.9 1.6 7 5"/></svg>`,

  bell: `<svg ${ATTR}><path d="M6 9.5a6 6 0 0 1 12 0c0 3.5 1.2 5 2 6.2H4c.8-1.2 2-2.7 2-6.2z"/><path d="M10 18.8a2 2 0 0 0 4 0"/></svg>`,

  gear: `<svg ${ATTR}><circle cx="12" cy="12" r="3"/><path d="M12 3.2v2M12 18.8v2M4.9 6.5l1.4 1.4M17.7 16.1l1.4 1.4M3.2 12h2M18.8 12h2M4.9 17.5l1.4-1.4M17.7 7.9l1.4-1.4"/></svg>`,

  card: `<svg ${ATTR}><rect x="2.5" y="5.5" width="19" height="13" rx="2.5"/><path d="M2.5 10h19"/><path d="M6.5 14.8h5"/></svg>`,

  info: `<svg ${ATTR}><circle cx="12" cy="12" r="9"/><path d="M12 10.6v5"/><circle cx="12" cy="7.6" r="1" fill="currentColor" stroke="none"/></svg>`,

  chat: `<svg ${ATTR}><path d="M7.6 18.4 4 20l.9-3.6A8.5 8.5 0 1 1 12 20.5a8.4 8.4 0 0 1-4.4-2.1z"/><path d="M8.5 11h7M8.5 14h4.2"/></svg>`,

  doc: `<svg ${ATTR}><path d="M7 3.5h7l4.5 4.5V19.5A1.5 1.5 0 0 1 17 21H7a1.5 1.5 0 0 1-1.5-1.5v-15A1.5 1.5 0 0 1 7 3.5z"/><path d="M14 3.5V8h4.5"/><path d="M9 12.5h6.5M9 15.8h6.5M9 19h4"/></svg>`,

  shield: `<svg ${ATTR}><path d="M12 3 19.5 6v5.2c0 4.6-3.1 7.9-7.5 9.5C7.6 19.1 4.5 15.8 4.5 11.2V6L12 3z"/><path d="m9.2 12 1.9 1.9 3.8-3.9"/></svg>`,

  trash: `<svg ${ATTR}><path d="M4 7h16"/><path d="M9.5 7V5.3A1.3 1.3 0 0 1 10.8 4h2.4a1.3 1.3 0 0 1 1.3 1.3V7"/><path d="m8 7 .8 11.2A1.5 1.5 0 0 0 10.3 19.7h3.4a1.5 1.5 0 0 0 1.5-1.5L16 7"/><path d="M10 11.2v5M14 11.2v5"/></svg>`,

  spark: `<svg ${ATTR}><path d="m12 3 1.2 4.2 4.3.3-3.3 2.7 1.1 4.2L12 12.1 8.7 14.4l1.1-4.2-3.3-2.7 4.3-.3L12 3z"/><path d="m18.6 5.2.5 1.8 1.8.1-1.4 1.2.4 1.7-1.5-.9-1.5.9.4-1.7-1.4-1.2 1.8-.1.5-1.8z"/></svg>`,

  calendar: `<svg ${ATTR}><rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M8 3.2v3M16 3.2v3M3.5 10h17"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 17.5h.01M12 17.5h.01"/></svg>`,

  note: `<svg ${ATTR}><path d="M7 3.5h8.2L18.5 7v12.5A1.5 1.5 0 0 1 17 21H7a1.5 1.5 0 0 1-1.5-1.5v-15A1.5 1.5 0 0 1 7 3.5z"/><path d="M15 3.5V7h3.5"/><path d="M9 12h6.5M9 15.5h6.5M9 19h4"/></svg>`,

  check: `<svg ${ATTR}><circle cx="12" cy="12" r="9"/><path d="m8.2 12.2 2.5 2.5 5.2-5.3"/></svg>`,

  logout: `<svg ${ATTR}><path d="M10 4.5H7A2.5 2.5 0 0 0 4.5 7v10A2.5 2.5 0 0 0 7 19.5h3"/><path d="m14 8 4 4-4 4"/><path d="M10 12h8"/></svg>`,

  clock: `<svg ${ATTR}><circle cx="12" cy="12" r="9"/><path d="M12 7.2V12l3.2 2"/></svg>`,

  edit: `<svg ${ATTR}><path d="M12.5 5.5 18 11"/><path d="M4 20h4L18.5 9.5a2.1 2.1 0 0 0-3-3L5 17v3z"/></svg>`,

  restore: `<svg ${ATTR}><path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3"/><path d="M4.5 4.5v4.3H8.8"/></svg>`,

  crown: `<svg ${ATTR}><path d="m4 16.5 2-8 3.5 4L12 5.5l2.5 7 3.5-4 2 8z"/><path d="M5.5 19.5h13"/></svg>`,

  phone: `<svg ${ATTR}><rect x="7.5" y="3.5" width="9" height="17" rx="2.2"/><path d="M10.5 17.8h3"/></svg>`,

  eye: `<svg ${ATTR}><path d="M2.5 12s3.5-6.5 9.5-6.5S21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/></svg>`,

  eyeOff: `<svg ${ATTR}><path d="M3 3l18 18"/><path d="M10.6 10.6a2.8 2.8 0 0 0 3.9 3.9"/><path d="M9.9 5.4A10.4 10.4 0 0 1 12 5.2c6 0 9.5 6.8 9.5 6.8a16.5 16.5 0 0 1-3.1 3.7"/><path d="M6.1 6.1C4.1 7.6 2.5 12 2.5 12S6 18.8 12 18.8c1.1 0 2.1-.2 3-.5"/></svg>`,

  arrowRight: `<svg ${ATTR}><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>`,
};

const ROUTE_ICONS = {
  settings: 'gear',
  'settings/password': 'lock',
  'settings/notifications': 'bell',
  'settings/preferences': 'spark',
  'settings/delete': 'trash',
  subscription: 'crown',
  'subscription/plans': 'crown',
  'subscription/manage': 'card',
  'subscription/restore': 'restore',
  about: 'info',
  faq: 'chat',
  contact: 'mail',
  privacy: 'shield',
  terms: 'doc',
};

export function iconSvg(name) {
  return ICONS[name] || ICONS.spark;
}

export function iconForRoute(route) {
  return iconSvg(ROUTE_ICONS[route] || 'spark');
}

export function fieldIcon(name) {
  return `<span class="foco-field__icon" aria-hidden="true">${iconSvg(name)}</span>`;
}
