import { Metadata } from 'next';
import Link from 'next/link';
import { getAllCities, getFacilitiesByCity, createCitySlug, createCountySlug, createStateSlug, type Facility } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Building, Info, Key, MapPin } from 'lucide-react';
import FacilityCard from '@/components/FacilityCard';
import LeaderboardAd from '@/components/ads/LeaderboardAd';
import SidebarAd from '@/components/ads/SidebarAd';
import InlineAd from '@/components/ads/InlineAd';
import { AD_SLOTS } from '@/lib/ad-config';
import { Card } from '@/components/ui/card';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Limit static generation to top 200 cities to stay under Vercel's 75MB limit
export async function generateStaticParams() {
  const cities = await getAllCities();
  // Take first 200 cities (sorted by facility count would be better but this is simpler)
  return cities.slice(0, 200).map((city) => ({
    slug: createCitySlug(city),
  }));
}

// Allow dynamic params for cities not in static params
export const dynamicParams = true;

// Revalidate pages every 24 hours
export const revalidate = 86400;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const cities = await getAllCities();
  const city = cities.find(c => createCitySlug(c) === slug);

  if (!city) {
    return {
      title: 'Stad niet gevonden',
    };
  }

  const facilities = await getFacilitiesByCity(city);
  const county = facilities[0]?.county || '';
  const state = facilities[0]?.state || '';

  return {
    title: `Slotenmakers in ${city} | Vind Slotenmaker`,
    description: `Vind alle ${facilities.length} slotenmakers in ${city}${county ? `, ${county}` : ''}, ${state}. Bekijk locaties, diensten en contactgegevens van lokale slotenmakers.`,
    openGraph: {
      title: `Slotenmakers in ${city}`,
      description: `Alle slotenmakers in ${city}${county ? `, ${county}` : ''}`,
      type: 'website',
    },
  };
}

