// Unplausible Wochenstunden («80» für 80 % Pensum): das Lohn-Barometer zeigt statt eines
// halbierten Lohns die Frage nach dem Pensum. Die Beispielperson trug diese «80» seit 15.06.
import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { LohnEinordnung } from '../components/LohnEinordnung.jsx';
import de from '../i18n/de.js';
import en from '../i18n/en.js';
import fr from '../i18n/fr.js';
import itSprache from '../i18n/it.js';
import rm from '../i18n/rm.js';

const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (k, p) => (p && typeof p === 'object' && Object.keys(p).length ? k + '(' + Object.values(p).join('|') + ')' : k);
const person = (stunden) => ({
  basis: { canton: 'ZH' },
  finanzen: { monthlyIncome: '6800', incomeType: 'brutto' },
  ausbildung: { workHoursPerWeek: stunden },
});
const barometer = (stunden) => renderToStaticMarkup(React.createElement(LohnEinordnung, { palette, t, data: person(stunden) }));

describe('Lohn-Barometer bei unplausiblen Wochenstunden', () => {
  it('80 Std. → Frage nach dem Pensum, kein Median-Urteil', () => {
    const html = barometer('80');
    expect(html).toContain('lohnEinordnung.hoursImplausibleNote(80)');
    expect(html).not.toContain('lohnEinordnung.hoursUnknownNote');
    expect(html).not.toContain('overFteNote');
  });
  it('Gegenprobe: ohne Stunden bleibt der bisherige Hinweis', () => {
    expect(barometer('')).toContain('lohnEinordnung.hoursUnknownNote');
  });
  it('Gegenprobe: 42 Std. zeigen den Balken, keinen Hinweis', () => {
    const html = barometer('42');
    expect(html).not.toContain('hoursImplausibleNote');
    expect(html).not.toContain('hoursUnknownNote');
  });
  it('alle fünf Sprachen tragen den Platzhalter {hours} (sie und du)', () => {
    for (const s of [de, en, fr, itSprache, rm]) {
      const v = s.lohnEinordnung.hoursImplausibleNote;
      const varianten = typeof v === 'string' ? [v] : [v.sie, v.du];
      for (const x of varianten) expect(x).toContain('{hours}');
    }
  });
});
