import { describe, it, expect } from 'vitest';
import { buildFlyerHtml } from '../flyerGenerator.js';
import en from '../i18n/en.js';
import frLang from '../i18n/fr.js';
import rm from '../i18n/rm.js';
import de from '../i18n/de.js';
// Nicht «it» nennen — das überschreibt vitests it().
import itLang from '../i18n/it.js';

const present = (v) => typeof v === 'string'
  ? v.length > 0
  : (v && typeof v === 'object' && (present(v.sie) || present(v.du)));

// Minimaler t-Stub: gibt den Key zurück (reicht zum Struktur-Test).
const tStub = (k) => k;

describe('flyerGenerator', () => {
  it('K97: maskiert auch Apostroph (gleiche Escape-Funktion wie Dossier/Brief)', () => {
    const html = buildFlyerHtml({ t: () => "l'aide <b>", qrDataUrl: 'data:image/png;base64,AAAA' });
    expect(html).toContain('l&#39;aide &lt;b&gt;');
    expect(html).not.toContain("l'aide");
  });

  it('erzeugt vollständiges HTML mit QR-Bild und URL', () => {
    const html = buildFlyerHtml({ t: tStub, qrDataUrl: 'data:image/png;base64,AAAA' });
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('Maloja Plana');
    expect(html).toContain('malojaplana.ch');
    expect(html).toContain('data:image/png;base64,AAAA');
    expect(html).toContain('window.print()');
  });

  it('escaped HTML-Sonderzeichen aus Übersetzungen', () => {
    const t = (k) => k === 'flyer.claim' ? 'A & B <script>' : k;
    const html = buildFlyerHtml({ t, qrDataUrl: '' });
    expect(html).toContain('A &amp; B &lt;script&gt;');
    expect(html).not.toContain('<script>');
  });

  it('zwei A5-Seiten: Vorderseite mit Logo und QR, Rückseite mit drei Schritten', () => {
    const html = buildFlyerHtml({ t: tStub, qrDataUrl: 'data:image/png;base64,AAAA' });
    expect(html).toContain('size: A5');
    expect(html.match(/<section class="seite">/g)).toHaveLength(2);
    const [vorne, hinten] = html.split('<section class="seite">').slice(1);
    expect(vorne).toContain('<svg');
    expect(vorne).toContain('data:image/png;base64,AAAA');
    for (const n of [1, 2, 3]) expect(hinten).toContain('flyer.step' + n + 'Title');
    expect(hinten).toContain('flyer.disclaimer');
  });

  it('teilt den Claim in zwei Sätze; unteilbar bleibt er ganz', () => {
    const zwei = buildFlyerHtml({ t: (k) => k === 'flyer.claim' ? 'Erster Satz. Zweiter Satz.' : k, qrDataUrl: '' });
    expect(zwei).toContain('<span class="a">Erster Satz.</span><span class="b">Zweiter Satz.</span>');
    const eins = buildFlyerHtml({ t: (k) => k === 'flyer.claim' ? 'Ohne Punkt' : k, qrDataUrl: '' });
    expect(eins).toContain('<span class="a">Ohne Punkt</span></div>');
  });

  it('bleibt robust ohne QR-Daten', () => {
    const html = buildFlyerHtml({ t: tStub, qrDataUrl: '' });
    expect(html).toContain('<!DOCTYPE html>');
  });
});

describe.each([['de', de], ['en', en], ['fr', frLang], ['it', itLang], ['rm', rm]])('flyer i18n (%s)', (lang, dict) => {
  it('nav.flyer + nav.sub.flyer vorhanden', () => {
    expect(present(dict.nav.flyer), `${lang}: nav.flyer`).toBe(true);
    expect(present(dict.nav.sub.flyer), `${lang}: nav.sub.flyer`).toBe(true);
  });

  it('flyer-Namespace vollständig', () => {
    for (const k of ['title', 'intro', 'claim', 'lead', 'point1', 'point2', 'point3', 'scan', 'foot', 'print', 'langHint', 'share', 'shareText', 'copied', 'printHint',
      'backTitle', 'step1Title', 'step1Text', 'step2Title', 'step2Text', 'step3Title', 'step3Text',
      'startTitle', 'startText', 'disclaimer']) {
      expect(present(dict.flyer?.[k]), `${lang}: flyer.${k}`).toBe(true);
    }
  });
});
