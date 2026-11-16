// Nachzug Sichtschutz «Beträge verbergen» (#826/#875, live 14.11.2026), 16.11.2026.
// 1. Kein Bildschirm-Code baut «CHF » selbst vor eine Zahl — sonst sieht man den Betrag trotz Sichtschutz.
// 2. betragText: sichtbar «CHF ···», der Bildschirmleser hört «Betrag verborgen».
// 3. Schalter-Zustand nicht nur über Tönung: eingeschaltet ein durchgestrichenes Auge.
// 4. Notfallkarte läuft in mitEchtenBetraegen. 5. Brief-Vorschau liegt unscharf, bis man sie antippt.
import { describe, it, expect, afterEach } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { betragText } from '../components/BetragText.jsx';
import { VERBORGEN } from '../utils/geld.js';

globalThis.document = globalThis.document || { documentElement: { dataset: {} } };
afterEach(() => { delete document.documentElement.dataset.betraege; });

const SRC = fileURLToPath(new URL('..', import.meta.url));
const quelle = (rel) => readFileSync(join(SRC, rel), 'utf8');
const alleDateien = (dir) => readdirSync(dir).flatMap((n) => {
  const p = join(dir, n);
  if (statSync(p).isDirectory()) return n === '__tests__' || n === 'i18n' ? [] : alleDateien(p);
  return /\.(js|jsx)$/.test(n) ? [p] : [];
});

// Erlaubt, mit Grund. Wer hier etwas ergänzt, sagt warum.
const ERLAUBT = {
  'utils/geld.js': 'betragEcht — die eine Quelle',
  'zipExport.js': 'Export, verlässt die App, immer echt',
  'PremiumSubsidy.jsx': 'Einheit «CHF / Monat» neben dem Eingabefeld, keine Zahl',
  'PraemienOrientierung.jsx': 'Franchise-Stufen als Auswahlknöpfe — öffentliche Stufen, sonst nicht wählbar',
  'ChapterView.jsx': 'Listenwert prüft betraegeVerborgen() selbst (listenWert)',
};

describe('Sichtschutz: kein selbst gebautes «CHF »', () => {
  it('nur die begründeten Dateien hängen «CHF » per + an', () => {
    const treffer = alleDateien(SRC)
      .map((p) => relative(SRC, p).split('\\').join('/'))
      .filter((rel) => /CHF[ \u00a0]?' *\+|CHF\\u00a0' *\+/.test(quelle(rel)))
      .filter((rel) => !ERLAUBT[rel]);
    expect(treffer).toEqual([]);
  });
  it('ChapterView: der Listenwert mit «CHF» fragt den Sichtschutz', () => {
    expect(quelle('ChapterView.jsx')).toMatch(/betraegeVerborgen\(\) \? VERBORGEN : 'CHF\\u00a0' \+ w/);
  });
});

describe('betragText — sichtbar «CHF ···», vorgelesen «Betrag verborgen»', () => {
  const t = (k) => (k === 'common.betragVerborgen' ? 'Betrag verborgen' : k);
  const text = (knoten) => typeof knoten === 'string' ? knoten
    : [].concat(knoten.props.children).filter((c) => c !== '' && c != null).map(text).join('|');
  it('ohne Sichtschutz: ein schlichter Text mit Zusätzen', () => {
    expect(betragText(t, 1234, {}, '≈ ', ' / Monat')).toBe('≈ CHF 1’234 / Monat');
  });
  it('mit Sichtschutz: Maske für die Augen verborgen, Wort für den Bildschirmleser', () => {
    document.documentElement.dataset.betraege = 'aus';
    const k = betragText(t, 1234, {}, '≈ ', ' / Monat');
    expect(typeof k).toBe('object');
    const [davor, maske, vorlesen, danach] = k.props.children;
    expect(davor).toBe('≈ ');
    expect(maske.props['aria-hidden']).toBe(true);
    expect(maske.props.children).toBe(VERBORGEN);
    expect(vorlesen.props.children).toBe('Betrag verborgen');
    expect(vorlesen.props.style.position).toBe('absolute');
    expect(vorlesen.props['aria-hidden']).toBeUndefined();
    expect(danach).toBe(' / Monat');
    expect(text(k)).not.toMatch(/\d/);
  });
  it('Leeres bleibt «–», auch mit Sichtschutz', () => {
    document.documentElement.dataset.betraege = 'aus';
    expect(betragText(t, null)).toBe('–');
  });
  it('«Betrag verborgen» gibt es in allen fünf Sprachen', () => {
    for (const l of ['de', 'en', 'fr', 'it', 'rm']) {
      expect(quelle('i18n/' + l + '.js'), l).toMatch(/\n\s*betragVerborgen: '[^']+',/);
      expect(quelle('i18n/' + l + '.js'), l).toMatch(/\n\s*letterPreviewZeigen: '[^']+',/);
    }
  });
});

describe('Schalter, Notfallkarte, Brief-Vorschau', () => {
  it('Schalter zeigt den Zustand auch in der Form (WCAG 1.4.1)', () => {
    expect(quelle('main.jsx')).toMatch(/zeichen\(betraegeAus \? 'augeZu' : 'auge', 17\)/);
    expect(quelle('IconKern.jsx')).toMatch(/augeZu: _augeZu/);
  });
  it('Notfallkarte (Druck) läuft in mitEchtenBetraegen', () => {
    expect(quelle('ChapterView.jsx')).toMatch(/const handleSaveCard = \(\) => mitEchtenBetraegen\(\(\) => \{/);
  });
  it('Brief-Vorschau: unscharf und für Bildschirmleser verdeckt, bis man sie antippt', () => {
    const b = quelle('BriefGenerator.jsx');
    expect(b).toMatch(/const verdeckt = betraegeVerborgen\(\) && !vorschauOffen;/);
    expect(b).toMatch(/filter: verdeckt \? 'blur\(6px\)' : 'none'/);
    expect(b).toMatch(/onClick: \(\) => setVorschauOffen\(true\)/);
  });
});
