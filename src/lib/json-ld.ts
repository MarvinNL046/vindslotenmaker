import type { SiteConfig } from "./site-config";

export function serviceJsonLd(cfg: SiteConfig, siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: cfg.siteName,
    serviceType: cfg.serviceTypeLabel,
    provider: {
      "@type": "Organization",
      name: cfg.siteName,
      url: siteUrl,
    },
    areaServed: {
      "@type": "Country",
      name: "Netherlands",
    },
    description: cfg.metaDescription,
    url: siteUrl,
  };
}

export function faqJsonLd(cfg: SiteConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: cfg.faq.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function organizationJsonLd(cfg: SiteConfig, siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: cfg.siteName,
    url: siteUrl,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: cfg.privacyContactEmail,
      areaServed: "NL",
      availableLanguage: ["Dutch"],
    },
  };
}
