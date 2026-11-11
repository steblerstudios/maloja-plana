// Mietzinsbeiträge (individuelle, bedarfsabhängige Wohnkostenzuschüsse) — kantonal/
// kommunal sehr fragmentiert. Anders als die IPV (bundesrechtlich in allen Kantonen)
// gibt es Mietzinsbeiträge nur in einzelnen Kantonen — und oft auf Gemeinde-Ebene.
//
// Drei Zustände (würdevoll, keine Falschaussage):
//   'has'   — Kanton hat ein bestätigtes, einkommensabhängiges Programm → affirmativ + Link
//   'none'  — bestätigt KEINES (auch keine Gemeinde) → ausgegraut „gibt's hier nicht"
//   'check' — variiert / unbekannt (Gemeinden können eigene haben) → ruhig „prüf bei Gemeinde/Kanton"
//
// Konservativ: nur solide belegte Programme sind 'has'; alles andere 'check' (nie ein
// falsches „none"). Die Programm-Parameter (Stand 2025) sind RICHTWERTE für eine erste
// Einschätzung — verbindlich ist immer die kantonale bzw. kommunale Stelle. Die Werte
// ändern jährlich → bei Pflege gegen die Quellen unten prüfen.
import { ergebnis, fehlendeAngaben, ERGEBNIS_ART } from './ergebnisArt.js';
import { getHouseholdInfo } from '../config/cantonalData.js';
import { zahl } from '../utils/geld.js';
import { dreizehnterStatus, hauptlohnMonate } from '../utils/dreizehnter.js';
import { giltAlsVerheiratet } from '../utils/zivilstand.js';
import { partnerEinkommenRoh } from '../utils/partnereinkommen.js';

export const MIETZINS_OVERVIEW_URL = 'https://www.bwo.admin.ch/de/kantonale-hilfen';

// Datenstand der Programm-Parameter (für künftige Pflege sichtbar).
// ⟨25.09.2026⟩ alle vier Programme gegen die Quellen 2026 geprüft (swiss-precision, Werte + Wortlaut im PR #388).
export const MIETZINS_DATA_VERSION = '2026';

