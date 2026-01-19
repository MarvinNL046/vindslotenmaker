import { Metadata } from 'next';
import Link from 'next/link';
import { getAllCounties, getFacilitiesByCounty, createCountySlug, createCitySlug, createStateSlug, Facility } from '@/lib/data';
import { notFound } from 'next/navigation';
import { MapPin, Building2, Key, Clock, ChevronRight, ArrowRight, Lightbulb, Shield } from 'lucide-react';
import FacilityCard from '@/components/FacilityCard';
import SidebarAd from '@/components/ads/SidebarAd';
import LeaderboardAd from '@/components/ads/LeaderboardAd';
import InlineAd from '@/components/ads/InlineAd';
import { AD_SLOTS } from '@/lib/ad-config';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface PageProps {
  params: Promise<{
    county: string;
  }>;
}

// Limit static generation to top 200 municipalities to stay under Vercel's 75MB limit
export async function generateStaticParams() {
  const counties = await getAllCounties();
  return counties.slice(0, 200).map(county => ({
    county: createCountySlug(county),
  }));
}

// Allow dynamic params for municipalities not in static params
export const dynamicParams = true;

// Revalidate pages every 24 hours
export const revalidate = 86400;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { county: countySlug } = await params;
  const counties = await getAllCounties();
  const matchedCounty = counties.find(
    c => createCountySlug(c) === countySlug
  );

  if (!matchedCounty) {
    return {
      title: 'Gemeente niet gevonden | Vind Slotenmaker',
      description: 'De gevraagde gemeente kon niet worden gevonden.',
    };
  }

  return {
    title: `Slotenmakers in ${matchedCounty} | Vind Slotenmaker`,
    description: `Vind alle slotenmakers in ${matchedCounty}. Bekijk locaties, diensten, reviews en contactgegevens van lokale slotenmakers.`,
    openGraph: {
      title: `Slotenmakers in ${matchedCounty}`,
      description: `Overzicht van alle slotenmakers in ${matchedCounty}`,
      type: 'website',
    },
  };
}

