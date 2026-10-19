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
//     Durchschnittsprämie. Eigenanteil 2026 dort noch 10.5 % / 8.4 % — massgebend ist aber
//     RRB Nr. 980/2026 (16.09.2026) Disp. IV: 11,0 % (Verheiratete) / 8,8 % (übrige), abgerufen 14.10.2026.
//   SVA Zürich, «Regionale Durchschnittsprämien», Tabelle 2026 (CHF pro Monat).
//   RRB Nr. 297/2025, Dispositiv I–IV: Vermögensgrenzen, massgebende Prämie 84 % der RDP,
//     Familiengrenze 70 500 (nur minderjährige Kinder), Abzugsquote 60 % darüber.
// Gegenprobe: alle 48 Einkommensgrenzen 2026 der SVA (nach RRB 980/2026) ergeben sich aus diesen
// Werten, exakt nach Abrunden des Nullpunkts auf CHF 10 (src/config/__tests__/ipvZuerich.test.js).
// Angezeigt wird trotzdem die publizierte Tabelle (IPV_ZH.grenzen, wörtlich von der SVA, abgerufen
// 14.10.2026), nie eine selbst gerechnete oder gerundete Zahl; die Formel bleibt für den Betrag.
// Für 2027 ebenso — dort stimmt die Formel nicht einmal so (IPV_ZH_2027.grenzen). 2027 ist eingetragen, rechnet aber erst, wenn
// die SVA definitive Durchschnittsprämien 2027 publiziert (Stand 19.10.2026: provisorisch; `rdpProvisorisch`).
import {
  vermoegenSumme, einkommenJahr, geburtsjahr, praemieJahr,
  jahrVorbei, mehrereErwachsene, praemieFehlt, ERWACHSEN, SAEULE_3A,
  kinderAlter, ALTER_UNERFASST, UEBER_18, regionAusPLZ, deckelnProPerson,
  ergebnisOhneAnspruch, ergebnisMitAnspruch,
} from './kantonsModell.js';

export const IPV_ZH = {
  jahr: 2026,
  referenz: 0.7,
  // Eigenanteil 2026: RRB Nr. 980/2026 vom 16.09.2026, Disp. IV — nachträglich erhöht auf 11,0 % /
  // 8,8 % (vorher 10,5 % / 8,4 % nach RRB 947/2025); gilt bei der definitiven Berechnung.
  satz: { verheiratet: 0.110, uebrige: 0.088 },
  // e = Erwachsene ab 26, j = junge Erwachsene 19–25, k = Kinder 0–18
  rdp: { 1: { e: 640, j: 459, k: 154 }, 2: { e: 584, j: 420, k: 140 }, 3: { e: 544, j: 389, k: 130 } },
  massgebend: 0.84,
  mindestKind: 0.8,
  familienGrenze: 70500,
  abzugsquote: 0.6,
  vermoegen: { grenze: [150000, 300000], freibetrag: [75000, 150000], anteil: 0.1 },
  // SVA Zürich, «Einkommensgrenzen 2026», wörtlich (abgerufen 14.10.2026, nach RRB 980/2026). Angezeigt wird
  // diese Zahl; sie ist der auf CHF 10 abgerundete Nullpunkt der Formel (Wächter im Test).
  // e = Erwachsene (älter 25), j = junge Erwachsene (18–25); Spalten: keine Kinder / 1 / 2 / 3 Kinder.
  grenzen: {
    einzel: {
      1: { j: [43810, 70500, 73210, 87910], e: [61090, 75790, 90490, 105190] },
      2: { j: [40090, 70500, 70500, 80180], e: [55740, 70500, 82470, 95830] },
      3: { j: [37130, 70500, 70500, 74350], e: [51920, 70500, 76740, 89150] },
    },
    verheiratet: {
      1: { j: [70100, 81860, 93620, 105380], e: [97740, 109500, 121260, 133020] },
      2: { j: [64140, 74830, 85520, 96210], e: [89190, 99880, 110570, 121260] },
      3: { j: [59410, 70500, 79260, 89190], e: [83080, 93010, 102930, 112860] },
    },
  },
};

