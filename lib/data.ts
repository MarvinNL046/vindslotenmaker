import { promises as fs } from 'fs';
import path from 'path';
import { db, facilities } from './db';
import { eq, ilike, or, desc, asc, sql, and, count } from 'drizzle-orm';

// Nederlandse Slotenmaker Interface
export interface Slotenmaker {
  // Kern identificatie
  id: string;
  name: string;
  slug: string;

  // Locatie - Nederlandse geografie
  address?: string;
  city: string;                    // Plaats
  municipality?: string;           // Gemeente
  province: string;                // Provincie
  province_abbr: string;
  zipCode?: string;                // Postcode
  country: string;
  latitude?: number;
  longitude?: number;
  werkgebied?: string[];           // Service area (plaatsen)

  // Classificatie
  type: string;
  type_slug: string;
  bedrijfs_types: string[];        // Business types
  service_types: string[];         // Services offered
  betaalmethoden: string[];        // Payment methods

  // Diensten details
  is_24uurs: boolean;              // 24-uurs service
  spoed_service: boolean;          // Spoedservice
  reactietijd?: string;            // Reactietijd (bijv. "15-30 minuten")
  prijsindicatie?: string;         // Prijsindicatie
  voorrijkosten?: string;          // Voorrijkosten
  certificeringen: string[];       // Certificeringen (SKG, VCA, etc.)

  // Contact
  phone?: string;
  phone_24h?: string;              // 24-uurs noodnummer
  email?: string;
  website?: string;
  whatsapp?: string;

  // Details
  description?: string;
  opening_hours?: string;
  specialisaties?: string[];       // Specialisaties
  year_established?: string;
  kvk_nummer?: string;             // KvK registratie
  btw_nummer?: string;             // BTW nummer
  merken?: string[];               // Merken waarmee gewerkt wordt

  // Google data
  rating?: number;
  review_count?: number;
  photo?: string;
  photo_url?: string;
  photos?: string[];

  // Reviews
  reviews?: Array<{
    reviewer_name: string;
    rating: number;
    review_text: string;
    review_date: string;
    reviewer_image?: string;
  }>;

  // Metadata
  status?: string;
  source?: string;
  discovered_at?: string;
  updated_at?: string;
}

// Generated content for SEO
export interface GeneratedContent {
  summary: string;
  about: string;
  features: string[];
  accessibility: string;
  amenities: string[];
  visitor_tips: string[];
  local_context?: string;
  province_info?: string;
  type_info?: string;
  practical_info?: string;
  directions?: string;
}

// Enriched slotenmaker with generated content
export interface EnrichedSlotenmakerData {
  website_url?: string;
  website_content?: string;
  website_scraped_at?: string;

  google_rating?: number;
  google_review_count?: number;
  google_reviews?: Array<{
    reviewer_name: string;
    rating: number;
    review_text: string;
    review_date: string;
  }>;
  google_photo?: string;
  google_photos?: string[];

  generated?: GeneratedContent;
  generated_at?: string;

  enriched: boolean;
  enriched_at?: string;
  last_updated?: string;

  seoTitle?: string;
  seoDescription?: string;
  enrichedContent?: string;
}

export interface SlotenmakerWithContent extends Slotenmaker, EnrichedSlotenmakerData {}

// Provincie interface
export interface Provincie {
  name: string;
  abbr: string;
  slug: string;
  municipalities?: number;
  capital?: string;
  major_cities?: string[];
}

// Service type interface (vervangt TreatmentType)
export interface ServiceType {
  slug: string;
  name: string;
  description?: string;
  search_terms?: string[];
}

// Bedrijfs type interface (vervangt FacilityType)
export interface BedrijfsType {
  slug: string;
  name: string;
  description?: string;
  search_terms?: string[];
}

// Cache for static data
let provincesCache: Provincie[] | null = null;
let serviceTypesCache: ServiceType[] | null = null;
let bedrijfsTypesCache: BedrijfsType[] | null = null;

