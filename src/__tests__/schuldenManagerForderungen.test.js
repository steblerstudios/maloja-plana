// Schulden R2, Fix-Welle Teil 1 (B 12–15, C 17–19): Forderungs-Karten im Schuldenmanager.
// Die Ansicht «Schulden» wird über `startView` direkt gerendert (kein DOM im Test-Setup);
// Klick-Verdrahtung wird, wie im übrigen Repo, am Quelltext geprüft.
import { describe, it, expect } from 'vitest';
import React from 'react';
import fs from 'node:fs';
import path from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { SchuldenManager } from '../SchuldenManager.jsx';
import { LIGHT_PALETTE as palette } from '../config/constants.js';

const t = (k, v) => k + (v ? JSON.stringify(v) : '');
const quelle = fs.readFileSync(path.resolve(__dirname, '../SchuldenManager.jsx'), 'utf8');
const kvg = fs.readFileSync(path.resolve(__dirname, '../KVGLeistungen.jsx'), 'utf8');
const data = {
  schulden: [
    { id: 1, creditor: 'Steueramt', amount: 100, status: 'open', category: 'steuern' },
    { id: 2, creditor: '', amount: 50, status: 'paid', category: 'sonstige' },
  ],
  betreibung: [], verlustscheine: [], finanzen: {}, basis: {},
};
const html = renderToStaticMarkup(React.createElement(SchuldenManager, { palette, t, data, onSave: () => {}, onNavigate: () => {}, startView: 'debts' })).replace(/&quot;/g, '"');

describe('B 12 · Statusknopf: aria-label beginnt mit dem sichtbaren Text', () => {
  it('offen: «Als bezahlt markieren» + Name', () => {
    expect(html).toContain('aria-label="schulden.alsBezahlt Steueramt"');
    expect(html).toMatch(/aria-label="schulden\.alsBezahlt Steueramt"[^>]*>schulden\.alsBezahlt</);
  });
  it('bezahlt, ohne Namen: «Wieder offen» + Ersatzname', () => {
    expect(html).toContain('aria-label="schulden.wiederOffen schulden.posten.ohneName"');
  });
});

describe('B 13 · Statuswechsel wird angesagt', () => {
  it('versteckte Status-Zeile steht von Anfang an im DOM (leer)', () => {
    expect(html).toMatch(/<p role="status"[^>]*data-testid="status-ansage"[^>]*><\/p>/);
  });
  it('Klick setzt die Ansage mit Name und neuem Stand', () => {
    expect(quelle).toMatch(/setStatusAnsage\(t\(neu === 'paid' \? 'schulden\.ansageBezahlt' : 'schulden\.ansageOffen', \{ name: forderungName\(debt, t\) \}\)\)/);
  });
  it('kein aria-pressed am Statusknopf', () => {
    expect(html).not.toContain('aria-pressed');
  });
});

describe('B 14 · Kategorie-Hinweis hängt per aria-describedby am Select, nur solange sichtbar', () => {
  it('Hinweis hat eine id, Select verweist nur bei sichtbarem Hinweis darauf', () => {
    expect(quelle).toMatch(/const katHilfeSichtbar = newDebt\.category === 'krankenkasse' \|\| newDebt\.category === 'gesundheit';/);
    expect(quelle).toMatch(/'aria-describedby': katHilfeSichtbar \? 'kat-hilfe' : undefined/);
    expect(quelle).toMatch(/katHilfeSichtbar && React\.createElement\('div', \{ id: 'kat-hilfe', 'data-testid': 'kat-hilfe'/);
  });
  it('Standard (Kategorie «sonstige»): kein aria-describedby auf dem Select', () => {
    expect(html).not.toContain('aria-describedby="kat-hilfe"');
  });
});

describe('B 15 · Rückfall für namenlose Forderung ist ein Wort, kein Strich', () => {
  it('Titel und Löschen-Knopf', () => {
    expect(html).toContain('>schulden.posten.ohneName<');
    expect(html).toContain('aria-label="common.delete schulden.posten.ohneName"');
    expect(html).not.toContain('>—<');
  });
});

describe('C 18/19 · KVG-Zweitknopf und Hinweis', () => {
  it('Schuldenmanager-Weg: AblaufLink statt eigenem Link, «wird geführt» in palette.mid', () => {
    expect(kvg).toMatch(/AblaufLink, \{ palette, label: t\('kvg\.zumSchuldenmanager'\)/);
    expect(kvg).toMatch(/color: palette\.mid \}\s*\}, t\('kvg\.wirdGefuehrt'\)/);
  });
  it('Zweitknopf in Tokens, wie im Schuldenmanager (text.xs, weight.semi)', () => {
    const z = kvg.match(/const zweitKnopf = \{[^\n]*\};/)[0];
    expect(z).toMatch(/fontSize: text\.xs/);
    expect(z).toMatch(/fontWeight: weight\.semi/);
    expect(z).not.toMatch(/padding: '\d+px/);
    expect(kvg).toMatch(/\.\.\.zweitKnopf, marginTop: space\.xs \}/);
  });
});