// Bestätigte einkommensabhängige Mietzinsbeitrags-Programme mit recherchierten Eckwerten.
// Felder:
//   group        'all' | 'families'  — Zielgruppe (manche Kantone nur Familien mit Kind)
//   incomeLimit  Jahres-Einkommens-Richtgrenze in CHF (null = mietabhängiges barème, keine Einzelgrenze)
//   incomePerChild / incomePerAdult  Zuschläge zur Grenze (sofern bekannt)
//   residencyYears  Mindest-Wohnsitz im Kanton
//   assetLimit   Reinvermögens-Grenze in CHF (sofern bekannt)
//   noteKey      i18n-Schlüssel für die kantonsspezifische Besonderheit
//   url          offizielle kantonale Quelle  ·  stand  Datenstand
const PROGRAMS = {
  // Basel-Stadt — Mietbeiträge. Seit 1.7.2025 auch Einzel-/Paarhaushalte (vorher nur Familien).
  // Einkommensgrenze ~50'000 (Einzel/Paar, Familien höher); Mietzinslimiten nach Zimmerzahl;
  // Beitrag 50–1'060 CHF/Monat; min. 2 Jahre Wohnsitz. Quelle: bs.ch (Amt für Sozialbeiträge).
  // ⟨25.09.2026, Quellenprüfung⟩ Keine Pauschale: die Grenze ist je Haushalt eindeutig berechenbar,
  // Merkblatt Mietbeiträge 01.2026 Ziff. 13 — Faktor 0, wenn das massgebliche Einkommen «das Grund-
  // einkommen um mehr als 36'000 Franken übersteigt». Grundeinkommen = Haushaltsabzug (12'000 ohne,
  // 24'000 mit Kindern) + Sozialabzug (3'750 · 6'000 · 16'000 · 24'000 · 30'000, +6'000 je weitere
  // Person); Beitragstabelle 04.07.2025 Kopfzeile. Die frühere Pauschale 50'000 lag für eine Person
  // ~1'750 zu tief, für ein Paar ~4'000 zu tief und hielt Familien ab. Obere Schranke — der Beitrag
  // kann schon darunter unter die Auszahlungsschwelle (600/Jahr, Ziff. 11) fallen; darum «bis etwa».
  // Drei und mehr Erwachsene ohne Kind stehen nicht in der Tabelle → keine Zahl (nicht belegt).
  // Massgeblich ist das Einkommen nach SoHaG § 6 Abs. 2 lit. c inkl. 10 % des Vermögens über dem
  // Freibetrag (Ziff. 2) — nicht der Lohn. MBG (890.500) § 4 Abs. 2: kein Anspruch ab Referenzalter.
  BS: { state: 'has', group: 'all', incomeLimit: 'formel', limitFormel: 'bs', einkommensBasis: 'massgebend',
        residencyYears: 2, benefitMaxMonth: 1060,
        noteKey: 'mietzinsView.cantonNote_BS', stand: '2026',
        url: 'https://www.bs.ch/themen/finanzielle-hilfe/leistungen/mietbeitraege' },
  // Basel-Landschaft — Mietzinsbeiträge, nur Haushalte mit mind. 1 Kind. Netto-Jahreseinkommen
  // ~40–75k (Paare) bzw. ~30–60k (Alleinerziehende); min. 2 Jahre Wohnsitz; Gemeinden zahlen aus.
  // Quelle: baselland.ch (Sozialamt), Mietzinsbeitragsgesetz.
  // ⟨25.09.2026, Fachprüfung⟩ KEINE feste Grenze mehr: nach § 6 MBG wird die Grenze je Haushalt
  // berechnet (Lebensbedarf, KVG-Prämie, Miete, Kinderbetreuung), die Gemeinden setzen sie per
  // Reglement fest (§ 10). Die frühere Pauschale 75'000 schätzte in beide Richtungen falsch.
  // limitArt 'gemeinde' → Orientierung mit Verweis auf die Wohngemeinde statt Grenzvergleich.
  BL: { state: 'has', group: 'families', incomeLimit: null, limitArt: 'gemeinde', residencyYears: 2,
        noteKey: 'mietzinsView.cantonNote_BL', stand: '2026',
        url: 'https://www.baselland.ch/politik-und-behorden/direktionen/finanz-und-kirchendirektion/sozialamt/mietzinsbeitraege' },
  // Genf — Allocation de logement. Anspruch über „taux d'effort" (Mietbelastung 24.7–29.9% je
  // Zimmer/Personen), Eintritts-barème mietabhängig (keine einzelne Grenze); 2 von 5 Jahren
  // Wohnsitz; max. 1'400 CHF/Zimmer, höchstens halbe Miete. Quelle: ge.ch.
  // ⟨25.09.2026⟩ 1'000 statt 1'400 pro Zimmer: RGL I 4 05.01 Art. 24 Abs. 2 «au maximum de 1 000 francs
  // par pièce»; die 1'400 galten nur im Übergangsrecht Art. 90 Abs. 3 (1.4.2024–31.3.2025).
  // benefitMaxRoom ist ein JAHRESbetrag je pièce (Genfer Zählung, Küche inbegriffen, Art. 1 Abs. 5), höchstens die halbe Miete.
  GE: { state: 'has', group: 'all', incomeLimit: null, residencyYears: 2, benefitMaxRoom: 1000,
        noteKey: 'mietzinsView.cantonNote_GE', stand: '2026',
        url: 'https://www.ge.ch/allocation-logement/allocation-logement-conditions-obligations' },
  // Zug — Mietzinszuschüsse (WFG). Einkommen nach dir. Bundessteuer ≤ 60'000 (+2'500/Kind;
  // die Basisgrenze gilt für ZWEI Erwachsene, erst ab der 3. erwachsenen Person +20'000 je
  // weitere — siehe mietzinsIncomeLimit `adults - 2`, belegt durch das ZG-Merkblatt
  // Mietzinsbeiträge Sept. 2025: «Bei mehr als zwei volljährigen Personen wird die Limite pro
  // zusätzliche Person um Fr. 20'000.– erhöht.» (Wortlaut nachgelesen 11.11.2026)); Reinvermögen ≤ 144'000; Wohnung
  // max. 2 Zimmer mehr als Personen; min. 3 Jahre Wohnsitz/Arbeit; an Vermieter. Quelle: zg.ch.
  // einkommensBasis 'steuerbar': ZG vergleicht das steuerbare Einkommen (neuste definitive Veranlagung),
  // die App den Nettolohn — der liegt meist höher. Über der Grenze sagt die Ansicht das dazu.
  ZG: { state: 'has', group: 'all', incomeLimit: 60000, einkommensBasis: 'steuerbar', incomePerChild: 2500, incomePerAdult: 20000,
        residencyYears: 3, assetLimit: 144000,
        // ⟨10.11.2026, Predeploy-Nachzug⟩ Wohnsitz ODER Arbeitsplatz: WFG ZG (BGS 851.211) § 7 Abs. 1
        // lit. b «ihren Wohnsitz oder Arbeitsplatz seit mindestens drei Jahren im Kanton Zug» (am Volltext
        // bgs.zg.ch gelesen, Fachlogik-Prüfer). Die Liste W2 sagte vorher nur «Wohnsitz» → Pendler:innen
        // fälschlich ausgeschlossen.
        residencyOderArbeit: true,
        // +16'900 je Kind: wie cantonNote_ZG (Merkblatt Sept. 2025); die Liste W2 nannte nur 144'000 und
        // stufte Familien zu streng ein. Betrag hier nicht neu am Merkblatt nachgelesen.
        assetPerChild: 16900,
        // Nur für Wohnungen, die dem WFG unterstellt sind (Merkblatt Sept. 2025; zg.ch: «rund 1900
        // Wohnungen»). Entscheid Stebler Studios 25.09.2026: der Rechner FRAGT danach (wohnen.wfgWohnung,
        // 'ja' | 'nein' | 'weissNicht'). «nein» → kein Anspruch; offen/«weiss nicht» → Hinweis beim Ergebnis.
        wfgFrage: true,
        // Merkblatt Sept. 2025: zwischen 50'000 und 60'000 nur, wenn die Miete nach Verbilligung 25 %
        // des Einkommens übersteigt. Die App kennt die Miete VOR Verbilligung → nur ein Hinweis.
        mietbelastung: { ab: 50000, anteil: 0.25 },
        bedingungKey: 'mietzinsView.bedingung_ZG',
        noteKey: 'mietzinsView.cantonNote_ZG', stand: '2026',
        url: 'https://zg.ch/de/soziales/wohnungswesen/foerderinstrumente/fuer-privatpersonen' },
};

