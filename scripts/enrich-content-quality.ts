#!/usr/bin/env npx tsx
/**
 * HIGH-QUALITY Content Verrijking Script voor Slotenmakers
 *
 * Genereert unieke, waardevolle content per slotenmaker voor SEO.
 *
 * Features:
 * - Service-type-specifieke prompts (24-uurs, autosloten, woningbeveiliging, etc.)
 * - Gebruikt ALLE beschikbare context data
 * - Minimum 400 woorden per pagina
 * - Variatie in openingszinnen (geen template content)
 * - Kwaliteitscontroles en retry logica
 * - Voortgang tracking met hervat mogelijkheid
 *
 * Gebruik:
 *   npx tsx scripts/enrich-content-quality.ts --dry-run      # Preview
 *   npx tsx scripts/enrich-content-quality.ts --batch 50     # Eerste 50
 *   npx tsx scripts/enrich-content-quality.ts --reset        # Opnieuw beginnen
 *   npx tsx scripts/enrich-content-quality.ts                # Volledige run
 */

import fs from 'fs';
import path from 'path';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';

// Load environment variables from .env.openai
dotenv.config({ path: path.join(process.cwd(), '.env.openai') });
dotenv.config({ path: path.join(process.cwd(), '.env.local') }); // Fallback

// =============================================================================
// CONFIGURATIE
// =============================================================================

const CONFIG = {
  MODEL: 'gpt-4o-mini',
  MAX_TOKENS: 1500,
  TEMPERATURE: 0.8, // Hogere temperature voor meer variatie
  CONCURRENCY: 5,
  MIN_WORDS: 400,
  MAX_RETRIES: 3,
  DELAY_BETWEEN_REQUESTS: 200, // ms
  SAVE_INTERVAL: 25, // Opslaan elke 25 entries

  DATA_FILE: path.join(process.cwd(), 'data', 'slotenmakers.json'),
  PROGRESS_FILE: path.join(process.cwd(), 'data', 'enrichment-quality-progress.json'),
  BACKUP_FILE: path.join(process.cwd(), 'data', 'slotenmakers-pre-enrichment.json'),
};

// =============================================================================
// TYPE DEFINITIES
// =============================================================================

interface Slotenmaker {
  name: string;
  city: string;
  province: string;
  province_abbr: string;
  municipality?: string;
  slug: string;
  service_types: string[];
  brands: string[];
  address?: string;
  phone?: string;
  website?: string;
  rating?: number;
  review_count?: number;
  photo?: string;
  is_24_hour?: boolean;
  response_time?: string;
  certifications?: string[];
  description?: string;
  generated?: GeneratedContent;
  [key: string]: unknown;
}

interface GeneratedContent {
  summary: string;
  diensten?: string;
  werkwijze?: string;
  praktische_info?: string;
  highlights?: string[];
  tips?: string[];
}

interface Progress {
  total: number;
  completed: number;
  failed: number;
  skipped: number;
  completedSlugs: string[];
  failedSlugs: string[];
  lastRun: string;
  avgWordCount: number;
}

// =============================================================================
// SERVICE-TYPE-SPECIFIEKE PROMPTS
// =============================================================================

