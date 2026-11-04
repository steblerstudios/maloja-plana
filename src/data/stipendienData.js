// Schweizer Ausbildungsbeiträge (Stipendien & Darlehen) — verifizierte Grunddaten
// Quellen: EDK (Schweizerische Konferenz der kantonalen Erziehungsdirektoren),
// Stipendien-Konkordat 2009 (in Kraft seit 1.3.2013), ch.ch, SBFI.
// Stand: 2026-06. Stipendien sind KANTONAL geregelt — exakte Beträge/Grenzen
// variieren pro Kanton und ändern jährlich; diese App gibt Orientierung, keine
// verbindliche Zusage.

import { ergebnis, fehlendeAngaben, ERGEBNIS_ART } from './ergebnisArt.js';

export const STIPENDIEN_DATA_VERSION = '2026-06';

// Offizielle, stabile Top-Quellen (kantonsübergreifend)
export const STIPENDIEN_OFFICIAL = {
  edkOverview: 'https://www.edk.ch/de/themen/stipendien',
  edkCantonalOffices: 'https://www.edk.ch/de/themen/stipendien/stipendienstellen',
  sbfiFederal: 'https://www.sbfi.admin.ch/de/stipendien',
};

// Stipendien-Seite je Kanton. Adressen aus der EDK-Liste «Kantonale Stellen», Weiterleitungen aufgelöst,
// Abruf 02.11.2026. JU: jura.ch/bourses statt des Fragebogens aus der EDK-Liste. Keine Fristen und Beträge,
// die ändern jährlich. Zuständig ist in der Regel der Wohnsitzkanton der Eltern, darum bleibt daneben das
// EDK-Verzeichnis stehen.
// Darum heisst der Link «Stipendien», nicht «Stipendienstelle»: In NE läuft das Gesuch über den Guichet social
// der Wohngemeinde, nicht über die Stelle selbst. Die Seite sagt das.
export const STIPENDIEN_KANTONE_URL = {
  AG: 'https://www.ag.ch/de/themen/bildung-forschung/berufsbildung/beratung-stipendien/stipendien',
  AI: 'https://www.ai.ch/themen/bildung/stipendien',
  AR: 'https://ar.ch/verwaltung/departement-bildung-und-kultur/amt-fuer-mittel-und-hochschulen-und-berufsbildung/abteilung-ausbildungs-und-studienbeitraege/',
  BE: 'https://www.bkd.be.ch/de/start/dienstleistungen/foerderung-und-unterstuetzung/ausbildungsbeitraege.html',
  BL: 'https://www.baselland.ch/politik-und-behorden/direktionen/bildungs-kultur-und-sportdirektion/berufsbildung-mittelschulen-und-hochschulen/hauptabteilung-berufsbildung/ausbildungsbeitraege',
  BS: 'https://www.bs.ch/themen/finanzielle-hilfe/leistungen/stipendien',
  FR: 'https://www.fr.ch/de/bildung-und-schulen/stipendien-und-studiendarlehen/stipendium-fuer-studium-und-lehre',
  GE: 'https://www.ge.ch/obtenir-bourse-pret-etudes-apprentissage',
  GL: 'https://www.gl.ch/verwaltung/bildung-und-kultur/departementssekretariat/stipendien.html/580',
  GR: 'https://www.gr.ch/DE/institutionen/verwaltung/ekud/dd/themen/stipendien/gesuchsformular/Seiten/start.aspx',
  JU: 'https://www.jura.ch/bourses',
  LU: 'https://beruf.lu.ch/Beratung_und_Unterstuetzung/Finanzielle_Unterstuetzung/Fachstelle_Stipendien',
  NE: 'https://www.ne.ch/themes/scolarite-et-formation/bourses-et-prets-detudes',
  NW: 'https://www.nw.ch/stipendien/1222',
  OW: 'https://www.ow.ch/dienstleistungen/1462',
  SG: 'https://www.sg.ch/bildung-sport/stipendien-und-studiendarlehen.html',
  SH: 'https://sh.ch/CMS/Webseite/Kanton-Schaffhausen/Beh-rde/Verwaltung/Erziehungsdepartement/Dienststelle-Mittelschul--und-Berufsbildung/Fachstelle-Ausbildungsbeitr-ge-185529-DE.html',
  SO: 'https://so.ch/verwaltung/departement-fuer-bildung-kultur-und-sport/departementssekretariat/stipendien-und-darlehen/',
  SZ: 'https://www.sz.ch/behoerden/verwaltung/bildungsdepartement/amt-fuer-berufsbildung/ausbildungsfinanzierung.html/8756-8758-8802-9466-9469-11332',
  TG: 'https://stipendien.tg.ch/',
  TI: 'https://www4.ti.ch/decs/sa/uast/cosa-facciamo/borsa-di-studio/',
  UR: 'https://www.ur.ch/dienstleistungen/3107',
  VD: 'https://www.vd.ch/formation/aides-financieres-aux-etudes-et-a-la-formation-professionnelle-bourses-ou-prets/informations-principales/',
  VS: 'https://www.vs.ch/de/web/saajf/stipendien',
  ZG: 'https://zg.ch/de/bildung/bslb/ausbildungsbeitraege',
  ZH: 'https://www.zh.ch/de/bildung/berufs-studien-laufbahnberatung/ausbildungsbeitraege.html',
};

