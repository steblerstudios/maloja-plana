// K31 — der gemeinsame Rahmen der kantonalen Prämienverbilligungs-Modelle.
//
// WARUM ES DIESE DATEI GIBT
// Am 20.09.2026 lag derselbe Fehler in vier Kantonsmodulen: ohne erfasste Prämie fiel der
// gesetzliche Deckel still weg, und die App zeigte die Obergrenze statt des Anspruchs. Er
// musste viermal einzeln behoben werden — und wurde in Waadt zuerst übersehen, weil dessen
// Zweig gerade in keinem Pull Request lag. Was in allen Kantonen gleich ist, gehört an EINE
// Stelle: dann behebt man es einmal und es wirkt überall.
//
// WAS HIER NICHT HINGEHÖRT
// Alles, was kantonal verschieden ist — Formel, Zahlen, Bezugsjahr, Vorbehalte, die
// Reihenfolge der Riegel. Ein Rahmen, der Unterschiede einebnet, ist schlimmer als
// Wiederholung: er macht aus einem sichtbaren Unterschied einen unsichtbaren.
// Darum sind die Regeln unten **benannt und belegt**, nicht vereinheitlicht.

// ─── Eingaben lesen ────────────────────────────────────────────────────────────

// Vermögen ist in allen vier Kantonen dieselbe Summe der drei erfassten Posten.
// 🛑 Nicht dasselbe wie «steuerbares Gesamtvermögen» — die Kantone meinen das, die App
// kennt nur die erfassten Posten. Der Unterschied steht je Kanton in der Anzeige.
export function vermoegenSumme(f) {
  return Number(f.securitiesValue || 0) + Number(f.otherAssets || 0) + Number(f.savingsAccount || 0);
}

// Jahreseinkommen aus den Monatsfeldern, plus Säule 3a als bereits jährlicher Betrag
// (Feldbeschriftung «3. Säule A eingezahlt CHF/Jahr» — darum ohne × 12).
export function einkommenJahr(f) {
  return ['monthlyIncome', 'sideIncome', 'ahvRente', 'ivRente', 'bvgRente']
    .reduce((s, k) => s + Number(f[k] || 0), 0) * 12 + Number(f.pension3a || 0);
}

export function geburtsjahr(b) {
  return /^\d{4}-/.test(b?.dateOfBirth || '') ? Number(b.dateOfBirth.slice(0, 4)) : null;
}

// Prämie als Jahresbetrag. Bewusst ohne `|| 0`: ein fehlendes Feld ergibt NaN, und NaN
// fällt durch den Riegel `praemieFehlt` — anders als eine 0, die wie eine erfasste Null aussieht.
export function praemieJahr(data) {
  return Number(data?.versicherungen?.kkPremium) * 12;
}

// ─── Riegel, die in ALLEN Kantonen gleich sind ────────────────────────────────

// Die App rechnet nur für das Jahr, dessen Werte belegt sind. Ab dem 01.01. des Folgejahres
// lieber keine Zahl als eine aus veralteten Sätzen — die Kantone passen jährlich an.
export function jahrVorbei(jahr) {
  return new Date().getFullYear() > jahr;
}

// `cohabiting` gehört dazu: Konkubinat rechnet je nach Kanton wie ein Paar, und das
// Einkommen der zweiten Person kennt die App nicht. (Befund Fachprüfung 20.09.2026 —
// der Riegel prüfte nur `married`, `cohabiting` lief durch und rechnete.)
export function mehrereErwachsene(hh, b) {
  return hh.adults !== 1 || b.maritalStatus === 'married' || b.maritalStatus === 'cohabiting';
}

// 🛑 DER RIEGEL, DER VIERMAL GEFEHLT HAT.
// Ohne erfasste Prämie greift der gesetzliche Deckel nicht (die Verbilligung ist höchstens
// so hoch wie die tatsächliche Prämie). Eine Zahl ohne ihn wäre die Obergrenze, nicht der
// Anspruch — in AG gemessen bis 40 % zu viel. Jeder neue Kanton ruft diesen Riegel auf,
// bevor er eine Zahl zurückgibt. (Befund Fachprüfung 20.09.2026, ZH/BE/AG; VD nachgezogen.)
export function praemieFehlt(praemie) {
  return !(praemie > 0);
}

