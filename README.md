# vind-base-template

Next.js 16 App Router leadgen template voor de vind-\* / \*-indebuurt domeinen.
Elke site is een dunne wrapper rond deze template met een eigen
`src/config/site.config.ts`.

## Stack

- Next.js 16 (App Router, React 19, Server Components)
- TypeScript
- Tailwind v4 (CSS-first, via `@tailwindcss/postcss`)
- Geen shadcn — utility-classes only, 14x clone moet licht zijn

## Architectuur

Leads lopen via de **LeadFlow marketplace wizard-flow** (SMS-OTP):

```
Bezoeker → /                            (homepage + lead-form)
         → POST /api/lead/start         (server proxy → wetryleadflow.com/api/intake/wizard/start)
         → /aanvragen/verify?v=<token>  (SMS-code page)
         → POST /api/lead/verify        (server proxy → .../wizard/verify)
         → /aanvragen/bedankt
```

De **Bearer API-key blijft server-side** (env var `LEADFLOW_API_KEY`).
De browser ziet alleen de eigen /api/lead/\* proxy routes.

## Aanpassen per domein

Alleen `src/config/site.config.ts` hoeft aangepast te worden. Per domein:

- `domain`, `siteName`, `primaryKeyword`
- `metaTitle`, `metaDescription`, `h1`, `heroIntro`, `heroUsps`
- `services`, `whyUsBullets`, `howItWorks`, `faq`, `ctaVariants`
- `niche` (marketplace niche — zie `src/lib/site-config.ts` voor typing)
- `accent` (brand kleur)
- `privacyContactEmail`

## Env vars

Zie `.env.example`:

```
LEADFLOW_API_KEY=lmk_...            # Per-site key, scoped op 1 niche
LEADFLOW_BASE_URL=https://wetryleadflow.com
NEXT_PUBLIC_SITE_URL=https://vinddomain.nl
```

## Lokaal

```
npm install
cp .env.example .env.local          # vul de key in
npm run dev
```

## Deploy

Elk domein is een eigen Vercel-project. Zie `docs/DEPLOYMENT.md` (wordt
aangemaakt in Task #7) voor stap-voor-stap handoff.
