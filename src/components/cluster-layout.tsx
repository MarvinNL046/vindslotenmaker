import Link from "next/link";
import { siteConfig } from "@/config/site.config";

export interface ClusterSection {
  h2: string;
  body: React.ReactNode;
}

export interface ClusterFaq {
  q: string;
  a: string;
}

export interface ClusterRelated {
  href: string;
  title: string;
  description: string;
}

export interface ClusterData {
  slug: string; // "/prijzen/single-split"
  breadcrumbParent: { title: string; href: string }; // e.g. { title: "Prijzen", href: "/prijzen" }
  metaTitle: string;
  metaDescription: string;
  h1: string;
  introLead: string; // first sentence answering target query directly
  introBody: React.ReactNode; // remainder of intro (1-2 paragraphs)
  sections: ClusterSection[];
  faq: ClusterFaq[];
  related: ClusterRelated[];
}

function faqJsonLd(faq: ClusterFaq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

function breadcrumbJsonLd(data: ClusterData, siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: siteConfig.siteName,
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: data.breadcrumbParent.title,
        item: `${siteUrl}${data.breadcrumbParent.href}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: data.h1,
        item: `${siteUrl}${data.slug}`,
      },
    ],
  };
}

function articleJsonLd(data: ClusterData, siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: data.h1,
    description: data.metaDescription,
    author: {
      "@type": "Organization",
      name: siteConfig.siteName,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.siteName,
      url: siteUrl,
    },
    mainEntityOfPage: `${siteUrl}${data.slug}`,
    inLanguage: "nl-NL",
  };
}

export function ClusterLayout({ data }: { data: ClusterData }) {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? `https://${siteConfig.domain}`;
  return (
    <>
      <nav aria-label="Breadcrumb" className="mx-auto max-w-5xl px-5 pt-6 text-sm text-slate-600">
        <ol className="flex flex-wrap gap-1">
          <li>
            <Link href="/" className="hover:text-slate-900 underline">Home</Link>
          </li>
          <li>→</li>
          <li>
            <Link href={data.breadcrumbParent.href} className="hover:text-slate-900 underline">
              {data.breadcrumbParent.title}
            </Link>
          </li>
          <li>→</li>
          <li className="text-slate-900 font-medium line-clamp-1">{data.h1}</li>
        </ol>
      </nav>

      <article className="mx-auto max-w-3xl px-5 py-10 md:py-14 text-slate-800">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 leading-tight">
          {data.h1}
        </h1>
        <p className="mt-5 text-lg text-slate-900 font-medium leading-relaxed">
          {data.introLead}
        </p>
        <div className="mt-4 text-slate-700 leading-relaxed space-y-4">
          {data.introBody}
        </div>

        <div className="mt-10 flex">
          <a
            href="/#aanvragen"
            className="shiny-btn accent-bg text-white font-medium px-5 py-3 rounded-md"
          >
            {siteConfig.ctaVariants.primary}
          </a>
        </div>

        {data.sections.map((s) => (
          <section key={s.h2} className="mt-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-4 leading-tight">
              {s.h2}
            </h2>
            <div className="text-slate-700 leading-relaxed space-y-4">
              {s.body}
            </div>
          </section>
        ))}

        <section className="mt-16">
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-6">
            Veelgestelde vragen
          </h2>
          <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl">
            {data.faq.map((f) => (
              <details key={f.q} className="group p-5 open:bg-slate-50">
                <summary className="cursor-pointer list-none flex justify-between items-start gap-4">
                  <span className="font-medium text-slate-900">{f.q}</span>
                  <span className="accent-text text-xl group-open:rotate-45 transition">+</span>
                </summary>
                <p className="mt-3 text-slate-700 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {data.related.length > 0 && (
          <section className="mt-16 border-t border-slate-200 pt-10">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Meer weten?</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {data.related.map((r) => (
                <Link
                  key={r.href}
                  href={r.href}
                  className="border border-slate-200 rounded-xl p-5 hover:accent-border transition block"
                >
                  <div className="font-medium text-slate-900">{r.title}</div>
                  <p className="mt-1 text-sm text-slate-700">{r.description}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="mt-14 accent-soft border border-slate-200 rounded-2xl p-6 md:p-8 text-center">
          <h2 className="text-xl md:text-2xl font-semibold text-slate-900">
            {siteConfig.ctaVariants.secondary}
          </h2>
          <p className="mt-2 text-slate-700">
            Binnen 24 uur 2-4 offertes van F-gassen gecertificeerde monteurs in Limburg.
          </p>
          <a
            href="/#aanvragen"
            className="shiny-btn accent-bg text-white font-medium px-5 py-3 rounded-md mt-5 inline-block"
          >
            {siteConfig.ctaVariants.primary}
          </a>
        </section>
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(data, siteUrl)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd(data, siteUrl)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(data.faq)) }}
      />
    </>
  );
}
