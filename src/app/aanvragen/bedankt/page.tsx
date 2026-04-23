import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site.config";

export const metadata: Metadata = {
  title: "Aanvraag ontvangen",
  robots: { index: false, follow: false },
};

export default function BedanktPage() {
  return (
    <section className="mx-auto max-w-xl px-5 py-16 text-center">
      <div className="accent-soft inline-flex items-center justify-center w-14 h-14 rounded-full">
        <span className="accent-text text-3xl">✓</span>
      </div>
      <h1 className="mt-5 text-2xl md:text-3xl font-semibold text-slate-900">
        Aanvraag ontvangen
      </h1>
      <p className="mt-3 text-slate-700 leading-relaxed">
        Bedankt — je aanvraag staat klaar voor lokale vakmannen. Meestal
        ontvang je binnen 24 uur de eerste reactie per telefoon of e-mail.
      </p>
      <div className="mt-8">
        <Link href="/" className="accent-text underline">
          Terug naar {siteConfig.siteName}
        </Link>
      </div>
    </section>
  );
}