// Anspruchsjahr 2027 — eingetragen, rechnet aber NOCH NICHT (Stand 19.10.2026, Entscheid
// Stebler Studios 19.10.2026: «Eintragen, Riegel zu»). Alles hier ist an der Quelle gelesen.
// Wortlaute und Abrufdaten: docs/sources/ipv-kantone-2026.md, Abschnitt ZH, «Vorbereitung 2027
// (28.09.2026)» und «Nachtrag 19.10.2026».
//   satz       RRB Nr. 980/2026 vom 16.09.2026, Disp. I (abgerufen 19.10.2026): «Die
//              Eigenanteilssätze zur Festlegung der Prämienverbilligung 2027 werden mit einer
//              Referenzprämie von 70% … sowie unter Vorbehalt einer späteren Anpassung gemäss § 3
//              Abs. 2 Satz 2 EG KVG wie folgt festgelegt: a. … 11,8%. b. … 9,4%.» Beschlossen,
//              mit Vorbehalt — der Satz hält den Riegel nicht mehr (bis 19.10.: `satzProvisorisch`,
//              Grundlage war RRB 303/2026 Disp. VI; der Nachtrag 14.10. hatte RRB 980 nur bis
//              Disp. IV gelesen). Der Vorbehalt ist nicht bloss formal: derselbe RRB hebt in
//              Disp. IV den Satz 2026 nachträglich an.
//   referenz   RRB 980/2026 Disp. I: «Referenzprämie von 70% gemäss § 4 Abs. 2 Satz 2 EG KVG».
//   rdp        SVA Zürich «Regionale Durchschnittsprämien» (Seite unter «Ergänzungsleistungen»; die
//              Höhe «legt das Eidgenössische Departement des Innern (EDI) … fest»), Tabelle «2027
//              (provisorisch)», CHF pro Monat, wörtlich (abgerufen 19.10.2026). PROVISORISCH — darum
//              `rdpProvisorisch`. Dass die IPV mit genau dieser EL-Tabelle rechnet, ist amtlich nicht
//              bestätigt (2026 nur durch Nachrechnen gestützt; Quellenblatt «Offen / nicht gefunden»).
//   massgebend RRB 303/2026 Disp. II: 83 % der regionalen Durchschnittsprämien 2027 (2026: 84 %).
//   familienGrenze, abzugsquote  RRB 303/2026 Disp. III.1 (71 200) und Disp. IV (60 %).
//   vermoegen  RRB 303/2026 Disp. I: dieselben Obergrenzen wie 2026. Freibeträge und 10 %-Anteil:
//              SVA «Leistung» (ohne Jahresangabe, unverändert gegenüber 2026).
//   grenzen    SVA «Einkommensgrenzen 2027», wörtlich. Sie sind NICHT exakt «Summe ÷ Satz»
//              (siehe Quellenblatt) — darum zeigt die App für 2027 die publizierte Zahl, nie
//              eine selbst gerechnete. e = Erwachsene (älter 25), j = junge Erwachsene (18–25);
//              Spalten: keine Kinder / 1 / 2 / 3 Kinder.
export const IPV_ZH_2027 = {
  jahr: 2027,
  referenz: 0.7,
  // Riegel 2027. Solange das hier `true` steht, rechnet 2027 nicht — obwohl Satz, Referenz und
  // Durchschnittsprämien eingetragen sind. Grund: die SVA führt die Durchschnittsprämien 2027 als
  // «provisorisch», und ihre eigenen Einkommensgrenzen 2027 (`grenzen` unten) passen rechnerisch
  // NICHT zu diesen Werten, sondern zu tieferen: Region 1, Einzel, Erwachsene ohne Kinder
  // 0,7 × 665 × 12 ÷ 0,094 = 59 425.53 → SVA 59 420; mit 672 wären es 60 051.06. Ebenso Region 2/3
  // (≈ 607 / 566) und junge Erwachsene (≈ 477 / 437 / 405 statt 481 / 441 / 409). Das ist eine
  // Beobachtung, kein Befund über die SVA — offene Frage in docs/sources/FRAGEN-AN-DIE-AEMTER.md.
  // Erst auf `false` setzen, wenn (a) die Tabelle 2027 nicht mehr «provisorisch» heisst,
  // (b) Durchschnittsprämien und Grenzen zusammenpassen oder die SVA geantwortet hat und (c) die
  // Identität IPV-Durchschnittsprämie = EL-Tabelle geklärt ist — dann wörtlich neu abgleichen.
  // Ein Test-Wächter schlägt an, wenn der Riegel offen ist und (b) nicht gilt.
  rdpProvisorisch: true,
  satz: { verheiratet: 0.118, uebrige: 0.094 },
  // e = Erwachsene ab 26, j = junge Erwachsene 19–25, k = Kinder 0–18 (SVA/EDI, 2027 provisorisch)
  rdp: { 1: { e: 672, j: 481, k: 163 }, 2: { e: 614, j: 441, k: 148 }, 3: { e: 574, j: 409, k: 138 } },
  massgebend: 0.83,
  mindestKind: 0.8,
  familienGrenze: 71200,
  abzugsquote: 0.6,
  vermoegen: { grenze: [150000, 300000], freibetrag: [75000, 150000], anteil: 0.1 },
  grenzen: {
    einzel: {
      1: { j: [42620, 71200, 71210, 85500], e: [59420, 73700, 88000, 102300] },
      2: { j: [39045, 71200, 71200, 78170], e: [54235, 71200, 80315, 93360] },
      3: { j: [36185, 71200, 71200, 72630], e: [50570, 71200, 74860, 86990] },
    },
    verheiratet: {
      1: { j: [67900, 78280, 90670, 102050], e: [94670, 106040, 117420, 128820] },
      2: { j: [62205, 72590, 82980, 93360], e: [86410, 96790, 107180, 117600] },
      3: { j: [57650, 71200, 77000, 86680], e: [80575, 90240, 99920, 109600] },
    },
  },
};

