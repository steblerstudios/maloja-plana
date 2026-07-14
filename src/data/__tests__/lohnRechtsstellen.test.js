import { describe, it, expect } from 'vitest';
import { getLohnKontrollstelle, LOHN_KONTROLLSTELLEN, UNBEZAHLTER_LOHN_WEG } from '../lohnRechtsstellen.js';
import { kantonHatMindestlohn } from '../lohnCheck.js';

describe('lohnRechtsstellen', () => {
  it('deckt genau die Mindestlohn-Kantone aus lohnCheck ab', () => {
    for (const k of Object.keys(LOHN_KONTROLLSTELLEN)) {
      expect(kantonHatMindestlohn(k)).toBe(true);
    }
  });

  it('GE: belegte Stelle (OCIRT), nicht verify-pflichtig', () => {
    const e = getLohnKontrollstelle('GE');
    expect(e.verify).toBe(false);
    expect(e.stelle).toMatch(/OCIRT/);
  });

  it('JU: keine Kontrollstelle → Arbeitsgericht-Fallback (Wort „Kontrollstelle" meiden)', () => {
    const e = getLohnKontrollstelle('JU');
    expect(e.stelle).toBeNull();
    expect(e.fallback).toMatch(/prud’hommes/i);
  });

  it('NE + BS: als verify:true markiert (amtlich noch gegenzuprüfen)', () => {
    expect(getLohnKontrollstelle('NE').verify).toBe(true);
    expect(getLohnKontrollstelle('BS').verify).toBe(true);
  });

  it('liefert null für Kantone ohne gesetzlichen Mindestlohn', () => {
    expect(getLohnKontrollstelle('ZH')).toBeNull();
    expect(getLohnKontrollstelle('')).toBeNull();
  });

  it('Fix A: der Weg für nicht bezahlten Lohn führt über Schlichtung/Arbeitsgericht', () => {
    expect(UNBEZAHLTER_LOHN_WEG).toMatch(/Schlichtungsbehörde|Arbeitsgericht/);
  });
});
