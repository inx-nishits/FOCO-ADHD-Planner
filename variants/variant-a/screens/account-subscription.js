import { navigate } from '../../../js/router.js';
import { FEATURE_MATRIX, PLANS, PRICING } from '../account/constants.js';
import { escapeHtml, getHashParam } from '../account/helpers.js';
import {
  cancelPendingChange,
  getPendingPlan,
  getSubscription,
  restorePurchasesMock,
  scheduleDowngrade,
  setPendingPlan,
  upgradeToPlan,
} from '../account/store.js';
import { mountAccountScreen, settingsRow, bindSettingsRows } from '../account/layout.js';

function planLabel(id) {
  return PLANS[id]?.name || 'Free';
}

export function renderSubscriptionHome(root) {
  const sub = getSubscription();
  const plan = PLANS[sub.planId] || PLANS.free;

  mountAccountScreen(root, {
    title: 'Subscription',
    eyebrow: 'Account',
    back: 'profile',
    showTabs: false,
    className: 'foco-account--inner',
    bodyHtml: `
      <section class="foco-sub-hero">
        <div class="foco-sub-hero__glow" aria-hidden="true"></div>
        <p class="foco-panel__eyebrow">Current plan</p>
        <h2 class="foco-sub-hero__name">${escapeHtml(plan.name)}</h2>
        <p class="foco-sub-hero__tagline">${escapeHtml(plan.tagline)}</p>
        ${sub.renewsAt ? `<p class="foco-caption foco-sub-hero__meta">Renews ${escapeHtml(new Date(sub.renewsAt).toLocaleDateString())}</p>` : ''}
        ${sub.pendingChange ? `<p class="foco-caption foco-sub-pending">Downgrade scheduled for end of period</p>` : ''}
      </section>

      <p class="foco-caption foco-account-section-label">Plan actions</p>
      <div class="foco-account-list">
        ${sub.planId === 'free' ? settingsRow('Upgrade to Premium', 'Compare plans and unlock more', 'subscription/plans') : ''}
        ${sub.planId !== 'free' ? settingsRow('Manage subscription', 'Renew, change, or cancel', 'subscription/manage') : ''}
        ${settingsRow('Restore purchases', 'App Store or Google Play', 'subscription/restore')}
      </div>

      ${renderFeatureTable()}
    `,
    bind: bindSettingsRows,
  });
}

export function renderSubscriptionPlans(root) {
  mountAccountScreen(root, {
    title: 'Choose Premium',
    eyebrow: 'Subscription',
    back: 'subscription',
    showTabs: false,
    className: 'foco-account--inner',
    bodyHtml: `
      <p class="foco-account-lede">Clear pricing. Cancel anytime. No hidden fees in this prototype.</p>
      <div class="foco-sub-plans">
        ${planCard('monthly')}
        ${planCard('annual')}
      </div>
      ${renderFeatureTable()}
    `,
    bind(section) {
      section.querySelectorAll('[data-select-plan]').forEach((btn) => {
        btn.addEventListener('click', () => {
          setPendingPlan(btn.dataset.selectPlan);
          navigate(`subscription/review?plan=${btn.dataset.selectPlan}`);
        });
      });
    },
  });
}

function planCard(id) {
  const p = PLANS[id];
  const price = PRICING[id];
  return `
    <article class="foco-sub-plan ${id === 'annual' ? 'foco-sub-plan--highlight' : ''}">
      ${p.badge ? `<span class="foco-chip foco-sub-plan__badge">${escapeHtml(p.badge)}</span>` : ''}
      <h3 class="foco-sub-plan__name">${escapeHtml(p.name)}</h3>
      <p class="foco-sub-plan__price">${escapeHtml(p.price)}<span>${escapeHtml(p.period)}</span></p>
      <p class="foco-caption">${escapeHtml(price.cadence)}</p>
      <button type="button" class="foco-btn foco-btn--primary" data-select-plan="${id}">Select</button>
    </article>`;
}

