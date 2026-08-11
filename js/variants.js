/**
 * Central variant registry.
 * To add Variant D: add an entry here + create variants/variant-d/variant.css
 */
export const VARIANTS = {
  a: {
    id: 'a',
    name: 'Variant A',
    path: '/variant-a/',
    stylesheet: '/variants/variant-a/variant.css',
    description: 'Premium FOCO Evolution — dark purple brand foundation',
  },
  b: {
    id: 'b',
    name: 'Variant B',
    path: '/variant-b/',
    stylesheet: '/variants/variant-b/variant.css',
    description: 'Soft contrast foundation',
  },
  c: {
    id: 'c',
    name: 'Variant C',
    path: '/variant-c/',
    stylesheet: '/variants/variant-c/variant.css',
    description: 'Warm neutral foundation',
  },
};

export const VARIANT_IDS = Object.keys(VARIANTS);

export function getVariant(id) {
  return VARIANTS[id] || null;
}

export function isValidVariant(id) {
  return Object.prototype.hasOwnProperty.call(VARIANTS, id);
}
