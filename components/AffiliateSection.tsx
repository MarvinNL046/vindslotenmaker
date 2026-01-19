import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Phone, Shield, KeyRound } from 'lucide-react';

interface AffiliatePartner {
  name: string;
  description: string;
  icon: React.ReactNode;
  ctaText: string;
  href: string;
  tag?: string;
}

const partners: AffiliatePartner[] = [
  {
    name: 'Gecertificeerde Slotenmakers',
    description: 'Vind alleen erkende en gecertificeerde slotenmakers met VEB of SKG keurmerk',
    icon: <Shield className="w-6 h-6" />,
    ctaText: 'Bekijk certificeringen',
    href: '/guide/certificeringen',
    tag: 'Betrouwbaar'
  },
  {
    name: '24/7 Spoedhulp',
    description: 'Buitengesloten? Vind direct een slotenmaker bij u in de buurt die nu beschikbaar is',
    icon: <Phone className="w-6 h-6" />,
    ctaText: 'Zoek nu',
    href: '/zoeken?spoed=true',
    tag: 'Direct hulp'
  },
  {
    name: 'Beveiligingsadvies',
    description: 'Gratis tips en advies over het beveiligen van uw woning of bedrijf',
    icon: <KeyRound className="w-6 h-6" />,
    ctaText: 'Lees meer',
    href: '/guide/beveiliging',
  }
];

export default function AffiliateSection() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-3">Direct Hulp Nodig?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Buitengesloten of sleutel kwijt? Wij helpen u snel aan een betrouwbare slotenmaker.
            Alle slotenmakers op onze site zijn geverifieerd.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {partners.map((partner, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-orange-100 rounded-lg text-orange-600">
                  {partner.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{partner.name}</h3>
                  {partner.tag && (
                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                      {partner.tag}
                    </span>
                  )}
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                {partner.description}
              </p>

              <Button
                variant="outline"
                className="w-full group border-orange-200 hover:border-orange-400 hover:bg-orange-50"
                asChild
              >
                <Link href={partner.href}>
                  {partner.ctaText}
                  <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </Button>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-xs text-gray-500">
            Alle slotenmakers zijn gecontroleerd op KvK-inschrijving en reviews. Bij spoed, bel direct de slotenmaker van uw keuze.
          </p>
        </div>
      </div>
    </section>
  );
}
