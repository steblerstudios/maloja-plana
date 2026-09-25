import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { getChapters } from '../config/constants.js';
import { grundordnung } from '../utils/vollstaendigkeit.js';
import { BergDetail, KapitelZeile } from '../BergDetail.jsx';

// ─────────────────────────────────────────────────────────────
// Tester-Feedback 25.09.2026: «Ihr Fortschritt» und «Ihre Grundordnung» zu EINER
// Karte verschmelzen, jedes Kapitel einzeln aufklappbar, darin die Grundordnung.
// Vorher: zwei Karten, und nur die Felder waren anklickbar, nicht die Kapitel.
//
// Die Zusagen:
//   1. Eine Karte: Fortschritt und Grundordnung stehen zusammen, beim ersten Bild
//      ist jedes Kapitel zu (aria-expanded="false") und kein Feld zu sehen.
//   2. Jede Kapitelzeile ist ein Knopf, der auf- und zuklappt.
//   3. Aufgeklappt zeigt sie genau die Grundordnungs-Felder DIESES Kapitels,
//      und jedes Feld wie «Öffnen» führt in genau dieses Kapitel.
//
// Die Felder kommen aus dem echten `grundordnung(getChapters(t), …)`, nicht aus
// einer Attrappe: am 24.09. sass ein Fehler genau in der Übergabe von dort hierher
// («undefined Persönliche Basis»). Kein DOM (vitest ohne jsdom) — die Zeile hat
// darum keinen eigenen Zustand und wird hier direkt als Element-Baum geprüft.
// ─────────────────────────────────────────────────────────────

const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (k) => k;
const chapters = getChapters(t);
const mvo = grundordnung(chapters, {});

// Element-Baum ausrollen: Funktions-Komponenten aufrufen, alle Knöpfe einsammeln.
const knoepfe = (el, acc = []) => {
  if (Array.isArray(el)) { el.forEach((e) => knoepfe(e, acc)); return acc; }
  if (!el || typeof el !== 'object') return acc;
  // Die nachgeladene Münze (IconKern) ist ein Bild mit Hook — ausserhalb einer React-
  // Anzeige nicht aufrufbar, und Knöpfe trägt sie keine.
  if (el.type?.name === 'Muenze') return acc;
  if (typeof el.type === 'function') return knoepfe(el.type(el.props), acc);
  if (el.type === 'button') acc.push(el);
  knoepfe(el.props?.children, acc);
  return acc;
};
const text = (el) => renderToStaticMarkup(el).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

const zeile = (idx, istOffen, spione = {}) => KapitelZeile({
  palette, t, ch: chapters[idx], idx, pct: 0, status: 'leer', accent: '#777777',
  statusLabels: {}, lang: 'de', istOffen,
  onUmschalten: spione.umschalten || (() => {}),
  onSelectChapter: spione.kapitel || (() => {}),
  felder: mvo.fields, // alle — das Filtern muss die Zeile selbst leisten
});

describe('Fortschritts-Karte · eine Karte, Kapitel aufklappbar', () => {
  it('die Grundordnung ist nicht leer und verteilt sich auf mehrere Kapitel (sonst prüft der Test die leere Menge)', () => {
    expect(mvo.fields.length).toBeGreaterThan(0);
    expect(new Set(mvo.fields.map((f) => f.chapterIdx)).size).toBeGreaterThan(1);
  });

  it('eine Karte: Fortschritt und Grundordnung zusammen, alle Kapitel zu, kein «undefined»', () => {
    const html = renderToStaticMarkup(React.createElement(BergDetail, {
      palette, t, lang: 'de', chapters, mvo, onSelectChapter: () => {},
      chapterCompletions: chapters.map(() => 0), chapterStatuses: chapters.map(() => 'leer'), chapterAccentColor: {},
    }));
    expect(html).toContain('fortschritt.title');
    expect(html).toContain('mvo.title');
    expect(html).toContain('0/' + mvo.total);
    expect((html.match(/aria-expanded="false"/g) || []).length).toBe(chapters.length);
    expect(html).not.toMatch(/aria-expanded="true"/);
    for (const f of mvo.fields) expect(html).not.toContain('>' + f.label + '<');
    expect(html).not.toMatch(/undefined/);
  });

  it('zugeklappt: die Zeile ist ein Knopf, der umschaltet, und nichts darunter', () => {
    let umgeschaltet = 0;
    const el = zeile(0, false, { umschalten: () => umgeschaltet++ });
    const b = knoepfe(el);
    expect(b.length).toBe(1);
    expect(b[0].props['aria-expanded']).toBe(false);
    expect(b[0].props['aria-controls']).toBeUndefined();
    b[0].props.onClick();
    expect(umgeschaltet).toBe(1);
  });

  it('aufgeklappt: genau die Felder dieses Kapitels, jedes Feld und «Öffnen» führen dorthin', () => {
    chapters.forEach((ch, idx) => {
      const aufrufe = [];
      const el = zeile(idx, true, { kapitel: (i) => aufrufe.push(i) });
      const [kopf, ...rest] = knoepfe(el);
      const eigene = mvo.fields.filter((f) => f.chapterIdx === idx);
      expect(kopf.props['aria-expanded'], ch.key).toBe(true);
      expect(kopf.props['aria-controls'], ch.key).toBe('fortschritt-kapitel-' + ch.key);
      expect(rest.length, ch.key).toBe(eigene.length + 1); // Felder + «Öffnen»
      const inhalt = text(el);
      for (const f of mvo.fields) {
        if (f.chapterIdx === idx) expect(inhalt, ch.key).toContain(f.label);
      }
      rest.forEach((b) => b.props.onClick());
      expect(aufrufe, ch.key).toEqual(rest.map(() => idx));
      expect(renderToStaticMarkup(el)).toContain('id="fortschritt-kapitel-' + ch.key + '"');
    });
  });

  it('fremde Felder erscheinen nicht unter einem Kapitel', () => {
    const el = zeile(0, true);
    const inhalt = text(el);
    const fremde = mvo.fields.filter((f) => f.chapterIdx !== 0 && !mvo.fields.some((g) => g.chapterIdx === 0 && g.label === f.label));
    expect(fremde.length).toBeGreaterThan(0);
    for (const f of fremde) expect(inhalt).not.toContain(f.label);
  });
});
