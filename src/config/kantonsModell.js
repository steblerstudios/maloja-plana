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

// Die drei Zurechnungsregeln — benannt und belegt, NICHT vereinheitlicht.
//
// Nachdem die Doppelzählung weg ist (siehe unten), trägt das rohe Nettoeinkommen die volle
// Säule 3a bereits. Die kantonale Regel wirkt darum als ABZUG: sie sagt, welcher Teil der 3a
// im massgebenden Einkommen NICHT stehen bleiben darf.
//
//   voll                 ZH, SG — unbedingte Zurechnung, keine Schwelle, kein Deckel.
//                        ZH: § 5 Abs. 1 lit. b EG KVG (LS 832.01)
//                        SG: Art. 12 Abs. 2 Ziff. 2 (sGS 331.111)
//                        ⇒ Abzug 0. Der App-Wert ist hier genau richtig.
//   bisBundesMaximum     BE — nur bis zum bundesrechtlichen Maximum für Unselbständige.
//                        KKVV Art. 6 Abs. 4 lit. i
//   schwelleOhneSaeule2  AG — nur der Teil ÜBER 10 % des Nettoerwerbseinkommens, und nur
//                        bei Personen OHNE Säule 2.
//                        § 6 Abs. 5 KVGG (SAR 837.200) i. V. m. § 5 Abs. 1 V KVGG (837.211)
//
// 🛑 ZWEI DIESER DREI WIRKEN HEUTE NOCH NICHT — und das steht hier, statt still zu fehlen.
// Gleiche Bauart wie `KEIN_PRAEMIENDECKEL`: ein Weglassen, das als Entscheid lesbar ist,
// wird beim nächsten Kanton nicht kopiert. Beide geben `0` zurück wie `voll`, aber aus
// einem benannten Grund — wer die Zahl später einsetzt, sieht sofort, was ihm fehlte.
export const SAEULE_3A = Object.freeze({
  voll: Object.freeze({
    name: 'voll',
    kantone: 'ZH, SG',
    beleg: 'ZH § 5 Abs. 1 lit. b EG KVG (LS 832.01) · SG Art. 12 Abs. 2 Ziff. 2 (sGS 331.111)',
    nichtAufgerechnet: () => 0,
  }),

  bisBundesMaximum: Object.freeze({
    name: 'bisBundesMaximum',
    kantone: 'BE',
    beleg: 'KKVV Art. 6 Abs. 4 lit. i',
    // 🛑 Die Norm steht, die ZAHL fehlt. Der Frankenwert des bundesrechtlichen 3a-Maximums
    // 2026 ist NICHT belegt: Fedlex lieferte am 20.09.2026 für eine ERFUNDENE ELI eine
    // byte-identische Antwort — das Messgerät war unbrauchbar, also gilt kein Ergebnis
    // daraus. Eine geratene Zahl wäre hier schlimmer als keine: sie würde bei jedem
    // Selbständigen mit hoher Einzahlung still danebenliegen und sähe belegt aus.
    offen: 'Frankenwert des bundesrechtlichen 3a-Maximums 2026 für Unselbständige — nicht '
      + 'belegt (Fedlex antwortete auf eine erfundene ELI byte-identisch). Bis dahin wirkt '
      + 'der Deckel nicht; betroffen sind nur Einzahlungen ÜBER dem Maximum.',
    nichtAufgerechnet: () => 0,
  }),

  schwelleOhneSaeule2: Object.freeze({
    name: 'schwelleOhneSaeule2',
    kantone: 'AG',
    beleg: '§ 6 Abs. 5 KVGG (SAR 837.200) i. V. m. § 5 Abs. 1 V KVGG (SAR 837.211)',
    // 🛑 Die Regel ist belegt und rechenbar — was fehlt, ist die ANGABE, ob eine Säule 2
    // besteht. Die App führt `bvgInsurer`, `bvgContribution` und `bvgBalance`, aber leere
    // Felder heissen «nicht erfasst», nicht «keine Säule 2». Aus einem Nichtwissen in die
    // eine oder andere Richtung zu rechnen, wäre beides geraten.
    // Bis das entschieden ist, bleibt es beim bisherigen Verhalten (volle Zurechnung) —
    // ausdrücklich, nicht aus Versehen. Wirkung: bei Personen ohne Säule 2 fällt der
    // Anspruch bis zu 34 % zu tief aus (nachgerechnet 20.09.2026: Nettoerwerb 30'000,
    // 3a 6'000 → 1'017.50 statt 1'542.50).
    offen: 'Ob eine Säule 2 besteht, weiss die App nicht SICHER — leere BVG-Felder heissen '
      + '«nicht erfasst». Entscheid nötig: fragen, oder in AG eine Orientierung statt einer '
      + 'Zahl zeigen. Bis dahin volle Zurechnung wie bisher.',
    // Die Rechnung steht bereit, damit sie beim Entscheid nicht neu erfunden wird.
    schwelle: (f) => 0.1 * Number(f.monthlyIncome || 0) * 12,
    nichtAufgerechnet: () => 0,
  }),
});

