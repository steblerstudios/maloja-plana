// ─── Kantonsseiten · Prämienverbilligung je Kanton ───────────────────────────
//
// Bauplan: docs/roadmap/BAUPLAN-kantonsseiten-2026-11.md (Entscheide E1–E4 vom
// 09.11.2026). Welle 1, PR 2: drei Pilotkantone (ZH, BE, TG), je einer für jeden
// Weg (Antrag bei der SVA · in der Regel von Amtes wegen · Antrag bei der Gemeinde).
//
// Was hier steht und was nicht:
//   • Die Seiten folgen der Regel der Erklärseiten: KEINE Beträge, Fristen,
//     Einkommensgrenzen, Prozentsätze. Wo die Quelle eine Grenze oder Frist nennt,
//     sagt die Seite, DASS es sie gibt und wo sie steht, und nennt die Zahl nicht.
//   • Jeder Satz stammt aus einer Primärquelle des Kantons. Die Stelle steht als
//     Kommentar daneben. Abgeglichen am 09.11.2026 (Fachprüfung, alle Quellen neu
//     abgerufen): BE Informationsblatt 2026 · TG Merkblatt IPV 2026, TG KVG
//     (RB 832.1), TG KVV (RB 832.10) · ZH Kundeninformation 2026 der SVA, EG KVG
//     (LS 832.01). Ältere Fassung der Texte: Commit a5779dad (zu knapp, siehe PR).
//   • Link aufs Amt und Prüfdatum des Links kommen aus den Daten der App
//     (CANTONAL_LINKS, CANTONAL_LINKS_GEPRUEFT), der Weg wird gegen CANTONAL_IPV
//     geprüft. Eine Seite und die App können so nicht Verschiedenes sagen.
//
// Riegel 1 (Bauplan §4): Eine Kantonsseite entsteht nur, wenn der Text hier
// steht UND CANTONAL_IPV einen Beleg hat UND der ipv-Link ein Prüfdatum trägt.
// Fehlt eines, wirft der Generator — still auslassen wäre die schlechtere Wahl,
// weil dann ein Kanton unbemerkt aus der Liste fiele.
// ─────────────────────────────────────────────────────────────────────────────

import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CANTONAL_IPV } from '../../src/config/cantonalData.js';
import { CANTONAL_LINKS, CANTONAL_LINKS_GEPRUEFT } from '../../src/data/direktLinks.js';
import { QUELLEN } from '../seiten-inhalt.mjs';

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');

// Der Weg, wie er auf der Seite heisst. Farbe nach Entscheid E4 / Farbrollen:
// Gold = handeln, Heidelbeere (Blau) = informieren. Immer mit Wort und Zeichen.
export const WEGE = {
  antrag: { label: 'Antrag nötig' },
  automatisch: { label: 'In der Regel von Amtes wegen' },
};

// Welcher noteKey der App zu welchem Weg gehört. Der Generator und der Test
// prüfen, dass jede Kantonsseite denselben Weg nennt wie die App.
export const WEG_AUS_NOTEKEY = (noteKey) => {
  if (/^ipv\.noteApply/.test(noteKey)) return 'antrag';
  if (/^ipv\.noteAuto/.test(noteKey)) return 'automatisch';
  if (noteKey === 'ipv.geWegAutomatisch') return 'automatisch';
  return null;
};

const KVG65 = { text: QUELLEN.fedlexKvgArt65.text, url: QUELLEN.fedlexKvgArt65.url };