// ===== HELPER: Map database row to Slotenmaker interface =====

function mapRowToSlotenmaker(row: typeof facilities.$inferSelect): Slotenmaker {
  return {
    id: row.id.toString(),
    name: row.name,
    slug: row.slug,
    address: row.address || undefined,
    city: row.city,
    municipality: row.municipality || undefined,
    province: row.province,
    province_abbr: row.provinceAbbr,
    zipCode: row.zipCode || undefined,
    country: row.country,
    latitude: row.latitude ? parseFloat(row.latitude) : undefined,
    longitude: row.longitude ? parseFloat(row.longitude) : undefined,
    werkgebied: row.werkgebied || [],
    type: row.type,
    type_slug: row.typeSlug || row.type.toLowerCase().replace(/\s+/g, '-'),
    bedrijfs_types: row.bedrijfsTypes || [],
    service_types: row.serviceTypes || [],
    betaalmethoden: row.betaalmethoden || [],
    is_24uurs: row.is24uurs || false,
    spoed_service: row.spoedService || false,
    reactietijd: row.reactietijd || undefined,
    prijsindicatie: row.prijsindicatie || undefined,
    voorrijkosten: row.voorrijkosten || undefined,
    certificeringen: row.certificeringen || [],
    phone: row.phone || undefined,
    phone_24h: row.phone24h || undefined,
    email: row.email || undefined,
    website: row.website || undefined,
    whatsapp: row.whatsapp || undefined,
    description: row.description || undefined,
    opening_hours: row.openingHours || undefined,
    specialisaties: row.specialisaties || undefined,
    year_established: row.yearEstablished || undefined,
    kvk_nummer: row.kvkNummer || undefined,
    btw_nummer: row.btwNummer || undefined,
    merken: row.merken || undefined,
    rating: row.rating ? parseFloat(row.rating) : undefined,
    review_count: row.reviewCount || undefined,
    photo_url: row.photoUrl || undefined,
    photos: row.photos || undefined,
    status: row.status || undefined,
    source: row.source || undefined,
    discovered_at: row.discoveredAt?.toISOString() || undefined,
    updated_at: row.updatedAt?.toISOString() || undefined,
  };
}

function mapRowToSlotenmakerWithContent(row: typeof facilities.$inferSelect): SlotenmakerWithContent {
  const base = mapRowToSlotenmaker(row);
  return {
    ...base,
    enriched: !!row.enrichedContent || !!row.generatedSummary,
    enriched_at: row.enrichedAt?.toISOString() || undefined,
    seoTitle: row.seoTitle || undefined,
    seoDescription: row.seoDescription || undefined,
    enrichedContent: row.enrichedContent || undefined,
    generated: row.generatedSummary ? {
      summary: row.generatedSummary || '',
      about: row.generatedAbout || '',
      features: row.generatedFeatures || [],
      accessibility: '',
      amenities: row.generatedAmenities || [],
      visitor_tips: row.generatedVisitorTips || [],
      directions: row.generatedDirections || undefined,
      local_context: row.generatedLocalContext || undefined,
    } : undefined,
  };
}

// ===== LEGACY ALIASES =====
// Voor backwards compatibility met bestaande code
export type Facility = Slotenmaker;
export type FacilityWithContent = SlotenmakerWithContent;
export type State = Provincie;
export type TreatmentType = ServiceType;
export type FacilityType = BedrijfsType;

// ===== CORE DATA FUNCTIONS =====

export async function getAllFacilities(): Promise<Slotenmaker[]> {
  try {
    const results = await db.select().from(facilities);
    return results.map(mapRowToSlotenmaker);
  } catch (error) {
    console.error('Fout bij laden slotenmakers uit database:', error);
    return [];
  }
}

