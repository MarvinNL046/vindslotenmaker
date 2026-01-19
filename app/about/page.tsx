import { Metadata } from 'next';
import Link from 'next/link';
import { Info, Users, Target, CheckCircle, Key, MapPin, Shield, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Over Ons | Vind Slotenmaker',
  description: 'Leer meer over VindSlotenmaker.nl - de uitgebreide slotenmaker directory voor Nederland. Onze missie, waarden en hoe we je helpen.',
  openGraph: {
    title: 'Over Ons - Vind Slotenmaker',
    description: 'Leer meer over VindSlotenmaker.nl en onze missie.',
    type: 'website',
  },
};

const values = [
  {
    icon: CheckCircle,
    title: 'Betrouwbare Informatie',
    description: 'We controleren en updaten onze database regelmatig om actuele en correcte informatie te garanderen.',
  },
  {
    icon: Users,
    title: 'Gebruiksvriendelijk',
    description: 'Onze website is ontworpen om snel en eenvoudig een slotenmaker te vinden, ook in noodgevallen.',
  },
  {
    icon: Shield,
    title: 'Onafhankelijk',
    description: 'We zijn een onafhankelijk platform. Slotenmakers kunnen niet betalen voor een hogere positie.',
  },
  {
    icon: MapPin,
    title: 'Landelijke Dekking',
    description: 'Van Groningen tot Maastricht - we hebben slotenmakers in alle 12 provincies.',
  },
];

const stats = [
  { value: '500+', label: 'Slotenmakers' },
  { value: '12', label: 'Provincies' },
  { value: '100%', label: 'Gratis' },
  { value: '24/7', label: 'Beschikbaar' },
];

export default function AboutPage() {
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
              <li className="text-white">Over Ons</li>
            </ol>
          </nav>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
              <Info className="w-6 h-6" />
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold">
              Over Vind Slotenmaker
            </h1>
          </div>
          <p className="text-white/80 text-lg max-w-2xl">
            De uitgebreide slotenmaker directory voor heel Nederland.
            Vind snel een betrouwbare slotenmaker in jouw buurt.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Mission Section */}
        <section className="max-w-4xl mx-auto mb-16">
          <div className="flex items-start gap-4 mb-8">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Target className="w-6 h-6 text-orange-700" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-semibold mb-4">Onze Missie</h2>
              <p className="text-muted-foreground mb-4">
                Buitengesloten zijn is stressvol. Op zo&apos;n moment wil je snel een betrouwbare slotenmaker vinden,
                zonder je zorgen te maken over oplichters of woekerprijzen. Dat is waarom we VindSlotenmaker.nl hebben opgezet.
              </p>
              <p className="text-muted-foreground">
                Ons doel is simpel: iedereen in Nederland toegang geven tot betrouwbare informatie over slotenmakers.
                We verzamelen gegevens van slotenmakers in heel het land en presenteren deze op een overzichtelijke manier,
                compleet met reviews, diensten en contactgegevens.
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat) => (
              <Card key={stat.label} className="p-6 text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </Card>
            ))}
          </div>
        </section>

        {/* Values */}
        <section className="mb-16">
          <h2 className="font-serif text-2xl font-semibold mb-8 text-center">Onze Waarden</h2>
          <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
            {values.map((value) => (
              <Card key={value.title} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <value.icon className="w-5 h-5 text-orange-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-16 max-w-4xl mx-auto">
          <Card className="p-8 bg-gradient-to-br from-orange-50 to-orange-50/30 border-orange-100">
            <h2 className="font-serif text-2xl font-semibold mb-6">Hoe Het Werkt</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-semibold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Zoek op Locatie</h4>
                  <p className="text-sm text-muted-foreground">
                    Voer je stad, postcode of provincie in om slotenmakers in jouw buurt te vinden.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-semibold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Vergelijk Opties</h4>
                  <p className="text-sm text-muted-foreground">
                    Bekijk diensten, reviews en contactgegevens van verschillende slotenmakers.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-semibold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Neem Contact Op</h4>
                  <p className="text-sm text-muted-foreground">
                    Bel of stuur een bericht naar de slotenmaker van je keuze. Direct vanuit onze website.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Disclaimer */}
        <section className="mb-16 max-w-4xl mx-auto">
          <Card className="p-6 bg-gray-50 border-gray-200">
            <h3 className="font-semibold mb-3">Disclaimer</h3>
            <p className="text-sm text-muted-foreground">
              VindSlotenmaker.nl is een informatieve directory. Wij zijn niet verantwoordelijk voor de
              dienstverlening van de vermelde slotenmakers. Controleer altijd zelf de legitimiteit
              en vraag vooraf om een prijsopgave. Bij vermoeden van fraude, neem contact op met de politie.
            </p>
          </Card>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <h3 className="font-serif text-2xl font-semibold mb-4">Klaar om te Zoeken?</h3>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            Vind nu een betrouwbare slotenmaker bij jou in de buurt.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/search">
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
                <Key className="w-5 h-5 mr-2" />
                Zoek Slotenmaker
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="border-orange-200 text-orange-700 hover:bg-orange-50">
                Contact
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
