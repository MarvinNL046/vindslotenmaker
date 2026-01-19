import { getAllFacilities, getAllFacilityTypes, createStateSlug, createTypeSlug } from './data';

// Interfaces for footer data
export interface FooterState {
  name: string;
  slug: string;
  count: number;
}

export interface FooterType {
  name: string;
  slug: string;
  count: number;
}

export interface FooterGuide {
  href: string;
  label: string;
  description?: string;
}

// Service types section (Locksmith services)
export const serviceTypes: FooterGuide[] = [
  {
    href: '/type/24-uur-slotenmaker',
    label: '24-uurs Service',
    description: 'Dag en nacht beschikbaar'
  },
  {
    href: '/type/noodopening',
    label: 'Noodopening',
    description: 'Snel hulp bij buitensluiting'
  },
  {
    href: '/type/slot-vervangen',
    label: 'Slot Vervangen',
    description: 'Nieuwe sloten installeren'
  },
  {
    href: '/type/cilinder-vervangen',
    label: 'Cilinder Vervangen',
    description: 'Cilindersloten vernieuwen'
  },
  {
    href: '/type/inbraakpreventie',
    label: 'Inbraakpreventie',
    description: 'Woningbeveiliging advies'
  },
  {
    href: '/type/auto-slotenmaker',
    label: 'Auto Slotenmaker',
    description: 'Autosloten en sleutels'
  }
];

// Locksmith resources section
export const resources: FooterGuide[] = [
  {
    href: '/guides/slotenmaker-kosten',
    label: 'Kosten Slotenmaker',
    description: 'Prijsindicaties en tarieven'
  },
  {
    href: '/guides/skg-sloten',
    label: 'SKG Sloten Uitleg',
    description: 'Veiligheidscertificeringen'
  },
  {
    href: '/guides/inbraakbeveiliging',
    label: 'Inbraakbeveiliging Tips',
    description: 'Uw woning beter beveiligen'
  },
  {
    href: '/guides/buitengesloten',
    label: 'Buitengesloten?',
    description: 'Wat te doen bij noodgeval'
  },
  {
    href: '/guides/sloten-onderhoud',
    label: 'Sloten Onderhoud',
    description: 'Tips voor langere levensduur'
  },
  {
    href: '/guides/slotenmaker-kiezen',
    label: 'Slotenmaker Kiezen',
    description: 'Waar moet u op letten'
  }
];

// Support resources section
export const support: FooterGuide[] = [
  {
    href: '/guides/veelgestelde-vragen',
    label: 'Veelgestelde Vragen',
    description: 'Antwoorden op uw vragen'
  },
  {
    href: '/guides/malafide-slotenmakers',
    label: 'Malafide Slotenmakers',
    description: 'Zo herkent u oplichters'
  },
  {
    href: '/guides/verzekering',
    label: 'Verzekering & Schade',
    description: 'Vergoedingen bij inbraak'
  },
  {
    href: '/guides/politie-aangifte',
    label: 'Aangifte Doen',
    description: 'Na inbraak of poging'
  },
  {
    href: '/guides/huurwoning',
    label: 'Huurwoning Tips',
    description: 'Rechten als huurder'
  }
];

// Static guides content (pillar pages)
export const guides: FooterGuide[] = [
  {
    href: '/guides/diensten-overzicht',
    label: 'Diensten Overzicht',
    description: 'Alle slotenmaker diensten'
  },
  {
    href: '/guides/wat-te-verwachten',
    label: 'Wat te Verwachten',
    description: 'De slotenmaker aan het werk'
  },
  {
    href: '/guides/betaalmethoden',
    label: 'Betaalmethoden',
    description: 'Hoe betaalt u de slotenmaker'
  },
  {
    href: '/guides/certificeringen',
    label: 'Certificeringen',
    description: 'SKG, VEB en keurmerken'
  },
  {
    href: '/guides/succesverhalen',
    label: 'Klantervaringen',
    description: 'Reviews en ervaringen'
  }
];

