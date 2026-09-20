// Prämienverbilligung (IPV) Kanton Zürich — amtliches Eigenanteilsmodell, Jahr 2026 (K31).
// Nur ZH rechnet hiermit; alle anderen Kantone bleiben in calculateIPV unverändert.
// Belege (abgerufen 19.09.2026), Wortlaute in docs/sources/ipv-kantone-2026.md, Abschnitt ZH:
//   EG KVG (LS 832.01) § 3 Abs. 1: «Der Kanton übernimmt die Krankenkassenprämie einer
//     anspruchsberechtigten Person, soweit ihre Referenzprämie einen bestimmten Prozentsatz
//     ihres massgebenden Einkommens (Eigenanteil) übersteigt.»
//   § 4 Abs. 3: Bruttoprämie tiefer als Referenzprämie → «höchstens die Bruttoprämie».
//   § 6 Abs. 3/4: Referenzprämien der Gruppe zusammengezählt, Verbilligung nach ihrer Höhe verteilt.
//   § 7 Abs. 1: Mindestanspruch (Art. 65 Abs. 1bis KVG) nicht eingehalten → Anteil erhöht.
//   SVA Zürich, «Prämienverbilligung: Leistung»: Referenzprämie 2026 = 70 % der regionalen
//     Durchschnittsprämie; Eigenanteil 2026 10.5 % (Verheiratete) / 8.4 % (übrige).
//   SVA Zürich, «Regionale Durchschnittsprämien», Tabelle 2026 (CHF pro Monat).
//   RRB Nr. 297/2025, Dispositiv I–IV: Vermögensgrenzen, massgebende Prämie 84 % der RDP,
//     Familiengrenze 70 500 (nur minderjährige Kinder), Abzugsquote 60 % darüber.
// Gegenprobe: alle 36 Einkommensgrenzen 2026 der SVA ergeben sich exakt aus diesen Werten
// (src/config/__tests__/ipvZuerich.test.js).
import {
  vermoegenSumme, einkommenJahr, geburtsjahr, praemieJahr,
  jahrVorbei, mehrereErwachsene, praemieFehlt, ERWACHSEN, SAEULE_3A,
  kinderAlter, ALTER_UNERFASST, UEBER_18, regionAusPLZ, deckelnProPerson,
  ergebnisOhneAnspruch, ergebnisMitAnspruch,
} from './kantonsModell.js';

export const IPV_ZH = {
  jahr: 2026,
  referenz: 0.7,
  satz: { verheiratet: 0.105, uebrige: 0.084 },
  // e = Erwachsene ab 26, j = junge Erwachsene 19–25, k = Kinder 0–18
  rdp: { 1: { e: 640, j: 459, k: 154 }, 2: { e: 584, j: 420, k: 140 }, 3: { e: 544, j: 389, k: 130 } },
  massgebend: 0.84,
  mindestKind: 0.8,
  familienGrenze: 70500,
  abzugsquote: 0.6,
  vermoegen: { grenze: [150000, 300000], freibetrag: [75000, 150000], anteil: 0.1 },
};

// BAG-Prämienregionen ZH (Stand 2026, wie src/data/praemienRegionen.js; Guard-Test hält beide
// gleich): Region 1 = Stadt Zürich, Region 2 = diese BFS-Nummern, alle übrigen ZH-Gemeinden Region 3.
const REGION_2 = [54, 62, 66, 69, 96, 97, 131, 135, 138, 141, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 230, 243, 247, 250, 293, 295];
export function zhRegion(bfsNr) {
  const n = Number(bfsNr);
  return n === 261 ? 1 : REGION_2.includes(n) ? 2 : 3;
}

