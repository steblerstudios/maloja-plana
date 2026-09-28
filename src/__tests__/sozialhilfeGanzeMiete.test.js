// Wächter (28.09.2026, Folge von #452): die App kennt keine Mietzins-Limite und rechnet die
// ganze Miete mit Nebenkosten ein. Bei hoher Miete kann der geschätzte Sozialhilfe-Betrag darum zu
// hoch sein. Überall, wo ein Sozialhilfe-Betrag oder «Anspruch» steht, sagt die Anzeige das dazu
// (bestehender Schlüssel `sozialhilfe.mitGanzerMiete`) — nur bei Anspruch und erfasster Miete.
// Keine eigene Schwelle für «hohe Miete»: die Grenze kennt die App nicht.
import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { calculateSozialhilfe } from '../config/cantonalData.js';
import { sozialhilfePegelState } from '../data/pegel.js';
import { anspruchSignale, anspruchSignaleListe } from '../data/anspruchSignale.js';
import { Pegel } from '../components/Pegel.jsx';
import { QuickCheck } from '../components/Leistungsliste.jsx';
import { Schnellcheck } from '../Schnellcheck.jsx';

const KEY = 'sozialhilfe.mitGanzerMiete';
const t = (k) => k;
// Jede Farbe gleich — die Tests prüfen Text, nicht Gestalt.
const palette = new Proxy({}, { get: () => '#000000' });
const quelle = (p) => readFileSync(new URL(p, import.meta.url), 'utf8');

const profil = (einkommen, miete, nebenkosten = 0) => ({
  basis: { canton: 'BE', household: { adults: 1, children: [] } },
  finanzen: { monthlyIncome: einkommen, incomeType: 'netto' },
  wohnen: { rentAmount: miete, utilities: nebenkosten },
  versicherungen: { kkPremium: 400 },
});
const knapp = profil(1000, 1800, 150);   // Anspruch, Miete erfasst
const gedeckt = profil(9000, 1800, 150); // kein Anspruch

describe('calculateSozialhilfe: mitGanzerMiete als eine Wahrheit', () => {
  it('Anspruch mit erfasster Miete → true', () => {
    const r = calculateSozialhilfe(knapp);
    expect(r.eligible).toBe(true);
    expect(r.mitGanzerMiete).toBe(true);
  });
  it('kein Anspruch → false, auch bei hoher Miete', () => {
    expect(calculateSozialhilfe(gedeckt).mitGanzerMiete).toBe(false);
  });
  it('Anspruch ohne erfasste Miete → false (nichts eingerechnet, nichts zu sagen)', () => {
    const r = calculateSozialhilfe(profil(0, 0));
    expect(r.eligible).toBe(true);
    expect(r.mitGanzerMiete).toBe(false);
  });
  it('keine erfundene Schwelle: schon eine tiefe Miete zählt', () => {
    expect(calculateSozialhilfe(profil(0, 300)).mitGanzerMiete).toBe(true);
  });
});

describe('Anzeigen mit Betrag', () => {
  it('Leistungsliste (Dashboard «Was steht mir zu?»): Zusatz bei Anspruch, sonst nicht', () => {
    expect(renderToStaticMarkup(React.createElement(QuickCheck, { palette, t, onNavigate: () => {}, data: knapp }))).toContain(KEY);
    expect(renderToStaticMarkup(React.createElement(QuickCheck, { palette, t, onNavigate: () => {}, data: gedeckt }))).not.toContain(KEY);
  });

  it('Schnellcheck: Zusatz bei Anspruch, sonst nicht', () => {
    expect(renderToStaticMarkup(React.createElement(Schnellcheck, { palette, t, onNavigate: () => {}, data: knapp }))).toContain(KEY);
    expect(renderToStaticMarkup(React.createElement(Schnellcheck, { palette, t, onNavigate: () => {}, data: gedeckt }))).not.toContain(KEY);
  });

  it('Pegel: Zustand trägt das Flag nur im Lücken-Fall, die Ablesung zeigt es', () => {
    const lücke = sozialhilfePegelState(knapp);
    expect(lücke.mode).toBe('gap');
    expect(lücke.mitGanzerMiete).toBe(true);
    expect(renderToStaticMarkup(React.createElement(Pegel, { palette, t, state: lücke }))).toContain(KEY);

    const voll = sozialhilfePegelState(gedeckt);
    expect(voll.mitGanzerMiete).toBe(false);
    expect(renderToStaticMarkup(React.createElement(Pegel, { palette, t, state: voll }))).not.toContain(KEY);
  });
});

