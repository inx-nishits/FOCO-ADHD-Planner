/**
 * Sync root index.html into variant entry folders and 404.html.
 * Run after editing index.html:
 *   node scripts/sync-entries.js
 *
 * Variant folders exist so static hosts without rewrites
 * (e.g. basic file servers, GitHub Pages) still serve /variant-a/ etc.
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const source = path.join(root, 'index.html');
/**
 * Keep in sync when adding shared-shell variants (also update js/variants.js + hosting rewrites).
 * Variant C and D are standalone apps — do not overwrite their index.html.
 */
const variantFolders = ['variant-a', 'variant-b'];

const targets = [
  ...variantFolders.map((folder) => path.join(root, folder, 'index.html')),
  path.join(root, '404.html'),
];

if (!fs.existsSync(source)) {
  console.error('Missing index.html');
  process.exit(1);
}

const html = fs.readFileSync(source, 'utf8');
for (const target of targets) {
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, html);
  console.log('synced', path.relative(root, target));
}
