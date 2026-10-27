import { schildState } from './schutzschild.js';
import { hausratPflicht } from './hausratPflicht.js';

// Netz-Schild (Fassung 7, F7-K3-6, Entscheid Stebler Studios 27.10.2026): EIN Bild statt Spinnennetz und zwei
// Schutzschilden. Ein Schild aus Teilen, das sich je Teil von der Mitte nach aussen füllt.
// Konzept: _werkbank/versicherung-schild-2026-10-27/ (Prototyp).
//
// Umbau am selben Tag (Sophie: «Vorsorge mit drei Säulen, Unfall mit Zusatz und neuem Feld, Haushalt mit Haftpflicht
// und Hausrat, Hausrat-Pflicht je Kanton mit Prüf-Vermerk»). Jedes Teil besteht aus Versicherungen; es füllt sich nach
// der ZAHL der erfüllten, die für die Person gelten — die Stufen bauen rechtlich nicht aufeinander auf (eine 3a geht
// auch ohne Pensionskasse, Fachprüfung 27.10.2026):
//   Krankenkasse  KVG (Pflicht) · Zusatz (freiwillig, kkZusatz)
//   Unfall        UVG (Pflicht für Angestellte) · Zusatz (freiwillig, uvgZusatz) — nur für Angestellte, sonst deckt
//                 die Krankenkasse Unfälle (KVG Art. 1a Abs. 2 lit. b); kein Teil, keine falsche Lücke
//   Vorsorge      AHV (Pflicht, AHVG Art. 1a, 3) · Pensionskasse (wo Pflicht oder erfasst) · Säule 3a (freiwillig,
//                 nur mit Erwerbseinkommen, BVV 3 Art. 7) — Reihenfolge BV Art. 111–113
//   Haushalt      Privathaftpflicht · Hausrat (Pflicht je Kanton, siehe hausratPflicht.js mit verify)
//   Leben         Lebensversicherung (freiwillig), oben in der Mitte
// Welche Pflicht wann gilt, entscheidet weiter schildState (Eintrittsschwelle, Mindestalter, Referenzalter …).

const REIHE = ['haushalt', 'vorsorge', 'leben', 'kk', 'uvg'];
export const SCHILD_KERN = 0.34;

const has = (x) => x != null && String(x).trim() !== '';
const zahl = (x) => Number(String(x ?? '').replace(/[’'\s]/g, '')) || 0;
const ERWERB = ['employed', 'selfEmployed', 'freelance'];

// Füllung 0..1: ohne Erfülltes ein kleiner Kern, sonst anteilig bis ganz.
export const fuellung = (teil) => teil.erreicht === 0 ? SCHILD_KERN : SCHILD_KERN + (1 - SCHILD_KERN) * (teil.erreicht / teil.n);

export function netzSchildTeile(v = {}, opts = {}) {
  const st = schildState(v, opts);
  const pflichtItem = (key) => st.pflicht.items.find((p) => p.key === key);
  const art = opts.finanzen?.employmentType;
  const erwerb = ERWERB.includes(art) || opts.employed === true;
  const bvg = pflichtItem('bvg');
  const bvgErfasst = has(v.bvgInsurer) || zahl(v.bvgContribution) > 0 || zahl(v.bvgBalance) > 0;
  const hausrat = hausratPflicht(opts.kanton);

  const roh = {
    kk: [
      { key: 'kvg', art: 'pflicht', ok: has(v.kkInsurer) },
      { key: 'kkZusatz', art: 'freiwillig', ok: has(v.kkZusatz) },
    ],
    uvg: pflichtItem('uvg') ? [
      { key: 'uvg', art: 'pflicht', ok: pflichtItem('uvg').covered },
      { key: 'uvgZusatz', art: 'freiwillig', ok: v.uvgZusatz === 'yes' },
    ] : [],
    vorsorge: [
      // AHV: wer erwerbstätig ist, zahlt über Lohn bzw. Ausgleichskasse; im Ruhestand keine Lücke.
      { key: 'ahv', art: 'pflicht', ok: erwerb || art === 'retired' || zahl(v.ahvContribution) > 0 },
      (bvg || bvgErfasst) && { key: 'bvg', art: bvg ? 'pflicht' : 'freiwillig', ok: bvgErfasst },
      (erwerb || zahl(opts.finanzen?.pension3a) > 0) && { key: 'saeule3a', art: 'freiwillig', ok: zahl(opts.finanzen?.pension3a) > 0 },
    ].filter(Boolean),
    haushalt: [
      { key: 'haftpflicht', art: 'haftpflicht', ok: v.liabilityInsurance === 'yes' },
      { key: 'hausrat', art: hausrat === 'pflicht' ? 'kantonPflicht' : hausrat === 'unbekannt' ? 'jeNachKanton' : 'freiwillig', ok: v.householdInsurance === 'yes' },
    ],
    leben: [{ key: 'leben', art: 'freiwillig', ok: v.lifeInsurance === 'yes' }],
  };

  const teile = REIHE
    .filter((key) => roh[key].length)
    .map((key) => {
      const teile = roh[key];
      const erreicht = teile.filter((x) => x.ok).length;
      return { key, versicherungen: teile, n: teile.length, erreicht };
    });
  return {
    teile,
    offen: teile.filter((t) => t.erreicht === 0).map((t) => t.key),
    teilweise: teile.filter((t) => t.erreicht > 0 && t.erreicht < t.n).map((t) => t.key),
    st,
  };
}

// Mittelwinkel (Grad, 0 = rechts, 90 = unten, 270 = oben) je Teil: «Leben» steht immer genau oben in der
// Mitte, die übrigen gleichmässig im Uhrzeigersinn darum.
export const teilWinkel = (i, n, iLeben) => 270 + (360 / n) * (i - iLeben);
