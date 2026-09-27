// Deploy-Gate 27.09.2026 — Befunde der Prüfer zu den vier Lebensereignis-Briefen (#404/#405):
// Betrag nur mit Dreiergruppen · Einsprache «möglicherweise zu spät» · Amtssprache beim
// Rechtsvorschlag · rm-Brieftext auf Deutsch bis zur Gegenlese · Fokus + Vorlesen der Frist.
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { leseBetrag } from '../briefGenerator.js';
import { createT, deutschT, I18nContext } from '../i18n/index.js';
import BriefGenerator, { briefUebersetzer } from '../BriefGenerator.jsx';
import { generateLetter } from '../briefGenerator.js';
import { LIGHT_PALETTE } from '../config/constants.js';
import de from '../i18n/de.js';
import en from '../i18n/en.js';
import fr from '../i18n/fr.js';
import itTranslations from '../i18n/it.js';
import rm from '../i18n/rm.js';

const ALL = { de, en, fr, it: itTranslations, rm };
const t = createT(ALL, 'de', 'sie');
const render = (props, ctx) => {
  const el = React.createElement(BriefGenerator, { palette: LIGHT_PALETTE, t, data: {}, onNavigate: () => {}, ...props });
  return renderToString(ctx ? React.createElement(I18nContext.Provider, { value: ctx }, el) : el);
};

describe('Betrag: Tausender-Trennzeichen nur zwischen Dreiergruppen', () => {
  it.each([
    ["1'234.50", 1234.5], ["1’000", 1000], ['CHF 1 234.–', 1234], ["1'000'000", 1000000],
    ['1234', 1234], ['12,5', 12.5], ['  CHF 800.- ', 800],
  ])('%s → %s', (ein, aus) => expect(leseBetrag(ein)).toBe(aus));
  it.each(["12'50", "1'2345", "12'3", '1.234,50', "'100", "100'"])('%s → Platzhalter (0)', (ein) => {
    expect(leseBetrag(ein)).toBe(0);
  });
});

describe('Einsprache gegen die Kündigung: vergangenes Ende', () => {
  it('Ende in der Vergangenheit → «möglicherweise zu spät», nicht «spätestens an diesem Tag»', () => {
    const html = render({ initialTemplate: 'dismissalObjection', initialAngaben: { ende: '2020-01-15' } });
    expect(html).toContain('möglicherweise zu spät');
    expect(html).not.toContain('muss spätestens an diesem Tag');
    expect(html).toContain('möglicherweise abgelaufen'); // 180 Tage nach 15.01.2020 auch vorbei
  });
  it('Ende in der Zukunft → die bisherige Angabe', () => {
    const html = render({ initialTemplate: 'dismissalObjection', initialAngaben: { ende: '2099-06-30' } });
    expect(html).toContain('muss spätestens an diesem Tag');
    expect(html).not.toContain('möglicherweise zu spät');
  });
});

describe('Rechtsvorschlag: Amtssprache', () => {
  it('der Hinweis nennt die Amtssprache des Betreibungsamts', () => {
    expect(render({ initialTemplate: 'debtObjection' })).toContain('Amtssprache des Betreibungsamts');
  });
});

describe('rm: Brieftext auf Deutsch bis zur Gegenlese', () => {
  it('deutschT liefert Deutsch aus dem Geladenen, sonst null', () => {
    const tDe = deutschT('sie', { de, rm });
    expect(tDe('briefe.debtObjection.subject')).toBe(createT(ALL, 'de', 'sie')('briefe.debtObjection.subject'));
    expect(deutschT('sie', { rm })).toBeNull();
  });
  it('in rm steht der Hinweis über dem Brief; in de nicht', () => {
    const tRm = createT(ALL, 'rm', 'sie');
    const mitRm = renderToString(React.createElement(I18nContext.Provider, { value: { lang: 'rm', anrede: 'sie' } },
      React.createElement(BriefGenerator, { palette: LIGHT_PALETTE, t: tRm, data: {}, onNavigate: () => {}, initialTemplate: 'deathNotice' })));
    expect(mitRm).toContain(rm.briefe.angaben.rmDeutsch);
    const mitDe = render({ initialTemplate: 'deathNotice' }, { lang: 'de', anrede: 'sie' });
    expect(mitDe).not.toContain(de.briefe.angaben.rmDeutsch);
  });
  it('der gedruckte Brief ist in rm deutsch, die übrigen Vorlagen bleiben rm', () => {
    const tRm = createT(ALL, 'rm', 'sie');
    const tB = briefUebersetzer({ lang: 'rm', anrede: 'sie', selected: 'debtObjection', t: tRm, geladen: { de, rm } });
    const ohneDatum = (h) => h.replace(/\d{2}\.\d{2}\.\d{4}/g, '');
    const brief = ohneDatum(generateLetter('debtObjection', {}, tB, { angaben: {} }));
    expect(brief).toBe(ohneDatum(generateLetter('debtObjection', {}, t, { angaben: {} })));
    expect(brief).not.toBe(ohneDatum(generateLetter('debtObjection', {}, tRm, { angaben: {} })));
    expect(briefUebersetzer({ lang: 'rm', anrede: 'sie', selected: 'leaseTermination', t: tRm, geladen: { de, rm } })).toBe(tRm);
    expect(briefUebersetzer({ lang: 'de', anrede: 'sie', selected: 'debtObjection', t, geladen: { de, rm } })).toBe(t);
  });
  it('beide Brief-Aufrufe nutzen den Brief-Übersetzer', () => {
    const src = fs.readFileSync(path.join(__dirname, '..', 'BriefGenerator.jsx'), 'utf8');
    expect(src.match(/generateLetter\(selected, data, tBrief, \{/g)).toHaveLength(2);
    expect(src).not.toMatch(/generateLetter\(selected, data, t, \{/);
  });
});

describe('a11y: Fokus folgt dem Sprung, die Frist wird vorgelesen', () => {
  it('die Frist steht in einer höflichen Live-Region', () => {
    const html = render({ initialTemplate: 'debtObjection', initialAngaben: { zustelldatum: '2099-01-10' } });
    const region = html.match(/<div role="status" aria-live="polite"[^>]*>([^<]*)<\/div>/);
    expect(region).toBeTruthy();
    expect(region[1]).toContain('20.01.2099');
  });
  it('der Hinweis ist fokussierbar und der Sprung setzt den Fokus darauf', () => {
    const html = render({ initialTemplate: 'debtObjection' });
    expect(html).toMatch(/id="brief-hinweis" tabindex="-1"|tabindex="-1"[^>]*id="brief-hinweis"/);
    const src = fs.readFileSync(path.join(__dirname, '..', 'BriefGenerator.jsx'), 'utf8');
    expect(src).toMatch(/getElementById\('brief-hinweis'\)[\s\S]{0,60}focus\(\{ preventScroll: true \}\)/);
  });
});
