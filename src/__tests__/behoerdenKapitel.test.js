// Fassung 6 · Kapitel Behörden (Runde 9, Entwurf AD; Sophie 25.10.2026 «Bau Behörden 1 bis 7 und 9»):
// Kasten «Folgende Stände …» weg · Zusammenfassung mit Steuererklärung und Betreibungsregister · Steuerfrist als
// Kalenderblatt · Behördengänge offen · «Für den Fall der Fälle» · «Rechtliche Vertretung: nicht erfasst» ·
// Querverweis Steuern ↔ Finanzen · Marias Steuerfrist mit Quelle (31.03.2027).
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ChapterViewComplete } from '../ChapterView.jsx';
import { BehoerdenInstrument, GAENGE, gangErledigt } from '../components/BehoerdenInstrument.jsx';
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
const kapitel = (key, data, allData = DEMO_DATA) => nurText(renderToStaticMarkup(React.createElement(ChapterViewComplete, {
  palette: LIGHT_PALETTE, t, chapter: chapters.find((c) => c.key === key), data, allData: { ...allData, [key]: data },
  onUpdate: () => {}, onUpdateIn: () => {}, onNavigate: () => {},
})));
const instrument = (behoerden = DEMO_DATA.behoerden, checked = {}) => nurText(renderToStaticMarkup(React.createElement(BehoerdenInstrument, {
  palette: LIGHT_PALETTE, t, behoerden, onNavigate: () => {}, checked, onToggle: () => {},
})));
const QUELLE = fs.readFileSync(path.resolve(__dirname, '../ChapterView.jsx'), 'utf8');

describe('Kapitel Behörden', () => {
  it('der Kasten «Folgende Stände und Fristen sind erfasst» ist weg', () => {
    expect(kapitel('behoerden', DEMO_DATA.behoerden)).not.toContain('Folgende Stände und Fristen sind erfasst');
    expect(QUELLE).not.toContain("tr('behördenStatus.intro')");
  });
  it('Zusammenfassung mit Steuererklärung und Betreibungsregister', () => {
    expect(kapitel('behoerden', DEMO_DATA.behoerden)).toContain('Ihre Steuerangelegenheiten laufen über den Kanton Zürich. Keine offene Steuererklärung, laut Ihren Angaben ist das Betreibungsregister ohne Einträge.');
  });
  // Seit dem Muster M2 (25.10.2026) gilt das für jedes Kapitel: leere Felder stehen leise in «Nicht erfasst: …»
  // (vorher eine eigene Zeile nur für die Vertretung).
  it('Vertretung leer: «Nicht erfasst: Rechtsbeistand …»', () => {
    expect(kapitel('behoerden', DEMO_DATA.behoerden)).toMatch(/Nicht erfasst: Rechtsbeistand[,.]/);
    expect(kapitel('behoerden', { ...DEMO_DATA.behoerden, legalRepresentative: 'Anwältin X' })).not.toMatch(/Nicht erfasst: Rechtsbeistand[,.]/);
  });
});

describe('Instrument oben', () => {
  it('Steuerfrist als Kalenderblatt mit Satz, offen, Weg zu Steuern und zum Kapitel Finanzen', () => {
    const text = instrument();
    expect(text).toContain('Steuererklärung fällig am 31. März 2027');
    expect(text).toContain('Offene Steuererklärungen: 0');
    expect(text).toContain('Alles zu Ihren Steuern');
    expect(text).toContain('Steuerbetrag und Belastung');
  });
  it('verpasste Frist: der belegte Hinweis bleibt', () => {
    expect(instrument({ ...DEMO_DATA.behoerden, taxFilingDeadline: '2020-03-31', pendingTaxReturns: '1' })).toContain('Die erfasste Frist ist vorbei.');
  });
  it('Behördengänge offen: 5 Gänge, «Steuererklärung eingereicht» als Vorschlag bei 0 offen', () => {
    expect(GAENGE).toHaveLength(5);
    expect(GAENGE.map((g) => g.id)).not.toContain('patientenverfuegung');
    // Seit der Nachprüfung nur mit Frist (dann mit Steuerjahr), siehe unten.
    expect(gangErledigt('steuererklaerung', {}, { pendingTaxReturns: '0', taxFilingDeadline: '2027-03-31' })).toBe(true);
    expect(gangErledigt('steuererklaerung', {}, { pendingTaxReturns: '0' })).toBe(false);
    expect(gangErledigt('steuererklaerung', { steuererklaerung: false }, { pendingTaxReturns: '0', taxFilingDeadline: '2027-03-31' })).toBe(false);
    expect(gangErledigt('steuererklaerung', {}, { pendingTaxReturns: '1' })).toBe(false);
    expect(instrument()).toContain('1 von 5 erledigt.');
  });
  it('«Für den Fall der Fälle»: nur das Testament, die Vorsorge steht im Notfall (F7-K5-2)', () => {
    const text = instrument();
    expect(text).toContain('Für den Fall der Fälle');
    expect(text).toMatch(/Testament Nein/);
    expect(text).toContain('Vorsorge im Kapitel Notfall');
    expect(text).not.toMatch(/Vorsorgeauftrag Noch nicht/);
    expect(text).not.toMatch(/Patientenverfügung Noch nicht/);
  });
});

