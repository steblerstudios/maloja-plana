import { describe, it, expect } from 'vitest';
import { berechneAltersrente, vergleicheVorbezugAufschub, vorbezugKuerzungProzent, vorbezugKuerzungsbetrag } from '../ahvRechner.js';

// Fachprüfung 21.10.2026: Der Vorsorge-Rechner rechnete einen AHV-Vorbezug lebenslang als Teilrente.
// BSV-Merkblatt 3.04 «Flexibler Rentenbezug», Stand 1.1.2026 (https://www.ahv-iv.ch/p/3.04.d,
// abgerufen 2026-10-21 17:23 UTC), Ziff. 5: «Bei Erreichen des Referenzalters wird Ihre Altersrente
// definitiv berechnet. Die Versicherungszeiten während der Vorbezugsdauer werden berücksichtigt»;
// der Kürzungsbetrag (Satz × ungekürzte vorbezogene Rente) bleibt.

describe('Kürzungssätze = Tabelle Merkblatt 3.04 Ziff. 4', () => {
  it('jeder Monat 0–24 wie gedruckt', () => {
    const tabelle = [
      0, 0.6, 1.1, 1.7, 2.3, 2.8, 3.4, 4.0, 4.5, 5.1, 5.7, 6.2,
      6.8, 7.4, 7.9, 8.5, 9.1, 9.6, 10.2, 10.8, 11.3, 11.9, 12.5, 13.0,
      13.6,
    ];
    tabelle.forEach((satz, monate) => expect(vorbezugKuerzungProzent(monate), monate + ' Monate').toBe(satz));
    expect(vorbezugKuerzungProzent(30)).toBe(13.6); // höchstens 24 Monate
  });
});

describe('Merkblatt 3.04 Ziff. 24/25: Kürzungsbetrag in ganzen Franken', () => {
  it('Ziff. 24: 1 478 × 8,5 % = 126, plafoniert 1 397 × 8,5 % = 119 (15 Monate)', () => {
    expect(vorbezugKuerzungsbetrag(1478, 15)).toBe(126);
    expect(1478 - vorbezugKuerzungsbetrag(1478, 15)).toBe(1352);
    expect(vorbezugKuerzungsbetrag(1397, 15)).toBe(119);
    expect(1397 - vorbezugKuerzungsbetrag(1397, 15)).toBe(1278);
  });
  it('Ziff. 25: [(1 478 × 10) + (1 397 × 5)] × 8,5 % ÷ 15 = 123, ab Referenzalter 1 890 − 123 = 1 767', () => {
    const kuerzung = vorbezugKuerzungsbetrag((1478 * 10 + 1397 * 5) / 15, 15);
    expect(kuerzung).toBe(123);
    expect(1890 - kuerzung).toBe(1767);
  });
  it('Ziff. 24: «Teilrente Skala 43» 2 463 Franken — Teilrente auf ganze Franken', () => {
    const r = berechneAltersrente({ geburtsjahr: 1962, geschlecht: 'male', durchschnittlichesJahreseinkommen: 90720, beitragsjahre: 43, bezugAlter: 65 });
    expect(r.monatsrente).toBe(2463); // 2 520 × 43/44 = 2 462,73
  });
});

