// Prämienverbilligung (IPV) Kanton Bern — amtliche Stufentabelle, Jahr 2026 (K31).
// Nur BE rechnet hiermit; alle anderen Kantone bleiben in calculateIPV unverändert.
// Belege (abgerufen 20.09.2026), Wortlaute in docs/sources/ipv-kantone-2026.md, Abschnitt BE:
//   KKVV (BSG 842.111.1, Stand 01.12.2025) Art. 9 Abs. 1: «Vom Reinvermögen sind für jedes
//     Mitglied der Familie 17'000 Franken abzuziehen.»
//   Art. 9 Abs. 2: massgebendes Einkommen = korrigiertes Reineinkommen + «fünf Prozent des
//     nach Absatz 1 reduzierten Reinvermögens» minus die Abzüge a–f (13'000 Paar · 9'750
//     alleinstehender Elternteil · 2'200 alleinstehende Person · 15'000/12'500/10'000 je Kind).
//   Art. 10 Abs. 2: massgebend ist die Wohnsitzgemeinde am 1. Januar, für das ganze Jahr.
//   Art. 10 Abs. 5: «Die Gemeinden werden den Prämienregionen zugeteilt, die vom Bundesamt
//     für Gesundheit gestützt auf Artikel 61 Absatz 2 KVG festgelegt werden.»
//   Art. 10a Abs. 1/3: Monatsbeträge Erwachsene je Region und Einkommensstufe.
//   Art. 10d Abs. 1: Kinder «80 Prozent der Prämie», wenn das massgebende Familieneinkommen
//     45'000 Franken nicht übersteigt; der Betrag daraus steht im Berechnungsschema.
//   ASV, «Berechnungsschema — Gültig ab 1. Januar 2026»: dieselben Beträge als Tabelle,
//     die Anspruchsgrenzen 35'000 / 45'000 und die vollständigen Gemeindelisten R1/R2.
//   ASV, «Informationen zur Prämienverbilligung 2026»: Bruttovermögen über 750'000 →
//     keine automatische Prüfung; Konkubinat mit gemeinsamem Kind rechnet wie ein Ehepaar.
import { getRegion } from '../data/praemienRegionen.js';

export const IPV_BE = {
  jahr: 2026,
  // Obere Grenze jeder Einkommensstufe. Berechnungsschema 2026: «bis 9'000 / bis 17'000 /
  // bis 25'000 / bis 35'000 / bis 45'000 Franken»; die letzte Spalte gilt nur für Familien
  // mit zur Familie zählenden Kindern (KKVV Art. 10a Abs. 3).
  stufen: [9000, 17000, 25000, 35000, 45000],
  grenze: { ohneKinder: 35000, mitKindern: 45000 },
  // Monatsbeträge in CHF je Prämienregion, in der Reihenfolge der Stufen oben.
  erwachsene: { 1: [221, 147, 107, 67, 33.5], 2: [196, 132, 96, 60, 30], 3: [183, 123, 89, 56, 28] },
  // Kinder bis 18: ein Betrag für alle Stufen (KKVV Art. 10d — 80 % der Prämie, unabhängig
  // von der Stufe, solange das Familieneinkommen 45'000 nicht übersteigt).
  kinder: { 1: 119.3, 2: 106, 3: 99.35 },
  vermoegen: { freibetragProKopf: 17000, anteil: 0.05, bruttoGrenze: 750000 },
  // Unter diesem korrigierten Reineinkommen prüft der Kanton nicht automatisch, sondern nur
  // auf Antrag bis 31.12. (Informationsblatt 2026, S. 2).
  antragUnterEinkommen: 14000,
  abzug: { ehepaar: 13000, alleinerziehend: 9750, alleinstehend: 2200, kind: [15000, 12500], kindWeitere: 10000 },
};

// Prämienregion einer Gemeinde. Rechtlich massgebend ist die BAG-Zuteilung (KKVV Art. 10
// Abs. 5) — dieselbe Tabelle, die src/data/praemienRegionen.js trägt. Das Berechnungsschema
// des ASV druckt die Listen zusätzlich ab; ein Test hält beide gegeneinander.
// Genau eine Gemeinde geht auseinander: Reutigen (BFS 767) steht beim BAG in Region 2, fehlt
// aber in der R2-Liste des Schemas (dort wäre es «alle übrigen» = Region 3). Umgekehrt führt
// das Schema «Schlosswil», das keine eigene BFS-Nummer mehr hat. Solange die beiden amtlichen
// Quellen sich widersprechen, zeigt die App für diese Gemeinde keinen Betrag — der Unterschied
// wäre je nach Lesart bis zu CHF 156 im Jahr je erwachsene Person und CHF 79.80 je Kind.
const REGION_STRITTIG = [767];

