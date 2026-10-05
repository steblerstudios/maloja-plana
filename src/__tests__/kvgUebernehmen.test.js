// Schulden R2 · Task 4 (05.10.2026): Arztrechnung bewusst als Forderung führen (③), im Beleg-Tab des KVG-Trackers.
import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { KVGLeistungen } from '../KVGLeistungen.jsx';
import { LIGHT_PALETTE as palette } from '../config/constants.js';

const t = (k, v) => k + (v ? JSON.stringify(v) : '');
const JAHR = new Date().getFullYear();
const heuteDatum = `${JAHR}-01-15`;
const beleg = (extra) => ({ id: 'b1', datum: heuteDatum, betrag: 400, status: 'offen', frist: '2020-01-31', nichtGedeckt: 0, eingereicht: false, ...extra });
const render = (belege, props = {}) => renderToStaticMarkup(
  React.createElement(KVGLeistungen, {
    palette, t, data: { basis: {}, versicherungen: { kkBelege: belege } },
    onUpdateData: () => {}, onNavigate: () => {}, initialTab: 'franchise', ...props,
  })
);

describe('KVG-Tracker · Beleg als Forderung führen', () => {
  it('offener Beleg mit abgelaufener Frist und onUebernehmen: Knopf', () => {
    const html = render([beleg()], { onUebernehmen: () => {} });
    expect(html).toContain('kvg.alsForderung');
    expect(html).not.toContain('kvg.wirdGefuehrt');
  });
  it('offener Beleg ohne Frist: Knopf (ohne Frist gilt als übernehmbar)', () => {
    expect(render([beleg({ frist: '' })], { onUebernehmen: () => {} })).toContain('kvg.alsForderung');
  });
  it('offener Beleg mit Frist in der Zukunft: kein Knopf', () => {
    expect(render([beleg({ frist: '2999-01-01' })], { onUebernehmen: () => {} })).not.toContain('kvg.alsForderung');
  });
  it('verbundener Beleg: Zeile «wird geführt» mit Weg, kein Knopf', () => {
    const html = render([beleg({ forderungId: '123' })], { onUebernehmen: () => {} });
    expect(html).toContain('kvg.wirdGefuehrt');
    expect(html).toContain('kvg.zumSchuldenmanager');
    expect(html).not.toContain('kvg.alsForderung');
  });
  it('Beispielmodus (ohne onUebernehmen): kein Knopf', () => {
    expect(render([beleg()])).not.toContain('kvg.alsForderung');
  });
  it('bezahlter Beleg: kein Knopf', () => {
    expect(render([beleg({ status: 'bezahlt' })], { onUebernehmen: () => {} })).not.toContain('kvg.alsForderung');
  });
  it('verbundener Beleg: Löschen-Knopf ersetzt durch Hinweis, kein stilles Mitlöschen', () => {
    const html = render([beleg({ forderungId: '123' })], { onUebernehmen: () => {} });
    expect(html).toContain('kvg.loeschenVerbunden');
    expect(html).not.toContain('kvg.belegRemove');
  });
  it('unverbundener Beleg: Löschen-Knopf bleibt', () => {
    const html = render([beleg()], { onUebernehmen: () => {} });
    expect(html).toContain('kvg.belegRemove');
    expect(html).not.toContain('kvg.loeschenVerbunden');
  });
});
