/**
 * Variant C presentation shell — desktop iPhone frame + variant switcher.
 * Does not alter C screen UI; only wraps presentation chrome.
 */
import { initDevicePreview } from '/js/device-preview.js';
import { initPreviewControls } from '/js/preview-controls.js';
import { persistVariant } from '/js/variant-manager.js';
import { isStandaloneDisplay } from '/js/pwa.js';

document.documentElement.dataset.variant = 'c';
document.body.dataset.variant = 'c';
persistVariant('c');

document.documentElement.dataset.standalone = String(isStandaloneDisplay());

initDevicePreview();
initPreviewControls();
