import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { ABLAEUFE, SEARCH_VIEWS } from '../config/ansichtenRegister.js';
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