// Liefert Verfügbarkeit + Eckwerte für einen Kanton (Fallback: 'check' ohne Programm-Daten).
export function getMietzinsbeitraege(canton) {
  const p = PROGRAMS[canton];
  if (p) return { ...p, canton };
  return { state: 'check', url: MIETZINS_OVERVIEW_URL, canton };
}

// Einkommens-Richtgrenze inkl. Haushalts-Zuschläge (sofern der Kanton solche kennt).
// Gibt null zurück, wenn der Kanton keine einzelne Grenze hat (z.B. GE: mietabhängiges barème).
export function mietzinsIncomeLimit(program, householdSize = 1, childrenCount = 0, children = null) {
  if (!program || program.incomeLimit == null) return null;
  if (program.limitFormel === 'bs') {
    if (!children) return bsObergrenze(householdSize, childrenCount);
    const h = bsHaushalt(householdSize - childrenCount, children);
    return h.offen ? null : bsObergrenze(h.personen, h.kinder);
  }
  let limit = program.incomeLimit;
  // ZG: +2'500 je MINDERJÄHRIGES Kind; volljährige «Kinder» zählen als erwachsene Personen
  // (Merkblatt Sept. 2025; Abschluss-Prüfung 25.09.2026 — vorher bekam jedes Kind +2'500 und
  // nie +20'000, bis 17'500 zu streng). Ohne Altersangabe: minderjährig.
  const volljaehrig = children ? children.filter((c) => Number(c?.age) >= 18).length : 0;
  const minderjaehrig = childrenCount - volljaehrig;
  if (program.incomePerChild) limit += program.incomePerChild * minderjaehrig;
  if (program.incomePerAdult) {
    // ZG-Regel: Basisgrenze gilt für zwei Erwachsene, Zuschlag erst ab der 3. Person
    // («Bei mehr als zwei volljährigen Personen wird die Limite pro zusätzliche Person um Fr. 20'000.– erhöht», ZG-Merkblatt Sept. 2025).
    const adults = Math.max(1, householdSize - childrenCount) + volljaehrig;
    limit += program.incomePerAdult * Math.max(0, adults - 2);
  }
  return limit;
}

