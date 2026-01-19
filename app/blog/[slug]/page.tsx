import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, User, Clock, ArrowLeft, Share2, ArrowRight, BookOpen, Key } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import InlineAd from '@/components/ads/InlineAd';
import SidebarAd from '@/components/ads/SidebarAd';
import FeedbackForm from '@/components/FeedbackForm';
import { blogPosts, getRelatedPosts } from '@/lib/blog-data';
import { blogContent } from '@/lib/blog-content';

// Function to get blog post by slug
function getBlogPost(slug: string) {
  return blogPosts.find(post => post.slug === slug) || null;
}

// Function to get content for a blog post
function getPostContent(slug: string): string {
  return blogContent[slug] || '';
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return {
      title: 'Artikel niet gevonden',
    };
  }

  return {
    title: `${post.title} | Blog - Vind Slotenmaker`,
    description: post.excerpt,
    keywords: `${post.category.toLowerCase()}, slotenmaker, sloten, beveiliging, ${post.title.toLowerCase().split(' ').slice(0, 3).join(', ')}`,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      authors: [post.author],
      publishedTime: post.date,
      siteName: 'Vind Slotenmaker',
      locale: 'nl_NL',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
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
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const content = getPostContent(post.slug);
  const relatedPosts = getRelatedPosts(post.slug, post.category, 3);

  // JSON-LD structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    author: {
      '@type': 'Organization',
      name: post.author,
    },
    datePublished: post.date,
    dateModified: post.date,
    publisher: {
      '@type': 'Organization',
      name: 'Vind Slotenmaker',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.vindslotenmaker.nl/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.vindslotenmaker.nl/blog/${slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-orange-600 via-orange-700 to-orange-800 text-white py-12">
          <div className="container mx-auto px-4">
            {/* Breadcrumb */}
            <nav className="mb-6">
              <ol className="flex items-center space-x-2 text-sm text-white/70">
                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                <li>/</li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li>/</li>
                <li className="text-white line-clamp-1 max-w-[200px]">{post.title}</li>
              </ol>
            </nav>

            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Terug naar blog
            </Link>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 max-w-4xl">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-white/70">
              <span className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                {post.author}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(post.date).toLocaleDateString('nl-NL', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {post.readTime} leestijd
              </span>
              <span className="px-3 py-1 bg-orange-500 text-white rounded-full text-xs font-medium">
                {post.category}
              </span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid gap-8 lg:grid-cols-4">
              {/* Main Article */}
              <article className="lg:col-span-3">
                {post.image && (
                  <Card className="overflow-hidden shadow-soft mb-8">
                    <div className="aspect-video bg-muted relative overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  </Card>
                )}

                <Card className="p-8 shadow-soft mb-8">
                  <div
                    className="prose prose-lg max-w-none
                      prose-headings:font-serif prose-headings:font-bold prose-headings:text-foreground
                      prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                      prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                      prose-p:text-muted-foreground prose-p:leading-relaxed
                      prose-a:text-orange-600 prose-a:no-underline hover:prose-a:underline
                      prose-ul:space-y-2 prose-li:text-muted-foreground
                      prose-img:rounded-lg prose-img:shadow-soft
                      prose-strong:text-foreground"
                    dangerouslySetInnerHTML={{ __html: content }}
                  />
                </Card>

                <InlineAd />

                {/* Share buttons */}
                <Card className="p-6 shadow-soft mb-8">
                  <h3 className="font-serif font-semibold mb-4 flex items-center gap-2">
                    <Share2 className="w-5 h-5 text-orange-600" />
                    Deel dit artikel
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" className="hover:border-orange-500 hover:text-orange-600">
                      Facebook
                    </Button>
                    <Button variant="outline" size="sm" className="hover:border-orange-500 hover:text-orange-600">
                      Twitter
                    </Button>
                    <Button variant="outline" size="sm" className="hover:border-orange-500 hover:text-orange-600">
                      LinkedIn
                    </Button>
                    <Button variant="outline" size="sm" className="hover:border-orange-500 hover:text-orange-600">
                      E-mail
                    </Button>
                  </div>
                </Card>

                {/* Feedback form */}
                <FeedbackForm
                  pageTitle={post.title}
                  pageUrl={`/blog/${slug}`}
                />
              </article>

              {/* Sidebar */}
              <aside className="lg:col-span-1 space-y-6">
                <SidebarAd sticky={true} />

                {/* Related Posts */}
                <Card className="p-6 shadow-soft">
                  <h3 className="font-serif font-semibold mb-4">Gerelateerde Artikelen</h3>
                  <div className="space-y-4">
                    {relatedPosts.map((relatedPost) => (
                      <div key={relatedPost.slug} className="group">
                        <Link
                          href={`/blog/${relatedPost.slug}`}
                          className="text-sm font-medium hover:text-orange-600 transition-colors block"
                        >
                          {relatedPost.title}
                        </Link>
                        <p className="text-xs text-muted-foreground mt-1">
                          {relatedPost.readTime} leestijd
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Newsletter */}
                <Card className="p-6 shadow-soft bg-gradient-to-br from-orange-50 to-orange-50/50 border-orange-100">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                    <BookOpen className="w-5 h-5 text-orange-600" />
                  </div>
                  <h3 className="font-serif font-semibold mb-3">Nieuwsbrief</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Ontvang tips over slotenmakers en beveiliging in je inbox.
                  </p>
                  <input
                    type="email"
                    placeholder="Jouw e-mailadres"
                    className="w-full px-3 py-2 text-sm border-2 border-orange-200 rounded-lg mb-2 focus:outline-none focus:border-orange-500 bg-background"
                  />
                  <Button className="w-full bg-orange-600 text-white hover:bg-orange-700" size="sm">
                    Aanmelden
                  </Button>
                </Card>
              </aside>
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
                <Link href="/blog">
                  <Button variant="outline" size="lg" className="border-orange-200 text-orange-700 hover:bg-orange-50">
                    Meer Artikelen
                    <ArrowRight className="w-4 h-4 ml-2" />
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
