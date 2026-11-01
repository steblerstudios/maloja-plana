import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { parseHash, UMLEITUNGEN, VALID_VIEWS } from '../utils/hashRouter.js';
import { stufen, ELTERN_TITEL } from '../config/brotkrumePfade.js';
import { CHAPTER_KEYS, LIGHT_PALETTE } from '../config/constants.js';
import { Patientenverfuegung } from '../Patientenverfuegung.jsx';
import { Bestattung } from '../Bestattung.jsx';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import en from '../i18n/en.js';
import fr from '../i18n/fr.js';
import it_ from '../i18n/it.js';
import rm from '../i18n/rm.js';

// F7-S10 (Stebler Studios 27.10.2026): Patientenverfügung, Bestattungswünsche und Organspende waren
// Sackgassen — nach Vorschau/Druck bzw. Speichern kein Weg zurück. Jetzt: Brotkrume «Übersicht › Notfall › …»
// und am Schluss «Zurück zur Vorsorge», beides ins Kapitel Notfall zum Block Vorsorge.
const quelle = (datei) => fs.readFileSync(path.resolve(__dirname, '..', datei), 'utf8');
const t = createT({ de }, 'de', 'sie');
const FORMULARE = { patientenverfuegung: 'Patientenverfuegung.jsx', bestattung: 'Bestattung.jsx', organ: 'OrganDonation.jsx' };

describe('das Ziel: Kapitel Notfall, Block Vorsorge', () => {
  it('Kapitel-Index aus CHAPTER_KEYS, Sprungmarke des Vorsorge-Blocks', () => {
    expect(UMLEITUNGEN.notfallvorsorge).toEqual({ view: 'chapter', chapterIndex: CHAPTER_KEYS.indexOf('notfall'), anker: 'mp-notfall-vorsorge' });
    expect(CHAPTER_KEYS.indexOf('notfall')).toBeGreaterThan(-1);
    expect(parseHash('#/notfallvorsorge')).toEqual(UMLEITUNGEN.notfallvorsorge);
    expect(VALID_VIEWS.has('notfallvorsorge')).toBe(true);
  });

  it('die Sprungmarke gibt es im Vorsorge-Block wirklich', () => {
    const src = quelle('components/NotfallImKapitel.jsx');
    expect(src).toMatch(/'data-teil': 'notfall-vorsorge', 'aria-labelledby': 'mp-notfall-vorsorge'/);
    expect(src).toMatch(/h\('h3', \{ id: 'mp-notfall-vorsorge'/);
  });
});

describe('Brotkrume «Übersicht › Notfall › …»', () => {
  it.each(Object.keys(FORMULARE))('%s', (v) => {
    expect(stufen(v).map((s) => s.ziel)).toEqual(['dashboard', 'notfallvorsorge', null]);
    expect(t(ELTERN_TITEL.notfallvorsorge)).toBe('Notfall');
    expect(quelle(FORMULARE[v])).toContain(`createElement(Brotkrume, { palette, t, view: '${v}', onNavigate })`);
  });

  it('gezeichnet: «Notfall» ist ein Knopf, der Formularname die aktuelle Seite', () => {
    const ziele = [];
    for (const [Komp, titel] of [[Patientenverfuegung, 'pv.ui.title'], [Bestattung, 'bw.ui.title']]) {
      const html = renderToStaticMarkup(React.createElement(Komp, { palette: LIGHT_PALETTE, t, data: {}, onUpdateData: () => {}, lang: 'de', onNavigate: (z) => ziele.push(z) }));
      expect(html).toMatch(/^<nav aria-label="Pfad"/);
      expect(html).toContain('>Notfall</button>');
      expect(html).toMatch(new RegExp('aria-current="page"[^>]*>' + t(titel)));
    }
  });

  it('ohne onNavigate (Vorschau, Tests) keine Brotkrume', () => {
    const html = renderToStaticMarkup(React.createElement(Patientenverfuegung, { palette: LIGHT_PALETTE, t, data: {}, onUpdateData: () => {}, lang: 'de' }));
    expect(html).not.toContain('aria-label="Pfad"');
  });
});

describe('Rückweg am Schluss', () => {
  it('Patientenverfügung und Bestattungswünsche: «Zurück zur Vorsorge» neben «Ändern» in der Vorschau', () => {
    for (const [f, ns] of [['Patientenverfuegung.jsx', 'pv'], ['Bestattung.jsx', 'bw']]) {
      const src = quelle(f);
      expect(src, f).toMatch(new RegExp("t\\('" + ns + "\\.ui\\.aendern'\\)\\),\\s*onNavigate && React\\.createElement\\('button', \\{ type: 'button', style: knopf\\(false\\), onClick: \\(\\) => onNavigate\\('notfallvorsorge'\\) \\}, t\\('notfallKapitel\\.zurueckVorsorge'\\)\\)"));
    }
  });

  it('Organspende: nach dem Speichern, unter «Gespeichert» — und nur dann', () => {
    const src = quelle('OrganDonation.jsx');
    expect(src).toMatch(/GespeichertZeile, \{[^\n]*\}\),\s*onNavigate && gespeichertAls === stand && React\.createElement\('button', \{[^\n]*onClick: \(\) => onNavigate\('notfallvorsorge'\)[^\n]*t\('notfallKapitel\.zurueckVorsorge'\)\)/);
  });

  it('main.jsx gibt allen drei onNavigate mit (vorher Sackgassen)', () => {
    const main = quelle('main.jsx');
    expect(main).toMatch(/view === 'patientenverfuegung' && React\.createElement\(Patientenverfuegung, \{[^\n]*onNavigate: handleNavigate/);
    expect(main).toMatch(/view === 'bestattung' && React\.createElement\(Bestattung, \{[^\n]*onNavigate: handleNavigate/);
    expect(main).toMatch(/view === 'organ' && React\.createElement\(OrganDonation, \{\s*palette, t, vorlaeufig, onNavigate: handleNavigate/);
  });

  it('«Zurück zur Vorsorge» in fünf Sprachen', () => {
    for (const [lang, d] of Object.entries({ de, en, fr, it: it_, rm })) {
      const v = d.notfallKapitel.zurueckVorsorge;
      expect(typeof v === 'string' && v.length > 0, lang).toBe(true);
    }
  });
});