// BS: Grundeinkommen + 36'000 (Merkblatt 01.2026 Ziff. 13, Werte oben beim Programm).
// null für drei und mehr Erwachsene ohne Kind — diesen Haushaltstyp führt die Tabelle nicht.
// ⟨25.09.2026, Quellenprüfung⟩ Ab der sechsten Person +4'000, nicht +6'000: MBVO (890.510) Anhang 1
// «Für jede weitere Person plus Fr. 4'000.- ausgehend vom 5 PH», ebenso SoHaV (890.710) § 11 Abs. 2.
// Das Merkblatt nennt 6'000; massgebend sind nach seiner Ziff. 14 die Gesetzesbestimmungen.
export function bsObergrenze(personen, kinder) {
  const n = Math.max(1, Number(personen) || 1);
  const k = Math.max(0, Number(kinder) || 0);
  if (k === 0 && n >= 3) return null;
  const haushaltsabzug = k > 0 ? 24000 : 12000;
  const sozialabzug = n <= 5 ? [3750, 6000, 16000, 24000, 30000][n - 1] : 30000 + 4000 * (n - 5);
  return haushaltsabzug + sozialabzug + 36000;
}

// BS: wer als «Kind» zur Haushaltseinheit zählt — SoHaG (890.700) § 5 Abs. 2 lit. c, SoHaV § 2/§ 3,
// MBVO § 9 Abs. 2: minderjährig, oder 18–24 UND in Erstausbildung. 25 und älter gehört nicht dazu
// (auch nicht als erwachsene Person). Ob jemand zwischen 18 und 24 in Erstausbildung ist, weiss die
// App nur, wenn es beantwortet ist: `erstausbildung` am Kind ('ja' | 'nein'), gefragt im Mietzins-
// Rechner (Entscheid Stebler Studios 25.09.2026). 'ja' → Kind · 'nein' → nicht in der Haushaltseinheit
// (auch nicht als erwachsene Person, SoHaV § 3) · keine Antwort → `offen`, keine Grenze (je nach
// Antwort 12'000–16'000 Unterschied). Ohne Altersangabe zählt ein Kind als minderjährig.
export const istJungErwachsen = (c) => Number(c?.age) >= 18 && Number(c?.age) <= 24;
export function bsHaushalt(erwachsene, children = []) {
  const alter = (c) => Number(c?.age);
  const kinder = children.filter((c) => !(alter(c) >= 18) || (istJungErwachsen(c) && c.erstausbildung === 'ja'));
  const offen = children.some((c) => istJungErwachsen(c) && c.erstausbildung !== 'ja' && c.erstausbildung !== 'nein');
  return { personen: Math.max(1, erwachsene) + kinder.length, kinder: kinder.length, offen };
}

