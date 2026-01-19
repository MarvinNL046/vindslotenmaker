# Slotenmaker Discovery Systeem

Automatisch Nederlandse slotenmakers ontdekken via Bright Data SERP API.

## Overzicht

Dit systeem zoekt automatisch naar slotenmakers in alle Nederlandse provincies en steden via Google Maps, haalt CIDs/place_ids op en verzamelt reviews, ratings en openingstijden.

## Scripts

### 1. `seed-locations.ts` - Genereer zoeklocaties

Maakt een lijst van alle Nederlandse provincies en steden.

```bash
# Genereer alle locaties
npx tsx scripts/discovery/seed-locations.ts

# Alleen een provincie
npx tsx scripts/discovery/seed-locations.ts --province "Noord-Holland"

# Dry run (preview)
npx tsx scripts/discovery/seed-locations.ts --dry-run

# Reset en opnieuw beginnen
npx tsx scripts/discovery/seed-locations.ts --reset
```

### 2. `discover-facilities.ts` - Zoek naar slotenmakers

Zoekt via Bright Data SERP API naar slotenmakers in elke locatie.

```bash
# Verwerk alle pending locaties
npx tsx scripts/discovery/discover-facilities.ts

# Alleen een provincie
npx tsx scripts/discovery/discover-facilities.ts --province "Noord-Holland"

# Beperk aantal locaties
npx tsx scripts/discovery/discover-facilities.ts --batch 50

# Dry run (preview, geen API calls)
npx tsx scripts/discovery/discover-facilities.ts --dry-run

# Hervat na onderbreking
npx tsx scripts/discovery/discover-facilities.ts --resume
```

### 3. `export-to-main-data.ts` - Export naar hoofddata

Voegt ontdekte slotenmakers samen met bestaande `facilities.json`.

```bash
# Export alles
npx tsx scripts/discovery/export-to-main-data.ts

# Preview zonder wijzigingen
npx tsx scripts/discovery/export-to-main-data.ts --dry-run

# Alleen nieuwe (skip updates)
npx tsx scripts/discovery/export-to-main-data.ts --skip-existing
```

## Data Bestanden

```
data/discovery/
├── locations.json              # Alle Nederlandse locaties met status
├── progress.json               # Voortgangsstatistieken
├── discovered-facilities.json  # Ontdekte slotenmakers (raw)
└── rate-limits.json            # API rate limiting state
```

## Workflow

1. **Seed locaties** (eenmalig of na grenswijzigingen)
   ```bash
   npx tsx scripts/discovery/seed-locations.ts
   ```

2. **Run discovery** (kan meerdere keren, auto-hervat)
   ```bash
   npx tsx scripts/discovery/discover-facilities.ts
   ```

3. **Export naar hoofddata**
   ```bash
   npx tsx scripts/discovery/export-to-main-data.ts
   ```

4. **Commit & deploy**
   ```bash
   git add data/
   git commit -m "Add discovered slotenmakers"
   ```

## Rate Limiting

Het discovery script heeft ingebouwde rate limiting:

| Limiet | Waarde |
|--------|--------|
| Per minuut | 10 requests |
| Per uur | 300 requests |
| Per dag | 3000 requests |
| Retry pogingen | 3 (exponential backoff) |
| Batch delay | 3 seconden |

De state wordt opgeslagen in `rate-limits.json` en blijft behouden tussen runs.

## Retry Logica

- **Automatische retries**: 3 pogingen met exponential backoff
- **Gefaalde locaties**: Worden gemarkeerd en kunnen opnieuw worden geprobeerd
- **Resume support**: Hervat waar je gebleven bent met `--resume`

## Wat Wordt Opgehaald?

Per slotenmaker:
- Google CID (voor reviews ophalen)
- Google Place ID
- Naam en adres
- GPS coordinaten
- Telefoon en website
- Rating en aantal reviews
- Openingstijden
- Top reviews (max 10)
- Bedrijfstype en diensten

## Environment Variables

Zorg dat deze in `.env.local` staan:

```env
BRIGHTDATA_API_KEY=your_api_key_here
# of
BRIGHTDATA_API_TOKEN=your_api_key_here
```

## Tips

1. **Begin klein**: Test eerst met een provincie (`--province "Flevoland"`)
2. **Monitor voortgang**: Check `progress.json` voor statistieken
3. **Batch runs**: Gebruik `--batch 100` voor gecontroleerde runs
4. **Dry run eerst**: Gebruik `--dry-run` om te zien wat er gebeurt

## Voorbeeld Output

```
🔐 Slotenmaker Discovery Script - Nederland

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Status:
   Total locations: 342
   To process: 342
   Already found: 0 slotenmakers
   Unique CIDs: 0

🚀 Starting processing of 342 locations...

🔐 Amsterdam, NH
   🔎 Searching: "slotenmaker Amsterdam"...
   ✓ 15 found (15 new)
   🔎 Searching: "24 uur slotenmaker Amsterdam"...
   ✓ 8 found (3 new)
   💾 Saved (1/342)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 SAMENVATTING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Processed: 342/342 locations
🆕 Newly found: 1847 slotenmakers
📦 Total in database: 1847
🔢 Unique CIDs: 1847
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Zoektermen

Het script zoekt met de volgende Nederlandse termen:

- slotenmaker
- slotspecialist
- sleutelservice
- 24 uur slotenmaker
- noodslotenmaker
- slot openen
- cilinder vervangen
- inbraakbeveiliging
- hang en sluitwerk
- auto slotenmaker
- sleutel bijmaken
- slot reparatie
- deur openen
- slot vervangen

## Nederlandse Provincies

Het systeem ondersteunt alle 12 Nederlandse provincies:

| Provincie | Afkorting |
|-----------|-----------|
| Noord-Holland | NH |
| Zuid-Holland | ZH |
| Utrecht | UT |
| Noord-Brabant | NB |
| Gelderland | GE |
| Limburg | LI |
| Overijssel | OV |
| Friesland | FR |
| Groningen | GR |
| Drenthe | DR |
| Zeeland | ZE |
| Flevoland | FL |
