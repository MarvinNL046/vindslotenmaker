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
}
