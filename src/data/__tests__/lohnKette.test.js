import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { LohnEinordnung } from '../../components/LohnEinordnung.jsx';
import { LIGHT_PALETTE } from '../../config/constants.js';
import { lohnBandState, lohnKette, lohnSpiegel, lohnVergleichSperre } from '../lohnEinordnung.js';

const daten = (f = {}, rest = {}) => ({ finanzen: { incomeType: 'netto', monthlyIncome: '6200', ...f }, basis: { nationality: 'swiss' }, ...rest });
const stand = (d, stunden = 42, { alter = 34, ...rest } = {}) => lohnBandState({ income: d.finanzen.monthlyIncome, incomeType: d.finanzen.incomeType, dreizehnter: d.finanzen.dreizehnter, hoursPerWeek: stunden, alter, ...rest });
const ohneAlter = { alter: null };
const keys = (k) => k.zeilen.map((z) => z.key);

describe('Lohn-Kette', () => {
  it('Netto, 42 Std., 13. offen: vier Schritte zum Median, Hinweis zum 13.', () => {
    const d = daten();
    const k = lohnKette(stand(d), d, { alter: 34 });
    expect(keys(k)).toEqual(['ketteNetto', 'ketteBrutto', 'ketteAuf40', 'ketteMedian']);
    expect(k.hinweis13).toBe(true);
  });
  it('13. Monatslohn «Nein»: kein Hinweis, «Ja»: eigene Zeile', () => {
    const nein = daten({ dreizehnter: 'no' });
    expect(lohnKette(stand(nein), nein, { alter: 34 }).hinweis13).toBe(false);
    const ja = daten({ dreizehnter: 'yes' });
    const k = lohnKette(stand(ja), ja, { alter: 34 });
    expect(keys(k)).toContain('ketteMit13');
    expect(k.hinweis13).toBe(false);
    expect(k.zeilen.find((z) => z.key === 'ketteMit13').betrag).toBe(stand(ja).incomeVergleich);
  });
  it('Brutto eingetragen: nur die Angabe, keine Schätzung', () => {
    const d = daten({ incomeType: 'brutto', monthlyIncome: '7000' });
    expect(keys(lohnKette(stand(d), d, { alter: 34 }))).toEqual(['ketteBruttoAngabe', 'ketteAuf40', 'ketteMedian']);
  });
  it('Genau 40 Std.: keine Umrechnung', () => {
    const d = daten();
    expect(keys(lohnKette(stand(d, 40), d, { alter: 34 }))).not.toContain('ketteAuf40');
  });
  it('Ohne Alter: sagt, dass die Pensionskasse fehlt', () => {
    const d = daten();
    const s = stand(d, 42, ohneAlter);
    expect(s.income).toBeLessThan(stand(d).income);
    expect(keys(lohnKette(s, d, { alter: null }))).toContain('ketteBruttoOhnePk');
  });
  it('schweigt ohne Stunden, ohne Art, bei Rente, Selbständigkeit und Quellensteuer auf Netto', () => {
    const d = daten();
    expect(lohnKette(stand(d, 0), d, { alter: 34 })).toBeNull();
    const offen = daten({ incomeType: '' });
    expect(lohnKette(stand(offen), offen, { alter: 34 })).toBeNull();
    const selbst = daten({ employmentType: 'selfEmployed' });
    expect(lohnKette(stand(selbst), selbst, { alter: 34 })).toBeNull();
    const rente = daten({}, { basis: { household: { isRetired: true } } });
    expect(lohnKette(stand(rente), rente, { alter: 34 })).toBeNull();
    const qst = daten({}, { ausbildung: { workPermit: 'b' } });
    expect(lohnKette(stand(qst), qst, { alter: 34 })).toBeNull();
  });
  it('Quellensteuer sperrt nur die Schätzung, ein eingetragenes Brutto bleibt', () => {
    const d = daten({ incomeType: 'brutto' }, { ausbildung: { workPermit: 'b' } });
    expect(lohnKette(stand(d), d, { alter: 34 })).not.toBeNull();
  });
});

