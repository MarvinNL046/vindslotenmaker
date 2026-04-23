import Link from "next/link";
import { siteConfig } from "@/config/site.config";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-5 py-10 text-sm text-slate-600">
        <div className="flex flex-col md:flex-row md:justify-between gap-6">
          <div>
            <div className="font-semibold text-slate-900">{siteConfig.siteName}</div>
            <p className="mt-1 max-w-sm">{siteConfig.metaDescription}</p>
          </div>
          <nav className="flex gap-6">
            <Link href="/privacy" className="hover:text-slate-900">Privacy</Link>
            <Link href="/voorwaarden" className="hover:text-slate-900">Voorwaarden</Link>
            <Link href="#aanvragen" className="hover:text-slate-900">Aanvragen</Link>
          </nav>
        </div>
        <div className="mt-8 text-xs text-slate-500">
          &copy; {new Date().getFullYear()} {siteConfig.siteName}. Alle rechten voorbehouden.
        </div>
      </div>
    </footer>
  );
}
