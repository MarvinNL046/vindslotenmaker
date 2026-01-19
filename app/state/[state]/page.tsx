import { Metadata } from 'next';
import Link from 'next/link';
import { getAllStates, getStateBySlug, getFacilitiesByState, createCountySlug, createCitySlug, Facility } from '@/lib/data';
import { notFound } from 'next/navigation';
import { ChevronRight, Building2, ArrowRight, Key, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import LeaderboardAd from '@/components/ads/LeaderboardAd';
import InlineAd from '@/components/ads/InlineAd';
import { AD_SLOTS } from '@/lib/ad-config';

interface PageProps {
  params: Promise<{
    state: string;
  }>;
}

export async function generateStaticParams() {
  const states = await getAllStates();
  return states.map(state => ({
    state: state.slug,
  }));
}

// Revalidate pages every 24 hours
export const revalidate = 86400;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { state: stateSlug } = await params;
  const state = await getStateBySlug(stateSlug);

  if (!state) {
    return { title: 'Provincie Niet Gevonden | Vind Slotenmaker' };
  }

  return {
    title: `Slotenmakers in ${state.name} | Vind Slotenmaker`,
    description: `Vind slotenmakers in ${state.name}. Bekijk locaties, diensten, reviews en contactgegevens van slotenmakers bij jou in de buurt.`,
    openGraph: {
      title: `Slotenmakers in ${state.name}`,
      description: `Overzicht van alle slotenmakers in ${state.name}`,
      type: 'website',
    },
  };
}

