import { Hero } from "@/components/hero";
import { ServicesGrid } from "@/components/services-grid";
import { HowItWorks } from "@/components/how-it-works";
import { LeadForm } from "@/components/lead-form";
import { Faq } from "@/components/faq";
import { siteConfig } from "@/config/site.config";
import { serviceJsonLd } from "@/lib/json-ld";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? `https://${siteConfig.domain}`;

export default function HomePage() {
  const ld = serviceJsonLd(siteConfig, siteUrl);
  return (
    <>
      <Hero />
      <ServicesGrid />
      <HowItWorks />
      <LeadForm />
      <Faq />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />
    </>
  );
}
