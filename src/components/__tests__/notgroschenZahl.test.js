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