export default async function CityPage({ params }: PageProps) {
  const { slug } = await params;
  const cities = await getAllCities();
  const city = cities.find(c => createCitySlug(c) === slug);

  if (!city) {
    notFound();
  }

  const facilities = await getFacilitiesByCity(city);

  if (facilities.length === 0) {
    notFound();
  }

  const county = facilities[0]?.county || '';
  const state = facilities[0]?.state || '';
  const stateAbbr = facilities[0]?.state_abbr || '';

  // Count facility types
  const typeCount = facilities.reduce((acc: Record<string, number>, facility: Facility) => {
    const typeName = facility.type || 'Slotenmaker';
    acc[typeName] = (acc[typeName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Slotenmakers in ${city}`,
    description: `Overzicht van alle slotenmakers in ${city}${county ? `, ${county}` : ''}`,
    breadcrumb: {
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
        ...(county ? [{
          '@type': 'ListItem',
          position: 3,
          name: county,
          item: `https://www.vindslotenmaker.nl/county/${createCountySlug(county)}`
        }] : []),
        {
          '@type': 'ListItem',
          position: county ? 4 : 3,
          name: city,
          item: `https://www.vindslotenmaker.nl/city/${slug}`
        }
      ]
    },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: facilities.length,
      itemListElement: facilities.map((facility, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `https://www.vindslotenmaker.nl/facility/${facility.slug}`
      }))
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-orange-600 via-orange-700 to-orange-800 text-white py-12">
        <div className="container mx-auto px-4">
          {/* Breadcrumb Navigation */}
          <nav className="mb-6">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-white/70">
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
              {county && (
                <>
                  <li>/</li>
                  <li>
                    <Link
                      href={`/county/${createCountySlug(county)}`}
                      className="hover:text-white transition-colors"
                    >
                      {county}
                    </Link>
                  </li>
                </>
              )}
              <li>/</li>
              <li className="text-white">{city}</li>
            </ol>
          </nav>

          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold">
              Slotenmakers in {city}
            </h1>
          </div>
          <p className="text-white/80 text-lg max-w-2xl">
            Er {facilities.length === 1 ? 'is' : 'zijn'} {facilities.length} {facilities.length === 1 ? 'slotenmaker' : 'slotenmakers'} in {city}{county ? `, ${county}` : ''}, {state}.
          </p>
        </div>
      </div>

      {/* Leaderboard Ad at top */}
      <LeaderboardAd slot={AD_SLOTS.city.topLeaderboard} className="mt-4" />

      <div className="container mx-auto px-4 py-8">
        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Key className="w-5 h-5 text-orange-700" />
              </div>
              <div>
                <p className="text-2xl font-bold">{facilities.length}</p>
                <p className="text-sm text-muted-foreground">Totaal</p>
              </div>
            </div>
          </Card>
          {Object.entries(typeCount).slice(0, 3).map(([type, count]) => (
            <Card key={type} className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                  <Info className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{count}</p>
                  <p className="text-sm text-muted-foreground capitalize">{type}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Inline Ad */}
        <InlineAd slot={AD_SLOTS.city.inFeed} />

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-4">
          <div className="lg:col-span-3">
            {/* Facility List */}
            <div className="space-y-6">
              {facilities.map((facility, index) => (
                <div key={facility.slug}>
                  <FacilityCard facility={facility} />
                  {/* Add inline ad after every 3rd facility */}
                  {(index + 1) % 3 === 0 && index !== facilities.length - 1 && (
                    <div className="mt-6">
                      <InlineAd slot={AD_SLOTS.city.inFeed} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              <SidebarAd slot={AD_SLOTS.city.sidebar} sticky={false} />

              {/* Related Links */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Gerelateerde Paginas</h3>
                <ul className="space-y-2">
                  {county && (
                    <li>
                      <Link
                        href={`/county/${createCountySlug(county)}`}
                        className="text-sm text-muted-foreground hover:text-orange-600 transition-colors"
                      >
                        Alle slotenmakers in {county}
                      </Link>
                    </li>
                  )}
                  <li>
                    <Link
                      href={`/state/${createStateSlug(state)}`}
                      className="text-sm text-muted-foreground hover:text-orange-600 transition-colors"
                    >
                      Alle slotenmakers in {state}
                    </Link>
                  </li>
                </ul>
              </Card>

              {/* Info Box */}
              <Card className="p-6 bg-orange-50 border-orange-100">
                <h3 className="text-lg font-semibold mb-2">Over {city}</h3>
                <p className="text-sm text-muted-foreground">
                  {city} ligt in {county ? `${county}, ` : ''}{state}.
                  Op deze pagina vind je een overzicht van alle slotenmakers in deze plaats.
                </p>
              </Card>
            </div>
          </div>
        </div>

        {/* SEO Content */}
        <div className="mt-12 prose prose-lg max-w-none">
          <h2 className="font-serif text-2xl font-semibold">Slotenmakers in {city}</h2>
          <p className="text-muted-foreground">
            In {city} vind je diverse slotenmakers die je kunnen helpen met noodopeningen, sloten vervangen,
            inbraakbeveiliging en meer. Elke slotenmaker biedt gespecialiseerde diensten aan.
          </p>

          {typeCount['Noodopening'] > 0 && (
            <>
              <h3 className="font-serif text-xl font-semibold mt-6">Noodopening</h3>
              <p className="text-muted-foreground">
                {city} heeft {typeCount['Noodopening']} slotenmaker{typeCount['Noodopening'] > 1 ? 's' : ''} die gespecialiseerd is/zijn in noodopeningen.
                Deze diensten zijn vaak 24/7 beschikbaar voor als je buitengesloten bent.
              </p>
            </>
          )}

          {typeCount['Inbraakbeveiliging'] > 0 && (
            <>
              <h3 className="font-serif text-xl font-semibold mt-6">Inbraakbeveiliging</h3>
              <p className="text-muted-foreground">
                Er {typeCount['Inbraakbeveiliging'] > 1 ? 'zijn' : 'is'} {typeCount['Inbraakbeveiliging']} specialist{typeCount['Inbraakbeveiliging'] > 1 ? 'en' : ''} in
                inbraakbeveiliging in {city}, die je kunnen adviseren over betere sloten en veiligheidsmaatregelen.
              </p>
            </>
          )}

          <h3 className="font-serif text-xl font-semibold mt-6">Hulp Nodig?</h3>
          <p className="text-muted-foreground">
            Voor meer informatie over een specifieke slotenmaker in {city}, klik op de vermelding hierboven.
            Daar vind je contactgegevens, diensten en reviews.
          </p>
        </div>
      </div>
    </>
  );
}
