# CLAUDE.md - VindSlotenmaker.nl Project Guide

This file provides guidance to Claude Code when working with the VindSlotenmaker.nl project.

## Project Overview

VindSlotenmaker.nl is a comprehensive directory of locksmiths (slotenmakers) in the Netherlands. The site helps users find reliable locksmiths for emergency services, home security, car locks, safes, and more.

### Tech Stack
- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Database**: Supabase / Drizzle ORM
- **Deployment**: Vercel

## Key Features

### 1. Geographic Structure
- `/provincie/[provincie]` - Province-level listings (e.g., Noord-Holland)
- `/gemeente/[gemeente]` - Municipality-level listings
- `/plaats/[stad]` - City-level listings
- `/slotenmaker/[slug]` - Individual locksmith detail pages

### 2. Service Types (Diensten)
- 24-uurs Spoedservice (24-hour emergency service)
- Woningbeveiliging (Home security)
- Autosloten (Car locks)
- Kluizen (Safes)
- Inbraakschade herstel (Break-in damage repair)
- Sleutelservice (Key service)
- Cilindersloten (Cylinder locks)
- Elektronische sloten (Electronic locks)

### 3. Search & Filter
- Search by location (city, postal code)
- Filter by service type
- Filter by 24-hour availability
- Filter by ratings

## Data Structure

### Locksmith Data Format
```typescript
{
  id: string;
  name: string;
  slug: string;
  address: string;
  city: string;
  province: string;
  province_abbr: string;
  municipality: string;
  postal_code: string;
  phone?: string;
  website?: string;
  lat?: number;
  lng?: number;
  rating?: number;
  review_count?: number;
  photo?: string;
  service_types: string[];  // Types of services offered
  brands: string[];         // Lock brands serviced
  certifications: string[]; // Professional certifications
  is_24_hour: boolean;      // 24-hour emergency availability
  response_time?: string;   // Average response time
  description?: string;
}
```

## Important URLs and Routes

### Public Pages
- `/` - Homepage with search
- `/zoeken` - Search results page
- `/provincie/[provincie]` - Province listings
- `/gemeente/[gemeente]` - Municipality listings
- `/plaats/[stad]` - City listings
- `/slotenmaker/[slug]` - Locksmith detail page
- `/vergelijk` - Compare locksmiths
- `/gids` - Service guides
- `/over-ons` - About page
- `/contact` - Contact page

### API Routes
- `/api/zoeken` - Search locksmiths
- `/api/slotenmaker/[slug]` - Get locksmith data
- `/api/slotenmakers/dichtbij` - Get nearby locksmiths

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Type checking
npm run typecheck

# Discover locksmiths (scraping)
npm run discover:test
npm run discover:province
npm run discover:full
```

## Environment Variables

Required in `.env.local`:
```
DATABASE_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
GOOGLE_PLACES_API_KEY=
```

## Content Guidelines

### Target Audience
- People locked out of their home or car
- Homeowners seeking security upgrades
- Businesses needing commercial security
- People who lost their keys

### Tone
- Professional and trustworthy
- Urgent and helpful (for emergencies)
- Informative about security
- Clear pricing transparency

### SEO Focus Keywords (Dutch)
- slotenmaker bij mij in de buurt
- slotenmaker spoed
- slotenmaker [stad]
- slot vervangen
- inbraakbeveiliging
- autosleutel bijmaken
- 24 uur slotenmaker
- noodopening deur

## Color Theme

- **Primary**: Orange (#F97316) - Emergency/urgent service color
- **Secondary**: Dark Gray (#1F2937) - Professional, trustworthy
- **Accent**: White/Light Gray - Clean, modern

## Dutch Provinces (Provincies)

1. Groningen
2. Friesland
3. Drenthe
4. Overijssel
5. Flevoland
6. Gelderland
7. Utrecht
8. Noord-Holland
9. Zuid-Holland
10. Zeeland
11. Noord-Brabant
12. Limburg

## Notes

- This project follows a directory website architecture
- Locksmith data will be scraped from Google Places API
- Focus on Netherlands market
- All user-facing content must be in Dutch
- Emergency phone number prominently displayed
- Price transparency is important for trust
