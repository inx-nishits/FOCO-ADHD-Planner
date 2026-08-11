/**
 * Variant B icon set — Lucide-inspired, consistent 24×24 viewBox.
 */

const ATTR = `viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="b-ico"`;

export const ICONS = {
  mail: `<svg ${ATTR}><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m4 7.5 8 6 8-6"/></svg>`,
  lock: `<svg ${ATTR}><rect x="5" y="11" width="14" height="10" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/><circle cx="12" cy="16" r="1.15" fill="currentColor" stroke="none"/></svg>`,
  user: `<svg ${ATTR}><circle cx="12" cy="8" r="3.5"/><path d="M5 19.5c1.1-3.4 3.7-5 7-5s5.9 1.6 7 5"/></svg>`,
  eye: `<svg ${ATTR}><path d="M2.5 12s3.5-6.5 9.5-6.5S21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/></svg>`,
  eyeOff: `<svg ${ATTR}><path d="M3 3l18 18"/><path d="M10.6 10.6a2.8 2.8 0 0 0 3.9 3.9"/><path d="M9.9 5.4A10.4 10.4 0 0 1 12 5.2c6 0 9.5 6.8 9.5 6.8a16.5 16.5 0 0 1-3.1 3.7"/><path d="M6.1 6.1C4.1 7.6 2.5 12 2.5 12S6 18.8 12 18.8c1.1 0 2.1-.2 3-.5"/></svg>`,
  spark: `<svg ${ATTR}><path d="m12 3 1.2 4.2 4.3.3-3.3 2.7 1.1 4.2L12 12.1 8.7 14.4l1.1-4.2-3.3-2.7 4.3-.3L12 3z"/></svg>`,
  calendar: `<svg ${ATTR}><rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M8 3.5v3M16 3.5v3M3.5 10h17"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 17.5h.01M12 17.5h.01"/></svg>`,
  target: `<svg ${ATTR}><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/></svg>`,
  message: `<svg ${ATTR}><path d="M5.5 18.5 4 21l3-1.2A8.8 8.8 0 0 0 12 21c4.7 0 8.5-3.4 8.5-7.5S16.7 6 12 6 3.5 9.4 3.5 13.5c0 1.6.5 3.1 1.4 4.3z"/><path d="M8.5 12.5h.01M12 12.5h.01M15.5 12.5h.01"/></svg>`,
  list: `<svg ${ATTR}><path d="M9 7h11M9 12h11M9 17h11"/><circle cx="5" cy="7" r="1.15" fill="currentColor" stroke="none"/><circle cx="5" cy="12" r="1.15" fill="currentColor" stroke="none"/><circle cx="5" cy="17" r="1.15" fill="currentColor" stroke="none"/></svg>`,
  bell: `<svg ${ATTR}><path d="M7 17h10l-.8-1.3a6.4 6.4 0 0 1-1-3.4V10a4.2 4.2 0 1 0-8.4 0v2.3c0 1.2-.35 2.4-1 3.4L7 17z"/><path d="M10 17.2a2 2 0 0 0 4 0"/></svg>`,
  shield: `<svg ${ATTR}><path d="M12 3.5 19 6.5v5.2c0 4.4-2.9 7.4-7 8.8-4.1-1.4-7-4.4-7-8.8V6.5L12 3.5z"/><path d="m9.2 12 1.9 1.9 3.7-3.8"/></svg>`,
  inbox: `<svg ${ATTR}><path d="M4 13.5 6.2 5.8A2 2 0 0 1 8.1 4.5h7.8a2 2 0 0 1 1.9 1.3L20 13.5"/><path d="M4 13.5h4.2l1.3 2.2h5l1.3-2.2H20V18a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4.5z"/></svg>`,
};

export function iconSvg(name) {
  return ICONS[name] || ICONS.spark;
}

export function fieldIcon(name) {
  return `<span class="b-field__icon" aria-hidden="true">${iconSvg(name)}</span>`;
}
