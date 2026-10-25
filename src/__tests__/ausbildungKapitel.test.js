// Fassung 6 · Kapitel Ausbildung (Runde 9, Entwurf AC; gebaut Abnahme 25.10.2026, Sophie «Bau Ausbildung 1 bis 5»):
// Zusammenfassung mit Arbeitgeber, Dauer und Stunden · «Wo steht Ihr Lohn?» oben · Vorschau des Lebenslaufs ·
// Werte nicht mehr über den Kartenrand · «Aufenthaltsbewilligung» bei Schweizer/innen «nicht nötig».
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ChapterViewComplete } from '../ChapterView.jsx';
import { LebenslaufVorschau } from '../components/LebenslaufVorschau.jsx';
import { getChapters, LIGHT_PALETTE } from '../config/constants.js';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import en from '../i18n/en.js';
import fr from '../i18n/fr.js';
import it_ from '../i18n/it.js';
import rm from '../i18n/rm.js';
import { DEMO_DATA } from '../config/demoData.js';

const t = createT({ de }, 'de', 'sie');
const chapters = getChapters(t);
const nurText = (html) => html.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ');
const kapitel = (ausbildung = DEMO_DATA.ausbildung, allData = DEMO_DATA) => nurText(renderToStaticMarkup(React.createElement(ChapterViewComplete, {
  palette: LIGHT_PALETTE, t, chapter: chapters.find((c) => c.key === 'ausbildung'), data: ausbildung, allData: { ...allData, ausbildung },
  onUpdate: () => {}, onUpdateIn: () => {}, onNavigate: () => {},
})));
const QUELLE = fs.readFileSync(path.resolve(__dirname, '../ChapterView.jsx'), 'utf8');

describe('Zusammenfassung', () => {
  it('Maria: Arbeitgeber, seit wann, wie lange, Stunden', () => {
    expect(kapitel()).toMatch(/Bachelor\. Aktuell tätig als Pflegefachfrau HF — bei Kantonsspital Zürich seit 01\.04\.2019 \(\d+ Jahre(, \d+ Monate?)?\), 42 Std\.\/Woche\./);
  });
  it('ohne Datum und Stunden: nur der Grundsatz mit Arbeitgeber', () => {
    const a = { ...DEMO_DATA.ausbildung, employmentStart: '', workHoursPerWeek: '' };
    expect(kapitel(a)).toContain('Bachelor. Aktuell tätig als Pflegefachfrau HF — bei Kantonsspital Zürich.');
  });
});

describe('Oben im Kapitel', () => {
  it('Lohn-Barometer wie in Finanzen, fest auf «ausbildung»', () => {
    expect(QUELLE).toContain("const LohnEinordnung = React.lazy(");
    expect(QUELLE).toContain("aktuellesKapitel: 'ausbildung'");
  });
  it('Vorschau des Lebenslaufs nur aus erfassten Angaben', () => {
    const text = nurText(renderToStaticMarkup(React.createElement(LebenslaufVorschau, { palette: LIGHT_PALETTE, t, ausbildung: DEMO_DATA.ausbildung, allData: DEMO_DATA, onNavigate: () => {} })));
    expect(text).toContain('Maria Muster');
    expect(text).toContain('Pflegefachfrau HF · Zürich · maria.muster@example.ch');
    expect(text).toContain('seit 04/2019 · Pflegefachfrau HF, Kantonsspital Zürich');
    expect(text).toContain('Bachelor, ZHAW · CAS Notfallpflege');
    expect(text).toContain('Lebenslauf erstellen ›');
  });
  it('ohne Angaben: keine Vorschau', () => {
    expect(renderToStaticMarkup(React.createElement(LebenslaufVorschau, { palette: LIGHT_PALETTE, t, ausbildung: {}, allData: { basis: {} } }))).toBe('');
  });
});

describe('Angaben', () => {
  it('Schweizer/in: «Aufenthaltsbewilligung nicht nötig (Schweizer Bürgerrecht)»', () => {
    expect(kapitel()).toContain('Aufenthaltsbewilligung nicht nötig (Schweizer Bürgerrecht)');
  });
  it('mit Bewilligung: die Bewilligung wie bisher', () => {
    expect(kapitel({ ...DEMO_DATA.ausbildung, workPermit: 'b' })).toContain('Aufenthaltsbewilligung B');
  });
  // Muster M1 (25.10.2026) löst die Spalten 3 : 2 ab: Zeilen wie im Entwurf — die Bezeichnung nimmt den
  // Platz, den der Wert übrig lässt (trennt nach Silben), der Wert höchstens 62 % und bricht nur
  // zwischen Wörtern. Bei 3 : 2 brachen Telefonnummern («+41 79 654 32 / 10»).
  it('Zeilen: Bezeichnung nimmt den Rest und trennt nach Silben, Wert höchstens 62 %', () => {
    expect(QUELLE).toMatch(/'dt', \{ style: \{[^}]*flex: '1 1 0'[^}]*hyphens: 'auto'/);
    expect(QUELLE).toMatch(/'dd', \{ style: \{[^}]*maxWidth: '62%'[^}]*overflowWrap: 'break-word'/);
  });
});

describe('Texte in allen fünf Sprachen', () => {
  for (const [name, s] of Object.entries({ en, fr, it: it_, rm })) {
    it(name, () => {
      for (const k of Object.keys(de.lebenslaufVorschau)) expect(s.lebenslaufVorschau?.[k], name + ' ' + k).toBeTruthy();
      for (const k of ['bei', 'seit', 'stunden']) expect(s.mirror.ausbildung[k], name + ' ' + k).toBeTruthy();
      expect(s.chapterView.bewilligungNichtNoetig).toBeTruthy();
    });
  }
});
