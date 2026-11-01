import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { LohnEinordnung } from '../LohnEinordnung.jsx';
import { createT } from '../../i18n/index.js';
import de from '../../i18n/de.js';

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
