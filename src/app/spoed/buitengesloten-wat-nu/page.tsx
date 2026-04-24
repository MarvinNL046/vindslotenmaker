import type { Metadata } from "next";
import { ClusterLayout, type ClusterData } from "@/components/cluster-layout";

const data: ClusterData = {
  slug: "/spoed/buitengesloten-wat-nu",
  breadcrumbParent: { title: "Spoed", href: "/spoed" },
  metaTitle: "Buitengesloten: wat nu? Eerlijke prijzen + oplichtersverhalen vermijden",
  metaDescription:
    "Buiten gesloten? Een slotenmaker komt voor €90-€150 daguren. Lees vooraf de vaste prijs — zo voorkom je oplichters die €800+ rekenen.",
  h1: "Buitengesloten — wat nu en hoe voorkom je oplichting?",
  introLead:
    "Een slotenmaker komt voor €90 tot €150 bij daguren (€150-€230 's avonds/weekend) om je zonder schade binnen te laten — maar de branche zit vol onbetrouwbare bureaus die €500 tot €1.200 rekenen met smerige trucs, dus vraag vooraf schriftelijke prijs.",
  introBody: (
    <>
      <p>
        Buitengesloten staan is een paniek-moment. Dat weten onbetrouwbare
        "slotenmakers" uitbuiten. Het eerste telefoontje dat je maakt bepaalt
        of je €90 of €900 kwijt bent. Deze pagina helpt je beide situaties
        herkennen.
      </p>
      <p>
        <strong>Korte regel</strong>: vraag altijd vooraf aan de telefoon een
        totale prijs (voorrijkosten + openen + eventueel nieuw cilinder). Wie
        geen vaste prijs geeft, werkt niet eerlijk.
      </p>
    </>
  ),
  sections: [
    {
      h2: "Wat kost een slotenmaker bij buitengesloten?",
      body: (
        <>
          <p>
            Eerlijke prijzen in 2026:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Openen daguren (ma-vr 08-18)</strong>: €90-€150
            totaal (voorrijkosten + 20-40 min werk)</li>
            <li><strong>Openen 's avonds (18-22)</strong>: €130-€180</li>
            <li><strong>Openen nacht/weekend (22-08 of za/zo)</strong>:
            €150-€230</li>
            <li><strong>Openen feestdag</strong>: €180-€260</li>
            <li><strong>Nieuwe cilinder plaatsen</strong> (indien nodig):
            €65-€110 extra voor standaard, €110-€180 voor SKG***</li>
          </ul>
          <p>
            <strong>Totaal incl. cilinder-vervanging</strong>: €155-€410
            afhankelijk van tijdstip en slot-type. Alles daarboven is
            alarmbel — tenzij het gaat om zeer complexe sloten (elektronisch,
            dubbelslot, oudere smeedijzeren).
          </p>
        </>
      ),
    },
    {
      h2: "Oplichtersverhalen — 4 trucs om te herkennen",
      body: (
        <>
          <p>
            <strong>1. Geen vaste prijs aan telefoon</strong>: "Kan ik niet
            zonder inspectie zeggen". Altijd rood alarm. Eerlijke slotenmaker
            geeft €90-€150 daguren binnen 1 minuut.
          </p>
          <p>
            <strong>2. "Sleutel moet eruit geboord"</strong>: komt bijna nooit
            voor bij moderne sloten. Wie dit direct zegt zonder sleutel te
            zien, wil extra rekening maken voor cilinder-vervanging die niet
            nodig is.
          </p>
          <p>
            <strong>3. Duitse of Engelse accent bij landelijk callcenter</strong>:
            geen lokale bedrijven. Vaak doorgeroute bureau's die tarieven
            verdubbelen zodra monteur aanrijdt.
          </p>
          <p>
            <strong>4. Website met "vanaf €49"</strong>: reken op
            voorrijkosten €80 + dringende openen €250 + nieuwe cilinder €200
            = €530. Die €49 bestaat alleen in de advertentie.
          </p>
        </>
      ),
    },
    {
      h2: "Wat moet je aan de telefoon vragen?",
      body: (
        <>
          <p>
            Script voor telefoontje:
          </p>
          <ol className="list-decimal pl-6 space-y-2">
            <li>"Wat zijn de voorrijkosten?"</li>
            <li>"Wat kost het openen zonder schade?"</li>
            <li>"Is een nieuwe cilinder meestal nodig? Zo ja, wat kost die?"</li>
            <li>"Wat is de totale prijs dus vóór meerkosten?"</li>
            <li>"Hoe lang tot je bij me bent?"</li>
            <li>"Stuur me een sms met het bedrag dat we nu afspreken"</li>
          </ol>
          <p>
            Als monteur op ANY van deze vragen geen antwoord geeft, of
            uitwijkend is: <strong>hang op</strong>. Zoek elders. In
            Nederland zijn 100+ betrouwbare slotenmakers actief — je hoeft
            niet met de eerste die opneemt in zee.
          </p>
          <p>
            Bewaar de sms of app-bevestiging. Bij latere factuur-dispuut is dat
            je bewijs.
          </p>
        </>
      ),
    },
    {
      h2: "Kan ik zelf proberen binnen te komen?",
      body: (
        <>
          <p>
            Soms ja — afhankelijk van situatie:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Voordeur dichtgevallen met knop/handvat aan
            binnenkant</strong>: belletje plastic kaart/röntgenfoto glijdt door
            tocht. Lukt in 30% van oudere sloten. SKG*** sloten: nee.</li>
            <li><strong>Raam open laten</strong>: letterlijk in het raam
            klimmen. Vaker mogelijk bij achterkant/tuin dan voorkant.</li>
            <li><strong>Reserve-sleutel bij buren</strong>: nu nuttig als je
            het nog niet had. Regel het nadat je deze paniek ooit hebt gehad.</li>
            <li><strong>Partner/kind met sleutel in de buurt</strong>: wachten
            kost geen geld, maar wel geduld.</li>
          </ul>
          <p>
            <strong>Niet doen</strong>: slot opendrillen met boormachine
            (€80 schade), schroevendraaier door spleet (beschadigt deur), of
            ruit ingooien ("want verzekering dekt wel"). Verzekering dekt vaak
            niet als je zelf inbreuk maakt.
          </p>
        </>
      ),
    },
    {
      h2: "Voorkomen: 4 maatregelen voor de toekomst",
      body: (
        <>
          <p>
            Na dit moment van paniek: bouw deze vier preventies in:
          </p>
          <ol className="list-decimal pl-6 space-y-2">
            <li>
              <strong>Reservesleutel bij vertrouwenspersoon</strong>:
              familie in straat, collega vlakbij, buren waar je goed mee bent.
              Niet bij jezelf in tas (die verlies je immers samen).
            </li>
            <li>
              <strong>Smart-lock met app-toegang</strong> (bv. Nuki Combo
              Pro, €400-€600). Werkt naast normale sleutel. App op telefoon =
              altijd toegang zolang je batterij niet leeg is.
            </li>
            <li>
              <strong>Sleutelkluisje met code</strong> aan buitenzijde (€30-€80
              bij bouwmarkt). Achter zijmuur plaatsen, niet zichtbaar vanaf
              straat.
            </li>
            <li>
              <strong>Nummer van betrouwbare lokale slotenmaker</strong> in
              je telefoon opgeslagen. In paniek niet Googelen — dan beland je
              bij adverteerders die niet lokaal zijn.
            </li>
          </ol>
        </>
      ),
    },
  ],
  faq: [
    {
      q: "Wat kost een slotenmaker bij buitengesloten?",
      a: "€90-€150 daguren, €150-€230 's avonds/weekend. Meer dan €250 voor simpel openen is vrijwel altijd oplichting. Vraag ALTIJD vooraf vaste prijs aan de telefoon.",
    },
    {
      q: "Hoe herken ik een oplichter?",
      a: "Geen vaste prijs aan telefoon, Duitse/Engelse accent bij NL-callcenter, 'sleutel moet uitgeboord worden' zonder slot gezien te hebben, en website met 'vanaf €49' zijn vier duidelijke rode vlaggen.",
    },
    {
      q: "Moet ik altijd een nieuwe cilinder plaatsen na buitengesloten?",
      a: "Nee. Alleen als de cilinder beschadigd is of je geen vertrouwen meer hebt in de sleutels. Standaard openen zonder schade vraagt geen vervanging.",
    },
    {
      q: "Kan ik zelf een dichtgevallen voordeur openen?",
      a: "Soms met een plastic kaart als het een oudere slot is zonder zwenkbekken. Bij SKG***-sloten: niet lukken. Probeer eerst reservesleutel bij buren of klimmen via raam.",
    },
    {
      q: "Dekt mijn verzekering een slotenmaker?",
      a: "Inboedelverzekering: meestal niet voor dichtgevallen deur (geen schade). Wel bij inbraak-poging of gestolen sleutels met cilinder-vervanging. Check je polis.",
    },
    {
      q: "Hoe vind ik een betrouwbare slotenmaker?",
      a: "Lokaal bedrijf via Google (check bedrijfsadres in Nederland, niet alleen 06-nummer). PKVW-gecertificeerd geeft extra zekerheid. Vraag altijd vaste prijs aan de telefoon vóór hij komt.",
    },
  ],
  related: [],
};

export const metadata: Metadata = {
  title: data.metaTitle,
  description: data.metaDescription,
  alternates: { canonical: data.slug },
  openGraph: { title: data.metaTitle, description: data.metaDescription, type: "article", locale: "nl_NL" },
};

export default function Page() {
  return <ClusterLayout data={data} />;
}
