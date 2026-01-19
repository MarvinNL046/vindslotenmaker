import { MetadataRoute } from 'next'
import { getAllFacilities, getAllStates, getAllCounties, getAllCities, createCountySlug, createCitySlug, Facility } from '@/lib/data'
import { blogPosts } from '@/lib/blog-data'

// Maximum URLs per sitemap file (Google limit is 50k, we use 10k for better performance)
const MAX_URLS_PER_SITEMAP = 10000

const baseUrl = 'https://www.vindslotenmaker.nl'

// Locksmith service types for type pages
const serviceTypes = [
  'noodopening',
  'sloten-vervangen',
  'inbraakbeveiliging',
  'autosloten',
  '24-uurs-service',
  'woningbeveiliging',
  'cilindersloten',
  'elektronische-sloten',
  'bedrijfsbeveiliging',
  'kluizen',
  'sleutelservice',
  'meerpuntssluitingen',
]

// Static pages that don't change often
// Note: /search, /compare are excluded (noindex utility pages)
const staticPages = [
  { path: '', priority: 1, changeFreq: 'daily' as const },
  { path: '/state', priority: 0.9, changeFreq: 'weekly' as const },
  { path: '/type', priority: 0.8, changeFreq: 'weekly' as const },
  { path: '/blog', priority: 0.8, changeFreq: 'daily' as const },
  { path: '/about', priority: 0.5, changeFreq: 'monthly' as const },
  { path: '/contact', priority: 0.5, changeFreq: 'monthly' as const },
  { path: '/privacy', priority: 0.3, changeFreq: 'yearly' as const },
  { path: '/terms', priority: 0.3, changeFreq: 'yearly' as const },
  // Guide pages
  { path: '/guide', priority: 0.9, changeFreq: 'weekly' as const },
  { path: '/guide/buitengesloten-wat-nu', priority: 0.9, changeFreq: 'weekly' as const },
  { path: '/guide/skg-keurmerk-uitgelegd', priority: 0.9, changeFreq: 'weekly' as const },
  { path: '/guide/woningbeveiliging-tips', priority: 0.9, changeFreq: 'weekly' as const },
  { path: '/guide/juiste-slotenmaker-kiezen', priority: 0.9, changeFreq: 'weekly' as const },
  { path: '/guide/autosleutel-kwijt-kapot', priority: 0.9, changeFreq: 'weekly' as const },
  { path: '/guide/sloten-vervangen-verhuizing', priority: 0.9, changeFreq: 'weekly' as const },
  { path: '/guide/prijzen-slotenmaker', priority: 0.9, changeFreq: 'weekly' as const },
  { path: '/guide/slotenmaker-oplichters-herkennen', priority: 0.9, changeFreq: 'weekly' as const },
]

interface SitemapEntry {
  url: string
  lastModified: Date
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority: number
}

// Generate all sitemap entries
async function getAllSitemapEntries(): Promise<SitemapEntry[]> {
  const facilities: Facility[] = await getAllFacilities()
  const states = await getAllStates()
  const counties = await getAllCounties()
  const cities = await getAllCities()
  const now = new Date()

  const entries: SitemapEntry[] = []

  // Static pages
  staticPages.forEach(page => {
    entries.push({
      url: `${baseUrl}${page.path}`,
      lastModified: now,
      changeFrequency: page.changeFreq,
      priority: page.priority,
    })
  })

  // Service type pages
  serviceTypes.forEach(type => {
    entries.push({
      url: `${baseUrl}/type/${type}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.6,
    })
  })

  // Province/State pages
  states.forEach(state => {
    entries.push({
      url: `${baseUrl}/state/${state.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    })
  })

  // Municipality/County pages
  counties.forEach(county => {
    entries.push({
      url: `${baseUrl}/county/${createCountySlug(county)}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    })
  })

  // City pages
  cities.forEach(city => {
    entries.push({
      url: `${baseUrl}/city/${createCitySlug(city)}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.6,
    })
  })

  // Locksmith/Facility pages (largest portion)
  facilities.forEach(facility => {
    entries.push({
      url: `${baseUrl}/facility/${facility.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    })
  })

  // Blog posts
  blogPosts.forEach(post => {
    entries.push({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'monthly',
      priority: 0.6,
    })
  })

  return entries
}

// This function tells Next.js how many sitemaps to generate
// It runs at build time and creates sitemap/0.xml, sitemap/1.xml, etc.
export async function generateSitemaps() {
  const entries = await getAllSitemapEntries()
  const totalSitemaps = Math.ceil(entries.length / MAX_URLS_PER_SITEMAP)

  // Return an array of sitemap IDs
  return Array.from({ length: totalSitemaps }, (_, i) => ({ id: i }))
}

// Generate each individual sitemap
export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
  const entries = await getAllSitemapEntries()

  // Get the chunk for this sitemap ID
  const start = id * MAX_URLS_PER_SITEMAP
  const end = start + MAX_URLS_PER_SITEMAP
  const chunk = entries.slice(start, end)

  return chunk
}
