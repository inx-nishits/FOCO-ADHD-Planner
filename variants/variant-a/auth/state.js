/**
 * UI-only auth flow context (no backend).
 */
export const authContext = {
  email: '',
  firstName: '',
  lastName: '',
  /** Set when entering via Google mock */
  fromGoogle: false,
};

export function setAuthEmail(email) {
  authContext.email = String(email || '').trim();
}

export function resetAuthContext() {
  authContext.email = '';
  authContext.firstName = '';
  authContext.lastName = '';
  authContext.fromGoogle = false;
}

/** Routes reserved for post-auth onboarding */
export const ROUTE_ONBOARDING = 'onboarding';