// Cache for footer data
let statesCacheFooter: FooterState[] | null = null;
let typesCacheFooter: FooterType[] | null = null;

/**
 * Get top provinces by locksmith count
 * @param limit - Maximum number of provinces to return (default 8)
 * @returns Array of provinces sorted by locksmith count (descending)
 */
export async function getTopStatesByFacilityCount(limit: number = 8): Promise<FooterState[]> {
  if (statesCacheFooter && statesCacheFooter.length >= limit) {
    return statesCacheFooter.slice(0, limit);
  }

  try {
    const facilities = await getAllFacilities();

    // Count locksmiths per province
    const stateCounts = new Map<string, number>();

    for (const facility of facilities) {
      if (facility.state && facility.state.trim()) {
        const state = facility.state.trim();
        stateCounts.set(state, (stateCounts.get(state) || 0) + 1);
      }
    }

    // Convert to array and sort by count
    const sortedStates: FooterState[] = Array.from(stateCounts.entries())
      .map(([name, count]) => ({
        name,
        slug: createStateSlug(name),
        count
      }))
      .sort((a, b) => b.count - a.count);

    // Cache the full list
    statesCacheFooter = sortedStates;

    return sortedStates.slice(0, limit);
  } catch (error) {
    console.error('Error getting top provinces:', error);
    return [];
  }
}

/**
 * Get top service types by count
 * @param limit - Maximum number of types to return (default 8)
 * @returns Array of types sorted by locksmith count (descending)
 */
export async function getTopTypesByFacilityCount(limit: number = 8): Promise<FooterType[]> {
  if (typesCacheFooter && typesCacheFooter.length >= limit) {
    return typesCacheFooter.slice(0, limit);
  }

  try {
    const facilities = await getAllFacilities();
    const allTypes = await getAllFacilityTypes();

    // Count locksmiths per type
    const typeCounts = new Map<string, number>();
    const typeNames = new Map<string, string>();

    // Build a lookup for type names
    for (const type of allTypes) {
      typeNames.set(type.slug, type.name);
    }

    for (const facility of facilities) {
      if (facility.type_slug && facility.type_slug.trim()) {
        const typeSlug = facility.type_slug.trim();
        typeCounts.set(typeSlug, (typeCounts.get(typeSlug) || 0) + 1);

        // Store display name if we have it
        if (facility.type && !typeNames.has(typeSlug)) {
          typeNames.set(typeSlug, facility.type);
        }
      } else if (facility.type && facility.type.trim()) {
        const typeSlug = createTypeSlug(facility.type.trim());
        typeCounts.set(typeSlug, (typeCounts.get(typeSlug) || 0) + 1);
        typeNames.set(typeSlug, facility.type.trim());
      }
    }

    // Convert to array and sort by count
    const sortedTypes: FooterType[] = Array.from(typeCounts.entries())
      .map(([slug, count]) => ({
        name: formatTypeName(typeNames.get(slug) || slug),
        slug,
        count
      }))
      .sort((a, b) => b.count - a.count);

    // Cache the full list
    typesCacheFooter = sortedTypes;

    return sortedTypes.slice(0, limit);
  } catch (error) {
    console.error('Error getting top types:', error);
    return [];
  }
}

/**
 * Format type name for display
 */
function formatTypeName(name: string): string {
  // Convert slug-style names to title case
  if (name.includes('-')) {
    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  // Capitalize first letter of each word
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Get all footer data in a single call (for server components)
 */
export async function getFooterData(stateLimit: number = 8, typeLimit: number = 8) {
  const [topStates, topTypes] = await Promise.all([
    getTopStatesByFacilityCount(stateLimit),
    getTopTypesByFacilityCount(typeLimit)
  ]);

  return {
    states: topStates,
    types: topTypes,
    serviceTypes,
    resources,
    support,
    guides
  };
}

/**
 * Clear cache (useful for development/testing)
 */
export function clearFooterCache() {
  statesCacheFooter = null;
  typesCacheFooter = null;
}