const TYPE_CONTEXTS: Record<string, string> = {
  '24-uurs': `
Dit is een SLOTENMAKER MET 24-UURS SPOEDSERVICE. Belangrijke aspecten:
- Direct beschikbaar, ook 's nachts en in het weekend
- Snelle responstijd voor noodgevallen
- Buitensluiting hulp
- Noodopening zonder schade waar mogelijk
- Professionele hulp bij inbraakschade
- Altijd bereikbaar voor spoed
`,

  'woningbeveiliging': `
Dit is een slotenmaker gespecialiseerd in WONINGBEVEILIGING. Belangrijke aspecten:
- SKG-gecertificeerde sloten (1, 2, 3 sterren)
- Meerpuntsluitingen voor extra veiligheid
- Inbraakpreventie advies
- PKVW (Politiekeurmerk Veilig Wonen) certificering
- Deurbeslag en hang- en sluitwerk
- Raambeveiliging
`,

  'autosloten': `
Dit is een slotenmaker gespecialiseerd in AUTOSLOTEN. Belangrijke aspecten:
- Auto openen bij buitensluiting
- Autosleutels bijmaken en programmeren
- Transponder sleutels
- Keyless entry systemen
- Alle automerken
- Mobiele service ter plaatse
`,

  'kluizen': `
Dit is een slotenmaker gespecialiseerd in KLUIZEN. Belangrijke aspecten:
- Kluizen openen en repareren
- Advies over kluiskeuze
- Inbouw- en opbouwkluizen
- Brandwerende kluizen
- Elektronische en mechanische sloten
- Combinatie wijzigen
`,

  'elektronisch': `
Dit is een slotenmaker gespecialiseerd in ELEKTRONISCHE SLOTEN. Belangrijke aspecten:
- Smart locks en codesloten
- Vingerafdruksloten
- Toegangscontrole systemen
- Intercomsystemen
- Keyless entry voor woningen
- Installatie en programmering
`,

  'bedrijfsbeveiliging': `
Dit is een slotenmaker voor BEDRIJFSBEVEILIGING. Belangrijke aspecten:
- Toegangscontrolesystemen
- Masterkey systemen
- Inbraakbeveiliging voor bedrijven
- Slot- en sleutelplannen
- Nooduitgangen en vluchtdeuren
- Onderhoud contracten
`,
};

const OPENING_VARIATIONS = [
  'In het hart van {city} vindt u',
  'Voor inwoners van {city} is',
  'Als u op zoek bent naar een slotenmaker in {city},',
  'In de regio {province} is',
  'Wanneer u hulp nodig heeft in {city},',
  'In {city} staat',
  'Voor snelle hulp in {city} kunt u terecht bij',
  'Betrouwbare hulp in {province} vindt u bij',
  'Al jarenlang actief in {city} is',
  'Uw specialist in {city} is',
];

// =============================================================================
// HELPER FUNCTIES
// =============================================================================

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getTypeContext(serviceTypes: string[]): string {
  const types = (serviceTypes || []).map(t => t.toLowerCase()).join(' ');

  for (const [key, context] of Object.entries(TYPE_CONTEXTS)) {
    if (types.includes(key)) {
      return context;
    }
  }

  // Default voor algemene slotenmaker
  return `
Dit is een ALGEMENE SLOTENMAKER. Belangrijke aspecten:
- Sloten openen en vervangen
- Cilindersloten en meerpuntsluitingen
- Noodopening bij buitensluiting
- SKG-gecertificeerde sloten
- Sleutelservice
- Advies over beveiliging
`;
}

function buildContextString(slotenmaker: Slotenmaker): string {
  const parts: string[] = [];

  if (slotenmaker.service_types?.length > 0) {
    parts.push(`Diensten: ${slotenmaker.service_types.join(', ')}`);
  }
  if (slotenmaker.brands?.length > 0) {
    parts.push(`Merken: ${slotenmaker.brands.join(', ')}`);
  }
  if (slotenmaker.certifications?.length > 0) {
    parts.push(`Certificeringen: ${slotenmaker.certifications.join(', ')}`);
  }
  if (slotenmaker.is_24_hour) {
    parts.push('24-uurs service beschikbaar');
  }
  if (slotenmaker.response_time) {
    parts.push(`Gemiddelde responstijd: ${slotenmaker.response_time}`);
  }
  if (slotenmaker.rating && slotenmaker.review_count) {
    parts.push(`Beoordeling: ${slotenmaker.rating}/5 (${slotenmaker.review_count} reviews)`);
  }
  if (slotenmaker.phone) {
    parts.push(`Telefoonnummer: ${slotenmaker.phone}`);
  }
  if (slotenmaker.website) {
    parts.push('Website beschikbaar');
  }

  return parts.join('\n');
}

