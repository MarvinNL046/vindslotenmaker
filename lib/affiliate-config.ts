/**
 * Affiliate Partner Configuratie
 *
 * Voeg hier affiliate partners toe. Zet 'active: true' wanneer u een partner heeft.
 * Advertenties worden alleen getoond wanneer er minstens één actieve partner is.
 */

export interface AffiliatePartner {
  id: string;
  name: string;
  description: string;
  url: string;
  imageUrl?: string;
  buttonText: string;
  active: boolean;
  // Optionele tracking parameters
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

export const affiliatePartners: AffiliatePartner[] = [
  {
    id: 'beveiligingssloten',
    name: 'Beveiligingssloten Vergelijken',
    description: 'Vergelijk SKG-gecertificeerde sloten van topmerken en vind de beste prijs voor uw voordeur.',
    url: 'https://example.com/beveiligingssloten',
    imageUrl: '/images/affiliates/beveiligingssloten.png',
    buttonText: 'Vergelijk nu',
    active: false, // Zet op true wanneer u een partner heeft
    utmSource: 'vindslotenmaker',
    utmMedium: 'sidebar',
    utmCampaign: 'beveiligingssloten',
  },
  {
    id: 'smart-locks',
    name: 'Slimme Sloten Shop',
    description: 'Ontdek de nieuwste smart locks en elektronische sloten voor uw woning of bedrijf.',
    url: 'https://example.com/smart-locks',
    imageUrl: '/images/affiliates/smart-locks.png',
    buttonText: 'Bekijk aanbod',
    active: false,
    utmSource: 'vindslotenmaker',
    utmMedium: 'sidebar',
    utmCampaign: 'smart-locks',
  },
  {
    id: 'inbraakbeveiliging',
    name: 'Complete Woningbeveiliging',
    description: 'Van alarmsystemen tot camera\'s: alles voor een veilig huis op één plek.',
    url: 'https://example.com/inbraakbeveiliging',
    imageUrl: '/images/affiliates/inbraakbeveiliging.png',
    buttonText: 'Meer info',
    active: false,
    utmSource: 'vindslotenmaker',
    utmMedium: 'sidebar',
    utmCampaign: 'inbraakbeveiliging',
  },
  {
    id: 'kluizen',
    name: 'Kluizen Vergelijker',
    description: 'Vind de perfecte kluis voor uw waardevolle bezittingen. Van inbouwkluizen tot brandwerende modellen.',
    url: 'https://example.com/kluizen',
    imageUrl: '/images/affiliates/kluizen.png',
    buttonText: 'Vergelijk kluizen',
    active: false,
    utmSource: 'vindslotenmaker',
    utmMedium: 'sidebar',
    utmCampaign: 'kluizen',
  },
  {
    id: 'autosleutels',
    name: 'Autosleutels Service',
    description: 'Reservesleutel nodig? Vergelijk prijzen voor autosleutels van alle merken.',
    url: 'https://example.com/autosleutels',
    imageUrl: '/images/affiliates/autosleutels.png',
    buttonText: 'Prijzen bekijken',
    active: false,
    utmSource: 'vindslotenmaker',
    utmMedium: 'sidebar',
    utmCampaign: 'autosleutels',
  },
];

/**
 * Helper functie om actieve partners op te halen
 */
export function getActivePartners(): AffiliatePartner[] {
  return affiliatePartners.filter(partner => partner.active);
}

/**
 * Helper functie om te controleren of er actieve partners zijn
 */
export function hasActivePartners(): boolean {
  return affiliatePartners.some(partner => partner.active);
}

/**
 * Helper functie om affiliate URL met UTM parameters te bouwen
 */
export function buildAffiliateUrl(partner: AffiliatePartner): string {
  const url = new URL(partner.url);

  if (partner.utmSource) {
    url.searchParams.set('utm_source', partner.utmSource);
  }
  if (partner.utmMedium) {
    url.searchParams.set('utm_medium', partner.utmMedium);
  }
  if (partner.utmCampaign) {
    url.searchParams.set('utm_campaign', partner.utmCampaign);
  }

  return url.toString();
}