export async function getFacilityBySlug(slug: string): Promise<SlotenmakerWithContent | null> {
  try {
    const results = await db.select()
      .from(facilities)
      .where(eq(facilities.slug, slug))
      .limit(1);

    if (results.length === 0) return null;

    return mapRowToSlotenmakerWithContent(results[0]);
  } catch (error) {
    console.error('Fout bij laden slotenmaker:', error);
    return null;
  }
}

// ===== PROVINCIE FUNCTIONS =====

export async function getAllStates(): Promise<Provincie[]> {
  return getAllProvinces();
}

export async function getAllProvinces(): Promise<Provincie[]> {
  if (provincesCache) return provincesCache;

  try {
    const provincesPath = path.join(process.cwd(), 'data', 'provinces.json');
    const content = await fs.readFile(provincesPath, 'utf-8');
    const data = JSON.parse(content);
    provincesCache = data.provinces as Provincie[];
    return provincesCache;
  } catch (error) {
    console.error('Fout bij laden provincies:', error);
    return [];
  }
}

export async function getStateBySlug(slug: string): Promise<Provincie | null> {
  return getProvinceBySlug(slug);
}

export async function getProvinceBySlug(slug: string): Promise<Provincie | null> {
  const provinces = await getAllProvinces();
  return provinces.find(p => p.slug === slug) || null;
}

export async function getStateByAbbr(abbr: string): Promise<Provincie | null> {
  return getProvinceByAbbr(abbr);
}

export async function getProvinceByAbbr(abbr: string): Promise<Provincie | null> {
  const provinces = await getAllProvinces();
  return provinces.find(p => p.abbr.toLowerCase() === abbr.toLowerCase()) || null;
}

export async function getFacilitiesByState(province: string): Promise<Slotenmaker[]> {
  return getFacilitiesByProvince(province);
}

export async function getFacilitiesByProvince(province: string): Promise<Slotenmaker[]> {
  try {
    const results = await db.select()
      .from(facilities)
      .where(
        or(
          ilike(facilities.province, province),
          ilike(facilities.provinceAbbr, province)
        )
      );
    return results.map(mapRowToSlotenmaker);
  } catch (error) {
    console.error('Fout bij laden slotenmakers per provincie:', error);
    return [];
  }
}

// ===== GEMEENTE FUNCTIONS =====

export async function getAllCounties(): Promise<string[]> {
  return getAllMunicipalities();
}

export async function getAllMunicipalities(): Promise<string[]> {
  try {
    const results = await db.selectDistinct({ municipality: facilities.municipality })
      .from(facilities)
      .where(sql`${facilities.municipality} IS NOT NULL AND ${facilities.municipality} != ''`)
      .orderBy(asc(facilities.municipality));

    return results.map(r => r.municipality!).filter(Boolean);
  } catch (error) {
    console.error('Fout bij laden gemeenten:', error);
    return [];
  }
}

export async function getCountiesByState(province: string): Promise<string[]> {
  return getMunicipalitiesByProvince(province);
}

export async function getMunicipalitiesByProvince(province: string): Promise<string[]> {
  try {
    const results = await db.selectDistinct({ municipality: facilities.municipality })
      .from(facilities)
      .where(
        and(
          sql`${facilities.municipality} IS NOT NULL AND ${facilities.municipality} != ''`,
          or(
            ilike(facilities.province, province),
            ilike(facilities.provinceAbbr, province)
          )
        )
      )
      .orderBy(asc(facilities.municipality));

    return results.map(r => r.municipality!).filter(Boolean);
  } catch (error) {
    console.error('Fout bij laden gemeenten per provincie:', error);
    return [];
  }
}

export async function getFacilitiesByCounty(municipality: string, province?: string): Promise<Slotenmaker[]> {
  return getFacilitiesByMunicipality(municipality, province);
}

export async function getFacilitiesByMunicipality(municipality: string, province?: string): Promise<Slotenmaker[]> {
  try {
    let whereClause = ilike(facilities.municipality, municipality);

    if (province) {
      whereClause = and(
        whereClause,
        or(
          ilike(facilities.province, province),
          ilike(facilities.provinceAbbr, province)
        )
      )!;
    }

    const results = await db.select()
      .from(facilities)
      .where(whereClause);

    return results.map(mapRowToSlotenmaker);
  } catch (error) {
    console.error('Fout bij laden slotenmakers per gemeente:', error);
    return [];
  }
}

