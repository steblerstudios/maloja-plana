import { describe, it, expect, beforeAll } from 'vitest';
import React from 'react';
import fs from 'node:fs';
import path from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { preloadPLZ, calculateIPV } from '../config/cantonalData.js';
import { calculateMonthlyBudget } from '../budgetSync.js';
import { praemienBelegState } from '../data/praemienBeleg.js';
import { ipvAbzug } from '../data/ipvAbzug.js';
import { KKLastCard } from '../KKLastCard.jsx';
import { PraemienBeleg } from '../components/PraemienBeleg.jsx';

// K31 NE, Re-Review PR #478 (28.09.2026): Im gewählten Band über der Art.-16-Schwelle
// (RSN 821.102: revenu effectif unter 15 000 ⇒ nur auf Gesuch) zog data/ipvAbzug.js den Betrag
// trotzdem ab — Probe 16 000 ⇒ { betrag: 611, grund: 'geschaetzt' }. Budget, KK-Last-Karte und
// Prämienbeleg zeigten den Hinweis nicht. Jetzt: das Ergebnis trägt `gesuchNoetig`, ipvAbzug zieht
// nichts ab (Grund 'gesuchNoetig'), und die drei Leser nennen den Satz, den das Ergebnis mitbringt
// (Muster wie die Anmeldefrist LU/FR).

const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (k, p) => (p && typeof p === 'object' && Object.keys(p).length ? k + '(' + Object.values(p).join('|') + ')' : k);
const kk = (data) => renderToStaticMarkup(React.createElement(KKLastCard, { palette, t, data, onNavigate: () => {} }));
const beleg = (data) => renderToStaticMarkup(React.createElement(PraemienBeleg, { palette, t, state: praemienBelegState(data) }));
const HINWEIS = 'ipv.neGesuchNichtAbgezogen';

const person = (jahresEinkommen, extra = {}) => ({
  basis: { canton: 'NE', dateOfBirth: '1980-05-01', maritalStatus: 'single', household: { adults: 1, children: [] } },
  finanzen: { monthlyIncome: jahresEinkommen / 12 },
  wohnen: { postalCode: '2000', city: 'Neuchâtel' },
  versicherungen: { kkPremium: 700, franchise: '300' },
  ...extra,
});

beforeAll(async () => {
  preloadPLZ();
  await import('../config/ipvNeuchatel.js');
  await new Promise((r) => setTimeout(r, 0));
});

describe('NE im Band über der Art.-16-Schwelle: nichts abgezogen, Grund in allen drei Lesern', () => {
  it('das Ergebnis rechnet weiter (611), trägt aber gesuchNoetig', () => {
    expect(calculateIPV(person(16000))).toMatchObject({ amount: 611, gesuchNoetig: true, gesuchNichtAbgezogenKey: HINWEIS });
  });
  it('ipvAbzug: 0, Grund gesuchNoetig (vorher 611 geschätzt)', () => {
    expect(ipvAbzug(person(16000))).toEqual({ betrag: 0, grund: 'gesuchNoetig', frist: null });
  });
  it('Budget: nichts abgezogen, eigener Hinweis', () => {
    const b = calculateMonthlyBudget(person(16000), t);
    expect(b.ipvRelief).toBe(0);
    expect(b.ipvGesuchHinweisKey).toBe(HINWEIS);
    expect(b.recommendations.map((r) => r.text)).toContain(HINWEIS);
    expect(b.recommendations.map((r) => r.text).some((x) => x.startsWith('budget.ipvHint('))).toBe(false);
  });
  it('KK-Last-Karte: keine Entlastung, der Hinweis steht da', () => {
    const html = kk(person(16000));
    expect(html).not.toContain('kkLast.ipvRelief');
    expect(html).toContain(HINWEIS);
  });
  it('Prämienbeleg: kein Abzug, Prämie ganz selbst, der Hinweis steht da', () => {
    expect(praemienBelegState(person(16000))).toMatchObject({ mode: 'gesuch', verbilligung: 0, praemie: 700, selbst: 700, noteKey: HINWEIS });
    const html = beleg(person(16000));
    expect(html).toContain(HINWEIS);
    expect(html).not.toContain('CHF 611');
  });
  it('eine eingetragene Verfügung gilt davor — dann ist das Gesuch belegt', () => {
    const d = person(16000, { anspruch: { ipv: { status: 'bestaetigt', betrag: 611, datum: '2026-03-01', kanton: 'NE', jahr: 2026 } } });
    expect(ipvAbzug(d)).toEqual({ betrag: 611, grund: 'bestaetigt', frist: null });
  });
});

describe('Gegenprobe über dem Band (17 000): Abzug wie bisher, kein Hinweis', () => {
  it('in ipvAbzug und allen drei Lesern', () => {
    const d = person(17000);
    const betrag = calculateIPV(d).amount;
    expect(betrag).toBe(611);
    expect(ipvAbzug(d)).toMatchObject({ betrag, grund: 'geschaetzt' });
    const b = calculateMonthlyBudget(d, t);
    expect(b.ipvRelief).toBe(betrag);
    expect(b.ipvGesuchHinweisKey).toBeNull();
    expect(kk(d)).not.toContain(HINWEIS);
    expect(praemienBelegState(d)).toMatchObject({ mode: 'eligible', verbilligung: betrag });
  });
});

describe('Text in allen fünf Sprachen', () => {
  it('ipv.neGesuchNichtAbgezogen existiert', async () => {
    for (const sprache of ['de', 'fr', 'it', 'en', 'rm']) {
      const txt = (await import(`../i18n/${sprache}.js`)).default.ipv.neGesuchNichtAbgezogen;
      expect(typeof txt, sprache).toBe('string');
      expect(txt.length).toBeGreaterThan(60);
    }
  }, 20000);
});

// Wächter: `gesuchNoetig` setzt nur das Neuenburger Modul und liest nur ipvAbzug — die Leser
// gehen über den Grund von ipvAbzug, nicht selbst an das Feld.
describe('Wächter · gesuchNoetig', () => {
  const SRC = path.resolve(__dirname, '..');
  const quellen = [];
  const lauf = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) { if (!['__tests__', 'i18n', 'assets'].includes(e.name)) lauf(p); }
      else if (/\.(js|jsx)$/.test(e.name) && !/\.test\./.test(e.name)) quellen.push(p);
    }
  };
  lauf(SRC);
  const code = (p) => fs.readFileSync(p, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`])\/\/.*$/gm, '$1');
  it('nur config/ipvNeuchatel.js (setzt) und data/ipvAbzug.js (liest)', () => {
    const treffer = quellen.filter((p) => /\bgesuchNoetig\b/.test(code(p))).map((p) => path.relative(SRC, p).split(path.sep).join('/'));
    expect(treffer.sort()).toEqual(['config/ipvNeuchatel.js', 'data/ipvAbzug.js']);
  });
});