export function beRegion(bfsNr) {
  const n = Number(bfsNr);
  if (REGION_STRITTIG.includes(n)) return null;
  const r = getRegion(n);
  return r === 1 || r === 2 || r === 3 ? r : null;
}

// Massgebendes Einkommen nach KKVV Art. 9 Abs. 2. `reineinkommen` ist das (genäherte)
// korrigierte Reineinkommen im Jahr, `vermoegen` das Reinvermögen, `mitglieder` die Zahl
// der Familienmitglieder, `kinderZahl` die der zur Familie zählenden Kinder.
export function beMassgebendesEinkommen({ reineinkommen, vermoegen, mitglieder, kinderZahl, verheiratet = false }) {
  const p = IPV_BE;
  const korrVermoegen = Math.max(0, Math.max(0, vermoegen) - p.vermoegen.freibetragProKopf * mitglieder);
  let abzug = verheiratet ? p.abzug.ehepaar : kinderZahl > 0 ? p.abzug.alleinerziehend : p.abzug.alleinstehend;
  for (let i = 0; i < kinderZahl; i++) abzug += p.abzug.kind[i] ?? p.abzug.kindWeitere;
  return Math.max(0, Math.max(0, reineinkommen) + p.vermoegen.anteil * korrVermoegen - abzug);
}

// Reine Rechnung. `personen` sind die Kategorien ('e' = Erwachsene über 25, 'k' = Kind bis 18),
// `me` das massgebende Einkommen im Jahr. Liefert Monats- und Jahresbetrag, den Betrag der
// obersten Stufe (Vergleichsgrösse für die Anzeige) und die Anspruchsgrenze.
// Stufenzuordnung nach dem Berechnungsschema («bis 9'000 …»), also einschliesslich der
// genannten Zahl. Die KKVV schreibt «unter 9000» und dann «zwischen 9001 und 17'000» und
// lässt damit genau den Wert 9'000 ungeregelt; die App folgt der Tabelle des Amts, das die
// Verfügung erlässt. Betrifft nur diesen einen Punkt.
export function ipvBernRechnen({ region, personen, me }) {
  const p = IPV_BE;
  const kinderZahl = personen.filter((c) => c === 'k').length;
  const grenze = kinderZahl > 0 ? p.grenze.mitKindern : p.grenze.ohneKinder;
  const me0 = Math.max(0, me);
  // Über der Grenze kein Anspruch — und die Anteile ausdrücklich auf 0, sonst rechnet der
  // Deckel weiter unten mit `undefined` (aufgefallen im Test, 20.09.2026).
  if (me0 > grenze) return { monat: 0, annual: 0, maximal: 0, grenze, stufe: null, erwachseneAnnual: 0, erwachseneMaximal: 0 };
  const stufe = p.stufen.findIndex((s) => me0 <= s);
  const betrag = (i) => personen.reduce((s, c) => s + (c === 'k' ? p.kinder[region] : p.erwachsene[region][i]), 0);
  // Der Anteil der erwachsenen Person getrennt: nur ihre Prämie kennt die App, und nur ihr
  // Anteil darf nach KKVV Art. 10 Abs. 1 auf die eigene Prämie gedeckelt werden.
  const erwachseneAnteil = (i) => personen.filter((c) => c === 'e').length * p.erwachsene[region][i];
  const monat = betrag(stufe);
  return {
    monat, annual: monat * 12, maximal: betrag(0) * 12, grenze, stufe,
    erwachseneAnnual: erwachseneAnteil(stufe) * 12, erwachseneMaximal: erwachseneAnteil(0) * 12,
  };
}

