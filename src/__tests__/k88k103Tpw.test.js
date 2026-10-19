import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { TAXPUNKTWERT, TAXPUNKTWERT_QUELLEN, berechneArztrechnung, taxpunktwertFuer } from '../data/kvgLeistungen.js';
import { KVGLeistungen, TpwQuellen } from '../KVGLeistungen.jsx';
import de from '../i18n/de.js';
import en from '../i18n/en.js';
import fr from '../i18n/fr.js';
import it_ from '../i18n/it.js';
import rm from '../i18n/rm.js';

const SPRACHEN = { de, en, fr, it: it_, rm };
const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const tKey = (k, p) => (p && typeof p === 'object' && Object.keys(p).length ? k + '(' + Object.values(p).join('|') + ')' : k);
const quellenHtml = () => renderToStaticMarkup(React.createElement(TpwQuellen, { palette, t: tKey }));

// ─────────────────────────────────────────────────────────────
// K88 · Versicherergruppe, wo der Beleg nur für eine gilt; Stand-Datum bei GR/ZG
// Belege (abgerufen 19.09.2026, je mit Gegenprobe 404 auf erfundene Adresse derselben Domain):
//   GE — ge.ch, Communiqué 24.06.2026: «… de CSS Assurance-maladie SA»
//   VD — vd.ch, Séance 1032981: «entre santéservices SA et la Société vaudoise de médecine»
//   LU — BVGer C-437/2026: «durch die tarifsuisse ag vertretenen Krankenversicherer»
//   UR — BVGer C-409/2026: «für die Versicherten der Einkaufsgemeinschaft HSK AG»
//   GR — PDF «Stand: 07.09.2026» · ZG — PDF «(Stand 13. Januar 2026)»
// ─────────────────────────────────────────────────────────────
describe('K88 · Quellen-Links nennen Versicherergruppe und Stand', () => {
  it('Daten: Zusatz je Kanton nach dem SZ-Muster (K92)', () => {
    expect(TAXPUNKTWERT_QUELLEN.GE.zusatz).toBe('GE');
    expect(TAXPUNKTWERT_QUELLEN.VD.zusatz).toBe('VD');
    expect(TAXPUNKTWERT_QUELLEN.LU.zusatz).toBe('LU');
    expect(TAXPUNKTWERT_QUELLEN.UR.zusatz).toBe('UR');
  });

  it('Stand-Datum bei GR und ZG steht in den Daten und in der URL der Übersicht', () => {
    expect(TAXPUNKTWERT_QUELLEN.GR.stand).toBe('07.09.2026');
    expect(TAXPUNKTWERT_QUELLEN.ZG.stand).toBe('13.01.2026');
    expect(TAXPUNKTWERT_QUELLEN.GR.url).toContain('Stand%2007.09.2026');
    expect(TAXPUNKTWERT_QUELLEN.ZG.url).toContain('Stand%2013.%20Januar%202026');
  });

  it('Anzeige: Gruppe bzw. Stand im Linktext', () => {
    const html = quellenHtml();
    expect(html).toContain('GE (kvg.tpwQuelleGE)');
    expect(html).toContain('VD (kvg.tpwQuelleVD)');
    expect(html).toContain('LU (kvg.tpwQuelleLU)');
    expect(html).toContain('UR (kvg.tpwQuelleUR)');
    expect(html).toContain('SO (kvg.tpwQuelleSO)');
    expect(html).toContain('GR (kvg.tpwQuelleStand(07.09.2026))');
    expect(html).toContain('ZG (kvg.tpwQuelleStand(13.01.2026))');
    // Kantone, deren Beleg für alle Gruppen gilt, bleiben kurz
    expect(html).toMatch(/>ZH</);
    expect(html).toMatch(/>BE</);
    // 18 Links (SO seit 19.10.2026), jeder mit ≥44 px Tippfläche
    const links = html.match(/<a [^>]*>/g) || [];
    expect(links).toHaveLength(18);
    for (const a of links) expect(a).toContain('min-height:44px');
  });

  it('UR verlinkt das BVGer-Urteil C-409/2026 (Beleg für HSK), nicht die Medienmitteilung', () => {
    expect(TAXPUNKTWERT_QUELLEN.UR.url).toBe('https://entscheidsuche.ch/docs/CH_BVGer/CH_BVGE_001_C-409-2026_2026-03-12.pdf');
  });

  it('keine Klammer in der Klammer im Linktext (Entscheid 19.09.2026)', () => {
    for (const [lang, tr] of Object.entries(SPRACHEN)) {
      for (const [k, v] of Object.entries(tr.kvg)) {
        if (k.startsWith('tpwQuelle') && typeof v === 'string') expect(v, lang + ' ' + k).not.toMatch(/[()]/);
      }
    }
  });

  it('Texte in allen fünf Sprachen, mit der richtigen Gruppe', () => {
    for (const [lang, tr] of Object.entries(SPRACHEN)) {
      expect(tr.kvg.tpwQuelleGE, lang).toMatch(/CSS/);
      expect(tr.kvg.tpwQuelleGE, lang).not.toMatch(/HSK|santéservices|tarifsuisse/);
      expect(tr.kvg.tpwQuelleUR, lang).toMatch(/HSK/);
      expect(tr.kvg.tpwQuelleUR, lang).not.toMatch(/CSS|santéservices/);
      for (const k of ['tpwQuelleVD', 'tpwQuelleLU']) {
        expect(tr.kvg[k], lang + ' ' + k).toMatch(/santéservices, [^;()]*tarifsuisse/);
        expect(tr.kvg[k], lang + ' ' + k).not.toMatch(/CSS|HSK/);
      }
      expect(tr.kvg.tpwQuelleStand, lang).toContain('{datum}');
      expect(tr.kvg.tpwQuelleSeiten, lang).toContain('{seiten}');
    }
  });
});

