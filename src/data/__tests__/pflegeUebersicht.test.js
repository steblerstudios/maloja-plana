import { describe, it, expect } from 'vitest';
import { berechnePflegeUebersicht as uebersicht, GUTSCHRIFT_STATUS as S } from '../pflegeUebersicht.js';
import { berechneHilflosenentschaedigung } from '../hilflosenentschaedigung.js';

const he = (p, person = p.traeger || 'iv') => ({ ...berechneHilflosenentschaedigung({ stichtag: 2026, ...p }), person });
const alleJa = { erreichbar: true, mind180Tage: true, erziehung: false, referenzalter: false, stichtag: 2026 };

describe('Pflege-Übersicht · Betreuungsgutschrift (AHVG 29septies)', () => {
  it('alle Bedingungen erfüllt → ja, 3× minimale jährliche Altersrente', () => {
    const r = uebersicht({ he: he({ traeger: 'iv', grad: 'mittel' }), ...alleJa });
    expect(r.gutschrift.status).toBe(S.JA);
    expect(r.gutschrift.betragJahr).toBe(45360);
  });
  it('jeder Grad genügt, auch leicht', () => {
    expect(uebersicht({ he: he({ traeger: 'ahv', grad: 'leicht' }), ...alleJa }).gutschrift.status).toBe(S.JA);
  });
  it('2027 aus der Jahrestabelle: 46 080', () => {
    const r = uebersicht({ he: he({ traeger: 'iv', grad: 'schwer' }), ...alleJa, stichtag: 2027 });
    expect(r.gutschrift.betragJahr).toBe(46080);
    expect(r.jahr).toBe(2027);
  });
  it('verheiratet → hälftig (Abs. 6)', () => {
    const r = uebersicht({ he: he({ traeger: 'iv', grad: 'mittel' }), verheiratet: true, ...alleJa });
    expect(r.gutschrift.betragJahr).toBe(22680);
    expect(r.gutschrift.geteilt).toBe(true);
  });
  it('mehrere Betreuende teilen zu gleichen Teilen (AHVV 52i)', () => {
    expect(uebersicht({ he: he({ traeger: 'iv', grad: 'mittel' }), anzahlBetreuende: 3, ...alleJa }).gutschrift.betragJahr).toBe(15120);
  });
  it('ungültige Anzahl fällt auf 1 zurück', () => {
    expect(uebersicht({ he: he({ traeger: 'iv', grad: 'mittel' }), anzahlBetreuende: 0, ...alleJa }).gutschrift.betragJahr).toBe(45360);
  });
  it('Heim schliesst aus (KSBGS Rz 3010.2)', () => {
    const r = uebersicht({ he: he({ traeger: 'iv', grad: 'schwer', wohnen: 'heim' }), ...alleJa });
    expect(r.gutschrift).toMatchObject({ status: S.NEIN, grund: 'heim', betragJahr: 0 });
  });
  it('weiter als 30 km / 1 h schliesst NICHT aus — Einzelfall (AHVV 52g «insbesondere»)', () => {
    const r = uebersicht({ he: he({ traeger: 'iv', grad: 'mittel' }), ...alleJa, erreichbar: false });
    expect(r.gutschrift).toMatchObject({ status: S.OFFEN, grund: 'zu_weit_einzelfall', betragJahr: 45360 });
  });
  it('eigene Erziehungsgutschrift schliesst aus, auch wenn ein Elternteil gepflegt wird (Abs. 2, RWL Rz 5261)', () => {
    const r = uebersicht({ he: he({ traeger: 'ahv', grad: 'mittel' }), ...alleJa, erziehung: true });
    expect(r.gutschrift).toMatchObject({ status: S.NEIN, grund: 'erziehung', betragJahr: 0 });
  });
  it('Referenzalter erreicht schliesst aus (KSBGS Rz 1003)', () => {
    const r = uebersicht({ he: he({ traeger: 'ahv', grad: 'schwer' }), ...alleJa, referenzalter: true });
    expect(r.gutschrift).toMatchObject({ status: S.NEIN, grund: 'referenzalter' });
  });
  it('weniger als 180 Tage schliesst aus (KSBGS Rz 3015)', () => {
    expect(uebersicht({ he: he({ traeger: 'iv', grad: 'mittel' }), ...alleJa, mind180Tage: false }).gutschrift.grund).toBe('zu_wenig');
  });
  it('Fragen offen → offen, Betrag trotzdem sichtbar, fehlende Angaben genannt', () => {
    const r = uebersicht({ he: he({ traeger: 'iv', grad: 'mittel' }), stichtag: 2026 });
    expect(r.gutschrift).toMatchObject({ status: S.OFFEN, grund: 'fragen_offen', betragJahr: 45360 });
    expect(r.ergebnis.fehlend).toEqual(['erreichbar', 'mind180Tage', 'erziehung', 'referenzalter']);
  });
  it('Grad offen → Gutschrift offen (he_offen), HE als Spanne', () => {
    const r = uebersicht({ he: he({ traeger: 'iv', grad: null }), ...alleJa });
    expect(r.gutschrift).toMatchObject({ status: S.OFFEN, grund: 'he_offen' });
    expect(r.anGepflegte.spanne).toEqual({ min: 504, max: 2016 });
    expect(r.ergebnis.fehlend).toContain('grad');
  });
  it('Kind, Frage nach Erziehungsgutschrift offen → Hinweis auf Abs. 2 und EO', () => {
    const r = uebersicht({ he: he({ traeger: 'iv', grad: 'mittel', minderjaehrig: true }, 'kind'), ...alleJa, erziehung: null });
    expect(r.gutschrift.grund).toBe('erziehung_vorrang');
    expect(r.eoHinweis).toBe(true);
  });
  it('Kind über 16 ohne eigene Erziehungsgutschrift → ja', () => {
    expect(uebersicht({ he: he({ traeger: 'iv', grad: 'mittel', minderjaehrig: true }, 'kind'), ...alleJa }).gutschrift.status).toBe(S.JA);
  });
});

describe('Pflege-Übersicht · getrennte Töpfe, kein Gesamttotal', () => {
  it('Lohn und HE stehen getrennt', () => {
    const r = uebersicht({ lohn: { monatVon: 1819, monatBis: 2425 }, he: he({ traeger: 'iv', grad: 'mittel' }), ...alleJa });
    expect(r.anDich).toEqual({ monatVon: 1819, monatBis: 2425 });
    expect(r.anGepflegte).toEqual({ monat: 1260 });
    expect(r).not.toHaveProperty('total');
  });
  it('leer → nichts erfunden, Gutschrift offen', () => {
    const r = uebersicht({ stichtag: 2026 });
    expect(r.anDich).toBeNull();
    expect(r.anGepflegte).toBeNull();
    expect(r.gutschrift.status).toBe(S.OFFEN);
    expect(r.eoHinweis).toBe(false);
  });
  it('Ergebnis-Art ist SCHÄTZUNG', () => {
    expect(uebersicht({ stichtag: 2026 }).ergebnis.art).toBe('schaetzung');
  });
});