describe('Querverweis und Beispiel', () => {
  it('Finanzen: «Passend» führt zu Steuerfrist & Steuererklärung', () => {
    const text = kapitel('finanzen', DEMO_DATA.finanzen);
    expect(text).toContain('Steuerfrist & Steuererklärung');
  });
  it('Maria: Steuerfrist 31.03.2027 (ZStB Nr. 133.1), nicht in der Vergangenheit', () => {
    expect(DEMO_DATA.behoerden.taxFilingDeadline).toBe('2027-03-31');
  });
});

describe('Texte in allen fünf Sprachen', () => {
  for (const [name, s] of Object.entries({ en, fr, it: it_, rm })) {
    it(name, () => {
      for (const k of Object.keys(de.behoerdenInstrument)) expect(s.behoerdenInstrument?.[k], name + ' ' + k).toBeTruthy();
      for (const k of ['keineOffene', 'eineOffene', 'offene', 'betreibungLeer', 'betreibungEintraege']) expect(s.mirror.behoerden[k], name + ' ' + k).toBeTruthy();
      // Muster M2 (25.10.2026): «Nicht erfasst: …» für alle Kapitel statt der eigenen Vertretungs-Zeile.
      expect(s.chapterView.abschnitt.nichtErfasst).toContain('{liste}');
      expect(s.chapterView.passend.steuerfrist).toBeTruthy();
    });
  }
});

// Nachprüfung 25.10.2026 (swiss-precision Muss): der Haken nennt das Steuerjahr und ist als Vorschlag gekennzeichnet —
// sonst stand «Steuererklärung eingereicht» angehakt neben der Frist fürs nächste Jahr.
import { erledigtesSteuerjahr, offeneErklaerungen } from '../components/BehoerdenInstrument.jsx';
describe('Nachprüfung: Steuerjahr und leere Werte', () => {
  const heute = new Date(2026, 9, 25);
  it('Frist noch vor uns, 0 offen: das Jahr davor ist erledigt (2027 → 2025)', () => {
    expect(erledigtesSteuerjahr({ taxFilingDeadline: '2027-03-31', pendingTaxReturns: '0' }, heute)).toBe(2025);
  });
  it('Frist vorbei, 0 offen: die Erklärung zu dieser Frist ist erledigt (2026 → 2025)', () => {
    expect(erledigtesSteuerjahr({ taxFilingDeadline: '2026-03-31', pendingTaxReturns: '0' }, heute)).toBe(2025);
  });
  it('ohne Frist oder mit offenen: kein Jahr, kein Vorschlag', () => {
    expect(erledigtesSteuerjahr({ pendingTaxReturns: '0' }, heute)).toBeNull();
    expect(erledigtesSteuerjahr({ taxFilingDeadline: '2027-03-31', pendingTaxReturns: '1' }, heute)).toBeNull();
  });
  it('leer, null und Leerzeichen heissen «nicht erfasst»', () => {
    expect(offeneErklaerungen({ pendingTaxReturns: null })).toBeNull();
    expect(offeneErklaerungen({ pendingTaxReturns: ' ' })).toBeNull();
    expect(offeneErklaerungen({ pendingTaxReturns: ' 0' })).toBe(0);
    expect(kapitel('behoerden', { ...DEMO_DATA.behoerden, pendingTaxReturns: null })).not.toContain('Keine offene Steuererklärung');
  });
  it('Maria: «Steuererklärung 2025 eingereicht» mit Hinweis auf den Vorschlag', () => {
    const text = instrument();
    expect(text).toContain('Steuererklärung 2025 eingereicht');
    expect(text).toContain('Vorschlag aus «Offene Steuererklärungen: 0»');
  });
});
