import { schildState } from './schutzschild.js';

// Netz-Schild (Fassung 7, F7-K3-6, Entscheid Stebler Studios 27.10.2026): EIN Bild statt Spinnennetz und zwei
// Schutzschilden. Ein Schild aus Teilen, je Versicherung ein Teil, das sich von der Mitte nach aussen füllt.
// Konzept: _werkbank/versicherung-schild-2026-10-27/ (Prototyp).
//
// Welche Teile es gibt, entscheidet weiter schildState (data/schutzschild.js) — mit allen Regeln dort (Unfall nur
// für Angestellte, Pensionskasse erst ab Eintrittsschwelle und Mindestalter …). So entsteht keine falsche Lücke.
// Bewusst ohne «Leben»: keine Pflicht und für viele nicht nötig (offene Frage 3 im Konzept) — kein Teil, das
// als «noch nicht gedeckt» dasteht, obwohl nichts fehlt.
//
// Stufen: 0 = noch nicht gedeckt (kleiner Kern), 1 = Grundversicherung (nur Krankenkasse: KVG ohne Zusatz),
// 2 = gedeckt. Die Krankenkasse hat zwei Stufen, weil sie zwei Versicherungen ist (KVG Pflicht, VVG Zusatz
// freiwillig); alle anderen eine.

// Reihenfolge im Uhrzeigersinn, beginnend unten an der Spitze (Haftpflicht, wie im Konzept), dann links
// Hausrat, oben links Pensionskasse, oben Krankenkasse, rechts Unfall.
const REIHE = ['haftpflicht', 'hausrat', 'bvg', 'kk', 'uvg'];
export const SCHILD_STUFEN = [0.34, 0.67, 1];

const has = (x) => x != null && String(x).trim() !== '';

export function netzSchildTeile(v = {}, opts = {}) {
  const st = schildState(v, opts);
  const pflicht = new Set(st.pflicht.items.map((p) => p.key));
  const items = [...st.pflicht.items, ...st.empfohlen.items];
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

// Mittelwinkel (Grad, 0 = rechts, 90 = unten) je Teil: der erste Teil zeigt nach unten zur Spitze.
export const teilWinkel = (i, n) => 90 + (360 / n) * i;
