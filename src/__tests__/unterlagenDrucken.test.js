import { describe, it, expect, vi, afterAll } from 'vitest';
// Das Notfall-Dossier lädt den QR-Zeichner (vendor/qrcodejs.js), der beim Laden `window` braucht — vor den
// Importen setzen (vi.hoisted), danach wieder wegräumen. Muster: notfallQrAufKlick.test.js.
const gesetzt = vi.hoisted(() => {
  const neu = ['window', 'document'].filter((k) => !(k in globalThis));
  globalThis.window ??= globalThis;
  globalThis.document ??= {
    documentElement: { tagName: 'div' },
    getElementById: () => null,
    createElement: () => ({ style: {}, getContext: () => null, appendChild() {}, setAttribute() {} }),
  };
  return neu;
});
afterAll(() => { for (const k of gesetzt) delete globalThis[k]; });
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { parseHash, UMLEITUNGEN, VALID_VIEWS } from '../utils/hashRouter.js';
import { UnterlagenDrucken, DRUCK_WAHLEN, druckWahl } from '../UnterlagenDrucken.jsx';
import { stufen } from '../config/brotkrumePfade.js';
import { SEARCH_VIEWS, ansichtName } from '../config/ansichtenRegister.js';
import { getChapters, LIGHT_PALETTE } from '../config/constants.js';
import { DEMO_DATA } from '../config/demoData.js';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import en from '../i18n/en.js';
import fr from '../i18n/fr.js';
import it_ from '../i18n/it.js';
import rm from '../i18n/rm.js';

