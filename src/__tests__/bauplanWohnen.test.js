// Wächter · Bauplan Lebensbereich, am Beispiel Wohnen (Stebler Studios 18.11.2026: «wohnen sauber zusammen bringen
// … dann alle anderen kapitel gleich aufbauen», «Jedes Bild einmal», «Ordner je Bereich», Tür = Fass).
// Analyse: stebler-studios/analysen/2026-11-18-wohnen-logik-bauplan.md
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import de from '../i18n/de.js';
import { createT } from '../i18n/index.js';
import { LIGHT_PALETTE } from '../config/constants.js';
import { DEMO_DATA } from '../config/demoData.js';
import { WohnenZuhause, WohnenWerkzeug } from '../bereiche/wohnen/wohnen.js';

const t = createT({ de }, 'de', 'sie');
const SRC = path.resolve(__dirname, '..');
const lies = (f) => fs.readFileSync(path.join(SRC, f), 'utf8');
const zaehle = (html, teil) => (html.match(new RegExp('data-teil="' + teil + '"', 'g')) || []).length;
const mit = (aend) => {
  const d = JSON.parse(JSON.stringify(DEMO_DATA));
  for (const [teil, werte] of Object.entries(aend)) d[teil] = { ...(d[teil] || {}), ...werte };
  return d;
};
const kapitel = (d) => renderToStaticMarkup(React.createElement(WohnenZuhause, { palette: LIGHT_PALETTE, t, wohnen: d.wohnen, allData: d, isDarkMode: false, onNavigate: () => {} }));
const werkzeug = (d) => renderToStaticMarkup(React.createElement(WohnenWerkzeug, { palette: LIGHT_PALETTE, t, data: d, isDarkMode: false }));
// Basel-Stadt: Programm mit Einkommensgrenze als Zahl. Tiefes Einkommen = unter der Grenze.
const BS_TIEF = mit({ basis: { canton: 'BS' }, wohnen: { postalCode: '4051', rentAmount: '1400', utilities: '150', rooms: '2' }, finanzen: { monthlyIncome: '3000' } });