// ─────────────────────────────────────────────────────────────
// K102 · tarifsuisse heisst heute santéservices
// Beleg: https://www.santeservices.ch/santeservices/ (abgerufen 19.09.2026): «Seit dem 1. Juli 2026
// treten die Gesellschaften santésuisse, SVK, SASIS AG und santéservices (vormals tarifsuisse ag)
// unter der Marke santéservices auf.» Gegenprobe (erfundene Adresse) 404; tarifsuisse.ch leitet
// per 301 auf santeservices.ch weiter.
// ─────────────────────────────────────────────────────────────
describe('K102 · santéservices (vormals tarifsuisse)', () => {
  it('SZ nennt santéservices mit dem alten Namen, Werte unverändert', () => {
    for (const [lang, tr] of Object.entries(SPRACHEN)) {
      expect(tr.kvg.tpwQuelleSZ, lang).toMatch(/0\.85.*santéservices, [^;()]*tarifsuisse ?; 0\.86.*CSS.*HSK/);
    }
    expect(TAXPUNKTWERT.SZ).toBe(0.85);
  });

  it('nirgends mehr «tarifsuisse» ohne santéservices davor in den Quellen-Texten', () => {
    for (const [lang, tr] of Object.entries(SPRACHEN)) {
      for (const [k, v] of Object.entries(tr.kvg)) {
        if (!k.startsWith('tpw') || typeof v !== 'string' || !v.includes('tarifsuisse')) continue;
        expect(v, lang + ' ' + k).toMatch(/santéservices, [^;()]*tarifsuisse/);
      }
    }
  });
});

// ─────────────────────────────────────────────────────────────
// K89 · TI: Seitenangabe und Sprungmarke auf den Beschluss
// Beleg: Bollettino ufficiale delle leggi Nr. 6 vom 13.02.2026, gedruckte S. 64–65 = PDF-Seite 20–21
// (pdftotext, abgerufen 19.09.2026). Die Sprungmarke #pagemode=bookmarks&page=20 stammt aus dem
// Index der Raccolta delle leggi des Kantons (m3.ti.ch/CAN/RLeggi/…/entrataVigore/anno/2026).
// ─────────────────────────────────────────────────────────────
describe('K89 · TI-Quelle führt auf die Seite des Beschlusses', () => {
  it('URL springt auf PDF-Seite 20, Linktext nennt S. 64–65', () => {
    expect(TAXPUNKTWERT_QUELLEN.TI.url).toBe('https://www3.ti.ch/CAN/fu/2026/BU_006.pdf#pagemode=bookmarks&page=20');
    expect(TAXPUNKTWERT_QUELLEN.TI.seiten).toBe('64–65');
    expect(quellenHtml()).toContain('TI (kvg.tpwQuelleSeiten(64–65))');
  });

  it('FR bleibt unverändert (bestätigt, nicht ersetzt)', () => {
    expect(TAXPUNKTWERT_QUELLEN.FR.url).toBe('https://bdlf.fr.ch/app/fr/texts_of_law/842.1.24');
  });
});

