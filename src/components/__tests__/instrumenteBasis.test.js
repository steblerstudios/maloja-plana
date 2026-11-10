// Basis: drei Instrumente (Stebler Studios 10.11.2026, «Basis (A + B)», dann «alle drei»):
// Ausweis (Lebensordner, type 'id' mit Ablaufdatum), Referenzalter (AHV 21, referenzalterMonate), Grundordnung.
import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { bisReferenzalter } from '../../utils/referenzalterAbstand.js';
import { InstrumentePanel } from '../InstrumentePanel.jsx';

const palette = { bg: '#fff', surface: '#fff', up: '#eee', border: '#ccc', text: '#111', mid: '#444', soft: '#777', sand: '#c90', sage: '#6a6', sky: '#69c', rose: '#c55', gold: '#b80' };
const t = (k, p) => k + (p ? JSON.stringify(p) : '');
const quelle = (rel) => readFileSync(fileURLToPath(new URL(rel, import.meta.url)), 'utf8');
const kachel = (props) => renderToStaticMarkup(React.createElement(InstrumentePanel, { palette, t, data: {}, onNavigate: () => {}, ...props }));

describe('bisReferenzalter: dieselbe Regel wie alterUndRentenalter (AHV 21)', () => {
  const heute = new Date(2026, 10, 10);
  it('Mann JG 1992: 65', () => {
    expect(bisReferenzalter({ dateOfBirth: '1992-03-15', gender: 'male' }, heute)).toMatchObject({ referenzMonate: 780, jahre: 30, restMonate: 4, erreicht: false });
  });
  it('Frau JG 1962: 64 Jahre und 6 Monate', () => {
    expect(bisReferenzalter({ dateOfBirth: '1962-06-01', gender: 'female' }, heute).referenzMonate).toBe(774);
  });
  it('erreicht im Monat des Geburtstags', () => {
    expect(bisReferenzalter({ dateOfBirth: '1961-11-01', gender: 'male' }, heute).erreicht).toBe(true);
  });
  it('ohne Geburtsdatum: nichts', () => {
    expect(bisReferenzalter({}, heute)).toBeNull();
  });
});

describe('Kacheln', () => {
  it('Ausweis: frühestes Ablaufdatum der Ausweis-Dokumente, Kalenderblatt', () => {
    const html = kachel({ nur: ['ausweis'], dokumente: [
      { type: 'id', expiryDate: '2031-05-01' }, { type: 'id', expiryDate: '2028-02-01' }, { type: 'lease', expiryDate: '2026-12-01' },
    ] });
    expect(html).toContain('instrumente.ausweisSatz');
    expect(html).toContain('2028');
    expect(html).not.toContain('2031');
  });
  it('Ausweis abgelaufen: anderer Satz', () => {
    expect(kachel({ nur: ['ausweis'], dokumente: [{ type: 'id', expiryDate: '2020-01-01' }] })).toContain('instrumente.ausweisAbgelaufenSatz');
  });
  it('ohne Ausweis-Dokument: einrichten', () => {
    expect(kachel({ nur: ['ausweis'], dokumente: [] })).toContain('instrumente.setup');
  });
  it('Grundordnung: dieselbe Zahl wie die Fortschritts-Karte', () => {
    expect(kachel({ nur: ['grundordnung'], grundordnungStand: { filled: 12, total: 15 } })).toContain('12/15');
    expect(quelle('../../Dashboard.jsx')).toMatch(/grundordnungStand: mvo/);
  });
  it('Referenzalter ohne Geschlecht: Hinweis auf 65 und AHV 21', () => {
    expect(kachel({ nur: ['referenz'], data: { basis: { dateOfBirth: '1992-03-15' } } })).toContain('instrumente.referenzOhneGeschlecht');
  });
  it('Basis steht mit drei Instrumenten in der Kapitelzeile', () => {
    expect(quelle('../../Dashboard.jsx')).toMatch(/basis: \['ausweis', 'referenz', 'grundordnung'\]/);
  });
});