function createPrompt(slotenmaker: Slotenmaker): string {
  const typeContext = getTypeContext(slotenmaker.service_types || []);
  const dataContext = buildContextString(slotenmaker);
  const randomOpening = OPENING_VARIATIONS[Math.floor(Math.random() * OPENING_VARIATIONS.length)];

  return `Je bent een ervaren schrijver gespecialiseerd in de slotenmaker branche in Nederland.

TAAK: Schrijf een informatieve, unieke en boeiende beschrijving voor deze slotenmaker.

=== SLOTENMAKER INFORMATIE ===
Naam: ${slotenmaker.name}
Stad: ${slotenmaker.city}
Provincie: ${slotenmaker.province}
Gemeente: ${slotenmaker.municipality || 'N/A'}
${slotenmaker.address ? `Adres: ${slotenmaker.address}` : ''}

=== BESCHIKBARE DATA ===
${dataContext || 'Beperkte aanvullende informatie beschikbaar.'}

=== SERVICE TYPE CONTEXT ===
${typeContext}

=== SCHRIJFINSTRUCTIES ===

1. LENGTE: Schrijf MINIMAAL 400 woorden, bij voorkeur 450-500 woorden.

2. OPENING: Begin NIET met "${slotenmaker.name} is een..."
   Gebruik een creatieve opening, variaties zoals: "${randomOpening}"

3. STRUCTUUR: Verwerk deze elementen natuurlijk in je tekst:
   - Een sfeervolle introductie die de lezer aanspreekt
   - Overzicht van diensten en specialisaties
   - Wat klanten kunnen verwachten
   - Praktische informatie voor potentiele klanten
   - Wat dit bedrijf onderscheidt

4. TOON: Professioneel, betrouwbaar en behulpzaam. Niet te commercieel.

5. LOKALE RELEVANTIE: Verwijs naar ${slotenmaker.city} en ${slotenmaker.province}.
   Maak de content relevant voor mensen die zoeken in dit gebied.

6. UNIEKHEID: Elke zin moet waarde toevoegen. Geen opvulling of generieke content.

7. SEO: Verwerk natuurlijk termen als: "${slotenmaker.name}", "slotenmaker ${slotenmaker.city}", "slotenmaker ${slotenmaker.province}".

8. CALL TO ACTION: Eindig met bemoedigende woorden over contact opnemen.

=== OUTPUT FORMAT (JSON) ===
{
  "summary": "De hoofdtekst van minimaal 400 woorden",
  "diensten": "2-3 zinnen over de belangrijkste diensten",
  "werkwijze": "2-3 zinnen over hoe ze werken",
  "praktische_info": "Belangrijke praktische info voor klanten",
  "highlights": ["Hoogtepunt 1", "Hoogtepunt 2", "Hoogtepunt 3"],
  "tips": ["Tip 1", "Tip 2"]
}

BELANGRIJK: De "summary" moet de hoofdtekst zijn van minimaal 400 woorden. Dit is de belangrijkste content.`;
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(w => w.length > 0).length;
}

