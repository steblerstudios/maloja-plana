import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { WerkzeugGruppen } from '../components/WerkzeugGruppen.jsx';
import { ABLAEUFE, SEARCH_VIEWS } from '../config/ansichtenRegister.js';
import { WERKZEUGE } from '../data/werkzeugRegister.js';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import fr from '../i18n/fr.js';
import it_ from '../i18n/it.js';
import en from '../i18n/en.js';
import rm from '../i18n/rm.js';
import { LIGHT_PALETTE, CHAPTER_KEYS, getChapters } from '../config/constants.js';

// Seiten-Architektur (Stebler Studios 06.11.2026, docs/design/seiten-architektur-2026-11.md, Frage 4 «A, Kapitel
// führen»): die Übersicht ordnet alle Seiten nach den 7 Kapiteln, in der Reihenfolge der Berge. Löst ab:
// lebensereignisseNachBereich.test.js (Lebensereignisse nach Ast) und die Themen-Gruppen «Geld & Steuern» usw.
const t = createT({ de }, 'de', 'sie');
const chapters = getChapters(t);

const zeichne = (offen) => {
  const speicher = new Map([['mp_offene_werkzeuggruppen', JSON.stringify(offen)]]);
  globalThis.sessionStorage = { getItem: (k) => speicher.get(k) ?? null, setItem: (k, v) => speicher.set(k, String(v)) };
  return renderToStaticMarkup(React.createElement(WerkzeugGruppen, {
    palette: LIGHT_PALETTE, t, simpleView: false, onNavigate: () => {}, onSelectChapter: () => {}, chapters,
  }));
};
const gruppen = (html) => [...html.matchAll(/<details[^>]*>(.*?)<\/details>/gs)].map((m) => {
  const summary = m[1].match(/<summary[^>]*>(.*?)<\/summary>/s)[1];
  // <span><span>Pfeil</span>Titel</span><span>Zahl</span>
  const [, titel, zahl] = summary.match(/<\/span>([^<]*)<\/span><span[^>]*>(\d+)<\/span>$/);
  return { titel: titel.replace(/&amp;/g, '&'), zahl: Number(zahl), inhalt: m[1] };
});
const kapitelTitel = (key) => t('chapters.' + key + '.title');

describe('Übersicht: alle Seiten nach Kapitel', () => {
  let alt;
  beforeEach(() => { alt = globalThis.sessionStorage; });
  afterEach(() => { globalThis.sessionStorage = alt; });

  it('die 7 Kapitel in der Reihenfolge der Berge, dann Ankommen, Mit 18 und die Klammer', () => {
    const titel = gruppen(zeichne([])).map((g) => g.titel);
    expect(titel).toEqual([
      ...CHAPTER_KEYS.map(kapitelTitel),
      t('dashboard.toolGroups.ankommen'), t('dashboard.toolGroups.mit18'), t('dashboard.toolGroups.klammer'),
    ]);
    expect(titel[6]).toBe('Gesundheit');
  });

  it('jede Seite mit Ast steht genau einmal in einem Kapitel', () => {
    const html = zeichne(CHAPTER_KEYS.map(kapitelTitel));
    const kapitel = gruppen(html).slice(0, 7).map((g) => g.inhalt).join('');
    const namen = [
      ...WERKZEUGE.filter((w) => w.bereich).map((w) => t(w.nav)),
      ...SEARCH_VIEWS.filter((v) => v.bereich).map((v) => t(v.nav)),
    ];
    for (const n of new Set(namen)) {
      const treffer = kapitel.split('>' + n.replace(/&/g, '&amp;') + '</div>').length - 1;
      expect(treffer, n).toBe(1);
    }
  });

  it('die Entscheide stehen am richtigen Ort', () => {
    const g = Object.fromEntries(gruppen(zeichne(CHAPTER_KEYS.map(kapitelTitel))).map((x) => [x.titel, x.inhalt]));
    const steht = (kapitel, view) => {
      const e = [...WERKZEUGE, ...SEARCH_VIEWS].find((x) => x.view === view);
      return g[kapitelTitel(kapitel)].includes('>' + t(e.nav).replace(/&/g, '&amp;') + '</div>');
    };
    expect(steht('versicherungen', 'premium')).toBe(true);       // IPV folgt der Krankenkasse
    expect(steht('versicherungen', 'praemien')).toBe(true);
    expect(steht('finanzen', 'sozialhilfe')).toBe(true);
    expect(steht('notfall', 'kvg')).toBe(true);                  // was die Kasse zahlt → Gesundheit
    expect(steht('notfall', 'gesundheit')).toBe(true);           // Arztkoffer
    expect(steht('notfall', 'patientenverfuegung')).toBe(true);
    expect(steht('notfall', 'bestattung')).toBe(true);
    expect(steht('ausbildung', 'alv')).toBe(true);
    expect(steht('ausbildung', 'lehre')).toBe(true);
    expect(steht('basis', 'eo')).toBe(true);
    expect(steht('behoerden', 'betreibungsauszug')).toBe(true);
  });

  it('Kapitel mit zwei Ästen gliedern nach Ast, die übrigen ohne Zwischentitel', () => {
    const g = gruppen(zeichne(CHAPTER_KEYS.map(kapitelTitel)));
    const zwischen = (i) => [...g[i].inhalt.matchAll(/<h4[^>]*>([^<]+)<\/h4>/g)].map((m) => m[1]);
    const nach = Object.fromEntries(CHAPTER_KEYS.map((k, i) => [k, zwischen(i)]));
    expect(nach.basis).toEqual(['Persönliches', 'Familie']);
    expect(nach.versicherungen).toEqual(['Versicherungen', 'Vorsorge']);
    expect(nach.ausbildung).toEqual(['Arbeit', 'Bildung']);
    expect(nach.notfall).toEqual(['Gesundheit', 'Notfall']);
    expect(nach.wohnen).toEqual([]);
    expect(nach.finanzen).toEqual([]);
    expect(nach.behoerden).toEqual([]);
  });

  it('keine Gruppe mit nur einem Eintrag (Verbesserungen A1)', () => {
    for (const g of gruppen(zeichne([]))) {
      expect(g.zahl, g.titel).toBeGreaterThan(1);
    }
  });

  it('alle 36 Abläufe stehen in einem Kapitel', () => {
    expect(ABLAEUFE).toHaveLength(36);
    const kapitel = gruppen(zeichne(CHAPTER_KEYS.map(kapitelTitel))).slice(0, 7).map((g) => g.inhalt).join('');
    for (const a of ABLAEUFE) expect(kapitel, a.view).toContain('>' + t(a.nav).replace(/&/g, '&amp;') + '</div>');
  });

  it('Zwischentitel und Gruppenname der Klammer stehen in allen fünf Sprachen', () => {
    for (const l of [de, fr, it_, en, rm]) {
      expect(l.dashboard.bereich.bildung).toBeTruthy();
      expect(l.dashboard.bereich.notfall).toBeTruthy();
      expect(l.dashboard.toolGroups.klammer).toBeTruthy();
      for (const weg of ['lebensereignisse', 'money', 'insurance', 'documents', 'organize']) {
        expect(l.dashboard.toolGroups[weg], weg).toBeUndefined();
      }
    }
  });
});