describe('Bauplan Wohnen · jedes Bild einmal je Seite', () => {
  for (const [ort, zeichne] of [['Kapitel', kapitel], ['Werkzeug', werkzeug]]) {
    it(ort + ': ein Drittel-Haus, ein Vergleichshaus, je eine Hauptzahl', () => {
      for (const d of [DEMO_DATA, BS_TIEF]) {
        const html = zeichne(d);
        expect(zaehle(html, 'drittel-haus')).toBe(1);
        expect(zaehle(html, 'vergleichs-haus')).toBe(1);
        expect((html.match(/data-instrument-zahl="wohnkosten"/g) || []).length).toBe(1);
        expect((html.match(/data-instrument-zahl="miete"/g) || []).length).toBe(1);
      }
    });
  }
  it('die Hauptzahlen stehen unter ihrem Haus (Regel «Zahl»)', () => {
    const html = kapitel(DEMO_DATA);
    expect(html.indexOf('data-instrument-zahl="wohnkosten"')).toBeGreaterThan(html.indexOf('data-teil="drittel-haus"'));
    expect(html.indexOf('data-instrument-zahl="miete"')).toBeGreaterThan(html.indexOf('data-teil="vergleichs-haus"'));
  });
  // Seit 21.11.2026 (Stebler Studios, «wohnen-aufraeumen.html»): kein «Mehr dazu» mehr. Die Sätze stehen zugeklappt unter
  // ihrem Haus, die Quellen der Strasse in einer Zeile im Hausstil; Kantonskarte und Regler bleiben offen.
  it('Erklärungen unter dem Haus, eine Quellenzeile, Karte und Regler offen, kein «Mehr dazu»', () => {
    const html = kapitel(BS_TIEF);
    expect(html).not.toContain('data-teil="wohnen-mehr"');
    expect(html).toContain('id="wohnen-regler"');
    expect(html).toContain('data-teil="kachelkarte"');
    const drittel = html.slice(html.indexOf('data-teil="strasse-drittel"'), html.indexOf('data-teil="strasse-vergleich"'));
    expect(drittel).toMatch(/data-teil="warum-drittel"[\s\S]*data-teil="drittel-satz"[\s\S]*data-teil="viertel-legende"/);
    const vergleich = html.slice(html.indexOf('data-teil="strasse-vergleich"'), html.indexOf('data-teil="strasse-quellen"'));
    expect(vergleich).toMatch(/data-teil="wie-verglichen"[\s\S]*data-teil="miete-saetze"[\s\S]*data-teil="international-hinweis"/);
    expect(vergleich).not.toContain('barometer-eigener-wert');
    const q = html.slice(html.indexOf('data-teil="strasse-quellen"'), html.indexOf('data-teil="mietzins-szene"'));
    expect(q).toContain('data-belege="liste"');
    for (const s of ['T 09.03.03.01', 'budgetberatung.ch/wohnen', 'eurostat']) expect(q).toContain(s);
    expect(html).not.toContain('data-teil="miete-quelle"');
  });
  it('Kopf wie Finanzen: Wohnkosten gross, Monat oder Jahr, darunter Bestandteile und Adresse', () => {
    const html = kapitel(DEMO_DATA);
    expect(html.indexOf('data-teil="wohnen-kopf"')).toBeLessThan(html.indexOf('data-teil="wohnen-strasse"'));
    expect(html).toMatch(/data-instrument-zahl="wohnkosten-kopf"[^>]*>CHF\u00a01’830/);
    expect(html).toMatch(/aria-pressed="true"[^>]*>Monat</);
    // Seit 21.11.2026 (Kombination A+B+C): Balken der Anteile, Miete + Nebenkosten als kleine Zahlen, Zimmer daneben;
    // die Adresse steht beim Kalenderblatt. Drittel und Viertel als Fahnen im Haus, keine Legende darunter.
    const teile = html.slice(html.indexOf('data-teil="wohnkosten-teile"'), html.indexOf('data-teil="wohnen-strasse"'));
    expect(teile).toMatch(/data-kopf-teil="miete"[\s\S]*Miete[\s\S]*CHF\u00a01’650[\s\S]*\+[\s\S]*data-kopf-teil="nebenkosten"[\s\S]*CHF\u00a0180[\s\S]*data-kopf-teil="zimmer"[\s\S]*2\.5/);
    expect(teile).not.toContain('Langstrasse');
    expect(html).toMatch(/data-teil="rand-adresse"[^>]*>Langstrasse 42, 8004 Zürich</);
    expect(html).toContain('data-teil="fahne-drittel"');
    expect(html).toContain('data-teil="fahne-viertel"');
    expect(html).toMatch(/data-teil="warum-drittel"[\s\S]*data-teil="viertel-legende"/);
    // Unter den Häusern (21.11.2026): was die Zahl heisst, darunter die zwei Beträge.
    expect(html).toMatch(/data-teil="wohnkosten-bezug"[^>]*>vom Nettoeinkommen</);
    expect(html).toMatch(/data-teil="wohnkosten-franken"[^>]*>CHF\u00a01’830 von CHF\u00a06’200</);
    expect(html).toMatch(/data-teil="lage-bezug"[^>]*>unter dem Kanton Zürich</);
    expect(html).toMatch(/data-teil="strasse-betrag"[^>]*>CHF\u00a01’650 statt Ø CHF\u00a01’732</);
  });
  // «A, am Bild» (Stebler Studios 20.11.2026): ändern an Kosten, Adresse, Vermieterschaft und Eigentum; das Formular
  // öffnet an seiner Stelle, unten bleibt «Alle Angaben». `angaben` ist hier eine Attrappe der Kapitelseite.
  it('ändern am Bild: Links zu, Formular offen an seiner Stelle', () => {
    const offen = new Set(['landlord']);
    const angaben = { offen: (k) => offen.has(k), umschalten: () => {}, formular: (k) => React.createElement('form', { 'data-formular': k }) };
    const html = renderToStaticMarkup(React.createElement(WohnenZuhause, { palette: LIGHT_PALETTE, t, wohnen: DEMO_DATA.wohnen, allData: DEMO_DATA, angaben }));
    for (const k of ['rentAmount', 'address', 'mortgageStatus']) expect(html).toContain('data-aendern="' + k + '"');
    expect(html).not.toContain('data-aendern="landlord"');
    expect(html).toMatch(/data-teil="wohnen-rand"[\s\S]*data-szene-formular="landlord"[^>]*><form data-formular="landlord"/);
    expect(html).toContain('Hauptwohnsitz');
    expect(html).toMatch(/Eigentum: noch leer[\s\S]*?ergänzen ›/);
  });
  it('am Rand: Wohndauer (Kalenderblatt), Hausrat & Haftpflicht (Schild), Vermieterschaft — Mietbeiträge nicht, die trägt die Tür', () => {
    const html = kapitel(DEMO_DATA);
    const rand = html.slice(html.indexOf('data-teil="wohnen-rand"'), html.indexOf('data-teil="wohnen-mehr"'));
    expect(rand).toContain('data-rand="wohndauer"');
    expect(rand).toContain('data-rand="zuhause-versichert"');
    expect(rand).toMatch(/data-rand="vermieterschaft"[\s\S]*href="tel:\+41443125500"/);
    expect(rand).not.toContain('mietzins');
  });
});

