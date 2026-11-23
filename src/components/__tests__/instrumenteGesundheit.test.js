// Gesundheit bekommt zwei Instrumente in der Kapitelzeile (Stebler Studios 10.11.2026, «Gesundheit (I + J)»):
// Bereit für den Ernstfall (Ring · «19/20») und Franchise-Stand (Balken · «CHF\u00a0420 von CHF\u00a02’500»).
// Dieselben Rechnungen wie das Kapitel Notfall (bereitschaft) und die KVG-Seite (berechneFranchise).
import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { HerzPuls } from '../../bereiche/notfall/notfall.js';

const palette = { surface: '#fff', border: '#ccc', text: '#111', mid: '#444', rose: '#c55', roseDeep: '#a33', sky: '#69c' };
const quelle = (rel) => readFileSync(fileURLToPath(new URL(rel, import.meta.url)), 'utf8');

describe('Bereitschaft klein · Herz mit Puls (Bauplan 18.11.2026, ersetzt den Ring)', () => {
  const lagen = (voll) => ['unfall', 'spital', 'behoerde'].map((key, i) => ({ key, erledigt: 0, gesamt: 9, voll: voll[i] }));
  it('64 px, keine Wörter, drei Schläge in der Reihenfolge der Lagen', () => {
    const html = renderToStaticMarkup(React.createElement(HerzPuls, { palette, lagen: lagen([true, false, true]), groesse: 'klein' }));
    expect(html).toContain('max-width:64px');
    expect(html).not.toMatch(/<text|lage-name/);
    expect(html.match(/data-lage="([a-z]+)" data-voll="(ja|nein)"/g)).toEqual(['data-lage="unfall" data-voll="ja"', 'data-lage="spital" data-voll="nein"', 'data-lage="behoerde" data-voll="ja"']);
  });
  it('volle Lage = hoher Schlag, offene Lage = kleiner Ausschlag', () => {
    const puls = (v) => (renderToStaticMarkup(React.createElement(HerzPuls, { palette, lagen: lagen(v), groesse: 'klein' })).match(/data-teil="puls" d="([^"]+)"/) || [])[1];
    expect(puls([true, true, true])).toContain('L18 22');
    expect(puls([false, false, false])).toContain('L18 39');
  });
});

describe('Kachel-Regeln', () => {
  const panel = quelle('../InstrumentePanel.jsx');
  it('Bereitschaft mit derselben Funktion wie das Kapitel Notfall', () => {
    expect(panel).toMatch(/const bereit = bereitschaft\(data\);/);
  });
  it('Franchise mit derselben Rechnung wie die KVG-Seite, nur mit erfasster Franchise', () => {
    expect(panel).toMatch(/const frStand = franchiseStand\(data\);/);
  });
  it('Beträge über betrag(), «von CHF …» über i18n — beides greift beim Sichtschutz', () => {
    expect(panel).toMatch(/wert: chfBetrag\(frStand\.franchiseVerbraucht\)/);
    expect(quelle('../../i18n/de.js')).toMatch(/franchiseVon: 'von CHF\\u00a0\{franchise\}'/) // Quelltext: «CHF» mit geschütztem Leerzeichen als Escape (23.11.2026);
  });
  it('Klick führt auf den Reiter Franchise der KVG-Seite', () => {
    expect(panel).toMatch(/onNavigate\('kvg', undefined, 'franchise'\)/);
  });
  it('Gesundheit steht in der Kapitelzeile', () => {
    expect(quelle('../../Dashboard.jsx')).toMatch(/notfall: \['bereit', 'franchise'\]/);
  });
});
