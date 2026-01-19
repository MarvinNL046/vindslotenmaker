/**
 * Netherlands Locksmith Scraper via Jina.ai Reader API
 *
 * This script scrapes locksmith data from Dutch directories and sources:
 * - VVS (Vereniging Vakspecialisten Sleutelbedrijf) member directory
 * - Dutch business directories
 * - Locksmith association pages
 *
 * Purpose: Get additional descriptive content that GPT can use
 * to write unique "About" sections for each locksmith page.
 *
 * Pipeline:
 * 1. Bright Data SERP → Base locksmith data (location, ratings, photos)
 * 2. Jina.ai → Extra content (descriptions, services, certifications)
 * 3. OpenAI GPT → Generate unique "About" sections
 */

import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Jina.ai API configuration
const JINA_API_KEY = process.env.JINA_API_KEY || '';
const JINA_READER_URL = 'https://r.jina.ai/';

if (!JINA_API_KEY) {
  console.error('❌ JINA_API_KEY not found in environment variables');
  process.exit(1);
}

// Dutch Provinces with their abbreviations
const NL_PROVINCES = [
  { name: 'Noord-Holland', abbrev: 'NH' },
  { name: 'Zuid-Holland', abbrev: 'ZH' },
  { name: 'Utrecht', abbrev: 'UT' },
  { name: 'Noord-Brabant', abbrev: 'NB' },
  { name: 'Gelderland', abbrev: 'GE' },
  { name: 'Limburg', abbrev: 'LI' },
  { name: 'Overijssel', abbrev: 'OV' },
  { name: 'Friesland', abbrev: 'FR' },
  { name: 'Groningen', abbrev: 'GR' },
  { name: 'Drenthe', abbrev: 'DR' },
  { name: 'Zeeland', abbrev: 'ZE' },
  { name: 'Flevoland', abbrev: 'FL' },
];

interface LocksmithBasic {
  name: string;
  city: string;
  gemeente?: string;
  province: string;
  provinceAbbrev: string;
  url: string;
  source: string;
}

interface LocksmithDetail extends LocksmithBasic {
  address?: string;
  postalCode?: string;
  serviceTypes?: string[];
  certifications?: string[];
  brands?: string[];
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  phone?: string;
  website?: string;
  description?: string;
  services?: string;
  is24Hour?: boolean;
  responseTime?: string;
  kvkNumber?: string;
  photoUrl?: string;
  rawContent?: string; // For GPT enrichment
}

interface ScrapeProgress {
  lastProvince: string;
  lastSource: string;
  lastIndex: number;
  completedProvinces: string[];
  totalScraped: number;
  timestamp: string;
}

// Rate limiting
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Fetch with Jina.ai Reader
async function fetchWithJina(url: string, retries = 3): Promise<string> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log('   Fetching:', url.substring(0, 80) + (url.length > 80 ? '...' : ''));

      const response = await fetch(JINA_READER_URL + url, {
        headers: {
          'Authorization': 'Bearer ' + JINA_API_KEY,
          'Accept': 'text/plain',
          'X-Return-Format': 'text'
        }
      });

      if (!response.ok) {
        throw new Error('Jina fetch failed: ' + response.status + ' ' + response.statusText);
      }

      const text = await response.text();
      console.log('   Received ' + text.length + ' characters');
      return text;
    } catch (error) {
      if (attempt === retries) throw error;
      console.log('   Attempt ' + attempt + ' failed, retrying...');
      await delay(2000 * attempt);
    }
  }
  throw new Error('Max retries exceeded');
}

// Parse VVS member directory page
function parseVVSPage(content: string, province: { name: string; abbrev: string }): LocksmithBasic[] {
  const locksmiths: LocksmithBasic[] = [];

  // Look for locksmith entries in markdown format
  // VVS pages typically list members with their info
  const linkPattern = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g;

  let match;
  while ((match = linkPattern.exec(content)) !== null) {
    const name = match[1].trim();
    const url = match[2];

    // Skip navigation links and non-locksmith entries
    if (name.toLowerCase().includes('terug') ||
        name.toLowerCase().includes('home') ||
        name.toLowerCase().includes('contact') ||
        !url.includes('slotenmaker') && !url.includes('sleutel')) {
      continue;
    }

    locksmiths.push({
      name,
      city: '',
      province: province.name,
      provinceAbbrev: province.abbrev,
      url,
      source: 'vvs.nl'
    });
  }

  return locksmiths;
}