const TEXTE = {
  ZH: {
    name: 'Zürich',
    slug: 'zuerich',
    weg: 'antrag',
    // Das Rechenmodul der App für diesen Kanton. null heisst: Die App rechnet hier
    // keinen Betrag, dann darf die Karte das auch nicht versprechen (Rechtsprüfung
    // 09.11.2026, Art. 3 Abs. 1 lit. b UWG). Der Test prüft, dass die Datei existiert.
    appModul: 'ipvZuerich.js',
    abgeglichen: '2026-11-09',
    wegSaetze: [
      // Quellenblatt ZH «Zuständig / Weg»: «Antragsformular wird automatisch zugestellt».
      'Im Kanton Zürich gibt es die Prämienverbilligung in der Regel nur auf Antrag. Wer nach den Steuerdaten in Frage kommt, bekommt das Antragsformular von der SVA Zürich zugestellt.',
      // Kundeninformation 2026: Online-Formular für Nachmeldungen.
      'Falls Sie kein Formular erhalten haben, aber Anspruch vermuten, melden Sie sich bei der SVA Zürich. Das geht auch online.',
      // EG KVG § 14 Abs. 1 (SVA überweist bei EL-Anspruch direkt dem Versicherer) und
      // Abs. 3 (fällt die EL weg, gilt das EL-Gesuch als Antrag).
      'Wer Ergänzungsleistungen zur AHV oder IV bezieht, muss keinen eigenen Antrag stellen.',
    ],
    // EG KVG § 21 Abs. 1 (Frist im Gesetz); Formular; SVA.
    fristSatz: 'Für den Antrag gilt eine Frist. Sie steht im Gesetz, auf dem Formular und bei der SVA Zürich.',
    stelle: 'Sozialversicherungsanstalt Zürich (SVA Zürich)',
    // EG KVG § 18 «Antrag und Entscheid».
    stelleSatz: 'Die SVA Zürich führt die Prämienverbilligung im Auftrag des Kantons durch und entscheidet über die Anträge.',
    amtsseite: 'Seite des Kantons Zürich zur Prämienverbilligung',
    besonders: [
      // Quellenblatt ZH: provisorische Auszahlung, definitive Abrechnung. Kundeninformation
      // Ziff. 8 («Restzahlung oder Rückforderung»), Ziff. 12, Ziff. 14.3 («Um Rückforderungen
      // zu vermeiden, verzichten Sie …»); EG KVG § 12 Abs. 1 / § 13 (Meldepflicht), § 19 Abs. 2.
      'Zuerst wird ein vorläufiger Betrag ausgerichtet. Die definitive Abrechnung folgt, wenn die Steuerdaten des Jahres vorliegen. Fällt der endgültige Betrag tiefer aus, fordert die SVA die Differenz zurück.',
      'Änderungen, etwa eine Heirat oder das Ende einer Ausbildung, melden Sie darum der SVA Zürich. Steigt Ihr Einkommen stark, lohnt es sich, vor dem Einreichen zu prüfen, ob der Antrag noch sinnvoll ist.',
      // Kundeninformation Ziff. 14.1 und 14.2: Steuerfaktoren der Eltern; Abschluss, Abbruch
      // oder längerer Unterbruch der Ausbildung ist zu melden.
      'Bei jungen Erwachsenen in Ausbildung zählen die Steuerdaten der Eltern, ausser sie sind verheiratet oder haben eigene Kinder. Endet die Ausbildung oder wird sie länger unterbrochen, ist das der SVA zu melden.',
      // Quellenblatt ZH «Massgebendes Einkommen»: «Bei quellenbesteuerten Personen entspricht
      // das massgebende Einkommen dem steuerbaren Einkommen unter Berücksichtigung des Kinderabzuges.»
      'Für Personen mit Quellensteuer gilt eine eigene Berechnungsgrundlage.',
    ],
    quellen: [
      { text: 'SVA Zürich: Kundeninformation zur Prämienverbilligung (PDF)', url: 'https://svazurich.ch/dam/sva-dokumente/4000_ipv/4000_vl3_ipv_kundeninformation_2026.pdf' },
      { text: 'SVA Zürich: Prämienverbilligung, Leistung', url: 'https://svazurich.ch/unsere-produkte/weitere-produkte/krankenversicherung--kvg-/praemienverbilligung/leistung.html' },
      // Kein stabiler Link auf die Zürcher Gesetzessammlung gefunden (gemessen 09.11.2026): nur der Titel.
      { text: 'Einführungsgesetz zum Krankenversicherungsgesetz des Kantons Zürich (EG KVG, LS 832.01)' },
      KVG65,
    ],
  },
  BE: {
    name: 'Bern',
    slug: 'bern',
    weg: 'automatisch',
    appModul: 'ipvBern.js',
    abgeglichen: '2026-11-09',
    wegSaetze: [
      // Informationsblatt 2026, S. 1: «Ihr Anrecht auf Prämienverbilligung wird in der Regel
      // automatisch überprüft.» KKVV Art. 7 Abs. 1: definitive Veranlagung des vorletzten Steuerjahres.
      'Im Kanton Bern prüft das Amt den Anspruch in der Regel von Amtes wegen, also ohne dass Sie etwas einreichen. Grundlage sind die definitiven Steuerdaten des vorletzten Jahres.',
      'Für etliche Gruppen gilt das aber nicht.',
    ],
    // Informationsblatt 2026, S. 2, «Wann kann Ihr Anrecht auf Prämienverbilligung nicht
    // automatisch überprüft werden?» — alle zehn Fälle, ohne die Beträge.
    selbst: {
      einleitung: 'Sie müssen den Antrag selbst stellen, wenn einer dieser Fälle auf Sie zutrifft:',
      punkte: [
        'Sie haben eine Aufenthaltsbewilligung B, F, G, L, N oder S oder werden an der Quelle besteuert.',
        'Sie haben in der Steuererklärung kein Einkommen ausgewiesen oder keine Steuererklärung eingereicht.',
        'Sie sind auf Jahresbeginn aus einem anderen Kanton oder im Lauf des Jahres aus dem Ausland in den Kanton Bern gezogen.',
        'Ihr zivilrechtlicher Wohnsitz ist im Kanton Bern, Ihr Steuerwohnsitz aber in einem anderen Kanton.',
        'Sie wohnen in einem EU-Staat, sind aber in der Schweiz versicherungspflichtig.',
        'Sie haben in der Steuererklärung ein hohes Bruttovermögen ausgewiesen, also vor Abzug der Schulden, zum Beispiel mit einer Liegenschaft.',
        'Sie sind mindestens 25 Jahre alt, haben keine eigenen Kinder, die zur Familie zählen, und Ihr korrigiertes Reineinkommen liegt unter einer festen Grenze.',
        'Sie sind ledig, älter als 18 und noch nicht 25 Jahre alt, haben ein tiefes Einkommen, und Ihre Eltern leben in einem anderen Kanton oder im Ausland.',
        'Sie sind älter als 18 und noch nicht 25 Jahre alt, in Ausbildung, zählen nicht zur Familie Ihrer Eltern und möchten den höheren Beitrag für Personen in Ausbildung.',
        'Sie haben beim Wegzug aus dem Kanton Bern Sozialhilfe oder Ergänzungsleistungen bezogen und beziehen diese im neuen Kanton nicht mehr.',
      ],
      schluss: 'Die Grenzen stehen im Informationsblatt des Amts für Sozialversicherungen. Im Zweifel lohnt sich die Nachfrage.',
    },
    // Informationsblatt S. 2: «während des laufenden Kalenderjahres».
    fristSatz: 'Ein Antrag gilt nur für das laufende Jahr und muss in diesem Jahr gestellt werden.',
    stelle: 'Amt für Sozialversicherungen des Kantons Bern (ASV)',
    // Informationsblatt S. 3: Sozialhilfe → Auszahlung an den Sozialdienst; EL → Ausgleichskasse
    // des Kantons Bern (AKB) berechnet den Beitrag.
    stelleSatz: 'Das ASV prüft den Anspruch und nimmt die Anträge entgegen. Wer Ergänzungsleistungen bezieht, hat einen eigenen Weg: Den Beitrag berechnet die Ausgleichskasse des Kantons Bern. Wer Sozialhilfe bezieht, wendet sich an den Sozialdienst.',
    amtsseite: 'Seite des Amts für Sozialversicherungen zur Prämienverbilligung',
    besonders: [
      // Informationsblatt S. 3, «Wann können Sie die Überprüfung … während des Jahres beantragen?»:
      // familiäre Verhältnisse; finanzielle «erheblich und dauerhaft»; «Arbeitslosigkeit gilt nicht
      // als dauerhaft»; «rückwirkend, aber maximal bis zum 1. Januar des laufenden Kalenderjahres».
      'Haben sich Ihre Familienverhältnisse geändert, etwa durch Heirat, Trennung oder einen Todesfall, oder ist Ihr Einkommen erheblich und dauerhaft gesunken, können Sie eine neue Prüfung beantragen. Arbeitslosigkeit gilt dabei nicht als dauerhaft.',
      'Die neue Prüfung wirkt höchstens bis zum Anfang des laufenden Jahres zurück. Ein Anspruch folgt aus dem Antrag nicht von selbst.',
      // Informationsblatt S. 1: unverheiratet, gleicher Haushalt, mindestens ein gemeinsames Kind
      // → «wie bei einem verheirateten Paar».
      'Paare, die unverheiratet zusammenleben und ein gemeinsames Kind haben, werden wie ein Ehepaar berechnet.',
    ],
    quellen: [
      { text: 'Amt für Sozialversicherungen: Informationen zur Prämienverbilligung (PDF)', url: 'https://www.asv.dij.be.ch/content/dam/asv_dij/dokumente/de/pr%C3%A4mienverbilligung--informationen/Informationsblatt%202026_de.pdf' },
      { text: 'Amt für Sozialversicherungen: Prämienverbilligung beantragen', url: 'https://www.asv.dij.be.ch/de/start/themen/pv/pv_anrecht-auf-pv-beantragen.html' },
      // BELEX ist eine Web-App (jede Adresse 200); Bestand über die API belegt, 842.999 → 404.
      { text: 'Einführungsgesetz zu den Bundesgesetzen über die Kranken-, Unfall- und Militärversicherung (EG KUMV, BSG 842.11)', url: 'https://www.belex.sites.be.ch/app/de/texts_of_law/842.11' },
      { text: 'Kantonale Krankenversicherungsverordnung (KKVV, BSG 842.111.1)', url: 'https://www.belex.sites.be.ch/app/de/texts_of_law/842.111.1' },
      KVG65,
    ],
  },
  TG: {
    name: 'Thurgau',
    slug: 'thurgau',
    weg: 'antrag',
    // Für den Thurgau zeigt die App bewusst keine Zahl (Quellenblatt TG, Nachprüfung 28.09.2026).
    appModul: null,
    abgeglichen: '2026-11-09',
    wegSaetze: [
      // Quellenblatt TG «Zuständig / Weg»: «reines Antragsprinzip, jährlich; Gemeinde stellt
      // Berechtigten im Frühjahr ein Formular zu».
      'Im Kanton Thurgau gibt es die Prämienverbilligung nur auf Antrag, und zwar jedes Jahr neu. Die Gemeinde stellt Personen, die nach den Steuerdaten in Frage kommen, im Frühjahr ein Formular zu.',
      'Das unterschriebene Formular geben Sie bei der Krankenkassenkontrollstelle Ihrer Gemeinde ab.',
      // Merkblatt S. 2: «EL-Bezügerinnen und -Bezüger erhalten eine Prämienpauschale … Ein
      // IPV-Antrag ist nicht notwendig.»
      'Wer Ergänzungsleistungen bezieht, erhält eine Prämienpauschale und muss keinen Antrag stellen.',
    ],
    // Merkblatt S. 2 (Jahresaufenthalt mit Quellensteuer ohne Formular, Grenzgänger,
    // Kurzaufenthalter: Antrag selbst stellen; «Wird diese Frist verpasst, verfällt der Anspruch.»;
    // «Bei einem Wegfall der Ergänzungsleistungen oder der Sozialhilfe … muss fristgerecht
    // eingereicht werden»); TG KVV § 22 Abs. 1 und § 22a Abs. 1.
    selbst: {
      einleitung: 'Kein Formular bekommen Sie zum Beispiel in diesen Fällen. Dann müssen Sie den Antrag selbst stellen:',
      punkte: [
        'Sie arbeiten als Grenzgängerin oder Grenzgänger im Thurgau.',
        'Sie haben eine Kurzaufenthaltsbewilligung.',
        'Sie haben eine Jahresaufenthaltsbewilligung, werden an der Quelle besteuert und haben kein Formular erhalten.',
        'Sie beziehen keine Ergänzungsleistungen oder keine Sozialhilfe mehr.',
      ],
      schluss: 'Auch dafür gilt eine Frist.',
    },
    // Merkblatt S. 1: «Wird diese Frist verpasst, verfällt der Anspruch.»; TG KVG § 9 Abs. 2.
    fristSatz: 'Laut Merkblatt des Kantons verfällt der Anspruch, wenn die Frist verpasst wird. Die Frist steht auf dem Formular und im Merkblatt.',
    stelle: 'Krankenkassenkontrollstelle Ihrer Wohngemeinde',
    // TG KVV § 2 Abs. 3; Merkblatt «Zuständigkeiten»: Grenzgänger bei der Gemeinde des Arbeitsorts.
    stelleSatz: 'Zuständig ist die Gemeinde, in der Sie wohnen. Grenzgängerinnen und Grenzgänger wenden sich an die Gemeinde ihres Arbeitsorts.',
    amtsseite: 'Seite des Amts für Gesundheit des Kantons Thurgau zur Prämienverbilligung',
    besonders: [
      // TG KVV § 14; einfache Steuer aus Einkommen und Vermögen (TG StG § 6 Abs. 1).
      'Der Thurgau rechnet nicht direkt mit dem Einkommen, sondern mit dem einfachen Steuerbetrag laut Steuerdaten. Es gibt wenige feste Stufen.',
      // TG KVG § 5 Abs. 1bis; TG StG § 53 Abs. 1 (Freibeträge), Quellenblatt TG «präzisiert».
      'Anspruch hat nur, wer nach Abzug der steuerfreien Beträge kein steuerbares Vermögen hat. Erspartes allein schliesst Sie also nicht aus. Bei Kindern zählt das Vermögen der Eltern.',
      // TG KVV § 15 Abs. 2: Neubemessung nur auf Antrag, kurze Frist ab rechtskräftiger
      // Feststellung (u. a. definitive Steuerschlussrechnung, Sozialhilfe-Entscheid);
      // Merkblatt S. 2: «Wird die Frist verpasst, verfällt ein allfälliger Anspruch.»
      'Eine Neubemessung gibt es nur auf Antrag, und die Frist dafür ist kurz. Sie beginnt mit dem Entscheid, der die Änderung belegt, etwa der definitiven Steuerschlussrechnung oder einem Entscheid über Sozialhilfe. Wer sie verpasst, verliert den Anspruch.',
      // Merkblatt S. 1 «Junge Erwachsene in Ausbildung»: «erhalten im laufenden Jahr die zustehende
      // IPV … Sie können im Folgejahr eine Neubeurteilung beantragen.»; TG KVG § 5 Abs. 6.
      'Junge Erwachsene, die Ende Jahr in Ausbildung sind, können einen höheren Beitrag bekommen. Dafür beantragen sie im folgenden Jahr eine Neubeurteilung.',
      // TG KVG § 4 Abs. 3: Neugeborene und neu Angemeldete sind ab dem folgenden Jahr bezugsberechtigt.
      'Wer neu in den Thurgau zieht, ist hier erst ab dem folgenden Jahr bezugsberechtigt. Das gilt auch für Neugeborene.',
    ],
    quellen: [
      { text: 'Amt für Gesundheit Thurgau: Merkblatt Prämienverbilligung (PDF)', url: 'https://gesundheit.tg.ch/public/upload/assets/183453/Merkblatt%20IPV%202026.pdf' },
      // Rechtsbuch TG ist eine Web-App (jede Adresse 200); Bestand über die API belegt, 832.999 → 404.
      { text: 'Gesetz über die Krankenversicherung des Kantons Thurgau (TG KVG, RB 832.1)', url: 'https://www.rechtsbuch.tg.ch/app/de/texts_of_law/832.1' },
      { text: 'Verordnung zum Gesetz über die Krankenversicherung des Kantons Thurgau (TG KVV, RB 832.10)', url: 'https://www.rechtsbuch.tg.ch/app/de/texts_of_law/832.10' },
      KVG65,
    ],
  },
};

