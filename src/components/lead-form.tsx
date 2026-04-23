"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { siteConfig } from "@/config/site.config";

type Urgency = "asap" | "month" | "orienting";

interface FormState {
  message: string;
  urgency: Urgency;
  postalCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  honeypot: string;
  consent: boolean;
}

const INITIAL: FormState = {
  message: "",
  urgency: "month",
  postalCode: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  honeypot: "",
  consent: false,
};

export function LeadForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [state, setState] = useState<FormState>(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setState((s) => ({ ...s, [k]: v }));

  const canStep1 = state.message.trim().length >= 10;
  const canStep2 = /^[0-9]{4}\s?[A-Za-z]{2}$/.test(state.postalCode.trim());
  const canStep3 =
    state.firstName.trim().length >= 2 &&
    state.lastName.trim().length >= 2 &&
    /^\+?[0-9\s\-]{8,}$/.test(state.phone.trim()) &&
    state.consent;

  async function submit() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/lead/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: state.firstName.trim(),
          lastName: state.lastName.trim(),
          phone: state.phone.trim(),
          postalCode: state.postalCode.trim().toUpperCase().replace(/\s/g, ""),
          email: state.email.trim() || undefined,
          urgency: state.urgency,
          message: state.message.trim(),
          honeypot: state.honeypot,
        }),
      });
      const data = (await res.json()) as
        | { token: string; verifyUrl: string; expiresAt: string }
        | { error: string; retryAfterSeconds?: number };
      if (!res.ok || "error" in data) {
        setError(errorMessage("error" in data ? data.error : "unknown"));
        setSubmitting(false);
        return;
      }
      router.push(`/aanvragen/verify?v=${encodeURIComponent(data.token)}`);
    } catch {
      setError("Er ging iets mis. Probeer het opnieuw.");
      setSubmitting(false);
    }
  }

  return (
    <section id="aanvragen" className="bg-white border-y border-slate-200">
      <div className="mx-auto max-w-3xl px-5 py-14">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-900">
            {siteConfig.ctaVariants.primary}
          </h2>
          <p className="mt-3 text-slate-700">{siteConfig.ctaVariants.secondary}</p>
        </div>

        <div className="mt-8 flex justify-center gap-2 text-xs text-slate-500">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className={`h-1.5 w-10 rounded-full ${
                n <= step ? "accent-bg" : "bg-slate-200"
              }`}
            />
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 p-6 md:p-8 bg-white shadow-sm">
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={state.honeypot}
            onChange={(e) => update("honeypot", e.target.value)}
            className="hidden"
            aria-hidden
          />

          {step === 1 && (
            <div className="space-y-5">
              <label className="block">
                <span className="text-sm font-medium text-slate-800">
                  Beschrijf je klus of vraag
                </span>
                <textarea
                  rows={4}
                  value={state.message}
                  onChange={(e) => update("message", e.target.value)}
                  placeholder="Bijvoorbeeld: ik wil offerte voor ..."
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="mt-1 block text-xs text-slate-500">Minimaal 10 tekens.</span>
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-800">Wanneer wil je starten?</span>
                <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
                  {[
                    { v: "asap", label: "Zo snel mogelijk" },
                    { v: "month", label: "Binnen een maand" },
                    { v: "orienting", label: "Oriënterend" },
                  ].map((o) => (
                    <button
                      key={o.v}
                      type="button"
                      onClick={() => update("urgency", o.v as Urgency)}
                      className={`border rounded-md px-3 py-2 ${
                        state.urgency === o.v
                          ? "accent-border accent-soft accent-text font-medium"
                          : "border-slate-300 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </label>

              <button
                type="button"
                disabled={!canStep1}
                onClick={() => setStep(2)}
                className="accent-bg text-white font-medium w-full py-3 rounded-md disabled:opacity-40"
              >
                Volgende
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <label className="block">
                <span className="text-sm font-medium text-slate-800">Postcode</span>
                <input
                  value={state.postalCode}
                  onChange={(e) => update("postalCode", e.target.value)}
                  placeholder="1234 AB"
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="mt-1 block text-xs text-slate-500">
                  We matchen je met vakmannen in jouw regio.
                </span>
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="border border-slate-300 text-slate-800 font-medium py-3 px-4 rounded-md"
                >
                  Terug
                </button>
                <button
                  type="button"
                  disabled={!canStep2}
                  onClick={() => setStep(3)}
                  className="accent-bg text-white font-medium flex-1 py-3 rounded-md disabled:opacity-40"
                >
                  Volgende
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-sm font-medium text-slate-800">Voornaam</span>
                  <input
                    value={state.firstName}
                    onChange={(e) => update("firstName", e.target.value)}
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-slate-800">Achternaam</span>
                  <input
                    value={state.lastName}
                    onChange={(e) => update("lastName", e.target.value)}
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>
              </div>
              <label className="block">
                <span className="text-sm font-medium text-slate-800">Telefoonnummer</span>
                <input
                  value={state.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="06 12 34 56 78"
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="mt-1 block text-xs text-slate-500">
                  We sturen een SMS-code om je nummer te verifiëren.
                </span>
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-800">E-mail (optioneel)</span>
                <input
                  type="email"
                  value={state.email}
                  onChange={(e) => update("email", e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>
              <label className="flex items-start gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={state.consent}
                  onChange={(e) => update("consent", e.target.checked)}
                  className="mt-1"
                />
                <span>
                  Ik ga akkoord dat lokale vakmannen contact met me mogen opnemen en accepteer het{" "}
                  <a href="/privacy" className="accent-text underline">
                    privacybeleid
                  </a>
                  .
                </span>
              </label>

              {error && (
                <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="border border-slate-300 text-slate-800 font-medium py-3 px-4 rounded-md"
                  disabled={submitting}
                >
                  Terug
                </button>
                <button
                  type="button"
                  disabled={!canStep3 || submitting}
                  onClick={submit}
                  className="accent-bg text-white font-medium flex-1 py-3 rounded-md disabled:opacity-40"
                >
                  {submitting ? "Even geduld..." : siteConfig.ctaVariants.primary}
                </button>
              </div>
              <p className="text-xs text-slate-500 text-center">
                Gratis en vrijblijvend. Je zit nergens aan vast.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function errorMessage(code: string): string {
  switch (code) {
    case "invalid_phone":
      return "Dit telefoonnummer lijkt niet te kloppen. Controleer het even.";
    case "rate_limit_ip":
      return "Te veel aanvragen vanaf dit adres. Probeer het later opnieuw.";
    case "niche_not_allowed":
    case "invalid_niche":
      return "Deze dienst kan op dit moment niet verwerkt worden. Probeer later opnieuw.";
    case "missing_required_field:firstName":
    case "missing_required_field:lastName":
    case "missing_required_field:phone":
    case "missing_required_field:postalCode":
      return "Vul alle verplichte velden in.";
    default:
      return "Er ging iets mis. Probeer het opnieuw.";
  }
}