// Parse locksmith detail page for extra content
function parseLocksmithDetailPage(content: string, basic: LocksmithBasic): LocksmithDetail {
  const detail: LocksmithDetail = { ...basic };

  // Store raw content for GPT enrichment (trimmed to reasonable size)
  detail.rawContent = content.substring(0, 3000);

  // Address extraction (Dutch format: Straatnaam 123, 1234 AB Plaatsnaam)
  const addressMatch = content.match(/([A-Za-z\s]+\s+\d+[a-zA-Z]?),?\s*(\d{4}\s?[A-Z]{2})\s+([A-Za-z\s'-]+)/);
  if (addressMatch) {
    detail.address = addressMatch[1].trim();
    detail.postalCode = addressMatch[2].replace(/\s/g, '').toUpperCase();
    detail.city = addressMatch[3].trim();
  }

  // Phone extraction (Dutch format: 06-12345678 or 020-1234567)
  const phoneMatch = content.match(/(?:tel|telefoon|bel)[:\s]*([0-9\s\-+()]+)/i);
  if (phoneMatch) {
    detail.phone = phoneMatch[1].trim().replace(/\s/g, '');
  }

  // Website extraction
  const websiteMatch = content.match(/(?:website|www)[:\s]*(https?:\/\/[^\s]+|www\.[^\s]+)/i);
  if (websiteMatch) {
    detail.website = websiteMatch[1].startsWith('http') ? websiteMatch[1] : 'https://' + websiteMatch[1];
  }

  // KvK number extraction
  const kvkMatch = content.match(/(?:kvk|kamer van koophandel)[:\s]*(\d{8})/i);
  if (kvkMatch) {
    detail.kvkNumber = kvkMatch[1];
  }

  // 24-hour service detection
  detail.is24Hour = /24\s*uur|24\/7|dag\s*en\s*nacht|noodservice|spoed/i.test(content);

  // Service types detection
  const serviceTypes: string[] = [];
  const servicePatterns = [
    { pattern: /slot\s*openen|deur\s*openen|buitengesloten/i, type: 'Slot openen' },
    { pattern: /slot\s*vervangen|nieuw\s*slot/i, type: 'Slot vervangen' },
    { pattern: /cilinder\s*vervangen|cilinder/i, type: 'Cilinder vervangen' },
    { pattern: /inbraakbeveiliging|beveiliging/i, type: 'Inbraakbeveiliging' },
    { pattern: /auto\s*slot|autosleutel/i, type: 'Auto slotenmaker' },
    { pattern: /kluis|brandkast|safe/i, type: 'Kluis service' },
    { pattern: /sleutel\s*bijmaken|sleutel\s*kopie/i, type: 'Sleutel bijmaken' },
    { pattern: /smart\s*lock|elektronisch/i, type: 'Elektronische sloten' },
    { pattern: /hang\s*en\s*sluitwerk/i, type: 'Hang- en sluitwerk' },
  ];

  for (const { pattern, type } of servicePatterns) {
    if (pattern.test(content)) {
      serviceTypes.push(type);
    }
  }
  if (serviceTypes.length > 0) {
    detail.serviceTypes = serviceTypes;
  }

  // Certifications detection
  const certifications: string[] = [];
  const certPatterns = [
    'SKG',
    'VVS',
    'PKVW',
    'Politiekeurmerk',
    'gecertificeerd',
  ];

  for (const cert of certPatterns) {
    if (content.toLowerCase().includes(cert.toLowerCase())) {
      certifications.push(cert);
    }
  }
  if (certifications.length > 0) {
    detail.certifications = certifications;
  }

  // Brands detection
  const brands: string[] = [];
  const brandPatterns = [
    'NEMEF',
    'Lips',
    'AXA',
    'DOM',
    'ABUS',
    'Abloy',
    'Yale',
    'Mul-T-Lock',
    'EVVA',
    'ISEO',
  ];

  for (const brand of brandPatterns) {
    if (content.includes(brand)) {
      brands.push(brand);
    }
  }
  if (brands.length > 0) {
    detail.brands = brands;
  }

  // GPS coordinates extraction
  const gpsMatch = content.match(/(?:lat|latitude)[:\s]*(-?\d+\.?\d*)[,\s]+(?:lng|longitude|lon)[:\s]*(-?\d+\.?\d*)/i);
  if (gpsMatch) {
    detail.coordinates = {
      latitude: parseFloat(gpsMatch[1]),
      longitude: parseFloat(gpsMatch[2])
    };
  }

  // Services description - look for substantial text about services
  const lines = content.split('\n').filter(line =>
    line.length > 100 &&
    !line.startsWith('[') &&
    !line.startsWith('http') &&
    !line.includes('Navigation') &&
    (line.toLowerCase().includes('dienst') ||
     line.toLowerCase().includes('service') ||
     line.toLowerCase().includes('sloten') ||
     line.toLowerCase().includes('beveiliging'))
  );
  if (lines.length > 0) {
    detail.services = lines.slice(0, 3).join(' ').substring(0, 1000);
  }

  return detail;
}

// Progress management
function getOutputDir(): string {
  return path.join(__dirname, '..', '..', 'data', 'scraped-facilities');
}

function loadProgress(): ScrapeProgress {
  const progressPath = path.join(getOutputDir(), 'progress.json');

  if (fs.existsSync(progressPath)) {
    return JSON.parse(fs.readFileSync(progressPath, 'utf-8'));
  }

  return {
    lastProvince: '',
    lastSource: '',
    lastIndex: 0,
    completedProvinces: [],
    totalScraped: 0,
    timestamp: new Date().toISOString()
  };
}

function saveProgress(progress: ScrapeProgress): void {
  const outputDir = getOutputDir();
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const progressPath = path.join(outputDir, 'progress.json');
  progress.timestamp = new Date().toISOString();
  fs.writeFileSync(progressPath, JSON.stringify(progress, null, 2));
}

function saveProvinceData(province: string, source: string, data: LocksmithDetail[]): void {
  const outputDir = getOutputDir();

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const fileName = province.toLowerCase().replace(/\s+/g, '-') + '-' + source.replace(/\./g, '-') + '.json';
  const outputPath = path.join(outputDir, fileName);
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));

  console.log('Saved ' + data.length + ' locksmiths for ' + province + ' (' + source + ')');
}

function combineAllData(): void {
  const outputDir = getOutputDir();
  const allData: LocksmithDetail[] = [];

  if (!fs.existsSync(outputDir)) {
    console.log('No data to combine yet');
    return;
  }

  const files = fs.readdirSync(outputDir).filter(f =>
    f.endsWith('.json') &&
    f !== 'progress.json' &&
    f !== 'all-locksmiths.json' &&
    f !== 'summary.json'
  );

  for (const file of files) {
    const filePath = path.join(outputDir, file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    allData.push(...data);
  }

  // Remove duplicates by URL
  const unique = Array.from(new Map(allData.map(l => [l.url, l])).values());

  // Save combined data
  const combinedPath = path.join(outputDir, 'all-locksmiths.json');
  fs.writeFileSync(combinedPath, JSON.stringify(unique, null, 2));

  console.log('\nTotal: ' + unique.length + ' unique locksmiths combined');

  // Create summary
  const summary: Record<string, unknown> = {
    total: unique.length,
    byProvince: {} as Record<string, number>,
    bySource: {} as Record<string, number>,
    byServiceType: {} as Record<string, number>,
    withAddress: unique.filter(l => l.address).length,
    withCoordinates: unique.filter(l => l.coordinates).length,
    withServiceTypes: unique.filter(l => l.serviceTypes && l.serviceTypes.length > 0).length,
    withCertifications: unique.filter(l => l.certifications && l.certifications.length > 0).length,
    with24HourService: unique.filter(l => l.is24Hour).length,
    withServices: unique.filter(l => l.services).length,
    lastUpdated: new Date().toISOString()
  };

  const byProvince = summary.byProvince as Record<string, number>;
  const bySource = summary.bySource as Record<string, number>;
  const byServiceType = summary.byServiceType as Record<string, number>;

  for (const locksmith of unique) {
    byProvince[locksmith.province] = (byProvince[locksmith.province] || 0) + 1;
    bySource[locksmith.source] = (bySource[locksmith.source] || 0) + 1;
    if (locksmith.serviceTypes) {
      for (const service of locksmith.serviceTypes) {
        byServiceType[service] = (byServiceType[service] || 0) + 1;
      }
    }
  }

  const summaryPath = path.join(outputDir, 'summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));

  console.log('Summary saved to ' + summaryPath);
}

// Main scraping function for VVS directory
async function scrapeVVS(provinces: typeof NL_PROVINCES, progress: ScrapeProgress): Promise<void> {
  console.log('\nScraping VVS slotenmaker directory...\n');

  for (const province of provinces) {
    const provinceKey = province.abbrev + '-vvs';

    if (progress.completedProvinces.includes(provinceKey)) {
      console.log('Skipping ' + province.name + ' (already completed)');
      continue;
    }

    console.log('\nScraping ' + province.name + '...');

    try {
      // VVS uses province names in URLs (this is a placeholder - actual VVS URL structure may differ)
      const provinceSlug = province.name.toLowerCase().replace(/\s+/g, '-');
      const provinceUrl = 'https://www.vvs.nl/leden/provincie/' + provinceSlug;

      const provinceContent = await fetchWithJina(provinceUrl);
      await delay(1500);

      const locksmiths = parseVVSPage(provinceContent, province);
      console.log('   Found: ' + locksmiths.length + ' locksmiths');

      if (locksmiths.length === 0) {
        console.log('   No locksmiths found, skipping');
        progress.completedProvinces.push(provinceKey);
        saveProgress(progress);
        continue;
      }

      const detailedLocksmiths: LocksmithDetail[] = [];

      // Limit to first 30 per province to avoid timeout
      const maxDetails = 30;
      const toFetch = locksmiths.slice(0, maxDetails);

      for (let i = 0; i < toFetch.length; i++) {
        const locksmith = toFetch[i];

        try {
          console.log('   [' + (i + 1) + '/' + toFetch.length + '] ' + locksmith.name);

          const detailContent = await fetchWithJina(locksmith.url);
          const detail = parseLocksmithDetailPage(detailContent, locksmith);
          detailedLocksmiths.push(detail);

          progress.totalScraped++;

          if (i % 10 === 0) {
            saveProgress(progress);
          }

          await delay(800);

        } catch (error) {
          console.error('   Error fetching ' + locksmith.name + ': ' + error);
          detailedLocksmiths.push({ ...locksmith });
        }
      }

      // Add remaining without details
      for (let i = maxDetails; i < locksmiths.length; i++) {
        detailedLocksmiths.push({ ...locksmiths[i] });
      }

      saveProvinceData(province.name, 'vvs.nl', detailedLocksmiths);

      progress.completedProvinces.push(provinceKey);
      saveProgress(progress);

      console.log('Completed ' + province.name + ': ' + detailedLocksmiths.length + ' locksmiths');

      await delay(2000);

    } catch (error) {
      console.error('Error with ' + province.name + ': ' + error);
      saveProgress(progress);
    }
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);

  console.log('Netherlands Locksmith Scraper via Jina.ai\n');
  console.log('Purpose: Gather extra content for GPT enrichment\n');

  let source = 'vvs';
  let provincesToScrape = NL_PROVINCES;
  let testMode = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--source' && args[i + 1]) {
      source = args[i + 1];
      i++;
    } else if (args[i] === '--province' && args[i + 1]) {
      const provinceArg = args[i + 1].toUpperCase();
      const found = NL_PROVINCES.find(p => p.abbrev === provinceArg || p.name.toUpperCase() === provinceArg);
      if (found) {
        provincesToScrape = [found];
      } else {
        console.error('Unknown province: ' + args[i + 1]);
        process.exit(1);
      }
      i++;
    } else if (args[i] === '--test') {
      testMode = true;
      provincesToScrape = NL_PROVINCES.slice(0, 3);
    } else if (args[i] === '--help') {
      console.log(`
Usage: npx tsx scripts/scraping/scrape-nl-facilities.ts [options]

Options:
  --source <name>      Source to scrape (vvs)
  --province <abbrev>  Scrape specific province (e.g., NH, ZH)
  --test               Test mode - only first 3 provinces
  --resume             Resume from last saved position
  --help               Show this help message

Examples:
  npx tsx scripts/scraping/scrape-nl-facilities.ts --test
  npx tsx scripts/scraping/scrape-nl-facilities.ts --province NH
  npx tsx scripts/scraping/scrape-nl-facilities.ts --resume
      `);
      process.exit(0);
    }
  }

  if (testMode) {
    console.log('Test mode: scraping first 3 provinces only\n');
  }

  console.log('Source: ' + source);
  console.log('Provinces to scrape: ' + provincesToScrape.length);
  console.log('');

  const progress = loadProgress();

  if (source === 'vvs') {
    await scrapeVVS(provincesToScrape, progress);
  } else {
    console.log('Unknown source: ' + source);
  }

  console.log('\nCombining all data...');
  combineAllData();

  console.log('\nScraping completed!');
}

main().catch(console.error);
