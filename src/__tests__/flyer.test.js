import { describe, it, expect } from 'vitest';
import { buildFlyerHtml } from '../flyerGenerator.js';
import en from '../i18n/en.js';
import frLang from '../i18n/fr.js';
import rm from '../i18n/rm.js';

const present = (v) => typeof v === 'string'
  ? v.length > 0
  : (v && typeof v === 'object' && (present(v.sie) || present(v.du)));

// Minimaler t-Stub: gibt den Key zurück (reicht zum Struktur-Test).
const tStub = (k) => k;

describe('flyerGenerator', () => {
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

  it('bleibt robust ohne QR-Daten', () => {
    const html = buildFlyerHtml({ t: tStub, qrDataUrl: '' });
    expect(html).toContain('<!DOCTYPE html>');
  });
});

describe.each([['en', en], ['fr', frLang], ['rm', rm]])('flyer i18n (%s)', (lang, dict) => {
  it('nav.flyer + nav.sub.flyer vorhanden', () => {
    expect(present(dict.nav.flyer), `${lang}: nav.flyer`).toBe(true);
    expect(present(dict.nav.sub.flyer), `${lang}: nav.sub.flyer`).toBe(true);
  });

  it('flyer-Namespace vollständig', () => {
    for (const k of ['title', 'intro', 'claim', 'lead', 'point1', 'point2', 'point3', 'scan', 'foot', 'print', 'langHint', 'share', 'shareText', 'copied']) {
      expect(present(dict.flyer?.[k]), `${lang}: flyer.${k}`).toBe(true);
    }
  });
});
