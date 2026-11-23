// Wächter für das Register der Rechtsregeln (data/rechtsregeln.js).
//
// Eine Regel wie «UVV Art. 13: ab 8 Stunden pro Woche» steht in vielen Texten, je auf eine andere
// Lage angewendet. Der Wächter hält zwei Dinge fest, in allen fünf Sprachen:
//   1. Jeder Text, der den Artikel zitiert, ist im Register als Fundstelle eingetragen, und jede
//      Fundstelle zitiert ihn noch. Eine neue Erwähnung fällt so auf, statt still zu driften.
//   2. Jede Fundstelle nennt die Werte, die das Register für sie festhält (Ziffer oder Zahlwort).
// Ob die Regel inhaltlich stimmt, prüft kein Test. Das bleibt Fachprüfung.
import { describe, it, expect } from 'vitest';
import { RECHTSREGELN } from '../data/rechtsregeln.js';
import de from '../i18n/de.js';
import en from '../i18n/en.js';
import fr from '../i18n/fr.js';
// NICHT `it` nennen, das überschreibt vitests `it`.
import itLang from '../i18n/it.js';
import rm from '../i18n/rm.js';

const SPRACHEN = { de, en, fr, it: itLang, rm };

// { 'a.b.sie': '…' } für jeden Text, ganz unten in der Verschachtelung
const flach = (o, p = '', aus = {}) => {
  for (const [k, v] of Object.entries(o)) {
    const q = p ? `${p}.${k}` : k;
    if (typeof v === 'string') aus[q] = v;
    else if (v && typeof v === 'object') flach(v, q, aus);
  }
  return aus;
};
const TEXTE = Object.fromEntries(Object.entries(SPRACHEN).map(([l, d]) => [l, flach(d)]));

// Sie/Du-Fassungen gehören zum selben Schlüssel
const basis = (k) => k.replace(/\.(sie|du)$/, '');
// Quellen-Marker [[Beschriftung|https://…]]: nur die Beschriftung zählt, die Adresse nicht
const ohneMarker = (s) => s.replace(/\[\[([^\]|]*)\|[^\]]*\]\]/g, '$1');
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Zitat in beiden Reihenfolgen:
//   «UVV Art. 13», «UVV, Accident Insurance Ordinance, Art. 13», «OLAA art. 13, al. 1»
//   «Art. 13 UVV», «art. 13 OAAc», «Art. 13 para. 1 UVV»
// Der Artikel darf nicht weitergehen: «Art. 3» trifft nicht «Art. 3a» oder «Art. 30».
const zitatMuster = (regel) => {
  const kuerzel = [...new Set(Object.values(regel.kuerzel).flat())].map(esc).join('|');
  const art = `[Aa]rt\\.\\s*${esc(regel.artikel)}(?![\\da-z])`;
  const absatz = `(?:,?\\s*(?:(?:Abs|al|cpv|para)\\.|paras\\.?)\\s*[\\d–-]+)?`;
  return new RegExp(`\\b(?:${kuerzel})\\b(?:,\\s*[^,()\\[\\];]{1,40},)?\\s*${art}|${art}${absatz}\\s+(?:${kuerzel})\\b`);
};

// Zahlwörter, wo ein Text die Zahl ausschreibt («drei Monate», «acht Wochenstunden»)
const ZAHLWORT = {
  3: ['drei', 'three', 'trois', 'tre', 'trais'],
  8: ['acht', 'eight', 'huit', 'otto', 'otg'],
};
// Artikel, Absätze und Platzhalter tragen Zahlen, die kein Wert sind
const ohneVerweise = (s) => s
  .replace(/[Aa]rt\.\s*\d+[a-z]*/g, ' ')
  // Kürzel nur mit Punkt: «al» ohne Punkt ist im Italienischen «al 24° compleanno»
  .replace(/\b(?:(?:Abs|al|cpv|para|Bst|let|lett)\.|paras\.?)\s*[\d–-]+/g, ' ')
  .replace(/\{[^}]*\}/g, ' ');
const nenntWert = (text, wert) => {
  const s = ohneVerweise(ohneMarker(text));
  if (new RegExp(`(?<![\\d’'.])${wert}(?![\\d’'])`).test(s)) return true;
  return (ZAHLWORT[wert] || []).some((w) => new RegExp(`(?<![\\p{L}])${w}(?![\\p{L}])`, 'iu').test(s));
};

describe('Rechtsregeln · Register', () => {
  it.each(RECHTSREGELN.map((r) => [r.id, r]))('%s ist vollständig beschrieben', (_id, r) => {
    expect(r.regel.length).toBeGreaterThan(20);
    expect(r.quelle).toMatch(/^https:\/\/www\.fedlex\.admin\.ch\/eli\/cc\/.+#art_\d+/);
    expect(Object.keys(r.kuerzel).sort()).toEqual(Object.keys(SPRACHEN).sort());
    expect(Object.keys(r.fundstellen).length).toBeGreaterThan(0);
  });

  it('die Kennungen sind eindeutig', () => {
    const ids = RECHTSREGELN.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe.each(RECHTSREGELN.map((r) => [r.id, r]))('Rechtsregel %s', (_id, regel) => {
  const muster = zitatMuster(regel);
  const erwartet = Object.keys(regel.fundstellen).sort();

  it.each(Object.keys(SPRACHEN))('%s: jedes Zitat ist eingetragen, jede Fundstelle zitiert', (lang) => {
    const gefunden = new Set();
    for (const [k, v] of Object.entries(TEXTE[lang])) if (muster.test(ohneMarker(v))) gefunden.add(basis(k));
    const neu = [...gefunden].filter((k) => !regel.fundstellen[k]).sort();
    const weg = erwartet.filter((k) => !gefunden.has(k));
    expect(neu, `${lang}: zitiert, aber nicht im Register (data/rechtsregeln.js)`).toEqual([]);
    expect(weg, `${lang}: im Register, zitiert aber nicht (mehr)`).toEqual([]);
  });

  it.each(Object.keys(SPRACHEN))('%s: jede Fundstelle nennt ihre Werte', (lang) => {
    const fehler = [];
    for (const [schluessel, werte] of Object.entries(regel.fundstellen)) {
      const fassungen = Object.entries(TEXTE[lang]).filter(([k]) => basis(k) === schluessel);
      for (const [k, text] of fassungen) for (const w of werte) if (!nenntWert(text, w)) fehler.push(`${k} ohne ${w}`);
    }
    expect(fehler, `${lang}: Wert fehlt`).toEqual([]);
  });
});
