// Jeder Icon-Name, der im Code steht, muss im Register stehen.
//
// Warum: `Icon` gibt für einen unbekannten Namen still `null` zurück — kein
// Fehler, keine Warnung, nur ein fehlendes Bild. So fehlten bis 23.09.2026 drei
// Icons, ohne dass es jemand merkte: `child` (Seitentitel «Kind bekommen"),
// `calculator` und `shield` (zwei Briefvorlagen). Dieselbe Fehlerart wie am
// 21.09., als die Suche `Icons['◎']` weiterreichte.
//
// Geprüft werden die Stellen, an denen ein Name als LITERAL steht: `icon: '…'`,
// `createElement(Icon, { name: '…' })`, `hinweisZeichen('…')`, `Icons.…`,
// `Icons['…']`. Ein Name, der erst zur Laufzeit zusammengesetzt wird, bleibt
// unsichtbar — das ist die Grenze dieses Tests, nicht ein Freispruch.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { Icons } from '../IconSystem.jsx';
import { KERN_NAMEN } from '../IconKern.jsx';

const SRC = path.resolve(__dirname, '..');

const dateien = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
  const p = path.join(dir, e.name);
  if (e.isDirectory()) return e.name === '__tests__' || e.name === 'i18n' ? [] : dateien(p);
  return /\.jsx?$/.test(e.name) ? [p] : [];
});

const MUSTER = [
  /\bicon:\s*'([^']+)'/g,
  /createElement\(Icon,\s*\{\s*name:\s*'([^']+)'/g,
  /\b(?:hinweisZeichen|HinweisZeichen)\(\s*'([^']+)'/g,
  /\bIcons\.([A-Za-z_$][\w$]*)/g,
  /\bIcons\[\s*'([^']+)'\s*\]/g,
];

// Erlaubnisliste, nicht Verbotsliste: jede Ausnahme steht hier mit Datei UND
// Namen. Ein neuer unbekannter Name fällt auf, auch in einer bekannten Datei.
const AUSNAHMEN = new Set([
  // Boden-Anker am Handy: zeichnet seine Icons selbst (`bottomIcon`), bewusst
  // als Referenz-Set der Outline-Icons (docs/ICON_KONVENTION.md).
  ...['file', 'receipt', 'calendarToday', 'pencil', 'sackmesser', 'gift', 'menu']
    .map((n) => `main.jsx:${n}`),
  // Browser-Benachrichtigung: ein Bildpfad, kein Icon-Name.
  'notifications.js:/icon-192.png',
]);

const verweise = () => {
  const gefunden = [];
  for (const datei of dateien(SRC)) {
    if (/Icon(System|Kern)\.jsx$/.test(datei)) continue;
    const inhalt = fs.readFileSync(datei, 'utf8');
    for (const muster of MUSTER) {
      for (const m of inhalt.matchAll(muster)) {
        const zeile = inhalt.slice(0, m.index).split('\n').length;
        gefunden.push({ name: m[1], datei: path.basename(datei), ort: `${path.basename(datei)}:${zeile}` });
      }
    }
  }
  return gefunden;
};

describe('Icon-Namen · jeder Verweis trifft das Register', () => {
  it('findet überhaupt Verweise (sonst prüft der Test die leere Menge)', () => {
    // Stand 23.09.2026: gut 100. Die Schwelle liegt tief genug, um Umbauten
    // auszuhalten, und hoch genug, dass ein kaputtes Muster auffällt.
    expect(verweise().length).toBeGreaterThan(60);
  });

  it('kein Verweis auf einen Namen, den es nicht gibt', () => {
    const unbekannt = verweise()
      .filter((v) => !(v.name in Icons))
      .filter((v) => !AUSNAHMEN.has(`${v.datei}:${v.name}`))
      .map((v) => `${v.ort} → ${v.name}`);
    expect(unbekannt).toEqual([]);
  });

  it('jede Ausnahme wird noch gebraucht', () => {
    const benutzt = new Set(verweise().map((v) => `${v.datei}:${v.name}`));
    expect([...AUSNAHMEN].filter((a) => !benutzt.has(a))).toEqual([]);
  });
});

