'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Heart, Building2, Phone, Star, ArrowRight, Users, Award, Clock, Search, ChevronRight, Shield, Key, Home, Lock, CheckCircle2, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import FAQSection from '@/components/FAQSection';
import { SITE_STATS, getComprehensiveDataText } from '@/lib/stats-config';
import OptimizedAd from '@/components/ads/OptimizedAd';
import MultiplexAd from '@/components/ads/MultiplexAd';
import { AD_SLOTS } from '@/lib/ad-config';

// Unsplash images for locksmith theme
const heroImages = {
  main: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80',
  locksmith: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
  security: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=800&q=80',
  door: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=800&q=80',
  keys: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800&q=80',
};

interface Stats {
  totalFacilities: number;
  totalStates: number;
  totalCities: number;
  totalCounties: number;
}

// Featured provinces (Nederlandse provincies)
const featuredProvinces = [
  {
    name: 'Noord-Holland',
    slug: 'noord-holland',
    abbr: 'NH',
    highlight: 'Amsterdam, Haarlem, Zaandam'
  },
  {
    name: 'Zuid-Holland',
    slug: 'zuid-holland',
    abbr: 'ZH',
    highlight: 'Rotterdam, Den Haag, Leiden'
  },
  {
    name: 'Noord-Brabant',
    slug: 'noord-brabant',
    abbr: 'NB',
    highlight: 'Eindhoven, Tilburg, Breda'
  },
  {
    name: 'Gelderland',
    slug: 'gelderland',
    abbr: 'GE',
    highlight: 'Arnhem, Nijmegen, Apeldoorn'
  },
  {
    name: 'Utrecht',
    slug: 'utrecht',
    abbr: 'UT',
    highlight: 'Utrecht, Amersfoort, Nieuwegein'
  },
  {
    name: 'Limburg',
    slug: 'limburg',
    abbr: 'LI',
    highlight: 'Maastricht, Venlo, Heerlen'
  }
];

const serviceCategories = [
  {
    title: 'Noodopening',
    description: '24/7 beschikbaar voor als je buitengesloten bent. Snelle service zonder schade aan je slot.',
    icon: Key,
    href: '/type/noodopening',
    color: 'bg-orange-100 text-orange-700'
  },
  {
    title: 'Sloten Vervangen',
    description: 'Professionele vervanging van cilindersloten, veiligheidssloten en meerpuntssluitingen.',
    icon: Lock,
    href: '/type/sloten-vervangen',
    color: 'bg-orange-100 text-orange-600'
  },
  {
    title: 'Inbraakbeveiliging',
    description: 'Laat je woning of bedrijf beveiligen met gecertificeerde sloten en extra veiligheidsmaatregelen.',
    icon: Shield,
    href: '/type/inbraakbeveiliging',
    color: 'bg-orange-50 text-orange-600'
  }
];

const userTestimonials = [
  {
    name: 'Peter V.',
    location: 'Amsterdam',
    quote: 'Dankzij deze website vond ik binnen 5 minuten een slotenmaker die dezelfde avond nog kon komen. Uitstekende service!',
    rating: 5
  },
  {
    name: 'Maria K.',
    location: 'Rotterdam',
    quote: 'Na een inbraak wilde ik betere sloten. Via deze site vond ik een gecertificeerde slotenmaker die me goed adviseerde.',
    rating: 5
  },
  {
    name: 'Jan de B.',
    location: 'Utrecht',
    quote: 'Buitengesloten op zondagavond, maar dankzij de 24/7 service was ik binnen een uur weer binnen. Aanrader!',
    rating: 5
  }
];

