// Reserve-Tank wie das Netz-Schild (Stebler Studios 10.11.2026): EIN Zeichen, zwei Grössen,
// die Monate gross in der Kapitelzeile Finanzen. Die eigene Karte zuoberst (Zwischenstand
// 11c830f0) ist wieder weg: «soll lieber runter zur Tankanzeige».
import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { ReserveTank } from '../ReserveTank.jsx';

const palette = { surface: '#fff', border: '#ccc', text: '#111', mid: '#444', soft: '#777', sandDeep: '#a80', sage: '#6a6' };
const t = (k, p) => k + (p ? JSON.stringify(p) : '');
const quelle = (rel) => readFileSync(fileURLToPath(new URL(rel, import.meta.url)), 'utf8');
const tank = (groesse, savings = 6000, monthlyExpenses = 2000) =>
  renderToStaticMarkup(React.createElement(ReserveTank, { palette, t, savings, monthlyExpenses, groesse }));

describe('ReserveTank: ein Zeichen, zwei Grössen', () => {
  it('klein: nur das Bild, 64 px, keine Wörter darin', () => {
    const html = tank('klein');
    expect(html).toContain('data-tank="klein"');
    expect(html).toContain('max-width:64px');
    expect(html).not.toMatch(/<text/);
    expect(html).not.toContain('finanzUebersicht.');
  });
  it('klein ohne Ausgaben: Marke statt Zeiger', () => {
    const html = tank('klein', 5000, 0);
    expect(html).toContain('data-tank="klein"');
    expect(html).not.toContain('stroke-width="2.5"');
  });
  it('gross: Bild 256 px mit Ablesesatz', () => {
    const html = tank('gross');
    expect(html).toContain('max-width:256px');
    expect(html).toContain('finanzUebersicht.tankReadout');
  });
  it('die Kapitelzeile nimmt denselben kleinen Tank, keine eigene Zeichnung', () => {
    const panel = quelle('../InstrumentePanel.jsx');
    expect(panel).toMatch(/h\(ReserveTank, \{[^}]*groesse: 'klein'/);
    expect(panel).not.toMatch(/const miniGauge/);
  });
});

describe('Kapitelzeile Finanzen: die Monate gross (Stebler Studios 10.11.2026)', () => {
  const panel = quelle('../InstrumentePanel.jsx');
  it('Tank-Kachel trägt die Zahl, ohne Zahl bei leerem Notgroschen', () => {
    expect(panel).toMatch(/zahl: tank\.mode === 'months' && tank\.level !== 'empty'/);
    expect(panel).toMatch(/'data-instrument-zahl'[\s\S]{0,200}fontSize: text\['2xl'\]/);
  });
  it('mit Zahl kein doppelter kleiner Satz', () => {
    expect(panel).toMatch(/!tile\.zahl && h\('div'/);
  });
  it('keine eigene Karte zuoberst auf der Übersicht', () => {
    expect(quelle('../../Dashboard.jsx')).not.toMatch(/NotgroschenZahl/);
  });
});
