import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { leseDatum, plusTage, plusMonate, istVorbei, heuteIso } from '../utils/fristen.js';
import { EreignisFrist } from '../AblaufSchale.jsx';

// Befund 24.09.2026: zehn Frist-Knöpfe rechneten ab HEUTE statt ab dem Ereignis.
// Wer den Ablauf erst nach der Zustellung/Geburt/dem Todesfall öffnete, bekam
// eine Erinnerung NACH der echten Frist. Regel seither: nie später als das Gesetz.

describe('Fristen — Rechnen nach OR Art. 77', () => {
  it('Tage: der Ereignistag zählt nicht mit', () => {
    expect(plusTage('2026-09-24', 10)).toBe('2026-10-04'); // Rechtsvorschlag
    expect(plusTage('2026-12-28', 14)).toBe('2027-01-11');
    expect(plusTage('2026-11-30', -14)).toBe('2026-11-16'); // Bewilligung: 14 Tage vor Ablauf
  });

  it('Monate: gleicher Tag — fehlt er, der letzte Tag des Monats', () => {
    expect(plusMonate('2026-06-15', 3)).toBe('2026-09-15');
    expect(plusMonate('2026-11-30', 3)).toBe('2027-02-28');
    expect(plusMonate('2027-11-30', 3)).toBe('2028-02-29'); // Schaltjahr
    expect(plusMonate('2026-08-31', 3)).toBe('2026-11-30');
    expect(plusMonate('2026-01-31', 1)).toBe('2026-02-28');
  });

  it('ungültige Eingaben ergeben keine Frist — nie ein still verschobenes Datum', () => {
    for (const x of ['', undefined, null, '24.09.2026', '2026-02-31', '2026-13-01', '2026-9-1']) {
      expect(leseDatum(x), String(x)).toBeNull();
      expect(plusTage(x, 10), String(x)).toBeNull();
      expect(plusMonate(x, 3), String(x)).toBeNull();
    }
  });

  it('vorbei heisst: der letzte Tag liegt vor heute (der letzte Tag selbst zählt noch)', () => {
    expect(istVorbei('2026-09-23', '2026-09-24')).toBe(true);
    expect(istVorbei('2026-09-24', '2026-09-24')).toBe(false);
    expect(istVorbei(null, '2026-09-24')).toBe(false);
  });
});

describe('EreignisFrist — was angezeigt wird', () => {
  const t = (k, p) => (p && p.date ? `${k}|${p.date}` : k);
  const zeige = (wert) => renderToStaticMarkup(React.createElement(EreignisFrist, {
    palette: {}, t, id: 'x', frist: (d) => plusTage(d, 10), wert, onWert: () => {},
    labelKey: 'L', hinweisKey: 'H', vorbeiKey: 'V', buttonKey: 'B', doneKey: 'D', reminderTitle: 'R',
  }));

  it('ohne Datum: Feld ja, Termin nein', () => {
    const html = zeige('');
    expect(html).toContain('type="date"');
    expect(html).not.toContain('<button');
    expect(html).not.toMatch(/\|\d/);
  });

  it('Frist in der Zukunft: Hinweis und Knopf mit demselben Datum', () => {
    const html = zeige(plusTage(heuteIso(), 1));
    expect(html).toMatch(/H\|\d{2}\.\d{2}\.\d{4}/);
    expect(html).toContain('<button');
  });

  it('Frist vorbei: der ruhige Satz, KEIN Knopf — kein Zeitfenster, das es nicht mehr gibt', () => {
    const html = zeige('2020-01-01');
    expect(html).toContain('V|11.01.2020');
    expect(html).not.toContain('<button');
  });
});

// Kein Ablauf rechnet eine FRIST mehr «ab heute». Wer inDays/inMonths braucht,
// steht hier mit Grund — und sein Knopf heisst «Erinnerung», nicht «Frist».
const AUSNAHMEN = {
  'Heirat.jsx': 'Erinnerung, keine gesetzliche Frist',
  'IvVerfahren.jsx': 'Erinnerung, keine gesetzliche Frist',
  'Selbstaendigkeit.jsx': 'Erinnerung, keine gesetzliche Frist',
  'Fuehrerausweis.jsx': 'Erinnerung im Rhythmus der Kontrolle ab 75, kein Stichtag',
  'Pensionierung.jsx': 'inDays(0) nur als Vergleich «liegt in der Zukunft»',
};
const ABLAUF_DATEIEN = ['KKErstAnmeldung', 'KVGWechsel', 'ZusatzWechsel', 'NeuerJob', 'StelleVerloren',
  'UnfallKrankheit', 'UmzugAblauf', 'Pensionierung', 'BetreibungErhalten', 'Selbstaendigkeit', 'Heirat',
  'KindBekommen', 'Trennung', 'BewilligungFristen', 'Fuehrerausweis', 'AsylView', 'IvVerfahren',
  'PflegeAblauf', 'Todesfall'];

describe('Abläufe — keine Frist ab heute', () => {
  it.each(ABLAUF_DATEIEN)('%s', (name) => {
    const datei = name + '.jsx';
    const src = readFileSync(resolve(__dirname, '..', datei), 'utf8');
    const ab = /\b(inDays|inMonths)\(/.test(src);
    if (!AUSNAHMEN[datei]) expect(ab, `${datei} rechnet ab heute`).toBe(false);
  });
});