export default function HomePage() {
  const [stats, setStats] = useState<Stats>({
    totalFacilities: 0,
    totalStates: 0,
    totalCities: 0,
    totalCounties: 0
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Load stats from API
    async function loadStats() {
      try {
        const response = await fetch('/api/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    }
    loadStats();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[700px] lg:min-h-[800px] overflow-hidden">
        {/* Background Gradient - Orange/Dark Gray Theme */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800" />

        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
          <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-white/5 rounded-full blur-2xl" />
        </div>

        {/* Subtle Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[length:32px_32px]" />
        </div>

        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Trust Badge */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm border border-white/20">
                <Shield className="w-4 h-4 text-orange-400" />
                <span>Betrouwbare slotenmakers in heel Nederland</span>
              </div>
            </div>

            <div className="text-center text-white">
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight">
                Vind een Slotenmaker
                <span className="block mt-2 bg-gradient-to-r from-orange-400 to-orange-300 bg-clip-text text-transparent">
                  Bij Jou in de Buurt
                </span>
              </h1>
              <p className="text-lg md:text-xl text-white/80 mb-10 max-w-3xl mx-auto leading-relaxed">
                Buitengesloten? Sloten vervangen? Inbraakbeveiliging nodig?
                Vind snel een betrouwbare slotenmaker in jouw regio.
                Vergelijk prijzen en reviews.
              </p>

              {/* Search Form */}
              <form onSubmit={handleSearch} className="max-w-3xl mx-auto mb-8">
                <div className="flex flex-col sm:flex-row gap-3 p-2 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                  <div className="relative flex-1">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-600" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Voer je stad of postcode in..."
                      className="w-full pl-12 pr-4 py-4 rounded-xl bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-lg"
                    />
                  </div>
                  <Button size="lg" type="submit" className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/30 transition-all hover:shadow-xl hover:shadow-orange-500/40">
                    <Search className="w-5 h-5 mr-2" />
                    Zoek Slotenmaker
                  </Button>
                </div>
              </form>

              {/* Quick Links */}
              <div className="flex flex-wrap justify-center gap-3 text-sm mb-12">
                <Link href="/state" className="px-5 py-2.5 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all text-white border border-white/20 hover:border-white/40">
                  Zoek op Provincie
                </Link>
                <Link href="/type/noodopening" className="px-5 py-2.5 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all text-white border border-white/20 hover:border-white/40">
                  Noodopening
                </Link>
                <Link href="/type/sloten-vervangen" className="px-5 py-2.5 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all text-white border border-white/20 hover:border-white/40">
                  Sloten Vervangen
                </Link>
                <Link href="/guide" className="px-5 py-2.5 bg-orange-500/20 backdrop-blur-sm rounded-full hover:bg-orange-500/30 transition-all text-orange-200 border border-orange-400/30 hover:border-orange-400/50">
                  Tips & Advies
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto mb-10">
                <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                    {stats.totalFacilities > 0 ? stats.totalFacilities.toLocaleString('nl-NL') : '500+'}
                  </div>
                  <div className="text-sm text-white/70">Slotenmakers</div>
                </div>
                <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-1">12</div>
                  <div className="text-sm text-white/70">Provincies</div>
                </div>
                <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-1">24/7</div>
                  <div className="text-sm text-white/70">Beschikbaar</div>
                </div>
                <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-1">100%</div>
                  <div className="text-sm text-white/70">Gratis Zoeken</div>
                </div>
              </div>

              {/* Emergency Banner */}
              <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-5 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-orange-700" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-gray-600 font-medium">Spoed? Direct hulp nodig?</p>
                    <p className="text-xs text-gray-500">24/7 slotenmakers beschikbaar</p>
                  </div>
                </div>
                <Link
                  href="/type/noodopening"
                  className="flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-gray-700 text-white font-bold rounded-xl transition-colors shadow-lg"
                >
                  <Key className="w-5 h-5" />
                  Noodopening Aanvragen
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left - Content */}
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-full text-orange-700 text-sm font-medium mb-6">
                  <CheckCircle2 className="w-4 h-4" />
                  Betrouwbaar Platform
                </div>
                <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                  De Juiste Slotenmaker Vinden Hoeft Niet Moeilijk Te Zijn
                </h2>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Wij geloven dat iedereen snel toegang moet hebben tot een betrouwbare slotenmaker.
                  Onze uitgebreide database maakt het eenvoudig om slotenmakers te vinden, vergelijken en contact op te nemen.
                </p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4 text-orange-600" />
                    </div>
                    <span className="text-gray-700">Geverifieerde slotenmakers met reviews</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4 text-orange-600" />
                    </div>
                    <span className="text-gray-700">Filter op locatie, service en beschikbaarheid</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4 text-orange-600" />
                    </div>
                    <span className="text-gray-700">Gratis service - geen registratie vereist</span>
                  </li>
                </ul>
                <div className="flex flex-wrap gap-4">
                  <Link href="/search">
                    <Button size="lg" className="bg-orange-600 hover:bg-gray-700">
                      Start Je Zoekopdracht
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <Link href="/guide">
                    <Button variant="outline" size="lg" className="border-orange-200 text-orange-700 hover:bg-orange-50">
                      Tips & Advies
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right - Image Grid */}
              <div className="relative">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl bg-orange-100 flex items-center justify-center">
                      <Key className="w-16 h-16 text-orange-600" />
                    </div>
                    <div className="relative aspect-square rounded-2xl overflow-hidden shadow-xl bg-orange-100 flex items-center justify-center">
                      <Lock className="w-16 h-16 text-orange-600" />
                    </div>
                  </div>
                  <div className="space-y-4 pt-8">
                    <div className="relative aspect-square rounded-2xl overflow-hidden shadow-xl bg-orange-50 flex items-center justify-center">
                      <Shield className="w-16 h-16 text-orange-500" />
                    </div>
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl bg-gray-100 flex items-center justify-center">
                      <Home className="w-16 h-16 text-gray-600" />
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-orange-200/50 rounded-full blur-2xl" />
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-orange-200/50 rounded-full blur-2xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ad after intro section */}
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <OptimizedAd
            slot={AD_SLOTS.home.heroBelow}
            format="horizontal"
            priority={true}
            minHeight={90}
            className="max-w-[728px] mx-auto"
          />
        </div>
      </div>

      {/* Featured Service - Noodopening */}
      <section className="py-16 bg-gradient-to-br from-orange-800 via-orange-700 to-orange-900 text-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left - Content */}
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 rounded-full text-orange-300 text-sm font-medium mb-6">
                <Key className="w-4 h-4" />
                24/7 Spoedservice
              </div>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Noodopening
              </h2>
              <p className="text-lg text-white/80 mb-6 leading-relaxed">
                Buitengesloten? Geen paniek! Onze aangesloten slotenmakers zijn 24/7 beschikbaar
                voor noodopeningen. Binnen 30 minuten ter plaatse in de meeste regio&apos;s.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-white/80">
                  <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center">
                    <ChevronRight className="w-4 h-4 text-orange-300" />
                  </div>
                  24/7 beschikbaar, ook in het weekend
                </li>
                <li className="flex items-center gap-3 text-white/80">
                  <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center">
                    <ChevronRight className="w-4 h-4 text-orange-300" />
                  </div>
                  Meestal binnen 30 minuten ter plaatse
                </li>
                <li className="flex items-center gap-3 text-white/80">
                  <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center">
                    <ChevronRight className="w-4 h-4 text-orange-300" />
                  </div>
                  Vakkundige opening zonder schade
                </li>
              </ul>
              <Link href="/type/noodopening">
                <Button size="lg" className="group bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/30">
                  Vind Noodopening Service
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            {/* Right - Visual */}
            <div className="order-1 lg:order-2 relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 flex items-center justify-center">
                <Key className="w-48 h-48 text-white/20" />
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-orange-500/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-orange-500/30 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Provinces */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Zoek op Provincie
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Vind slotenmakers in jouw provincie of doorzoek onze complete database.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {featuredProvinces.map((province) => (
              <Link key={province.slug} href={`/state/${province.slug}`} className="group">
                <Card className="p-6 h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-gray-100">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center group-hover:bg-orange-600 transition-colors">
                      <MapPin className="w-6 h-6 text-orange-700 group-hover:text-white transition-colors" />
                    </div>
                    <span className="text-sm font-mono text-muted-foreground">{province.abbr}</span>
                  </div>
                  <h3 className="font-serif text-xl font-semibold mb-2 group-hover:text-orange-600 transition-colors">
                    {province.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {province.highlight}
                  </p>
                  <span className="text-sm font-medium text-orange-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                    Bekijk slotenmakers
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/state">
              <Button variant="outline" size="lg" className="border-orange-200 text-orange-700 hover:bg-orange-50">
                Bekijk Alle 12 Provincies
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Service - Sloten Vervangen */}
      <section className="py-16 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left - Visual */}
            <div className="relative">
              <div className="bg-orange-50 rounded-3xl p-12 flex items-center justify-center">
                <Lock className="w-48 h-48 text-orange-200" />
              </div>
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-orange-100 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-orange-100 rounded-full blur-2xl" />
            </div>

            {/* Right - Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-full text-orange-600 text-sm font-medium mb-6">
                <Lock className="w-4 h-4" />
                Vakkundig Uitgevoerd
              </div>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Sloten Vervangen
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Verouderde sloten? Net verhuisd? Of gewoon extra beveiliging nodig?
                Onze slotenmakers adviseren en plaatsen alle soorten sloten, van cilindersloten tot meerpuntssluitingen.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-muted-foreground">
                  <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center">
                    <ChevronRight className="w-4 h-4 text-orange-700" />
                  </div>
                  Cilindersloten en veiligheidssloten
                </li>
                <li className="flex items-center gap-3 text-muted-foreground">
                  <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center">
                    <ChevronRight className="w-4 h-4 text-orange-700" />
                  </div>
                  SKG-gecertificeerde sloten
                </li>
                <li className="flex items-center gap-3 text-muted-foreground">
                  <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center">
                    <ChevronRight className="w-4 h-4 text-orange-700" />
                  </div>
                  Persoonlijk advies op maat
                </li>
              </ul>
              <Link href="/type/sloten-vervangen">
                <Button size="lg" className="group bg-orange-600 hover:bg-gray-700">
                  Vind Slotenvervanger
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Service - Inbraakbeveiliging */}
      <section className="py-16 bg-orange-50 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left - Content */}
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-full text-orange-700 text-sm font-medium mb-6">
                <Shield className="w-4 h-4" />
                Preventief Beveiligen
              </div>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Inbraakbeveiliging
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Voorkom inbraak met professionele beveiliging. Onze slotenmakers adviseren over en installeren
                gecertificeerde sloten, extra grendels, raambeveiliging en meer.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-muted-foreground">
                  <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center">
                    <ChevronRight className="w-4 h-4 text-orange-700" />
                  </div>
                  SKG*** gecertificeerde sloten
                </li>
                <li className="flex items-center gap-3 text-muted-foreground">
                  <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center">
                    <ChevronRight className="w-4 h-4 text-orange-700" />
                  </div>
                  Extra grendels en nachtsloten
                </li>
                <li className="flex items-center gap-3 text-muted-foreground">
                  <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center">
                    <ChevronRight className="w-4 h-4 text-orange-700" />
                  </div>
                  Gratis adviesgesprek mogelijk
                </li>
              </ul>
              <Link href="/type/inbraakbeveiliging">
                <Button size="lg" className="group bg-orange-500 hover:bg-orange-600 shadow-lg">
                  Vind Beveiligingsspecialist
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            {/* Right - Visual */}
            <div className="order-1 lg:order-2 relative">
              <div className="bg-white rounded-3xl p-12 flex items-center justify-center shadow-xl">
                <Shield className="w-48 h-48 text-orange-200" />
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-orange-200/50 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-orange-200/40 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Onze Diensten
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Verschillende services voor al je slotenproblemen. Vind de juiste specialist.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            {serviceCategories.map((category) => (
              <Link key={category.href} href={category.href} className="group">
                <Card className="p-8 h-full text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-gray-100">
                  <div className={`w-16 h-16 rounded-2xl ${category.color} flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                    <category.icon className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold mb-3 group-hover:text-orange-600 transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {category.description}
                  </p>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/type">
              <Button variant="outline" size="lg" className="border-orange-200 text-orange-700 hover:bg-orange-50">
                Bekijk Alle Diensten
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Ad before testimonials */}
      <div className="bg-white py-6">
        <div className="container mx-auto px-4">
          <OptimizedAd
            slot={AD_SLOTS.home.afterStats}
            format="horizontal"
            lazy={true}
            minHeight={90}
            className="max-w-[728px] mx-auto"
          />
        </div>
      </div>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Ervaringen van Klanten
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Lees wat anderen vonden van de slotenmakers via ons platform.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            {userTestimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 italic">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div>
                  <p className="font-medium">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Waarom VindSlotenmaker.nl?
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-14 h-14 rounded-xl bg-orange-100 flex items-center justify-center mx-auto mb-4">
                <Users className="w-7 h-7 text-orange-700" />
              </div>
              <h3 className="font-semibold mb-2">Uitgebreide Database</h3>
              <p className="text-sm text-muted-foreground">
                Honderden geverifieerde slotenmakers in alle 12 provincies.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-xl bg-orange-100 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-7 h-7 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-2">Betrouwbare Informatie</h3>
              <p className="text-sm text-muted-foreground">
                Actuele gegevens inclusief diensten, reviews en contactinfo.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-xl bg-orange-50 flex items-center justify-center mx-auto mb-4">
                <Award className="w-7 h-7 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-2">100% Gratis</h3>
              <p className="text-sm text-muted-foreground">
                Zoek, vergelijk en neem contact op zonder kosten of registratie.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection />

      {/* Multiplex Ad */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4 max-w-5xl">
          <MultiplexAd
            slot={AD_SLOTS.home.beforeFooter}
            title="Gerelateerde Informatie"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-orange-700 via-orange-600 to-orange-800 text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-orange-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-orange-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            Vind Nu een Slotenmaker
          </h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            Buitengesloten? Sloten vervangen? Inbraakbeveiliging nodig? Vind direct een betrouwbare slotenmaker bij jou in de buurt.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/search">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/30">
                Zoek Slotenmaker
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/guide">
              <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                Tips & Advies
              </Button>
            </Link>
          </div>

          {/* Quick Contact */}
          <div className="mt-10 pt-8 border-t border-white/20">
            <p className="text-white/60 mb-2">Spoed? Direct hulp nodig?</p>
            <Link href="/type/noodopening" className="text-xl font-bold text-orange-300 hover:text-orange-200">
              24/7 Noodopening Service Beschikbaar
            </Link>
            <p className="text-white/60 text-sm mt-1">Slotenmakers staan klaar om je te helpen</p>
          </div>
        </div>
      </section>
    </main>
  );
}
