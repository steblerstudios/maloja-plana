// Rohe Unicode-Zeichen im Text — die Schicht unter der Icon-Konvention.
//
// Das Problem: ein Piktogramm, das als Buchstabe im Text steht, ist per `+` an
// ihn GEKLEBT und damit nicht abschirmbar. Ein Zeichen in einem eigenen Knoten
// kann `aria-hidden` tragen, eines mitten im Text nicht — ein Screenreader liest
// den Zeichennamen mit. Dazu rendert jedes System sie anders, während unsere
// Piktogramme eigene Pfade sind.
//
// 🛑 WARUM DIESER TEST NACH KATEGORIE SUCHT UND NICHT NACH EINER LISTE
// Die erste Fassung führte die Zeichen von Hand auf: ⓘ ✓ → ⚠ · – — ▾ ✕ ○ × ▸ □ ● … •
// Sie meldete 175 offene Stellen. Eine Suche nach Unicode-KATEGORIE fand am
// selben Abend 21 weitere Zeichen, die niemand auf dem Schirm hatte — ☎ ◉ ✦ ▶ △
// ↗ ← ↻ ◇ ◎ ◰ ↧ ↙ ↩ ▼ ‹ › … —, zusammen 63 Vorkommen. Eine Liste kann nur
// finden, woran ihr Verfasser gedacht hat. Darum zählt hier die Kategorie.
// (Und auch das ging zunächst schief: eine Schwelle `ord < 0x2010` verschluckte
// das Mittelpunkt-Zeichen · bei U+00B7. Jetzt ist die Grenze ASCII.)
//
// Zwei Klassen, die NICHT gleich behandelt werden dürfen:
//   • Typografie (· — – ’ − ≈ …) gehört in den Text. Ein Screenreader liest sie
//     richtig, und ein Piktogramm daraus zu machen wäre falsch, nicht nur unnötig.
//   • Piktogramme (→ ✓ ⚠ ☎ …) geben sich als Buchstaben aus und gehören ersetzt.
//
// Ersatz: `hinweisZeichen(name)` aus `IconSystem.jsx`. Siehe `docs/ICON_KONVENTION.md`.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const SRC = path.resolve(__dirname, '..');

// Zeichen, die als Schriftzeichen in den Text gehören.
const TYPOGRAFIE = new Set([...'·—–’‘“”„«»…‹›−≈%‰§°±×÷']);

// Seit 23.09.2026 auch `.js`: bis dahin sah der Test nur `.jsx` — und übersah
// acht `icon: '○'` in `budgetSync.js`, die `BudgetSync.jsx` als Text auf den
// Schirm brachte, ohne aria-hidden. Daten reisen in die Oberfläche, die Datei-
// endung sagt nichts darüber. Ausgenommen bleibt `i18n/`: dort ist der Pfeil
// Typografie im Satz («CHF 250/Mt. → ca. CHF 3'000/Jahr»), kein Piktogramm.
const jsxDateien = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
  const p = path.join(dir, e.name);
  if (e.isDirectory()) return e.name === '__tests__' || e.name === 'i18n' ? [] : jsxDateien(p);
  // IconSystem trägt die Muster als Beispiel im Kommentar des Bausteins.
  return /\.jsx?$/.test(e.name) && e.name !== 'IconSystem.jsx' ? [p] : [];
});

// Symbol- oder Interpunktionszeichen jenseits von ASCII, per Unicode-Eigenschaft
// statt per Liste. \p{S} = Symbole, \p{P} = Interpunktion.
// Die ASCII-Grenze über den Codepunkt statt über eine Zeichenklasse: ein
// Null-Zeichen im Muster ist ein Steuerzeichen, und die Lint-Regel
// `no-control-regex` weist es zu Recht ab.
const istJenseitsAscii = (ch) => ch.codePointAt(0) > 0x7F;
const IST_SYMBOL = /[\p{S}\p{P}]/u;

