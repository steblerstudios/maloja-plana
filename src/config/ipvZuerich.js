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
  const basis = Math.max(0, summe - satz * me);
  const kinder = personen.filter((c) => c === 'k').length;
  const mindest = p.mindestKind * p.massgebend * rdp.k * 12;
  const bindet = personen.some((c, i) => c === 'k' && basis * refs[i] / summe < mindest);
  let total = 0;
  personen.forEach((c, i) => {
    const anteil = basis * refs[i] / summe;
    total += c === 'k' && me <= p.familienGrenze ? Math.max(anteil, mindest) : anteil;
  });
  return {
    total,
    maximal: summe,
    grenze: Math.round(Math.max(summe / satz, kinder ? p.familienGrenze : 0)),
    unklar: kinder > 0 && bindet && me > p.familienGrenze && me < p.familienGrenze + (kinder * mindest) / p.abzugsquote,
  };
}

// Aufruf aus calculateIPV (config/cantonalData.js) für ZH mit Beleg. Die App rechnet
// nur, wo ihre Angaben dafür reichen; sonst dieselbe Orientierung wie ein unbelegter Kanton,
// mit Grund in `offen`. Bewusst NICHT gerechnet (noch keine Angabe in der App):
//   Paare/mehrere Erwachsene (Alter des Partners fehlt; Konkubinat = getrennte Rechnung),
//   verheiratet ohne Partner im Haushalt, eigenes Alter unbekannt oder unter 26
//   (junge Erwachsene in Ausbildung rechnen mit den Eltern), Kinder ab 19, Vermögen über
//   der Grenze, Gemeinde nicht eindeutig. Näherung: massgebendes Einkommen = Erwerbs-,
//   Neben- und Renteneinkommen × 12 (amtlich aus der Steuererklärung).
export function ipvZuerich(data, hh, ipvData, youngAdultsCount, orientierung, lookupPLZ) {
  const b = data.basis || {};
  const f = data.finanzen || {};
  const jahr = IPV_ZH.jahr;
  const geburt = /^\d{4}-/.test(b.dateOfBirth || '') ? Number(b.dateOfBirth.slice(0, 4)) : null;
  if (hh.adults !== 1 || b.maritalStatus === 'married') return orientierung('haushalt');
  if (!geburt || jahr - geburt < 26) return orientierung('alter');
  const kinder = hh.children.map((c) => (/^\d{4}-/.test(c.birthDate || '') ? jahr - Number(c.birthDate.slice(0, 4)) : Number(c.age) || 0));
  if (kinder.some((a) => a > 18)) return orientierung('haushalt');

  const plz = String(data.wohnen?.postalCode || '').trim();
  const orte = plz ? lookupPLZ(plz).filter((g) => g.kanton === 'ZH') : [];
  const stadt = String(data.wohnen?.city || '').trim().toLowerCase();
  const ort = orte.length === 1 ? orte[0] : orte.find((g) => g.gemeinde.toLowerCase() === stadt);
  const regionen = new Set(orte.map((g) => zhRegion(g.bfsNr)));
  const region = ort ? zhRegion(ort.bfsNr) : regionen.size === 1 ? [...regionen][0] : null;
  if (!region) return orientierung('region');

  const gruppe = kinder.length > 0 ? 1 : 0;
  const vermoegen = Number(f.securitiesValue || 0) + Number(f.otherAssets || 0) + Number(f.savingsAccount || 0);
  if (vermoegen > IPV_ZH.vermoegen.grenze[gruppe]) return orientierung('vermoegen');
  const me = ['monthlyIncome', 'sideIncome', 'ahvRente', 'ivRente', 'bvgRente'].reduce((s, k) => s + Number(f[k] || 0), 0) * 12
    + IPV_ZH.vermoegen.anteil * Math.max(0, vermoegen - IPV_ZH.vermoegen.freibetrag[gruppe]);

  const r = ipvZuerichRechnen({ region, verheiratet: false, personen: ['e', ...kinder.map(() => 'k')], me });
  if (r.unklar) return orientierung('mindestanspruch');
  // § 4 Abs. 3 EG KVG: höchstens die Bruttoprämie — nur bei einer Person ist die erfasste Prämie ihre eigene.
  const praemie = Number(data.versicherungen?.kkPremium) * 12;
  const deckel = !gruppe && praemie > 0 ? praemie : Infinity;
  const annual = Math.round(Math.min(r.total, deckel));
  const maxAnnual = Math.round(Math.min(r.maximal, deckel));
  const cantonData = { ...ipvData, maxIncome: r.grenze };
  if (annual <= 0) {
    return { belegt: true, eligible: false, amount: 0, noteKey: 'ipv.incomeAboveLimit', noteParams: { value: r.grenze }, canton: 'ZH', cantonData, region, jahr };
  }
  return {
    eligible: true, belegt: true, anspruchMoeglich: true,
    amount: Math.round(annual / 12), annual, maxAnnual,
    reductionPercent: Math.round((annual / maxAnnual) * 100),
    noteKey: ipvData.noteKey, noteParams: ipvData.noteParams || {},
    youngAdultsCount, canton: 'ZH', cantonData, region, jahr,
  };
}
