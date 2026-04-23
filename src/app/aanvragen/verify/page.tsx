import type { Metadata } from "next";
import { VerifyForm } from "@/components/verify-form";

export const metadata: Metadata = {
  title: "Verifieer je aanvraag",
  robots: { index: false, follow: false },
};

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ v?: string }>;
}) {
  const sp = await searchParams;
  const token = sp.v ?? "";
  return (
    <section className="mx-auto max-w-md px-5 py-16">
      <h1 className="text-2xl font-semibold text-slate-900">Verifieer je telefoonnummer</h1>
      <p className="mt-3 text-slate-700">
        We sturen je een 6-cijferige SMS-code. Vul deze hieronder in om je aanvraag te bevestigen.
      </p>
      {token ? (
        <VerifyForm token={token} />
      ) : (
        <div className="mt-6 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          Geen geldige aanvraag gevonden. Ga terug en probeer het opnieuw.
        </div>
      )}
    </section>
  );
}
