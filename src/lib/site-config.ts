export type MarketplaceNiche =
  | "zonnepanelen" | "warmtepomp" | "cv_ketel" | "waterontharder"
  | "isolatie" | "kozijnen" | "laadpaal" | "ventilatie" | "airco"
  | "vloerverwarming" | "thuisbatterij" | "alarmsysteem" | "asbest"
  | "gietvloer" | "verbouwing" | "traprenovatie" | "dakkapel"
  | "vochtbestrijding" | "badkamer_verbouwen" | "aanbouw" | "gevelwerk"
  | "verhuizen" | "dakdekker" | "stukadoor" | "schilder" | "elektricien"
  | "ongedierte" | "glaszetter" | "tegelzetter" | "timmerman"
  | "loodgieter" | "architect" | "glazenwasser" | "zonwering"
  | "tuinadvies" | "hovenier" | "stratenmaker" | "serre" | "garagedeur"
  | "hekwerk" | "carport" | "veranda";

export interface ServiceItem {
  title: string;
  description: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

/** Airco-Limburg sites have pricing tables, factor cards, checklists etc. —
 * content that doesn't fit the generic vind-* finder template. Optional
 * `pricingPreview` block on SiteConfig carries that data for sites that
 * opt into the pricing-focused page layout. */
export interface PricingPreviewRow {
  title: string;
  subtitle: string;
  priceRange: string;
  bullets: string[];
  highlight?: boolean;
}

export interface FactorCard {
  title: string;
  body: string;
}

export interface ChecklistItem {
  title: string;
  body: string;
}

export interface OutboundLink {
  href: string;
  title: string;
  description: string;
  label: string;
}

export interface SiteConfig {
  domain: string;
  siteName: string;
  primaryKeyword: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  heroIntro: string;
  heroUsps: string[];
  services: ServiceItem[];
  whyUsBullets: string[];
  howItWorks: { step: string; title: string; description: string }[];
  faq: FaqItem[];
  ctaVariants: { primary: string; secondary: string };
  niche: MarketplaceNiche;
  serviceTypeLabel: string;
  /** Optional metadata forwarded to LeadFlow intake (for niches without a dedicated marketplace category) */
  extraMetadata?: Record<string, unknown>;
  /** Tailwind accent palette — hex for CSS vars */
  accent: { 600: string; 700: string; 50: string };
  /** Regional / national positioning */
  region: "national" | string;
  privacyContactEmail: string;
  /** Optional — only for pricing-focused hub sites (e.g. aircooffertelimburg) */
  pricingPreview?: {
    intro: string;
    rows: PricingPreviewRow[];
    footnote?: string;
  };
  /** Optional — factor cards explaining what drives the price */
  priceFactors?: {
    intro: string;
    cards: FactorCard[];
  };
  /** Optional — offerte-checklist block */
  offerteChecklist?: {
    intro: string;
    items: ChecklistItem[];
  };
  /** Optional — outbound portfolio link block (cross-domain) */
  outboundLinks?: {
    heading: string;
    intro: string;
    links: OutboundLink[];
  };
  /** Optional — hero ranges array, if rendering the pricing hero variant */
  heroPriceRanges?: Array<{ label: string; range: string }>;
}
