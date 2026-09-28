// «Lohnt sich meine Karte?» — Rechnung pro Kreditkarte (Wunsch Stebler Studios, Skizze 27.09.2026).
//
// Rechnet NUR mit den eigenen Angaben: was man ausgibt, was die Karte kostet, was sie bringt.
// Keine Fachdaten, keine üblichen Gebühren, keine Kartenempfehlung — darum auch keine Quelle nötig.
// Ergebnis ist eine Einschätzung in Franken pro Jahr.
//
// Versicherungen zählen nur, wenn man sie sonst selbst kaufen würde. Wer sie schon anderswo hat
// oder nicht braucht, bekommt durch die Karte nichts dazu — sonst sähe jede teure Karte gut aus.

// Reihenfolge = Reihenfolge auf dem Bildschirm.
export const VORTEILE = [
  { key: 'punkte', versicherung: false },
  { key: 'rabatte', versicherung: false },
  { key: 'lounge', versicherung: false },
  { key: 'reiseversicherung', versicherung: true },
  { key: 'annullierung', versicherung: true },
  { key: 'kaufschutz', versicherung: true },
  { key: 'mietwagen', versicherung: true },
];
export const VERSICHERUNGEN = VORTEILE.filter((v) => v.versicherung).map((v) => v.key);

// Status einer Versicherung auf der Karte. Nur «braucheIch» zählt.
export const VERSICHERUNG_STATUS = ['anderswo', 'unnoetig', 'braucheIch'];

// Innerhalb dieser Spanne heisst es «geht etwa auf» — eine Darstellungswahl, keine Fachgrenze:
// ein paar Franken im Jahr sind bei geschätzten Eingaben kein Unterschied.
export const SPANNE_AUSGEGLICHEN = 10;

// Liest «1'200», «1,5», «  30 » — alles andere (Text, negativ, leer) ergibt 0.
const lies = (v) => {
  if (v === null || v === undefined) return 0;
  const x = Number(String(v).replace(/['’\s]/g, '').replace(',', '.'));
  return Number.isFinite(x) && x > 0 ? x : 0;
};
const prozent = (v) => Math.min(lies(v), 100);
const rappen = (x) => Math.round(x * 100) / 100;

export function karteRechnen(karte) {
  const k = karte || {};
  const ausgabenMonat = lies(k.ausgabenMonat);
  const jahresAusgaben = rappen(ausgabenMonat * 12);
  const gebuehr = lies(k.jahresgebuehr);
  const zinsen = lies(k.zinsenJahr);
  const cashback = rappen(jahresAusgaben * prozent(k.cashback) / 100);
  const fremdKosten = rappen(jahresAusgaben * prozent(k.fremdAnteil) / 100 * prozent(k.fremdGebuehr) / 100);

  let vorteile = 0;
  const nichtGezaehlt = [];
  const vs = k.vorteile || {};
  for (const { key, versicherung } of VORTEILE) {
    const v = vs[key];
    if (!v || !v.an) continue;
    if (versicherung && v.status !== 'braucheIch') {
      nichtGezaehlt.push({ key, status: v.status || 'offen' });
      continue;
    }
    vorteile += lies(v.wert);
  }
  vorteile = rappen(vorteile);

  const kosten = rappen(gebuehr + fremdKosten + zinsen);
  const netto = rappen(cashback + vorteile - kosten);
  const ergebnis = !ausgabenMonat ? 'brauchtAusgaben'
    : Math.abs(netto) <= SPANNE_AUSGEGLICHEN ? 'ausgeglichen'
    : netto > 0 ? 'bringt' : 'kostet';

  return { jahresAusgaben, gebuehr, zinsen, cashback, fremdKosten, vorteile, kosten, netto, ergebnis, nichtGezaehlt };
}