function validateContent(content: GeneratedContent, slotenmaker: Slotenmaker): { valid: boolean; issues: string[] } {
  const issues: string[] = [];

  const wordCount = countWords(content.summary || '');
  if (wordCount < CONFIG.MIN_WORDS) {
    issues.push(`Te weinig woorden: ${wordCount} (minimum: ${CONFIG.MIN_WORDS})`);
  }

  // Check for template-like openings
  const templateOpenings = [
    `${slotenmaker.name} is een`,
    `${slotenmaker.name} is de`,
    'Dit is een slotenmaker',
    'Deze slotenmaker is',
  ];

  const summary = content.summary?.toLowerCase() || '';
  for (const template of templateOpenings) {
    if (summary.startsWith(template.toLowerCase())) {
      issues.push(`Template-achtige opening gedetecteerd: "${template}..."`);
      break;
    }
  }

  // Check for overly generic content
  const genericPhrases = [
    'biedt uitgebreide diensten',
    'levert kwaliteit',
    'bedient de gemeenschap',
  ];

  let genericCount = 0;
  for (const phrase of genericPhrases) {
    if (summary.includes(phrase.toLowerCase())) {
      genericCount++;
    }
  }
  if (genericCount >= 2) {
    issues.push('Te veel generieke zinnen gedetecteerd');
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

// =============================================================================
// HOOFD VERRIJKING LOGICA
// =============================================================================

async function enrichSlotenmaker(
  openai: OpenAI,
  slotenmaker: Slotenmaker,
  attempt: number = 1
): Promise<GeneratedContent | null> {
  try {
    const prompt = createPrompt(slotenmaker);

    const response = await openai.chat.completions.create({
      model: CONFIG.MODEL,
      messages: [
        {
          role: 'system',
          content: 'Je bent een expert in de slotenmaker branche in Nederland. Je schrijft unieke, informatieve content die mensen helpt de juiste slotenmaker te vinden. Antwoord altijd in geldig JSON formaat.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: CONFIG.TEMPERATURE,
      max_tokens: CONFIG.MAX_TOKENS,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0].message.content || '{}';
    const parsed = JSON.parse(content) as GeneratedContent;

    // Valideer
    const validation = validateContent(parsed, slotenmaker);

    if (!validation.valid && attempt < CONFIG.MAX_RETRIES) {
      console.log(`   Waarschuwing: Validatie gefaald: ${validation.issues.join(', ')}`);
      console.log(`   Retry ${attempt + 1}/${CONFIG.MAX_RETRIES}...`);
      await sleep(1000);
      return enrichSlotenmaker(openai, slotenmaker, attempt + 1);
    }

    if (!validation.valid) {
      console.log(`   Validatie gefaald na ${CONFIG.MAX_RETRIES} pogingen`);
      return null;
    }

    return parsed;

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Onbekende fout';
    if (attempt < CONFIG.MAX_RETRIES) {
      console.log(`   Fout: ${errorMessage}, retry ${attempt + 1}...`);
      await sleep(2000);
      return enrichSlotenmaker(openai, slotenmaker, attempt + 1);
    }
    console.error(`   Gefaald na ${CONFIG.MAX_RETRIES} pogingen:`, errorMessage);
    return null;
  }
}

// =============================================================================
// VOORTGANG BEHEER
// =============================================================================

function loadProgress(): Progress {
  try {
    if (fs.existsSync(CONFIG.PROGRESS_FILE)) {
      return JSON.parse(fs.readFileSync(CONFIG.PROGRESS_FILE, 'utf-8'));
    }
  } catch {
    // Ignore errors, return default
  }

  return {
    total: 0,
    completed: 0,
    failed: 0,
    skipped: 0,
    completedSlugs: [],
    failedSlugs: [],
    lastRun: new Date().toISOString(),
    avgWordCount: 0,
  };
}

function saveProgress(progress: Progress): void {
  progress.lastRun = new Date().toISOString();
  fs.writeFileSync(CONFIG.PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

function loadSlotenmakers(): Slotenmaker[] {
  return JSON.parse(fs.readFileSync(CONFIG.DATA_FILE, 'utf-8'));
}

function saveSlotenmakers(slotenmakers: Slotenmaker[]): void {
  fs.writeFileSync(CONFIG.DATA_FILE, JSON.stringify(slotenmakers, null, 2));
}

// =============================================================================
// MAIN
// =============================================================================

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const reset = args.includes('--reset');
  const batchArg = args.find(a => a.startsWith('--batch'));
  const batchSize = batchArg ? parseInt(args[args.indexOf(batchArg) + 1]) : Infinity;

  console.log('');
  console.log('HIGH-QUALITY Content Verrijking voor Slotenmakers');
  console.log('==================================================');
  console.log(`Model: ${CONFIG.MODEL}`);
  console.log(`Minimum woorden: ${CONFIG.MIN_WORDS}`);
  console.log(`Dry run: ${dryRun}`);
  console.log('');

  // Check API key
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('OPENAI_API_KEY niet gevonden in environment');
    console.log('   Stel in: export OPENAI_API_KEY=sk-...');
    process.exit(1);
  }

  const openai = new OpenAI({ apiKey });

  // Load data
  console.log('Data laden...');
  const slotenmakers = loadSlotenmakers();
  let progress = reset ? loadProgress() : loadProgress();

  if (reset) {
    progress = {
      total: 0, completed: 0, failed: 0, skipped: 0,
      completedSlugs: [], failedSlugs: [],
      lastRun: new Date().toISOString(), avgWordCount: 0,
    };
  }

  console.log(`   Totaal slotenmakers: ${slotenmakers.length}`);
  console.log(`   Al verwerkt: ${progress.completedSlugs.length}`);

  // Filter entries to process
  const toProcess = slotenmakers.filter(s => {
    // Skip if already processed
    if (progress.completedSlugs.includes(s.slug)) return false;

    // Check if current generated content is good enough
    const gen = s.generated;
    if (gen && typeof gen === 'object') {
      const summary = gen.summary || '';
      const words = countWords(summary);
      if (words >= CONFIG.MIN_WORDS) {
        return false; // Already has good content
      }
    }

    return true;
  });

  console.log(`   Te verwerken: ${toProcess.length}`);
  console.log('');

  if (toProcess.length === 0) {
    console.log('Alle entries hebben al goede content!');
    return;
  }

  // Dry run
  if (dryRun) {
    console.log('DRY RUN - Eerste 5 entries:');
    for (const s of toProcess.slice(0, 5)) {
      const gen = s.generated?.summary || '';
      const words = countWords(gen);
      console.log(`   - ${s.name} (${s.city}, ${s.province})`);
      console.log(`     Huidige woorden: ${words}`);
    }
    console.log('');
    console.log(`Totaal te verwerken: ${Math.min(toProcess.length, batchSize)}`);
    return;
  }

  // Create backup
  if (!fs.existsSync(CONFIG.BACKUP_FILE)) {
    console.log('Backup maken...');
    fs.copyFileSync(CONFIG.DATA_FILE, CONFIG.BACKUP_FILE);
  }

  // Process
  const processCount = Math.min(toProcess.length, batchSize);
  console.log(`Verwerken van ${processCount} entries...`);
  console.log('');

  let totalWords = 0;
  let successCount = 0;

  for (let i = 0; i < processCount; i++) {
    const slotenmaker = toProcess[i];
    const pct = Math.round((i / processCount) * 100);

    process.stdout.write(`[${pct}%] ${i + 1}/${processCount}: ${slotenmaker.name.substring(0, 40)}...`);

    const content = await enrichSlotenmaker(openai, slotenmaker);

    if (content) {
      // Update slotenmaker
      const idx = slotenmakers.findIndex(s => s.slug === slotenmaker.slug);
      if (idx !== -1) {
        slotenmakers[idx].generated = content;

        // Update stats
        const words = countWords(content.summary);
        totalWords += words;
        successCount++;

        console.log(` ${words} woorden`);

        progress.completedSlugs.push(slotenmaker.slug);
        progress.completed++;
      }
    } else {
      console.log(' Gefaald');
      progress.failedSlugs.push(slotenmaker.slug);
      progress.failed++;
    }

    // Save periodically
    if ((i + 1) % CONFIG.SAVE_INTERVAL === 0) {
      console.log(`   Voortgang opslaan...`);
      saveSlotenmakers(slotenmakers);
      saveProgress(progress);
    }

    // Rate limiting
    await sleep(CONFIG.DELAY_BETWEEN_REQUESTS);
  }

  // Final save
  saveSlotenmakers(slotenmakers);
  progress.avgWordCount = successCount > 0 ? Math.round(totalWords / successCount) : 0;
  saveProgress(progress);

  // Summary
  console.log('');
  console.log('==================================================');
  console.log('RESULTATEN');
  console.log('==================================================');
  console.log(`Succesvol: ${successCount}`);
  console.log(`Gefaald: ${progress.failed}`);
  console.log(`Gemiddeld aantal woorden: ${progress.avgWordCount}`);
  console.log(`Data opgeslagen in: ${CONFIG.DATA_FILE}`);
  console.log('');
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\nGestopt door gebruiker. Voortgang is opgeslagen.');
  process.exit(0);
});

main().catch(error => {
  console.error('Fatale fout:', error);
  process.exit(1);
});
