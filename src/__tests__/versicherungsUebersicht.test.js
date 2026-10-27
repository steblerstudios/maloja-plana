// Fassung 6 · Versicherungs-Übersicht (Runde 9 AB, Schritt 3; Sophie 25.10.2026 «Baue Versicherungs-Übersicht 1 bis 9,
// gestapelt auf #576»): die Prämien-Orientierung als Übersicht — Name und Brotkrume, Marken, Versicherungen pro Monat mit
// KK-Last, Zeilen mit Wert, Schutzschild, vier aufklappbare Teile, Zusatz-Wechsel und KK-Scanner, Schlusssatz.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { PraemienOrientierung } from '../PraemienOrientierung.jsx';
import { LIGHT_PALETTE } from '../config/constants.js';
import { stufen } from '../config/brotkrumePfade.js';
import { UMLEITUNGEN, VALID_VIEWS } from '../utils/hashRouter.js';
import { CHAPTER_KEYS } from '../config/constants.js';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import en from '../i18n/en.js';
import fr from '../i18n/fr.js';
import it_ from '../i18n/it.js';
import rm from '../i18n/rm.js';
import { DEMO_DATA } from '../config/demoData.js';

const t = createT({ de }, 'de', 'sie');
const nurText = (html) => html.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, ' ');
const seite = (data = DEMO_DATA) => renderToStaticMarkup(React.createElement(PraemienOrientierung, { palette: LIGHT_PALETTE, t, data, onNavigate: () => {}, onUpdateData: () => {} }));
const QUELLE = fs.readFileSync(path.resolve(__dirname, '../PraemienOrientierung.jsx'), 'utf8');

describe('Name und Weg', () => {
  it('heisst «Versicherungs-Übersicht», mit Satz', () => {
    expect(t('po.title')).toBe('Versicherungs-Übersicht');
    expect(t('nav.praemien')).toBe('Versicherungs-Übersicht');
    expect(nurText(seite())).toContain('Ihre Versicherungen auf einen Blick — basierend auf Ihren Eingaben.');
  });
  it('Brotkrume «Übersicht › Versicherungen & Vorsorge › Versicherungs-Übersicht»', () => {
    expect(stufen('praemien').map((s) => s.ziel)).toEqual(['dashboard', 'versicherungskapitel', null]);
    expect(CHAPTER_KEYS[UMLEITUNGEN.versicherungskapitel.chapterIndex]).toBe('versicherungen');
    expect(VALID_VIEWS.has('versicherungskapitel')).toBe(true);
    expect(VALID_VIEWS.has('praemien')).toBe(true);
  });
});

describe('Oben', () => {
  it('Marken: Kasse · Modell, Franchise, Prämienregion', () => {
    const text = nurText(seite());
    expect(text).toContain('CSS · Standard');
    expect(text).toContain('Franchise 1’500');
    expect(text).toMatch(/Prämienregion Zürich 1/);
  });
  it('Versicherungen pro Monat mit KK-Last, Posten zugeklappt', () => {
    const html = seite();
    expect(nurText(html)).toContain('Versicherungen pro Monat');
    expect(html).toMatch(/<details data-teil="versicherungen-darin"/);
    expect(nurText(html)).toContain('Was darin steckt');
  });
});

describe('Zeilen mit Wert', () => {
  it('Kassenwechsel, IPV, Gesundheitskosten, KVG-Leistungen, Vorsorge — je zum Werkzeug', () => {
    const text = nurText(seite());
    expect(text).toMatch(/Krankenkasse wechseln Eingang bei der Kasse bis \d\d\.11\.20\d\d/);
    expect(text).toContain('Prämienverbilligung (IPV)');
    // dieselbe Zahl wie das Franchise-Kreuz (bezahlt + offen), darunter aufgeteilt
    expect(text).toMatch(/Gesundheitskosten \(KVG\) CHF 420 Arztrechnungen 20\d\d: bezahlt CHF 240 · unbezahlt CHF 180/);
    expect(text).toContain('Guthaben laut PK-Ausweis CHF 45’000');
    for (const ziel of ["onNavigate('kvgwechsel')", "onNavigate('premium')", "onNavigate('kvg')", "onNavigate('vorsorge')", "onNavigate('zusatzwechsel')", "onNavigate('kk')"]) expect(QUELLE).toContain(ziel);
  });
  it('Kündigungstermin wie der Ablauf «Krankenkasse wechseln» (Werktag, nächstes Jahr ab Dezember)', () => {
    expect(QUELLE).toContain('nextNov30(heute)');
  });
  it('IPV: nur, was ankommt (ipvAbzug) — nie ipv.amount direkt, kein Pegel', () => {
    expect(QUELLE).toContain('ipvAbzug(data, ipv)');
    expect(QUELLE).not.toMatch(/ipv\.amount/);
    expect(QUELLE).not.toContain('pegelState(');
  });
  it('Franchise-Zeile nennt den Polster-Vorbehalt', () => {
    expect(QUELLE).toContain("t('instrumente.kreuzWechselPolster'");
  });
});