// Werte je Anspruchsjahr. Gewählt wird nach dem Kalenderjahr (die App zeigt immer das
// laufende Anspruchsjahr). Fehlt ein Jahr oder ist es unvollständig, rechnet die App nicht —
// das ist der Jahres-Riegel, jetzt je Jahr statt fest an 2026.
export const IPV_ZH_JAHRE = { 2026: IPV_ZH, 2027: IPV_ZH_2027 };

export function zhWerte(jahr = new Date().getFullYear()) {
  const w = IPV_ZH_JAHRE[jahr];
  return w && w.referenz != null && w.rdp != null && !w.rdpProvisorisch ? w : null;
}

// BAG-Prämienregionen ZH (Stand 2026, wie src/data/praemienRegionen.js; Guard-Test hält beide
// gleich): Region 1 = Stadt Zürich, Region 2 = diese BFS-Nummern, alle übrigen ZH-Gemeinden Region 3.
const REGION_2 = [54, 62, 66, 69, 96, 97, 131, 135, 138, 141, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 230, 243, 247, 250, 293, 295];
export function zhRegion(bfsNr) {
  const n = Number(bfsNr);
  return n === 261 ? 1 : REGION_2.includes(n) ? 2 : 3;
}

// Reine Rechnung. personen: Kategorien je Person ('e' | 'j' | 'k'); me: massgebendes Einkommen/Jahr.
// Liefert Jahresbeträge in CHF (ungerundet), die Einkommensgrenze wie die SVA sie publiziert (Tabellenzahl,
// wo der Datensatz eine hat; sonst Nullpunkt der Formel, mit minderjährigen Kindern mindestens die Familiengrenze) und
// `unklar`, wenn das Ergebnis vom Abbau des Kinder-Mindestanspruchs über der Familiengrenze
// abhängt: RRB 297/2025 Disp. IV lässt offen, ob die 60 % je Kind oder je Familie abgezogen
// werden — dann rechnet die App bewusst nicht.
// Tabellenzelle der SVA, sofern das Jahr eine hat und der Haushalt darin vorkommt (0–3 Kinder,
// alle Erwachsenen derselben Altersgruppe). Sonst null → Nullpunkt der Formel wie 2026.
function publizierteGrenze(p, { region, verheiratet, personen, kinder }) {
  const erw = personen.filter((c) => c !== 'k');
  if (!p.grenzen || kinder > 3 || !erw.every((c) => c === erw[0])) return null;
  return p.grenzen[verheiratet ? 'verheiratet' : 'einzel']?.[region]?.[erw[0]]?.[kinder] ?? null;
}