describe('Fall der Fachprüfung: Bezug 63, Ø 80 000, Referenzalter 65', () => {
  const basis = { geburtsjahr: 1970, durchschnittlichesJahreseinkommen: 80000, bezugAlter: 63 };

  it('bis 65 Teilrente 42/44 mit 13,6 %, ab 65 Vollrente minus fester Kürzungsbetrag', () => {
    const r = berechneAltersrente({ ...basis, beitragsjahre: 42, beitragsjahreReferenzalter: 44 });
    // 2 379 × 42/44 = 2 270,86 → 2 271; Kürzung 2 271 × 13,6 % = 308,86 → 309
    expect(r.vorbezugAufschub).toBe(-13.6);
    expect(r.kuerzungsbetrag).toBe(309);
    expect(r.monatsrente).toBe(1962);
    expect(r.beitragsjahreReferenzalter).toBe(44);
    expect(r.monatsrenteReferenzalter).toBe(2070); // 2 379 − 309; vorher lebenslang 1 962
    expect(r.jahresrenteReferenzalter).toBe(2070 * 13);
    expect(r.fehlendeBeitragsjahre).toBe(0); // die zwei Jahre füllen sich bis 65
  });

  it('ohne Angabe zählen die vollen Vorbezugsjahre dazu (Beitragspflicht, Ziff. 8)', () => {
    const r = berechneAltersrente({ ...basis, beitragsjahre: 42 });
    expect(r.beitragsjahreReferenzalter).toBe(44);
    expect(r.monatsrenteReferenzalter).toBe(2070);
    const r64 = berechneAltersrente({ ...basis, bezugAlter: 64, beitragsjahre: 40 });
    expect(r64.beitragsjahreReferenzalter).toBe(41);
  });

  it('nicht schlechter als ohne Neuberechnung, nicht besser als ohne Vorbezug', () => {
    const r = berechneAltersrente({ ...basis, beitragsjahre: 42, beitragsjahreReferenzalter: 44 });
    const ohneVorbezug = berechneAltersrente({ ...basis, beitragsjahre: 44, bezugAlter: 65 });
    expect(r.monatsrenteReferenzalter).toBeGreaterThan(r.monatsrente);
    expect(r.monatsrenteReferenzalter).toBeLessThan(ohneVorbezug.monatsrente);
  });
});

describe('ohne Vorbezug ändert sich nichts', () => {
  it('Bezug im Referenzalter und Aufschub: Rente ab Referenzalter = Monatsrente, keine Kürzung', () => {
    for (const bezugAlter of [65, 67]) {
      const r = berechneAltersrente({ geburtsjahr: 1970, durchschnittlichesJahreseinkommen: 80000, beitragsjahre: 44, bezugAlter });
      expect(r.kuerzungsbetrag).toBe(0);
      expect(r.monatsrenteReferenzalter).toBe(r.monatsrente);
    }
  });
});

describe('Ehepaar: zuerst plafonieren, dann kürzen (Ziff. 24/25)', () => {
  it('beide Maximalrente, Vorbezug 24 Monate: 1 890 − 257 = 1 633', () => {
    const r = berechneAltersrente({ geburtsjahr: 1970, durchschnittlichesJahreseinkommen: 90720, beitragsjahre: 44, bezugAlter: 63, verheiratet: true, einkommenPartner: 90720 });
    expect(r.plafoniert).toBe(true);
    expect(r.kuerzungsbetrag).toBe(257); // 1 890 × 13,6 % = 257,04
    expect(r.monatsrente).toBe(1633);
    expect(r.monatsrenteReferenzalter).toBe(1633);
  });
});

describe('Frau JG 1962 (Referenzalter 64 J 6 M), Bezug 63 = 18 Monate', () => {
  it('Satz 10,2 %; ab Referenzalter volle Beitragsdauer des Jahrgangs', () => {
    const r = berechneAltersrente({ geburtsjahr: 1962, geburtsmonat: 2, geschlecht: 'female', durchschnittlichesJahreseinkommen: 80000, beitragsjahre: 42, bezugAlter: 63, beitragsjahreReferenzalter: 44 });
    expect(r.vorbezugAufschub).toBe(-10.2);
    expect(r.volleBeitragsdauer).toBe(43);
    expect(r.monatsrente).toBe(2324 - 237); // 2 379 × 42/43 = 2 323,67 → 2 324; × 10,2 % = 237,05
    expect(r.beitragsjahreReferenzalter).toBe(43);
    expect(r.monatsrenteReferenzalter).toBe(2379 - 237);
  });
});

describe('Vergleichstabelle trägt die Rente ab Referenzalter', () => {
  it('Zeile 63 = berechneAltersrente, Zeilen ab 65 ohne Unterschied', () => {
    const zeilen = vergleicheVorbezugAufschub(80000, 42, undefined, 1970, undefined, 44);
    const z63 = zeilen.find(z => z.bezugAlter === 63);
    expect(z63.monatsrente).toBe(1962);
    expect(z63.monatsrenteReferenzalter).toBe(2070);
    for (const z of zeilen.filter(z => z.bezugAlter >= 65)) expect(z.monatsrenteReferenzalter).toBe(z.monatsrente);
  });
});
