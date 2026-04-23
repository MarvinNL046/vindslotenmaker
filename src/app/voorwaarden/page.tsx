import type { Metadata } from "next";
import { siteConfig } from "@/config/site.config";

export const metadata: Metadata = {
  title: "Voorwaarden",
  description: `Algemene voorwaarden van ${siteConfig.siteName}.`,
};

export default function VoorwaardenPage() {
  return (
    <article className="mx-auto max-w-3xl px-5 py-14 prose prose-slate">
      <h1>Voorwaarden</h1>
      <p>
        Door een aanvraag te doen via {siteConfig.siteName} ga je akkoord met
        onderstaande voorwaarden.
      </p>
      <h2>Dienst</h2>
      <p>
        {siteConfig.siteName} is een platform dat consumenten koppelt aan lokale
        vakmannen. Wij voeren zelf geen werkzaamheden uit. De uiteindelijke
        afspraak, offerte en uitvoering liggen bij de vakman van jouw keuze.
      </p>
      <h2>Gebruik</h2>
      <p>
        Het invullen van het aanvraagformulier is kosteloos en vrijblijvend.
        Misbruik, onjuiste gegevens of geautomatiseerde aanvragen zijn niet
        toegestaan.
      </p>
      <h2>Aansprakelijkheid</h2>
      <p>
        {siteConfig.siteName} is niet aansprakelijk voor de uitvoering van
        werkzaamheden door de gekoppelde vakman. Klachten over uitvoering los je
        op met het betreffende bedrijf.
      </p>
      <h2>Wijzigingen</h2>
      <p>
        We kunnen deze voorwaarden aanpassen. De meest recente versie vind je
        altijd op deze pagina.
      </p>
    </article>
  );
}