// Reine Rechnung. personen: Kategorien je Person ('e' | 'j' | 'k'); me: massgebendes Einkommen/Jahr.
// Liefert Jahresbeträge in CHF (ungerundet), die Einkommensgrenze wie in der SVA-Tabelle
// (Nullpunkt der Formel, mit minderjährigen Kindern mindestens die Familiengrenze) und
// `unklar`, wenn das Ergebnis vom Abbau des Kinder-Mindestanspruchs über der Familiengrenze
// abhängt: RRB 297/2025 Disp. IV lässt offen, ob die 60 % je Kind oder je Familie abgezogen
// werden — dann rechnet die App bewusst nicht.
export function ipvZuerichRechnen({ region, verheiratet, personen, me }) {
  const p = IPV_ZH;
  const rdp = p.rdp[region];
  const satz = verheiratet ? p.satz.verheiratet : p.satz.uebrige;
  const refs = personen.map((c) => p.referenz * rdp[c] * 12);
  const summe = refs.reduce((a, b) => a + b, 0);
  // me nie negativ: sonst wüchse die Verbilligung über die Summe der Referenzprämien hinaus,
  // was § 3 Abs. 1 EG KVG nicht zulässt («soweit die Referenzprämie … übersteigt»).
  const me0 = Math.max(0, me);
  const basis = Math.max(0, summe - satz * me0);
  const kinder = personen.filter((c) => c === 'k').length;
  const mindest = p.mindestKind * p.massgebend * rdp.k * 12;
  const bindet = personen.some((c, i) => c === 'k' && basis * refs[i] / summe < mindest);
  let total = 0;
  // Der Anteil der erwachsenen Person getrennt mitgeführt: nur IHRE Prämie kennt die App,
  // also darf auch nur ihr Anteil gedeckelt werden (§ 4 Abs. 3 EG KVG bindet pro Person).
  // Ohne diese Trennung bliebe nur die Wahl zwischen «alles deckeln» (zu wenig, weil die
  // Kinderanteile an einer fremden Prämie gemessen würden) und «gar nicht deckeln».
  let erwachseneTotal = 0;
  personen.forEach((c, i) => {
    const anteil = basis * refs[i] / summe;
    const wert = c === 'k' && me0 <= p.familienGrenze ? Math.max(anteil, mindest) : anteil;
    total += wert;
    if (c === 'e') erwachseneTotal += wert;
  });
  return {
    total,
    erwachseneTotal,
    maximal: summe,
    // Obergrenze desselben Anteils — die Referenzprämien der erwachsenen Personen.
    erwachseneMaximal: personen.reduce((s, c, i) => (c === 'e' ? s + refs[i] : s), 0),
    grenze: Math.round(Math.max(summe / satz, kinder ? p.familienGrenze : 0)),
    unklar: kinder > 0 && bindet && me0 > p.familienGrenze && me0 < p.familienGrenze + (kinder * mindest) / p.abzugsquote,
  };
}

