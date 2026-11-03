import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { calculateSozialhilfe } from '../config/cantonalData.js';
import { wegeAusProbe, sozialhilfeAnzeige } from '../data/anspruchWege.js';
import { sozialhilfePegelState } from '../data/pegel.js';
import { Schnellcheck } from '../Schnellcheck.jsx';
import { betrag } from '../utils/geld.js';

// Predeploy 1e6819ab, Altbestand live: wegeAusProbe prüfte einkommenFehlt nicht. Eine Rentnerin ohne erfasste Rente bekam
// in Schnellcheck und Lebenssituationen einen Sozialhilfe-Betrag aus Einkommen 0. Seite, Karte und Dossier nennen keinen.
const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (k, p) => (p && typeof p === 'object' ? k + '(' + Object.values(p).join('|') + ')' : k);
const rentnerin = (finanzen = {}) => ({
  basis: { canton: 'ZH', dateOfBirth: '1955-05-01', gender: 'f', household: { adults: 1, children: [] } },
  finanzen: { employmentType: 'retired', monthlyIncome: 0, incomeType: 'netto', ...finanzen },
  wohnen: { rentAmount: 1200 }, versicherungen: { kkPremium: 300 },
});

describe('Wege ohne Betrag aus nicht erfasstem Einkommen', () => {
  it('Rentnerin ohne Rente: Weg Sozialhilfe ohne Betrag, mit dem Grund', () => {
    const s = calculateSozialhilfe(rentnerin());
    expect(s.einkommenFehlt).toBe(true);
    expect(s.deficit).toBeGreaterThan(0); // die rohe Rechnung hätte einen Betrag
    const w = wegeAusProbe(rentnerin());
    expect(w.wege.find((x) => x.key === 'soz')).toEqual({ key: 'soz', qualitative: true, renteFehlt: true });
    expect(w.monetaer.some((x) => x.key === 'soz')).toBe(false);
  });

  it('kein Pegel mit Aufstockung aus Einkommen 0', () => {
    expect(sozialhilfePegelState(rentnerin())).toBeNull();
    expect(sozialhilfeAnzeige(rentnerin({ monthlyIncome: 500 }))).toBeNull();
  });

  it('der gerenderte Schnellcheck nennt den Betrag nicht, aber den Grund', () => {
    // Der Schnellcheck zeigt Wege erst mit einem Einkommen: eine Rentnerin mit kleinem Nebenverdienst, Rente nicht erfasst.
    const p = rentnerin({ monthlyIncome: 500 });
    const roh = calculateSozialhilfe(p);
    expect(roh.einkommenFehlt).toBe(true);
    expect(roh.deficit).toBeGreaterThan(0);
    const html = renderToStaticMarkup(React.createElement(Schnellcheck, { palette, t, onNavigate: () => {}, data: p }));
    expect(html).not.toContain(betrag(roh.deficit).replace('CHF ', ''));
    expect(html).toContain('sozialhilfe.renteNichtErfasst');
  });

  it('Gegenprobe: mit erfasstem Lohn bleibt der Betrag', () => {
    const p = { ...rentnerin({ employmentType: 'employed', monthlyIncome: 800 }), basis: { ...rentnerin().basis, dateOfBirth: '1986-03-01' } };
    const soz = wegeAusProbe(p).wege.find((x) => x.key === 'soz');
    expect(soz.monthly).toBe(calculateSozialhilfe(p).deficit);
  });
});
