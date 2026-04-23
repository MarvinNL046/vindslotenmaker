import { siteConfig } from "@/config/site.config";

export function ServicesGrid() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-14">
      <h2 className="text-2xl md:text-3xl font-semibold text-slate-900">
        Wat je van {siteConfig.siteName} kunt verwachten
      </h2>
      <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-3 gap-5">
        {siteConfig.services.map((s) => (
          <div key={s.title} className="rounded-xl border border-slate-200 p-5 hover:border-slate-300 transition">
            <div className="font-medium text-slate-900">{s.title}</div>
            <p className="mt-2 text-slate-700 text-sm leading-relaxed">{s.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