const MONATE = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August',
  'September', 'Oktober', 'November', 'Dezember'];
// '2026-11-09' → 'November 2026'
export function monatJahr(iso) {
  const m = /^(\d{4})-(\d{2})-\d{2}$/.exec(iso || '');
  if (!m) throw new Error(`Kein Datum in «${iso}»`);
  return `${MONATE[Number(m[2]) - 1]} ${m[1]}`;
}

export const KANTONSSEITEN = Object.entries(TEXTE).map(([k, t]) => {
  const ipv = CANTONAL_IPV[k];
  if (!ipv || !ipv.beleg || !ipv.beleg.quelle) throw new Error(`Kantonsseite ${k}: CANTONAL_IPV ohne Beleg`);
  const link = (CANTONAL_LINKS[k] || {}).ipv;
  const linkGeprueft = (CANTONAL_LINKS_GEPRUEFT[k] || {}).ipv;
  if (!link || !linkGeprueft) throw new Error(`Kantonsseite ${k}: ipv-Link fehlt oder ist ungeprüft`);
  const appWeg = WEG_AUS_NOTEKEY(ipv.noteKey);
  if (appWeg !== t.weg) throw new Error(`Kantonsseite ${k}: Weg «${t.weg}» ≠ App «${appWeg}» (${ipv.noteKey})`);
  if (t.appModul && !existsSync(resolve(WURZEL, 'src', 'config', t.appModul))) {
    throw new Error(`Kantonsseite ${k}: Rechenmodul ${t.appModul} fehlt`);
  }
  return {
    kanton: k,
    ...t,
    pfad: `praemienverbilligung/${t.slug}`,
    titel: `Prämienverbilligung im Kanton ${t.name}`,
    brotkrume: `Kanton ${t.name}`,
    beschreibung: `Prämienverbilligung im Kanton ${t.name}: ob Sie einen Antrag stellen müssen, welche Stelle zuständig ist und was hier anders ist als anderswo.`,
    link,
    appRechnet: Boolean(t.appModul),
    geprueft: monatJahr(t.abgeglichen),
  };
});
