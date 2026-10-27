import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import en from '../i18n/en.js';
import fr from '../i18n/fr.js';
import itSprache from '../i18n/it.js';
import rm from '../i18n/rm.js';
import { LIGHT_PALETTE } from '../config/constants.js';
import { ABLAEUFE, SEARCH_VIEWS } from '../config/ansichtenRegister.js';
import { VALID_VIEWS } from '../utils/hashRouter.js';
import { alleWege } from '../data/gepaeck.js';
import { VERWANDTE } from '../config/ablaufVerwandte.js';
import { SelbstMahnen } from '../SelbstMahnen.jsx';
import { RechnungOffen } from '../RechnungOffen.jsx';

// F7-A10 (Entscheid Stebler Studios 27.10.2026): der Teil «Umgekehrt: Ihnen schuldet jemand Geld» aus «Mahnung oder
// Zahlungsbefehl» ist ein eigener kurzer Ablauf — im Register, im Rucksack, in der Suche; Text und Quellen 1:1.

const SPRACHEN = [['de', de], ['en', en], ['fr', fr], ['it', itSprache], ['rm', rm]];
const t = createT({ de }, 'de', 'sie');
const esc = (x) => String(x).replace(/&/g, '&amp;').replace(/'/g, '&#x27;').replace(/"/g, '&quot;');

describe('eigener Ablauf «Jemand schuldet Geld»', () => {
  it('im Register, gültige Adresse, im Rucksack und in der Suche', () => {
    expect(ABLAEUFE.find((a) => a.view === 'selbstmahnen')?.bereich).toBe('finanzen');
    expect(VALID_VIEWS.has('selbstmahnen')).toBe(true);
    expect(alleWege().find((w) => w.view === 'selbstmahnen')?.gegenstand).toBe('geld');
    expect(SEARCH_VIEWS.some((v) => v.view === 'selbstmahnen')).toBe(true);
  });
  it('Mahnung und «Jemand schuldet Geld» verweisen aufeinander', () => {
    expect(VERWANDTE.mahnung).toContain('selbstmahnen');
    expect(VERWANDTE.selbstmahnen).toContain('mahnung');
  });
  it('zeigt den übernommenen Text, den Mahnungs-Brief und OR Art. 102/104', () => {
    const html = renderToStaticMarkup(React.createElement(SelbstMahnen, { palette: LIGHT_PALETTE, t, onNavigate: () => {} }));
    expect(html).toContain(esc(t('selbstMahnen.step1Text')));
    expect(html).toContain(esc(de.briefe.ablaufLink.paymentReminder));
    expect(html).toContain('#art_102');
    expect(html).toContain('#art_104');
    expect(html).toContain('Schritt 1 von 1');
    expect(html).not.toContain('data-ablauf-pass'); // ein Schritt, keine Strasse
  });
  it('die Mahnung hat den Teil nicht mehr', () => {
    const html = renderToStaticMarkup(React.createElement(RechnungOffen, { palette: LIGHT_PALETTE, t, onNavigate: () => {}, stufe: 'mahnung' }));
    expect(html).not.toContain(esc(t('selbstMahnen.step1Text')));
    expect(html).toContain('Schritt 1 von 5');
    expect(de.mahnung.step6Title).toBeUndefined();
  });
});

describe.each(SPRACHEN)('%s', (lang, dict) => {
  it('Text 1:1 übernommen, Quelle mit genau OR/CO Art. 102 und 104 aus mahnung.quelle', () => {
    const s = dict.selbstMahnen;
    for (const k of ['title', 'step1Title', 'step1Text', 'quelle']) expect(s[k], k).toBeTruthy();
    const text = typeof s.step1Text === 'string' ? s.step1Text : s.step1Text.sie;
    expect(text).toMatch(/102/);
    expect(text).toMatch(/104/);
    const links = [...s.quelle.matchAll(/\[\[[^\]|]+\|([^\]]+)\]\]/g)].map((m) => m[1]);
    expect(links).toHaveLength(2);
    for (const l of links) expect(dict.mahnung.quelle).toContain(l);
    expect(typeof dict.nav.sub.selbstmahnen).toBe('string');
    expect(typeof dict.gepaeck.w.selbstmahnen).toBe('string');
  });
});