// ===== PLAATS FUNCTIONS =====

export async function getAllCities(): Promise<string[]> {
  try {
    const results = await db.selectDistinct({ city: facilities.city })
      .from(facilities)
      .where(sql`${facilities.city} IS NOT NULL AND ${facilities.city} != ''`)
      .orderBy(asc(facilities.city));

    return results.map(r => r.city).filter(Boolean);
  } catch (error) {
    console.error('Fout bij laden plaatsen:', error);
    return [];
  }
}

export async function getCitiesByState(province: string): Promise<string[]> {
  return getCitiesByProvince(province);
}

export async function getCitiesByProvince(province: string): Promise<string[]> {
  try {
    const results = await db.selectDistinct({ city: facilities.city })
      .from(facilities)
      .where(
        and(
          sql`${facilities.city} IS NOT NULL AND ${facilities.city} != ''`,
          or(
            ilike(facilities.province, province),
            ilike(facilities.provinceAbbr, province)
          )
        )
      )
      .orderBy(asc(facilities.city));

    return results.map(r => r.city).filter(Boolean);
  } catch (error) {
    console.error('Fout bij laden plaatsen per provincie:', error);
    return [];
  }
}

export async function getFacilitiesByCity(city: string, province?: string): Promise<Slotenmaker[]> {
  try {
    let whereClause = ilike(facilities.city, city);

    if (province) {
      whereClause = and(
        whereClause,
        or(
          ilike(facilities.province, province),
          ilike(facilities.provinceAbbr, province)
        )
      )!;
    }

    const results = await db.select()
      .from(facilities)
      .where(whereClause);

    return results.map(mapRowToSlotenmaker);
  } catch (error) {
    console.error('Fout bij laden slotenmakers per plaats:', error);
    return [];
  }
}

// ===== SERVICE TYPE FUNCTIONS =====

export async function getAllTreatmentTypes(): Promise<ServiceType[]> {
  return getAllServiceTypes();
}

export async function getAllServiceTypes(): Promise<ServiceType[]> {
  if (serviceTypesCache) return serviceTypesCache;

  try {
    const typesPath = path.join(process.cwd(), 'data', 'service-types.json');
    const content = await fs.readFile(typesPath, 'utf-8');
    const data = JSON.parse(content);
    serviceTypesCache = data.types as ServiceType[];
    return serviceTypesCache;
  } catch (error) {
    console.error('Fout bij laden service types:', error);
    return [];
  }
}

export async function getTreatmentTypeBySlug(slug: string): Promise<ServiceType | null> {
  return getServiceTypeBySlug(slug);
}

export async function getServiceTypeBySlug(slug: string): Promise<ServiceType | null> {
  const types = await getAllServiceTypes();
  return types.find(t => t.slug === slug) || null;
}

export async function getFacilitiesByTreatmentType(serviceType: string): Promise<Slotenmaker[]> {
  return getFacilitiesByServiceType(serviceType);
}

export async function getFacilitiesByServiceType(serviceType: string): Promise<Slotenmaker[]> {
  try {
    const results = await db.select()
      .from(facilities)
      .where(
        sql`${serviceType} = ANY(${facilities.serviceTypes})`
      );

    return results.map(mapRowToSlotenmaker);
  } catch (error) {
    console.error('Fout bij laden slotenmakers per service type:', error);
    return [];
  }
}

// ===== BEDRIJFS TYPE FUNCTIONS =====

export async function getAllFacilityTypes(): Promise<BedrijfsType[]> {
  return getAllBedrijfsTypes();
}

