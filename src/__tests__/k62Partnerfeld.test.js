import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { getChapters, LIGHT_PALETTE } from '../config/constants.js';
import { ChapterViewComplete, zeigtPartnereinkommen } from '../ChapterView.jsx';

// K62 Punkt 3 (Bau-Liste §15/§21, Oktober-Punkte): Das Feld «Nettolohn Partner/in» erschien nur bei
// zwei oder mehr erfassten Erwachsenen. Wer «verheiratet» wählte und die zweite Person noch nicht
// erfasst hatte, bekam im Steuerrechner «Angabe zum Partnereinkommen fehlt» (R4) — ohne ein Feld,
// in dem sie sich machen liess. Jetzt erscheint das Feld auch bei «verheiratet» und «Konkubinat».
// Sanft gekoppelt: nichts wird vorbelegt, die Erwachsenen-Liste bleibt, wie sie ist.

const t = (k) => k;
const basis = getChapters(t).find((c) => c.key === 'basis');
const render = (data) => renderToStaticMarkup(React.createElement(ChapterViewComplete, {
  palette: LIGHT_PALETTE, t, chapter: basis, data, allData: { basis: data },
  onUpdate: () => {}, onUpdateIn: () => {}, onNavigate: () => {},
}));
const hatFeld = (html) => /<input[^>]*id="hh-partner-income"/.test(html);
const ein = (maritalStatus) => ({ maritalStatus, household: { adults: 1, children: [] } });

describe('K62.3 · Feld «Nettolohn Partner/in»', () => {
  it('verheiratet oder Konkubinat, erst eine Person erfasst: das Feld erscheint', () => {
    expect(hatFeld(render(ein('married')))).toBe(true);
    expect(hatFeld(render(ein('cohabiting')))).toBe(true);
  });

  it('ledig, geschieden, verwitwet oder ohne Angabe, allein: kein Feld (wie bisher)', () => {
    for (const s of ['single', 'divorced', 'widowed', undefined]) expect(hatFeld(render(ein(s))), String(s)).toBe(false);
  });

  it('zwei Erwachsene: das Feld erscheint wie bisher, unabhängig vom Zivilstand', () => {
    expect(hatFeld(render({ maritalStatus: 'single', household: { adults: 2, children: [] } }))).toBe(true);
  });

  it('nichts wird vorbelegt: leeres Feld bleibt leer, die Erwachsenen-Liste bleibt bei einer Person', () => {
    const html = render(ein('married'));
    const feld = html.match(/<input[^>]*id="hh-partner-income"[^>]*>/)[0];
    expect(feld).toContain('value=""');
    expect(html).not.toContain('chapters.basis.fields.household.adultLabel');
  });

  it('eine gespeicherte 0 bleibt sichtbar (K62.2) — auch im neuen Fall', () => {
    const html = render({ maritalStatus: 'married', household: { adults: 1, children: [], partnerIncome: '0' } });
    expect(html.match(/<input[^>]*id="hh-partner-income"[^>]*>/)[0]).toContain('value="0"');
  });

  it('zeigtPartnereinkommen: die Regel für sich', () => {
    expect(zeigtPartnereinkommen(1, 'married')).toBe(true);
    expect(zeigtPartnereinkommen(1, 'cohabiting')).toBe(true);
    expect(zeigtPartnereinkommen(2, 'single')).toBe(true);
    expect(zeigtPartnereinkommen(1, 'single')).toBe(false);
    expect(zeigtPartnereinkommen(1, undefined)).toBe(false);
  });
});
