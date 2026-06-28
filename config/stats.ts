/**
 * Dashboard & Homepage Statistics Configuration
 * 
 * Edit values here to update them across the entire site.
 * No need to touch any UI component files.
 */

export const SITE_STATS = {
  /** Total number of products available */
  productsCount: 200,

  /** Total clients/users served */
  clientsServed: 2000,

  /** Years of experience */
  experienceYears: 7,
} as const;

/**
 * Format a number for display:
 * - 1000+ becomes "1k"
 * - 1500 becomes "1.5k"
 * - Numbers below 1000 stay as-is
 */
export function formatStatNumber(value: number): string {
  if (value >= 1000) {
    const k = value / 1000;
    // Show decimal only if not a whole number
    return k % 1 === 0 ? `${k}k` : `${k.toFixed(1).replace(/\.0$/, '')}k`;
  }
  return value.toString();
}

/**
 * Pre-formatted stats ready for UI rendering.
 * These are computed from SITE_STATS above.
 */
export const DISPLAY_STATS = {
  products: {
    value: `${formatStatNumber(SITE_STATS.productsCount)}+`,
    label: 'Products',
  },
  clients: {
    value: `${formatStatNumber(SITE_STATS.clientsServed)}+`,
    label: 'Clients Served',
  },
  experience: {
    value: `${SITE_STATS.experienceYears}+`,
    label: 'Years Experience',
  },
} as const;