// `werte`: Datensatz des Anspruchsjahres (Vorgabe 2026). Hat er eine publizierte Grenzentabelle
// (ab 2027), ist `grenze` die Tabellenzahl — die Formel trifft sie dort nicht exakt.
export function ipvZuerichRechnen({ region, verheiratet, personen, me, werte = IPV_ZH }) {
  const p = werte;
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
    grenze: publizierteGrenze(p, { region, verheiratet, personen, kinder })
      ?? Math.round(Math.max(summe / satz, kinder ? p.familienGrenze : 0)),
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
//   Näherung: massgebendes Einkommen = Hauptlohn × 12 (× 13 mit 13. Monatslohn), Neben- und Renteneinkommen × 12. Die
//   Säule-3a-Einzahlung ist darin bereits enthalten (das Nettoeinkommen ist das Geld, aus
//   dem sie überwiesen wird) — genau das verlangt § 5 Abs. 1 lit. b EG KVG, der sie einer
//   Steuergrösse zurechnet, in der sie abgezogen wäre. Amtlich zählen die Steuerfaktoren; es
//   fehlen also die amtlichen Abzüge (Berufsauslagen, Versicherungs- und Sozialabzüge), und
//   das Vermögen ist hier nur die Summe der erfassten Werte, nicht das steuerbare
//   Gesamtvermögen inkl. Liegenschaft und abzüglich Schulden (Fachprüfung 20.09.2026).
export function ipvZuerich(data, hh, ipvData, youngAdultsCount, orientierung, lookupPLZ) {
  const b = data.basis || {};
  const f = data.finanzen || {};
  // Anspruchsjahr = laufendes Kalenderjahr. Werte je Jahr aus IPV_ZH_JAHRE; fehlt das Jahr
  // oder ist es nicht freigegeben (2027: Durchschnittsprämien nur provisorisch publiziert,
  // `rdpProvisorisch`), bleibt der Jahres-Riegel zu — dieselbe Orientierung wie bisher ab 01.01.2027.
  const werte = zhWerte();
  if (!werte) return orientierung('jahr');
  const jahr = werte.jahr;
  // § 8 EG KVG: «Richten sich die Prämienverbilligungsbeiträge nach dem Alter der
  // anspruchsberechtigten Person, ist für das ganze Jahr das Alter am Ende des Vorjahres
  // massgebend.» Für das Anspruchsjahr 2026 zählt also das Alter am 31.12.2025 — darum
  // `jahr - 1`. (Befund Fachprüfung 20.09.2026: vorher wurde das Alter IM Anspruchsjahr
  // gerechnet, ein Jahr zu viel. Das machte aus 25-Jährigen Erwachsene und zeigte einen
  // Betrag, wo nach den Grenzen für junge Erwachsene keiner besteht.)
  const stichjahr = jahr - 1;
  // Die Riegel bis zur Prämie stehen im gemeinsamen Rahmen (config/kantonsModell.js) —
  // Reihenfolge und Gründe bleiben hier sichtbar, die Regeln selbst sind dort einmal belegt.
  // Eigenanteil und Durchschnittsprämien ändern jährlich; die Auswahl oben nimmt den Datensatz
  // des laufenden Jahres. Dieser Riegel bleibt als zweite Sicherung stehen, falls je ein
  // Datensatz eines vergangenen Jahres hereingereicht wird.
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
  // Altersgruppe der Prämie (Kind / junge Erwachsene) nach KVG Art. 16a Abs. 1 und KVV Art. 91
  // Abs. 3: das Alter am 31.12. DES ANSPRUCHSJAHRS, also der Jahrgang — so teilt auch die SVA
  // ein («Junge Erwachsene (Jahrgang 2001 bis 2007)» für 2026). Mit dem Alter am Ende des
  // Vorjahres (oben) galt Jahrgang 2007 im Jahr 2026 noch als Kind und bekam Kinder-
  // Durchschnittsprämie, Kinder-Mindestanspruch und die Familiengrenze für «ausschliesslich
  // minderjährige Kinder» — ein Betrag auf der falschen Gruppe (Fachprüfung 28.09.2026). Darum
  // hier zusätzlich: wird ein Kind im Anspruchsjahr 19, keine Zahl. Eingetippt (undatiert) +1,
  // die vorsichtige Seite wie in BE. Ob § 8 EG KVG die Prämien-Altersgruppe meint, ist eine
  // offene Frage an die SVA; bis dahin gilt die Seite, die keinen falschen Betrag zeigt.
  if (UEBER_18(kinderAlter(hh.children, jahr, 1))) return orientierung('haushalt');

  const { region } = regionAusPLZ({ data, kanton: 'ZH', lookupPLZ, regionFn: zhRegion });
  if (!region) return orientierung('region');

  const gruppe = kinder.length > 0 ? 1 : 0;
  const vermoegen = vermoegenSumme(f);
  if (vermoegen > werte.vermoegen.grenze[gruppe]) return orientierung('vermoegen');
  // § 5 Abs. 1 lit. b EG KVG: Beiträge an die gebundene Selbstvorsorge (Säule 3a) werden dem
  // massgebenden Einkommen HINZUGERECHNET — unbedingt, ohne Schwelle und ohne Deckel.
  // Die Zurechnung erfolgt auf «Einkünfte − Abzüge», wo die 3a bereits abgezogen ist; das
  // Nettoeinkommen der App trägt sie schon, darum Regel `voll` = kein weiterer Zuschlag.
  // (Befund Fachprüfung 20.09.2026, korrigiert am selben Tag: vorher wurde sie ein zweites
  // Mal addiert — 252.–/Jahr zu wenig bei 3'000 Einzahlung, 1'008.– bei 12'000.)
  const me = einkommenJahr(f, SAEULE_3A.voll)
    + werte.vermoegen.anteil * Math.max(0, vermoegen - werte.vermoegen.freibetrag[gruppe]);

  const r = ipvZuerichRechnen({ region, verheiratet: false, personen: ['e', ...kinder.map(() => 'k')], me, werte });
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
