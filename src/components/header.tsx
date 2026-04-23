import Link from "next/link";
import { siteConfig } from "@/config/site.config";

export function Header() {
  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-40">
      <div className="mx-auto max-w-6xl px-5 h-16 flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight text-slate-900">
          {siteConfig.siteName}
        </Link>
        <Link
          href="#aanvragen"
          className="shiny-btn accent-bg text-white text-sm font-medium px-4 py-2 rounded-md"
        >
          {siteConfig.ctaVariants.primary}
        </Link>
      </div>
    </header>
  );
}