// O3 — Ergebnis-Art des Mietzins-Schnellchecks (MietzinsOrientierung.jsx).
// Die Einschätzung selbst bleibt in der Ansicht; hier wird nur aus IHREM Ergebnis (dem Schlüssel)
// die Art abgeleitet, damit es für die Einschätzung weiter genau eine Quelle gibt.
//
//   VORPRÜFUNG   Vergleich des Jahreseinkommens mit einer Richtgrenze (MIETZINS_DATA_VERSION) —
//                sagt, ob sich ein Antrag lohnen könnte, nie einen Betrag.
//   ORIENTIERUNG 'effortBased' (GE) / 'municipalLimit' (BL) / 'tableLimit' (BS, Haushaltstyp nicht in der Tabelle): keine feste
//                Grenze, also wird nichts geprüft.
//   null         Kanton ohne bestätigtes Programm ('none'/'check'): keine Prüfung, keine Art.
// Ohne Kanton ist offen, ob es ein Programm gibt — die Vorprüfung wartet auf den Kanton und,
// falls es fehlt, aufs Einkommen.
export function mietzinsErgebnis({ info, assessmentKey, annualIncome = 0 }) {
  if (!info) {
    return ergebnis(ERGEBNIS_ART.VORPRUEFUNG, { fehlend: fehlendeAngaben({ kanton: false, einkommen: annualIncome > 0 }) });
  }
  if (info.state !== 'has' || !assessmentKey) return null;
  if (['effortBased', 'municipalLimit', 'tableLimit', 'jungeErwachseneOffen'].includes(assessmentKey)) return ergebnis(ERGEBNIS_ART.ORIENTIERUNG);
  if (assessmentKey === 'needIncome') return ergebnis(ERGEBNIS_ART.VORPRUEFUNG, { fehlend: ['einkommen'] });
  return ergebnis(ERGEBNIS_ART.VORPRUEFUNG);
}

