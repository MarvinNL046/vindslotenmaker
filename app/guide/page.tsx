import { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, ArrowRight, Key, Lock, Shield, Home, Car, AlertTriangle, CheckCircle, Clock, Phone } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import LeaderboardAd from '@/components/ads/LeaderboardAd';
import InlineAd from '@/components/ads/InlineAd';

export const metadata: Metadata = {
  title: 'Slotenmaker Gids - Tips & Advies | Vind Slotenmaker',
  description: 'Praktische gidsen en tips over slotenmakers, woningbeveiliging, wat te doen bij buitensluiting, en hoe je de juiste slotenmaker kiest.',
  openGraph: {
    title: 'Slotenmaker Gids - Tips & Advies',
    description: 'Praktische gidsen en tips over slotenmakers en woningbeveiliging.',
    type: 'website',
  },
};

const guides = [
  {
    title: 'Buitengesloten: Wat Nu?',
    slug: 'buitengesloten-wat-nu',
    description: 'Stap-voor-stap gids voor als je buitengesloten bent. Wat te doen, wie te bellen, en hoe je oplichters vermijdt.',
    icon: Key,
    category: 'Noodgevallen',
    readTime: '5 min',
    featured: true,
  },
  {
    title: 'SKG Keurmerk Uitgelegd',
    slug: 'skg-keurmerk-uitgelegd',
    description: 'Alles over SKG-gecertificeerde sloten. Wat betekenen de sterren en welk niveau heb je nodig?',
    icon: Shield,
    category: 'Beveiliging',
    readTime: '7 min',
    featured: true,
  },
  {
    title: 'Woningbeveiliging Tips',
    slug: 'woningbeveiliging-tips',
    description: 'Praktische tips om je woning beter te beveiligen tegen inbraak. Van sloten tot gedragstips.',
    icon: Home,
    category: 'Beveiliging',
    readTime: '10 min',
    featured: true,
  },
  {
    title: 'De Juiste Slotenmaker Kiezen',
    slug: 'juiste-slotenmaker-kiezen',
    description: 'Hoe herken je een betrouwbare slotenmaker? Tips om oplichters te vermijden en eerlijke prijzen te krijgen.',
    icon: CheckCircle,
    category: 'Advies',
    readTime: '6 min',
    featured: false,
  },
  {
    title: 'Autosleutel Kwijt of Kapot',
    slug: 'autosleutel-kwijt-kapot',
    description: 'Wat te doen als je autosleutel kwijt of kapot is. Opties, kosten en tips voor moderne auto\'s.',
    icon: Car,
    category: 'Auto',
    readTime: '5 min',
    featured: false,
  },
  {
    title: 'Sloten Vervangen na Verhuizing',
    slug: 'sloten-vervangen-verhuizing',
    description: 'Waarom je sloten moet vervangen na een verhuizing en waar je op moet letten.',
    icon: Lock,
    category: 'Advies',
    readTime: '4 min',
    featured: false,
  },
  {
    title: 'Prijzen Slotenmaker 2024',
    slug: 'prijzen-slotenmaker',
    description: 'Wat kost een slotenmaker? Overzicht van gemiddelde prijzen voor noodopening, sloten vervangen en meer.',
    icon: Clock,
    category: 'Kosten',
    readTime: '6 min',
    featured: false,
  },
  {
    title: 'Oplichters Herkennen',
    slug: 'slotenmaker-oplichters-herkennen',
    description: 'Hoe herken je malafide slotenmakers? Waarschuwingssignalen en tips om jezelf te beschermen.',
    icon: AlertTriangle,
    category: 'Waarschuwing',
    readTime: '5 min',
    featured: false,
  },
];

const categories = [
  { name: 'Alle Gidsen', count: guides.length },
  { name: 'Noodgevallen', count: guides.filter(g => g.category === 'Noodgevallen').length },
  { name: 'Beveiliging', count: guides.filter(g => g.category === 'Beveiliging').length },
  { name: 'Advies', count: guides.filter(g => g.category === 'Advies').length },
  { name: 'Kosten', count: guides.filter(g => g.category === 'Kosten').length },
];

