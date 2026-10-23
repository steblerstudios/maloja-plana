import { describe, it, expect } from 'vitest';
import { werteFuerStichtag } from '../jahrestabelle.js';
import { AHV_WERTE_JE_JAHR, ahvWerte, berechneAltersrente, vergleicheVorbezugAufschub, berechneBVGGuthaben, vorbezugKuerzungsbetrag } from '../ahvRechner.js';
import { LOHN_WERTE_JE_JAHR, lohnWerte, bvgKoordinationsabzug } from '../lohnAbzuege.js';
import { saeule3aMaximum, SAEULE3A_HOECHSTABZUG_JE_STEUERJAHR } from '../saeule3a.js';

// Werte 2027 als Jahrestabelle (Weg A, Entscheid Stebler Studios 21.10.2026). Jeder Test hier gibt den
// Stichtag ausdrücklich mit — er hängt nicht an der Uhr. Was beim Laden aus der Uhr gebildet wird
// (AHV_PARAMS, Versionen), prüft werte2027Uhr.test.js mit fester Uhr 2027.
// Belege: Kommentare in ahvRechner.js (AHV_WERTE_JE_JAHR) und lohnAbzuege.js (LOHN_WERTE_JE_JAHR).
const J2026 = new Date(2026, 5, 15);
const J2027 = new Date(2027, 0, 15);

describe('werteFuerStichtag', () => {
  const t = { 2026: { a: 1 }, 2027: { a: 2 } };
  it('nimmt das Jahr des Stichtags', () => {
    expect(werteFuerStichtag(t, J2026)).toEqual({ a: 1, jahr: 2026, belegt: true });
    expect(werteFuerStichtag(t, J2027)).toEqual({ a: 2, jahr: 2027, belegt: true });
  });
  it('schaltet genau um Mitternacht am 1.1. um (Ortszeit)', () => {
    expect(werteFuerStichtag(t, new Date(2026, 11, 31, 23, 59, 59)).jahr).toBe(2026);
    expect(werteFuerStichtag(t, new Date(2027, 0, 1, 0, 0, 0)).jahr).toBe(2027);
  });
  it('nimmt auch eine Jahreszahl oder einen Datums-String', () => {
    expect(werteFuerStichtag(t, 2027).a).toBe(2);
    expect(werteFuerStichtag(t, '2026-03-01').a).toBe(1);
  });
  it('nach dem letzten belegten Jahr: letztes Jahr, aber sichtbar nicht belegt', () => {
    expect(werteFuerStichtag(t, 2028)).toEqual({ a: 2, jahr: 2027, belegt: false });
  });
  it('ohne Stichtag (auch null) gilt heute', () => {
    const heute = new Date().getFullYear();
    expect(werteFuerStichtag(t, null).jahr).toBe(werteFuerStichtag(t, heute).jahr);
    expect(werteFuerStichtag(t, undefined).jahr).toBe(werteFuerStichtag(t, heute).jahr);
  });
  it('vor dem ersten belegten Jahr: das erste', () => {
    expect(werteFuerStichtag(t, 2020)).toEqual({ a: 1, jahr: 2026, belegt: false });
  });
});

describe('AHV 2027 (Skala 44 gültig ab 1.1.2027)', () => {
  it('Eckwerte 2027', () => {
    const w = ahvWerte(J2027);
    expect(w.minRente).toBe(1280);
    expect(w.maxRente).toBe(2560);
    expect(w.maxEhepaar).toBe(3840);
    expect(w.maxVersichertesEinkommen).toBe(92160);
    expect(w.erziehungsgutschriftJahr).toBe(3 * 12 * 1280);
  });

  it('die Tabelle 2027 ist vollständig: 51 Zeilen, Schritt 1536, monoton, Grenzen wie Eckwerte', () => {
    for (const jahr of [2026, 2027]) {
      const { skala44, minRente, maxRente, maxVersichertesEinkommen } = AHV_WERTE_JE_JAHR[jahr];
      expect(skala44).toHaveLength(51);
      expect(skala44[0]).toEqual([12 * minRente, minRente]);
      expect(skala44[50]).toEqual([maxVersichertesEinkommen, maxRente]);
      const schritt = skala44[1][0] - skala44[0][0];
      skala44.slice(1).forEach(([e, r], i) => {
        expect(e - skala44[i][0]).toBe(schritt);
        expect(r).toBeGreaterThan(skala44[i][1]);
      });
    }
    expect(AHV_WERTE_JE_JAHR[2027].skala44[1][0] - AHV_WERTE_JE_JAHR[2027].skala44[0][0]).toBe(1536);
  });

  const rente = (einkommen, stichtag, extra = {}) => berechneAltersrente({
    geburtsjahr: 1965, durchschnittlichesJahreseinkommen: einkommen, beitragsjahre: 44, stichtag, ...extra,
  });

  it('Minimum und Maximum je Jahr', () => {
    expect(rente(10000, J2026).monatsrente).toBe(1260);
    expect(rente(10000, J2027).monatsrente).toBe(1280);
    expect(rente(200000, J2026).monatsrente).toBe(2520);
    expect(rente(200000, J2027).monatsrente).toBe(2560);
  });

  it('Tabellenwerte 2027 (Stichproben aus dem BSV-PDF) und Aufrunden auf die nächste Zeile', () => {
    expect(rente(46080, J2027).monatsrente).toBe(1946);
    expect(rente(46081, J2027).monatsrente).toBe(1966);
    expect(rente(90624, J2027).monatsrente).toBe(2540);
    expect(rente(90625, J2027).monatsrente).toBe(2560);
    // dasselbe Einkommen 2026: nächsthöhere Zeile 46'872 → 1'935
    expect(rente(46080, J2026).monatsrente).toBe(1935);
  });

  it('meldet das Jahr der verwendeten Werte', () => {
    expect(rente(50000, J2026).werteJahr).toBe(2026);
    expect(rente(50000, J2027).werteJahr).toBe(2027);
  });

  it('Plafond Ehepaar 2027: 3 840', () => {
    const r = rente(200000, J2027, { verheiratet: true, einkommenPartner: 200000 });
    expect(r.plafoniert).toBe(true);
    expect(r.totalEhepaar).toBe(3840);
    expect(r.monatsrente).toBe(1920);
  });

  it('Erziehungsgutschrift 2027: 3 × 15 360 = 46 080 je Jahr', () => {
    expect(rente(30000, J2027, { erziehungsjahre: 11 }).erziehungsgutschrift).toBe(46080 * 11 / 44);
    expect(rente(30000, J2026, { erziehungsjahre: 11 }).erziehungsgutschrift).toBe(45360 * 11 / 44);
  });

  it('Vorbezug 2027 (Neuberechnung im Referenzalter, #529) rechnet mit den Werten 2027', () => {
    const r = rente(200000, J2027, { beitragsjahre: 42, bezugAlter: 63 });
    const teilrente2027 = Math.round(2560 * 42 / 44);
    expect(r.kuerzungsbetrag).toBe(vorbezugKuerzungsbetrag(teilrente2027, 24));
    expect(r.monatsrente).toBe(teilrente2027 - r.kuerzungsbetrag);
    expect(r.monatsrenteReferenzalter).toBe(2560 - r.kuerzungsbetrag);
    const r26 = rente(200000, J2026, { beitragsjahre: 42, bezugAlter: 63 });
    expect(r26.monatsrenteReferenzalter).toBe(2520 - vorbezugKuerzungsbetrag(Math.round(2520 * 42 / 44), 24));
  });

  it('der Vorbezug/Aufschub-Vergleich reicht den Stichtag durch', () => {
    const z65 = (st) => vergleicheVorbezugAufschub(200000, 44, undefined, 1965, undefined, undefined, st)
      .find((z) => z.bezugAlter === 65).monatsrente;
    expect(z65(J2026)).toBe(2520);
    expect(z65(J2027)).toBe(2560);
  });
});

