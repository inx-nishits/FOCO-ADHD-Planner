/**
 * Fresh-user + core route health check for Variant A.
 */
import puppeteer from 'puppeteer';

const BASE = 'http://localhost:4173/variant-a/';

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 393, height: 852 });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(m.text());
});

async function info() {
  return page.evaluate(() => ({
    hash: location.hash,
    aria: document.getElementById('screen')?.getAttribute('aria-label') || '',
    cls: document.getElementById('screen')?.className || '',
  }));
}

async function goRoute(route) {
  await page.evaluate((r) => {
    location.hash = `#/${r}`;
  }, route);
  await new Promise((r) => setTimeout(r, 250));
}

await page.goto(BASE, { waitUntil: 'networkidle2', timeout: 45000 });
await page.evaluate(() => {
  localStorage.clear();
  sessionStorage.clear();
});

// Reload so splash boots with a clean guest session
await page.goto(BASE, { waitUntil: 'networkidle2' });
await page.waitForSelector('.foco-splash, #screen', { timeout: 8000 });
const onSplash = await info();
await new Promise((r) => setTimeout(r, 3600));
const afterSplash = await info();

// Onboarding: advance 3 slides
for (let i = 0; i < 3; i++) {
  const advanced = await page.evaluate(() => {
    const btn = document.querySelector('#onboarding-next');
    if (!btn) return false;
    btn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
    return true;
  });
  if (!advanced) break;
  await new Promise((r) => setTimeout(r, 450));
}
const afterOnboarding = await info();

const wentLogin = await page.evaluate(() => {
  const emailBtn = document.querySelector('#auth-email');
  if (!emailBtn) return false;
  emailBtn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
  return true;
});
if (wentLogin) await new Promise((r) => setTimeout(r, 400));
const afterLogin = await info();

// Direct route checks without auth (should redirect sanely) — in-page hash, not full reload
const routeChecks = [];
for (const route of ['onboarding', 'planner', 'ai', 'stats', 'profile', 'focus/setup', 'task/new']) {
  await goRoute(route);
  routeChecks.push({ route, ...(await info()) });
}

console.log(
  JSON.stringify(
    {
      onSplash,
      afterSplash,
      afterOnboarding,
      afterLogin,
      routeChecks,
      errors,
    },
    null,
    2,
  ),
);

await browser.close();