// Aufruf aus calculateIPV (config/cantonalData.js) für BE mit Beleg. Die App rechnet nur,
// wo ihre Angaben dafür reichen; sonst dieselbe Orientierung wie ein unbelegter Kanton, mit
// Grund in `offen`. Bewusst NICHT gerechnet (die Angabe fehlt in der App):
//   Paare/mehrere Erwachsene (Alter und Einkünfte der zweiten Person fehlen; Konkubinat mit
//   gemeinsamem Kind rechnet amtlich wie ein Ehepaar), verheiratet ohne Partner im Haushalt,
//   eigenes Alter unbekannt oder nicht eindeutig über 25, Kinder ohne Alter oder über 18
//   (junge Erwachsene hängen an Ausbildung und eigenem Einkommen — beides nicht erfasst),
//   Bruttovermögen über 750'000, Gemeinde nicht eindeutig, Anspruchsjahr vorbei.
//   Näherung: korrigiertes Reineinkommen = Erwerbs-, Neben- und Renteneinkommen × 12 plus die
//   Säule-3a-Einzahlung (KKVV Art. 9 Abs. 2 i. V. m. dem Berechnungsschema, Ziffer 1.1).
//   Amtlich zählt das Reineinkommen aus den Steuerdaten; es fehlen also die Berufsauslagen und
//   die übrigen Aufrechnungen, und das Vermögen ist hier nur die Summe der erfassten Werte,
//   nicht das Reinvermögen inkl. Liegenschaft und abzüglich Schulden. In einer Stufentabelle
//   wirkt sich das stärker aus als in einem linearen Modell: eine Stufe ist im Jahr bis zu
//   CHF 888 wert.
export function ipvBern(data, hh, ipvData, youngAdultsCount, orientierung, lookupPLZ) {
  const b = data.basis || {};
  const f = data.finanzen || {};
  const jahr = IPV_BE.jahr;
  // Die App rechnet nur für das Jahr, dessen Werte belegt sind. Ab dem 01.01. des Folgejahres
  // lieber keine Zahl als eine aus veralteten Stufen (die KKVV wird jährlich angepasst; das
  // Berechnungsschema 2027 war am 20.09.2026 noch nicht publiziert).
  if (new Date().getFullYear() > jahr) return orientierung('jahr');
  // Konkubinat: «Leben Sie unverheiratet mit Ihrem Partner/Ihrer Partnerin im gleichen Haushalt
  // und haben mindestens ein gemeinsames Kind, dann wird die Berechnung der Prämienverbilligung
  // wie bei einem verheirateten Paar vorgenommen» (Informationsblatt 2026, S. 1). Das Einkommen
  // der zweiten Person kennt die App nicht — ohne sie wäre der Betrag beliebig zu hoch. Darum
  // dasselbe Nein wie bei Verheirateten. (Befund Fachprüfung 20.09.2026: der Guard prüfte nur
  // `married`, `cohabiting` lief durch und rechnete.)
  if (hh.adults !== 1 || b.maritalStatus === 'married' || b.maritalStatus === 'cohabiting') return orientierung('haushalt');

  // Weder KKVV noch Berechnungsschema nennen einen Stichtag für das Alter (nur für die
  // Gemeinde, Art. 10 Abs. 2). Darum rechnet die App nur, wenn die Alterszeile das ganze
  // Jahr über dieselbe ist: massgebend ist das Mindestalter im Anspruchsjahr für Erwachsene
  // und das Höchstalter für Kinder — wer im Anspruchsjahr Geburtstag hat, fällt heraus.
  // ⟨korrigiert 20.09.2026 nach der Fachprüfung⟩ Hier stand: «wer genau 25 wird, steht in
  // keiner Zeile». Das gilt nur für den Tabellenkopf; der Erlass schliesst die Lücke
  // (Art. 4 Abs. 2 «bis zum vollendeten 25. Altersjahr», Abs. 3 «Als Erwachsene werden alle
  // übrigen Personen bezeichnet»). Der Ausschluss bleibt — er beruht auf dem fehlenden
  // Stichtag, nicht auf einer Lücke im Erlass. Dasselbe gilt für Kinder (Art. 4 Abs. 1/2):
  // Ein Kind, das im Jahr 19 wird, rechnet die App ganzjährig als Kind — das wirkt zu tief,
  // nie zu hoch, und bleibt darum vorerst so.
  const geburt = /^\d{4}-/.test(b.dateOfBirth || '') ? Number(b.dateOfBirth.slice(0, 4)) : null;
  if (!geburt || jahr - geburt - 1 <= 25) return orientierung('alter');
  // Kind ohne Geburtsdatum: `age` ist in der App mit 0 vorbelegt (ChapterView legt neue Kinder
  // so an, dataMigration setzt es bei Alt-Daten ebenso). Eine 0 heisst «nicht erfasst», nicht
  // «Säugling» — und ein nicht erfasstes Alter erhöht sonst still den Betrag.
  const kinderAlter = hh.children.map((c) => (/^\d{4}-/.test(c.birthDate || '')
    ? jahr - Number(c.birthDate.slice(0, 4))
    // Beim eingetippten Alter kommt ein Jahr dazu: es ist nicht datiert, die Person kann im
    // Anspruchsjahr Geburtstag haben. So bleibt die Zuordnung «Kind bis 18» auf der sicheren
    // Seite, statt eine junge erwachsene Person als Kind zu rechnen.
    : (Number(c.age) > 0 ? Number(c.age) + 1 : null)));
  if (kinderAlter.some((a) => a === null)) return orientierung('alter');
  if (kinderAlter.some((a) => a > 18)) return orientierung('haushalt');

  const plz = String(data.wohnen?.postalCode || '').trim();
  const orte = plz ? lookupPLZ(plz).filter((g) => g.kanton === 'BE') : [];
  const stadt = String(data.wohnen?.city || '').trim().toLowerCase();
  const ort = orte.length === 1 ? orte[0] : orte.find((g) => g.gemeinde.toLowerCase() === stadt);
  const regionen = new Set(orte.map((g) => beRegion(g.bfsNr)));
  const region = ort ? beRegion(ort.bfsNr) : regionen.size === 1 ? [...regionen][0] : null;
  if (!region) {
    // Zwei verschiedene Gründe, zwei verschiedene Sätze: bei Reutigen ist die Gemeinde
    // eindeutig, strittig ist ihre Prämienregion (Fachprüfung 20.09.2026).
    const strittig = orte.some((g) => REGION_STRITTIG.includes(Number(g.bfsNr)))
      && (!ort || REGION_STRITTIG.includes(Number(ort.bfsNr)));
    return orientierung(strittig ? 'regionStrittig' : 'region');
  }

  const kinderZahl = kinderAlter.length;
  const vermoegen = Number(f.securitiesValue || 0) + Number(f.otherAssets || 0) + Number(f.savingsAccount || 0);
  // 750'000 ist in BE KEIN Ausschluss, sondern der Punkt, ab dem der Kanton nicht mehr
  // automatisch prüft (Informationsblatt 2026, S. 2 — dieselbe Liste wie beim kleinen
  // Einkommen). Darum ein eigener Grund statt «über der kantonalen Grenze».
  if (vermoegen > IPV_BE.vermoegen.bruttoGrenze) return orientierung('vermoegenAntrag');
  const reineinkommen = ['monthlyIncome', 'sideIncome', 'ahvRente', 'ivRente', 'bvgRente']
    .reduce((s, k) => s + Number(f[k] || 0), 0) * 12 + Number(f.pension3a || 0);
  const me = beMassgebendesEinkommen({ reineinkommen, vermoegen, mitglieder: 1 + kinderZahl, kinderZahl });

  const r = ipvBernRechnen({ region, personen: ['e', ...kinderAlter.map(() => 'k')], me });
  const cantonData = { ...ipvData, maxIncome: r.grenze };
  // KKVV Art. 10 Abs. 1: «Die Prämie wird höchstens bis zu ihrem effektiven Umfang verbilligt.»
  // Der Deckel gilt PRO PERSON. Die App kennt nur die Prämie der erwachsenen Person, also wird
  // auch nur deren Anteil gedeckelt — der Kinderanteil bleibt ungedeckelt, statt wie bisher den
  // Deckel mit Kindern ganz entfallen zu lassen (Befund Fachprüfung 20.09.2026).
  const praemie = Number(data.versicherungen?.kkPremium) * 12;
  // Ohne erfasste Prämie greift der gesetzliche Deckel nicht (die Verbilligung ist höchstens
  // so hoch wie die tatsächliche Prämie). Eine Zahl ohne ihn wäre die Obergrenze, nicht der
  // Anspruch — in AG gemessen bis 40 % zu viel. Darum Orientierung, bis die Prämie dasteht
  // (Befund Fachprüfung 20.09.2026; betrifft alle drei Kantone mit eigenem Modell).
  if (!(praemie > 0)) return orientierung('praemie');
  const deckeln = (gesamt, erwachsenenTeil) => (praemie > 0
    ? Math.round(Math.min(erwachsenenTeil, praemie) + (gesamt - erwachsenenTeil))
    : Math.round(gesamt));
  const annual = deckeln(r.annual, r.erwachseneAnnual);
  const maxAnnual = deckeln(r.maximal, r.erwachseneMaximal);
  if (annual <= 0) {
    return { belegt: true, eligible: false, amount: 0, noteKey: 'ipv.incomeAboveLimit', noteParams: { value: r.grenze }, canton: 'BE', cantonData, region, jahr, vorbehaltKey: 'ipv.vorbehaltBE' };
  }
  // «Automatisch via Steuerdaten» stimmt nicht für alle: Wer mindestens 25 ist, keine zur Familie
  // zählenden Kinder hat und ein korrigiertes Reineinkommen unter 14'000 ausweist, muss die
  // Überprüfung bis 31.12. selbst beantragen (Informationsblatt 2026, S. 2). Genau die ärmste
  // Gruppe — wer sich hier auf «automatisch» verlässt, verliert den ganzen Anspruch.
  const antragNoetig = !kinderZahl && reineinkommen < IPV_BE.antragUnterEinkommen;
  return {
    eligible: true, belegt: true, anspruchMoeglich: true,
    amount: Math.round(annual / 12), annual, maxAnnual,
    reductionPercent: Math.round((annual / maxAnnual) * 100),
    noteKey: antragNoetig ? 'ipv.beAntragNoetig' : ipvData.noteKey,
    noteParams: antragNoetig ? {} : (ipvData.noteParams || {}),
    youngAdultsCount, canton: 'BE', cantonData, region, jahr, vorbehaltKey: 'ipv.vorbehaltBE',
  };
}
