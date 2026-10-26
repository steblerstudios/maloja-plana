// Wächter: Jeder rm-Text, der wörtlich dem Deutschen entspricht (deutscher Rückfall), trägt eine `TODO(rm)`-Marke —
// auf derselben Zeile, in den Kommentarzeilen direkt darüber oder über einem umschliessenden Block. Sonst fällt er
// bei der Gegenlese (BAULISTE K29/K69) durch: man sieht ihm in rm.js nicht an, dass er noch fehlt.
// Die Kopfmarke in Zeile 2 gilt für die ganze Datei und zählt darum nicht. Grenze: Jede andere TODO(rm)-Marke zählt,
// auch eine Gegenlese-Marke, und eine Block-Marke deckt später dazukommende Texte im selben Block mit — wer in einen
// markierten Block einen deutschen Satz einfügt, setzt die Marke trotzdem selbst. Stand 26.10.2026: auf main fehlte
// sie bei rund 160 Texten, nachgetragen mit «Marke nachgetragen (26.10.2026)». Ergänzt rmGegenleseMarken.test.js.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import de from '../de.js';
import rm from '../rm.js';

const src = readFileSync(new URL('../rm.js', import.meta.url), 'utf8');

// Schlüsselpfad → Zeile (0-basiert) für jedes Blatt, dazu die Zeile jedes Blocks. Kleiner Scanner statt Regex je
// Schlüssel, weil dieselben Namen (intro, step1Text, sie/du) hundertfach vorkommen.
function schluesselZeilen(text) {
  const blaetter = new Map();
  const bloecke = new Map();
  // Ebenen: { name } für Objekte, { name, index } für Arrays (Elemente heissen wie in Object.entries: 0, 1, …).
  const pfad = [];
  const name = (...rest) => [...pfad.map((e) => e.name), ...rest].filter((t) => t != null).join('.');
  const imArray = () => pfad.length > 0 && pfad[pfad.length - 1].index != null;
  let zeile = 0;
  let schluessel = null;
  let schluesselZeile = 0;
  let wartetAufWert = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '\n') { zeile++; continue; }
    if (c === '/' && text[i + 1] === '/') { while (i < text.length && text[i] !== '\n') i++; i--; continue; }
    if (c === '/' && text[i + 1] === '*') {
      const ende = text.indexOf('*/', i + 2);
      for (let j = i; j < ende; j++) if (text[j] === '\n') zeile++;
      i = ende + 1;
      continue;
    }
    if (c === "'" || c === '"' || c === '`') {
      const start = i;
      i++;
      while (i < text.length && text[i] !== c) { if (text[i] === '\\') i++; else if (text[i] === '\n') zeile++; i++; }
      if (wartetAufWert) {
        blaetter.set(name(schluessel), schluesselZeile);
        wartetAufWert = false;
      } else if (imArray()) {
        blaetter.set(name(pfad[pfad.length - 1].index), zeile);
      } else {
        // Gequoteter Schlüssel ('k': …)?
        let j = i + 1;
        while (text[j] === ' ') j++;
        if (text[j] === ':') { schluessel = text.slice(start + 1, i); schluesselZeile = zeile; wartetAufWert = true; i = j; }
      }
      continue;
    }
    // Schlüssel mit Umlaut (behördenStatus) oder aus Ziffern (300:) gehören dazu.
    if (/[\p{L}\p{N}_$]/u.test(c)) {
      let j = i;
      while (j < text.length && /[\p{L}\p{N}_$]/u.test(text[j])) j++;
      const wort = text.slice(i, j);
      let k = j;
      while (text[k] === ' ') k++;
      if (text[k] === ':' && !wartetAufWert) { schluessel = wort; schluesselZeile = zeile; wartetAufWert = true; i = k; continue; }
      i = j - 1;
      continue;
    }
    if (c === '{' || c === '[') {
      const index = c === '[' ? 0 : null;
      if (wartetAufWert) {
        pfad.push({ name: schluessel, index });
        bloecke.set(name(), schluesselZeile);
        wartetAufWert = false;
      } else if (imArray()) {
        const n = pfad[pfad.length - 1].index;
        pfad.push({ name: n, index });
        bloecke.set(name(), zeile);
      } else {
        pfad.push({ name: null, index }); // export default { … }
      }
      continue;
    }
    if (c === '}' || c === ']') { pfad.pop(); continue; }
    if (c === ',') {
      wartetAufWert = false;
      if (imArray()) pfad[pfad.length - 1].index++;
    }
  }
  return { blaetter, bloecke };
}

const KOPF = 1; // Zeile 2: «TODO(rm): Romanisch von Muttersprachler:in prüfen lassen» — gilt für alles

