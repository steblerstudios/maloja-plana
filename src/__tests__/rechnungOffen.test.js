import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { RechnungOffen, STUFEN } from '../RechnungOffen.jsx';
import { ohneNummer } from '../AblaufSchale.jsx';
import { ABLAEUFE } from '../config/ansichtenRegister.js';
import { VALID_VIEWS } from '../utils/hashRouter.js';
import { LIGHT_PALETTE } from '../config/constants.js';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import en from '../i18n/en.js';
import fr from '../i18n/fr.js';
import itSprache from '../i18n/it.js';
import rm from '../i18n/rm.js';

// Seiten bündeln, Gruppe E (docs/entscheide/seiten-buendeln.md, Entscheid 5, 24.10.2026): «Mahnung
// erhalten» und «Betreibung erhalten» sind EINE Seite «Rechnung nicht bezahlt». Die Adresse wählt
// die Stufe; gezeigt wird nur der gewählte Teil — wer über «Betreibung» kommt, sieht die
// 10-Tage-Frist des Rechtsvorschlags sofort, nie hinter einer zugeklappten Zeile.
const quelle = (datei) => fs.readFileSync(path.resolve(__dirname, '..', datei), 'utf8');
const t = createT({ de }, 'de', 'sie');
const esc = (x) => String(x).replace(/&/g, '&amp;').replace(/'/g, '&#x27;').replace(/"/g, '&quot;');
const zeichne = (stufe, onNavigate = () => {}) =>
  renderToStaticMarkup(React.createElement(RechnungOffen, { palette: LIGHT_PALETTE, t, onNavigate, stufe }));

// Seit der Ablauf-Schale W (F7-A1, 27.10.2026) stehen die Schritt-Titel ohne «1 · » — die Nummer steht in
// «Schritt 1 von N» darüber. Darum hier ohneNummer().
describe('eine Seite, zwei Stufen', () => {
  it('beide Adressen bleiben gültig und stehen im Register', () => {
    for (const v of STUFEN) {
      expect(VALID_VIEWS.has(v)).toBe(true);
      expect(ABLAEUFE.find((a) => a.view === v)).toBeTruthy();
    }
  });

  it('main.jsx zeichnet beide Adressen mit derselben Seite, die Stufe aus der Adresse', () => {
    const main = quelle('main.jsx');
    expect(main).toMatch(/\(view === 'mahnung' \|\| view === 'betreibung'\) && React\.createElement\(RechnungOffen, \{ key: view,[^}]*stufe: view \}/);
    expect(main).not.toMatch(/import\('\.\/(Mahnung|Betreibung)Erhalten\.jsx'\)/);
  });

  it('die Einleitung unterstellt keine Abfolge Rechnung → Mahnung → Betreibung (Fachprüfung 24.10.2026)', () => {
    for (const w of ['bis zum', 'bis zur', 'Von der']) expect(t('rechnungOffen.intro')).not.toContain(w);
    expect(en.rechnungOffen.intro).toContain('payment order');
  });

  it('Titel und Frage der gemeinsamen Seite', () => {
    const html = zeichne('mahnung');
    expect(html).toContain(esc(t('rechnungOffen.title')));
    expect(html).toContain(esc(t('rechnungOffen.frage')));
  });

  it('die Wahl zeigt beide Stufen und markiert die aktive', () => {
    const html = zeichne('betreibung');
    expect(html).toMatch(/aria-pressed="true" data-stufe="betreibung"/);
    expect(html).toMatch(/aria-pressed="false" data-stufe="mahnung"/);
    // Eigene Beschriftungen: der Knopf nennt das Papier, das ankommt («Zahlungsbefehl»), nicht das Verfahren
    // (Fachprüfung 24.10.2026). nav.betreibung bleibt für Menü und Suche.
    expect(html).toContain(esc(t('rechnungOffen.stufeMahnung')));
    expect(html).toContain(esc(t('rechnungOffen.stufeBetreibung')));
    expect(t('rechnungOffen.stufeBetreibung')).toContain('Zahlungsbefehl');
  });

  it('Stufe Mahnung: nur der Mahnungs-Teil', () => {
    const html = zeichne('mahnung');
    expect(html).toContain(esc(ohneNummer(t('mahnung.step1Title'))));
    expect(html).toContain(esc(t('mahnung.intro')));
    expect(html).not.toContain(esc(ohneNummer(t('betreibung.step1Title'))));
  });

  it('Stufe Betreibung: die 10-Tage-Frist steht als erster Schritt da', () => {
    const html = zeichne('betreibung');
    const frist = html.indexOf(esc(ohneNummer(t('betreibung.step1Title'))));
    expect(frist).toBeGreaterThan(0);
    expect(html).toContain('id="betreibung-frist"');
    expect(html).not.toContain(esc(ohneNummer(t('mahnung.step1Title'))));
    expect(html).not.toContain('<details');
  });

  it('die Wahl wechselt die Adresse (Zurück und Lesezeichen stimmen)', () => {
    expect(quelle('RechnungOffen.jsx')).toContain('onNavigate(key)');
  });

  it('eine unbekannte Stufe fällt auf die Mahnung zurück', () => {
    expect(zeichne('unsinn')).toContain(esc(ohneNummer(t('mahnung.step1Title'))));
  });
});

describe('die neuen Texte in fünf Sprachen', () => {
  for (const [lang, dict] of [['de', de], ['fr', fr], ['it', itSprache], ['en', en], ['rm', rm]]) {
    it(lang, () => {
      for (const k of ['title', 'intro', 'frage', 'stufeMahnung', 'stufeBetreibung']) {
        expect(typeof dict.rechnungOffen?.[k], lang + ' rechnungOffen.' + k).toBe('string');
        expect(dict.rechnungOffen[k].length).toBeGreaterThan(3);
      }
    });
  }
});