// Die Einschätzung «Beitrag möglich?» — EINE Rechnung für das Werkzeug «Mietzins» (MietzinsOrientierung) und die
// Szene im Kapitel Wohnen (Drittel-Haus mit Beitrag, Tonne, Schild; Stebler Studios 11.11.2026). Bis dahin stand sie
// nur im Werkzeug. Der Kanton kommt vom Aufrufer (das Werkzeug leitet ihn notfalls aus der Postleitzahl ab).
// Die Kommentare zu den Regeln stehen unverändert hier, wo jetzt gerechnet wird.
export function mietzinsEinschaetzung(data, canton) {
  const info = canton ? getMietzinsbeitraege(canton) : null;
  const hasProgram = !!info && info.state === 'has';

  const hh = getHouseholdInfo(data) || {};
  const householdSize = hh.householdSize || 1;
  const childrenCount = hh.childrenCount || 0;

  const monthlyIncome = parseFloat(data?.finanzen?.monthlyIncome) || 0;
  // 13. Monatslohn: dieselbe Regel wie Steuer und IPV (utils/dreizehnter.js). Vorher immer ×12 —
  // mit 13. lag das Jahreseinkommen 8,3 % zu tief, die Einschätzung zu grosszügig.
  // Massgebend ist in allen vier Programmen das HAUSHALTSeinkommen (Fachprüfung 25.09.2026:
  // BS «Summe aller Einkünfte des Haushalts», bs.ch · BL MBG § 8 Abs. 1 «Nettoeinkommen aller im
  // Haushalt lebenden … Personen» · ZG Merkblatt Sept. 2025 «Haushaltseinkommen nach direkter
  // Bundessteuer» · GE LRDU). Darum: Nebenerwerb ×12 immer; Partnereinkommen bei Ehe/eingetragener
  // Partnerschaft. Im Konkubinat hängt es an Dauer und gemeinsamen Kindern (BS: mit Kindern oder nach
  // fünf Jahren · BL: «gefestigtes Konkubinat» § 4 Abs. 2 lit. b MBG · ZG: nicht belegt) — dort NICHT
  // eingerechnet, aber die Zahl mit ihm genannt. Vorher zählte nur der Hauptlohn: zu grosszügig.
  const partnerMonat = hh.partnerIncome || 0;
  const partnerZaehlt = giltAlsVerheiratet(data?.basis?.maritalStatus);
  const eigenesJahr = Math.round(monthlyIncome * hauptlohnMonate(data?.finanzen?.dreizehnter)
    + (parseFloat(data?.finanzen?.sideIncome) || 0) * 12);
  const annualIncome = eigenesJahr + (partnerZaehlt ? Math.round(partnerMonat * 12) : 0);
  // Nicht verheiratet, aber eine zweite Person mit Einkommen im Haushalt (Konkubinat, ohne Zivilstand,
  // Wohngemeinschaft): nicht eingerechnet, die Zahl mit ihr steht daneben (Abschluss-Prüfung 25.09.2026 —
  // vorher nur bei «cohabiting», sonst fiel sie still weg).
  const konkubinatMitPartner = !partnerZaehlt && partnerMonat > 0
    ? eigenesJahr + Math.round(partnerMonat * 12) : null;
  // Verheiratet, Partnereinkommen nicht beantwortet: gerechnet ohne — wie «Alleinverdiener» bei der Steuer.
  const partnerRoh = partnerEinkommenRoh(data?.basis);
  const partnerOffen = partnerZaehlt && (partnerRoh === undefined || partnerRoh === null || String(partnerRoh).trim() === '');
  const ohneDreizehnten = monthlyIncome > 0 && dreizehnterStatus(data?.finanzen?.dreizehnter) === 'offen';
  const rentMonthly = (parseFloat(data?.wohnen?.rentAmount) || 0) + (parseFloat(data?.wohnen?.utilities) || 0);
  // BS ohne Ehe: die zweite erwachsene Person gehört (noch) nicht zur Haushaltseinheit — Grenze ohne sie,
  // passend zum Einkommen ohne sie; die Grenze mit ihr nennt der Hinweis (vorher bis 2'250 zu grosszügig).
  const ohneZweitePerson = info?.limitFormel === 'bs' && !partnerZaehlt && (hh.adults || 1) >= 2 ? 1 : 0;
  const incomeLimit = hasProgram ? mietzinsIncomeLimit(info, householdSize - ohneZweitePerson, childrenCount, hh.children || []) : null;
  const grenzeMitPartner = ohneZweitePerson && hasProgram ? mietzinsIncomeLimit(info, householdSize, childrenCount, hh.children || []) : null;
  // BS: jemand zwischen 18 und 24 im Haushalt — ob in Erstausbildung, entscheidet, ob er zählt.
  const bsJungOffen = info?.limitFormel === 'bs' && bsHaushalt(householdSize - ohneZweitePerson - childrenCount, hh.children || []).offen;

  // ZG: gilt nur für WFG-Wohnungen — die Antwort steht in wohnen.wfgWohnung (Frage unten im Schnellcheck).
  const wfg = data?.wohnen?.wfgWohnung;

  // Einschätzung aus erfassten Beträgen + Kanton-Eckwerten (nie verbindlich).
  const assessment = (() => {
    if (!hasProgram) return null;
    if (info.group === 'families' && childrenCount === 0) return { key: 'familiesOnly', tone: 'soft' };
    if (info.wfgFrage && wfg === 'nein') return { key: 'wfgNein', tone: 'soft' };
    // GE: mietabhängiges barème · BL: Grenze je Haushalt, von der Gemeinde festgesetzt (§ 6/§ 10 MBG).
    // BS: Haushaltstyp, den die Beitragstabelle nicht führt (drei und mehr Erwachsene ohne Kind).
    if (incomeLimit == null) return { key: info.limitArt === 'gemeinde' ? 'municipalLimit' : bsJungOffen ? 'jungeErwachseneOffen' : info.limitFormel ? 'tableLimit' : 'effortBased', tone: 'neutral' };
    if (!annualIncome) return { key: 'needIncome', tone: 'neutral' };
    if (annualIncome > incomeLimit) return { key: 'incomeHigh', tone: 'soft', params: { income: zahl(annualIncome, { hoechstens: 2 }), limit: zahl(incomeLimit, { hoechstens: 2 }) } };
    return { key: 'likely', tone: 'good', params: { income: zahl(annualIncome, { hoechstens: 2 }), limit: zahl(incomeLimit, { hoechstens: 2 }) } };
  })();
  return { info, hasProgram, hh, householdSize, childrenCount, monthlyIncome, partnerZaehlt, eigenesJahr, annualIncome,
    konkubinatMitPartner, partnerOffen, ohneDreizehnten, rentMonthly, ohneZweitePerson, incomeLimit, grenzeMitPartner,
    bsJungOffen, wfg, assessment };
}

