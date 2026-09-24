// Gate 24.09.2026 (0.1.40-beta, a11y) · Die Pillen im Haushalt («Beziehung», «Pensioniert»)
// waren nackte Knöpfe: ein Screenreader hörte nicht, welche gewählt ist, und nicht, zu welcher
// Frage sie gehören. Gleiches Muster wie das Pillen-Select der Felder: role="radiogroup" mit
// aria-labelledby, je Pille role="radio" und aria-checked.
import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { getChapters, LIGHT_PALETTE } from '../config/constants.js';
import { ChapterViewComplete } from '../ChapterView.jsx';

const t = (k) => k;
const basis = getChapters(t).find((c) => c.key === 'basis');
const render = (data) => renderToStaticMarkup(React.createElement(ChapterViewComplete, {
  palette: LIGHT_PALETTE, t, chapter: basis, data, allData: { basis: data },
  onUpdate: () => {}, onUpdateIn: () => {}, onNavigate: () => {},
}));

const gruppeZu = (html, labelKey) => {
  const label = html.match(new RegExp(`<div id="([^"]+)"[^>]*>${labelKey.replace(/\./g, '\\.')}</div>`));
  expect(label, `Label ${labelKey} mit id`).not.toBeNull();
  const gruppe = html.match(new RegExp(`<div role="radiogroup" aria-labelledby="${label[1]}"[^>]*>(.*?)</div>`));
  expect(gruppe, `radiogroup für ${labelKey}`).not.toBeNull();
  return gruppe[1];
};

describe('Haushalt-Pillen als radiogroup', () => {
  it('«Pensioniert»: Gruppe benannt, genau eine Pille gewählt', () => {
    const html = render({ household: { adults: 1, children: [], isRetired: true } });
    const g = gruppeZu(html, 'chapters.basis.fields.household.retired');
    expect((g.match(/role="radio"/g) || []).length).toBe(2);
    expect((g.match(/aria-checked="true"/g) || []).length).toBe(1);
    expect(g).toMatch(/aria-checked="true"[^>]*>chapters\.basis\.fields\.household\.retiredYes</);
  });

  it('«Beziehung» je erwachsener Person: eigene Gruppe mit eigener id', () => {
    const html = render({ household: { adults: 3, children: [], adultsList: [{ name: '', relationship: 'partner' }, { name: '', relationship: '' }] } });
    const ids = [...html.matchAll(/<div id="([^"]+)"[^>]*>chapters\.basis\.fields\.household\.adultRelationship<\/div>/g)].map((m) => m[1]);
    expect(ids.length).toBe(2);
    expect(new Set(ids).size).toBe(2);
    for (const id of ids) expect(html).toContain(`role="radiogroup" aria-labelledby="${id}"`);
  });
});
