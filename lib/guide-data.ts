// Guide data types en laad functies voor SEO pillar pages

// ===== INTERFACES =====

export interface FAQ {
  question: string;
  answer: string;
}

export interface GuideSection {
  id: string;
  title: string;
  content: string;
  subsections?: {
    title: string;
    content: string;
  }[];
}

export interface PillarGuide {
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  introduction: string;
  sections: GuideSection[];
  faqs: FAQ[];
  relatedGuides: string[];
  lastUpdated?: string;
  author?: string;
}

export interface GuideCard {
  slug: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

// ===== GUIDE CARDS DATA =====

export const pillarGuideCards: GuideCard[] = [
  {
    slug: 'welk-slot-kiezen',
    title: 'Welk Slot Kiezen?',
    description: 'Complete gids over de verschillende soorten sloten en welk type het beste past bij uw situatie.',
    icon: 'lock',
    color: 'orange',
  },
  {
    slug: 'betrouwbare-slotenmaker',
    title: 'Betrouwbare Slotenmaker Vinden',
    description: 'Hoe herkent u een betrouwbare slotenmaker en vermijdt u oplichters? Tips en checklist.',
    icon: 'shield',
    color: 'green',
  },
  {
    slug: 'inbraakpreventie',
    title: 'Inbraakpreventie Gids',
    description: 'Alles over het beveiligen van uw woning. Van sloten tot gedragstips.',
    icon: 'home',
    color: 'blue',
  },
  {
    slug: 'noodgevallen',
    title: 'Buitengesloten? Noodgids',
    description: 'Wat te doen als u buitengesloten bent. Stap-voor-stap hulp voor noodsituaties.',
    icon: 'alert',
    color: 'red',
  },
  {
    slug: 'kosten-overzicht',
    title: 'Kosten Slotenmaker',
    description: 'Transparant overzicht van tarieven voor slotenmakers in Nederland.',
    icon: 'euro',
    color: 'gold',
  },
];

// ===== PILLAR GUIDE CONTENT =====

export const pillarGuides: Record<string, PillarGuide> = {
  'welk-slot-kiezen': {
    slug: 'welk-slot-kiezen',
    title: 'Welk Slot Kiezen voor Uw Deur?',
    seoTitle: 'Welk Slot Kiezen? Complete Gids voor Cilindersloten en Meer | VindSlotenmaker.nl',
    seoDescription: 'Ontdek welk type slot het beste is voor uw voordeur, achterdeur of kantoor. Van SKG-gecertificeerde cilindersloten tot elektronische smart locks.',
    introduction: 'Het kiezen van het juiste slot is essentieel voor de veiligheid van uw woning of bedrijf. Nederland kent het SKG-keurmerk dat aangeeft hoe inbraakwerend een slot is. In deze gids leggen we uit welke soorten sloten er zijn en welk type bij uw situatie past.',
    sections: [],
    faqs: [
      {
        question: 'Wat betekent SKG en hoeveel sterren heb ik nodig?',
        answer: 'SKG staat voor Stichting Kwaliteit Gevelbouw. Het keurmerk geeft aan hoe lang een slot bestand is tegen inbraakpogingen: SKG* (3 minuten), SKG** (5 minuten), SKG*** (10 minuten). Voor voordeuren adviseren we minimaal SKG** voor verzekeringseisen.',
      },
      {
        question: 'Zijn elektronische sloten veiliger dan gewone sloten?',
        answer: 'Elektronische sloten zijn niet per definitie veiliger. De veiligheid hangt af van het specifieke model en of het SKG-gecertificeerd is. Wel bieden ze extra gemak en functies zoals toegangscontrole en activiteitenlogboeken.',
      },
      {
        question: 'Hoe vaak moet ik mijn slot vervangen?',
        answer: 'Een goed onderhouden slot gaat 15-20 jaar mee. Vervang uw slot eerder als: de sleutel moeilijk draait, u sleutels bent kwijtgeraakt, na een inbraak(poging), of als het slot verouderde technologie heeft.',
      },
    ],
    relatedGuides: ['betrouwbare-slotenmaker', 'inbraakpreventie', 'kosten-overzicht'],
    lastUpdated: '2026-01-18',
    author: 'VindSlotenmaker.nl Redactie',
  },
  'betrouwbare-slotenmaker': {
    slug: 'betrouwbare-slotenmaker',
    title: 'Hoe Vind Ik een Betrouwbare Slotenmaker?',
    seoTitle: 'Betrouwbare Slotenmaker Vinden: Tips & Checklist | VindSlotenmaker.nl',
    seoDescription: 'Voorkom oplichting door malafide slotenmakers. Leer de kenmerken van betrouwbare partijen en welke vragen u moet stellen voordat ze langskomen.',
    introduction: 'Een slotenmaker nodig? In noodgevallen wilt u snel geholpen worden, maar let op: er zijn helaas ook malafide partijen actief. In deze gids leert u hoe u een betrouwbare slotenmaker herkent en oplichters vermijdt.',
    sections: [],
    faqs: [
      {
        question: 'Hoe herken ik een malafide slotenmaker?',
        answer: 'Let op: extreem lage prijzen in advertenties, geen duidelijke prijsafspraak vooraf, alleen contante betaling, geen factuur, en het direct willen vervangen van sloten terwijl openen ook kan.',
      },
      {
        question: 'Welke vragen moet ik vooraf stellen?',
        answer: 'Vraag naar: voorrijkosten, uurtarief of vaste prijs, extra kosten voor avond/weekend, verwachte duur, of het slot open kan of vervangen moet worden, en of u kunt pinnen of een factuur krijgt.',
      },
      {
        question: 'Is een slotenmaker aangesloten bij een branchevereniging betrouwbaarder?',
        answer: 'Ja, lidmaatschap bij een branchevereniging zoals de VLS (Vereniging Leveranciers Slotentechniek) is een goed teken. Dit betekent dat de slotenmaker voldoet aan kwaliteitseisen en een klachtenprocedure heeft.',
      },
    ],
    relatedGuides: ['welk-slot-kiezen', 'kosten-overzicht', 'noodgevallen'],
    lastUpdated: '2026-01-18',
    author: 'VindSlotenmaker.nl Redactie',
  },
  'inbraakpreventie': {
    slug: 'inbraakpreventie',
    title: 'Inbraakpreventie: Uw Woning Beveiligen',
    seoTitle: 'Inbraakpreventie Gids: Tips voor een Veilige Woning | VindSlotenmaker.nl',
    seoDescription: 'Praktische tips om inbrekers buiten de deur te houden. Van SKG-sloten en PKVW tot gedragstips en elektronische beveiliging.',
    introduction: 'Jaarlijks vinden er tienduizenden woninginbraken plaats in Nederland. Met de juiste maatregelen kunt u het risico aanzienlijk verkleinen. Inbrekers kiezen het liefst makkelijke doelwitten, dus elke extra beveiligingsmaatregel helpt.',
    sections: [],
    faqs: [
      {
        question: 'Wat is het Politiekeurmerk Veilig Wonen (PKVW)?',
        answer: 'Het PKVW is de officiële norm voor woningbeveiliging in Nederland. Een woning met dit keurmerk voldoet aan strenge eisen voor sloten, hang- en sluitwerk, en bouwkundige aspecten. Het keurmerk kan korting opleveren op uw inboedelverzekering.',
      },
      {
        question: 'Welke maatregelen zijn het belangrijkst?',
        answer: 'Begin met goede sloten: minimaal SKG** op de voordeur. Voeg raambeveiliging toe aan de begane grond. Buitenverlichting met sensor en het altijd afsluiten van ramen en deuren zijn ook essentieel.',
      },
      {
        question: 'Heeft een alarm zin?',
        answer: 'Ja, een alarmsysteem kan inbrekers afschrikken en waarschuwt u bij een inbraakpoging. Kies voor een gecertificeerd systeem met doormelding naar een alarmcentrale voor de beste bescherming.',
      },
    ],
    relatedGuides: ['welk-slot-kiezen', 'kosten-overzicht'],
    lastUpdated: '2026-01-18',
    author: 'VindSlotenmaker.nl Redactie',
  },
  'noodgevallen': {
    slug: 'noodgevallen',
    title: 'Buitengesloten? Noodgids',
    seoTitle: 'Buitengesloten: Wat Nu? Noodgids met Stappen | VindSlotenmaker.nl',
    seoDescription: 'Staat u voor een dichte deur? Onze noodgids helpt u stap voor stap. Van eerste checks tot het bellen van een betrouwbare 24-uurs slotenmaker.',
    introduction: 'Buitengesloten raken is vervelend en stressvol. Vooral \'s avonds laat of bij slecht weer wilt u snel weer binnen zijn. Deze gids helpt u de juiste stappen te nemen en een betrouwbare slotenmaker te vinden.',
    sections: [],
    faqs: [
      {
        question: 'Wat moet ik eerst doen als ik buitengesloten ben?',
        answer: 'Check eerst of alle ramen en deuren echt dicht zijn. Bel familie of buren met een reservesleutel. Huurt u? Bel uw verhuurder. Check ook of uw verzekering slotenmakerkosten dekt voordat u belt.',
      },
      {
        question: 'Wat kost een noodopening?',
        answer: 'Overdag (08:00-18:00): €75-150. Avond (18:00-23:00): €100-200. Nacht/weekend: €150-300. Vraag altijd vooraf een prijsopgave om verrassingen te voorkomen.',
      },
      {
        question: 'Kan de slotenmaker mijn deur openen zonder schade?',
        answer: 'In de meeste gevallen kan een ervaren slotenmaker de deur schadevrij openen. Vraag dit vooraf. Als het slot beschadigd moet worden, is vervanging nodig wat extra kost.',
      },
    ],
    relatedGuides: ['betrouwbare-slotenmaker', 'kosten-overzicht'],
    lastUpdated: '2026-01-18',
    author: 'VindSlotenmaker.nl Redactie',
  },
  'kosten-overzicht': {
    slug: 'kosten-overzicht',
    title: 'Kosten Slotenmaker: Compleet Overzicht',
    seoTitle: 'Kosten Slotenmaker: Tarieven & Prijzen 2026 | VindSlotenmaker.nl',
    seoDescription: 'Wat kost een slotenmaker? Overzicht van gangbare tarieven in Nederland voor noodopening, cilinder vervangen, meerpuntsluiting en autosleutels.',
    introduction: 'Wat kost een slotenmaker? De kosten variëren afhankelijk van het type werk, het tijdstip en uw locatie. In deze gids geven we een transparant overzicht van gangbare tarieven in Nederland.',
    sections: [],
    faqs: [
      {
        question: 'Waarom zijn avond- en weekendtarieven hoger?',
        answer: 'Buiten kantooruren moet de slotenmaker beschikbaar zijn voor noodgevallen, wat extra kosten met zich meebrengt. Toeslag van 50-100% op het reguliere tarief is normaal.',
      },
      {
        question: 'Wat bepaalt de prijs van een nieuwe cilinder?',
        answer: 'De prijs hangt af van het SKG-keurmerk (meer sterren = duurder), het merk, en of het een speciale uitvoering is (bijv. anti-kerntrek). Een SKG** cilinder kost €50-100, SKG*** vanaf €80.',
      },
      {
        question: 'Kan ik de kosten declareren bij mijn verzekering?',
        answer: 'Veel inboedel- en autoverzekeringen dekken slotenmakerkosten bij diefstal, verlies of nood. Check uw polis of bel uw verzekeraar voordat u een slotenmaker belt.',
      },
    ],
    relatedGuides: ['betrouwbare-slotenmaker', 'welk-slot-kiezen', 'noodgevallen'],
    lastUpdated: '2026-01-18',
    author: 'VindSlotenmaker.nl Redactie',
  },
};

// ===== DATA LOADING FUNCTIONS =====

/**
 * Haal alle pillar guide cards op voor de indexpagina
 */
export function getAllGuideCards(): GuideCard[] {
  return pillarGuideCards;
}

/**
 * Haal een specifieke pillar guide op via slug
 */
export function getGuideBySlug(slug: string): PillarGuide | null {
  return pillarGuides[slug] || null;
}

/**
 * Haal alle pillar guide slugs op voor static generation
 */
export function getAllGuideSlugs(): string[] {
  return Object.keys(pillarGuides);
}

/**
 * Haal gerelateerde gidsen op voor een specifieke gids
 */
export function getRelatedGuides(slug: string): GuideCard[] {
  const guide = pillarGuides[slug];
  if (!guide) return [];

  return guide.relatedGuides
    .map(relatedSlug => pillarGuideCards.find(card => card.slug === relatedSlug))
    .filter((card): card is GuideCard => card !== undefined);
}

/**
 * Haal guide card op via slug
 */
export function getGuideCardBySlug(slug: string): GuideCard | null {
  return pillarGuideCards.find(card => card.slug === slug) || null;
}

// ===== AUTHOR INFO =====

export const GUIDE_AUTHOR = {
  name: 'VindSlotenmaker.nl Redactie',
  description: 'Ons redactieteam bestaat uit experts in slotentechniek, beveiliging en consumentenvoorlichting. Wij helpen u de juiste slotenmaker te vinden.',
  expertise: ['Slotentechniek', 'Inbraakpreventie', 'Woningbeveiliging', 'Autosloten'],
};
