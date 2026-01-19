import { Metadata } from 'next';
import Link from 'next/link';
import { getAllFacilityTypes, getFacilitiesByFacilityType, getFacilityTypeBySlug, FacilityType, Facility } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Building, MapPin, ChevronRight, ArrowRight, Clock, Shield, Info, Key, Lock, Car, Home, Wrench } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import LeaderboardAd from '@/components/ads/LeaderboardAd';
import InlineAd from '@/components/ads/InlineAd';

interface PageProps {
  params: Promise<{
    type: string;
  }>;
}

const typeDescriptions: Record<string, string> = {
  'noodopening': '24/7 beschikbaar voor noodopeningen. Slotenmakers die gespecialiseerd zijn in het snel en zonder schade openen van deuren wanneer je buitengesloten bent.',
  'sloten-vervangen': 'Professionele vervanging van cilindersloten, veiligheidssloten en meerpuntssluitingen. SKG-gecertificeerde sloten voor optimale beveiliging.',
  'inbraakbeveiliging': 'Specialisten in woningbeveiliging en inbraakpreventie. Advies en installatie van gecertificeerde sloten, extra grendels en raambeveiliging.',
  'autosloten': 'Hulp bij autosleutels: buitengesloten, sleutel kwijt of kapot. Ook bijmaken van nieuwe sleutels inclusief chipsleutels voor alle automerken.',
  '24-uurs-service': 'Slotenmakers die 24 uur per dag, 7 dagen per week beschikbaar zijn voor spoedsituaties en noodgevallen.',
  'woningbeveiliging': 'Complete beveiliging van je woning met sloten, grendels, raambeveiliging en meer. Advies over Politiekeurmerk Veilig Wonen.',
  'cilindersloten': 'Specialisten in cilindersloten. Vervanging, upgrade of reparatie van alle typen cilinders, inclusief SKG-gecertificeerde cilinders.',
  'elektronische-sloten': 'Moderne toegangscontrole met elektronische en slimme sloten. Pin, vingerafdruk of app-bediening voor woning of bedrijf.',
  'bedrijfsbeveiliging': 'Beveiliging voor bedrijven en kantoren. Toegangscontrole, masterkey-systemen en professionele slotoplossingen.',
  'kluizen': 'Specialisten in kluizen: opening, reparatie en installatie. Ook voor het bijmaken van kluissleutels.',
};

const typeIcons: Record<string, React.ReactNode> = {
  'noodopening': <Key className="w-6 h-6" />,
  'sloten-vervangen': <Lock className="w-6 h-6" />,
  'inbraakbeveiliging': <Shield className="w-6 h-6" />,
  'autosloten': <Car className="w-6 h-6" />,
  '24-uurs-service': <Clock className="w-6 h-6" />,
  'woningbeveiliging': <Home className="w-6 h-6" />,
  'cilindersloten': <Wrench className="w-6 h-6" />,
  'elektronische-sloten': <Key className="w-6 h-6" />,
};

export async function generateStaticParams() {
  const types = await getAllFacilityTypes();
  return types.map(type => ({
    type: type.slug,
  }));
}

// Revalidate pages every 24 hours
export const revalidate = 86400;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { type: typeSlug } = await params;
  const type = await getFacilityTypeBySlug(typeSlug);

  if (!type) {
    return { title: 'Dienst Niet Gevonden | Vind Slotenmaker' };
  }

  return {
    title: `${type.name} Slotenmakers in Nederland | Vind Slotenmaker`,
    description: `Vind slotenmakers gespecialiseerd in ${type.name.toLowerCase()} in heel Nederland. Bekijk locaties, diensten en reviews.`,
    openGraph: {
      title: `${type.name} - Slotenmakers`,
      description: `Alle slotenmakers voor ${type.name.toLowerCase()} in Nederland`,
      type: 'website',
    },
  };
}

