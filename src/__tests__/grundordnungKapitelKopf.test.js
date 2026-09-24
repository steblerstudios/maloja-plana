import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { getChapters } from '../config/constants.js';
import { grundordnung } from '../utils/vollstaendigkeit.js';
import { GrundordnungFelder } from '../BergDetail.jsx';

// ─────────────────────────────────────────────────────────────
// Befund 24.09.2026, im Browser: «Fortschritt im Detail» → «Ihre Grundordnung»
// aufklappen, und jede Kapitel-Kopfzeile lautete «undefined Persönliche Basis».
// Der Code klebte `f.chapterIcon + ' ' + f.chapterTitle` zusammen; die Kapitel
// aus `getChapters` haben aber kein `icon`-Feld.
//
// Die Zusage: die Kopfzeile nennt das Kapitel und sonst nichts Lesbares. Ein
// Icon darf dabei sein, aber als eigener Knoten mit aria-hidden — nicht als
// Buchstabe im Text (siehe docs/ICON_KONVENTION.md).
//
// Die Felder kommen aus dem echten `grundordnung(getChapters(t), …)`, nicht aus
// einer Attrappe: der Fehler sass genau in der Übergabe von dort hierher.
// ─────────────────────────────────────────────────────────────

const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (k) => k;
const chapters = getChapters(t);
const { fields } = grundordnung(chapters, {});

const zeichne = () =>
  renderToStaticMarkup(React.createElement(GrundordnungFelder, { palette, fields, onSelectChapter: () => {} }));

// Sichtbarer Text ohne Inhalte von aria-hidden-Knoten (die SVG-Icons haben keinen Text,
// aber so bleibt die Prüfung ehrlich, falls eines einmal Text trägt).
const vorgelesenerText = (html) =>
  html
    .replace(/<span aria-hidden="true"[^>]*>[\s\S]*?<\/span>/g, '')
    .replace(/<[^>]+>/g, ' ');

describe('Grundordnung · Kapitel-Kopfzeile', () => {
  it('die Liste ist nicht leer (sonst prüft der Test die leere Menge)', () => {
    expect(fields.length).toBeGreaterThan(0);
  });

  it('kein «undefined» im gerenderten Text', () => {
    expect(zeichne()).not.toMatch(/undefined/);
  });

  it('jede Kopfzeile nennt genau den Kapiteltitel', () => {
    const titel = [...new Set(fields.map((f) => f.chapterTitle))];
    expect(titel.length).toBeGreaterThan(1);
    const html = zeichne();
    for (const ti of titel) {
      // Der Titel steht als eigener Textknoten, ohne vorgeklebtes Zeichen.
      expect(html, ti).toContain('<span>' + ti + '</span>');
    }
    expect(vorgelesenerText(html)).not.toMatch(/undefined|null/);
  });

  it('das Kapitel-Icon ist ein eigener Knoten mit aria-hidden', () => {
    const html = zeichne();
    const kapitel = new Set(fields.map((f) => f.chapterKey)).size;
    // Ein abgeschirmtes Icon, unmittelbar gefolgt vom Titel-Knoten — die
    // Häkchen der Feldzeilen sind auch aria-hidden, stehen aber vor dem Feldnamen.
    const titel = new Set(fields.map((f) => f.chapterTitle));
    const kopfIcons = [...html.matchAll(/<span aria-hidden="true"[^>]*><svg(?:(?!<\/svg>)[\s\S])*<\/svg><\/span><span>([^<]*)<\/span>/g)]
      .filter((m) => titel.has(m[1]));
    expect(kopfIcons.length).toBe(kapitel);
  });
});