export default function GuidesPage() {
  const featuredGuides = guides.filter(g => g.featured);
  const otherGuides = guides.filter(g => !g.featured);

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
              <li className="text-white">Gidsen</li>
            </ol>
          </nav>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold">
              Slotenmaker Gidsen
            </h1>
          </div>
          <p className="text-white/80 text-lg max-w-2xl">
            Praktische gidsen en tips over slotenmakers, woningbeveiliging, en wat te doen in noodgevallen.
            Leer hoe je de juiste keuzes maakt en oplichters vermijdt.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Featured Guides */}
        <section className="mb-16">
          <h2 className="font-serif text-2xl font-semibold mb-6">Populaire Gidsen</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {featuredGuides.map((guide) => (
              <Link key={guide.slug} href={`/guide/${guide.slug}`} className="group">
                <Card className="p-6 h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-orange-200 bg-gradient-to-br from-white to-orange-50/30">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center group-hover:bg-orange-600 transition-colors">
                      <guide.icon className="w-6 h-6 text-orange-700 group-hover:text-white transition-colors" />
                    </div>
                    <span className="text-xs font-medium bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                      {guide.category}
                    </span>
                  </div>

                  <h3 className="font-serif text-lg font-semibold mb-2 group-hover:text-orange-600 transition-colors">
                    {guide.title}
                  </h3>

                  <p className="text-sm text-muted-foreground mb-4">
                    {guide.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {guide.readTime} lezen
                    </span>
                    <span className="text-sm font-medium text-orange-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                      Lees meer
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <LeaderboardAd />

        {/* All Guides */}
        <section className="mb-16">
          <h2 className="font-serif text-2xl font-semibold mb-6">Alle Gidsen</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {otherGuides.map((guide) => (
              <Link key={guide.slug} href={`/guide/${guide.slug}`} className="group">
                <Card className="p-5 h-full hover:shadow-md transition-all duration-300 hover:border-orange-200 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-100 transition-colors">
                    <guide.icon className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold group-hover:text-orange-600 transition-colors truncate">
                        {guide.title}
                      </h3>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded flex-shrink-0">
                        {guide.category}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {guide.description}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-orange-600 transition-colors flex-shrink-0" />
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <InlineAd />

        {/* Emergency CTA */}
        <section className="mb-16">
          <Card className="p-8 bg-gradient-to-br from-orange-50 to-orange-50 border-orange-200">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Phone className="w-8 h-8 text-orange-600" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="font-serif text-xl font-semibold mb-2">Buitengesloten? Direct Hulp Nodig?</h3>
                <p className="text-muted-foreground">
                  Vind direct een slotenmaker bij jou in de buurt. 24/7 beschikbaar voor noodgevallen.
                </p>
              </div>
              <Link href="/type/noodopening">
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg">
                  <Key className="w-5 h-5 mr-2" />
                  Noodopening Vinden
                </Button>
              </Link>
            </div>
          </Card>
        </section>

        {/* Quick Tips */}
        <section className="max-w-4xl mx-auto">
          <h2 className="font-serif text-2xl font-semibold mb-6 text-center">Snelle Tips</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="p-5 border-l-4 border-l-orange-500">
              <h4 className="font-semibold mb-2">Vraag Altijd om een Offerte</h4>
              <p className="text-sm text-muted-foreground">
                Een betrouwbare slotenmaker geeft vooraf een prijsindicatie. Wees alert bij zeer lage startprijzen.
              </p>
            </Card>
            <Card className="p-5 border-l-4 border-l-orange-500">
              <h4 className="font-semibold mb-2">Controleer Reviews</h4>
              <p className="text-sm text-muted-foreground">
                Lees reviews van andere klanten voordat je een slotenmaker belt. Let op recente ervaringen.
              </p>
            </Card>
            <Card className="p-5 border-l-4 border-l-orange-500">
              <h4 className="font-semibold mb-2">Bewaar een Reservesleutel</h4>
              <p className="text-sm text-muted-foreground">
                Geef een reservesleutel aan een buurman of familielid. Dit voorkomt dure noodopeningen.
              </p>
            </Card>
            <Card className="p-5 border-l-4 border-l-orange-500">
              <h4 className="font-semibold mb-2">Investeer in Goede Sloten</h4>
              <p className="text-sm text-muted-foreground">
                SKG*** sloten bieden de beste bescherming. Ze zijn verplicht voor de verzekering bij de meeste polissen.
              </p>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="mt-16 text-center">
          <h3 className="font-serif text-2xl font-semibold mb-4">Zoek een Slotenmaker</h3>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            Klaar om een betrouwbare slotenmaker te vinden? Doorzoek onze database met geverifieerde professionals.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/search">
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
                Zoek Slotenmaker
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
