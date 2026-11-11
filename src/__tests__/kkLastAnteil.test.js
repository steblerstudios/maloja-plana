// B-R4 (Instrumente-Matrix 10.11.2026): Die KK-Last (Grundversicherungs-Prämie ÷ Monatseinkommen) stand dreimal
// inline gerechnet — KKLastCard, KKLastSpiegel und das Kapitel Versicherungen. Eine Rechnung je Wahrheit:
// alle drei Orte rufen kkLastAnteil und zeigen dieselbe Zahl.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { KKLastCard, KKLastSpiegel, kkLastAnteil } from '../KKLastCard.jsx';
import { VersicherungenInstrument } from '../components/VersicherungenInstrument.jsx';
import { LIGHT_PALETTE } from '../config/constants.js';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import { zahl } from '../utils/geld.js';

const t = createT({ de }, 'de', 'sie');
const quelle = (datei) => fs.readFileSync(path.join(__dirname, '..', datei), 'utf8');

describe('kkLastAnteil — eine Rechnung für die KK-Last', () => {
  it('teilt die Prämie durch das Monatseinkommen, in Prozent', () => {
    const r = kkLastAnteil({ versicherungen: { kkPremium: '450' }, finanzen: { monthlyIncome: '6000' } });
    expect(r).toEqual({ praemie: 450, einkommen: 6000, anteil: 7.5 });
  });

  it('ohne Prämie oder ohne Einkommen: keine Zahl (null), nie eine leere 0', () => {
    expect(kkLastAnteil({ versicherungen: { kkPremium: '450' }, finanzen: {} })).toBeNull();
    expect(kkLastAnteil({ versicherungen: {}, finanzen: { monthlyIncome: '6000' } })).toBeNull();
    expect(kkLastAnteil({ versicherungen: { kkPremium: '0' }, finanzen: { monthlyIncome: '6000' } })).toBeNull();
    expect(kkLastAnteil({ versicherungen: { kkPremium: '450' }, finanzen: { monthlyIncome: '-1' } })).toBeNull();
    expect(kkLastAnteil(null)).toBeNull();
  });

  it('alle drei Orte zeigen dieselbe Zahl', () => {
    const data = { versicherungen: { kkPremium: '487.35' }, finanzen: { monthlyIncome: '5730', incomeType: 'netto' } };
    const erwartet = zahl(kkLastAnteil(data).anteil, { hoechstens: 1 }) + ' %';
    expect(erwartet).toBe('8.5 %');
    const props = { palette: LIGHT_PALETTE, t, data, onNavigate: () => {} };
    expect(renderToStaticMarkup(React.createElement(KKLastCard, props))).toContain(erwartet);
    expect(renderToStaticMarkup(React.createElement(KKLastSpiegel, props))).toContain(erwartet);
    expect(renderToStaticMarkup(React.createElement(VersicherungenInstrument, {
      palette: LIGHT_PALETTE, t, versicherungen: data.versicherungen, allData: data, onNavigate: () => {},
    }))).toContain(erwartet);
  });

  it('Wächter: keine Anzeige rechnet die KK-Last selbst', () => {
    const inline = /\(\s*(premium|kkPraemie|praemie)\s*\/\s*(income|einkommen)\s*\)/;
    for (const datei of ['KKLastCard.jsx', 'components/VersicherungenInstrument.jsx']) {
      const code = quelle(datei).replace(/export const kkLastAnteil[\s\S]*?\n};\n/, '');
      expect(code, datei).not.toMatch(inline);
    }
    expect(quelle('components/VersicherungenInstrument.jsx')).toMatch(/kkLastAnteil\(/);
  });

  it('der Weg ins Kapitel Versicherungen folgt CHAPTER_KEYS, nicht einer festen 3', () => {
    for (const datei of ['KKLastCard.jsx', 'components/InstrumentePanel.jsx']) {
      expect(quelle(datei), datei).not.toMatch(/onNavigate\('chapter',\s*\d+\)/);
    }
  });
});