export default async function TypePage({ params }: PageProps) {
  const { type: typeSlug } = await params;
  const type = await getFacilityTypeBySlug(typeSlug);

  if (!type) {
    notFound();
  }

  const facilities = await getFacilitiesByFacilityType(type.slug);
  const description = typeDescriptions[typeSlug] || type.description;
  const icon = typeIcons[typeSlug] || <Key className="w-6 h-6" />;

  // Group by province (state)
  const facilitiesByProvince = facilities.reduce((acc, facility) => {
    const province = facility.state || 'Overig';
    if (!acc[province]) {
      acc[province] = [];
    }
    acc[province].push(facility);
    return acc;
  }, {} as Record<string, Facility[]>);

  const provinceCount = Object.keys(facilitiesByProvince).length;

  // Breadcrumb structured data
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.vindslotenmaker.nl'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Diensten',
        item: 'https://www.vindslotenmaker.nl/type'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: type.name,
        item: `https://www.vindslotenmaker.nl/type/${typeSlug}`
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-orange-600 via-orange-700 to-orange-800 text-white py-16">
          <div className="container mx-auto px-4">
            {/* Breadcrumb */}
            <nav className="mb-6">
              <ol className="flex items-center space-x-2 text-sm text-white/70">
                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                <li>/</li>
                <li><Link href="/type" className="hover:text-white transition-colors">Diensten</Link></li>
                <li>/</li>
                <li className="text-white">{type.name}</li>
              </ol>
            </nav>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                {icon}
              </div>
              <h1 className="font-serif text-4xl sm:text-5xl font-bold">
                {type.name}
              </h1>
            </div>

            {description && (
              <p className="text-white/80 text-lg max-w-3xl mb-8">
                {description}
              </p>
            )}

            {/* Stats */}
            <div className="flex flex-wrap gap-8">
              <div>
                <div className="text-3xl font-bold text-orange-300">{facilities.length}</div>
                <div className="text-white/70 text-sm">Slotenmakers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-300">{provinceCount}</div>
                <div className="text-white/70 text-sm">Provincies</div>
              </div>
            </div>
          </div>
        </div>

        {/* Leaderboard Ad after hero */}
        <div className="container mx-auto px-4 pt-8">
          <LeaderboardAd />
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            {facilities.length > 0 ? (
              <div className="space-y-12">
                {Object.entries(facilitiesByProvince)
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([province, provinceFacilities]) => (
                    <div key={province}>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center">
                          <MapPin className="w-5 h-5" />
                        </div>
                        <div>
                          <h2 className="font-serif text-2xl font-bold">{province}</h2>
                          <p className="text-sm text-muted-foreground">
                            {provinceFacilities.length} slotenmaker{provinceFacilities.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {provinceFacilities.map((facility) => (
                          <Link
                            key={facility.slug}
                            href={`/facility/${facility.slug}`}
                            className="group"
                          >
                            <Card className="h-full p-4 border-2 border-transparent hover:border-orange-300 transition-all duration-300">
                              <h3 className="font-semibold mb-2 group-hover:text-orange-600 transition-colors">
                                {facility.name}
                              </h3>
                              <div className="space-y-1 text-sm text-muted-foreground">
                                <p className="flex items-center gap-2">
                                  <Building className="w-4 h-4 text-orange-600" />
                                  <span>{facility.city}{facility.county ? `, ${facility.county}` : ''}</span>
                                </p>
                                {facility.phone && (
                                  <p className="text-xs">{facility.phone}</p>
                                )}
                              </div>
                              <div className="mt-3 flex items-center gap-1 text-sm font-medium text-orange-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                Bekijk
                                <ChevronRight className="w-4 h-4" />
                              </div>
                            </Card>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground mb-4">
                  Nog geen slotenmakers gevonden voor {type.name.toLowerCase()}. We voegen continu nieuwe locaties toe.
                </p>
                <Link href="/search">
                  <Button className="bg-orange-600 hover:bg-orange-700">
                    Zoek Alle Slotenmakers
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </Card>
            )}

            {/* Inline Ad */}
            <div className="mt-12">
              <InlineAd />
            </div>

            {/* Info Cards */}
            <div className="mt-16 grid gap-6 md:grid-cols-3">
              <Card className="p-6 shadow-soft">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-5 h-5 text-orange-700" />
                </div>
                <h3 className="font-serif text-lg font-semibold mb-2">24/7 Beschikbaar</h3>
                <p className="text-sm text-muted-foreground">
                  Veel slotenmakers zijn 24/7 bereikbaar voor noodgevallen.
                  Bel direct voor snelle hulp bij buitensluiting.
                </p>
              </Card>
              <Card className="p-6 shadow-soft">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Info className="w-5 h-5 text-orange-700" />
                </div>
                <h3 className="font-serif text-lg font-semibold mb-2">Vraag een Offerte</h3>
                <p className="text-sm text-muted-foreground">
                  Vraag altijd vooraf een prijsopgave. Betrouwbare slotenmakers geven
                  duidelijke informatie over kosten.
                </p>
              </Card>
              <Card className="p-6 shadow-soft">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-5 h-5 text-orange-700" />
                </div>
                <h3 className="font-serif text-lg font-semibold mb-2">SKG Gecertificeerd</h3>
                <p className="text-sm text-muted-foreground">
                  Kies voor SKG-gecertificeerde sloten voor optimale beveiliging.
                  Vraag advies aan de slotenmaker.
                </p>
              </Card>
            </div>

            {/* CTA Section */}
            <div className="mt-16 text-center">
              <h2 className="font-serif text-2xl font-semibold mb-4">
                Op zoek naar een specifieke slotenmaker?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                Gebruik onze zoekfunctie om slotenmakers te vinden op naam, locatie of dienst.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/search">
                  <Button className="bg-orange-600 hover:bg-orange-700">
                    Zoek Slotenmaker
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/state">
                  <Button variant="outline" className="border-orange-200 text-orange-700 hover:bg-orange-50">
                    Zoek op Provincie
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
