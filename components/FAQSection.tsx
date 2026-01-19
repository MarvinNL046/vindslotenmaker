'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: "Wat kost een slotenmaker?",
    answer: "De kosten van een slotenmaker variëren afhankelijk van de dienst en het tijdstip. Een standaard deuropening kost gemiddeld tussen de €75 en €150. Bij spoedwerk buiten kantooruren kunnen de kosten oplopen tot €150-€250. Het vervangen van een cilinder kost ongeveer €80-€200 inclusief montage. Vraag altijd vooraf om een prijsopgave om verrassingen te voorkomen."
  },
  {
    question: "Hoe snel kan een slotenmaker ter plaatse zijn?",
    answer: "De meeste slotenmakers bieden een spoedservice met een responstijd van 15 tot 45 minuten, afhankelijk van uw locatie en het tijdstip. Bij 24-uurs services zijn slotenmakers ook 's nachts en in het weekend beschikbaar. Bij het zoeken op onze website kunt u filteren op slotenmakers met snelle responstijden."
  },
  {
    question: "Wat moet ik doen als ik buitengesloten ben?",
    answer: "Als u buitengesloten bent, blijf kalm en controleer eerst of er andere toegangsmogelijkheden zijn (open raam, achterdeur). Bel vervolgens een gecertificeerde slotenmaker bij u in de buurt. Houd uw legitimatie bij de hand, want een betrouwbare slotenmaker zal hierom vragen. Forceer nooit zelf de deur of het slot, dit kan leiden tot meer schade en hogere kosten."
  },
  {
    question: "Hoe herken ik een betrouwbare slotenmaker?",
    answer: "Een betrouwbare slotenmaker heeft een KvK-inschrijving, vraagt om legitimatie voordat hij begint, geeft vooraf een duidelijke prijsopgave, en heeft positieve reviews. Let ook op certificeringen zoals VEB, SKG of politiekeurmerk. Wantrouw slotenmakers die geen factuur geven of alleen contant willen worden betaald."
  },
  {
    question: "Welke betaalmethoden accepteren slotenmakers?",
    answer: "De meeste slotenmakers accepteren diverse betaalmethoden: PIN/contactloos, contant, en soms ook creditcard of achteraf betalen. Veel slotenmakers bieden ook de mogelijkheid om via iDEAL of bankoverschrijving te betalen na ontvangst van de factuur. Vraag vooraf naar de betaalmogelijkheden."
  },
  {
    question: "Kan een slotenmaker elk slot openen?",
    answer: "Een ervaren slotenmaker kan vrijwel elk slot openen, van standaard cilindersloten tot hoogwaardige veiligheidssloten. De methode verschilt per slot: sommige kunnen non-destructief worden geopend, terwijl andere moeten worden geboord. Bij moderne elektronische sloten is vaak specialistische kennis vereist. Een goede slotenmaker bespreekt vooraf de opties en mogelijke gevolgen."
  }
];

export default function FAQSection() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  // JSON-LD structured data for FAQ
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <section className="py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-8">Veelgestelde Vragen</h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {faqItems.map((item, index) => (
            <Card key={index} className="overflow-hidden">
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium">{item.question}</span>
                {openItems.includes(index) ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>
              {openItems.includes(index) && (
                <div className="px-6 pb-4 pt-0">
                  <p className="text-gray-600">{item.answer}</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