// Berechtigung — harmonisiert über das Stipendien-Konkordat (Mindeststandards)
export const STIPENDIEN_ELIGIBILITY = {
  // Wer grundsätzlich Ausbildungsbeiträge beantragen kann
  whoKeys: ['swiss', 'foreigner5y', 'euefta', 'refugee'],
  // Nicht berechtigt: Personen, die sich ausschliesslich für die Ausbildung in CH aufhalten
  // Was abgedeckt ist (Erstausbildung)
  scopeKeys: ['sekII', 'tertiaer', 'bridge'],
  // Zuständigkeit: i.d.R. Wohnsitzkanton der Eltern (bzw. letzte/r Inhaber/in der elterlichen Sorge)
};

// Privates "Stipendienverzeichnis" — Stiftungen & Fonds, falls kantonal abgewiesen
// oder ergänzend. Transparenz: gratis vs. kostenpflichtig klar gekennzeichnet.
export const STIPENDIEN_PRIVATE = [
  {
    id: 'eth',
    url: 'https://ethz.ch/content/dam/ethz/main/education/finanzielles/files-de/stiftungsverzeichnis-schweiz.pdf',
    cost: 'free',     // gratis PDF, 150+ Stiftungen
  },
  {
    id: 'culturalpromotion',
    url: 'https://www.culturalpromotion.ch',
    cost: 'free',     // Bundesamt für Kultur + Migros-Kulturprozent
  },
  {
    id: 'fundraiso',
    url: 'https://www.fundraiso.ch',
    cost: 'freemium', // Basis gratis, Pro CHF 290/Jahr
  },
  {
    id: 'stipendiumch',
    url: 'https://www.stipendium.ch',
    cost: 'paid',     // CHF 78 Pauschale pro Anfrage
  },
];

export function getStipendienPrivate() {
  return STIPENDIEN_PRIVATE;
}

// O3 — Ergebnis-Art des Kurz-Checks in StipendienView.jsx: VORPRÜFUNG. Er prüft zwei
// harmonisierte Mindestkriterien (Aufenthalt, Ausbildungsstufe) und sagt, ob sich ein Antrag lohnt —
// nie einen Betrag; Beträge und Grenzen legt der Kanton fest. Fehlend: die zwei Fragen des Checks.
export function stipendienErgebnis({ status, scope }) {
  return ergebnis(ERGEBNIS_ART.VORPRUEFUNG, { fehlend: fehlendeAngaben({ status: !!status, scope: !!scope }) });
}