// Höchstbetrag des Beitrags je Monat — als OBERGRENZE für diesen Haushalt, nie als zugesagter Betrag. Nur wo ein
// kantonaler Höchstbetrag belegt ist und die Einschätzung «unter der Grenze» sagt (Quellenprüfung swiss-precision-
// pruefer 11.11.2026). Das Haus zeigt ihn als «bis zu».
//   BS (Merkblatt Mietbeiträge 01.2026): Ziff. 11 «höchstens 12'720 Franken pro Jahr (entspricht 1'060 Franken pro
//   Monat)»; Ziff. 13 Jahresbeitrag = 12 · 0.85 · anrechenbare Miete · Einkommensfaktor; anrechenbare Miete =
//   min(Bruttomiete, Höchstmiete nach Zimmern, Ziff. 7) − (400 + 100 · (Zimmer − 1)); Faktor = 1 − (Einkommen −
//   Grundeinkommen) / 36'000. Obergrenze hier: Höchstmiete statt eigener Miete (Bruttomiete mit Pauschale kennt die
//   App nicht) und Einkommen 0 (massgebend ist nicht der Lohn) → Faktor = Grenze / 36'000. Ohne Zimmerzahl keine Zahl.
//   Eine Einzelperson mit 2 Zimmern kommt so auf 929, nicht auf 1'060.
//   GE: «Le montant annuel … au maximum de 1 000 francs par pièce; … ne peut dépasser la moitié du loyer effectif»
//   (RGL I 4 05.01 Art. 24 Abs. 2) — ein JAHRESwert. GE hat keine Einkommensgrenze («effortBased»), darum keine
//   Einschätzung «unter der Grenze» und hier keine Zahl. ZG und BL: kein Höchstbetrag belegt (Gemeinde/Anlagekosten).
export const BS_HOECHSTMIETE = { 1: 960, 2: 1260, 3: 1660, 4: 1960, 5: 2360 };
export function beitragHoechstMonat(e, zimmer) {
  if (!e || !e.hasProgram || e.assessment?.key !== 'likely') return null;
  if (e.info?.limitFormel !== 'bs' || !(Number(e.incomeLimit) > 0)) return null;
  const z = Math.min(5, Math.ceil(Number(String(zimmer ?? '').replace(',', '.'))));
  if (!(z >= 1)) return null;
  const anrechenbar = BS_HOECHSTMIETE[z] - (400 + 100 * (z - 1));
  const faktor = Number(e.incomeLimit) / 36000;
  return Math.round(Math.min(Number(e.info.benefitMaxMonth) || 1060, 0.85 * anrechenbar * faktor));
}

// Kantone mit einem in der App erfassten Programm (gefüllt auf der Kachelkarte).
export const PROGRAMM_KANTONE = Object.keys(PROGRAMS);

// Kachelkarte (Matrix 10.11.2026 §5, Skizze C3): jeder Kanton eine gleich grosse Kachel, grob nach seiner Lage.
// [Zeile, Spalte]. Für Ja/Nein-Fragen je Kanton, wo die echte Karte kleine Kantone verschluckt.
export const KACHELKARTE_LAGE = {
  SH: [0, 4],
  BS: [1, 2], BL: [1, 3], AG: [1, 4], ZH: [1, 5], TG: [1, 6],
  JU: [2, 1], SO: [2, 2], LU: [2, 3], ZG: [2, 4], SZ: [2, 5], SG: [2, 6], AR: [2, 7],
  NE: [3, 1], BE: [3, 2], OW: [3, 3], NW: [3, 4], UR: [3, 5], GL: [3, 6], AI: [3, 7],
  VD: [4, 1], FR: [4, 2], VS: [4, 3], TI: [4, 5], GR: [4, 6],
  GE: [5, 0],
};
