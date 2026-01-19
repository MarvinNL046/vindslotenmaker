#!/usr/bin/env npx tsx
/**
 * Netherlands Locksmith Discovery Script with Bright Data SERP API
 *
 * Searches for locksmiths (slotenmakers) across all Dutch provinces via Google Maps.
 * Covers all 12 provinces with comprehensive search queries.
 *
 * REAL-TIME DATABASE WRITES:
 * Each discovered locksmith is immediately written to Neon PostgreSQL
 * to prevent data loss on PC crash. JSON files serve as backup.
 *
 * Usage:
 *   npx tsx scripts/discovery/discover-facilities.ts                    # All pending locations
 *   npx tsx scripts/discovery/discover-facilities.ts --province Noord-Holland
 *   npx tsx scripts/discovery/discover-facilities.ts --batch 50
 *   npx tsx scripts/discovery/discover-facilities.ts --dry-run
 *   npx tsx scripts/discovery/discover-facilities.ts --resume
 *   npx tsx scripts/discovery/discover-facilities.ts --test             # Test with 3 cities
 *   npx tsx scripts/discovery/discover-facilities.ts --no-db            # Skip database writes
 */

import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import * as fs from 'fs';
import * as path from 'path';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { facilities } from '../../drizzle/schema-simple';
import { sql } from 'drizzle-orm';

// ============================================================================
// Configuration
// ============================================================================

const API_KEY = process.env.BRIGHTDATA_SERP_API_KEY || process.env.BRIGHTDATA_API_KEY;
const SERP_ZONE = process.env.BRIGHTDATA_DISCOVERY_ZONE || process.env.BRIGHTDATA_SERP_ZONE || 'mcp_unlocker';

const SERP_API_URL = 'https://api.brightdata.com/request';

const DATA_DIR = path.join(process.cwd(), 'data', 'discovery');
const LOCATIONS_FILE = path.join(DATA_DIR, 'locations.json');
const PROGRESS_FILE = path.join(DATA_DIR, 'progress.json');
const RESULTS_FILE = path.join(DATA_DIR, 'discovered-facilities.json');
const RATE_LIMIT_FILE = path.join(DATA_DIR, 'rate-limits.json');

// Rate limiting
const RATE_LIMIT = {
  requestsPerMinute: 999999,
  requestsPerHour: 999999,
  requestsPerDay: 999999,
  retryDelayMs: 5000,
  maxRetries: 3,
  delayBetweenQueries: 500,
  delayBetweenLocations: 2000,
};

// Dutch locksmith search queries for comprehensive coverage
const SEARCH_QUERIES = [
  'slotenmaker',
  'slotspecialist',
  'sleutelservice',
  '24 uur slotenmaker',
  'noodslotenmaker',
  'slot openen',
  'cilinder vervangen',
  'inbraakbeveiliging',
  'hang en sluitwerk',
  'auto slotenmaker',
  'sleutel bijmaken',
  'slot reparatie',
  'deur openen',
  'slot vervangen',
];

// ============================================================================
// Database Connection
// ============================================================================

const DATABASE_URL = process.env.DATABASE_URL;
let db: ReturnType<typeof drizzle> | null = null;
let dbEnabled = true;

function initDatabase(): boolean {
  if (!DATABASE_URL) {
    console.log('⚠️  DATABASE_URL not set - will only save to JSON files');
    dbEnabled = false;
    return false;
  }

  try {
    const client = neon(DATABASE_URL);
    db = drizzle(client);
    console.log('✅ Database connection initialized');
    return true;
  } catch (error: any) {
    console.error('❌ Failed to initialize database:', error.message);
    dbEnabled = false;
    return false;
  }
}