// ─────────────────────────────────────────────────────────────
// K103 · kein stiller Rückfall auf 0.89
// ─────────────────────────────────────────────────────────────
describe('K103 · ohne oder mit unbekanntem Kanton keine Zahl', () => {
  it('taxpunktwertFuer: nur bekannte Kantone', () => {
    expect(taxpunktwertFuer('ZH')).toBe(0.91);
    expect(taxpunktwertFuer('')).toBeNull();
    expect(taxpunktwertFuer(undefined)).toBeNull();
    expect(taxpunktwertFuer('XX')).toBeNull();
    expect(taxpunktwertFuer('toString')).toBeNull();
  });

  it('berechneArztrechnung gibt ohne Kanton null zurück statt 0.89', () => {
    expect(berechneArztrechnung(100, '')).toBeNull();
    expect(berechneArztrechnung(100, 'XX')).toBeNull();
    expect(berechneArztrechnung(100, 'ZH').betrag).toBe(91);
  });

  it('Tab «Rechnung» mit unbekanntem Profil-Kanton: Auswahl steht auf «bitte wählen»', () => {
    const html = renderToStaticMarkup(React.createElement(KVGLeistungen, { palette, t: tKey, data: { basis: { canton: 'XX' } }, initialTab: 'rechnung', onUpdateData: () => {} }));
    expect(html).not.toContain('value="XX"');
    expect(html).toMatch(/<option value="" selected="">common\.select<\/option>/);
  });

  it('Texte in allen fünf Sprachen, anredefrei', () => {
    for (const [lang, tr] of Object.entries(SPRACHEN)) {
      for (const k of ['tpwOhneKanton', 'tpwOhneKantonProfil']) {
        expect(typeof tr.kvg[k], lang + ' ' + k).toBe('string');
        expect(tr.kvg[k].length, lang + ' ' + k).toBeGreaterThan(10);
      }
    }
  });
});

// ─────────────────────────────────────────────────────────────
// SO · Taxpunktwert 2026 amtlich belegt (19.10.2026)
// Belege (rrb.so.ch, pdftotext): RRB SO 2026/825 vom 28.04.2026, Ziff. 3.2 — GAeSO ↔ santéservices
// ag «mit einem Taxpunktwert von 0.84 Franken, gültig ab 1. Januar 2026, wird genehmigt»;
// RRB 2026/1038 vom 02.06.2026 — CSS ebenfalls 0.84; RRB 2026/408 vom 03.03.2026, Ziff. 3.1 — HSK 0.85.
// Der frühere App-Wert 0.89 galt 2025 für keine der drei Gruppen (je Ziff. 1/1.2 «Bis 2025 betrug …»).
// BL und JU bleiben unbelegt: an der Kantonsquelle nur Spital- bzw. Klinikbeschlüsse gefunden.
// ─────────────────────────────────────────────────────────────
describe('SO · Taxpunktwert 2026 belegt, BL/JU bewusst unverändert', () => {
  it('SO führt 0.84 (santéservices) mit Quelle RRB 2026/825', () => {
    expect(TAXPUNKTWERT.SO).toBe(0.84);
    expect(taxpunktwertFuer('SO')).toBe(0.84);
    expect(TAXPUNKTWERT_QUELLEN.SO).toEqual({
      art: 'behoerde',
      url: 'https://rrb.so.ch/beschlussnummer/2026_825/download/1b4811c78b1542fbbd5d161c3e95fbb0/',
      zusatz: 'SO',
      gruppe: 'santéservices',
    });
  });

  it('Linktext nennt santéservices, CSS 0.84 und HSK 0.85 — in allen fünf Sprachen', () => {
    for (const [lang, tr] of Object.entries(SPRACHEN)) {
      expect(tr.kvg.tpwQuelleSO, lang).toMatch(/^0\.84 [^;]*santéservices ?;.*CSS 0\.84, HSK 0\.85$/);
    }
  });

  it('BL und JU behalten den Stand 2025 (keine Kantonsquelle 2026 für die freie Praxis)', () => {
    expect(TAXPUNKTWERT.BL).toBe(0.89);
    expect(TAXPUNKTWERT.JU).toBe(0.88);
    expect(TAXPUNKTWERT_QUELLEN.BL).toBeUndefined();
    expect(TAXPUNKTWERT_QUELLEN.JU).toBeUndefined();
  });
});