// Schlüssel ohne Marke: weder auf der eigenen Zeile noch in den Kommentarzeilen direkt darüber, auch nicht über
// einem umschliessenden Block.
function ohneMarke(text, schluessel) {
  const z = text.split('\n');
  const { blaetter, bloecke } = schluesselZeilen(text);
  const markiert = (n) => {
    if (/TODO\(rm\)/.test(z[n])) return true;
    for (let i = n - 1; i > KOPF && /^\s*\/\//.test(z[i]); i--) if (/TODO\(rm\)/.test(z[i])) return true;
    return false;
  };
  return schluessel.filter((k) => {
    const teile = k.split('.');
    const kette = [blaetter.get(k)];
    for (let n = teile.length - 1; n > 0; n--) kette.push(bloecke.get(teile.slice(0, n).join('.')));
    return !kette.some((n) => n != null && markiert(n));
  });
}

const blattListe = (o, p = []) => Object.entries(o).flatMap(([k, v]) =>
  v && typeof v === 'object' ? blattListe(v, [...p, k]) : [[[...p, k], v]]);
const wert = (o, p) => p.reduce((a, k) => (a == null ? a : a[k]), o);

// Rückfall: identisch mit de. Ob ein einzelnes Wort («Telefon», «Budget», «Testament») auf Rumantsch gleich lautet,
// entscheidet die Gegenlese, nicht dieser Test — darum braucht auch es eine Marke. Ausgenommen ist nur, was in keiner
// Sprache übersetzt wird: Links, Telefonnummern, Codes ohne Kleinbuchstaben (FAQ, IPV, B+, 756.XXXX…, CHF {value})
// und die Eigennamen unten.
const EIGENNAMEN = new Set([
  'Maloja Plana', 'Stebler Studios — Sophie Stebler', 'Web: https://malojaplana.ch', 'petition.ch',
  'Threema', 'SecureSafe', 'IncaMail', 'Swiss Cancer Screening', 'GNU Affero General Public License v3.0 (AGPL-3.0)',
  'Excel (.xlsx)', 'Caritas-Markt', 'Volkszahnklinik', 'Volkshochschule beider Basel', 'Familienpass Region Basel',
  'FerienPass A-Welle (AG/SO)', 'Uri', 'Zug', 'Tessin', 'de',
]);
const neutral = (v) =>
  /^(https?:|tel:)/.test(v) || EIGENNAMEN.has(v) || !/\p{Ll}/u.test(v.replace(/\{[^}]*\}/g, ''));
const rueckfaelle = blattListe(rm)
  .filter(([p, v]) => typeof v === 'string' && wert(de, p) === v && !neutral(v))
  .map(([p]) => p.join('.'));

describe('rm: deutsche Rückfälle tragen eine TODO(rm)-Marke', () => {
  it('der Scanner findet die Zeile jedes deutschen Rückfalls', () => {
    const { blaetter } = schluesselZeilen(src);
    expect(rueckfaelle.length).toBeGreaterThan(0);
    expect(rueckfaelle.filter((k) => !blaetter.has(k))).toEqual([]);
  });

  it('kein deutscher Rückfall ohne Marke', () => {
    expect(ohneMarke(src, rueckfaelle), 'deutscher Text in rm.js ohne «// TODO(rm): provisorisch — …» darüber').toEqual([]);
  });

  it('Gegenprobe: Kopfmarke zählt nicht, Block-, Zeilen- und Stapelmarken zählen', () => {
    const probe = [
      'export default {',
      '  // TODO(rm): Kopf',
      "  a: { b: 'x' },",
      '  // TODO(rm): Block',
      '  c: {',
      "    d: { sie: 'y', du: 'y' },",
      '  },',
      "  e: 'z', // TODO(rm): Zeile",
      '  f: {',
      '    // TODO(rm): Gegenlese',
      '    // weiterer Kommentar',
      "    g: 'w',",
      "    h: 'v',",
      '  },',
      '};',
    ].join('\n');
    expect(ohneMarke(probe, ['a.b', 'c.d.sie', 'c.d.du', 'e', 'f.g', 'f.h'])).toEqual(['a.b', 'f.h']);
  });

  it('Gegenprobe Scanner: Escapes, // im String, gequotete, Umlaut- und Ziffernschlüssel, Arrays, /* */', () => {
    const probe = [
      'export default {',
      "  a: 'l\\'ura // kein Kommentar',",
      "  'b-c': 'x',",
      '  /* Block',
      '     über zwei Zeilen */',
      '  behörde: { 300: \'y\' },',
      "  liste: ['p', { q: 'r' }],",
      "  z: 'z',",
      '};',
    ].join('\n');
    const { blaetter: b } = schluesselZeilen(probe);
    expect(Object.fromEntries(b)).toEqual({ a: 1, 'b-c': 2, 'behörde.300': 5, 'liste.0': 6, 'liste.1.q': 6, z: 7 });
  });
});