export function renderSubscriptionReview(root) {
  const planId = getHashParam('plan') || getPendingPlan();
  setPendingPlan(planId);
  const p = PLANS[planId];
  const price = PRICING[planId];

  mountAccountScreen(root, {
    title: 'Review',
    eyebrow: 'Subscription',
    back: 'subscription/plans',
    showTabs: false,
    className: 'foco-account--inner',
    bodyHtml: `
      <section class="foco-panel foco-sub-review">
        <div class="foco-panel__head">
          <p class="foco-panel__eyebrow">Selected</p>
          <h2 class="foco-panel__title">${escapeHtml(p.name)}</h2>
        </div>
        <p class="foco-sub-plan__price">${escapeHtml(p.price)}<span>${escapeHtml(p.period)}</span></p>
        <p class="foco-body-secondary">${escapeHtml(price.cadence)}</p>
        <ul class="foco-sub-review__list">
          <li>Unlimited AI messages &amp; subtasks</li>
          <li>All focus environments</li>
          <li>Advanced analytics &amp; planning</li>
          <li>Full voice experience</li>
        </ul>
        <button type="button" class="foco-btn foco-btn--primary foco-panel__cta" id="sub-upgrade">Confirm upgrade</button>
        <p class="foco-caption foco-sub-legal">Payment processing is simulated. No charge will occur.</p>
      </section>
    `,
    bind(section) {
      section.querySelector('#sub-upgrade')?.addEventListener('click', () => {
        upgradeToPlan(planId);
        navigate('subscription/success', { replace: true });
      });
    },
  });
}

export function renderSubscriptionSuccess(root) {
  const sub = getSubscription();
  mountAccountScreen(root, {
    title: 'Welcome to Premium',
    eyebrow: 'Subscription',
    back: 'profile',
    showTabs: false,
    className: 'foco-account--inner',
    bodyHtml: `
      <section class="foco-sub-success">
        <div class="foco-sub-success__mark" aria-hidden="true">✓</div>
        <h2 class="foco-sub-success__title">You're on ${escapeHtml(planLabel(sub.planId))}</h2>
        <p class="foco-body-secondary">Premium features are now active in this prototype.</p>
      </section>
      <div class="foco-account-stack">
        <button type="button" class="foco-btn foco-btn--primary" data-go="subscription/manage">Manage subscription</button>
        <button type="button" class="foco-btn foco-btn--secondary" data-go="profile">Back to profile</button>
      </div>
    `,
    bind: bindSettingsRows,
  });
}

export function renderSubscriptionManage(root) {
  const sub = getSubscription();
  mountAccountScreen(root, {
    title: 'Manage subscription',
    eyebrow: 'Subscription',
    back: 'subscription',
    showTabs: false,
    className: 'foco-account--inner',
    bodyHtml: `
      <section class="foco-sub-hero foco-sub-hero--compact">
        <p class="foco-panel__eyebrow">Active plan</p>
        <h2 class="foco-sub-hero__name">${escapeHtml(planLabel(sub.planId))}</h2>
        ${sub.renewsAt ? `<p class="foco-caption foco-sub-hero__meta">Renews ${escapeHtml(new Date(sub.renewsAt).toLocaleDateString())}</p>` : ''}
      </section>

      <p class="foco-caption foco-account-section-label">Plan options</p>
      <div class="foco-account-list">
        ${sub.planId !== 'annual' ? settingsRow('Upgrade to Annual', 'Save vs monthly', 'subscription/plans') : ''}
        ${sub.planId !== 'monthly' ? settingsRow('Switch to Monthly', 'Flexible billing', 'subscription/plans') : ''}
      </div>

      ${sub.pendingChange ? `<p class="foco-caption foco-sub-pending">Downgrade to Free is scheduled.</p>` : ''}
      <button type="button" class="foco-btn foco-btn--ghost foco-account-row--danger" id="sub-downgrade">${sub.pendingChange ? 'Keep Premium' : 'Schedule downgrade to Free'}</button>
    `,
    bind(section) {
      bindSettingsRows(section);
      section.querySelector('#sub-downgrade')?.addEventListener('click', () => {
        if (sub.pendingChange) {
          cancelPendingChange();
          renderSubscriptionManage(root);
          return;
        }
        if (window.confirm('Downgrade to Free at end of billing period?')) {
          scheduleDowngrade();
          renderSubscriptionManage(root);
        }
      });
    },
  });
}

