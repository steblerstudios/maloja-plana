// Die grosse Notgroschen-Zahl auf der Übersicht (10.11.2026): drei Zustände, eine Rechnung.
import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { NotgroschenZahl } from '../NotgroschenZahl.jsx';

const palette = { surface: '#fff', border: '#ccc', text: '#111', mid: '#444', soft: '#777' };
const t = (k, p) => k + (p ? JSON.stringify(p) : '');
const zeige = (finanzen, wohnen) => renderToStaticMarkup(React.createElement(NotgroschenZahl, {
  palette, t, onNavigate: () => {}, data: { finanzen, wohnen },
}));
const quelle = (rel) => readFileSync(fileURLToPath(new URL(rel, import.meta.url)), 'utf8');

describe('NotgroschenZahl', () => {
  it('ohne erfasste Ausgaben: nichts', () => {
    expect(zeige({ savingsAccount: 5000 }, {})).toBe('');
  });
  it('mit Notgroschen und Ausgaben: grosse Zahl, dieselbe Rechnung wie die Tankanzeige', () => {
    const html = zeige({ savingsAccount: 6000 }, { rentAmount: 2000 });
    expect(html).toContain('data-teil="notgroschen"');
    expect(html).toContain('dashboard.notgroschenTitel');
    expect(html).toMatch(/>3<\/span>/); // 6000 ÷ 2000
    expect(html).toContain('dashboard.notgroschenMonate');
  });
  it('genau ein Monat: Einzahl', () => {
    expect(zeige({ savingsAccount: 2000 }, { rentAmount: 2000 })).toContain('dashboard.notgroschenMonat<');
  });
  it('Notgroschen 0: keine grosse «0», nur der leise Satz', () => {
    const html = zeige({ savingsAccount: 0 }, { rentAmount: 2000 });
    expect(html).toContain('finanzUebersicht.tankReadoutEmpty');
    expect(html).not.toMatch(/>0<\/span>/);
  });
  it('wird nachgeladen, nicht ins Startbündel gezogen', () => {
    expect(quelle('../../Dashboard.jsx')).toMatch(/lazyMitTexten\(\(\) => import\('\.\/components\/NotgroschenZahl\.jsx'\)\)/);
  });
});

// «Gleiches System wie das Netz-Schild» (Stebler Studios 10.11.2026): EIN Tank, zwei Grössen.
import { ReserveTank } from '../ReserveTank.jsx';
const tank = (groesse, savings = 6000, monthlyExpenses = 2000) =>
  renderToStaticMarkup(React.createElement(ReserveTank, { palette: { ...palette, sandDeep: '#a80', sage: '#6a6' }, t, savings, monthlyExpenses, groesse }));

describe('ReserveTank: ein Zeichen, zwei Grössen', () => {
  it('klein: nur das Bild, 64 px, keine Wörter darin', () => {
    const html = tank('klein');
    expect(html).toContain('data-tank="klein"');
    expect(html).toContain('max-width:64px');
    expect(html).not.toMatch(/<text/);
    expect(html).not.toContain('finanzUebersicht.');
  });
  it('gross: Bild 256 px mit Ablesesatz', () => {
    const html = tank('gross');
    expect(html).toContain('max-width:256px');
    expect(html).toContain('finanzUebersicht.tankReadout');
  });
  it('Übersicht und Kapitelzeile zeigen denselben kleinen Tank', () => {
    expect(zeige({ savingsAccount: 6000 }, { rentAmount: 2000 })).toContain('data-tank="klein"');
    const panel = quelle('../InstrumentePanel.jsx');
    expect(panel).toMatch(/h\(ReserveTank, \{[^}]*groesse: 'klein'/);
    expect(panel).not.toMatch(/const miniGauge/);
  });
});