describe('Lohn-Kette, Randfälle', () => {
  it('Rentenalter: schweigt ohne «angestellt», rechnet mit', () => {
    const offen = daten();
    expect(lohnKette(stand(offen, 42, { rentenalter: true }), offen, { alter: 66, rentenalter: true })).toBeNull();
    expect(lohnSpiegel(stand(offen, 42, { rentenalter: true }), offen, { alter: 66, rentenalter: true })).toBeNull();
    const an = daten({ employmentType: 'employed' });
    expect(lohnKette(stand(an, 42, { rentenalter: true }), an, { alter: 66, rentenalter: true })).not.toBeNull();
  });
  it('vor der Beitragspflicht: ohne Abzüge, nichts geschätzt', () => {
    const d = daten({ monthlyIncome: '900' });
    const k = lohnKette(stand(d, 42, { beitragsfrei: true }), d, { alter: 16, beitragsfrei: true });
    expect(keys(k)).toContain('ketteBruttoOhneAbzug');
    expect(keys(k)).not.toContain('ketteBrutto');
  });
  it('Teilzeit mit 13.: erst auf 40 Std., dann mal 13/12', () => {
    const d = daten({ incomeType: 'brutto', monthlyIncome: '4390', dreizehnter: 'yes' });
    const k = lohnKette(stand(d, 32), d, { alter: 34 });
    expect(keys(k)).toEqual(['ketteBruttoAngabe', 'ketteAuf40', 'ketteMit13', 'ketteMedian']);
    expect(k.zeilen[1].betrag).toBe(5488);
    expect(k.zeilen[2].betrag).toBe(5945);
  });
  it('unplausible Stunden: keine Kette', () => {
    const d = daten();
    expect(lohnKette(stand(d, 61), d, { alter: 34 })).toBeNull();
  });
});

describe('Lohn-Spiegel in Finanzen', () => {
  it('Netto: Netto und Brutto, ohne Alter mit Zusatz', () => {
    const d = daten();
    expect(lohnSpiegel(stand(d), d, { alter: 34 }).key).toBe('spiegel');
    expect(lohnSpiegel(stand(d, 42, ohneAlter), d, { alter: null }).key).toBe('spiegelOhnePk');
  });
  it('kein Satz bei Brutto, Quellensteuer, Rente und vor der Beitragspflicht', () => {
    const b = daten({ incomeType: 'brutto' });
    expect(lohnSpiegel(stand(b), b, { alter: 34 })).toBeNull();
    const q = daten({}, { ausbildung: { workPermit: 'l' } });
    expect(lohnSpiegel(stand(q), q, { alter: 34 })).toBeNull();
    const d = daten();
    expect(lohnSpiegel(stand(d), d, { alter: 34, beitragsfrei: true })).toBeNull();
  });
});

describe('Sperre für Lohn-Vergleiche', () => {
  it('Rente, Selbständigkeit, Rentenalter ohne Anstellung', () => {
    expect(lohnVergleichSperre(daten({ employmentType: 'selfEmployed', incomeType: 'brutto' }))).toBe('keinLohn');
    expect(lohnVergleichSperre(daten({ employmentType: 'retired' }))).toBe('keinLohn');
    expect(lohnVergleichSperre(daten(), true)).toBe('keinLohn');
    expect(lohnVergleichSperre(daten({ employmentType: 'employed' }), true)).toBeNull();
  });
  it('Quellensteuer nur auf Netto', () => {
    expect(lohnVergleichSperre(daten({}, { ausbildung: { workPermit: 'b' } }))).toBe('quellensteuer');
    expect(lohnVergleichSperre(daten({ incomeType: 'brutto' }, { ausbildung: { workPermit: 'b' } }))).toBeNull();
    expect(lohnVergleichSperre(daten())).toBeNull();
  });
});

describe('Barometer mit Sperre', () => {
  const zeige = (f, rest = {}) => renderToStaticMarkup(React.createElement(LohnEinordnung, {
    palette: LIGHT_PALETTE, t: (k) => k, isDarkMode: false,
    data: daten({ monthlyIncome: '3000', incomeType: 'brutto', ...f }, { ausbildung: { workHoursPerWeek: '42' }, basis: { canton: 'GE', nationality: 'swiss' }, ...rest }),
  }));
  it('Selbständig in Genf: kein Urteil, keine Mindestlohn-Warnung', () => {
    const html = zeige({ employmentType: 'selfEmployed' });
    expect(html).toContain('lohnEinordnung.sperre_keinLohn');
    expect(html).not.toContain('readout');
    expect(html).not.toContain('mindestlohn');
  });
  it('Angestellt in Genf: Barometer und Mindestlohn wie bisher', () => {
    const html = zeige({ employmentType: 'employed' });
    expect(html).toContain('readout');
    expect(html).toContain('mindestlohn');
  });
});
