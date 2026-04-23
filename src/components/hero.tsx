import { siteConfig } from "@/config/site.config";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-5 pt-14 pb-12 md:pt-20 md:pb-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-slate-900 leading-tight">
            {siteConfig.h1}
          </h1>
          <p className="mt-5 text-lg text-slate-700 leading-relaxed max-w-xl">
            {siteConfig.heroIntro}
          </p>
          <ul className="mt-6 space-y-2">
            {siteConfig.heroUsps.map((u) => (
              <li key={u} className="flex items-start gap-2 text-slate-700">
                <span className="mt-0.5 accent-text font-bold">✓</span>
                <span>{u}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#aanvragen"
              className="accent-bg text-white font-medium px-5 py-3 rounded-md"
            >
              {siteConfig.ctaVariants.primary}
            </a>
            <a
              href="#hoe-werkt-het"
              className="border border-slate-300 text-slate-800 font-medium px-5 py-3 rounded-md hover:bg-slate-50"
            >
              Hoe werkt het?
            </a>
          </div>
        </div>
        <div className="hidden md:block">
          <div className="accent-soft rounded-2xl p-8 border border-slate-200">
            <div className="text-sm uppercase tracking-wide text-slate-500">Waarom {siteConfig.siteName}</div>
            <ul className="mt-4 space-y-3 text-slate-800">
              {siteConfig.whyUsBullets.map((b) => (
                <li key={b} className="flex items-start gap-2">
                  <span className="accent-text font-bold mt-0.5">•</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