// F7-S2 (Stebler Studios 27.10.2026): Lebensmappe, Behörden- und Notfall-Dossier (alle aus
// dossierGenerator.js) sind EINE Seite «Unterlagen drucken» mit drei Auswahlen — Alles · Für ein Amt ·
// Für den Notfall. Die alten Adressen öffnen die passende Auswahl; der Notfall-QR und die
// Sensibilitäts-Hinweise des Notfall-Dossiers bleiben vollständig.
const quelle = (datei) => fs.readFileSync(path.resolve(__dirname, '..', datei), 'utf8');
const t = createT({ de }, 'de', 'sie');
const esc = (x) => String(x).replace(/&/g, '&amp;').replace(/'/g, '&#x27;').replace(/"/g, '&quot;');
const seite = (wahl, data = DEMO_DATA) => renderToStaticMarkup(React.createElement(UnterlagenDrucken, {
  palette: LIGHT_PALETTE, t, data, chapters: getChapters(t), documents: [], onNavigate: () => {}, wahl, onWahl: () => {},
}));

describe('die alten Adressen öffnen die passende Auswahl', () => {
  it.each([
    ['#/lebensmappe', 'alles'],
    ['#/behoerdendossier', 'amt'],
    ['#/notfalldossier', 'notfall'],
  ])('%s → Unterlagen drucken, Auswahl «%s»', (hash, wahl) => {
    expect(parseHash(hash)).toEqual({ view: 'drucken', chapterIndex: null, anker: null, wahl });
  });

  it('die alten Views bleiben gültig — Abläufe, Kapitel und Notfall rufen sie weiter auf', () => {
    for (const v of ['lebensmappe', 'behoerdendossier', 'notfalldossier', 'drucken']) expect(VALID_VIEWS.has(v), v).toBe(true);
    expect(quelle('components/NotfallImKapitel.jsx')).toContain("onNavigate('notfalldossier')");
    expect(quelle('Fuehrerausweis.jsx')).toContain("onNavigate('behoerdendossier')");
  });

  it('unbekannte Wahl → «Alles»', () => {
    expect(druckWahl(undefined)).toBe('alles');
    expect(druckWahl('all')).toBe('alles');
    expect(druckWahl('notfall')).toBe('notfall');
  });

  it('main.jsx: eine Seite, die drei alten Zweige sind weg', () => {
    const main = quelle('main.jsx');
    expect(main).toMatch(/view === 'drucken' && React\.createElement\(UnterlagenDrucken, \{[^\n]*wahl, onWahl: setWahl/);
    for (const [v, k] of [['lebensmappe', 'Lebensmappe'], ['behoerdendossier', 'BehoerdenDossier'], ['notfalldossier', 'NotfallDossier']]) {
      expect(main).not.toMatch(new RegExp("view === '" + v + "' && React\\.createElement"));
      expect(main).not.toMatch(new RegExp("import\\('\\./" + k + "\\.jsx'\\)"));
    }
    expect(Object.values(UMLEITUNGEN).filter((u) => u.view === 'drucken').map((u) => u.wahl).sort()).toEqual(['alles', 'amt', 'notfall']);
  });
});

describe('die Seite', () => {
  it('Brotkrume «Übersicht › Meine Unterlagen › Unterlagen drucken», ein Seitentitel', () => {
    expect(stufen('drucken').map((s) => s.ziel)).toEqual(['dashboard', 'unterlagen', null]);
    const html = seite('alles');
    expect(html).toContain(esc(t('unterlagen.drucken.title')));
    expect((html.match(/<h2/g) || []).length).toBe(1);
  });

  it('die Auswahl ist eine radiogroup mit drei echten Radioknöpfen, genau einer gewählt', () => {
    const html = seite('amt');
    expect(html).toContain('role="radiogroup" aria-labelledby="mp-drucken-legende"');
    expect(html).toContain('id="mp-drucken-legende"');
    expect((html.match(/type="radio" name="mp-drucken-wahl"/g) || []).length).toBe(3);
    expect((html.match(/checked=""/g) || []).length).toBe(1);
    expect(html).toMatch(/<input[^>]*value="amt"[^>]*checked=""|<input[^>]*checked=""[^>]*value="amt"/);
    for (const w of DRUCK_WAHLEN) expect(html).toContain(esc(t(w.label)));
  });

  it.each([
    ['alles', 'lebensmappe.title', ['behoerdenDossier.title', 'notfallDossier.title']],
    ['amt', 'behoerdenDossier.title', ['lebensmappe.title', 'notfallDossier.title']],
    ['notfall', 'notfallDossier.title', ['lebensmappe.title', 'behoerdenDossier.title']],
  ])('Auswahl «%s» zeigt genau dieses Dossier, mit Abschnittstitel', (wahl, titel, andere) => {
    const html = seite(wahl);
    expect(html).toContain(`data-druck-wahl="${wahl}"`);
    expect(html).toMatch(new RegExp('<h3[^>]*>(<span[^>]*>.*?</span>)?<span[^>]*>' + esc(t(titel)).replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '</span></h3>'));
    for (const k of andere) expect(html).not.toContain('>' + esc(t(k)) + '</span></h3>');
  });

  it('dieselbe Vorschau-Form: Druck-Knopf, Vorschau-Satz und Datenschutz-Satz in allen drei', () => {
    for (const [wahl, ns] of [['alles', 'lebensmappe'], ['amt', 'behoerdenDossier'], ['notfall', 'notfallDossier']]) {
      const html = seite(wahl);
      expect(html, wahl).toContain(esc(t(ns + '.printAction')));
      expect(html, wahl).toContain(esc(t(ns + '.previewNote')));
      expect(html, wahl).toContain(esc(t(ns + '.footerPrivacy')));
    }
  });

  it('Notfall: QR (erst auf Klick) und Sensibilitäts-Hinweise bleiben vollständig', () => {
    const html = seite('notfall');
    expect(html).toContain(esc(t('notfallDossier.privacyNote')));
    expect(html).toContain(esc(t('notfallDossier.qrTitle')));
    expect(html).toContain(esc(t('notfallDossier.qrHint')));
    expect(html).toContain(esc(t('notfallDossier.qrAnzeigen')));
    expect(html).toContain('aria-expanded="false"');
    // Zweiter Ausgang derselben Angaben bleibt.
    expect(html).toContain(esc(t('notfallpass.dossierVerweis')));
    const src = quelle('NotfallDossier.jsx');
    for (const s of ['qrNotfallVcard', 'notfallQrAbschnitte', 'QR_MAX_BYTES_VCARD', "useState(false)", "t('notfallDossier.qrGekuerzt')", "t('notfallDossier.qrFehler')"]) expect(src).toContain(s);
  });

  it('die Dossiers tragen keine eigene Brotkrume und keinen Seitentitel mehr', () => {
    for (const f of ['Lebensmappe.jsx', 'BehoerdenDossier.jsx', 'NotfallDossier.jsx']) {
      const src = quelle(f);
      expect(src, f).not.toMatch(/createElement\(Brotkrume/);
      expect(src, f).not.toMatch(/createElement\(PageTitle/);
    }
  });
});

describe('Ablage, Suche und Texte', () => {
  it('die Ablage zeigt eine Zeile «Unterlagen drucken» statt drei', () => {
    const src = quelle('components/UnterlagenWege.jsx');
    expect(src).toContain("onNavigate('drucken')");
    for (const v of ['lebensmappe', 'notfalldossier', 'behoerdendossier']) expect(src).not.toContain(`onNavigate('${v}')`);
  });

  it('die Suche findet die Seite; «Zurück zu …» kennt ihren Namen', () => {
    const e = SEARCH_VIEWS.find((v) => v.view === 'drucken');
    expect(e.nav).toBe('unterlagen.drucken.title');
    for (const w of ['drucken', 'dossier']) expect(e.aliases).toContain(w);
    expect(ansichtName('drucken')).toBe('unterlagen.drucken.title');
  });

  it('die neuen Texte gibt es in fünf Sprachen', () => {
    for (const [lang, d] of Object.entries({ de, en, fr, it: it_, rm })) {
      for (const k of ['title', 'beschreibung', 'legende', 'alles', 'amt', 'notfall']) {
        const v = d.unterlagen.drucken[k];
        expect(typeof v === 'string' && v.length > 0, `${lang}: unterlagen.drucken.${k}`).toBe(true);
      }
    }
  });
});
