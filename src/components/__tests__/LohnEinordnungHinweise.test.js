import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { LohnEinordnung } from '../LohnEinordnung.jsx';
import { createT } from '../../i18n/index.js';
import de from '../../i18n/de.js';
import { istAngestellt } from '../../utils/anstellung.js';
import { mindestlohnNichtAnwendbar } from '../../utils/monatsrechnung.js';
import { schildOptionen } from '../../data/schutzschild.js';
import { lohnVergleichSperre } from '../../data/lohnEinordnung.js';

const t = createT({ de }, 'de', 'sie');
const palette = new Proxy({}, { get: () => '#000000' });
const zeige = (stunden) => renderToStaticMarkup(React.createElement(LohnEinordnung, {
  palette, t, isDarkMode: false,
  data: { basis: { canton: 'ZH', birthdate: '1985-03-01' }, finanzen: { monthlyIncome: '6000', incomeType: 'brutto', employmentType: 'employed', dreizehnter: 'no' }, ausbildung: { workHoursPerWeek: stunden } },
}));

describe('LohnEinordnung: Hinweise in der Anzeige', () => {
  it('fragt bei «0.8» nach dem Pensum und zeigt keine Kette', () => {
    const html = zeige('0.8');
    expect(html).toContain('sehr wenig');
    expect(html).not.toContain('data-teil="lohn-kette"');
  });

  it('nennt bei der Kette, dass Lernende im Median fehlen', () => {
    const html = zeige('40');
    expect(html).toContain('data-teil="lohn-kette"');
    expect(html).toContain('Lernenden und Praktikant:innen');
  });
});

describe('Status Lernend', () => {
  const lernend = { basis: { canton: 'GE', birthdate: '2008-03-01' }, finanzen: { monthlyIncome: '900', incomeType: 'brutto', employmentType: 'apprentice' }, ausbildung: { workHoursPerWeek: '40' } };

  it('zeigt statt Balken und Mindestlohn-Warnung den Satz zu Lernenden', () => {
    const html = renderToStaticMarkup(React.createElement(LohnEinordnung, { palette, t, isDarkMode: false, data: lernend }));
    expect(html).toContain('Lehrvertrag');
    expect(html).not.toContain('data-teil="lohn-kette"');
  });

  it('gilt als angestellt, aber der Mindestlohn ist nicht anwendbar', () => {
    expect(istAngestellt(lernend.finanzen)).toBe(true);
    expect(mindestlohnNichtAnwendbar(lernend)).toBe(true);
    expect(mindestlohnNichtAnwendbar({ finanzen: { employmentType: 'employed' } })).toBe(false);
    expect(schildOptionen(lernend).employed).toBe(true);
    expect(lohnVergleichSperre(lernend, false)).toBe('lernend');
  });
});

// Erlaubnisliste: Wer `employed` direkt vergleicht, vergisst die Lernenden. Der Status gilt nur über istAngestellt.
describe('Wächter Anstellungstyp', () => {
  it('kein direkter Vergleich auf employed ausserhalb von anstellung.js', () => {
    const dateien = import.meta.glob(['/src/**/*.{js,jsx}', '!/src/**/__tests__/**', '!/src/i18n/**'], { query: '?raw', import: 'default', eager: true });
    const treffer = Object.entries(dateien).filter(([pfad, code]) => !pfad.endsWith('utils/anstellung.js') && /[!=]==\s*'employed'/.test(code)).map(([pfad]) => pfad);
    expect(treffer).toEqual([]);
  });
});
