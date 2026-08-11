export function parseAccountRoute(route) {
  const flat = {
    profile: 'profile',
    settings: 'settings',
    password: 'password',
    notifications: 'notifications',
    preferences: 'preferences',
    delete: 'delete',
    deleteConfirm: 'deleteConfirm',
    subscription: 'subscription',
    subPlans: 'subPlans',
    subReview: 'subReview',
    subSuccess: 'subSuccess',
    subManage: 'subManage',
    subRestore: 'subRestore',
    about: 'about',
    privacy: 'privacy',
    terms: 'terms',
    faq: 'faq',
    contact: 'contact',
  };

  if (flat[route]) return { view: flat[route] };

  if (route === 'settings/password') return { view: 'password' };
  if (route === 'settings/notifications') return { view: 'notifications' };
  if (route === 'settings/preferences') return { view: 'preferences' };
  if (route === 'settings/delete') return { view: 'delete' };
  if (route === 'settings/delete/confirm') return { view: 'deleteConfirm' };
  if (route === 'subscription/plans') return { view: 'subPlans' };
  if (route === 'subscription/review') return { view: 'subReview' };
  if (route === 'subscription/success') return { view: 'subSuccess' };
  if (route === 'subscription/manage') return { view: 'subManage' };
  if (route === 'subscription/restore') return { view: 'subRestore' };

  return { view: 'unknown' };
}
