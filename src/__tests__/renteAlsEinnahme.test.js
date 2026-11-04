import { describe, it, expect, beforeAll } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { calculateSozialhilfe, calculateIPV, ladeIPVModelle } from '../config/cantonalData.js';
import { wegeAusProbe, ipvAnzeige, sozialhilfeAnzeige } from '../data/anspruchWege.js';
import { einnahmenErfasst } from '../utils/unterstuetzungseinheit.js';
import { sozialhilfeVorbefuellung } from '../utils/sozialhilfeVorbefuellung.js';
import { Schnellcheck } from '../Schnellcheck.jsx';
import { QuickCheck } from '../components/Leistungsliste.jsx';
import { betrag } from '../utils/geld.js';

// Predeploy 83348731: Rentnerin, AG, AHV 1800 im Rentenfeld, PK 0, Lohn leer. Seite und Dossier nannten Sozialhilfe
// CHF 1011 und IPV 295; Schnellcheck, Lebenssituationen, Dashboard und AnspruchCheck verlangten «Einkommen eingeben».
// Eine Bedingung einnahmenErfasst (Lohn oder Rente) für alle Orte; das Einkommensfeld sagt, dass die Renten mitzählen.
const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (k, p) => (p && typeof p === 'object' ? k + '(' + Object.values(p).join('|') + ')' : k);
const rentnerin = (finanzen = {}) => ({
  basis: { canton: 'AG', zip: '5000', dateOfBirth: '1952-03-01', gender: 'female', household: { adults: 1, children: [] } },
  finanzen: { employmentType: 'retired', incomeType: 'netto', ahvRente: 1800, bvgRente: 0, ...finanzen },
  wohnen: { rentAmount: 1300 }, versicherungen: { kkPremium: 450 },
});

beforeAll(async () => { await ladeIPVModelle(); });

describe('Rente als Einnahme in den Wegen', () => {
  it('eine Bedingung: Lohn oder Rente über 0', () => {
    expect(einnahmenErfasst({ monthlyIncome: 0 })).toBe(false);
    expect(einnahmenErfasst({ monthlyIncome: 500 })).toBe(true);
    expect(einnahmenErfasst({ ahvRente: 1800 })).toBe(true);
    expect(einnahmenErfasst({ ahvRente: 0, bvgRente: 0 })).toBe(false);
  });

  it('Wege und Anzeigen nennen dieselben Beträge wie Seite und Dossier', () => {
    const p = rentnerin({ monthlyIncome: 0 });
    const s = calculateSozialhilfe(p);
    const ipv = calculateIPV(p);
    expect(s.deficit).toBeGreaterThan(0);
    expect(ipv.amount).toBeGreaterThan(0);
    const w = wegeAusProbe(p);
    expect(w.wege.find((x) => x.key === 'soz')?.monthly).toBe(s.deficit);
    expect(w.wege.find((x) => x.key === 'ipv')?.monthly).toBe(ipv.amount);
    expect(ipvAnzeige(p).art).not.toBe('leer');
    expect(sozialhilfeAnzeige(p)).not.toBeNull();
  });

  it('der gerenderte Schnellcheck zeigt das Ergebnis, nicht «Einkommen eingeben», und sagt, dass die Rente mitzählt', () => {
    const html = renderToStaticMarkup(React.createElement(Schnellcheck, { palette, t, onNavigate: () => {}, data: rentnerin() }));
    expect(html).not.toContain('schnellcheck.enterIncome');
    expect(html).toContain('einkommensfeld.rentenEingerechnet(' + '1’800' + ')');
    expect(html).toContain(betrag(calculateSozialhilfe(rentnerin()).deficit).replace('CHF ', ''));
  });

  it('das gerenderte Dashboard ebenso', () => {
    const html = renderToStaticMarkup(React.createElement(QuickCheck, { palette, t, onNavigate: () => {}, data: rentnerin() }));
    expect(html).not.toContain('>schnellcheck.enterIncome<');
    expect(html).toContain('einkommensfeld.rentenEingerechnet(');
  });

  it('ohne Lohn und ohne Rente bleibt es bei «Einkommen eingeben»', () => {
    const html = renderToStaticMarkup(React.createElement(Schnellcheck, { palette, t, onNavigate: () => {}, data: rentnerin({ ahvRente: '', bvgRente: '' }) }));
    expect(html).toContain('schnellcheck.enterIncome');
    expect(html).not.toContain('einkommensfeld.rentenEingerechnet');
  });

  it('Rappen: Karte und Rechner zählen die anderen Einkünfte gleich (je Zeile auf Franken)', () => {
    const p = rentnerin({ ahvRente: 1500.6, bvgRente: 300.6, familienzulagen: 0.4, monthlyIncome: '' });
    const karte = calculateSozialhilfe(p).income;
    expect(karte).toBe(1802);
    expect(Number(sozialhilfeVorbefuellung(p).andereEinkuenfte)).toBe(karte);
  });
});