// 🛑 UND DER GEGENFALL, damit ein Fehlen nicht wie ein Vergessen aussieht.
// Nicht jeder Kanton kennt diesen Deckel: St.Gallen begrenzt die Verbilligung NICHT auf die
// fakturierte Prämie (weder sGS 331.538 noch sGS 331.111 enthalten eine solche Bestimmung;
// gemessen am vollen Verordnungstext mit Gegenprobe, 20.09.2026). Dort geht die Prämie in
// die Rechnung gar nicht ein, und `praemieFehlt` wäre falsch.
// Ein Kantonsmodul, das den Riegel weglässt, setzt stattdessen diese Konstante und nennt den
// Grund — so liest sich das Auslassen als Entscheid, nicht als Lücke, und der nächste Kanton
// kopiert kein stilles Fehlen. (Befund Fachprüfung 20.09.2026.)
export const KEIN_PRAEMIENDECKEL = Object.freeze({
  SG: 'sGS 331.538 und sGS 331.111 kennen keine Begrenzung auf die fakturierte Prämie — '
    + 'die Verbilligung bemisst sich allein an der kantonalen Referenzprämie. '
    + 'Offene Frage an die SVA St.Gallen: was gilt, wenn die eigene Prämie tiefer ist?',
});

// ─── Regeln, die kantonal VERSCHIEDEN sind — benannt statt vereinheitlicht ─────

// Ab wann gilt eine Person als erwachsen? Zwei Regeln, nicht vier Schreibweisen — aber
// DREI Wissensstände, und der Unterschied zwischen ihnen zählt:
//
//   abEndeVorjahr       ZH — ausdrücklich im Erlass: § 8 EG KVG, «für das ganze Jahr das
//                       Alter am Ende des Vorjahres massgebend». BELEGT.
//   mangelsStichtag     BE, VD, SG — rechnerisch dasselbe wie oben, aber aus einem anderen
//                       Grund: die Erlasse nennen für das Alter KEINEN Stichtag. Darum
//                       rechnet die App nur, wenn die Alterszeile das ganze Jahr dieselbe
//                       ist. GEWÄHLT, nicht belegt — und jederzeit zu überdenken, wenn eine
//                       Quelle auftaucht.
//   imAnspruchsjahr     AG — die SVA führt für 2027 die Jahrgänge 2002–2008 als junge
//                       Erwachsene; erwachsen ist, wer im Anspruchsjahr 26 wird.
//
// ⚠️ Der Unterschied zwischen den beiden Regeln ist echt und beträgt einen Jahrgang: für das
// Anspruchsjahr 2026 rechnet AG für den Jahrgang 2000, die anderen nicht. Gemessen am
// aufgezeichneten Verhalten, nicht aus dem Quelltext gelesen.
//
// 🛑 `abEndeVorjahr` und `mangelsStichtag` sind absichtlich zwei Namen für dieselbe Rechnung.
// Sonst schreibt der nächste Kanton «belegt», wo «vorsichtig gewählt» gemeint war — und ein
// gewählter Wert, den niemand mehr als Wahl erkennt, wird beim nächsten Zweifel verteidigt
// statt geprüft. (Befund Fachprüfung 20.09.2026.)
const ALTER_AM_ENDE_DES_VORJAHRES = (jahr, geburt) => (jahr - 1) - geburt >= 26;
export const ERWACHSEN = {
  abEndeVorjahr: ALTER_AM_ENDE_DES_VORJAHRES,
  mangelsStichtag: ALTER_AM_ENDE_DES_VORJAHRES,
  imAnspruchsjahr: (jahr, geburt) => (jahr - geburt) >= 26,
};