export default async function StatePage({ params }: PageProps) {
  const { state: stateSlug } = await params;
  const state = await getStateBySlug(stateSlug);

  if (!state) {
    notFound();
  }

  const facilities = await getFacilitiesByState(state.name);

  // Get unique municipalities (counties) with counts
  const municipalityCounts = facilities.reduce((acc: Record<string, number>, facility: Facility) => {
    if (facility.county) {
      acc[facility.county] = (acc[facility.county] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const municipalities = Object.entries(municipalityCounts)
    .map(([municipality, count]) => ({ municipality, count }))
    .sort((a, b) => a.municipality.localeCompare(b.municipality));

  // Get unique cities with counts
  const cityCounts = facilities.reduce((acc: Record<string, number>, facility: Facility) => {
    if (facility.city) {
      acc[facility.city] = (acc[facility.city] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const cities = Object.entries(cityCounts)
    .map(([city, count]) => ({ city, count }))
    .sort((a, b) => a.city.localeCompare(b.city));

  const stateAbbr = facilities[0]?.state_abbr || '';

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
        name: 'Provincies',
        item: 'https://www.vindslotenmaker.nl/state'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: state.name,
        item: `https://www.vindslotenmaker.nl/state/${stateSlug}`
      }
    ]
  };

  // Group municipalities by first letter
  const municipalitiesByLetter = municipalities.reduce((acc, { municipality, count }) => {
    const firstLetter = municipality[0].toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push({ municipality, count });
    return acc;
  }, {} as Record<string, Array<{ municipality: string; count: number }>>);

  // Group cities by first letter (fallback when no municipality data)
  const citiesByLetter = cities.reduce((acc, { city, count }) => {
    const firstLetter = city[0].toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push({ city, count });
    return acc;
  }, {} as Record<string, Array<{ city: string; count: number }>>);

  // Determine if we should show cities instead of municipalities
  const showCities = municipalities.length === 0 && cities.length > 0;

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
                <li><Link href="/state" className="hover:text-white transition-colors">Provincies</Link></li>
                <li>/</li>
                <li className="text-white">{state.name}</li>
              </ol>
            </nav>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </div>
              <h1 className="font-serif text-4xl sm:text-5xl font-bold">
                Slotenmakers in {state.name}
              </h1>
            </div>
            <p className="text-white/80 text-lg max-w-2xl mb-8">
              Vind slotenmakers in {state.name}. Selecteer een gemeente of stad om slotenmakers in jouw buurt te bekijken.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-8">
              <div>
                <div className="text-3xl font-bold text-orange-300">{facilities.length}</div>
                <div className="text-white/70 text-sm">Slotenmakers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-300">{municipalities.length}</div>
                <div className="text-white/70 text-sm">Gemeenten</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-300">{cities.length}</div>
                <div className="text-white/70 text-sm">Steden</div>
              </div>
            </div>
          </div>
        </div>

        {/* Leaderboard Ad after hero */}
        <div className="container mx-auto px-4 pt-8">
          <LeaderboardAd slot={AD_SLOTS.state.afterHero} />
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="mb-8">
              <h2 className="font-serif text-2xl font-bold mb-2">
                {showCities ? `Steden in ${state.name}` : `Gemeenten in ${state.name}`}
              </h2>
              <p className="text-muted-foreground">
                {showCities
                  ? 'Klik op een stad om alle slotenmakers in die stad te bekijken.'
                  : 'Klik op een gemeente om alle slotenmakers in die gemeente te bekijken.'}
              </p>
            </div>

            {municipalities.length > 0 ? (
              <div className="space-y-10">
                {Object.entries(municipalitiesByLetter).map(([letter, municipalitiesInLetter]) => (
                  <div key={letter}>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="w-10 h-10 rounded-lg bg-orange-600 text-white flex items-center justify-center font-serif font-bold text-xl">
                        {letter}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {municipalitiesInLetter.length} gemeente{municipalitiesInLetter.length !== 1 ? 'n' : ''}
                      </span>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                      {municipalitiesInLetter.map(({ municipality, count }) => (
                        <Link
                          key={municipality}
                          href={`/county/${createCountySlug(municipality)}`}
                          className="group"
                        >
                          <Card className="h-full p-4 flex items-center justify-between border-2 border-transparent hover:border-orange-300 transition-all duration-300">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center group-hover:bg-orange-600 transition-colors">
                                <Building2 className="w-5 h-5 text-orange-700 group-hover:text-white transition-colors" />
                              </div>
                              <span className="font-medium group-hover:text-orange-600 transition-colors">
                                {municipality}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-orange-600">
                                {count}
                              </span>
                              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-orange-600 transition-colors" />
                            </div>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : showCities ? (
              <div className="space-y-10">
                {Object.entries(citiesByLetter).map(([letter, citiesInLetter]) => (
                  <div key={letter}>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="w-10 h-10 rounded-lg bg-orange-600 text-white flex items-center justify-center font-serif font-bold text-xl">
                        {letter}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {citiesInLetter.length} stad{citiesInLetter.length !== 1 ? 'en' : ''}
                      </span>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                      {citiesInLetter.map(({ city, count }) => (
                        <Link
                          key={city}
                          href={`/city/${createCitySlug(city)}`}
                          className="group"
                        >
                          <Card className="h-full p-4 flex items-center justify-between border-2 border-transparent hover:border-orange-300 transition-all duration-300">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center group-hover:bg-orange-600 transition-colors">
                                <MapPin className="w-5 h-5 text-orange-700 group-hover:text-white transition-colors" />
                              </div>
                              <span className="font-medium group-hover:text-orange-600 transition-colors">
                                {city}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-orange-600">
                                {count}
                              </span>
                              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-orange-600 transition-colors" />
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
                  Nog geen slotenmakers gevonden in {state.name}. We voegen continu nieuwe locaties toe.
                </p>
                <Link href="/search">
                  <Button className="bg-orange-600 hover:bg-orange-700">
                    Zoek Alle Slotenmakers
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </Card>
            )}

            {/* Inline Ad before About Section */}
            <div className="mt-12">
              <InlineAd slot={AD_SLOTS.state.inContent} />
            </div>

            {/* About Section */}
            <Card className="mt-16 p-8 bg-gradient-to-r from-orange-50 to-orange-50/30 border-orange-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                  <Key className="w-6 h-6 text-orange-700" />
                </div>
                <div>
                  <h2 className="font-serif text-xl font-semibold mb-3">Over slotenmakers in {state.name}</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    In {state.name} vind je een breed aanbod aan slotenmakers voor uiteenlopende diensten.
                    Van noodopeningen en sloten vervangen tot complete woningbeveiliging en inbraakpreventie.
                    Veel slotenmakers zijn 24/7 bereikbaar voor spoedsituaties. Vergelijk reviews en diensten
                    om de juiste slotenmaker te vinden voor jouw situatie. {state.capital && `De hoofdstad van ${state.name} is ${state.capital}.`}
                  </p>
                </div>
              </div>
            </Card>

            {/* CTA Section */}
            <div className="mt-16 text-center">
              <h2 className="font-serif text-2xl font-semibold mb-4">
                Op zoek naar een specifieke slotenmaker?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                Gebruik onze zoekfunctie om slotenmakers te vinden op naam, stad, postcode of dienst.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/search">
                  <Button className="bg-orange-600 hover:bg-orange-700">
                    Zoek Slotenmaker
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/type/noodopening">
                  <Button variant="outline" className="border-orange-200 text-orange-700 hover:bg-orange-50">
                    24/7 Noodopening
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
