import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { parseHash, UMLEITUNGEN, VALID_VIEWS } from '../utils/hashRouter.js';
import { BudgetSync } from '../BudgetSync.jsx';
import { BudgetImport, BUDGET_IMPORT_ANKER } from '../BudgetImport.jsx';
import { WERKZEUGE } from '../data/werkzeugRegister.js';
import { SEARCH_VIEWS } from '../config/ansichtenRegister.js';
import { LIGHT_PALETTE } from '../config/constants.js';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import en from '../i18n/en.js';
import fr from '../i18n/fr.js';
import it_ from '../i18n/it.js';
import rm from '../i18n/rm.js';

// F7-L7 (Stebler Studios 27.10.2026, docs/entscheide/seiten-buendeln.md §2 I): der Budget-Import ist
// keine eigene Seite mehr, sondern der Teil «CSV importieren» unten im Monatsbudget. #/budget bleibt
// als Adresse und springt dorthin; Register, Rucksack und Suche kennen nur noch «Monatsbudget».
const quelle = (datei) => fs.readFileSync(path.resolve(__dirname, '..', datei), 'utf8');
const t = createT({ de }, 'de', 'sie');
const esc = (x) => String(x).replace(/&/g, '&amp;').replace(/'/g, '&#x27;').replace(/"/g, '&quot;');
const seite = (props) => renderToStaticMarkup(React.createElement(BudgetSync, { palette: LIGHT_PALETTE, t, data: {}, ...props }));

describe('#/budget führt ins Monatsbudget, Teil «CSV importieren»', () => {
  it('der Router löst den alten Link auf', () => {
    expect(parseHash('#/budget')).toEqual({ view: 'sync', chapterIndex: null, anker: BUDGET_IMPORT_ANKER });
  });

  it('der alte View bleibt gültig — Schulden, Mahnung, Volljährig und Lebenslagen rufen ihn weiter auf', () => {
    expect(VALID_VIEWS.has('budget')).toBe(true);
    expect(UMLEITUNGEN.budget.view).toBe('sync');
    for (const datei of ['SchuldenManager.jsx', 'MahnungErhalten.jsx', 'Volljaehrig.jsx']) expect(quelle(datei)).toContain("onNavigate('budget')");
  });
});

describe('der Teil im Monatsbudget', () => {
  // BudgetSync rechnet im Effekt (useEffect) — ohne DOM bleibt es beim Laden. Darum: der Teil selbst
  // gerendert, die Einbettung im Quelltext geprüft.
  it('der Teil: Titel «CSV importieren» als Abschnittstitel (kein zweiter Seitentitel) und Datei-Feld', () => {
    const html = renderToStaticMarkup(React.createElement(BudgetImport, { palette: LIGHT_PALETTE, t, currentBudget: {}, onImport: () => {} }));
    expect(html).toContain(`id="${BUDGET_IMPORT_ANKER}-titel"`);
    expect(html).toContain(esc(t('budgetImport.teilTitel')));
    expect(html).toContain('type="file"');
    expect(html).not.toContain('<h2');
  });

  it('das Monatsbudget bettet ihn ein: Abschnitt mit Sprungmarke, nur mit onImport', () => {
    const src = quelle('BudgetSync.jsx');
    expect(src).toMatch(/onImport && React\.createElement\('section', \{\s*id: BUDGET_IMPORT_ANKER, 'aria-labelledby': BUDGET_IMPORT_ANKER \+ '-titel'/);
    expect(src).toContain('React.createElement(BudgetImport, { palette, t, currentBudget: data.finanzen || {}, onImport })');
    expect(seite()).not.toContain(`id="${BUDGET_IMPORT_ANKER}"`);
  });

  it('main.jsx: kein eigener Zweig mehr, das Monatsbudget bekommt onImport', () => {
    const main = quelle('main.jsx');
    expect(main).not.toMatch(/view === 'budget' && React\.createElement/);
    expect(main).not.toMatch(/import\('\.\/BudgetImport\.jsx'\)/);
    expect(main).toMatch(/view === 'sync' && React\.createElement\(BudgetSync, \{[^\n]*onImport: /);
  });
});

describe('Register, Rucksack und Suche: nur «Monatsbudget»', () => {
  it('kein Eintrag «budget» mehr; «sync» heisst wie der Seitentitel', () => {
    expect(WERKZEUGE.some((w) => w.view === 'budget')).toBe(false);
    expect(SEARCH_VIEWS.some((w) => w.view === 'budget')).toBe(false);
    expect(WERKZEUGE.find((w) => w.view === 'sync').nav).toBe('budgetSync.title');
  });

  it('die Suchwörter des Imports führen ins Monatsbudget', () => {
    const sync = SEARCH_VIEWS.find((w) => w.view === 'sync');
    for (const wort of ['csv', 'import', 'budget']) expect(sync.aliases).toContain(wort);
  });
});

describe('der neue Text in fünf Sprachen', () => {
  it('budgetImport.teilTitel', () => {
    for (const [lang, d] of Object.entries({ de, en, fr, it: it_, rm })) {
      expect(typeof d.budgetImport.teilTitel, lang).toBe('string');
      expect(d.budgetImport.teilTitel.length, lang).toBeGreaterThan(0);
    }
  });
});