describe('Schutzschild und aufklappbare Teile', () => {
  it('Schutzschild steht auf der Seite', () => {
    expect(nurText(seite())).toContain('Pflicht · 3/3');
  });
  it('Region, Vergleich und Kassen sind zugeklappt', () => {
    const html = seite();
    for (const id of ['mp-vu-region', 'mp-vu-vergleich', 'mp-vu-kassen']) {
      if (html.includes(`id="${id}"`)) expect(html).not.toMatch(new RegExp(`<details id="${id}" open`));
    }
  });
  it('Alle Kassen: erst fünf, dann alle', () => {
    expect(QUELLE).toContain('(alleKassen ? allInsurers : allInsurers.slice(0, 5))');
  });
  it('Schlusssatz', () => {
    expect(nurText(seite())).toContain('Alle Werte sind Orientierungshilfen. Für verbindliche Auskünfte wenden Sie sich an Ihre Versicherung.');
  });
});

// F7-L6 (Sophie 27.10.2026, «§11 bauen»): Abgleich ergab, dass §11 mit #580/#601 gebaut ist — hier wacht der Aufbau
// als Ganzes, damit ein späterer Umbau Reihenfolge und Zeilen nicht still verschiebt.
describe('Aufbau wie die Finanz-Auswertung (F7-L6)', () => {
  const reihenfolge = (html) => [...html.matchAll(/data-(teil|zeile)="([^"]+)"/g)].map((m) => m[2]);
  it('Teile in der Reihenfolge von §11: Marken · pro Monat · Zeilen · Schutzschild · aufklappbar · Wege', () => {
    const html = seite();
    const teile = reihenfolge(html);
    const pos = (id) => { const i = teile.indexOf(id); expect(i, id).toBeGreaterThan(-1); return i; };
    const kette = ['vu-marken', 'versicherungen-instrument', 'vu-zeilen', 'mp-vu-risiken', 'mp-vu-kreuz', 'mp-vu-region', 'mp-vu-vergleich', 'mp-vu-kassen', 'vu-wege'].map(pos);
    expect([...kette].sort((a, b) => a - b)).toEqual(kette);
    // Schutzschild zwischen Zeilen und aufklappbaren Teilen
    expect(html.indexOf('id="schild-pflicht"')).toBeGreaterThan(html.indexOf('data-teil="vu-zeilen"'));
    expect(html.indexOf('id="schild-pflicht"')).toBeLessThan(html.indexOf('data-teil="mp-vu-risiken"'));
  });
  it('Zeilen mit Wert: Franchise, Wechsel, IPV, Gesundheitskosten, KVG-Leistungen, Vorsorge — in dieser Reihenfolge', () => {
    const zeilen = reihenfolge(seite()).filter((id) => ['franchise', 'wechsel', 'ipv', 'kosten', 'kvg', 'vorsorge', 'zusatz', 'scanner'].includes(id));
    expect(zeilen).toEqual(['franchise', 'wechsel', 'ipv', 'kosten', 'kvg', 'vorsorge', 'zusatz', 'scanner']);
  });
  it('Franchise-Zeile mit Wert, KVG-Leistungen als Zeile (eigene Seite bleibt)', () => {
    const text = nurText(seite());
    expect(text).toMatch(/Franchise Eher 2’500/);
    expect(text).toContain(t('nav.kvgLeistungen'));
    expect(VALID_VIEWS.has('kvg')).toBe(true);
    expect(VALID_VIEWS.has('premium')).toBe(true);
  });
  it('alle aufklappbaren Teile sind beim Öffnen zu', () => {
    const html = seite();
    expect(html).not.toMatch(/<details id="mp-vu-[a-z]+" open/);
  });
});

describe('Ohne Angaben', () => {
  it('ohne PLZ steht die Postleitzahl oben, nichts bricht', () => {
    const leer = { basis: {}, wohnen: {}, finanzen: {}, versicherungen: {} };
    const text = nurText(seite(leer));
    expect(text).toContain('Versicherungs-Übersicht');
    expect(text).toContain(t('po.plzLabel'));
  });
});

describe('Fünf Sprachen', () => {
  it('alle neuen Texte da', () => {
    for (const sprache of [en, fr, it_, rm]) {
      for (const k of Object.keys(de.vu)) expect(sprache.vu[k], k).toBeTruthy();
      expect(sprache.po.title).toBeTruthy();
    }
  });
});
