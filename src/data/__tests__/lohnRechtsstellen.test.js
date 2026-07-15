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

  // Amtlich gegengeprüft 2026-07-15 (rsn.ne.ch, ne.ch, gesetzessammlung.bs.ch, bs.ch/wsu/awa).
  it('NE: LEmpl Art. 32a ff. — KEIN eigenes „Mindestlohngesetz“ (der alte Titel war falsch)', () => {
    const e = getLohnKontrollstelle('NE');
    expect(e.verify).toBe(false);
    expect(e.gesetz).toMatch(/LEmpl/);
    expect(e.gesetz).toMatch(/32a/);
    expect(e.gesetz).not.toMatch(/Mindestlohngesetz/);
    expect(e.stelle).toMatch(/ORCT/);
  });

  it('BS: MiLoG vom 13.01.2021 (SG 812.200), zuständig ist das AWA', () => {
    const e = getLohnKontrollstelle('BS');
    expect(e.verify).toBe(false);
    expect(e.gesetz).toMatch(/MiLoG/);
    expect(e.gesetz).toMatch(/812\.200/);
    expect(e.stelle).toMatch(/Amt für Wirtschaft und Arbeit/);
  });

  // Wahrheits-Disziplin: das Fallback-Verhalten muss erhalten bleiben, auch wenn gerade
  // kein Kanton mehr verify:true trägt — sonst rutscht beim nächsten neuen Kanton
  // eine ungeprüfte Stelle in einen versendbaren Brief.
  it('kein Kanton trägt eine Stelle ohne Beleg (verify:true ⇒ Stelle wird nicht verwendet)', () => {
    for (const [k, e] of Object.entries(LOHN_KONTROLLSTELLEN)) {
      if (e.verify) continue;
      expect(e.gesetz, k + ': belegter Eintrag braucht einen Gesetzestitel').toBeTruthy();
      expect(e.stelle || e.fallback, k + ': belegter Eintrag braucht Stelle oder Fallback').toBeTruthy();
    }
  });

  it('liefert null für Kantone ohne gesetzlichen Mindestlohn', () => {
    expect(getLohnKontrollstelle('ZH')).toBeNull();
    expect(getLohnKontrollstelle('')).toBeNull();
  });

  it('Fix A: der Weg für nicht bezahlten Lohn führt über Schlichtung/Arbeitsgericht', () => {
    expect(UNBEZAHLTER_LOHN_WEG).toMatch(/Schlichtungsbehörde|Arbeitsgericht/);
  });
});
