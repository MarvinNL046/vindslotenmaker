import { Metadata } from 'next';
import Link from 'next/link';
import { Wrench, ArrowRight, Key, Lock, Shield, Car, Clock, Home, Settings, Smartphone } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import LeaderboardAd from '@/components/ads/LeaderboardAd';
import InlineAd from '@/components/ads/InlineAd';

export const metadata: Metadata = {
  title: 'Diensten Slotenmakers | Vind Slotenmaker',
  description: 'Ontdek alle diensten van slotenmakers: noodopening, sloten vervangen, inbraakbeveiliging, autosloten en meer. Vind de juiste specialist.',
  openGraph: {
    title: 'Diensten Slotenmakers',
    description: 'Alle diensten van slotenmakers op een rij.',
    type: 'website',
  },
};

const services = [
  {
    name: 'Noodopening',
    slug: 'noodopening',
    description: '24/7 beschikbaar voor als je buitengesloten bent. Snelle service, meestal binnen 30 minuten ter plaatse.',
    icon: Key,
    color: 'bg-orange-100 text-orange-600',
    features: ['24/7 beschikbaar', 'Snel ter plaatse', 'Zonder schade mogelijk'],
    urgent: true,
  },
  {
    name: 'Sloten Vervangen',
    slug: 'sloten-vervangen',
    description: 'Professionele vervanging van alle soorten sloten. Van cilindersloten tot meerpuntssluitingen.',
    icon: Lock,
    color: 'bg-orange-100 text-orange-600',
    features: ['Alle merken', 'SKG-gecertificeerd', 'Advies op maat'],
    urgent: false,
  },
  {
    name: 'Inbraakbeveiliging',
    slug: 'inbraakbeveiliging',
    description: 'Beveilig je woning of bedrijf tegen inbraak. Advies en installatie van gecertificeerde beveiligingsproducten.',
    icon: Shield,
    color: 'bg-orange-100 text-orange-600',
    features: ['Gratis advies', 'SKG*** sloten', 'Politiekeurmerk Veilig Wonen'],
    urgent: false,
  },
  {
    name: 'Autosloten',
    slug: 'autosloten',
    description: 'Hulp bij autosleutels: buitengesloten, sleutel kwijt of kapot. Ook bijmaken van nieuwe sleutels.',
    icon: Car,
    color: 'bg-blue-100 text-blue-600',
    features: ['Alle automerken', 'Sleutel bijmaken', 'Chipsleutels'],
    urgent: true,
  },
  {
    name: '24-uurs Service',
    slug: '24-uurs-service',
    description: 'Slotenmakers die 24 uur per dag, 7 dagen per week beschikbaar zijn voor spoedsituaties.',
    icon: Clock,
    color: 'bg-orange-100 text-orange-600',
    features: ['Dag en nacht', 'Weekend beschikbaar', 'Feestdagen'],
    urgent: true,
  },
  {
    name: 'Woningbeveiliging',
    slug: 'woningbeveiliging',
    description: 'Complete beveiliging van je woning: sloten, grendels, raambeveiliging en meer.',
    icon: Home,
    color: 'bg-orange-100 text-orange-600',
    features: ['Complete oplossingen', 'Raambeveiliging', 'Deurbeveiliging'],
    urgent: false,
  },
  {
    name: 'Cilindersloten',
    slug: 'cilindersloten',
    description: 'Specialisten in cilindersloten. Vervanging, upgrade of reparatie van alle typen cilinders.',
    icon: Settings,
    color: 'bg-gray-100 text-gray-600',
    features: ['Alle merken', 'Keuring mogelijk', 'Direct leverbaar'],
    urgent: false,
  },
  {
    name: 'Elektronische Sloten',
    slug: 'elektronische-sloten',
    description: 'Moderne toegangscontrole met elektronische en slimme sloten. Pin, vingerafdruk of app-bediening.',
    icon: Smartphone,
    color: 'bg-purple-100 text-purple-600',
    features: ['Smart locks', 'App-bediening', 'Vingerafdruk'],
    urgent: false,
  },
];

