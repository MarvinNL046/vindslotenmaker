import { siteConfig } from "@/config/site.config";
import { faqJsonLd } from "@/lib/json-ld";

export function Faq() {
  const ld = faqJsonLd(siteConfig);
  return (
    <section className="mx-auto max-w-3xl px-5 py-14">
      <h2 className="text-2xl md:text-3xl font-semibold text-slate-900">Veelgestelde vragen</h2>
      <div className="mt-6 divide-y divide-slate-200 border border-slate-200 rounded-xl">
        {siteConfig.faq.map((f) => (
          <details key={f.question} className="group p-5 open:bg-slate-50">
            <summary className="cursor-pointer list-none flex justify-between items-start gap-4">
              <span className="font-medium text-slate-900">{f.question}</span>
              <span className="accent-text text-xl group-open:rotate-45 transition">+</span>
            </summary>
            <p className="mt-3 text-slate-700 leading-relaxed">{f.answer}</p>
          </details>
        ))}
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />
    </section>
  );
}
