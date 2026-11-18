import React from 'react';
import { text, space, leading } from '../config/tokens.js';
import { ergebnisSatz } from '../data/ergebnisArt.js';
import { springeZuAngabe } from '../data/angabeZiele.js';
import { linkStil } from './PrimaryButton.jsx';

// O3 — die ruhige Anzeige der Ergebnis-Art: ein Satz in der Fliesstext-Farbe, keine Plakette,
// kein Farbsignal. Sie sagt, was für ein Ergebnis darüber steht (Berechnung · Schätzung ·
// Vorprüfung · Orientierung) und, wenn Angaben fehlen, welche.
//
// Kapitel 5, C: Fehlt eine Angabe, deren Feld im Rechner steht (`ziele`, siehe data/angabeZiele.js),
// wird ihr Name zum Sprung dorthin. Ob das Feld wirklich auf der Seite steht, prüft die Anzeige nach dem
// Zeichnen — bis dahin und ohne Feld bleibt der Name Text.
//
// Die Art steht zusätzlich als data-Attribut am Element. Das ist keine Dekoration: die Tests
// prüfen daran die Zusage «jeder umgestellte Rechner meldet eine der vier Arten», ohne an der
// Schreibweise des Satzes zu hängen.
// Trennmarke (U+241F), als Zahl geschrieben — kein sichtbares Zeichen im Quelltext (glyphenImText.test.js).
const MARKE = String.fromCharCode(0x241f);

// Den Satz an der Stelle der Liste teilen, damit die Namen einzeln stehen können. Gelingt das nicht
// (eine Sprache ohne {liste}), bleibt es beim ganzen Satz.
export function ergebnisSatzTeile(ergebnis, t) {
  const ganz = ergebnisSatz(ergebnis, t);
  if (!ergebnis.fehlend.length) return null;
  const namen = ergebnis.fehlend.map((name) => { const k = 'ergebnisArt.angabe.' + name; const v = t(k); return v && v !== k ? { name, label: v } : null; });
  if (!namen.every(Boolean)) return null;
  const teile = String(t('ergebnisArt.fehltNamen', { satz: t('ergebnisArt.satz.' + ergebnis.art), liste: MARKE })).split(MARKE);
  if (teile.length !== 2) return null;
  return { vorher: teile[0], namen, nachher: teile[1], ganz };
}

export const ErgebnisArt = ({ palette, t, ergebnis, ziele, style }) => {
  const [da, setDa] = React.useState({});
  const schluessel = ergebnis ? ergebnis.fehlend.join('|') : '';
  React.useEffect(() => {
    if (!ziele || typeof document === 'undefined') return;
    const gefunden = {};
    for (const [name, id] of Object.entries(ziele)) if (document.getElementById(id)) gefunden[name] = id;
    setDa((alt) => (Object.keys(alt).join('|') === Object.keys(gefunden).join('|') ? alt : gefunden));
  }, [ziele, schluessel]);
  if (!ergebnis) return null;
  const teile = ziele ? ergebnisSatzTeile(ergebnis, t) : null;
  const inhalt = teile
    ? [teile.vorher, ...teile.namen.flatMap(({ name, label }, i) => [
      i > 0 ? ', ' : null,
      da[name]
        ? React.createElement('button', { key: name, type: 'button', className: 'mp-link', 'data-angabe-sprung': name, style: linkStil(palette), onClick: () => springeZuAngabe(da[name]) }, label)
        : React.createElement('span', { key: name }, label),
    ]), teile.nachher]
    : ergebnisSatz(ergebnis, t);
  return React.createElement('p', {
    'data-ergebnis-art': ergebnis.art,
    'data-fehlend': ergebnis.fehlend.length,
    style: {
      fontSize: text.xs,
      color: palette.mid,
      lineHeight: leading.normal,
      margin: space.sm + 'px 0 0',
      ...style,
    },
  }, inhalt);
};

export default ErgebnisArt;
