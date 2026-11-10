// Gesundheit bekommt zwei Instrumente in der Kapitelzeile (Stebler Studios 10.11.2026, «Gesundheit (I + J)»):
// Bereit für den Ernstfall (Ring · «19/20») und Franchise-Stand (Balken · «CHF 420 von CHF 2’500»).
// Dieselben Rechnungen wie das Kapitel Notfall (bereitschaft) und die KVG-Seite (berechneFranchise).
import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { BereitRingKlein } from '../NotfallImKapitel.jsx';

const palette = { surface: '#fff', border: '#ccc', text: '#111', mid: '#444', rose: '#c55', roseDeep: '#a33', sky: '#69c' };
const quelle = (rel) => readFileSync(fileURLToPath(new URL(rel, import.meta.url)), 'utf8');

describe('Bereitschaft klein', () => {
  it('Ring, 64 px, keine Wörter, füllt sich nach erledigt/gesamt', () => {
    const halb = renderToStaticMarkup(React.createElement(BereitRingKlein, { palette, erledigt: 10, gesamt: 20 }));
    expect(halb).toContain('data-bereit="klein"');
    expect(halb).toContain('max-width:64px');
    expect(halb).not.toMatch(/<text/);
    const u = (2 * Math.PI * 14).toFixed(2);
    expect(halb).toContain('stroke-dasharray="' + (u / 2).toFixed(2) + ' ' + u + '"');
  });
  it('nichts erledigt: nur die Spur', () => {
    const leer = renderToStaticMarkup(React.createElement(BereitRingKlein, { palette, erledigt: 0, gesamt: 20 }));
    expect((leer.match(/<circle/g) || []).length).toBe(1);
  });
});

describe('Kachel-Regeln', () => {
  const panel = quelle('../InstrumentePanel.jsx');
  it('Bereitschaft mit derselben Funktion wie das Kapitel Notfall', () => {
    expect(panel).toMatch(/const bereit = bereitschaft\(data\);/);
  });
  it('Franchise mit derselben Rechnung wie die KVG-Seite, nur mit erfasster Franchise', () => {
    expect(panel).toMatch(/eigeneFr != null \? berechneFranchise\(eigeneFr, gesundheitskostenBisher\(data\)\) : null/);
  });
  it('Beträge über betrag(), «von CHF …» über i18n — beides greift beim Sichtschutz', () => {
    expect(panel).toMatch(/wert: chfBetrag\(frStand\.franchiseVerbraucht\)/);
    expect(quelle('../../i18n/de.js')).toMatch(/franchiseVon: 'von CHF \{franchise\}'/);
  });
  it('Klick führt auf den Reiter Franchise der KVG-Seite', () => {
    expect(panel).toMatch(/onNavigate\('kvg', undefined, 'franchise'\)/);
  });
  it('Gesundheit steht in der Kapitelzeile', () => {
    expect(quelle('../../Dashboard.jsx')).toMatch(/notfall: \['bereit', 'franchise'\]/);
  });
});
