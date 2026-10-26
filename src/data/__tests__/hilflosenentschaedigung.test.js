import { describe, it, expect } from 'vitest';
import {
  berechneHilflosenentschaedigung as he, heErgebnis, heWerte,
  HE_WERTE_JE_JAHR, HE_ANTEIL, HE_HEIM_ANTEIL_IV, INTENSIV_ANTEIL, GRADE,
} from '../hilflosenentschaedigung.js';
import { AHV_WERTE_JE_JAHR } from '../ahvRechner.js';

// Stichtag wird je Aufruf übergeben (2026 bzw. 2027) — keine falsche Uhr nötig.

describe('Hilflosenentschädigung · Beträge 2026 wie in den Merkblättern', () => {
  it('IV zu Hause: 504 / 1 260 / 2 016 (Merkblatt 4.13 Ziff. 6)', () => {
    expect(he({ traeger: 'iv', grad: 'leicht', stichtag: 2026 }).betragMonat).toBe(504);
    expect(he({ traeger: 'iv', grad: 'mittel', stichtag: 2026 }).betragMonat).toBe(1260);
    expect(he({ traeger: 'iv', grad: 'schwer', stichtag: 2026 }).betragMonat).toBe(2016);
  });
  it('IV im Heim: 126 / 315 / 504', () => {
    expect(he({ traeger: 'iv', grad: 'leicht', wohnen: 'heim', stichtag: 2026 }).betragMonat).toBe(126);
    expect(he({ traeger: 'iv', grad: 'mittel', wohnen: 'heim', stichtag: 2026 }).betragMonat).toBe(315);
    expect(he({ traeger: 'iv', grad: 'schwer', wohnen: 'heim', stichtag: 2026 }).betragMonat).toBe(504);
  });
  it('AHV: 252 / 630 / 1 008 (Merkblatt 3.01 Ziff. 28), im Heim gleich hoch', () => {
    expect(he({ traeger: 'ahv', grad: 'leicht', stichtag: 2026 }).betragMonat).toBe(252);
    expect(he({ traeger: 'ahv', grad: 'mittel', stichtag: 2026 }).betragMonat).toBe(630);
    expect(he({ traeger: 'ahv', grad: 'schwer', wohnen: 'heim', stichtag: 2026 }).betragMonat).toBe(1008);
  });
  it('Intensivpflegezuschlag Minderjährige: 1 008 / 1 764 / 2 520 (Ziff. 9)', () => {
    const r = (h) => he({ grad: 'schwer', minderjaehrig: true, intensivStunden: h, stichtag: 2026 }).intensivMonat;
    expect([r(4), r(6), r(8)]).toEqual([1008, 1764, 2520]);
    expect(r(0)).toBe(0);
  });
});

describe('Hilflosenentschädigung · Regel aus dem Gesetz, beide Jahre', () => {
  it.each(Object.keys(HE_WERTE_JE_JAHR))('%s folgt IVG Art. 42ter und AHVG Art. 43bis', (jahr) => {
    const w = HE_WERTE_JE_JAHR[jahr];
    const ahv = AHV_WERTE_JE_JAHR[jahr];
    expect(w.mindestrente).toBe(ahv.minRente);
    expect(w.hoechstrente).toBe(ahv.maxRente);
    for (const g of GRADE) {
      expect(w.iv.zuhause[g]).toBe(Math.round(HE_ANTEIL[g] * ahv.maxRente));
      expect(w.iv.heim[g]).toBe(Math.round(HE_ANTEIL[g] * ahv.maxRente * HE_HEIM_ANTEIL_IV));
      expect(w.ahv[g]).toBe(Math.round(HE_ANTEIL[g] * ahv.minRente));
    }
    for (const h of [4, 6, 8]) expect(w.intensiv[h]).toBe(Math.round(INTENSIV_ANTEIL[h] * ahv.maxRente));
  });
  it('2027 ist als gerechnet markiert, 2026 als zitiert', () => {
    expect(heWerte(2026).gerechnet).toBe(false);
    expect(heWerte(2027).gerechnet).toBe(true);
    expect(he({ grad: 'mittel', stichtag: 2027 }).betragMonat).toBe(1280);
  });
});

describe('Hilflosenentschädigung · Sonderfälle', () => {
  it('AHV, leichter Grad im Heim: kein Anspruch (AHVG Art. 43bis Abs. 1bis)', () => {
    const r = he({ traeger: 'ahv', grad: 'leicht', wohnen: 'heim', stichtag: 2026 });
    expect(r.anspruch).toBe(false);
    expect(r.grund).toBe('ahv_leicht_heim');
  });
  it('AHV mit Besitzstand aus der IV: mindestens der IV-Betrag', () => {
    const r = he({ traeger: 'ahv', grad: 'mittel', besitzstandIV: true, stichtag: 2026 });
    expect(r.betragMonat).toBe(1260);
    expect(r.besitzstand).toBe(true);
  });
  it('AHV, leicht im Heim mit Besitzstand: kein Nullbetrag, die Ausgleichskasse klärt', () => {
    const r = he({ traeger: 'ahv', grad: 'leicht', wohnen: 'heim', besitzstandIV: true, stichtag: 2026 });
    expect(r.anspruch).toBeNull();
    expect(r.grund).toBe('besitzstand_klaeren');
    expect(r.betragMonat).toBeNull();
  });
  it('Spanne mit Besitzstand reicht bis zum IV-Betrag', () => {
    expect(he({ traeger: 'ahv', besitzstandIV: true, stichtag: 2026 }).spanne).toEqual({ min: 504, max: 2016 });
  });
  it('Grad offen: keine Zahl, nur die Spanne', () => {
    const r = he({ traeger: 'iv', stichtag: 2026 });
    expect(r.betragMonat).toBeNull();
    expect(r.spanne).toEqual({ min: 504, max: 2016 });
    expect(he({ traeger: 'ahv', wohnen: 'heim', stichtag: 2026 }).spanne).toEqual({ min: 630, max: 1008 });
  });
  it('Minderjährige zahlen nie über die AHV, kein Zuschlag im Heim', () => {
    expect(he({ traeger: 'ahv', grad: 'leicht', minderjaehrig: true, stichtag: 2026 }).traeger).toBe('iv');
    const heim = he({ grad: 'schwer', minderjaehrig: true, wohnen: 'heim', intensivStunden: 8, stichtag: 2026 });
    expect(heim.grund).toBe('minderjaehrig_heim');
    expect(heim.betragMonat).toBeNull();
  });
  it('Wartezeit: IV 12 Monate, AHV 6 Monate', () => {
    expect(he({ traeger: 'iv', grad: 'mittel' }).wartezeitMonate).toBe(12);
    expect(he({ traeger: 'ahv', grad: 'mittel' }).wartezeitMonate).toBe(6);
  });
  it('unbekannte Werte fallen ruhig auf IV und zu Hause zurück', () => {
    const r = he({ traeger: 'xy', wohnen: 'mond', grad: 'schwer', stichtag: 2026 });
    expect(r.traeger).toBe('iv');
    expect(r.betragMonat).toBe(2016);
  });
  it('Ergebnis-Art: Schätzung, ohne Grad fehlt eine Angabe', () => {
    expect(heErgebnis({ grad: 'mittel' })).toEqual({ art: 'schaetzung', fehlend: [] });
    expect(heErgebnis({ grad: null }).fehlend).toEqual(['grad']);
  });
});
