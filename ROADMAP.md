# VindSlotenmaker.nl - Project Roadmap

**Repository:** https://github.com/MarvinNL046/vindslotenmaker
**Laatst Bijgewerkt:** 19-01-2026
**Status:** Development Phase

---

## Project Overzicht

VindSlotenmaker.nl is een uitgebreide directory van slotenmakers in Nederland. Het platform helpt gebruikers betrouwbare slotenmakers te vinden voor noodopeningen, woningbeveiliging, autosloten, kluizen en meer.

---

## Voltooide Taken

### Fase 1: Site Transformatie (Voltooid)
- [x] Codebase opzetten met Next.js 16
- [x] Alle componenten en pagina's voor slotenmaker context
- [x] Nederlandse content en SEO-teksten
- [x] Drizzle schema met slotenmakers tabel
- [x] Indexes en relaties in database schema

### Fase 2: Design (Voltooid)
- [x] Kleurthema: Oranje (nood/urgent) + Donkergrijs (professioneel)
- [x] Logo component met sleutel icoon
- [x] Homepage hero sectie
- [x] Header en Footer met branding
- [x] Responsive design voor alle schermen

### Fase 3: Content & Pagina's (Voltooid)
- [x] Blog artikelen over sloten en beveiliging
- [x] Gids pagina's (welk slot kiezen, kosten, etc.)
- [x] Affiliate configuratie voor beveiligingsproducten
- [x] Interne links en navigatie

### Fase 4: Developer Tooling (Voltooid)
- [x] Health check script
- [x] Data quality analyse script
- [x] Content enrichment script

---

## Openstaande Taken

### Fase 5: Data & Scraping (Hoge Prioriteit)
- [ ] **Neon PostgreSQL database opzetten**
  - Database instance aanmaken
  - DATABASE_URL configureren in .env.local
  - Drizzle migrations uitvoeren

- [ ] **Slotenmaker Data Verzamelen**
  - [ ] Discovery script voor Google Places API
  - [ ] Slotenmakers scrapen per provincie
  - [ ] Data verrijken met GPT (beschrijvingen, diensten)
  - [ ] Foto's toevoegen van Google Places

- [ ] **Data Kwaliteit**
  - [ ] Contactgegevens verifieren
  - [ ] Service types classificeren
  - [ ] 24-uurs beschikbaarheid markeren
  - [ ] SEO content genereren per slotenmaker

### Fase 6: Core Features (Medium Prioriteit)
- [ ] **Zoeken & Filteren**
  - [ ] Locatie-gebaseerd zoeken (stad, postcode)
  - [ ] Filter op dienst type
  - [ ] Filter op 24-uurs beschikbaarheid
  - [ ] Filter op beoordeling
  - [ ] Sorteren (afstand, rating, naam)

- [ ] **Gebruikers Features**
  - [ ] Reviews en beoordelingen
  - [ ] Contact formulier
  - [ ] Prijsopgave aanvragen

- [ ] **Slotenmaker Features**
  - [ ] Vermelding claimen
  - [ ] Dashboard voor slotenmakers
  - [ ] Profiel bewerken
  - [ ] Reageren op reviews
  - [ ] Foto's uploaden

### Fase 7: SEO & Marketing (Medium Prioriteit)
- [ ] **SEO Optimalisatie**
  - [ ] Provincie landing pagina's genereren
  - [ ] Gemeente landing pagina's
  - [ ] Dienst type landing pagina's
  - [ ] Sitemap naar Google Search Console
  - [ ] Google Analytics opzetten

- [ ] **Schema Markup**
  - [ ] LocalBusiness schema op slotenmaker pagina's
  - [ ] BreadcrumbList schema
  - [ ] FAQPage schema op gids pagina's
  - [ ] Review schema

### Fase 8: Monetisatie (Lage Prioriteit)
- [ ] **Advertising**
  - [ ] Google AdSense opzetten
  - [ ] Ad placements configureren
  - [ ] Affiliate partnerships (beveiligingsproducten)

- [ ] **Premium Features**
  - [ ] Uitgelichte vermeldingen
  - [ ] Lead generatie voor slotenmakers
  - [ ] Premium profielen

### Fase 9: Deployment & Launch (Hoge Prioriteit)
- [ ] **Vercel Deployment**
  - [ ] GitHub repository koppelen
  - [ ] Environment variables configureren
  - [ ] Custom domain (vindslotenmaker.nl)
  - [ ] SSL certificaat
  - [ ] Preview deployments

- [ ] **Post-Launch**
  - [ ] Error tracking (Sentry)
  - [ ] Uptime monitoring
  - [ ] Performance optimalisatie
  - [ ] Mobile testing

---

## Technische Schuld

- [ ] npm audit vulnerabilities fixen
- [ ] TypeScript strict mode
- [ ] Unit tests voor kritieke functies
- [ ] E2E tests met Playwright

---

## Environment Setup

### Vereiste Environment Variables
```env
# Database
DATABASE_URL=postgresql://...

# Google APIs
GOOGLE_PLACES_API_KEY=your-api-key

# OpenAI (voor content verrijking)
OPENAI_API_KEY=your-api-key

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

---

## Quick Start

```bash
# Dependencies installeren
npm install

# Development server starten
npm run dev

# TypeScript check
npx tsc --noEmit

# Build voor productie
npm run build
```

---

## Contact

Voor vragen of bijdragen, open een issue op GitHub:
https://github.com/MarvinNL046/vindslotenmaker/issues

---

*Deze roadmap is een levend document en wordt bijgewerkt naarmate het project vordert.*