export default async function CountyPage({ params }: PageProps) {
  const { county: countySlug } = await params;
  const counties = await getAllCounties();
  const matchedCounty = counties.find(
    c => createCountySlug(c) === countySlug
  );

  if (!matchedCounty) {
    notFound();
  }

  const facilities = await getFacilitiesByCounty(matchedCounty);

  if (facilities.length === 0) {
    notFound();
  }

  const state = facilities[0]?.state || '';
  const stateAbbr = facilities[0]?.state_abbr || '';

  // Get unique cities
  const cities = [...new Set(facilities.map((f: Facility) => f.city).filter(Boolean))].sort();

  // Calculate statistics
  const stats = {
    total: facilities.length,
    noodopening: facilities.filter((f: Facility) => f.facility_types?.some((type: string) => type.toLowerCase().includes('nood') || type.toLowerCase().includes('24'))).length,
    inbraakbeveiliging: facilities.filter((f: Facility) => f.facility_types?.some((type: string) => type.toLowerCase().includes('beveilig') || type.toLowerCase().includes('inbraak'))).length,
    autosloten: facilities.filter((f: Facility) => f.facility_types?.some((type: string) => type.toLowerCase().includes('auto'))).length,
  };

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
        name: state,
        item: `https://www.vindslotenmaker.nl/state/${createStateSlug(state)}`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: matchedCounty,
        item: `https://www.vindslotenmaker.nl/county/${countySlug}`
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
                <li>
                  <Link
                    href={`/state/${createStateSlug(state)}`}
                    className="hover:text-white transition-colors"
                  >
                    {state}
                  </Link>
                </li>
                <li>/</li>
                <li className="text-white">{matchedCounty}</li>
              </ol>
            </nav>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </div>
              <h1 className="font-serif text-4xl sm:text-5xl font-bold">
                Slotenmakers in {matchedCounty}
              </h1>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 mt-8">
              <div>
                <div className="text-3xl font-bold text-orange-300">{stats.total}</div>
                <div className="text-white/70 text-sm">Slotenmakers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-300">{cities.length}</div>
                <div className="text-white/70 text-sm">Steden</div>
              </div>
              {stats.noodopening > 0 && (
                <div>
                  <div className="text-3xl font-bold text-orange-300">{stats.noodopening}</div>
                  <div className="text-white/70 text-sm">24/7 Noodopening</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Leaderboard Ad after hero */}
        <div className="container mx-auto px-4 pt-8">
          <LeaderboardAd slot={AD_SLOTS.county.afterHero} />
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Tips Section */}
              <Card className="p-6 bg-gradient-to-r from-orange-50 to-orange-50/30 border-orange-100">
                <h2 className="font-serif text-xl font-semibold mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-orange-600" />
                  Tips voor het kiezen van een slotenmaker
                </h2>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <ChevronRight className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <span>Vraag altijd vooraf om een prijsopgave en vergelijk meerdere aanbieders</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ChevronRight className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <span>Controleer reviews en vraag naar referenties</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ChevronRight className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <span>Kies voor SKG-gecertificeerde sloten voor optimale beveiliging</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ChevronRight className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <span>Let op de responstijd bij noodgevallen - vraag naar garanties</span>
                  </li>
                </ul>
              </Card>

              {/* Service Type Cards */}
              <div>
                <h2 className="font-serif text-2xl font-semibold mb-6">Diensten in {matchedCounty}</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  <Card className="p-5 hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-orange-300">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-3">
                      <Key className="w-5 h-5 text-orange-700" />
                    </div>
                    <h3 className="font-semibold mb-2">Noodopening</h3>
                    <p className="text-sm text-muted-foreground">
                      24/7 beschikbaar voor als je buitengesloten bent. Snelle service zonder schade.
                    </p>
                  </Card>
                  <Card className="p-5 hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-orange-300">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-3">
                      <Shield className="w-5 h-5 text-orange-700" />
                    </div>
                    <h3 className="font-semibold mb-2">Inbraakbeveiliging</h3>
                    <p className="text-sm text-muted-foreground">
                      Advies en installatie van gecertificeerde sloten voor optimale veiligheid.
                    </p>
                  </Card>
                  <Card className="p-5 hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-orange-300">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-3">
                      <Clock className="w-5 h-5 text-orange-700" />
                    </div>
                    <h3 className="font-semibold mb-2">Sloten Vervangen</h3>
                    <p className="text-sm text-muted-foreground">
                      Professionele vervanging van cilindersloten en meerpuntssluitingen.
                    </p>
                  </Card>
                </div>
              </div>

              {/* All Facilities */}
              <div>
                <h2 className="font-serif text-2xl font-semibold mb-6">
                  Alle {facilities.length} slotenmaker{facilities.length !== 1 ? 's' : ''}
                </h2>
                <div className="grid gap-6 md:grid-cols-2">
                  {facilities.map((facility: Facility) => (
                    <FacilityCard key={facility.slug} facility={facility} />
                  ))}
                </div>
              </div>

              {/* Inline Ad */}
              <div className="my-8">
                <InlineAd slot={AD_SLOTS.county.inContent} />
              </div>

              {/* Cities Grid */}
              {cities.length > 1 && (
                <div>
                  <h2 className="font-serif text-2xl font-semibold mb-6">Slotenmakers per Stad</h2>
                  <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
                    {cities.map((city) => {
                      const cityFacilities = facilities.filter((f: Facility) => f.city === city);
                      return (
                        <Link
                          key={city}
                          href={`/city/${createCitySlug(city)}`}
                          className="group"
                        >
                          <Card className="h-full p-4 border-2 border-transparent hover:border-orange-300 transition-all duration-300">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-600 transition-colors">
                                <MapPin className="w-5 h-5 text-orange-700 group-hover:text-white transition-colors" />
                              </div>
                              <div>
                                <h3 className="font-semibold group-hover:text-orange-600 transition-colors">
                                  {city}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {cityFacilities.length} slotenmaker{cityFacilities.length !== 1 ? 's' : ''}
                                </p>
                              </div>
                            </div>
                          </Card>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Informational Content */}
              <Card className="p-6">
                <h2 className="font-serif text-2xl font-semibold mb-4">Slotenmakers vinden in {matchedCounty}</h2>
                <div className="prose prose-lg max-w-none text-muted-foreground">
                  <p>
                    In {matchedCounty}, {state} vind je {stats.total} {stats.total !== 1 ? 'slotenmakers' : 'slotenmaker'},
                    {stats.noodopening > 0 ? ` waarvan ${stats.noodopening} met 24/7 noodservice` : ''}
                    {stats.inbraakbeveiliging > 0 ? ` en ${stats.inbraakbeveiliging} gespecialiseerd in inbraakbeveiliging` : ''}.
                    Elke slotenmaker biedt verschillende diensten en specialisaties.
                  </p>

                  <h3 className="font-serif text-xl font-semibold text-foreground mt-6 mb-3">De juiste keuze maken</h3>
                  <p>
                    Bij het kiezen van een slotenmaker zijn verschillende factoren belangrijk:
                    de beschikbaarheid (vooral bij noodgevallen), de prijs-kwaliteitverhouding,
                    het gebruik van SKG-gecertificeerde sloten, en de ervaring met jouw type slot of situatie.
                    Veel slotenmakers in {matchedCounty} bieden gratis advies en offertes.
                  </p>

                  <h3 className="font-serif text-xl font-semibold text-foreground mt-6 mb-3">Hulp nodig?</h3>
                  <p>
                    Buitengesloten of op zoek naar betere beveiliging? Neem contact op met een van de
                    slotenmakers op deze pagina. De meeste zijn snel ter plaatse en geven vooraf een
                    duidelijke prijsopgave.
                  </p>
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Quick Links */}
              <Card className="p-6 shadow-soft">
                <h3 className="font-serif text-lg font-semibold mb-4">Gerelateerde Paginas</h3>
                <ul className="space-y-3">
                  <li>
                    <Link
                      href={`/state/${createStateSlug(state)}`}
                      className="flex items-center gap-2 text-muted-foreground hover:text-orange-600 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                      Alle slotenmakers in {state}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/type/noodopening"
                      className="flex items-center gap-2 text-muted-foreground hover:text-orange-600 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                      24/7 Noodopening
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/type/inbraakbeveiliging"
                      className="flex items-center gap-2 text-muted-foreground hover:text-orange-600 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                      Inbraakbeveiliging
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/search"
                      className="flex items-center gap-2 text-muted-foreground hover:text-orange-600 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                      Zoek Slotenmaker
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/guide"
                      className="flex items-center gap-2 text-muted-foreground hover:text-orange-600 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                      Slotenmaker Gids
                    </Link>
                  </li>
                </ul>
              </Card>

              {/* Emergency CTA */}
              <Card className="p-6 shadow-soft bg-gradient-to-br from-orange-50 to-orange-50 border-orange-200">
                <h3 className="font-serif text-lg font-semibold mb-3">Buitengesloten?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Vind direct een slotenmaker in {matchedCounty} voor noodopening.
                </p>
                <Link href="/type/noodopening">
                  <Button className="w-full bg-orange-600 hover:bg-orange-700">
                    Direct Hulp
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </Card>

              {/* Sidebar Ad */}
              <SidebarAd />

              {/* Province Stats */}
              <Card className="p-6 shadow-soft">
                <h3 className="font-serif text-lg font-semibold mb-4">Over {state}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {matchedCounty} ligt in {state}. Bekijk alle slotenmakers
                  in deze provincie voor meer opties.
                </p>
                <Link
                  href={`/state/${createStateSlug(state)}`}
                  className="text-orange-600 hover:text-orange-700 text-sm font-medium flex items-center gap-1"
                >
                  Bekijk {state}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
