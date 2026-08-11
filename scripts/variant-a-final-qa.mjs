/**
 * Variant A route smoke + console error check (393×852).
 * Run: node scripts/variant-a-final-qa.mjs
 * Requires: npm start on :4173, npx puppeteer (downloaded on first run).
 */
import puppeteer from 'puppeteer';

const BASE = 'http://localhost:4173/variant-a/';

const ROUTES = [
  'splash',
  'update',
  'auth',
  'login',
  'signup',
  'verify',
  'forgot-password',
  'profile-completion',
  'onboarding',
  'home',
  'planner',
  'task/new',
  'task/seed-task-1',
  'task/seed-task-1/edit',
  'focus/setup',
  'focus/active',
  'focus/summary',
  'ai',
  'ai/brain-dump',
  'ai/history',
  'stats',
  'profile',
  'settings',
  'settings/password',
  'settings/notifications',
  'settings/preferences',
  'settings/delete',
  'settings/delete/confirm',
  'subscription',
  'subscription/plans',
  'subscription/review',
  'subscription/success',
  'subscription/manage',
  'subscription/restore',
  'about',
  'privacy',
  'terms',
  'faq',
  'contact',
];

function seedAuth(page) {
  return page.evaluate(() => {
    localStorage.setItem('foco.session.authenticated', '1');
    localStorage.setItem('foco.onboarding.complete', '1');
    // Force stable seed tasks for deep-link routes
    localStorage.removeItem('foco.planner.tasks');
  });
}

async function seedFocusSession(page, { completed = false } = {}) {
  const taskId = 'seed-task-1';
  await page.evaluate(
    (id, done) => {
      sessionStorage.setItem('foco.focus.taskId', id);
      const session = {
        taskId: id,
        environment: 'silence',
        totalSeconds: 1500,
        remainingSeconds: done ? 0 : 900,
        elapsedSeconds: done ? 1500 : 600,
        status: done ? 'completed' : 'running',
        completedAt: done ? new Date().toISOString() : null,
      };
      sessionStorage.setItem('foco.focus.session', JSON.stringify(session));
    },
    taskId,
    completed,
  );
  return taskId;
}

async function main() {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 393, height: 852 });

  const consoleErrors = [];
  const pageErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => pageErrors.push(String(err.message || err)));

  await page.goto(BASE, { waitUntil: 'networkidle2', timeout: 60000 });
  await seedAuth(page);

  async function goRoute(route) {
    await page.evaluate((r) => {
      location.hash = `#/${r}`;
    }, route);
    await page.waitForSelector('#screen', { timeout: 8000 });
    await new Promise((r) => setTimeout(r, 120));
  }

  // Warm planner so seed tasks exist
  await goRoute('planner');
  const taskId = 'seed-task-1';

  const routeList = ROUTES;

  const results = [];

  for (const route of routeList) {
    if (route === 'focus/active') {
      await seedFocusSession(page, { completed: false });
    }
    if (route === 'focus/summary') {
      await seedFocusSession(page, { completed: true });
    }
    if (route === 'focus/setup') {
      await page.evaluate(() => {
        sessionStorage.setItem('foco.focus.taskId', 'seed-task-1');
        sessionStorage.removeItem('foco.focus.session');
      });
    }
    const beforeErr = consoleErrors.length;
    try {
      await goRoute(route);
      const screen = await page.$eval('#screen', (el) => ({
        cls: el.className,
        aria: el.getAttribute('aria-label') || '',
        textLen: (el.innerText || '').length,
      }));
      const overflow = await page.evaluate(() => {
        const app = document.getElementById('app');
        const screen = document.getElementById('screen');
        if (!app || !screen) return { ok: false, reason: 'missing #app/#screen' };
        const appRect = app.getBoundingClientRect();
        const bad = [...screen.querySelectorAll('*')].some((node) => {
          const r = node.getBoundingClientRect();
          return r.width > appRect.width + 2 && r.right > appRect.right + 2;
        });
        return { ok: !bad };
      });
      const newErr = consoleErrors.slice(beforeErr);
      results.push({
        route,
        ok: screen.textLen > 0,
        overflow: overflow.ok,
        errors: newErr,
        aria: screen.aria,
      });
    } catch (err) {
      results.push({ route, ok: false, error: String(err.message || err) });
    }
  }

  await browser.close();

  const failed = results.filter((r) => !r.ok || r.errors?.length || r.overflow === false);
  console.log(JSON.stringify({ total: ROUTES.length, failed: failed.length, results, consoleErrors, pageErrors }, null, 2));
  process.exit(failed.length || pageErrors.length ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
