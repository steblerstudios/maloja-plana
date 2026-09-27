import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { ABLAEUFE, SEARCH_VIEWS, ansichtIkon } from '../config/ansichtenRegister.js';
import { Icons } from '../IconKern.jsx';
import '../IconSystem.jsx';

// Seitenrundgang 27.09.2026: sechs Werkzeug-Köpfe zeigten ein anderes Zeichen als Menü und
// Suche (IPV und Sozialhilfe «insurance», Kalender «cowbell» …), das Register selbst gab ALV
// das Zeichen des Erwerbsersatzes und dreimal das des Tresors.
const SRC = path.join(__dirname, '..');
const lies = (f) => fs.readFileSync(path.join(SRC, f), 'utf8');
const main = lies('main.jsx');

// view → Datei, aus main.jsx gelesen: «view === 'x' && React.createElement(Komp» + «const Komp = React.lazy(() => import('./Datei.jsx'))».
const dateiVon = (view) => {
  const m = main.match(new RegExp("view === '" + view + "' && React\\.createElement\\((\\w+)"));
  if (!m) return null;
  const imp = main.match(new RegExp('const ' + m[1] + " = React\\.lazy\\(\\(\\) => import\\('\\./([\\w/]+\\.jsx)'\\)"))
    || main.match(new RegExp('import (?:\\{ )?' + m[1] + "(?: \\})? from '\\./([\\w/]+\\.jsx)'"));
  return imp ? imp[1] : null;
};

describe('Zeichen aus einer Quelle', () => {
  it('jedes Zeichen im Register gibt es', () => {
    for (const v of SEARCH_VIEWS) expect(Icons[v.icon], v.view + ': ' + v.icon).toBeTruthy();
  });

  it('keine zwei Werkzeuge teilen sich ein Zeichen, das nur eines meint', () => {
    const icon = Object.fromEntries(SEARCH_VIEWS.map((v) => [v.view, v.icon]));
    expect(icon.alv).not.toBe(icon.eo);
    expect(new Set([icon.tresor, icon.direktlinks, icon.flyer]).size).toBe(3);
  });

  it('jeder Ablauf trägt im Kopf das Zeichen aus dem Register', () => {
    let geprueft = 0;
    for (const a of ABLAEUFE) {
      const datei = dateiVon(a.view);
      if (!datei) continue;
      const src = lies(datei);
      const m = src.match(/AblaufContainer, \{[^}]*?icon: '(\w+)'/s);
      if (!m) continue; // AsylView baut ohne Schale
      expect(m[1], a.view + ' (' + datei + ')').toBe(a.icon);
      geprueft++;
    }
    expect(geprueft).toBeGreaterThanOrEqual(30);
  });

  it('kein Werkzeug-Kopf mit festem Zeichen, das vom Register abweicht', () => {
    let geprueft = 0;
    for (const v of SEARCH_VIEWS) {
      if (ABLAEUFE.some((a) => a.view === v.view)) continue;
      const datei = dateiVon(v.view);
      if (!datei) continue;
      const src = lies(datei);
      for (const m of src.matchAll(/PageTitle, \{ palette, icon: React\.createElement\(Icon, \{ name: '(\w+)'/g)) {
        expect(m[1], v.view + ' (' + datei + ')').toBe(v.icon);
      }
      geprueft++;
    }
    expect(geprueft).toBeGreaterThanOrEqual(15);
  });
});

describe('Kein Zeichen aus dem Rückfall', () => {
  // 27.09.2026: `ansichtIkon(view, rueckfall)` gibt für eine Ansicht ohne Eintrag
  // still den Rückfall zurück. Ein fehlendes Zeichen fällt dann nicht als Lücke auf,
  // sondern steht als falsches Bild da: der Querverweis «Notfallkarte» zielt auf
  // `notfalleinstieg`, das nirgends ein Zeichen hatte — und trug darum `external`,
  // das Zeichen für «verlässt Maloja», an einem Knopf, der in Maloja bleibt.
  const R = '__RUECKFALL__';

  // Querverweise in ChapterView: crosslinkBtn('schlüssel', 'ansicht', …) und die
  // Einträge ['schlüssel', 'ansicht', 'nav.crosslink.…'] in crosslinkBundle.
  const querverweisZiele = () => {
    const src = lies('ChapterView.jsx');
    return [
      ...[...src.matchAll(/crosslinkBtn\(\s*'[^']+',\s*'([^']+)'/g)].map((m) => m[1]),
      ...[...src.matchAll(/\[\s*'[^']+',\s*'([^']+)',\s*'nav\.crosslink\./g)].map((m) => m[1]),
    ];
  };

  // Feste Aufrufe `ansichtIkon('ansicht'` im ganzen Baum (Seitenköpfe der Werkzeuge).
  const festeAufrufe = () => {
    const alle = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => {
      const p = path.join(d, e.name);
      if (e.isDirectory()) return e.name === '__tests__' || e.name === 'i18n' ? [] : alle(p);
      return /\.jsx?$/.test(e.name) ? [p] : [];
    });
    return alle(SRC).flatMap((f) =>
      [...fs.readFileSync(f, 'utf8').matchAll(/ansichtIkon\(\s*'([^']+)'/g)].map((m) => m[1]));
  };

  it('findet die Ziele überhaupt (sonst prüft der Test die leere Menge)', () => {
    expect(querverweisZiele().length).toBeGreaterThanOrEqual(10);
    expect(festeAufrufe().length).toBeGreaterThanOrEqual(8);
  });

  it('jedes Querverweis-Ziel hat ein eigenes Zeichen', () => {
    const ohne = [...new Set(querverweisZiele())].filter((v) => ansichtIkon(v, R) === R);
    expect(ohne).toEqual([]);
  });

  it('jede fest genannte Ansicht hat ein eigenes Zeichen', () => {
    const ohne = [...new Set(festeAufrufe())].filter((v) => ansichtIkon(v, R) === R);
    expect(ohne).toEqual([]);
  });

  it('jedes eigene Zeichen gibt es im Register', () => {
    const ziele = [...new Set([...querverweisZiele(), ...festeAufrufe()])];
    expect(ziele.filter((v) => !Icons[ansichtIkon(v, R)])).toEqual([]);
  });
});
