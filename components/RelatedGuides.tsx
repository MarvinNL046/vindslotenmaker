import Link from 'next/link';
import { BookOpen, KeyRound, Shield, Wrench, Users, Clock } from 'lucide-react';

interface GuideLink {
  href: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  keywords: string[];
}

// All available guides/pillar pages with their metadata
const allGuides: GuideLink[] = [
  {
    href: '/guide/diensten',
    label: 'Soorten Slotenmakersdiensten',
    description: 'Ontdek de verschillende diensten die slotenmakers aanbieden, van noodopeningen tot beveiligingsadvies.',
    icon: BookOpen,
    keywords: ['dienst', 'diensten', 'soort', 'type', 'noodopening', 'beveiliging']
  },
  {
    href: '/guide/kosten',
    label: 'Kosten & Prijzen',
    description: 'Wat kost een slotenmaker? Overzicht van gemiddelde prijzen en waar u op moet letten.',
    icon: KeyRound,
    keywords: ['kosten', 'prijs', 'prijzen', 'tarief', 'betalen', 'geld']
  },
  {
    href: '/guide/betaalmethodes',
    label: 'Betaalmethodes',
    description: 'Welke betaalmethodes accepteren slotenmakers? PIN, contant, achteraf betalen en meer.',
    icon: Shield,
    keywords: ['betalen', 'betaalmethode', 'pin', 'contant', 'ideal', 'factuur']
  },
  {
    href: '/guide/beveiliging',
    label: 'Woningbeveiliging Tips',
    description: 'Praktische tips om uw woning beter te beveiligen tegen inbraak.',
    icon: Wrench,
    keywords: ['beveiliging', 'inbraak', 'preventie', 'slot', 'cilinder', 'veilig']
  },
  {
    href: '/guide/noodgevallen',
    label: 'Buitengesloten - Wat Nu?',
    description: 'Stap-voor-stap handleiding als u buitengesloten bent of uw sleutel kwijt bent.',
    icon: Users,
    keywords: ['nood', 'spoed', 'buitengesloten', 'sleutel', 'kwijt', 'hulp']
  }
];

// Sub-pillar content for specific service types
const typeSubGuides: Record<string, GuideLink[]> = {
  '24-uurs-service': [
    {
      href: '/guide/diensten#spoed',
      label: '24-uurs Spoedservice',
      description: 'Alles over de 24/7 spoedservice van slotenmakers.',
      icon: Clock,
      keywords: ['24-uurs', 'spoed', 'nacht', 'weekend']
    }
  ],
  'woningbeveiliging': [
    {
      href: '/guide/beveiliging',
      label: 'Woningbeveiliging',
      description: 'Complete gids voor het beveiligen van uw woning.',
      icon: Shield,
      keywords: ['woning', 'beveiliging', 'huis', 'inbraak']
    }
  ],
  'autosloten': [
    {
      href: '/guide/diensten#auto',
      label: 'Autosloten Service',
      description: 'Hulp bij autosloten, sleutels bijmaken en noodopeningen.',
      icon: KeyRound,
      keywords: ['auto', 'sleutel', 'bijmaken', 'noodopening']
    }
  ],
  'kluizen': [
    {
      href: '/guide/diensten#kluizen',
      label: 'Kluizen Openen',
      description: 'Professionele hulp bij het openen van kluizen.',
      icon: Shield,
      keywords: ['kluis', 'openen', 'code', 'vergeten']
    }
  ]
};

interface RelatedGuidesProps {
  currentType?: string;
  currentState?: string;
  maxGuides?: number;
  className?: string;
  showDescription?: boolean;
  variant?: 'default' | 'compact' | 'card';
}

export default function RelatedGuides({
  currentType,
  currentState,
  maxGuides = 3,
  className = '',
  showDescription = true,
  variant = 'default'
}: RelatedGuidesProps) {
  // Calculate relevance score for each guide
  const scoredGuides = allGuides.map(guide => {
    let score = 0;

    // Boost score based on type match
    if (currentType) {
      const typeSlug = currentType.toLowerCase();
      if (guide.keywords.some(kw => typeSlug.includes(kw))) {
        score += 10;
      }

      // Check for specific type sub-guides
      if (typeSubGuides[typeSlug]) {
        score += 5;
      }
    }

    // Boost payment guide for all pages (always relevant)
    if (guide.href === '/guide/betaalmethodes') {
      score = Math.max(score, 2);
    }

    // Always include the services guide at minimum score
    if (guide.href === '/guide/diensten') {
      score = Math.max(score, 1);
    }

    return { ...guide, score };
  });

  // Get type-specific sub-guides
  const specificGuides: GuideLink[] = currentType && typeSubGuides[currentType.toLowerCase()]
    ? typeSubGuides[currentType.toLowerCase()]
    : [];

  // Sort by score and take top guides
  const topGuides = scoredGuides
    .sort((a, b) => b.score - a.score)
    .slice(0, maxGuides - specificGuides.length);

  // Combine specific and general guides
  const guidesToShow = [...specificGuides, ...topGuides].slice(0, maxGuides);

  if (guidesToShow.length === 0) return null;

  if (variant === 'compact') {
    return (
      <div className={`${className}`}>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Handige Informatie
        </h3>
        <ul className="space-y-2">
          {guidesToShow.map((guide) => (
            <li key={guide.href}>
              <Link
                href={guide.href}
                className="text-sm text-orange-600 hover:text-orange-700 hover:underline flex items-center gap-2"
              >
                <guide.icon className="w-4 h-4 flex-shrink-0" />
                {guide.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={`bg-muted/50 rounded-lg p-6 ${className}`}>
        <h3 className="font-semibold text-lg mb-4">Gerelateerde Gidsen</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {guidesToShow.map((guide) => (
            <Link
              key={guide.href}
              href={guide.href}
              className="group bg-background rounded-lg p-4 border hover:border-orange-400 transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                  <guide.icon className="w-5 h-5 text-orange-600" />
                </div>
                <h4 className="font-medium text-sm group-hover:text-orange-600 transition-colors">
                  {guide.label}
                </h4>
              </div>
              {showDescription && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {guide.description}
                </p>
              )}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`${className}`}>
      <h3 className="font-semibold text-lg mb-4">Gerelateerde Gidsen</h3>
      <div className="space-y-4">
        {guidesToShow.map((guide) => (
          <Link
            key={guide.href}
            href={guide.href}
            className="group flex items-start gap-4 p-4 rounded-lg border hover:border-orange-400 hover:bg-muted/50 transition-all"
          >
            <div className="p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors flex-shrink-0">
              <guide.icon className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h4 className="font-medium group-hover:text-orange-600 transition-colors">
                {guide.label}
              </h4>
              {showDescription && (
                <p className="text-sm text-muted-foreground mt-1">
                  {guide.description}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