// 🛑 SÄULE 3A — WARUM HIER NICHTS MEHR AUFGERECHNET WIRD (Befund Fachprüfung 20.09.2026)
//
// Bis zum 20.09.2026 stand hier `+ Number(f.pension3a || 0)`, mit dem Beleg, alle vier
// Erlasse rechneten die Säule 3a dem massgebenden Einkommen hinzu. Das stimmt — aber die
// Erlasse rechnen sie auf eine STEUERGRÖSSE auf, in der sie bereits abgezogen ist
// (ZH: Einkünfte − Abzüge · BE/SG: Reineinkommen · AG: steuerbares Einkommen). Die
// Aufrechnung macht dort nur den 3a-Abzug rückgängig.
//
// Die App hat diesen Abzug NIE gemacht. `monthlyIncome` ist laut eigener Feldhilfe
// «Netto ist was auf Ihrem Konto ankommt» (src/i18n/de.js) — das Geld, AUS dem die 3a
// überwiesen wird. Sie steckt also schon drin. Die App hatte damit bereits das Ergebnis
// der Aufrechnung und addierte sie ein ZWEITES Mal.
//
// Wirkung in allen vier Kantonen gleich: Einkommen zu hoch ⇒ Verbilligung ZU TIEF.
// Nachgerechnet am 20.09.2026 gegen die Rechenkerne, Alleinstehende ohne Kinder:
//   ZH Region 1, Basis 48'000:  3a  3'000 → 252.–/Jahr zu wenig · 12'000 → 1'008.–
//   AG,           Basis 30'000:  3a  3'000 → 525.–/Jahr zu wenig · 12'000 → Anspruch auf 0
//   SG Region 1,  Basis 30'000:  3a  3'000 → 630.60/Jahr zu wenig · 12'000 → Anspruch auf 0
//   BE ist eine Stufentabelle: ein Franken Differenz kostet dort eine ganze Stufe, bis 888.–
//
// 🛑 Eine zu tiefe Zahl ist NICHT die vorsichtige Seite. Sie hält Berechtigte vom Antrag ab —
// dieselbe Klasse Schaden wie eine zu hohe.
export function einkommenJahr(f, regel = SAEULE_3A.voll) {
  const roh = ['monthlyIncome', 'sideIncome', 'ahvRente', 'ivRente', 'bvgRente']
    .reduce((s, k) => s + Number(f[k] || 0), 0) * 12;
  // Die kantonale Regel wirkt jetzt als ABZUG, nicht als Zuschlag: im rohen Nettoeinkommen
  // ist die volle 3a enthalten, also muss weg, was der Kanton NICHT aufrechnen würde.
  return roh - regel.nichtAufgerechnet(f);
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
