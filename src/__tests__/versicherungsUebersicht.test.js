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
    expect(text).toMatch(/Krankenkasse wechseln Kündigung bis 30\.11\.20\d\d/);
    expect(text).toContain('Prämienverbilligung (IPV)');
    expect(text).toContain('Gesundheitskosten (KVG) CHF 240 Bezahlte Arztrechnungen');
    expect(text).toContain('noch offen: CHF 180');
    expect(text).toContain('PK-Guthaben CHF 45’000');
    for (const ziel of ["onNavigate('kvgwechsel')", "onNavigate('premium')", "onNavigate('kvg')", "onNavigate('vorsorge')", "onNavigate('zusatzwechsel')", "onNavigate('kk')"]) expect(QUELLE).toContain(ziel);
  });
  it('Kündigung im Dezember gilt fürs nächste Jahr', () => {
    expect(QUELLE).toContain('heute.getMonth() === 11 ? heute.getFullYear() + 1 : heute.getFullYear()');
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
