/**
 * Minimal placeholder renderer for Variant B.
 *
 * Purpose: keep Variant B route wiring intact while Variant B UI is "emptied"
 * so the user can re-implement from a clean baseline without broken imports.
 */
export function renderEmpty(root, { route } = {}) {
  root.replaceChildren();

  const section = document.createElement('section');
  section.id = 'screen';
  section.className = 'app-screen';
  section.setAttribute('aria-label', 'Variant B placeholder');

  const label = route ? `#/${route}` : '#/splash';

  section.innerHTML = `
    <div style="height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:24px;text-align:center;">
      <div style="font-size:28px;line-height:1.1;font-weight:800;letter-spacing:-0.02em;">
        Variant B is empty
      </div>
      <div style="color:var(--app-text-secondary);max-width:420px;">
        This placeholder keeps the app working while you reset Variant B UI.
        Current route: <span style="font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;">${escapeHtml(
          label,
        )}</span>
      </div>
      <div style="margin-top:8px;color:var(--app-text-secondary);font-size:13px;">
        Next: rebuild Variant B screens, CSS, and motion.
      </div>
    </div>
  `;

  root.appendChild(section);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