// Kinderalter aus Geburtsdatum oder eingetipptem Alter.
//
// Kind ohne Geburtsdatum: `age` ist in der App mit 0 vorbelegt (ChapterView legt neue Kinder
// so an, dataMigration setzt es bei Alt-Daten ebenso). Eine 0 heisst darum «nicht erfasst»,
// nicht «Säugling» — sonst erhöhen sich Referenzprämie und Mindestanspruch still
// (Befund Fachprüfung 20.09.2026). Ergebnis `null` ⇒ der Kanton gibt keine Zahl.
//
// `eingetipptPlus` ist die vorsichtige Seite an der Grenze 18 und je Kanton verschieden:
// ZH nimmt das eingetippte Alter unverändert (Bezugsjahr ist bereits das Vorjahr), BE zählt
// ein Jahr dazu (Bezugsjahr ist das Anspruchsjahr). Beide Wege wirken nie nach oben.
export function kinderAlter(children, bezugsjahr, eingetipptPlus = 0) {
  return (children || []).map((c) => (/^\d{4}-/.test(c.birthDate || '')
    ? bezugsjahr - Number(c.birthDate.slice(0, 4))
    : (Number(c.age) > 0 ? Number(c.age) + eingetipptPlus : null)));
}

export const ALTER_UNERFASST = (alter) => alter.some((a) => a === null);
export const UEBER_18 = (alter) => alter.some((a) => a > 18);

// ─── Prämienregion aus PLZ und Ort ────────────────────────────────────────────

// Wortgleich in ZH und BE gewesen. Gibt die Region zurück, wenn die Gemeinde eindeutig ist
// ODER alle Gemeinden der PLZ in derselben Region liegen — sonst `null`, und der Kanton
// entscheidet, welchen Grund er dafür nennt (BE unterscheidet «Gemeinde unklar» von
// «Region der Gemeinde strittig», siehe Reutigen).
export function regionAusPLZ({ data, kanton, lookupPLZ, regionFn }) {
  const plz = String(data.wohnen?.postalCode || '').trim();
  const orte = plz ? lookupPLZ(plz).filter((g) => g.kanton === kanton) : [];
  const stadt = String(data.wohnen?.city || '').trim().toLowerCase();
  const ort = orte.length === 1 ? orte[0] : orte.find((g) => g.gemeinde.toLowerCase() === stadt);
  const regionen = new Set(orte.map((g) => regionFn(g.bfsNr)));
  const region = ort ? regionFn(ort.bfsNr) : regionen.size === 1 ? [...regionen][0] : null;
  return { region, orte, ort };
}

// ─── Deckel ───────────────────────────────────────────────────────────────────

// Der gesetzliche Deckel gilt PRO PERSON: die App kennt nur die Prämie der erwachsenen
// Person, also wird auch nur deren Anteil gedeckelt — der Kinderanteil bleibt ungedeckelt,
// statt den Deckel mit Kindern ganz entfallen zu lassen (Befund Fachprüfung 20.09.2026).
// Wortgleich in BE und VD gewesen.
export function deckelnProPerson(gesamt, erwachsenenTeil, praemie) {
  return Math.round(Math.min(erwachsenenTeil, praemie) + (gesamt - erwachsenenTeil));
}

// ─── Ergebnis ─────────────────────────────────────────────────────────────────

// Die Rückgabe war in allen Kantonen bis auf wenige Felder dieselbe. `extra` trägt, was
// den Kanton ausmacht (ZH/BE: `region` · AG: `basisjahr`).
export function ergebnisOhneAnspruch({ canton, cantonData, jahr, vorbehaltKey, noteKey, noteParams = {}, extra = {} }) {
  return {
    belegt: true, eligible: false, amount: 0,
    noteKey, noteParams,
    canton, cantonData, jahr, vorbehaltKey, ...extra,
  };
}

export function ergebnisMitAnspruch({ canton, cantonData, jahr, vorbehaltKey, noteKey, noteParams = {}, annual, maxAnnual, youngAdultsCount, extra = {} }) {
  return {
    eligible: true, belegt: true, anspruchMoeglich: true,
    amount: Math.round(annual / 12), annual, maxAnnual,
    reductionPercent: Math.round((annual / maxAnnual) * 100),
    noteKey, noteParams,
    youngAdultsCount, canton, cantonData, jahr, vorbehaltKey, ...extra,
  };
}
