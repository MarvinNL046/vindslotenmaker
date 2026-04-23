import type { Metadata } from "next";
import { siteConfig } from "@/config/site.config";

export const metadata: Metadata = {
  title: "Privacybeleid",
  description: `Privacybeleid van ${siteConfig.siteName}. Hoe we persoonsgegevens verwerken bij een aanvraag.`,
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-5 py-14 prose prose-slate">
      <h1>Privacybeleid</h1>
      <p>
        {siteConfig.siteName} brengt consumenten die op zoek zijn naar een vakman
        samen met lokale vakmannen en bedrijven. Om die matching mogelijk te maken
        verwerken wij een aantal persoonsgegevens. Dit beleid legt beknopt uit
        welke gegevens we verzamelen, waarvoor, en welke rechten je hebt.
      </p>

      <h2>Welke gegevens verwerken we?</h2>
      <ul>
        <li>Voornaam, achternaam</li>
        <li>Telefoonnummer (geverifieerd via SMS)</li>
        <li>E-mailadres (optioneel)</li>
        <li>Postcode en een korte omschrijving van je aanvraag</li>
        <li>IP-adres en user-agent ten behoeve van fraudepreventie</li>
      </ul>

      <h2>Waarvoor gebruiken we deze gegevens?</h2>
      <ul>
        <li>
          Om jouw aanvraag door te zetten naar maximaal enkele lokale vakmannen
          zodat zij een offerte of afspraak kunnen voorstellen.
        </li>
        <li>
          Om je telefoonnummer via een SMS-code te verifiëren en spam te
          voorkomen.
        </li>
        <li>
          Om onze dienstverlening te verbeteren en misbruik op te sporen.
        </li>
      </ul>

      <h2>Met wie delen we gegevens?</h2>
      <p>
        Alleen met de vakmannen die matchen op jouw niche en regio. We delen je
        gegevens niet met derden voor ongerelateerde doeleinden.
      </p>

      <h2>Bewaartermijn</h2>
      <p>
        Aanvragen worden bewaard zolang dit noodzakelijk is voor de matching en
        administratie, en daarna verwijderd of geanonimiseerd.
      </p>

      <h2>Jouw rechten</h2>
      <p>
        Je hebt het recht je gegevens in te zien, te laten corrigeren of te
        laten verwijderen. Neem hiervoor contact op via{" "}
        <a href={`mailto:${siteConfig.privacyContactEmail}`}>
          {siteConfig.privacyContactEmail}
        </a>
        .
      </p>

      <h2>Contact</h2>
      <p>
        Voor vragen over dit privacybeleid:{" "}
        <a href={`mailto:${siteConfig.privacyContactEmail}`}>
          {siteConfig.privacyContactEmail}
        </a>
        .
      </p>
    </article>
  );
}
