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
  palette: LIGHT_PALETTE, t, behoerden, allData: DEMO_DATA, onNavigate: () => {}, checked, onToggle: () => {},
})));
const QUELLE = fs.readFileSync(path.resolve(__dirname, '../ChapterView.jsx'), 'utf8');

describe('Kapitel Behörden', () => {
  it('der Kasten «Folgende Stände und Fristen sind erfasst» ist weg', () => {
    expect(kapitel('behoerden', DEMO_DATA.behoerden)).not.toContain('Folgende Stände und Fristen sind erfasst');
    expect(QUELLE).not.toContain("tr('behördenStatus.intro')");
  });
  it('Zusammenfassung mit Steuererklärung und Betreibungsregister', () => {
    expect(kapitel('behoerden', DEMO_DATA.behoerden)).toContain('Ihre Steuerangelegenheiten laufen über den Kanton Zürich. Keine offene Steuererklärung, das Betreibungsregister ist ohne Einträge.');
  });
  it('Vertretung leer: «Rechtliche Vertretung: nicht erfasst.»', () => {
    expect(kapitel('behoerden', DEMO_DATA.behoerden)).toContain('Rechtliche Vertretung: nicht erfasst.');
    expect(kapitel('behoerden', { ...DEMO_DATA.behoerden, legalRepresentative: 'Anwältin X' })).not.toContain('Rechtliche Vertretung: nicht erfasst.');
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
    expect(gangErledigt('steuererklaerung', {}, { pendingTaxReturns: '0' })).toBe(true);
    expect(gangErledigt('steuererklaerung', { steuererklaerung: false }, { pendingTaxReturns: '0' })).toBe(false);
    expect(gangErledigt('steuererklaerung', {}, { pendingTaxReturns: '1' })).toBe(false);
    expect(instrument()).toContain('1 von 5 erledigt.');
  });
  it('«Für den Fall der Fälle»: Testament, Vorsorgeauftrag, Patientenverfügung', () => {
    const text = instrument();
    expect(text).toContain('Für den Fall der Fälle');
    expect(text).toMatch(/Testament Nein/);
    expect(text).toMatch(/Vorsorgeauftrag Noch nicht/);
    expect(text).toMatch(/Patientenverfügung Noch nicht/);
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
      expect(s.chapterView.vertretungNichtErfasst).toBeTruthy();
      expect(s.chapterView.passend.steuerfrist).toBeTruthy();
    });
  }
});
