export function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function parseAccountRoute(route) {
  if (route === 'profile') return { view: 'profile' };
  if (route === 'settings') return { view: 'settings' };
  if (route === 'settings/password') return { view: 'password' };
  if (route === 'settings/notifications') return { view: 'notifications' };
  if (route === 'settings/preferences') return { view: 'preferences' };
  if (route === 'settings/delete') return { view: 'delete' };
  if (route === 'settings/delete/confirm') return { view: 'deleteConfirm' };

  if (route === 'subscription') return { view: 'subscription' };
  if (route === 'subscription/plans') return { view: 'subPlans' };
  if (route === 'subscription/review') return { view: 'subReview' };
  if (route === 'subscription/success') return { view: 'subSuccess' };
  if (route === 'subscription/manage') return { view: 'subManage' };
  if (route === 'subscription/restore') return { view: 'subRestore' };

  if (route === 'about') return { view: 'about' };
  if (route === 'privacy') return { view: 'privacy' };
  if (route === 'terms') return { view: 'terms' };
  if (route === 'faq') return { view: 'faq' };
  if (route === 'contact') return { view: 'contact' };

  return { view: 'unknown' };
}

export function getHashParam(name) {
  const hash = window.location.hash || '';
  const qs = hash.split('?')[1] || '';
  return new URLSearchParams(qs).get(name);
}
