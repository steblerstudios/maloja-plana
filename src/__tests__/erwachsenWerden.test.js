import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import en from '../i18n/en.js';
import fr from '../i18n/fr.js';
import itSprache from '../i18n/it.js';
import rm from '../i18n/rm.js';
import { LIGHT_PALETTE } from '../config/constants.js';
import { GEGENSTAENDE, GRUPPEN, alleWege } from '../data/gepaeck.js';

// F7-A9 (Entscheid Stebler Studios 27.10.2026): «18 werden», «Militär- oder Zivildienst» und «Lehre beginnen»
// als Gruppe «Erwachsen werden» im Rucksack; aus den Kapiteln erreichbar über «Passend zu diesem Bereich»
// (Persönliche Basis: 18 werden; Ausbildung & Arbeit: Lehre beginnen, Selbständig werden).

describe('Rucksack: Gruppe «Erwachsen werden»', () => {
  it('die drei Wege liegen zusammen in einem Gegenstand und tragen die Gruppe', () => {
    const drin = alleWege().filter((w) => w.gruppe === 'erwachsen');
    expect(drin.map((w) => w.view).sort()).toEqual(['dienst', 'lehre', 'volljaehrig']);
    expect(new Set(drin.map((w) => w.gegenstand)).size).toBe(1);
    expect(GRUPPEN).toContain('erwachsen');
  });
  it('jeder Weg kommt genau einmal vor', () => {
    const views = alleWege().map((w) => w.view);
    for (const v of ['dienst', 'lehre', 'volljaehrig']) expect(views.filter((x) => x === v)).toHaveLength(1);
  });
  it('die Ansicht zeigt die Gruppe mit eigener Zwischenzeile, zuoberst im Gegenstand', async () => {
    const { Gepaeck } = await import('../Gepaeck.jsx');
    const t = createT({ de }, 'de', 'sie');
    const html = renderToStaticMarkup(React.createElement(Gepaeck, { palette: LIGHT_PALETTE, t, data: {}, onNavigate: () => {}, chapters: [] }));
    const gr = html.indexOf('data-gepaeck-gruppe="erwachsen"');
    expect(gr).toBeGreaterThan(-1);
    expect(html).toContain('Erwachsen werden');
    const fach = GEGENSTAENDE.find((g) => g.wege.some((w) => w.gruppe === 'erwachsen'));
    const andererWeg = fach.wege.find((w) => !w.gruppe);
    expect(html.indexOf(t('gepaeck.w.' + andererWeg.key))).toBeGreaterThan(html.indexOf(t('gepaeck.w.lehre')));
  });
  it('der Gruppenname in fünf Sprachen', () => {
    for (const d of [de, en, fr, itSprache, rm]) expect(typeof d.gepaeck.gruppe.erwachsen).toBe('string');
  });
});

describe('Kapitel: «Passend zu diesem Bereich»', () => {
  const src = readFileSync(resolve(__dirname, '..', 'ChapterView.jsx'), 'utf8');
  const fall = (k) => src.slice(src.indexOf("case '" + k + "': return ["), src.indexOf('];', src.indexOf("case '" + k + "': return [")));
  it('Persönliche Basis führt zu «18 werden»', () => {
    expect(fall('basis')).toContain("weg('volljaehrig')");
  });
  it('Ausbildung & Arbeit führt zu «Lehre beginnen» und «Selbständig werden»', () => {
    expect(fall('ausbildung')).toContain("weg('lehre')");
    expect(fall('ausbildung')).toContain("weg('selbstaendigkeit')");
  });
});
