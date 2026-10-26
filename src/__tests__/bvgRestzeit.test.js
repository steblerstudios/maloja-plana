import { describe, it, expect } from 'vitest';
import { berechneBVGGuthaben, projiziereVorsorge } from '../data/ahvRechner.js';

// BVG-Hochrechnung mit monatsgenauer Restzeit (Fachprüfung 26.10.2026: «Gutschriftjahre aufgerundet, bis knapp ein
// Jahresbeitrag zu viel»). Stichtag 26.10.2026 (Monat 10). Die Zahl der Durchläufe bleibt (Zeitachse), der letzte zählt
// nur den Rest.
const stichtag = new Date(2026, 9, 26);
const basis = { jahresbruttolohn: 80000, stichtag };
const summe = (r) => r.jahresDetail.reduce((s, d) => s + d.anteil, 0);

describe('BVG-Hochrechnung: Restzeit monatsgenau', () => {
  it('Geburt Nov. 1991, Austritt 65: 361 Monate = 30 Jahre 1 Monat; 31 Durchläufe, letzter mit 1/12', () => {
    const r = berechneBVGGuthaben({ ...basis, alter: 34, austrittsalter: 65, geburtsjahr: 1991, geburtsmonat: 11 });
    expect(r.jahresDetail).toHaveLength(31);
    expect(r.jahresDetail[30].anteil).toBeCloseTo(1 / 12, 10);
    expect(summe(r)).toBeCloseTo(361 / 12, 10);
  });

  it('Geburt Feb. 1991, Austritt 65: 352 Monate; 30 Durchläufe, letzter mit 4/12', () => {
    const r = berechneBVGGuthaben({ ...basis, alter: 35, austrittsalter: 65, geburtsjahr: 1991, geburtsmonat: 2 });
    expect(r.jahresDetail).toHaveLength(30);
    expect(r.jahresDetail[29].anteil).toBeCloseTo(4 / 12, 10);
    expect(summe(r)).toBeCloseTo(352 / 12, 10);
  });

  it('Frau JG 1963 (Nov.), Referenzalter 64 J. 9 M.: 22 Monate Rest — nicht drei volle Jahre', () => {
    const r = berechneBVGGuthaben({ ...basis, alter: 62, austrittsalter: 64.75, geburtsjahr: 1963, geburtsmonat: 11 });
    expect(r.jahresDetail.map((d) => d.anteil)).toEqual([1, expect.closeTo(10 / 12, 10), 0]);
    expect(r.jahresDetail[2].beitrag).toBe(0);
  });

  it('weniger Guthaben als die alte Rechnung mit vollen Jahren — genau um die zu viel gezählte Zeit', () => {
    const neu = berechneBVGGuthaben({ ...basis, alter: 34, austrittsalter: 65, geburtsjahr: 1991, geburtsmonat: 11 });
    const alt = berechneBVGGuthaben({ ...basis, alter: 34, austrittsalter: 65, geburtsjahr: 1991 });
    expect(alt.jahresDetail.every((d) => d.anteil === 1)).toBe(true);
    expect(neu.guthaben).toBeLessThan(alt.guthaben);
    // Differenz im letzten Jahr: 11/12 einer 18-%-Gutschrift plus Zins darauf ist die Grössenordnung.
    const gutschrift = neu.koordinierterLohn * 0.18;
    expect(alt.guthaben - neu.guthaben).toBeGreaterThan(gutschrift * 11 / 12 * 0.9);
  });

  it('Projektion endet beim BVG-Guthaben, auch bei Bezugsalter 65.25 (Endwert = BVG-Block)', () => {
    const r = berechneBVGGuthaben({ ...basis, alter: 40, austrittsalter: 65.25, geburtsjahr: 1986, geburtsmonat: 9 });
    const p = projiziereVorsorge({ alter: 40, austrittsalter: 65.25, startjahr: 2026, bvgSerie: r.jahresDetail.map((d) => d.guthaben) });
    expect(r.jahresDetail[r.jahresDetail.length - 1].anteil).toBeCloseTo(2 / 12, 10);
    expect(p.endsumme.bvg).toBe(r.guthaben);
  });

  it('ohne Geburtsmonat wie bisher: jeder Durchlauf ein volles Jahr', () => {
    const r = berechneBVGGuthaben({ ...basis, alter: 40, austrittsalter: 65 });
    expect(r.jahresDetail).toHaveLength(25);
    expect(summe(r)).toBe(25);
  });
});