// Alle GEKLEBTEN Zeichen: Literale, die per `+` an etwas anderes gehängt werden.
const geklebte = () => {
  const gefunden = [];
  for (const datei of jsxDateien(SRC)) {
    const zeilen = fs.readFileSync(datei, 'utf8').split('\n');
    zeilen.forEach((zeile, i) => {
      // Kommentare und Konsolen-Meldungen sind nicht die Oberfläche.
      if (zeile.trimStart().startsWith('//') || /console\.\w+\(/.test(zeile)) return;
      for (const m of zeile.matchAll(/'[^'\n]*'|"[^"\n]*"/g)) {
        const vor = zeile.slice(0, m.index).trimEnd();
        const nach = zeile.slice(m.index + m[0].length).trimStart();
        if (!vor.endsWith('+') && !nach.startsWith('+')) continue;
        for (const ch of m[0]) {
          if (!istJenseitsAscii(ch) || !IST_SYMBOL.test(ch)) continue;
          gefunden.push({ ch, ort: `${path.basename(datei)}:${i + 1}` });
        }
      }
    });
  }
  return gefunden;
};

const piktogramme = () => geklebte().filter((g) => !TYPOGRAFIE.has(g.ch));

// Zeichen, die ALLEIN in einem Element stehen (`}, '✕')`). Die sind zwar per
// `aria-hidden` abschirmbar — aber sie rendern trotzdem auf jedem System anders,
// und der Einwand von Stebler Studios galt von Anfang an dem Aussehen,
// nicht nur dem Vorlesen.
const alleinStehende = () => {
  const gefunden = [];
  for (const datei of jsxDateien(SRC)) {
    fs.readFileSync(datei, 'utf8').split('\n').forEach((zeile, i) => {
      if (zeile.trimStart().startsWith('//') || /console\.\w+\(/.test(zeile)) return;
      for (const m of zeile.matchAll(/'[^'\n]*'|"[^"\n]*"/g)) {
        const vor = zeile.slice(0, m.index).trimEnd();
        const nach = zeile.slice(m.index + m[0].length).trimStart();
        if (vor.endsWith('+') || nach.startsWith('+')) continue;   // geklebt: andere Zählung
        for (const ch of m[0]) {
          if (!istJenseitsAscii(ch) || !IST_SYMBOL.test(ch) || TYPOGRAFIE.has(ch)) continue;
          gefunden.push({ ch, ort: `${path.basename(datei)}:${i + 1}` });
        }
      }
    });
  }
  return gefunden;
};

describe('ⓘ · abgearbeitet und gesperrt', () => {
  // Die eine geklebte Stelle, die bleibt: eine HTML-Zeichenkette für den Export.
  // Dort gibt es keinen React-Knoten, in den ein <Icon> passen würde.
  //
  // Auf die DATEI prüfen, nicht auf Datei:Zeile — eine Zeilennummer ist eine
  // Eigenschaft der Formatierung, nicht der Sache, und verrutscht bei jedem Import.
  it('kein ⓘ hängt mehr an einem Text auf dem Bildschirm', () => {
    const dateien = [...new Set(piktogramme().filter((g) => g.ch === 'ⓘ').map((g) => g.ort.split(':')[0]))];
    expect(dateien).toEqual(['FinanzUebersicht.jsx']);
  });
});

describe('Piktogramme im Text · Höchststand, der nur sinken darf', () => {
  // Stand 20.09.2026, nach ⓘ (122 → 4), nach ✓/⚠/✕/□ (48 → 8) und nach den
  // Pfeilen und Einzelstücken (151 → 2). Was bleibt, steht in der
  // HTML-Zeichenkette des Exports — dort gibt es keinen React-Knoten.
  // Sinkt eine Zahl, wird sie hier nachgezogen — das ist der Fortschritt.
  // Steigt sie, ist neue Schuld entstanden und der Test bricht.
  // 23.09.2026: 2 → 3, ohne neue Schuld — der Test sieht seither auch `.js`.
  // Das dritte ist das `✓` im CSS des gedruckten Flyers (`flyerGenerator.js`),
  // ebenfalls eine Zeichenkette ohne React-Knoten.
  const HOECHSTSTAND = 3;

  it(`höchstens ${HOECHSTSTAND} geklebte Piktogramme im ganzen Baum`, () => {
    const gefunden = piktogramme();
    expect(gefunden.length).toBeLessThanOrEqual(HOECHSTSTAND);
  });

  // Der eigentliche Zweck: ein Zeichen, das noch niemand gesehen hat, soll
  // auffallen, statt sich in einer Summe zu verstecken.
  it('kein Zeichen ausserhalb der bekannten Liste', () => {
    const BEKANNT = new Set([...'✓ⓘ']);
    const neue = [...new Set(piktogramme().map((g) => g.ch))].filter((c) => !BEKANNT.has(c));
    expect(neue).toEqual([]);
  });
});

describe('Allein stehende Piktogramme · Höchststand, der nur sinken darf', () => {
  // Stand 21.09.2026: 97 → 6. Weg sind die Chevrons am rechten Rand (die Zeile
  // ist schon ein Knopf), die Schliess-Kreuze, die Aufklapp-Dreiecke.
  // Was bleibt, sind vor allem ✓/○-Zustandszeichen, die teils in Datenobjekte
  // fliessen und bis in Druck und Export reichen — die brauchen je einen Blick,
  // keinen Suchlauf.
  // 23.09.2026: 6 → 5. Gezählt ab jetzt auch in `.js`: acht `○` aus
  // `budgetSync.js` sind weg (sie standen ohne aria-hidden auf dem Schirm),
  // dazu kommt das `✓` in der Druck-Tabelle des Dossiers (`dossierGenerator.js`).
  // Später am 23.09.2026: 5 → 2. `stipResultMarker` (✓ ○ ⓘ) ist eine Form
  // geworden (`StatusForm`, wie in der KVG-Statuslogik). Es bleiben die
  // antippbare Glossar-Markierung ⓘ und das ✓ im Druck-Dossier. Damit gibt es
  // kein allein stehendes ○ mehr — es steht auch nicht mehr in der Liste.
  const HOECHSTSTAND = 2;

  it(`höchstens ${HOECHSTSTAND} allein stehende Piktogramme`, () => {
    expect(alleinStehende().length).toBeLessThanOrEqual(HOECHSTSTAND);
  });

  it('kein Zeichen ausserhalb der bekannten Liste', () => {
    const BEKANNT = new Set([...'✓ⓘ']);
    const neue = [...new Set(alleinStehende().map((g) => g.ch))].filter((c) => !BEKANNT.has(c));
    expect(neue).toEqual([]);
  });
});

describe('Typografie bleibt, wo sie ist', () => {
  // Kein Höchststand, keine Schuld: · — – ’ gehören in den Satz. Der Test hält
  // nur fest, dass sie bewusst als Typografie gelten und nicht versehentlich in
  // die Piktogramm-Zählung rutschen.
  it('wird nicht als Schuld gezählt', () => {
    const typo = geklebte().filter((g) => TYPOGRAFIE.has(g.ch));
    expect(typo.length).toBeGreaterThan(0);
    expect(piktogramme().some((g) => TYPOGRAFIE.has(g.ch))).toBe(false);
  });
});
