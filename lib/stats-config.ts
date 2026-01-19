/**
 * Central Statistics Configuration for VindSlotenmaker.nl
 *
 * Update these values in ONE place when data changes.
 * All components and pages import from here.
 *
 * Last update: 2026-01-19
 * - Setup for Dutch locksmith directory
 */

export const SITE_STATS = {
  // Display values (formatted for UI)
  totalFacilitiesDisplay: '500',  // Estimated locksmiths
  totalFacilitiesExact: 500,

  // Geographic coverage
  totalProvinces: 12,
  totalMunicipalities: 342,    // Dutch gemeenten

  // Dynamic placeholder (when API hasn't loaded yet)
  facilitiesPlaceholder: '500+',

  // Site info
  siteName: 'VindSlotenmaker',
  siteUrl: 'https://www.vindslotenmaker.nl',
  country: 'Nederland',
  countryShort: 'NL',

  // Service type stats
  emergencyServiceCount: 400,
  homeSecurityCount: 350,
  carLockCount: 200,
  safeServiceCount: 100,

  // Service statistics
  averageResponseTime: '15-30 minuten',
  availability24_7: '85%',

  // Top provinces by locksmith count
  topProvinces: {
    noordHolland: 120,
    zuidHolland: 150,
    utrecht: 60,
    noordBrabant: 80,
    gelderland: 50,
  },

  // Service types
  serviceTypesCount: 8,
  totalReviewsDisplay: '5,000+',
} as const;

/**
 * Get formatted stats description for SEO and meta tags
 */
export function getStatsDescription(variant: 'short' | 'long' | 'seo' = 'short'): string {
  switch (variant) {
    case 'short':
      return `Vind slotenmakers in alle ${SITE_STATS.totalProvinces} provincies.`;
    case 'long':
      return `Doorzoek onze uitgebreide database van ${SITE_STATS.totalFacilitiesDisplay}+ slotenmakers voor noodopeningen, slotvervanging en inbraakbeveiliging in alle ${SITE_STATS.totalProvinces} provincies van ${SITE_STATS.country}.`;
    case 'seo':
      return `Vind slotenmakers bij u in de buurt. Zoek op postcode of plaatsnaam. Krijg geverifieerde informatie, beoordelingen en contactgegevens voor slotenmakers in heel ${SITE_STATS.country}.`;
    default:
      return `Vind slotenmakers in alle ${SITE_STATS.totalProvinces} provincies.`;
  }
}

/**
 * Get CTA stats text for blog pages and promotional sections
 */
export function getCtaStatsText(): string {
  return `Zoek direct naar slotenmakers in onze uitgebreide database met meer dan ${SITE_STATS.totalFacilitiesDisplay} bedrijven.`;
}

/**
 * Get FAQ answer about locksmith count
 */
export function getFaqFacilitiesAnswer(): string {
  return `${SITE_STATS.country} heeft ongeveer ${SITE_STATS.totalFacilitiesDisplay} slotenmakers, waaronder noodservice providers, beveiligingsspecialisten en autosleutelmakers. Deze bedrijven zijn verspreid over alle ${SITE_STATS.totalProvinces} provincies en bieden diverse diensten aan.`;
}

/**
 * Get "why us" feature text
 */
export function getComprehensiveDataText(): string {
  return `Informatie over slotenmakers in alle ${SITE_STATS.totalProvinces} provincies met geverifieerde gegevens, diensten en contactinformatie.`;
}

/**
 * Get provinces message for empty province pages
 */
export function getProvincesComingSoonText(): string {
  return `We voegen actief slotenmaker gegevens toe voor alle ${SITE_STATS.totalProvinces} provincies. Kom snel terug voor updates!`;
}

/**
 * Get service statistics text
 */
export function getServiceStatsText(): string {
  return `De meeste slotenmakers zijn binnen ${SITE_STATS.averageResponseTime} ter plaatse. ${SITE_STATS.availability24_7} van de slotenmakers biedt 24/7 spoedservice aan.`;
}
