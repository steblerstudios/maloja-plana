import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { parseHash, UMLEITUNGEN, VALID_VIEWS } from '../utils/hashRouter.js';
import { UnterlagenWege, UNTERLAGEN_ANKER } from '../components/UnterlagenWege.jsx';
import { DocumentTresor } from '../DocumentTresor.jsx';
import { PFADE } from '../config/brotkrumePfade.js';
import { getChapters, LIGHT_PALETTE } from '../config/constants.js';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';

// Seiten bündeln, Gruppe H (docs/entscheide/seiten-buendeln.md, 24.10.2026): «Meine Unterlagen» ist
// keine eigene Seite mehr, sondern ein Abschnitt unten in der Dokumentenablage — Dossiers,
// Briefvorlagen, Datensicherung. Alte Links, Abläufe und die Brotkrumen der Dossiers landen dort.
const quelle = (datei) => fs.readFileSync(path.resolve(__dirname, '..', datei), 'utf8');
const t = createT({ de }, 'de', 'sie');
const esc = (x) => String(x).replace(/&/g, '&amp;').replace(/'/g, '&#x27;').replace(/"/g, '&quot;');
const ziele = [];
const wege = () => renderToStaticMarkup(React.createElement(UnterlagenWege, { palette: LIGHT_PALETTE, t, onNavigate: (v) => ziele.push(v) }));

describe('#/unterlagen führt in die Dokumentenablage', () => {
  it('der Router löst den alten Link auf: Ablage, Abschnitt «Meine Unterlagen»', () => {
    expect(parseHash('#/unterlagen')).toEqual({ view: 'tresor', chapterIndex: null, anker: UNTERLAGEN_ANKER });
  });

  it('der alte View bleibt gültig — Abläufe, Merkpunkte und Brotkrumen rufen ihn weiter auf', () => {
    expect(VALID_VIEWS.has('unterlagen')).toBe(true);
    for (const p of Object.values(PFADE).filter((x) => x.eltern === 'unterlagen')) expect(UMLEITUNGEN[p.eltern]).toBeTruthy();
  });
});

describe('der Abschnitt in der Ablage', () => {
  const html = wege();

  it('Titel, Satz und Sprungmarke', () => {
    expect(html).toContain(`id="${UNTERLAGEN_ANKER}"`);
    expect(html).toContain(esc(t('unterlagen.title')));
    expect(html).toContain(esc(t('unterlagen.subtitle')));
  });

  it('alle Wege der früheren Seite sind da — ausser der Ablage selbst', () => {
    for (const k of ['lebensmappe', 'notfall', 'behoerden', 'briefe']) expect(html).toContain(esc(t('unterlagen.dossier.' + k + '.title')));
    expect(html).toContain(esc(t('unterlagen.backup.title')));
    expect(html).not.toContain('>' + esc(t('tresor.title')) + '<');
  });

  it('die Ziele stimmen', () => {
    const src = quelle('components/UnterlagenWege.jsx');
    for (const v of ['lebensmappe', 'notfalldossier', 'behoerdendossier', 'briefe', 'export']) {
      expect(src).toContain(`onNavigate('${v}')`);
      expect(VALID_VIEWS.has(v)).toBe(true);
    }
  });

  it('jeder Weg ist ein echter Knopf', () => {
    expect((html.match(/<button type="button"/g) || []).length).toBe(5);
  });

  it('die Ablage zeigt den Abschnitt — auch leer', () => {
    const ablage = renderToStaticMarkup(React.createElement(DocumentTresor, {
      palette: LIGHT_PALETTE, t, documents: [], chapters: getChapters(t), onNavigate: () => {},
    }));
    expect(ablage).toContain(`id="${UNTERLAGEN_ANKER}"`);
  });
});

describe('main.jsx und Dashboard: keine eigene Seite mehr', () => {
  it('kein Render-Zweig, kein Lazy-Import, keine Datei', () => {
    const main = quelle('main.jsx');
    expect(main).not.toMatch(/view === 'unterlagen' && React\.createElement/);
    expect(main).not.toMatch(/import\('\.\/MeineUnterlagen\.jsx'\)/);
    expect(fs.existsSync(path.resolve(__dirname, '..', 'MeineUnterlagen.jsx'))).toBe(false);
  });

  it('die Ablage bekommt onNavigate', () => {
    expect(quelle('main.jsx')).toMatch(/view === 'tresor' && React\.createElement\(DocumentTresor, \{[\s\S]{0,900}onNavigate: handleNavigate/);
  });

  it('die Werkzeug-Gruppe im Dashboard nennt dieselbe Seite nicht zweimal', () => {
    expect(quelle('Dashboard.jsx')).not.toContain("view: 'unterlagen'");
  });
});
