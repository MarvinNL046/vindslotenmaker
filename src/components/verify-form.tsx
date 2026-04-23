"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  token: string;
}

export function VerifyForm({ token }: Props) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [attemptsLeft, setAttemptsLeft] = useState<number | null>(null);
  const [sentInitial, setSentInitial] = useState(false);

  useEffect(() => {
    if (sentInitial) return;
    setSentInitial(true);
    fetch(`/api/lead/send-code?v=${encodeURIComponent(token)}`)
      .then((r) => r.json())
      .then((d: { sent?: boolean; cooldownActive?: boolean; error?: string }) => {
        if (d.error) {
          setError(friendlyError(d.error));
        } else if (d.sent) {
          setInfo("SMS-code verstuurd. Vul hieronder de 6 cijfers in.");
        } else if (d.cooldownActive) {
          setInfo("De SMS is zojuist al verstuurd. Controleer je telefoon.");
        }
      })
      .catch(() => setError("Kon geen SMS sturen. Probeer opnieuw."));
  }, [token, sentInitial]);

  async function verify() {
    setLoading(true);
    setError(null);
    setInfo(null);
    try {
      const r = await fetch(`/api/lead/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, code }),
      });
      const data = (await r.json()) as {
        success?: boolean;
        error?: string;
        attemptsLeft?: number;
      };
      if (data.success) {
        router.push("/aanvragen/bedankt");
        return;
      }
      if (typeof data.attemptsLeft === "number") setAttemptsLeft(data.attemptsLeft);
      setError(friendlyError(data.error ?? "unknown"));
    } catch {
      setError("Er ging iets mis. Probeer opnieuw.");
    } finally {
      setLoading(false);
    }
  }

  async function resend() {
    setError(null);
    setInfo(null);
    const r = await fetch(`/api/lead/send-code?v=${encodeURIComponent(token)}`);
    const d = (await r.json()) as { sent?: boolean; error?: string };
    if (d.error) setError(friendlyError(d.error));
    else if (d.sent) setInfo("Nieuwe SMS-code verstuurd.");
  }

  return (
    <div className="mt-6 space-y-4">
      {info && (
        <div className="text-sm text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-md px-3 py-2">
          {info}
        </div>
      )}
      <label className="block">
        <span className="text-sm font-medium text-slate-800">SMS-code</span>
        <input
          inputMode="numeric"
          autoComplete="one-time-code"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          placeholder="123456"
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-3 text-center text-xl tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {attemptsLeft !== null && (
          <span className="mt-1 block text-xs text-slate-500">
            Nog {attemptsLeft} pogingen over.
          </span>
        )}
      </label>

      {error && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {error}
        </div>
      )}

      <button
        type="button"
        disabled={code.length !== 6 || loading}
        onClick={verify}
        className="accent-bg text-white font-medium w-full py-3 rounded-md disabled:opacity-40"
      >
        {loading ? "Verifiëren..." : "Bevestig aanvraag"}
      </button>

      <button
        type="button"
        onClick={resend}
        className="text-sm accent-text underline w-full text-center"
      >
        SMS opnieuw versturen
      </button>
    </div>
  );
}

function friendlyError(code: string): string {
  switch (code) {
    case "invalid_code":
      return "Deze code klopt niet. Controleer de SMS.";
    case "too_many_attempts":
      return "Te veel pogingen. Vraag een nieuwe code aan.";
    case "verification_expired":
      return "Deze aanvraag is verlopen. Vul het formulier opnieuw in.";
    case "already_verified":
      return "Deze aanvraag is al bevestigd.";
    case "too_many_resends":
      return "Te vaak SMS gevraagd. Probeer later opnieuw.";
    case "sms_rate_limit":
      return "SMS-limiet bereikt. Wacht even en probeer opnieuw.";
    case "sms_gateway_error":
      return "SMS kon niet verstuurd worden. Probeer opnieuw.";
    case "verification_not_found":
      return "Aanvraag niet gevonden. Vul het formulier opnieuw in.";
    default:
      return "Er ging iets mis. Probeer opnieuw.";
  }
}