export async function getAllBedrijfsTypes(): Promise<BedrijfsType[]> {
  if (bedrijfsTypesCache) return bedrijfsTypesCache;

  try {
    const typesPath = path.join(process.cwd(), 'data', 'bedrijfs-types.json');
    const content = await fs.readFile(typesPath, 'utf-8');
    const data = JSON.parse(content);
    bedrijfsTypesCache = data.types as BedrijfsType[];
    return bedrijfsTypesCache;
  } catch (error) {
    console.error('Fout bij laden bedrijfs types:', error);
    return [];
  }
}

export async function getFacilityTypeBySlug(slug: string): Promise<BedrijfsType | null> {
  return getBedrijfsTypeBySlug(slug);
}

export async function getBedrijfsTypeBySlug(slug: string): Promise<BedrijfsType | null> {
  const types = await getAllBedrijfsTypes();
  return types.find(t => t.slug === slug) || null;
}

export async function getFacilitiesByFacilityType(bedrijfsType: string): Promise<Slotenmaker[]> {
  return getFacilitiesByBedrijfsType(bedrijfsType);
}

export async function getFacilitiesByBedrijfsType(bedrijfsType: string): Promise<Slotenmaker[]> {
  try {
    const results = await db.select()
      .from(facilities)
      .where(
        or(
          ilike(facilities.type, bedrijfsType),
          ilike(facilities.typeSlug, bedrijfsType),
          sql`${bedrijfsType} = ANY(${facilities.bedrijfsTypes})`
        )
      );

    return results.map(mapRowToSlotenmaker);
  } catch (error) {
    console.error('Fout bij laden slotenmakers per bedrijfs type:', error);
    return [];
  }
}

// ===== 24-UURS SERVICE FUNCTIONS =====

export async function get24uursSlotenmakers(): Promise<Slotenmaker[]> {
  try {
    const results = await db.select()
      .from(facilities)
      .where(eq(facilities.is24uurs, true));

    return results.map(mapRowToSlotenmaker);
  } catch (error) {
    console.error('Fout bij laden 24-uurs slotenmakers:', error);
    return [];
  }
}

export async function get24uursSlotenmakersByCity(city: string): Promise<Slotenmaker[]> {
  try {
    const results = await db.select()
      .from(facilities)
      .where(
        and(
          eq(facilities.is24uurs, true),
          ilike(facilities.city, city)
        )
      );

    return results.map(mapRowToSlotenmaker);
  } catch (error) {
    console.error('Fout bij laden 24-uurs slotenmakers per plaats:', error);
    return [];
  }
}

// ===== BETAALMETHODEN FUNCTIONS (vervangt Insurance) =====

export async function getFacilitiesByInsurance(betaalmethode: string): Promise<Slotenmaker[]> {
  return getFacilitiesByBetaalmethode(betaalmethode);
}

export async function getFacilitiesByBetaalmethode(betaalmethode: string): Promise<Slotenmaker[]> {
  try {
    const results = await db.select()
      .from(facilities)
      .where(
        sql`${betaalmethode} = ANY(${facilities.betaalmethoden})`
      );

    return results.map(mapRowToSlotenmaker);
  } catch (error) {
    console.error('Fout bij laden slotenmakers per betaalmethode:', error);
    return [];
  }
}

// ===== SLUG UTILITIES =====