function createSlug(name: string, city: string, provinceAbbr: string): string {
  const base = `${name}-${city}-${provinceAbbr}`;
  return base
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function createTypeSlug(type: string): string {
  return type.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

function determineType(businessType: string, categories: string[]): string {
  const allTerms = [businessType, ...(categories || [])].map(t => t?.toLowerCase() || '');

  if (allTerms.some(t => t.includes('24 uur') || t.includes('nood') || t.includes('spoed'))) return '24-uur-slotenmaker';
  if (allTerms.some(t => t.includes('auto') || t.includes('voertuig'))) return 'auto-slotenmaker';
  if (allTerms.some(t => t.includes('kluis') || t.includes('brandkast') || t.includes('safe'))) return 'kluis-slotenmaker';
  if (allTerms.some(t => t.includes('inbraak') || t.includes('beveiliging'))) return 'inbraakbeveiliging-specialist';
  if (allTerms.some(t => t.includes('elektronisch') || t.includes('smart lock') || t.includes('code'))) return 'elektronische-sloten-specialist';
  if (allTerms.some(t => t.includes('hang en sluitwerk') || t.includes('deurbeslag'))) return 'hang-en-sluitwerk-specialist';
  if (allTerms.some(t => t.includes('sleutel'))) return 'sleutel-service';

  return 'slotenmaker';
}

/**
 * Insert a single locksmith to database in real-time
 * Returns true if successful, false if failed
 */
async function insertFacilityToDatabase(facility: DiscoveredFacility): Promise<boolean> {
  if (!db || !dbEnabled) return false;

  const provinceAbbr = facility.province_abbr || facility.province?.slice(0, 2).toUpperCase() || 'NL';
  const type = determineType(facility.business_type || '', facility.categories || []);

  const record = {
    slug: createSlug(facility.name, facility.city || '', provinceAbbr),
    name: facility.name,
    type: type,
    typeSlug: createTypeSlug(type),
    address: facility.address || null,
    city: facility.city || '',
    county: facility.gemeente || null,
    state: facility.province || '',
    stateAbbr: provinceAbbr,
    zipCode: facility.postal_code || null,
    country: facility.country || 'Nederland',
    latitude: facility.latitude?.toString() || null,
    longitude: facility.longitude?.toString() || null,
    phone: facility.phone || null,
    email: null,
    website: facility.website || null,
    rating: facility.rating?.toString() || null,
    reviewCount: facility.review_count || 0,
    photoUrl: facility.photo_url || null,
    photos: facility.categories ? facility.categories : null,
    openingHours: typeof facility.opening_hours === 'string'
      ? facility.opening_hours
      : JSON.stringify(facility.opening_hours) || null,
    amenities: facility.amenities || null,
    facilityTypes: null,
    treatmentTypes: null,
    insuranceAccepted: null,
    yearEstablished: null,
    description: null,
    seoTitle: null,
    seoDescription: null,
    enrichedContent: null,
    generatedSummary: null,
    generatedAbout: null,
    generatedFeatures: null,
    generatedAmenities: null,
    generatedVisitorTips: null,
    generatedDirections: null,
    generatedLocalContext: null,
    enrichedAt: null,
    source: 'google_maps',
    status: 'active',
    discoveredAt: facility.discovered_at || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    await db.insert(facilities)
      .values(record)
      .onConflictDoUpdate({
        target: facilities.slug,
        set: {
          name: sql`COALESCE(EXCLUDED.name, ${facilities.name})`,
          address: sql`COALESCE(EXCLUDED.address, ${facilities.address})`,
          phone: sql`COALESCE(EXCLUDED.phone, ${facilities.phone})`,
          website: sql`COALESCE(EXCLUDED.website, ${facilities.website})`,
          rating: sql`COALESCE(EXCLUDED.rating, ${facilities.rating})`,
          reviewCount: sql`GREATEST(COALESCE(EXCLUDED.review_count, 0), COALESCE(${facilities.reviewCount}, 0))`,
          photoUrl: sql`COALESCE(EXCLUDED.photo_url, ${facilities.photoUrl})`,
          amenities: sql`COALESCE(EXCLUDED.amenities, ${facilities.amenities})`,
          photos: sql`COALESCE(EXCLUDED.photos, ${facilities.photos})`,
          updatedAt: sql`EXCLUDED.updated_at`,
        },
      });
    return true;
  } catch (error: any) {
    // Log but don't fail - data is still in JSON backup
    console.error(`   ⚠️ DB insert failed for ${facility.name}: ${error.message?.slice(0, 50)}`);
    return false;
  }
}

// ============================================================================
// Types
// ============================================================================

interface DiscoveryLocation {
  id: string;
  city: string;
  gemeente?: string;
  province: string;
  province_abbr: string;
  country: 'NLD';
  population?: number;
  priority: number;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  results_count: number;
  last_searched_at: string | null;
  search_query: string | null;
  created_at: string;
  error_message?: string;
  retry_count?: number;
}

interface DiscoveredFacility {
  // Identifiers
  google_cid: string;
  google_place_id?: string;

  // Basic info
  name: string;
  original_title?: string;
  address?: string;
  phone?: string;
  website?: string;

  // Location
  latitude?: number;
  longitude?: number;
  city?: string;
  gemeente?: string;
  province?: string;
  province_abbr?: string;
  country: 'NLD';
  postal_code?: string;

  // Google Maps data
  rating?: number;
  review_count?: number;
  business_type?: string;
  categories?: string[];

  // Opening hours
  opening_hours?: any;

  // Photo URL
  photo_url?: string;

  // Amenities/Services
  amenities?: string[];

  // Reviews
  reviews?: Array<{
    reviewer_name: string;
    rating: number;
    review_text: string;
    review_date?: string;
  }>;

  // Discovery metadata
  search_query: string;
  discovered_location_id: string;
  discovered_at: string;
}

interface RateLimitState {
  minute_count: number;
  minute_reset_at: string;
  hour_count: number;
  hour_reset_at: string;
  day_count: number;
  day_reset_at: string;
  total_requests: number;
  total_errors: number;
  last_request_at: string | null;
}

// ============================================================================
// Dutch Address Parsing
// ============================================================================

/**
 * Extract Dutch postal code from address
 * Dutch postal codes: 4 digits + 2 letters (1234 AB)
 */
function extractPostalCode(address: string): string | null {
  const pattern = /\b(\d{4}\s?[A-Z]{2})\b/i;
  const match = address.match(pattern);
  if (match) {
    return match[1].replace(/\s/g, '').toUpperCase();
  }
  return null;
}

/**
 * Extract city from Dutch address
 */
function extractCityFromAddress(address: string): string | null {
  // Dutch format: "Straatnaam 123, 1234 AB Stadsnaam"
  const pattern = /\d{4}\s?[A-Z]{2}\s+([A-Za-z\s'-]+?)(?:,|$)/i;
  const match = address.match(pattern);
  if (match) {
    return match[1].trim();
  }
  return null;
}

// ============================================================================
// Rate Limiting
// ============================================================================

function loadRateLimits(): RateLimitState {
  const now = new Date();
  const defaults: RateLimitState = {
    minute_count: 0,
    minute_reset_at: new Date(now.getTime() + 60000).toISOString(),
    hour_count: 0,
    hour_reset_at: new Date(now.getTime() + 3600000).toISOString(),
    day_count: 0,
    day_reset_at: new Date(now.setHours(24, 0, 0, 0)).toISOString(),
    total_requests: 0,
    total_errors: 0,
    last_request_at: null,
  };

  if (!fs.existsSync(RATE_LIMIT_FILE)) {
    return defaults;
  }

  try {
    const state = JSON.parse(fs.readFileSync(RATE_LIMIT_FILE, 'utf-8'));

    if (new Date(state.minute_reset_at) < now) {
      state.minute_count = 0;
      state.minute_reset_at = new Date(now.getTime() + 60000).toISOString();
    }
    if (new Date(state.hour_reset_at) < now) {
      state.hour_count = 0;
      state.hour_reset_at = new Date(now.getTime() + 3600000).toISOString();
    }
    if (new Date(state.day_reset_at) < now) {
      state.day_count = 0;
      state.day_reset_at = new Date(now.setHours(24, 0, 0, 0)).toISOString();
    }

    return state;
  } catch {
    return defaults;
  }
}

function saveRateLimits(state: RateLimitState): void {
  fs.writeFileSync(RATE_LIMIT_FILE, JSON.stringify(state, null, 2));
}

// ============================================================================
// Bright Data SERP API
// ============================================================================

/**
 * Search Google Maps via SERP API for Dutch locations
 */
async function searchGoogleMapsSERP(
  query: string,
  location: string,
  province: string,
  retryCount = 0
): Promise<any> {
  // Build search query with Dutch context
  const searchQuery = `${query} ${location} ${province} Nederland`;
  const googleUrl = `https://www.google.nl/maps/search/${encodeURIComponent(searchQuery)}?hl=nl&brd_json=1`;

  try {
    const response = await fetch(SERP_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        zone: SERP_ZONE,
        url: googleUrl,
        format: 'json',
        country: 'nl',  // Netherlands country code
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();

      if (response.status === 429) {
        throw new Error('RATE_LIMITED');
      }

      throw new Error(`API error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return { data, searchQuery };

  } catch (error: any) {
    if (retryCount < RATE_LIMIT.maxRetries) {
      const delay = RATE_LIMIT.retryDelayMs * Math.pow(2, retryCount);
      console.log(`   ⟳ Retry ${retryCount + 1}/${RATE_LIMIT.maxRetries} in ${delay / 1000}s...`);
      await sleep(delay);
      return searchGoogleMapsSERP(query, location, province, retryCount + 1);
    }

    throw error;
  }
}

// ============================================================================
// Data Processing
// ============================================================================

/**
 * Process SERP JSON response and extract locksmith data for Netherlands
 */
async function processSerpResponse(
  response: { data: any; searchQuery: string },
  location: DiscoveryLocation,
  query: string
): Promise<DiscoveredFacility[]> {
  const locksmiths: DiscoveredFacility[] = [];
  let data = response.data;
  const seenCids = new Set<string>();

  // Parse body if it's a string
  if (data.body && typeof data.body === 'string') {
    try {
      data = JSON.parse(data.body);
    } catch {
      console.error('   ⚠️ Failed to parse body JSON');
      return locksmiths;
    }
  }

  // Handle different response structures
  const places = data.organic ||
                 data.local_results ||
                 data.places ||
                 data.organic_results ||
                 data.results ||
                 (Array.isArray(data) ? data : []);

  for (const place of places) {
    // Extract CID
    const cid = place.fid ||
                place.map_id ||
                place.cid ||
                place.data_cid ||
                place.place_id ||
                place.data_id ||
                extractCidFromUrl(place.link || place.url || place.map_link);

    if (!cid || seenCids.has(String(cid))) continue;
    seenCids.add(String(cid));

    // Check if this looks like a locksmith
    const name = place.title || place.name || '';
    const nameLower = name.toLowerCase();

    const categories = Array.isArray(place.category) ? place.category : [];
    const categoryIds = categories.map((c: any) => {
      const id = c?.id ?? c;
      return typeof id === 'string' ? id.toLowerCase() : '';
    }).filter(Boolean);
    const categoryTitles = categories.map((c: any) => {
      const title = c?.title ?? '';
      return typeof title === 'string' ? title.toLowerCase() : '';
    }).filter(Boolean);

    // Locksmith detection for Dutch slotenmakers
    const isLocksmith =
      nameLower.includes('slotenmaker') ||
      nameLower.includes('slotspecialist') ||
      nameLower.includes('sleutelservice') ||
      nameLower.includes('sleutel') ||
      nameLower.includes('slot') ||
      nameLower.includes('locksmith') ||
      nameLower.includes('beveiliging') ||
      categoryIds.includes('locksmith') ||
      categoryIds.includes('slotenmaker') ||
      categoryTitles.includes('slotenmaker') ||
      categoryTitles.includes('locksmith');

    // For locksmith searches, be more lenient
    const isRelevantQuery = query.toLowerCase().includes('slotenmaker') ||
                           query.toLowerCase().includes('slot') ||
                           query.toLowerCase().includes('sleutel');
    if (!isLocksmith && !isRelevantQuery) continue;

    // Get primary category
    const primaryCategory = categories[0]?.title || categories[0]?.id || 'slotenmaker';

    // Extract address info
    const address = place.address || place.formatted_address || '';
    const postalCode = extractPostalCode(address);
    const cityFromAddress = extractCityFromAddress(address);

    // Use search location as fallback
    const city = cityFromAddress || location.city;

    // Extract photo URL
    const photoUrl = place.original_image ||
                     place.image ||
                     place.photo ||
                     place.thumbnail ||
                     place.main_image;

    // Extract all category titles
    const allCategories = categories.map((c: any) => {
      const val = c?.title ?? c?.id ?? c;
      return typeof val === 'string' ? val : null;
    }).filter(Boolean) as string[];

    // Extract amenities/services
    const tags = place.tags || [];
    const amenities = tags
      .map((t: any) => t.value_title_short || t.key_title || t.value_title)
      .filter(Boolean);

    const facility: DiscoveredFacility = {
      google_cid: String(cid),
      google_place_id: place.map_id_encoded || (String(cid).startsWith('ChIJ') ? String(cid) : undefined),
      name: name,
      original_title: place.original_title || undefined,
      address: address,
      phone: place.phone,
      website: place.website || place.link || place.display_link,
      latitude: place.latitude || place.lat,
      longitude: place.longitude || place.lng,
      city: city,
      gemeente: location.gemeente,
      province: location.province,
      province_abbr: location.province_abbr,
      country: 'NLD',
      postal_code: postalCode || undefined,
      rating: place.rating ? parseFloat(String(place.rating)) : undefined,
      review_count: place.reviews_cnt || place.reviews_count || place.review_count,
      business_type: primaryCategory,
      categories: allCategories.length > 0 ? allCategories : undefined,
      opening_hours: place.work_status || place.hours || place.opening_hours,
      photo_url: photoUrl || undefined,
      amenities: amenities.length > 0 ? amenities : undefined,
      search_query: query,
      discovered_location_id: location.id,
      discovered_at: new Date().toISOString(),
    };

    // Parse reviews if available
    if (place.top_reviews || place.reviews_data) {
      facility.reviews = parseReviews(place);
    }

    locksmiths.push(facility);
  }

  return locksmiths;
}

/**
 * Extract CID from Google Maps URL
 */
function extractCidFromUrl(url?: string): string | null {
  if (!url) return null;

  const cidMatch = url.match(/[?&]cid=(\d+)/);
  if (cidMatch) return cidMatch[1];

  const dataIdMatch = url.match(/data=.*?!1s(0x[a-f0-9]+:[a-f0-9]+)/);
  if (dataIdMatch) return dataIdMatch[1];

  const placeIdMatch = url.match(/(ChIJ[a-zA-Z0-9_-]+)/);
  if (placeIdMatch) return placeIdMatch[1];

  return null;
}

/**
 * Parse reviews from place data
 */
function parseReviews(place: any): DiscoveredFacility['reviews'] {
  const reviews: DiscoveredFacility['reviews'] = [];
  const rawReviews = place.top_reviews || place.reviews_data || [];

  for (const review of rawReviews.slice(0, 10)) {
    reviews.push({
      reviewer_name: review.author || review.reviewer_name || 'Anoniem',
      rating: review.rating || 0,
      review_text: review.text || review.content || review.snippet || '',
      review_date: review.date || review.review_date,
    });
  }

  return reviews;
}

// ============================================================================
// File Operations
// ============================================================================

function loadLocations(): DiscoveryLocation[] {
  if (!fs.existsSync(LOCATIONS_FILE)) {
    console.error('❌ Locations file not found. Create data/discovery/locations.json first.');
    process.exit(1);
  }
  const data = JSON.parse(fs.readFileSync(LOCATIONS_FILE, 'utf-8'));
  return data.locations || data;
}

function saveLocations(locations: DiscoveryLocation[]): void {
  const data = { locations, search_queries: SEARCH_QUERIES };
  fs.writeFileSync(LOCATIONS_FILE, JSON.stringify(data, null, 2));
}

function loadDiscoveredFacilities(): DiscoveredFacility[] {
  if (!fs.existsSync(RESULTS_FILE)) {
    return [];
  }
  try {
    return JSON.parse(fs.readFileSync(RESULTS_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

function saveDiscoveredFacilities(facilities: DiscoveredFacility[]): void {
  fs.writeFileSync(RESULTS_FILE, JSON.stringify(facilities, null, 2));
}

function updateProgress(locations: DiscoveryLocation[], facilities: DiscoveredFacility[]): void {
  // Group by province
  const provinceStats: Record<string, { total: number; completed: number; facilities: number }> = {};

  for (const loc of locations) {
    if (!provinceStats[loc.province]) {
      provinceStats[loc.province] = { total: 0, completed: 0, facilities: 0 };
    }
    provinceStats[loc.province].total++;
    if (loc.status === 'completed') {
      provinceStats[loc.province].completed++;
    }
  }

  for (const fac of facilities) {
    if (fac.province && provinceStats[fac.province]) {
      provinceStats[fac.province].facilities++;
    }
  }

  const progress = {
    total_locations: locations.length,
    pending: locations.filter(l => l.status === 'pending').length,
    in_progress: locations.filter(l => l.status === 'in_progress').length,
    completed: locations.filter(l => l.status === 'completed').length,
    failed: locations.filter(l => l.status === 'failed').length,
    total_facilities_found: facilities.length,
    unique_cids: new Set(facilities.map(c => c.google_cid)).size,
    per_province: provinceStats,
    last_run_at: new Date().toISOString(),
  };
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

// ============================================================================
// Utilities
// ============================================================================

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    province: null as string | null,
    batch: 0,
    dryRun: false,
    resume: false,
    test: false,
    noDb: false,
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--province' && args[i + 1]) {
      options.province = args[i + 1];
      i++;
    } else if (args[i] === '--batch' && args[i + 1]) {
      options.batch = parseInt(args[i + 1]);
      i++;
    } else if (args[i] === '--dry-run') {
      options.dryRun = true;
    } else if (args[i] === '--resume') {
      options.resume = true;
    } else if (args[i] === '--test') {
      options.test = true;
      options.batch = 3;
    } else if (args[i] === '--no-db') {
      options.noDb = true;
    }
  }

  return options;
}

// ============================================================================
// Main
// ============================================================================

async function main() {
  const options = parseArgs();

  console.log('🔐 Slotenmaker Discovery Script - Nederland\n');
  console.log('━'.repeat(50));

  // Check API key
  if (!API_KEY) {
    console.error('❌ BRIGHTDATA_API_KEY not found in .env.local');
    process.exit(1);
  }

  // Initialize database connection (unless --no-db)
  if (options.noDb) {
    console.log('⚠️  Database writes disabled (--no-db flag)');
    dbEnabled = false;
  } else {
    initDatabase();
  }

  // Check if locations file exists
  if (!fs.existsSync(LOCATIONS_FILE)) {
    console.log('⚠️ Locations file not found.');
    console.log('   Create data/discovery/locations.json with Dutch cities first.');
    process.exit(1);
  }

  // Load data
  let locations = loadLocations();
  let discoveredFacilities = loadDiscoveredFacilities();
  const rateLimits = loadRateLimits();

  // Build set of existing CIDs to avoid duplicates
  const existingCids = new Set(discoveredFacilities.map(c => c.google_cid));

  // Filter locations to process
  let toProcess = locations.filter(l => {
    if (options.resume && l.status === 'in_progress') return true;
    if (l.status === 'pending') return true;
    if (l.status === 'failed' && (l.retry_count || 0) < RATE_LIMIT.maxRetries) return true;
    return false;
  });

  // Filter by province
  if (options.province) {
    toProcess = toProcess.filter(l =>
      l.province.toLowerCase() === options.province!.toLowerCase() ||
      l.province_abbr.toLowerCase() === options.province!.toLowerCase()
    );
  }

  // Sort by priority (higher first)
  toProcess.sort((a, b) => b.priority - a.priority);

  // Apply batch limit
  if (options.batch > 0) {
    toProcess = toProcess.slice(0, options.batch);
  }

  console.log(`📊 Status:`);
  console.log(`   Total locations: ${locations.length}`);
  console.log(`   To process: ${toProcess.length}`);
  console.log(`   Already found: ${discoveredFacilities.length} slotenmakers`);
  console.log(`   Unique CIDs: ${existingCids.size}`);
  console.log('');

  // Show province breakdown
  const provinceBreakdown = toProcess.reduce((acc, l) => {
    acc[l.province_abbr] = (acc[l.province_abbr] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (Object.keys(provinceBreakdown).length > 0 && Object.keys(provinceBreakdown).length <= 12) {
    console.log('   Per provincie:');
    for (const [province, count] of Object.entries(provinceBreakdown)) {
      console.log(`   - ${province}: ${count} steden`);
    }
    console.log('');
  }

  if (toProcess.length === 0) {
    console.log('✅ All locations have been processed!');
    return;
  }

  if (options.dryRun) {
    console.log('🧪 DRY RUN - No API calls will be made\n');
    console.log('Locations to process:');
    toProcess.slice(0, 10).forEach((loc, i) => {
      console.log(`   ${i + 1}. ${loc.city}, ${loc.province_abbr}`);
    });
    if (toProcess.length > 10) {
      console.log(`   ... and ${toProcess.length - 10} more`);
    }
    return;
  }

  // Process locations
  console.log(`🚀 Starting discovery for ${toProcess.length} locations...\n`);
  if (dbEnabled) {
    console.log('💾 Real-time database writes ENABLED - data saved immediately\n');
  } else {
    console.log('📁 Database disabled - saving to JSON files only\n');
  }

  let processed = 0;
  let newFacilities = 0;
  let dbInserts = 0;
  let dbFailures = 0;

  for (const location of toProcess) {
    console.log(`\n🔐 ${location.city}, ${location.province_abbr}`);

    // Update status
    location.status = 'in_progress';
    saveLocations(locations);

    try {
      let locationResults: DiscoveredFacility[] = [];

      // Search with each query
      for (const query of SEARCH_QUERIES) {
        console.log(`   🔎 Searching: "${query} ${location.city}"...`);

        const response = await searchGoogleMapsSERP(query, location.city, location.province);
        const foundFacilities = await processSerpResponse(response, location, query);

        // Filter duplicates and insert each to database in real-time
        for (const facility of foundFacilities) {
          if (!existingCids.has(facility.google_cid)) {
            existingCids.add(facility.google_cid);
            locationResults.push(facility);
            discoveredFacilities.push(facility);
            newFacilities++;

            // Insert to database immediately (crash-safe)
            if (dbEnabled) {
              const success = await insertFacilityToDatabase(facility);
              if (success) {
                dbInserts++;
              } else {
                dbFailures++;
              }
            }
          }
        }

        console.log(`   ✓ ${foundFacilities.length} CIDs found (${locationResults.length} new)`);

        // Small delay between queries
        await sleep(RATE_LIMIT.delayBetweenQueries);
      }

      // Update location
      location.status = 'completed';
      location.results_count = locationResults.length;
      location.last_searched_at = new Date().toISOString();
      location.search_query = SEARCH_QUERIES.join(', ');

      // Save progress to JSON files (backup)
      saveLocations(locations);
      saveDiscoveredFacilities(discoveredFacilities);
      updateProgress(locations, discoveredFacilities);
      saveRateLimits(rateLimits);

      processed++;
      const dbStatus = dbEnabled ? ` | DB: ${dbInserts}/${newFacilities}` : '';
      console.log(`   💾 Saved (${processed}/${toProcess.length}) - Total: ${newFacilities} new slotenmakers${dbStatus}`);

    } catch (error: any) {
      console.error(`   ❌ Error: ${error.message}`);

      location.status = 'failed';
      location.error_message = error.message;
      location.retry_count = (location.retry_count || 0) + 1;

      saveLocations(locations);
      rateLimits.total_errors++;
      saveRateLimits(rateLimits);
    }

    // Delay between locations
    await sleep(RATE_LIMIT.delayBetweenLocations);
  }

  // Final summary
  console.log('\n' + '━'.repeat(50));
  console.log('📊 Discovery Complete!');
  console.log(`   Locations processed: ${processed}`);
  console.log(`   New slotenmakers found: ${newFacilities}`);
  console.log(`   Total slotenmakers: ${discoveredFacilities.length}`);
  console.log(`   Unique CIDs: ${new Set(discoveredFacilities.map(c => c.google_cid)).size}`);
  if (dbEnabled) {
    console.log('');
    console.log('   💾 Database Status:');
    console.log(`      Successful inserts: ${dbInserts}`);
    if (dbFailures > 0) {
      console.log(`      Failed inserts: ${dbFailures} (saved in JSON backup)`);
    }
    console.log(`      Success rate: ${((dbInserts / (dbInserts + dbFailures || 1)) * 100).toFixed(1)}%`);
  }
}

main().catch(console.error);
