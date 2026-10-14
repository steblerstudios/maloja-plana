// Schulden R2 Teil 2, Fix-Welle 13.10.2026 (D): Fokus nach Löschen, Ansage, Liste, Beschriftung, Touch-Ziele.
import { describe, it, expect } from 'vitest';
import React from 'react';
import fs from 'node:fs';
import path from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { SchuldenManager } from '../SchuldenManager.jsx';
import { VerlustscheinZeitachse } from '../components/SchuldenBilder.jsx';
import de from '../i18n/de.js';
import en from '../i18n/en.js';
import fr from '../i18n/fr.js';
import it_ from '../i18n/it.js';
import rm from '../i18n/rm.js';
import { LIGHT_PALETTE as palette } from '../config/constants.js';

const t = (k, v) => k + (v ? JSON.stringify(v) : '');
const quelle = fs.readFileSync(path.resolve(__dirname, '../SchuldenManager.jsx'), 'utf8');
// Nur der Rumpf der Funktion — sonst genügt ein Treffer irgendwo in der Datei (mutationsscharf).
const rumpf = (name) => quelle.match(new RegExp(name + ' = \\(id\\) => \\{[\\s\\S]*?\\n {2}\\};'))[0];

describe('12 · Löschen im Verlustscheine-Tab lässt den Fokus nicht auf body fallen', () => {
  const fn = rumpf('handleDeleteVerlustschein');
  it('setzt ein Fokus-Ziel: nächste Zeile (Knopf bzw. im Bearbeiten-Modus das Rollen-Select), sonst «+ Verlustschein»', () => {
    expect(fn).toMatch(/fokusNach\.current = naechste \? \(naechste\.id === bearbeite \? 'vs-rolle-' : 'vs-knopf-'\) \+ naechste\.id : 'vs-neu';/);
  });
  it('Ziele existieren im Markup: vs-neu, vs-knopf-<id>, vs-rolle-<id>', () => {
    expect(quelle).toMatch(/type: 'button', 'data-vs-fokus': 'vs-neu', onClick: handleAddVerlustschein/);
    expect(quelle).toMatch(/'data-vs-fokus': 'vs-knopf-' \+ entry\.id/);
    expect(quelle).toMatch(/'data-vs-fokus': 'vs-rolle-' \+ entry\.id/);
    expect(quelle).toMatch(/fokusNach\.current = 'vs-rolle-' \+ entry\.id/);
    expect(quelle).toMatch(/fokusNach\.current = 'vs-knopf-' \+ id/);
  });
  it('der Effekt läuft auch, wenn nur die Zahl der Verlustscheine ändert', () => {
    expect(quelle).toMatch(/\[bearbeite, betreibung\.length, verlustscheine\.length\]/);
  });
});

describe('13 · Statusansage beim Löschen (beide Tabs)', () => {
  it('beide Löschen-Funktionen sagen «{name} gelöscht» an', () => {
    expect(rumpf('handleDeleteBetreibung')).toMatch(/setStatusAnsage\(t\('schulden\.ansageGeloescht', \{ name \}\)\)/);
    expect(rumpf('handleDeleteVerlustschein')).toMatch(/setStatusAnsage\(t\('schulden\.ansageGeloescht', \{ name \}\)\)/);
  });
  it('Schlüssel in allen fünf Sprachen mit {name}', () => {
    for (const l of [de, en, fr, it_, rm]) expect(l.schulden.ansageGeloescht).toContain('{name}');
    expect(de.schulden.ansageGeloescht).toBe('{name} gelöscht');
    expect(rm.schulden.ansageGeloescht).toBe('{name} gelöscht');
    expect(en.schulden.ansageGeloescht).toBe('{name} deleted');
  });
});

describe('14 · Zeitachse ist eine Liste für Screenreader', () => {
  it('<ol role="list"> (list-style: none nimmt Safari/VoiceOver sonst die Semantik)', () => {
    const h = renderToStaticMarkup(React.createElement(VerlustscheinZeitachse, { palette, t, eintraege: [{ id: 1, creditor: 'A', date: '2021-03-15' }], heute: '2026-10-13' }));
    expect(h).toMatch(/<ol role="list" aria-label="schulden\.verlustschein\.zeitachse\.label"/);
  });
});

const rendern = (view, daten, id) => renderToStaticMarkup(React.createElement(SchuldenManager, {
  palette, t, data: { schulden: [], betreibung: [], verlustscheine: [], finanzen: {}, basis: {}, ...daten }, onSave: () => {}, onNavigate: () => {}, startView: view, startBearbeite: id,
})).replace(/&quot;/g, '"');
const vsE = { id: 1, creditor: 'Bank Alpha', amount: 1, date: '2021-03-15', rolle: 'schulde' };
const btE = { id: 1, creditor: 'Amt Alpha', amount: 900, registerDate: '2022-03-15', status: 'open' };

describe('15 · Sichtbare Beschriftung der zwei Selects', () => {
  it('Rolle: <label for> trifft die id des Selects', () => {
    const h = rendern('verlustscheine', { verlustscheine: [vsE] }, 1);
    const id = h.match(/<select[^>]*id="([^"]+)"[^>]*data-vs-fokus="vs-rolle-1"|<select[^>]*data-vs-fokus="vs-rolle-1"[^>]*id="([^"]+)"/);
    expect(id).not.toBeNull();
    const selectId = id[1] || id[2];
    expect(h).toMatch(new RegExp('<label for="' + selectId + '"[^>]*color:#5E6167[^>]*>schulden\\.verlustschein\\.rolle\\.label</label>'));
  });
  it('Verbunden mit: <label for> trifft die id des Selects', () => {
    const h = rendern('betreibung', { betreibung: [btE], schulden: [{ id: 7, creditor: 'Kreditkarte', amount: 1, status: 'open' }] }, 1);
    const m = h.match(/<label for="([^"]+)"[^>]*>schulden\.betreibung\.verbinden<\/label>/);
    expect(m).not.toBeNull();
    expect(h).toMatch(new RegExp('<select[^>]*id="' + m[1] + '"'));
  });
});

describe('16 · Eingabefelder der Bearbeiten-Zeilen: Touch-Ziel 44 px', () => {
  const felder = (h) => [...h.matchAll(/<(input|select)\b[^>]*>/g)].map(m => m[0]);
  it('Verlustschein: jedes input/select hat min-height:44px', () => {
    const f = felder(rendern('verlustscheine', { verlustscheine: [vsE] }, 1));
    expect(f.length).toBeGreaterThanOrEqual(5);
    for (const x of f) expect(x).toContain('min-height:44px');
  });
  it('Betreibung: jedes input/select hat min-height:44px', () => {
    const f = felder(rendern('betreibung', { betreibung: [btE] }, 1));
    expect(f.length).toBeGreaterThanOrEqual(5);
    for (const x of f) expect(x).toContain('min-height:44px');
  });
});
