import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { parseHash, UMLEITUNGEN, VALID_VIEWS } from '../utils/hashRouter.js';
import { StelleVerloren } from '../StelleVerloren.jsx';
import { AUSSTEUERUNG_ANKER } from '../Aussteuerung.jsx';
import { ABLAEUFE } from '../config/ansichtenRegister.js';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import { LIGHT_PALETTE } from '../config/constants.js';

// Seiten bündeln, Gruppe F (docs/entscheide/seiten-buendeln.md, 24.10.2026): «Ausgesteuert» ist keine
// eigene Seite mehr, sondern der letzte, aufklappbare Teil von «Stelle verloren». Alte Links,
// Lesezeichen, Dashboard, Suche und Gepäck landen dort, und der Teil ist dann offen.
const quelle = (datei) => fs.readFileSync(path.resolve(__dirname, '..', datei), 'utf8');
const t = createT({ de }, 'de', 'sie');
const zeichne = () => renderToStaticMarkup(React.createElement(StelleVerloren, { palette: LIGHT_PALETTE, t, onNavigate: () => {} }));

describe('#/aussteuerung führt zu «Stelle verloren»', () => {
  it('der Router löst den alten Link auf: Stelle verloren, Sprungmarke Aussteuerung', () => {
    expect(parseHash('#/aussteuerung')).toEqual({ view: 'stelleverloren', chapterIndex: null, anker: AUSSTEUERUNG_ANKER });
  });

  it('der alte View bleibt gültig — sonst liefen alte Links ins Leere', () => {
    expect(VALID_VIEWS.has('aussteuerung')).toBe(true);
  });

  it('das Ziel ist eine echte Ansicht', () => {
    expect(VALID_VIEWS.has(UMLEITUNGEN.aussteuerung.view)).toBe(true);
  });

  it('der Eintrag im Register bleibt und führt über die Umleitung (Dashboard, Suche)', () => {
    const eintrag = ABLAEUFE.find((a) => a.view === 'aussteuerung');
    expect(eintrag).toBeTruthy();
    expect(UMLEITUNGEN[eintrag.view]).toBeTruthy();
  });
});

describe('«Stelle verloren» trägt den Teil', () => {
  const html = zeichne();

  it('der Teil steht als Aufklapp-Zeile mit der Sprungmarke da', () => {
    expect(html).toContain(`<details id="${AUSSTEUERUNG_ANKER}"`);
    expect(html).toContain(de.aussteuerung.title);
  });

  it('alle fünf Schritte, die Quelle und der Hinweis sind dabei — nichts ging verloren', () => {
    for (const n of [1, 2, 3, 4, 5]) expect(html).toContain(de.aussteuerung['step' + n + 'Title']);
    expect(html).toContain('AVIG Art. 27');
    expect(html).toContain(de.aussteuerung.footerNote);
  });

  it('der Teil steht nach dem letzten Schritt von «Stelle verloren»', () => {
    expect(html.indexOf(de.stelleVerloren.step4Title)).toBeLessThan(html.indexOf(AUSSTEUERUNG_ANKER));
  });

  it('beim Sprung dorthin klappt der Teil auf', () => {
    expect(quelle('utils/hashRouter.js')).toMatch(/tagName === 'DETAILS'\) el\.open = true/);
  });
});

describe('main.jsx: keine eigene Seite mehr', () => {
  it('kein Render-Zweig und kein Lazy-Import', () => {
    const main = quelle('main.jsx');
    expect(main).not.toMatch(/view === 'aussteuerung' && React\.createElement/);
    expect(main).not.toMatch(/import\('\.\/Aussteuerung\.jsx'\)/);
  });
});
