// Kapitel 7 · Gesundheit (Befund docs/design/kapitel-7-gesundheit.html, Entscheid Stebler Studios 10.11.2026
// «Ja, alles bauen»). Jeder Test pinnt die Sache, die jemanden falsch handeln liess.
import { describe, it, expect, beforeEach } from 'vitest';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import fr from '../i18n/fr.js';
import it_ from '../i18n/it.js';
import en from '../i18n/en.js';
import rm from '../i18n/rm.js';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { LIGHT_PALETTE } from '../config/constants.js';
import { vorlageHtml } from '../data/vorsorgeauftrag.js';
import { KVGLeistungen } from '../KVGLeistungen.jsx';

beforeEach(() => { globalThis.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} }; });
const t = createT({ de }, 'de', 'sie');
const SPRACHEN = { de, fr, it: it_, en, rm };

describe('L1 · Vorlage zum Vorsorgeauftrag ohne Unterschriftslinien (ZGB Art. 361 Abs. 2)', () => {
  const html = vorlageHtml({}, {}, t, 'de');
  it('druckt keine Linie für Ort, Datum oder Unterschrift', () => {
    expect(html).not.toContain('class="pv-linie"');
    expect(html).not.toMatch(/>Unterschrift</);
  });
  it('sagt stattdessen: von Hand auf die Abschrift', () => {
    expect(html).toContain('Ort, Datum und Unterschrift setzen Sie von Hand auf Ihre Abschrift, nicht auf dieses Blatt.');
    expect(html).toContain('auch nicht mit Unterschrift');
  });
  it('hat den Satz in allen fünf Sprachen', () => {
    for (const [lang, d] of Object.entries(SPRACHEN)) {
      const tt = createT({ [lang]: d }, lang, 'sie');
      expect(tt('va.doc.handschrift'), lang).not.toBe('va.doc.handschrift');
    }
  });
});

describe('L4, L5, L8, L9 · KVG-Sätze am Volltext', () => {
  it('L4 freie Spitalwahl unter Listenspitälern (KVG Art. 41 Abs. 1bis)', () => {
    expect(t('kvg.spitalAllgNote')).toContain('auch in einem anderen Kanton');
    expect(t('kvg.spitalAllgNote')).toContain('höchstens nach dem Tarif des Wohnkantons');
  });
  it('L5 Franchise und Selbstbehalt sind zwei Teile, Kinder 350 (KVG Art. 64)', () => {
    expect(t('kvg.franchiseExplain')).not.toContain('Franchise ist Ihr jährlicher Selbstbehalt');
    expect(t('kvg.franchiseExplain')).toContain('für Kinder CHF 350');
  });
  it('L8 Mutterschaftsleistungen während der ganzen Schwangerschaft ohne Kostenbeteiligung (Art. 64 Abs. 7)', () => {
    expect(t('kvg.schwangerschaftDetail2')).toContain('während der ganzen Schwangerschaft ohne Franchise und Selbstbehalt');
    expect(t('kvg.schwangerschaftDetail2')).toContain('ab der 13. Schwangerschaftswoche');
    for (const k of ['schwangerschaftNote', 'mutterschaftNote']) expect(t('kvg.' + k)).not.toContain('franchisefrei');
  });
  it('L9 nach dem Höchstbetrag nicht «100 %»', () => {
    expect(t('kvg.selbstbehaltDone')).not.toContain('100');
    expect(t('kvg.selbstbehaltDone')).toContain('CHF 15 je Spitaltag');
  });
  it('Psychotherapie im Anordnungsmodell seit Juli 2022, in allen Sprachen (KLV Art. 11b)', () => {
    for (const [lang, d] of Object.entries(SPRACHEN)) {
      expect(JSON.stringify(d.kvg.psychoNote) + d.kvg.psychoModell, lang).not.toContain('2023');
    }
  });
});

describe('L10 · Franchise-Rechner kennt Kinder (KVG Art. 64 Abs. 4, KVV Art. 103)', () => {
  const rechne = (franchise) => renderToStaticMarkup(React.createElement(KVGLeistungen, {
    palette: LIGHT_PALETTE, t, initialTab: 'franchise', onUpdateData: () => {}, onNavigate: () => {},
    data: { versicherungen: { franchise, kkBelege: [{ id: 'b1', betrag: 5000, status: 'bezahlt' }] } },
  }));
  it('eine gespeicherte Kinderfranchise bleibt erhalten und rechnet mit höchstens 350', () => {
    const h = rechne('600');
    expect(h).toMatch(/<option value="kind" selected="">/);
    expect(h).toMatch(/<option value="600" selected="">/);
    expect(h).toContain('Selbstbehalt-Maximum: CHF 350');
    expect(h).toContain('CHF 950'); // 600 Franchise + 350 Selbstbehalt bei 5000 Franken Kosten
  });
  it('Erwachsene rechnen weiter mit 700', () => {
    const h = rechne('2500');
    expect(h).toMatch(/<option value="erwachsen" selected="">/);
    expect(h).toContain('Selbstbehalt-Maximum: CHF 700');
    expect(h).toContain('CHF 2’750'); // 2500 + 250
  });
  it('ein unbekannter Wert wird genannt, nicht still zu 300', () => {
    expect(rechne('750')).toContain('Die gespeicherte Franchise (750) passt zu keiner Stufe.');
  });
});
