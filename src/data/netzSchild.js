import { schildState } from './schutzschild.js';

// Netz-Schild (Fassung 7, F7-K3-6, Entscheid Stebler Studios 27.10.2026): EIN Bild statt Spinnennetz und zwei
// Schutzschilden. Ein Schild aus Teilen, je Versicherung ein Teil, das sich von der Mitte nach aussen füllt.
// Konzept: _werkbank/versicherung-schild-2026-10-27/ (Prototyp).
//
// Welche Teile es gibt, entscheidet weiter schildState (data/schutzschild.js) — mit allen Regeln dort (Unfall nur
// für Angestellte, Pensionskasse erst ab Eintrittsschwelle und Mindestalter …). So entsteht keine falsche Lücke.
// «Leben» oben in der Mitte (Stebler Studios 27.10.2026, offene Frage 3 im Konzept): freiwillig, aus dem Feld
// lifeInsurance («Ja» = gedeckt). Ohne Angabe oder «Nein» steht es als «noch nicht gedeckt» da — der Satz unter
// dem Bild sagt dazu «freiwillig», wie bei Haftpflicht und Hausrat.
//
// Stufen: 0 = noch nicht gedeckt (kleiner Kern), 1 = Grundversicherung (nur Krankenkasse: KVG ohne Zusatz),
// 2 = gedeckt. Die Krankenkasse hat zwei Stufen, weil sie zwei Versicherungen ist (KVG Pflicht, VVG Zusatz
// freiwillig); alle anderen eine.

// Reihenfolge im Uhrzeigersinn, beginnend unten an der Spitze (Haftpflicht, wie im Konzept): links Hausrat,
// oben links Pensionskasse, oben in der Mitte Leben, oben rechts Krankenkasse, rechts Unfall.
const REIHE = ['haftpflicht', 'hausrat', 'bvg', 'leben', 'kk', 'uvg'];
export const SCHILD_STUFEN = [0.34, 0.67, 1];

const has = (x) => x != null && String(x).trim() !== '';

export function netzSchildTeile(v = {}, opts = {}) {
  const st = schildState(v, opts);
  const pflicht = new Set(st.pflicht.items.map((p) => p.key));
  const items = [...st.pflicht.items, ...st.empfohlen.items, { key: 'leben', covered: v.lifeInsurance === 'yes' }];
  const teile = REIHE
    .map((key) => items.find((p) => p.key === key))
    .filter(Boolean)
    .map((p) => {
      const zweiStufen = p.key === 'kk';
      const stufe = !p.covered ? 0 : zweiStufen && !has(v.kkZusatz) ? 1 : 2;
      return { key: p.key, pflicht: pflicht.has(p.key), zweiStufen, stufe };
    });
  return { teile, offen: teile.filter((t) => t.stufe === 0).map((t) => t.key), st };
}

// Mittelwinkel (Grad, 0 = rechts, 90 = unten, 270 = oben) je Teil: «Leben» steht immer genau oben in der
// Mitte, die übrigen gleichmässig im Uhrzeigersinn darum; Haftpflicht landet so unten an oder nahe der Spitze.
export const teilWinkel = (i, n, iLeben) => 270 + (360 / n) * (i - iLeben);
