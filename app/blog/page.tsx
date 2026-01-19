import { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight, BookOpen, Tag, Key } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import LeaderboardAd from '@/components/ads/LeaderboardAd';
import InlineAd from '@/components/ads/InlineAd';
import PremiumContentBanner from '@/components/PremiumContentBanner';
import { blogPosts, categories } from '@/lib/blog-data';

// Placeholder images for blog posts (locksmith themed)
const blogImages = [
  '/images/blog/locksmith-service.jpg',
  '/images/blog/home-security.jpg',
  '/images/blog/door-lock.jpg',
  '/images/blog/key-service.jpg',
  '/images/blog/security-advice.jpg',
  '/images/blog/lock-repair.jpg',
  '/images/blog/emergency-locksmith.jpg',
  '/images/blog/safe-locks.jpg',
];

// Helper function to get a placeholder image based on post index
function getPlaceholderImage(index: number): string {
  return blogImages[index % blogImages.length];
}

export const metadata: Metadata = {
  title: 'Blog | Vind Slotenmaker - Tips & Advies over Sloten en Beveiliging',
  description: 'Artikelen over slotenmakers, woningbeveiliging, sloten kiezen, en tips voor noodgevallen. Praktische gidsen van experts.',
  keywords: 'slotenmaker blog, beveiliging tips, sloten advies, SKG sloten, woningbeveiliging, inbraakpreventie, noodopening tips',
  authors: [{ name: 'Vind Slotenmaker' }],
  openGraph: {
    title: 'Blog - Vind Slotenmaker',
    description: 'Artikelen en tips over slotenmakers, beveiliging en sloten',
    type: 'website',
    siteName: 'Vind Slotenmaker',
    locale: 'nl_NL',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog - Vind Slotenmaker',
    description: 'Artikelen en tips over slotenmakers en beveiliging',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background">
      <LeaderboardAd />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-orange-600 via-orange-700 to-orange-800 text-white py-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <ol className="flex items-center space-x-2 text-sm text-white/70">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li>/</li>
              <li className="text-white">Blog</li>
            </ol>
          </nav>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold">
              Slotenmaker Blog
            </h1>
          </div>
          <p className="text-white/80 text-lg max-w-2xl">
            Tips over slotenmakers, woningbeveiliging en wat te doen bij noodgevallen.
            Praktische gidsen van beveiligingsexperts.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap gap-8 mt-8">
            <div>
              <div className="text-3xl font-bold text-orange-300">{blogPosts.length}</div>
              <div className="text-white/70 text-sm">Artikelen</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-300">{categories.length}</div>
              <div className="text-white/70 text-sm">Categorieen</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-8 lg:grid-cols-4">
            {/* Sidebar */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <Card className="p-6 shadow-soft sticky top-4">
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="w-5 h-5 text-orange-600" />
                  <h3 className="font-serif font-semibold">Categorieen</h3>
                </div>
                <ul className="space-y-3">
                  {categories.map((category) => (
                    <li key={category.name}>
                      <button className="text-sm text-muted-foreground hover:text-orange-600 transition-colors flex justify-between w-full group">
                        <span className="group-hover:translate-x-1 transition-transform">{category.name}</span>
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                          {category.count}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            {/* Blog posts */}
            <div className="lg:col-span-3 space-y-8 order-1 lg:order-2">
              {/* Featured post */}
              <Card className="overflow-hidden shadow-soft border-2 border-transparent hover:border-orange-300 transition-all duration-300">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="relative bg-orange-50 aspect-video md:aspect-auto flex items-center justify-center">
                    <Key className="w-24 h-24 text-orange-300" />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-orange-600 text-white text-xs font-semibold rounded-full">
                        UITGELICHT
                      </span>
                    </div>
                  </div>
                  <div className="p-6 md:p-8 flex flex-col justify-center">
                    <span className="text-xs text-orange-600 font-medium mb-2">{blogPosts[0]?.category || 'Advies'}</span>
                    <h2 className="font-serif text-2xl font-bold mb-3">
                      <Link href={`/blog/${blogPosts[0]?.slug || '#'}`} className="hover:text-orange-600 transition-colors">
                        {blogPosts[0]?.title || 'Hoe kies je de juiste slotenmaker?'}
                      </Link>
                    </h2>
                    <p className="text-muted-foreground mb-4">{blogPosts[0]?.excerpt || 'Tips en advies voor het kiezen van een betrouwbare slotenmaker in jouw regio.'}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {blogPosts[0] ? new Date(blogPosts[0].date).toLocaleDateString('nl-NL') : new Date().toLocaleDateString('nl-NL')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {blogPosts[0]?.readTime || '5 min'}
                      </span>
                    </div>
                    <Link
                      href={`/blog/${blogPosts[0]?.slug || '#'}`}
                      className="mt-6 inline-flex items-center gap-2 text-orange-600 font-medium hover:underline"
                    >
                      Lees artikel
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </Card>

              <InlineAd />

              {/* Regular posts grid */}
              <div className="grid gap-6 md:grid-cols-2">
                {blogPosts.slice(1).map((post) => (
                  <Card
                    key={post.id}
                    className="overflow-hidden shadow-soft border-2 border-transparent hover:border-orange-300 transition-all duration-300 group"
                  >
                    <div className="aspect-video relative overflow-hidden bg-orange-50 flex items-center justify-center">
                      <Key className="w-16 h-16 text-orange-200 group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <div className="p-6">
                      <span className="text-xs text-orange-600 font-medium">{post.category}</span>
                      <h3 className="font-serif text-xl font-semibold mt-2 mb-3">
                        <Link href={`/blog/${post.slug}`} className="hover:text-orange-600 transition-colors">
                          {post.title}
                        </Link>
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(post.date).toLocaleDateString('nl-NL')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {post.readTime}
                          </span>
                        </div>
                        <Link
                          href={`/blog/${post.slug}`}
                          className="text-orange-600 hover:underline text-sm flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Lees meer
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <InlineAd />

              {/* Premium Content Banner */}
              <PremiumContentBanner />

              {/* Newsletter signup */}
              <Card className="p-8 shadow-soft bg-gradient-to-r from-orange-50 to-orange-50/30 border-orange-100 text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-serif text-2xl font-semibold mb-3">Blijf op de hoogte</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Ontvang maandelijks tips over woningbeveiliging, nieuws over sloten
                  en advies van slotenmaker experts.
                </p>
                <form className="max-w-md mx-auto flex gap-2">
                  <input
                    type="email"
                    placeholder="Jouw e-mailadres"
                    className="flex-1 px-4 py-2 border-2 border-orange-200 rounded-lg focus:outline-none focus:border-orange-500 bg-background"
                  />
                  <button
                    type="submit"
                    className="px-6 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors"
                  >
                    Aanmelden
                  </button>
                </form>
              </Card>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <h2 className="font-serif text-2xl font-semibold mb-4">
              Op zoek naar een slotenmaker?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              Vind betrouwbare slotenmakers bij jou in de buurt. Vergelijk diensten en reviews.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/search">
                <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
                  Zoek Slotenmaker
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/type/noodopening">
                <Button variant="outline" size="lg" className="border-orange-200 text-orange-700 hover:bg-orange-50">
                  24/7 Noodopening
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
