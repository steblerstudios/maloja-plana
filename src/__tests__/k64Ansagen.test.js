import { describe, it, expect, vi, afterEach } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { PremiumSubsidy } from '../PremiumSubsidy.jsx';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import { LIGHT_PALETTE, DARK_PALETTE, applyColorBlind } from '../config/constants.js';
import { tMitRueckfall } from '../utils/tRueckfall.js';
import { renderSource } from '../utils/renderSource.js';

// ─────────────────────────────────────────────────────────────
// K64 · Ansagen für Screenreader und ruhige Rückfälle.
// 1. PremiumSubsidy: «Online beantragen» öffnet einen neuen Tab — das wird
//    hörbar angesagt (nicht nur der Pfeil ↗); gesperrt im Stil aus K53.
// 2. ChapterView: ohne t erscheint kein roher Schlüssel.
// 3. renderSource: ohne t meldet sich der Entwicklungsmodus; alle Aufrufer
//    in src/ übergeben t.
// Kontrast-Formel wie in zipExportGesperrt.test.js (WCAG 2.1, relative Luminanz).
// ─────────────────────────────────────────────────────────────

function luminanz(hex) {
  const h = hex.replace('#', '');
  const kanal = [0, 2, 4].map((i) => {
    const v = parseInt(h.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * kanal[0] + 0.7152 * kanal[1] + 0.0722 * kanal[2];
}
function kontrast(a, b) {
  const la = luminanz(a), lb = luminanz(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

const SRC = join(__dirname, '..');
const lies = (datei) => readFileSync(join(SRC, datei), 'utf8');
const t = createT({ de }, 'de', 'sie');

const profil = (kkPremium) => ({
  basis: { canton: 'BE', household: { adults: 1, children: [] } },
  finanzen: { monthlyIncome: 2000 },
  wohnen: {},
  versicherungen: kkPremium ? { kkPremium } : {},
});
const render = (data) => renderToStaticMarkup(React.createElement(PremiumSubsidy, {
  palette: LIGHT_PALETTE, t, data, onNavigate: () => {},
}));
function knopf(html, label) {
  const ende = html.indexOf(label);
  const start = html.lastIndexOf('<button', ende);
  const schluss = html.indexOf('</button>', ende);
  return html.slice(start, schluss);
}

describe('K64.1 · PremiumSubsidy «Online beantragen»', () => {
  afterEach(() => vi.restoreAllMocks());

  // Geprüft wird die ZUSAGE, nicht ihre Umsetzung: das Zeichen ist stumm, der
  // Tab-Wechsel ist hörbar. Die erste Fassung verlangte wörtlich
  // `<span aria-hidden="true">↗ </span>` — sie wurde rot, als das rohe ↗ am
  // 20.09.2026 einem Piktogramm wich, obwohl die Zusage unverändert galt. Ein
  // Test, der die Bauweise festschreibt, verbietet jede Verbesserung.
  it('sagt den neuen Tab hörbar an, das Zeichen ist nur Bild', () => {
    const b = knopf(render(profil(450)), t('premium.applyOnline'));
    expect(b).toContain('aria-hidden="true"');            // das Zeichen wird nicht vorgelesen
    expect(b).toContain(' (' + t('a11y.neuerTab') + ')</span>');   // der Wechsel schon
    expect(t('a11y.neuerTab')).toBe('öffnet in neuem Tab');
    expect(b).toContain('position:absolute');             // Ansage visuell versteckt
    expect(b).not.toContain('↗');                         // keine rohe Glyphe mehr
    expect(b).not.toContain('disabled');
  });

  it('window.open mit noopener,noreferrer', () => {
    expect(lies('PremiumSubsidy.jsx')).toMatch(/window\.open\(kvgLink, '_blank', 'noopener,noreferrer'\)/);
  });

  it('gesperrt: Stil aus K53 (up, mid, gestrichelt), keine Deckkraft mehr', () => {
    const html = render(profil(0));
    for (const label of [t('premium.applyOnline'), t('premium.document')]) {
      const b = knopf(html, label);
      expect(b).toContain('disabled=""');
      expect(b).toContain('cursor:not-allowed');
      expect(b).toContain('border:1px dashed ' + LIGHT_PALETTE.mid);
      expect(b).toContain('background:' + LIGHT_PALETTE.up);
      expect(b).toContain('color:' + LIGHT_PALETTE.mid);
      expect(b).not.toContain('opacity');
    }
  });

  for (const [name, palette] of [
    ['hell', LIGHT_PALETTE],
    ['dunkel', DARK_PALETTE],
    ['hell, Farbenblind', applyColorBlind(LIGHT_PALETTE, true)],
    ['dunkel, Farbenblind', applyColorBlind(DARK_PALETTE, true)],
  ]) {
    it(name + ': gesperrt mid auf up ≥ 4.5:1, aktiv onSand auf sand ≥ 4.5:1', () => {
      expect(kontrast(palette.mid, palette.up)).toBeGreaterThanOrEqual(4.5);
      expect(kontrast(palette.onSand, palette.sand)).toBeGreaterThanOrEqual(4.5);
    });
  }
});

describe('K64.2 · ChapterView ohne t', () => {
  afterEach(() => vi.restoreAllMocks());

  it('übergebenes t hat Vorrang, dann das t aus dem Kontext', () => {
    const eigen = (k) => 'eigen:' + k;
    const kontext = (k) => 'kontext:' + k;
    expect(tMitRueckfall(eigen, kontext)).toBe(eigen);
    expect(tMitRueckfall(undefined, kontext)).toBe(kontext);
  });

  it('ganz ohne t: leerer Text statt Schlüssel, Hinweis im Entwicklungsmodus', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const tr = tMitRueckfall(undefined, null, 'ChapterView');
    expect(tr('chapter.save')).toBe('');
    expect(tr('behördenStatus.inDays').replace('{n}', '3')).toBe('');
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][0]).toContain('ChapterView');
  });

  it('ChapterView nutzt den Rückfall — auch für direkte t(…)-Aufrufe', () => {
    const src = lies('ChapterView.jsx');
    expect(src).not.toMatch(/t \|\| \(\(k\) => k\)/);
    expect(src).toContain("tMitRueckfall(tEingang, kontextT, 'ChapterView')");
    expect(src).toContain('({ palette, t: tEingang,');
    expect(src).toMatch(/const t = tr;/);
  });
});

describe('K64.3 · renderSource ohne t', () => {
  afterEach(() => vi.restoreAllMocks());

  it('meldet sich im Entwicklungsmodus, wenn ein Link ohne Ansage entsteht', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    renderSource('Quelle: [[BAG|bag.admin.ch]]');
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][0]).toContain('öffnet in neuem Tab');
  });

  it('mit t oder ohne Link: still', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const html = renderToStaticMarkup(React.createElement('div', null, renderSource('Quelle: [[BAG|bag.admin.ch]]', null, t)));
    renderSource('Quelle ohne Link');
    expect(warn).not.toHaveBeenCalled();
    expect(html).toContain('(öffnet in neuem Tab)');
  });

  it('alle Aufrufer in src/ übergeben t als dritten Parameter', () => {
    const dateien = [];
    const gehe = (dir) => {
      for (const n of readdirSync(dir)) {
        if (n === '__tests__' || n === 'node_modules') continue;
        const p = join(dir, n);
        if (statSync(p).isDirectory()) gehe(p);
        else if (/\.(jsx?|tsx?)$/.test(n)) dateien.push(p);
      }
    };
    gehe(SRC);
    const aufrufe = [];
    for (const p of dateien) {
      const src = readFileSync(p, 'utf8');
      const re = /\brenderSource\(/g;
      let m;
      while ((m = re.exec(src)) !== null) {
        if (/function\s+$/.test(src.slice(Math.max(0, m.index - 10), m.index))) continue; // Definition
        // Argumentliste bis zur passenden Klammer lesen
        let tiefe = 0, i = m.index + 'renderSource'.length, args = '';
        for (; i < src.length; i++) {
          const c = src[i];
          if (c === '(') tiefe++;
          else if (c === ')') { tiefe--; if (tiefe === 0) break; }
          if (tiefe >= 1 && !(tiefe === 1 && c === '(')) args += c;
        }
        aufrufe.push({ datei: relative(SRC, p), args });
      }
    }
    expect(aufrufe.length).toBeGreaterThan(10);
    const ohneT = aufrufe.filter(({ args }) => !/,\s*t\s*$/.test(args.trim()));
    expect(ohneT).toEqual([]);
  });
});