// Aufruf aus calculateIPV (config/cantonalData.js) für ZH mit Beleg. Die App rechnet
// nur, wo ihre Angaben dafür reichen; sonst dieselbe Orientierung wie ein unbelegter Kanton,
// mit Grund in `offen`. Bewusst NICHT gerechnet (noch keine Angabe in der App):
//   Paare/mehrere Erwachsene (Alter des Partners fehlt; Konkubinat = getrennte Rechnung),
//   verheiratet ohne Partner im Haushalt, eigenes Alter unbekannt oder unter 26
//   (junge Erwachsene in Ausbildung rechnen mit den Eltern), Kinder ab 19, Vermögen über
//   der Grenze, Gemeinde nicht eindeutig, Anspruchsjahr vorbei.
//   Näherung: massgebendes Einkommen = Erwerbs-, Neben- und Renteneinkommen × 12. Die
//   Säule-3a-Einzahlung ist darin bereits enthalten (das Nettoeinkommen ist das Geld, aus
//   dem sie überwiesen wird) — genau das verlangt § 5 Abs. 1 lit. b EG KVG, der sie einer
//   Steuergrösse zurechnet, in der sie abgezogen wäre. Amtlich zählen die Steuerfaktoren; es
//   fehlen also die amtlichen Abzüge (Berufsauslagen, Versicherungs- und Sozialabzüge), und
//   das Vermögen ist hier nur die Summe der erfassten Werte, nicht das steuerbare
//   Gesamtvermögen inkl. Liegenschaft und abzüglich Schulden (Fachprüfung 20.09.2026).
export function ipvZuerich(data, hh, ipvData, youngAdultsCount, orientierung, lookupPLZ) {
  const b = data.basis || {};
  const f = data.finanzen || {};
  const jahr = IPV_ZH.jahr;
  // § 8 EG KVG: «Richten sich die Prämienverbilligungsbeiträge nach dem Alter der
  // anspruchsberechtigten Person, ist für das ganze Jahr das Alter am Ende des Vorjahres
  // massgebend.» Für das Anspruchsjahr 2026 zählt also das Alter am 31.12.2025 — darum
  // `jahr - 1`. (Befund Fachprüfung 20.09.2026: vorher wurde das Alter IM Anspruchsjahr
  // gerechnet, ein Jahr zu viel. Das machte aus 25-Jährigen Erwachsene und zeigte einen
  // Betrag, wo nach den Grenzen für junge Erwachsene keiner besteht.)
  const stichjahr = jahr - 1;
  // Die Riegel bis zur Prämie stehen im gemeinsamen Rahmen (config/kantonsModell.js) —
  // Reihenfolge und Gründe bleiben hier sichtbar, die Regeln selbst sind dort einmal belegt.
  // Eigenanteil und Durchschnittsprämien ändern jährlich (2027: 9,4/11,8 % statt 8,4/10,5 %).
  if (jahrVorbei(jahr)) return orientierung('jahr');
  const geburt = geburtsjahr(b);
  if (mehrereErwachsene(hh, b)) return orientierung('haushalt');
  if (!geburt || !ERWACHSEN.abEndeVorjahr(jahr, geburt)) return orientierung('alter');
  // Bezugsjahr ist das Vorjahr, darum beim eingetippten Alter KEIN Zuschlag: es ist nicht
  // datiert, und für Kinder wirkt das Alter nur an der Grenze 18. Unverändert genommen hält
  // es dort die vorsichtigere Seite (eine 19-jährige Person bleibt aussen vor).
  const kinder = kinderAlter(hh.children, stichjahr, 0);
  if (ALTER_UNERFASST(kinder)) return orientierung('alter');
  if (UEBER_18(kinder)) return orientierung('haushalt');

  const { region } = regionAusPLZ({ data, kanton: 'ZH', lookupPLZ, regionFn: zhRegion });
  if (!region) return orientierung('region');

  const gruppe = kinder.length > 0 ? 1 : 0;
  const vermoegen = vermoegenSumme(f);
  if (vermoegen > IPV_ZH.vermoegen.grenze[gruppe]) return orientierung('vermoegen');
  // § 5 Abs. 1 lit. b EG KVG: Beiträge an die gebundene Selbstvorsorge (Säule 3a) werden dem
  // massgebenden Einkommen HINZUGERECHNET — unbedingt, ohne Schwelle und ohne Deckel.
  // Die Zurechnung erfolgt auf «Einkünfte − Abzüge», wo die 3a bereits abgezogen ist; das
  // Nettoeinkommen der App trägt sie schon, darum Regel `voll` = kein weiterer Zuschlag.
  // (Befund Fachprüfung 20.09.2026, korrigiert am selben Tag: vorher wurde sie ein zweites
  // Mal addiert — 252.–/Jahr zu wenig bei 3'000 Einzahlung, 1'008.– bei 12'000.)
  const me = einkommenJahr(f, SAEULE_3A.voll)
    + IPV_ZH.vermoegen.anteil * Math.max(0, vermoegen - IPV_ZH.vermoegen.freibetrag[gruppe]);

  const r = ipvZuerichRechnen({ region, verheiratet: false, personen: ['e', ...kinder.map(() => 'k')], me });
  if (r.unklar) return orientierung('mindestanspruch');
  // § 4 Abs. 3 EG KVG: höchstens die Bruttoprämie — nur bei einer Person ist die erfasste Prämie ihre eigene.
  const praemie = praemieJahr(data);
  if (praemieFehlt(praemie)) return orientierung('praemie');
  // 🛑 Hier stand bis 20.09.2026: `const deckel = !gruppe ? praemie : Infinity;` — mit Kindern
  // fiel der Deckel GANZ weg, also auch für den Anteil der erwachsenen Person. Der Kommentar
  // daneben begründete das mit «anders als BE und VD»; genau dieser Kontrast stimmte da schon
  // nicht mehr: BE und VD waren am selben Tag auf `deckelnProPerson` umgestellt worden, ZH
  // wurde dabei übersehen. Eine Begründung, die sich auf einen überholten Vergleich stützt,
  // liest sich wie ein Entscheid und war doch nur ein Rückstand.
  // Richtig ist die Trennung: der Anteil der erwachsenen Person wird auf ihre eigene
  // Bruttoprämie gedeckelt (§ 4 Abs. 3 EG KVG bindet pro Person), der Kinderanteil bleibt
  // ungedeckelt, weil die App die Kinderprämien nicht kennt.
  // Ohne Kinder ist `erwachseneTotal === total`, das Ergebnis bleibt also unverändert.
  const annual = deckelnProPerson(r.total, r.erwachseneTotal, praemie);
  const maxAnnual = deckelnProPerson(r.maximal, r.erwachseneMaximal, praemie);
  const gemeinsam = {
    canton: 'ZH', cantonData: { ...ipvData, maxIncome: r.grenze }, jahr,
    vorbehaltKey: 'ipv.vorbehalt', extra: { region },
  };
  if (annual <= 0) {
    return ergebnisOhneAnspruch({ ...gemeinsam, noteKey: 'ipv.incomeAboveLimit', noteParams: { value: r.grenze } });
  }
  return ergebnisMitAnspruch({
    ...gemeinsam, annual, maxAnnual, youngAdultsCount,
    noteKey: ipvData.noteKey, noteParams: ipvData.noteParams || {},
  });
}
