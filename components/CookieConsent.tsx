'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Cookie, Settings } from 'lucide-react';

interface ConsentState {
  necessary: boolean;
  analytics: boolean;
  advertising: boolean;
  functionality: boolean;
}

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [consent, setConsent] = useState<ConsentState>({
    necessary: true, // Always true
    analytics: false,
    advertising: false,
    functionality: false,
  });

  useEffect(() => {
    // Check if consent was already given
    const savedConsent = localStorage.getItem('cookieConsent');
    if (!savedConsent) {
      // Small delay to prevent layout shift
      setTimeout(() => setShowBanner(true), 1000);
    } else {
      // Apply saved consent
      const parsed = JSON.parse(savedConsent);
      handleConsentUpdate(parsed);
    }
  }, []);

  const handleConsentUpdate = (newConsent: ConsentState) => {
    // Update Google Consent Mode
    if (typeof window !== 'undefined') {
      const gtag = (window as any).gtag;
      if (typeof gtag === 'function') {
        gtag('consent', 'update', {
          'ad_storage': newConsent.advertising ? 'granted' : 'denied',
          'ad_user_data': newConsent.advertising ? 'granted' : 'denied',
          'ad_personalization': newConsent.advertising ? 'granted' : 'denied',
          'analytics_storage': newConsent.analytics ? 'granted' : 'denied',
          'functionality_storage': newConsent.functionality ? 'granted' : 'denied',
          'personalization_storage': newConsent.functionality ? 'granted' : 'denied',
        });
      }
    }

    // Trigger custom event for ad scripts
    window.dispatchEvent(new CustomEvent('cookieConsentUpdated', {
      detail: newConsent
    }));
  };

  const acceptAll = () => {
    const fullConsent = {
      necessary: true,
      analytics: true,
      advertising: true,
      functionality: true,
    };
    setConsent(fullConsent);
    localStorage.setItem('cookieConsent', JSON.stringify(fullConsent));
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    handleConsentUpdate(fullConsent);
    setShowBanner(false);
  };

  const acceptSelected = () => {
    localStorage.setItem('cookieConsent', JSON.stringify(consent));
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    handleConsentUpdate(consent);
    setShowBanner(false);
  };

  const rejectAll = () => {
    const minimalConsent = {
      necessary: true,
      analytics: false,
      advertising: false,
      functionality: false,
    };
    setConsent(minimalConsent);
    localStorage.setItem('cookieConsent', JSON.stringify(minimalConsent));
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    handleConsentUpdate(minimalConsent);
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={() => {}} />

      {/* Banner */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50 p-4 md:p-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-start gap-4">
            <Cookie className="w-6 h-6 text-orange-500 mt-1 flex-shrink-0" />

            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2">Cookie-instellingen</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Wij gebruiken cookies om uw ervaring te verbeteren, verkeer te analyseren en relevante advertenties te tonen.
                Door op &quot;Alles Accepteren&quot; te klikken, stemt u in met ons gebruik van cookies.
              </p>

              {showDetails && (
                <div className="mb-4 space-y-3 bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-sm">Noodzakelijke cookies</h4>
                      <p className="text-xs text-muted-foreground">Essentieel voor de werking van de website</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={consent.necessary}
                      disabled
                      className="h-4 w-4"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-sm">Analytische cookies</h4>
                      <p className="text-xs text-muted-foreground">Helpen ons te begrijpen hoe bezoekers de site gebruiken</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={consent.analytics}
                      onChange={(e) => setConsent({ ...consent, analytics: e.target.checked })}
                      className="h-4 w-4"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-sm">Advertentie cookies</h4>
                      <p className="text-xs text-muted-foreground">Voor gepersonaliseerde advertenties (Google AdSense)</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={consent.advertising}
                      onChange={(e) => setConsent({ ...consent, advertising: e.target.checked })}
                      className="h-4 w-4"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-sm">Functionele cookies</h4>
                      <p className="text-xs text-muted-foreground">Onthouden voorkeuren en instellingen</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={consent.functionality}
                      onChange={(e) => setConsent({ ...consent, functionality: e.target.checked })}
                      className="h-4 w-4"
                    />
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  onClick={acceptAll}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  Alles Accepteren
                </Button>

                {showDetails ? (
                  <Button
                    onClick={acceptSelected}
                    variant="outline"
                  >
                    Selectie Opslaan
                  </Button>
                ) : (
                  <Button
                    onClick={() => setShowDetails(true)}
                    variant="outline"
                    className="flex items-center gap-1"
                  >
                    <Settings className="w-4 h-4" />
                    Instellingen
                  </Button>
                )}

                <Button
                  onClick={rejectAll}
                  variant="ghost"
                >
                  Alleen Noodzakelijk
                </Button>

                <a
                  href="/privacy"
                  className="text-sm text-orange-600 hover:underline ml-auto"
                >
                  Privacybeleid
                </a>
              </div>
            </div>

            <button
              onClick={rejectAll}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Sluiten"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