export function renderSubscriptionRestore(root) {
  mountAccountScreen(root, {
    title: 'Restore purchases',
    eyebrow: 'Subscription',
    back: 'subscription',
    showTabs: false,
    className: 'foco-account--inner',
    bodyHtml: `
      <section class="foco-panel">
        <div class="foco-panel__head">
          <p class="foco-panel__eyebrow">App stores</p>
          <h2 class="foco-panel__title">Restore Premium</h2>
        </div>
        <p class="foco-body-secondary">Restore Premium from your App Store or Google Play account (simulated).</p>
        <button type="button" class="foco-btn foco-btn--primary foco-panel__cta" id="restore-btn">Restore purchases</button>
        <p class="foco-account-restore-result foco-body-secondary" id="restore-result" role="status" hidden></p>
      </section>
    `,
    bind(section) {
      section.querySelector('#restore-btn')?.addEventListener('click', async () => {
        const btn = section.querySelector('#restore-btn');
        const out = section.querySelector('#restore-result');
        btn.disabled = true;
        btn.textContent = 'Restoring…';
        await new Promise((r) => setTimeout(r, 1200));
        const res = restorePurchasesMock();
        out.hidden = false;
        out.textContent = res.message;
        btn.disabled = false;
        btn.textContent = 'Restore purchases';
      });
    },
  });
}

function renderFeatureTable() {
  return `
    <section class="foco-sub-matrix">
      <div class="foco-sub-matrix__head">
        <div class="foco-sub-matrix__head-copy">
          <p class="foco-sub-matrix__eyebrow foco-caption">Compare</p>
          <h3 class="foco-h3">Free vs Premium</h3>
          <p class="foco-sub-matrix__lede foco-body-secondary">See what unlocks when you upgrade.</p>
        </div>
        <span class="foco-sub-matrix__badge">Premium</span>
      </div>
      <div class="foco-sub-matrix__scroll">
        <table class="foco-sub-table">
          <thead>
            <tr>
              <th>Feature</th>
              <th>Free</th>
              <th class="foco-sub-table__premium">Premium</th>
            </tr>
          </thead>
          <tbody>
            ${FEATURE_MATRIX.map(
              (row) => `
            <tr class="${row.highlight ? 'foco-sub-table__row--highlight' : ''}">
              <th scope="row">${escapeHtml(row.feature)}${row.highlight ? '<span class="foco-sub-table__star" aria-hidden="true">★</span>' : ''}</th>
              <td>${formatCell(row.free, false)}</td>
              <td class="foco-sub-table__premium">${formatCell(row.premium, true)}</td>
            </tr>`,
            ).join('')}
          </tbody>
        </table>
      </div>
    </section>`;
}

function formatCell(v, premium) {
  if (v === true) {
    return `<span class="foco-sub-cell ${premium ? 'foco-sub-cell--premium-yes' : 'foco-sub-cell--yes'}">✓</span>`;
  }
  if (v === false || v === 'No') {
    return `<span class="foco-sub-cell foco-sub-cell--no">–</span>`;
  }
  const text = escapeHtml(String(v));
  if (premium) {
    return `<span class="foco-sub-cell foco-sub-cell--premium-text">${text}</span>`;
  }
  return `<span class="foco-sub-cell foco-sub-cell--muted">${text}</span>`;
}