export default function TypesPage() {
  const urgentServices = services.filter(s => s.urgent);
  const regularServices = services.filter(s => !s.urgent);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-orange-600 via-orange-700 to-orange-800 text-white py-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <ol className="flex items-center space-x-2 text-sm text-white/70">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li>/</li>
              <li className="text-white">Diensten</li>
            </ol>
          </nav>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
              <Wrench className="w-6 h-6" />
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold">
              Diensten Slotenmakers
            </h1>
          </div>
          <p className="text-white/80 text-lg max-w-2xl">
            Ontdek alle diensten die slotenmakers aanbieden. Van noodopeningen tot complete woningbeveiliging.
            Vind de juiste specialist voor jouw situatie.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Urgent Services */}
        <section className="mb-16">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
            <h2 className="font-serif text-2xl font-semibold">Spoeddiensten</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {urgentServices.map((service) => (
              <Link key={service.slug} href={`/type/${service.slug}`} className="group">
                <Card className="p-6 h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 border-orange-200 hover:border-orange-300 bg-gradient-to-br from-orange-50/50 to-white">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 rounded-xl ${service.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <service.icon className="w-7 h-7" />
                    </div>
                    <span className="text-xs font-medium bg-orange-500 text-white px-2 py-1 rounded-full">
                      24/7
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-semibold mb-2 group-hover:text-orange-600 transition-colors">
                    {service.name}
                  </h3>

                  <p className="text-sm text-muted-foreground mb-4">
                    {service.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {service.features.map((feature) => (
                      <span key={feature} className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                        {feature}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-1 text-sm font-medium text-orange-600 group-hover:gap-2 transition-all">
                    Vind slotenmaker
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <LeaderboardAd />

        {/* Regular Services */}
        <section className="mb-16">
          <h2 className="font-serif text-2xl font-semibold mb-6">Alle Diensten</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {regularServices.map((service) => (
              <Link key={service.slug} href={`/type/${service.slug}`} className="group">
                <Card className="p-6 h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-orange-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 rounded-xl ${service.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <service.icon className="w-7 h-7" />
                    </div>
                  </div>

                  <h3 className="font-serif text-xl font-semibold mb-2 group-hover:text-orange-600 transition-colors">
                    {service.name}
                  </h3>

                  <p className="text-sm text-muted-foreground mb-4">
                    {service.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {service.features.map((feature) => (
                      <span key={feature} className="text-xs bg-orange-50 text-orange-700 px-2 py-1 rounded">
                        {feature}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-1 text-sm font-medium text-orange-600 group-hover:gap-2 transition-all">
                    Vind slotenmaker
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <InlineAd />

        {/* Info Section */}
        <section className="max-w-4xl mx-auto">
          <Card className="p-8 bg-gradient-to-br from-orange-50 to-orange-50/30 border-orange-100">
            <h3 className="font-serif text-xl font-semibold mb-4">Welke dienst heb je nodig?</h3>
            <div className="space-y-4 text-muted-foreground">
              <p>
                <strong className="text-foreground">Buitengesloten?</strong> Kies voor Noodopening of 24-uurs Service voor directe hulp.
              </p>
              <p>
                <strong className="text-foreground">Betere beveiliging?</strong> Kies voor Inbraakbeveiliging of Woningbeveiliging voor advies en installatie.
              </p>
              <p>
                <strong className="text-foreground">Sloten vervangen?</strong> Na een verhuizing of inbraak is Sloten Vervangen de juiste keuze.
              </p>
              <p>
                <strong className="text-foreground">Autosleutel kwijt?</strong> Specialisten in Autosloten kunnen je helpen met alle merken.
              </p>
            </div>
          </Card>
        </section>

        {/* CTA Section */}
        <section className="mt-16 text-center">
          <h3 className="font-serif text-2xl font-semibold mb-4">Direct een Slotenmaker Vinden?</h3>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            Zoek op locatie of doorzoek alle slotenmakers in Nederland.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/search">
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
                Zoek op Locatie
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/state">
              <Button variant="outline" size="lg" className="border-orange-200 text-orange-700 hover:bg-orange-50">
                Zoek op Provincie
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
