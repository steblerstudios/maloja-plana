// Seitenrundgang 2026-10 (docs/audits/SEITENRUNDGANG-2026-10.md), Fehler ohne Produktentscheid:
// D1 Frist roh als ISO-Datum · D2 «x/6» bei fünf Gängen · K-F3 «1 Jahre, 1 Monate» · K-F6 Beispiel-Hausarzt
// nur im alten Feld · D12 Prämienvergleich mit toFixed und roher Franchise.
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import React from 'react';
import fs from 'node:fs';
import path from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import de from '../i18n/de.js';
import { createT } from '../i18n/index.js';
import { buildSnippet } from '../Dashboard.jsx';
import { MirrorCards } from '../MirrorCards.jsx';
import { DEMO_DATA } from '../config/demoData.js';
import { GAENGE } from '../utils/behoerdenGaenge.js';

const t = createT({ de }, 'de');

const speicher = {};
beforeEach(() => {
  for (const k of Object.keys(speicher)) delete speicher[k];
  globalThis.localStorage = {
    getItem: (k) => (k in speicher ? speicher[k] : null),
    setItem: (k, v) => { speicher[k] = String(v); },
    removeItem: (k) => { delete speicher[k]; },
  };
});
afterEach(() => { delete globalThis.localStorage; });

const behoerden = (extra = {}) => ({ cantoneOfTaxation: 'ZH', taxFilingDeadline: '2027-03-31', ...extra });

describe('Dashboard, Bereichszeile Behörden', () => {
  it('D1: Frist in der App-Sprache, nicht als ISO-Datum', () => {
    const s = buildSnippet('behoerden', behoerden(), {}, t, 'de');
    expect(s).not.toContain('2027-03-31');
    expect(s).toContain('31. März 2027');
  });

  it('D2: zählt die fünf Gänge des Kapitels, ein alter Haken zählt nicht mit', () => {
    expect(GAENGE).toHaveLength(5);
    speicher.or5_behoerden_checklist = JSON.stringify({ betreibungsauszug: true, patientenverfuegung: true });
    const s = buildSnippet('behoerden', behoerden(), {}, t, 'de');
    expect(s).toContain('1/5 erledigt');
    expect(s).not.toContain('/6');
  });

  it('D2: der Vorschlag aus «0 offen» zählt wie im Kapitel', () => {
    const s = buildSnippet('behoerden', behoerden({ pendingTaxReturns: '0' }), {}, t, 'de');
    expect(s).toContain('1/5 erledigt');
  });

  it('D2: ein eigener Haken «nein» schlägt den Vorschlag', () => {
    speicher.or5_behoerden_checklist = JSON.stringify({ steuererklaerung: false });
    const s = buildSnippet('behoerden', behoerden({ pendingTaxReturns: '0' }), {}, t, 'de');
    expect(s).not.toContain('erledigt');
  });
});

describe('K-F3: Dauer mit Einzahl', () => {
  const vorMonaten = (n) => {
    const h = new Date();
    const d = new Date(h.getFullYear(), h.getMonth() - n, 1);
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-01';
  };
  const wohnen = (moveInDate) => renderToStaticMarkup(React.createElement(MirrorCards, {
    chapterKey: 'wohnen', data: { address: 'Musterweg 1', city: 'Zürich', moveInDate }, allData: {}, palette: {}, t,
  }));

  it('1 Jahr, 1 Monat', () => {
    const s = wohnen(vorMonaten(13));
    expect(s).toContain('1 Jahr, 1 Monat');
    expect(s).not.toMatch(/1 Jahre|1 Monate/);
  });
  it('Mehrzahl bleibt', () => {
    expect(wohnen(vorMonaten(26))).toContain('2 Jahre, 2 Monate');
  });
  it('nur ein Monat', () => {
    expect(wohnen(vorMonaten(1))).toContain('Wohndauer 1 Monat');
  });
});

describe('K-F6: Beispiel-Hausarzt steht in der Liste', () => {
  it('doctorsList trägt den Hausarzt, das alte Feld bleibt für Dossier und Karte', () => {
    const n = DEMO_DATA.notfall;
    expect(n.doctorsList).toEqual([{ name: n.doctor, specialty: 'hausarzt', phone: n.doctorPhone }]);
  });
});

describe('D12: Prämienvergleich formatiert über utils/geld.js', () => {
  it('kein toFixed mehr in PraemienOrientierung.jsx', () => {
    const src = fs.readFileSync(path.resolve(__dirname, '../PraemienOrientierung.jsx'), 'utf8');
    expect(src).not.toMatch(/\.toFixed\(/);
  });
});
