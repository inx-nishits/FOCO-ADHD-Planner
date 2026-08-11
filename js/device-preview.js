/**
 * Desktop vs real-device presentation.
 * Prefer viewport / capability signals over brittle UA sniffing.
 * No manual device/preview mode selector — iPhone frame is automatic on desktop.
 */

export function isCoarsePointer() {
  return window.matchMedia('(pointer: coarse)').matches;
}

export function isNarrowViewport() {
  return window.matchMedia('(max-width: 820px)').matches;
}

export function isTouchPrimaryDevice() {
  return isCoarsePointer() && isNarrowViewport();
}

/**
 * Real phones / installed PWAs never show the iPhone chrome frame.
 * Desktop / laptop presentations always show it.
 */
export function shouldShowDeviceFrame() {
  const standalone =
    document.documentElement.dataset.standalone === 'true' ||
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;

  if (standalone) return false;
  if (isTouchPrimaryDevice()) return false;
  return true;
}

export function applyDeviceFrameVisibility() {
  const showFrame = shouldShowDeviceFrame();
  document.documentElement.dataset.deviceFrame = showFrame ? 'on' : 'off';
  document.documentElement.removeAttribute('data-preview-mode');

  document.dispatchEvent(
    new CustomEvent('deviceframechange', {
      detail: { showFrame },
    }),
  );

  return showFrame;
}

export function initDevicePreview() {
  applyDeviceFrameVisibility();

  const mqNarrow = window.matchMedia('(max-width: 820px)');
  const mqPointer = window.matchMedia('(pointer: coarse)');
  const mqStandalone = window.matchMedia('(display-mode: standalone)');

  const resync = () => applyDeviceFrameVisibility();

  [mqNarrow, mqPointer, mqStandalone].forEach((mq) => {
    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', resync);
    } else if (typeof mq.addListener === 'function') {
      mq.addListener(resync);
    }
  });
}
