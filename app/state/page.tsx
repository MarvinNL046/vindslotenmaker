import { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, ArrowRight, Key, Building2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import LeaderboardAd from '@/components/ads/LeaderboardAd';
import InlineAd from '@/components/ads/InlineAd';

export const metadata: Metadata = {
  title: 'Slotenmakers per Provincie | Vind Slotenmaker',
  description: 'Vind slotenmakers in alle 12 Nederlandse provincies. Zoek op provincie voor lokale slotenmakers in jouw regio.',
  openGraph: {
    title: 'Slotenmakers per Provincie',
    description: 'Vind slotenmakers in alle 12 Nederlandse provincies.',
    type: 'website',
  },
};

// All Dutch provinces with their data
const provinces = [
  {
    name: 'Noord-Holland',
    slug: 'noord-holland',
    abbr: 'NH',
    capital: 'Haarlem',
    majorCities: ['Amsterdam', 'Haarlem', 'Zaandam', 'Alkmaar', 'Hilversum'],
    population: '2.9 miljoen',
  },
  {
    name: 'Zuid-Holland',
    slug: 'zuid-holland',
    abbr: 'ZH',
    capital: 'Den Haag',
    majorCities: ['Rotterdam', 'Den Haag', 'Leiden', 'Dordrecht', 'Zoetermeer'],
    population: '3.7 miljoen',
  },
  {
    name: 'Utrecht',
    slug: 'utrecht',
    abbr: 'UT',
    capital: 'Utrecht',
    majorCities: ['Utrecht', 'Amersfoort', 'Nieuwegein', 'Zeist', 'Veenendaal'],
    population: '1.4 miljoen',
  },
  {
    name: 'Noord-Brabant',
    slug: 'noord-brabant',
    abbr: 'NB',
    capital: 'Den Bosch',
    majorCities: ['Eindhoven', 'Tilburg', 'Breda', 'Den Bosch', 'Helmond'],
    population: '2.6 miljoen',
  },
  {
    name: 'Gelderland',
    slug: 'gelderland',
    abbr: 'GE',
    capital: 'Arnhem',
    majorCities: ['Arnhem', 'Nijmegen', 'Apeldoorn', 'Ede', 'Doetinchem'],
    population: '2.1 miljoen',
  },
  {
    name: 'Limburg',
    slug: 'limburg',
    abbr: 'LI',
    capital: 'Maastricht',
    majorCities: ['Maastricht', 'Venlo', 'Heerlen', 'Sittard', 'Roermond'],
    population: '1.1 miljoen',
  },
  {
    name: 'Overijssel',
    slug: 'overijssel',
    abbr: 'OV',
    capital: 'Zwolle',
    majorCities: ['Zwolle', 'Enschede', 'Deventer', 'Hengelo', 'Almelo'],
    population: '1.2 miljoen',
  },
  {
    name: 'Groningen',
    slug: 'groningen',
    abbr: 'GR',
    capital: 'Groningen',
    majorCities: ['Groningen', 'Hoogezand', 'Veendam', 'Winschoten'],
    population: '585.000',
  },
  {
    name: 'Friesland',
    slug: 'friesland',
    abbr: 'FR',
    capital: 'Leeuwarden',
    majorCities: ['Leeuwarden', 'Drachten', 'Sneek', 'Heerenveen'],
    population: '650.000',
  },
  {
    name: 'Drenthe',
    slug: 'drenthe',
    abbr: 'DR',
    capital: 'Assen',
    majorCities: ['Assen', 'Emmen', 'Hoogeveen', 'Meppel'],
    population: '495.000',
  },
  {
    name: 'Flevoland',
    slug: 'flevoland',
    abbr: 'FL',
    capital: 'Lelystad',
    majorCities: ['Almere', 'Lelystad', 'Dronten', 'Zeewolde'],
    population: '430.000',
  },
  {
    name: 'Zeeland',
    slug: 'zeeland',
    abbr: 'ZE',
    capital: 'Middelburg',
    majorCities: ['Middelburg', 'Vlissingen', 'Goes', 'Terneuzen'],
    population: '385.000',
  },
];

export default function StatesPage() {
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
              <li className="text-white">Provincies</li>
            </ol>
          </nav>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold">
              Slotenmakers per Provincie
            </h1>
          </div>
          <p className="text-white/80 text-lg max-w-2xl">
            Vind slotenmakers in alle 12 Nederlandse provincies. Klik op een provincie om alle slotenmakers in jouw regio te bekijken.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Province Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {provinces.map((province) => (
            <Link key={province.slug} href={`/state/${province.slug}`} className="group">
              <Card className="p-6 h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-orange-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center group-hover:bg-orange-600 transition-colors">
                    <MapPin className="w-6 h-6 text-orange-700 group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-sm font-mono text-muted-foreground bg-gray-100 px-2 py-1 rounded">
                    {province.abbr}
                  </span>
                </div>

                <h2 className="font-serif text-xl font-semibold mb-2 group-hover:text-orange-600 transition-colors">
                  {province.name}
                </h2>

                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                  <p>
                    <span className="font-medium">Hoofdstad:</span> {province.capital}
                  </p>
                  <p>
                    <span className="font-medium">Inwoners:</span> {province.population}
                  </p>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-muted-foreground mb-2">Grote steden:</p>
                  <div className="flex flex-wrap gap-1">
                    {province.majorCities.slice(0, 4).map((city) => (
                      <span key={city} className="text-xs bg-orange-50 text-orange-700 px-2 py-0.5 rounded">
                        {city}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-1 text-sm font-medium text-orange-600 group-hover:gap-2 transition-all">
                  Bekijk slotenmakers
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Card>
            </Link>
          ))}
        </div>

        <LeaderboardAd className="mt-12" />

        {/* Info Section */}
        <section className="mt-16 max-w-4xl mx-auto">
          <Card className="p-8 bg-gradient-to-br from-orange-50 to-orange-50/30 border-orange-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Key className="w-6 h-6 text-orange-700" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-semibold mb-3">Waarom zoeken op provincie?</h3>
                <p className="text-muted-foreground mb-4">
                  Door te zoeken op provincie vind je gemakkelijk slotenmakers in jouw regio. Dit is handig als je:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                    Een lokale slotenmaker zoekt die snel ter plaatse kan zijn
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                    Prijzen wilt vergelijken van slotenmakers in je buurt
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                    Reviews van lokale klanten wilt lezen
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </section>

        <InlineAd className="mt-12" />

        {/* Quick Links */}
        <section className="mt-16 max-w-4xl mx-auto text-center">
          <h3 className="font-serif text-2xl font-semibold mb-6">Andere manieren om te zoeken</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/search">
              <Button variant="outline" className="border-orange-200 text-orange-700 hover:bg-orange-50">
                Zoek op Stad
              </Button>
            </Link>
            <Link href="/type">
              <Button variant="outline" className="border-orange-200 text-orange-700 hover:bg-orange-50">
                Zoek op Dienst
              </Button>
            </Link>
            <Link href="/type/noodopening">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                24/7 Noodopening
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