describe('Anzeigen mit «Anspruch» (ohne Betrag)', () => {
  it('Anspruch-Signale (Kalender, Lebensbaum) tragen das Flag', () => {
    expect(anspruchSignale(knapp).behoerden[0].mitGanzerMiete).toBe(true);
    const liste = anspruchSignaleListe(knapp).find((s) => s.key === 'sozialhilfe');
    expect(liste.mitGanzerMiete).toBe(true);
  });

  // Diese Ansichten brauchen Schritt-Zustand bzw. viele Props; geprüft wird, dass sie das Flag
  // der Rechnung lesen und den Schlüssel dazusetzen.
  it.each([
    ['../AnspruchCheck.jsx', 'sh.mitGanzerMiete'],
    ['../CalendarReminders.jsx', 'sig.mitGanzerMiete'],
    ['../Lebensbaum.jsx', 'sigList[0].mitGanzerMiete'],
    ['../BudgetSync.jsx', 'sozialhilfe.mitGanzerMiete'],
  ])('%s liest %s und setzt den Zusatz', (datei, flag) => {
    const s = quelle(datei);
    expect(s).toContain(flag);
    expect(s).toContain("t('" + KEY + "')");
  });
});

describe('Kein Leser zeigt Sozialhilfe ohne Zusatz', () => {
  // Erlaubnisliste: wer calculateSozialhilfe liest, trägt den Zusatz — oder steht hier mit Grund.
  const OHNE_EIGENEN_ZUSATZ = {
    '../SozialhilfeView.jsx': 'zeigt die Wohnkosten-Zeile mit sozialhilfe.rentLimitUnbekannt',
    '../BehoerdenDossier.jsx': 'reicht die Rechnung ans Dossier (sozialhilfe.rentLimitDossier)',
    '../data/pegel.js': 'reicht das Flag an Pegel.jsx weiter',
    '../data/anspruchSignale.js': 'reicht das Flag an Kalender und Lebensbaum weiter',
  };
  const LESER = [
    '../Schnellcheck.jsx', '../components/Leistungsliste.jsx', '../AnspruchCheck.jsx', '../BudgetSync.jsx',
    '../FinanzUebersicht.jsx', ...Object.keys(OHNE_EIGENEN_ZUSATZ),
  ];
  it('jede Datei, die calculateSozialhilfe aufruft, ist bekannt', () => {
    const src = fileURLToPath(new URL('..', import.meta.url));
    const alle = [];
    const lauf = (d) => readdirSync(d).forEach((n) => {
      const p = join(d, n);
      if (statSync(p).isDirectory()) { if (n !== '__tests__') lauf(p); }
      else if (/\.jsx?$/.test(n) && /calculateSozialhilfe\(/.test(readFileSync(p, 'utf8'))) alle.push('../' + relative(src, p));
    });
    lauf(src);
    const unbekannt = alle.filter((f) => f !== '../config/cantonalData.js' && !LESER.includes(f));
    expect(unbekannt).toEqual([]);
  });
  it('die Leser mit eigener Anzeige setzen den Schlüssel', () => {
    for (const f of LESER.filter((f) => !(f in OHNE_EIGENEN_ZUSATZ))) expect(quelle(f), f).toContain(KEY);
  });
});