describe('Icon-Namen · Zuordnungstabellen', () => {
  // Stand 24.09.2026. Die Muster oben sehen `icon: '…'` — aber nicht Tabellen
  // wie `WERKZEUG_ICON = { tax: 'steuern', … }`, `CATEGORY_ICON_KEYS`,
  // `HERZ_ICON` oder `chapterIcons`, deren Werte über `Icons[…]` laufen. Ein
  // Tippfehler dort liesse das Icon genauso still verschwinden.
  const tabellen = () => {
    const gefunden = [];
    for (const datei of dateien(SRC)) {
      if (/Icon(System|Kern)\.jsx$/.test(datei)) continue;
      const inhalt = fs.readFileSync(datei, 'utf8');
      for (const m of inhalt.matchAll(/const (\w*(?:icon|Icon|ICON)\w*)\s*=\s*\{([\s\S]*?)\};/g)) {
        const werte = [...m[2].matchAll(/:\s*'([^']+)'/g)].map((w) => w[1]);
        if (werte.length) gefunden.push({ ort: `${path.basename(datei)}:${m[1]}`, werte });
      }
    }
    return gefunden;
  };

  it('findet die Tabellen überhaupt (sonst prüft der Test die leere Menge)', () => {
    const orte = tabellen().map((t) => t.ort);
    expect(orte).toEqual(expect.arrayContaining([
      'Baum3D.jsx:WERKZEUG_ICON', 'CalendarReminders.jsx:CATEGORY_ICON_KEYS',
      'DirektLinks.jsx:HERZ_ICON', 'Dashboard.jsx:chapterIcons', 'MobileNav.jsx:chapterIcons',
    ]));
  });

  it('jeder Wert in einer Icon-Tabelle steht im Register', () => {
    const unbekannt = tabellen().flatMap((t) => t.werte.filter((w) => !(w in Icons)).map((w) => `${t.ort} → ${w}`));
    expect(unbekannt).toEqual([]);
  });

  it('jeder Kapitel-Schlüssel ist auch ein Icon (Dashboard liest `Icons[ch.key]`)', async () => {
    const { CHAPTER_KEYS } = await import('../config/constants.js');
    expect(CHAPTER_KEYS.filter((k) => !(k in Icons))).toEqual([]);
  });
});

// ─── Kern-Namen im festen Teil (24.09.2026, E36) ─────────────────────────────
// Das Register ist geteilt: `IconKern.jsx` liegt in der Startdatei, die übrigen
// Icons hängt `IconSystem.jsx` erst ein, wenn eine nachgeladene Ansicht es
// mitbringt. Eine fest geladene Datei importiert darum `IconKern.jsx` — und darf
// nur Kern-Namen zeigen. Ein anderer Name bliebe dort STILL leer (bis irgendeine
// Ansicht das volle Register nachgeladen hat), also genau der Fehler oben, nur
// zeitabhängig. Geprüft: dieselben Literal-Muster und Icon-Tabellen wie oben,
// dazu die Kapitel-Schlüssel (Dashboard liest `Icons[ch.key]`).
// Grenze wie oben: ein zur Laufzeit gebildeter Name bleibt unsichtbar. Darum
// gehören Dateien mit solchen Namen (Baum3D: `Icons[b.iconName]`) NICHT in den
// festen Teil — sie importieren `IconSystem.jsx` und bekommen immer alle Icons.
describe('Icon-Namen · Kern-Namen im festen Teil', () => {
  const kernDateien = () => dateien(SRC).filter((d) =>
    !/Icon(System|Kern)\.jsx$/.test(d)
    && /from '\.{1,2}\/(?:\.\.\/)*IconKern\.jsx'/.test(fs.readFileSync(d, 'utf8')));

  it('findet die fest geladenen Icon-Nutzer (sonst prüft der Test die leere Menge)', () => {
    const namen = kernDateien().map((d) => path.basename(d));
    expect(namen).toEqual(expect.arrayContaining([
      'main.jsx', 'Dashboard.jsx', 'ExternerLink.jsx', 'StorageWarning.jsx', 'AutoSaveStatus.jsx', 'OverdueBanner.jsx',
    ]));
  });

  it('der Kern ist echt kleiner als das Register (sonst wäre die Prüfung leer)', () => {
    expect(KERN_NAMEN.length).toBeGreaterThan(20);
    expect(Object.keys(Icons).length).toBeGreaterThan(KERN_NAMEN.length);
  });

  it('jede fest geladene Datei zeigt nur Kern-Namen', () => {
    const kern = new Set(KERN_NAMEN);
    const fremd = [];
    for (const datei of kernDateien()) {
      const inhalt = fs.readFileSync(datei, 'utf8');
      const basis = path.basename(datei);
      for (const muster of MUSTER) {
        for (const m of inhalt.matchAll(muster)) {
          if (kern.has(m[1]) || AUSNAHMEN.has(`${basis}:${m[1]}`)) continue;
          fremd.push(`${basis}:${inhalt.slice(0, m.index).split('\n').length} → ${m[1]}`);
        }
      }
      for (const m of inhalt.matchAll(/const (\w*(?:icon|Icon|ICON)\w*)\s*=\s*\{([\s\S]*?)\};/g)) {
        for (const w of m[2].matchAll(/:\s*'([^']+)'/g)) {
          if (!kern.has(w[1])) fremd.push(`${basis}:${m[1]} → ${w[1]}`);
        }
      }
    }
    expect(fremd).toEqual([]);
  });

  it('jeder Kapitel-Schlüssel ist ein Kern-Icon', async () => {
    const { CHAPTER_KEYS } = await import('../config/constants.js');
    expect(CHAPTER_KEYS.filter((k) => !KERN_NAMEN.includes(k))).toEqual([]);
  });

  it('der Kern hält seine Namen fest, bevor das Register ergänzt wird', () => {
    // `Icons` ist nach dem Import von IconSystem.jsx vollständig — KERN_NAMEN nicht.
    expect(KERN_NAMEN).not.toContain('emergency');
    expect('emergency' in Icons).toBe(true);
  });
});
