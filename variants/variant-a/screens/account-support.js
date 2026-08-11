import { navigate } from '../../../js/router.js';
import { APP_CONFIG } from '../../../js/config.js';
import { ABOUT_COPY, FAQ_ITEMS, PRIVACY_SECTIONS, TERMS_SECTIONS } from '../account/content.js';
import { escapeHtml } from '../account/helpers.js';
import { formLabel, showAppToast } from '../auth/helpers.js';
import { getProfile } from '../account/store.js';
import { mountAccountScreen } from '../account/layout.js';
import { iconSvg } from '../components/icons.js';

export function renderAbout(root) {
  const versionLabel = `Version ${APP_CONFIG.latestVersion || APP_CONFIG.appVersion}`;

  mountAccountScreen(root, {
    title: ABOUT_COPY.title,
    eyebrow: 'Support',
    back: 'profile',
    showTabs: false,
    className: 'foco-account--inner',
    bodyHtml: `
      <section class="foco-about-hero">
        <div class="foco-about-hero__glow" aria-hidden="true"></div>
        <img class="foco-logo foco-about-hero__logo" src="${APP_CONFIG.logoUrl}" alt="" width="72" height="69" decoding="async" />
        <p class="foco-about-hero__lead">${escapeHtml(ABOUT_COPY.lead)}</p>
        <p class="foco-about-hero__body">${escapeHtml(ABOUT_COPY.body)}</p>
        <span class="foco-about-hero__chip">${escapeHtml(versionLabel)}</span>
      </section>

      <p class="foco-caption foco-account-section-label">Links</p>
      <div class="foco-account-list">
        <a class="foco-account-row foco-account-row--link" href="${escapeHtml(ABOUT_COPY.website)}" target="_blank" rel="noopener noreferrer">
          <span class="foco-account-row__icon" aria-hidden="true">${iconSvg('doc')}</span>
          <span class="foco-account-row__text">
            <span class="foco-account-row__label">Website</span>
            <span class="foco-caption foco-account-row__sub">tryfoco.com</span>
          </span>
          <span class="foco-account-row__chev" aria-hidden="true">›</span>
        </a>
        <a class="foco-account-row foco-account-row--link" href="mailto:${escapeHtml(ABOUT_COPY.supportEmail)}">
          <span class="foco-account-row__icon" aria-hidden="true">${iconSvg('mail')}</span>
          <span class="foco-account-row__text">
            <span class="foco-account-row__label">Support email</span>
            <span class="foco-caption foco-account-row__sub">${escapeHtml(ABOUT_COPY.supportEmail)}</span>
          </span>
          <span class="foco-account-row__chev" aria-hidden="true">›</span>
        </a>
      </div>
    `,
  });
}

export function renderPrivacy(root) {
  mountAccountScreen(root, {
    title: 'Privacy Policy',
    eyebrow: 'Legal',
    back: 'profile',
    showTabs: false,
    className: 'foco-account--inner',
    bodyHtml: `
      <p class="foco-account-lede">How FOCO collects, uses, and protects your information.</p>
      ${legalSections(PRIVACY_SECTIONS)}
    `,
  });
}

export function renderTerms(root) {
  mountAccountScreen(root, {
    title: 'Terms & Conditions',
    eyebrow: 'Legal',
    back: 'profile',
    showTabs: false,
    className: 'foco-account--inner',
    bodyHtml: `
      <p class="foco-account-lede">The terms that apply when you use FOCO.</p>
      ${legalSections(TERMS_SECTIONS)}
    `,
  });
}

function legalSections(sections) {
  return `
    <div class="foco-legal-stack">
      ${sections
        .map(
          (s, i) => `
      <article class="foco-legal-card">
        <span class="foco-legal-card__index" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
        <div>
          <h2 class="foco-legal-card__title">${escapeHtml(s.title)}</h2>
          <p class="foco-legal-card__body">${escapeHtml(s.body)}</p>
        </div>
      </article>`,
        )
        .join('')}
    </div>`;
}

export function renderFaq(root) {
  mountAccountScreen(root, {
    title: 'FAQ',
    eyebrow: 'Support',
    back: 'profile',
    showTabs: false,
    className: 'foco-account--inner',
    bodyHtml: `
      <p class="foco-account-lede">Quick answers about FOCO, Premium, and your account.</p>
      <div class="foco-faq">
        ${FAQ_ITEMS.map(
          (item, i) => `
        <details class="foco-faq__item" ${i === 0 ? 'open' : ''}>
          <summary class="foco-faq__q">
            <span>${escapeHtml(item.q)}</span>
            <span class="foco-faq__chev" aria-hidden="true"></span>
          </summary>
          <p class="foco-faq__a">${escapeHtml(item.a)}</p>
        </details>`,
        ).join('')}
      </div>
    `,
  });
}

export function renderContact(root) {
  const profile = getProfile();

  mountAccountScreen(root, {
    title: 'Contact Us',
    eyebrow: 'Support',
    back: 'profile',
    showTabs: false,
    className: 'foco-account--inner',
    bodyHtml: `
      <p class="foco-account-lede">We typically respond within one business day to ${escapeHtml(profile.email || 'your account email')}.</p>

      <section class="foco-panel">
        <div class="foco-panel__head">
          <p class="foco-panel__eyebrow">Message</p>
          <h2 class="foco-panel__title">Tell us what you need</h2>
        </div>
        <form class="foco-account-form" id="contact-form">
          <div class="foco-field">
            ${formLabel('contact-topic', 'Topic')}
            <select class="foco-input foco-select" id="contact-topic" name="topic" required>
              <option value="support">Support</option>
              <option value="billing">Billing</option>
              <option value="feedback">Feedback</option>
              <option value="privacy">Privacy</option>
            </select>
          </div>
          <div class="foco-field">
            ${formLabel('contact-msg', 'Message')}
            <textarea class="foco-input foco-textarea" id="contact-msg" name="message" rows="5" required minlength="10" placeholder="Share a bit of context…"></textarea>
          </div>
          <button type="submit" class="foco-btn foco-btn--primary foco-panel__cta" id="contact-submit">Send message</button>
        </form>
      </section>

      <section class="foco-panel foco-panel--note">
        <p class="foco-panel__eyebrow">Email</p>
        <a class="foco-link foco-contact-email" href="mailto:support@tryfoco.app">support@tryfoco.app</a>
      </section>
    `,
    bind(section) {
      section.querySelector('#contact-form')?.addEventListener('submit', (event) => {
        event.preventDefault();
        const btn = section.querySelector('#contact-submit');
        const message = section.querySelector('#contact-msg')?.value?.trim() || '';
        if (message.length < 10) {
          showAppToast('Please add a bit more detail.', { type: 'error' });
          return;
        }
        if (btn) {
          btn.disabled = true;
          btn.textContent = 'Sending…';
        }
        window.setTimeout(() => {
          showAppToast('Message sent. We will follow up soon.');
          navigate('profile');
        }, 700);
      });
    },
  });
}