describe('Bauplan Wohnen · die Tür ist das Fass (Stebler Studios 11.11. und 18.11.2026)', () => {
  it('Programm mit Zahl, unter der Grenze: Fass in der Tür, Wegweiser in der Strasse', () => {
    for (const html of [kapitel(BS_TIEF), werkzeug(BS_TIEF)]) {
      expect(html).toMatch(/data-teil="tuer"[^>]*data-fass="ja"/);
      expect(html).toContain('data-teil="tuer-grenze"');
      expect(html).toMatch(/data-teil="wegweiser-in-strasse"[\s\S]*data-teil="mietzins-cta"/);
    }
  });
  it('ohne Programm (Zürich): schlichte Tür, kein Wegweiser, die Kantonskarte steht offen', () => {
    const html = kapitel(DEMO_DATA);
    expect(html).toMatch(/data-teil="tuer"[^>]*data-fass="nein"/);
    expect(html).not.toContain('data-teil="mietzins-cta"');
    expect(html).toMatch(/data-teil="markt-offen" data-offen="beitrag"[\s\S]*data-teil="hilfe-satz"[\s\S]*data-teil="kachelkarte"/);
  });
});

describe('Bauplan Wohnen · Ordnung im Code', () => {
  const appDateien = (dir) => fs.readdirSync(path.join(SRC, dir), { withFileTypes: true }).flatMap((e) => {
    const rel = path.join(dir, e.name);
    if (e.isDirectory()) return e.name === '__tests__' || rel === path.join('bereiche', 'wohnen') ? [] : appDateien(rel);
    return /\.(js|jsx)$/.test(e.name) ? [rel] : [];
  });
  it('rechnung.js rechnet nur: kein React, kein Bauteil', () => {
    const q = lies('bereiche/wohnen/rechnung.js');
    expect(q).not.toMatch(/from 'react'/);
    expect(q).not.toMatch(/from '[^']+\.jsx'/);
  });
  it('ausserhalb des Bereichs kommt Wohnen nur über bereiche/wohnen/wohnen.js', () => {
    const falsch = appDateien('.').filter((f) => /from '[^']*bereiche\/wohnen\/(?!wohnen\.js')[^']*'|import\('[^']*bereiche\/wohnen\/(?!wohnen\.js')/.test(lies(f)));
    expect(falsch).toEqual([]);
  });
  it('der Eingang heisst nicht index.js (sonst zählte size-limit den Baustein zur Startdatei)', () => {
    expect(fs.existsSync(path.join(SRC, 'bereiche/wohnen/index.js'))).toBe(false);
  });
  it('das Barometer kennt keine Häuser mehr', () => {
    const code = lies('components/RegionalBarometer.jsx').split('\n').filter((z) => !z.trim().startsWith('//')).join('\n');
    expect(code).not.toMatch(/haeuser|Vergleichshaus|drittel:/);
  });
});
