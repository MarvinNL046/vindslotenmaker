import { siteConfig } from "@/config/site.config";

export function HowItWorks() {
  return (
    <section id="hoe-werkt-het" className="bg-slate-50 border-y border-slate-200">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <h2 className="text-2xl md:text-3xl font-semibold text-slate-900">Hoe werkt het?</h2>
        <div className="mt-8 grid md:grid-cols-3 gap-5">
          {siteConfig.howItWorks.map((s) => (
            <div key={s.step} className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="accent-text font-bold text-sm">STAP {s.step}</div>
              <div className="mt-1 font-medium text-slate-900">{s.title}</div>
              <p className="mt-2 text-slate-700 text-sm leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