export function createSlug(name: string, city: string, province_abbr?: string): string {
  const base = province_abbr
    ? `${name}-${city}-${province_abbr}`
    : `${name}-${city}`;

  return base
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function createStateSlug(province: string): string {
  return createProvinceSlug(province);
}

export function createProvinceSlug(province: string): string {
  return province
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

export function createCountySlug(municipality: string): string {
  return createMunicipalitySlug(municipality);
}

export function createMunicipalitySlug(municipality: string): string {
  return municipality
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

export function createCitySlug(city: string): string {
  return city
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

export function createTypeSlug(type: string): string {
  return type
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

// ===== STATISTICS =====

export async function getStats() {
  try {
    const provinces = await getAllProvinces();
    const serviceTypes = await getAllServiceTypes();
    const bedrijfsTypes = await getAllBedrijfsTypes();

    // Use SQL aggregations for efficiency
    const [statsResult] = await db.select({
      totalFacilities: count(),
      provincesWithFacilities: sql<number>`COUNT(DISTINCT ${facilities.province})`,
      citiesWithFacilities: sql<number>`COUNT(DISTINCT ${facilities.city})`,
      municipalitiesWithFacilities: sql<number>`COUNT(DISTINCT ${facilities.municipality})`,
      withRatings: sql<number>`COUNT(*) FILTER (WHERE ${facilities.rating} IS NOT NULL)`,
      withPhotos: sql<number>`COUNT(*) FILTER (WHERE ${facilities.photoUrl} IS NOT NULL)`,
      with24uurs: sql<number>`COUNT(*) FILTER (WHERE ${facilities.is24uurs} = true)`,
    }).from(facilities);

    return {
      total_facilities: Number(statsResult.totalFacilities),
      total_slotenmakers: Number(statsResult.totalFacilities),
      total_provinces: provinces.length,
      provinces_with_facilities: Number(statsResult.provincesWithFacilities),
      cities_with_facilities: Number(statsResult.citiesWithFacilities),
      municipalities_with_facilities: Number(statsResult.municipalitiesWithFacilities),
      total_service_types: serviceTypes.length,
      total_bedrijfs_types: bedrijfsTypes.length,
      with_ratings: Number(statsResult.withRatings),
      with_photos: Number(statsResult.withPhotos),
      with_24uurs: Number(statsResult.with24uurs),
      // Legacy aliases
      total_states: provinces.length,
      states_with_facilities: Number(statsResult.provincesWithFacilities),
      counties_with_facilities: Number(statsResult.municipalitiesWithFacilities),
      total_treatment_types: serviceTypes.length,
      total_facility_types: bedrijfsTypes.length,
    };
  } catch (error) {
    console.error('Fout bij laden statistieken:', error);
    return {
      total_facilities: 0,
      total_slotenmakers: 0,
      total_provinces: 0,
      provinces_with_facilities: 0,
      cities_with_facilities: 0,
      municipalities_with_facilities: 0,
      total_service_types: 0,
      total_bedrijfs_types: 0,
      with_ratings: 0,
      with_photos: 0,
      with_24uurs: 0,
      total_states: 0,
      states_with_facilities: 0,
      counties_with_facilities: 0,
      total_treatment_types: 0,
      total_facility_types: 0,
    };
  }
}

// ===== SEARCH =====

export async function searchFacilities(query: string, filters?: {
  province?: string;
  type?: string;
  city?: string;
  municipality?: string;
  serviceType?: string;
  bedrijfsType?: string;
  betaalmethode?: string;
  is24uurs?: boolean;
  // Legacy aliases
  state?: string;
  county?: string;
  treatmentType?: string;
  facilityType?: string;
  insurance?: string;
}): Promise<Slotenmaker[]> {
  try {
    // Build dynamic where conditions
    const conditions = [];

    // Province filter (also accepts legacy 'state')
    const provinceFilter = filters?.province || filters?.state;
    if (provinceFilter) {
      conditions.push(
        or(
          ilike(facilities.province, provinceFilter),
          ilike(facilities.provinceAbbr, provinceFilter)
        )
      );
    }

    if (filters?.type) {
      conditions.push(
        or(
          ilike(facilities.type, `%${filters.type}%`),
          ilike(facilities.typeSlug, filters.type)
        )
      );
    }

    if (filters?.city) {
      conditions.push(ilike(facilities.city, filters.city));
    }

    // Municipality filter (also accepts legacy 'county')
    const municipalityFilter = filters?.municipality || filters?.county;
    if (municipalityFilter) {
      conditions.push(ilike(facilities.municipality, municipalityFilter));
    }

    // Service type filter (also accepts legacy 'treatmentType')
    const serviceTypeFilter = filters?.serviceType || filters?.treatmentType;
    if (serviceTypeFilter) {
      conditions.push(
        sql`${serviceTypeFilter} = ANY(${facilities.serviceTypes})`
      );
    }

    // Bedrijfs type filter (also accepts legacy 'facilityType')
    const bedrijfsTypeFilter = filters?.bedrijfsType || filters?.facilityType;
    if (bedrijfsTypeFilter) {
      conditions.push(
        sql`${bedrijfsTypeFilter} = ANY(${facilities.bedrijfsTypes})`
      );
    }

    // Betaalmethode filter (also accepts legacy 'insurance')
    const betaalmethodeFilter = filters?.betaalmethode || filters?.insurance;
    if (betaalmethodeFilter) {
      conditions.push(
        sql`${betaalmethodeFilter} = ANY(${facilities.betaalmethoden})`
      );
    }

    // 24-uurs filter
    if (filters?.is24uurs) {
      conditions.push(eq(facilities.is24uurs, true));
    }

    // Add search query
    if (query && query.trim()) {
      const q = `%${query.trim()}%`;
      conditions.push(
        or(
          ilike(facilities.name, q),
          ilike(facilities.city, q),
          ilike(facilities.municipality, q),
          ilike(facilities.province, q),
          ilike(facilities.address, q),
          ilike(facilities.zipCode, q)
        )
      );
    }

    let dbQuery = db.select().from(facilities);

    if (conditions.length > 0) {
      dbQuery = dbQuery.where(and(...conditions)) as typeof dbQuery;
    }

    const results = await dbQuery
      .orderBy(desc(facilities.rating))
      .limit(100);

    return results.map(mapRowToSlotenmaker);
  } catch (error) {
    console.error('Fout bij zoeken slotenmakers:', error);
    return [];
  }
}

// ===== NEARBY FACILITIES =====

// Haversine distance calculation (in kilometers for Netherlands)
function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export async function getNearbyFacilities(
  lat: number,
  lon: number,
  radiusKm: number = 25,
  limit: number = 20
): Promise<Array<Slotenmaker & { distance: number }>> {
  try {
    // Use database query with basic filtering first
    const results = await db.select()
      .from(facilities)
      .where(
        sql`${facilities.latitude} IS NOT NULL AND ${facilities.longitude} IS NOT NULL`
      )
      .limit(1000);

    // Calculate distances and filter client-side
    const withDistance = results
      .map(row => ({
        ...mapRowToSlotenmaker(row),
        distance: haversineDistance(
          lat, lon,
          parseFloat(row.latitude!),
          parseFloat(row.longitude!)
        )
      }))
      .filter(s => s.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit);

    return withDistance;
  } catch (error) {
    console.error('Fout bij laden nabije slotenmakers:', error);
    return [];
  }
}

// ===== FEATURED/POPULAR =====

export async function getFeaturedFacilities(limit: number = 10): Promise<Slotenmaker[]> {
  try {
    const results = await db.select()
      .from(facilities)
      .where(
        and(
          sql`${facilities.rating} IS NOT NULL`,
          sql`${facilities.reviewCount} > 0`
        )
      )
      .orderBy(
        desc(sql`${facilities.rating} * LOG(${facilities.reviewCount} + 1)`),
        desc(facilities.rating)
      )
      .limit(limit);

    return results.map(mapRowToSlotenmaker);
  } catch (error) {
    console.error('Fout bij laden uitgelichte slotenmakers:', error);
    return [];
  }
}

export async function getRecentlyUpdated(limit: number = 10): Promise<Slotenmaker[]> {
  try {
    const results = await db.select()
      .from(facilities)
      .where(sql`${facilities.updatedAt} IS NOT NULL`)
      .orderBy(desc(facilities.updatedAt))
      .limit(limit);

    return results.map(mapRowToSlotenmaker);
  } catch (error) {
    console.error('Fout bij laden recent bijgewerkte slotenmakers:', error);
    return [];
  }
}