describe('BVG 2027 (BVV 2 Art. 5, AS 2026 547)', () => {
  it('Grenzbeträge 2027', () => {
    const w = lohnWerte(J2027);
    expect(w.eintrittsschwelle).toBe(23040);
    expect(w.koordinationsabzug).toBe(26880);
    expect(w.minKoordinierterLohn).toBe(3840);
    expect(w.maxKoordinierterLohn).toBe(92160 - 26880);
  });

  it('Lohnabzüge 2027 unverändert (Belege in lohnAbzuege.js)', () => {
    const { ahvIvEoSatzAn, alvSatzAn, alvHoechstbetragJahr, ahvFreibetragRentnerMonat } = LOHN_WERTE_JE_JAHR[2027];
    expect([ahvIvEoSatzAn, alvSatzAn, alvHoechstbetragJahr, ahvFreibetragRentnerMonat])
      .toEqual([0.053, 0.011, 148200, 1400]);
  });

  it('Eintrittsschwelle: «mehr als» 23 040 (2027) bzw. 22 680 (2026)', () => {
    expect(bvgKoordinationsabzug(23040, J2027).versichert).toBe(false);
    expect(bvgKoordinationsabzug(23041, J2027)).toMatchObject({ versichert: true, koordinierterLohn: 3840 });
    // 22 700 ist 2026 versichert, 2027 nicht mehr
    expect(bvgKoordinationsabzug(22700, J2026).versichert).toBe(true);
    expect(bvgKoordinationsabzug(22700, J2027).versichert).toBe(false);
  });

  it('koordinierter Lohn und Obergrenze 2027', () => {
    expect(bvgKoordinationsabzug(60000, J2027).koordinierterLohn).toBe(60000 - 26880);
    expect(bvgKoordinationsabzug(300000, J2027).koordinierterLohn).toBe(65280);
    expect(bvgKoordinationsabzug(300000, J2026).koordinierterLohn).toBe(64260);
  });

  it('das BVG-Guthaben rechnet mit dem Stichtag — Mindestzins bleibt 1,25 % (kein Entscheid 2027)', () => {
    const g = (st) => berechneBVGGuthaben({ alter: 64, jahresbruttolohn: 300000, stichtag: st });
    expect(g(J2027).koordinierterLohn).toBe(65280);
    expect(g(J2026).koordinierterLohn).toBe(64260);
    expect(g(J2027).zinssatz).toBe(1.25);
  });
});

describe('Säule 3a Steuerjahr 2027', () => {
  it('7 373 / 36 864 (BVV 3 Art. 7 × oberer Grenzbetrag 92 160)', () => {
    expect(saeule3aMaximum(2027)).toBe(7373);
    expect(SAEULE3A_HOECHSTABZUG_JE_STEUERJAHR[2027].ohnePensionskasse).toBe(36864);
    expect(Math.round(0.08 * 92160)).toBe(7373);
    expect(0.4 * 92160).toBe(36864);
  });
  it('2026 unverändert, 2028 nicht belegt', () => {
    expect(saeule3aMaximum(2026)).toBe(7258);
    expect(saeule3aMaximum(2028)).toBe(null);
  });
});
