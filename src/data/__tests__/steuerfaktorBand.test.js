import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { STEUERFAKTOR_BAND, STEUERBAND_TOLERANZ, steuerbandLage } from '../steuerfaktorBand.js';
import { berechneBundessteuer } from '../steuerRechner.js';
import { kantonsschaetzung } from '../../TaxCalculator.jsx';

// E37 / K37 — Erwartungen aus der Quelle, nicht aus dem eigenen Code.
// Jede Zeile ist ein Messpunkt des ESTV-Steuerrechners (Steuerjahr 2026, Hauptort, ohne Kirche,
// ohne Kinder, verheiratet = Alleinverdiener), abgerufen 16.09.2026, festgehalten in
// docs/sources/steuerfaktor-band-2026.md bzw. .messpunkte.json:
//   [Kanton, Zivilstand,
//    Brutto innen, steuerbar Bund innen, ESTV-Bundessteuer innen, ESTV Kantons+Gemeindesteuer innen,
//    steuerbar Bund bei Brutto 80 000, ESTV-Bundessteuer dort, ESTV Kantons+Gemeindesteuer dort]
const ESTV = [
  ['AG', 'ledig', 170000, 146979, 6735, 22641, 67927, 906, 7448],
  ['AG', 'verheiratet', 180000, 151399, 5560, 18198, 63227, 452, 3960],
  ['AI', 'ledig', 145000, 124327, 4627, 14119, 67927, 906, 6286],
  ['AI', 'verheiratet', 170000, 142279, 4632, 14288, 63227, 452, 4031],
  ['AR', 'ledig', 200000, 174339, 9749, 31761, 67927, 906, 9170],
  ['AR', 'verheiratet', 210000, 178759, 9111, 29670, 63227, 452, 6136],
  ['BE', 'ledig', 190000, 165219, 8748, 35043, 67927, 906, 10760],
  ['BE', 'verheiratet', 200000, 169639, 7928, 31711, 63227, 452, 8115],
  ['BL', 'ledig', 260000, 229059, 16731, 56996, 67927, 906, 10408],
  ['BL', 'verheiratet', 230000, 196999, 11477, 37854, 63227, 452, 4750],
  ['BS', 'ledig', 145000, 124327, 4627, 21442, 67927, 906, 9220],
  ['BS', 'verheiratet', 170000, 142279, 4632, 21442, 63227, 452, 4452],
  ['FR', 'ledig', 200000, 174339, 9749, 38912, 67927, 906, 10527],
  ['FR', 'verheiratet', 200000, 169639, 7928, 29971, 63227, 452, 6455],
  ['GE', 'ledig', 147500, 126501, 4821, 24448, 67927, 906, 9547],
  ['GE', 'verheiratet', 160000, 133159, 3866, 19468, 63227, 452, 3634],
  ['GL', 'ledig', 170000, 146979, 6735, 23141, 67927, 906, 8326],
  ['GL', 'verheiratet', 190000, 160519, 6745, 22763, 63227, 452, 5731],
  ['GR', 'ledig', 180000, 156099, 7736, 25176, 67927, 906, 7492],
  ['GR', 'verheiratet', 190000, 160519, 6745, 21265, 63227, 452, 3273],
  ['JU', 'ledig', 160000, 137859, 5815, 27707, 67927, 906, 9682],
  ['JU', 'verheiratet', 180000, 151399, 5560, 25318, 63227, 452, 5954],
  ['LU', 'ledig', 142500, 122151, 4433, 15280, 67927, 906, 7340],
  ['LU', 'verheiratet', 170000, 142279, 4632, 16056, 63227, 452, 4724],
  ['NE', 'ledig', 190000, 165219, 8748, 39031, 67927, 906, 11960],
  ['NE', 'verheiratet', 190000, 160519, 6745, 31412, 63227, 452, 7880],
  ['NW', 'ledig', 200000, 174339, 9749, 23396, 67927, 906, 7099],
  ['NW', 'verheiratet', 210000, 178759, 9111, 21506, 63227, 452, 4540],
  ['OW', 'ledig', 147500, 126501, 4821, 14922, 67927, 906, 7423],
  ['OW', 'verheiratet', 190000, 160519, 6745, 18390, 63227, 452, 5823],
  ['SG', 'ledig', 210000, 183459, 10750, 36117, 67927, 906, 9459],
  ['SG', 'verheiratet', 210000, 178759, 9111, 29648, 63227, 452, 5336],
  ['SH', 'ledig', 147500, 126501, 4821, 17057, 67927, 906, 6865],
  ['SH', 'verheiratet', 170000, 142279, 4632, 15676, 63227, 452, 4158],
  ['SO', 'ledig', 200000, 174339, 9749, 36249, 67927, 906, 10551],
  ['SO', 'verheiratet', 200000, 169639, 7928, 29893, 63227, 452, 6333],
  ['SZ', 'ledig', 170000, 146979, 6735, 13428, 67927, 906, 4472],
  ['SZ', 'verheiratet', 190000, 160519, 6745, 12867, 63227, 452, 2484],
  ['TG', 'ledig', 190000, 165219, 8748, 26458, 67927, 906, 8306],
  ['TG', 'verheiratet', 200000, 169639, 7928, 23058, 63227, 452, 4631],
  ['TI', 'ledig', 190000, 165219, 8748, 32826, 67927, 906, 8682],
  ['TI', 'verheiratet', 200000, 169639, 7928, 29139, 63227, 452, 4142],
  ['UR', 'ledig', 147500, 126501, 4821, 15466, 67927, 906, 7357],
  ['UR', 'verheiratet', 190000, 160519, 6745, 18957, 63227, 452, 5487],
  ['VD', 'ledig', 190000, 165219, 8748, 37419, 67927, 906, 10933],
  ['VD', 'verheiratet', 190000, 160519, 6745, 29381, 63227, 452, 6948],
  ['VS', 'ledig', 230000, 201699, 13115, 46854, 67927, 906, 8581],
  ['VS', 'verheiratet', 210000, 178759, 9111, 31219, 63227, 452, 5077],
  ['ZG', 'ledig', 145000, 124327, 4627, 7299, 67927, 906, 2433],
  ['ZG', 'verheiratet', 127500, 104400, 2036, 3000, 63227, 452, 995],
  ['ZH', 'ledig', 150000, 128739, 5014, 18912, 67927, 906, 7039],
  ['ZH', 'verheiratet', 180000, 151399, 5560, 19599, 63227, 452, 4715],
];

const toleranzOk = (modell, estv) => Math.abs(modell / estv - 1) <= STEUERBAND_TOLERANZ;

describe('E37 · Messpunkte ESTV 2026 je Kanton', () => {
  it('deckt alle 26 Kantone in beiden Zivilständen ab', () => {
    expect(new Set(ESTV.map((r) => r[0])).size).toBe(26);
    expect(ESTV).toHaveLength(52);
  });

  it.each(ESTV)('%s %s: die eigene Bundessteuer trifft die ESTV-Bundessteuer (Brutto %i)', (kt, zs, _b, steuerbar, dbgEstv, _k, steuerbar80, dbgEstv80) => {
    const verheiratet = zs === 'verheiratet';
    expect(Math.abs(berechneBundessteuer({ bruttoEinkommen: steuerbar, verheiratet }).steuer - dbgEstv)).toBeLessThanOrEqual(1);
    expect(Math.abs(berechneBundessteuer({ bruttoEinkommen: steuerbar80, verheiratet }).steuer - dbgEstv80)).toBeLessThanOrEqual(1);
  });

  it.each(ESTV)('%s %s: innerhalb des Bands → Zahl, höchstens ±15 %% neben der ESTV (Brutto %i)', (kt, zs, _b, steuerbar, dbgEstv, kgEstv) => {
    const verheiratet = zs === 'verheiratet';
    const r = kantonsschaetzung(kt, dbgEstv, steuerbar, { verheiratet });
    expect(r.lage).toBe('innerhalb');
    expect(r.kantonal).not.toBeNull();
    expect(toleranzOk(r.kantonal.kantonalUndGemeinde, kgEstv)).toBe(true);
  });

  it.each(ESTV)('%s %s: bei Brutto 80 000 liegt das Modell mehr als 15 %% neben der ESTV → keine Zahl', (kt, zs, _b, _s, _d, _k, steuerbar80, dbgEstv80, kgEstv80) => {
    const verheiratet = zs === 'verheiratet';
    // Beleg aus der Quelle: so weit liegt der Faktor dort daneben.
    const roh = Math.round(dbgEstv80 * { AG: 3.3, AI: 2.9, AR: 3.4, BE: 4.1, BL: 3.5, BS: 4.4, FR: 4.0, GE: 4.7, GL: 3.4, GR: 3.3, JU: 4.5, LU: 3.4, NE: 4.6, NW: 2.4, OW: 2.9, SG: 3.5, SH: 3.3, SO: 3.9, SZ: 2.0, TG: 3.1, TI: 3.9, UR: 3.0, VD: 4.5, VS: 3.6, ZG: 1.5, ZH: 3.5 }[kt]);
    expect(toleranzOk(roh, kgEstv80)).toBe(false);
    const r = kantonsschaetzung(kt, dbgEstv80, steuerbar80, { verheiratet });
    expect(r.lage).toBe('ausserhalb');
    expect(r.kantonal).toBeNull();
  });
});

describe('E37 · Band gegen alle 3536 Messpunkte', () => {
  const mess = JSON.parse(readFileSync(new URL('../../../docs/sources/steuerfaktor-band-2026.messpunkte.json', import.meta.url), 'utf-8'));
  const faktor = { AG: 3.3, AI: 2.9, AR: 3.4, BE: 4.1, BL: 3.5, BS: 4.4, FR: 4.0, GE: 4.7, GL: 3.4, GR: 3.3, JU: 4.5, LU: 3.4, NE: 4.6, NW: 2.4, OW: 2.9, SG: 3.5, SH: 3.3, SO: 3.9, SZ: 2.0, TG: 3.1, TI: 3.9, UR: 3.0, VD: 4.5, VS: 3.6, ZG: 1.5, ZH: 3.5 };

  it('stammt aus dem ESTV-Steuerrechner, Steuerjahr 2026, mit bestandener Gegenprobe', () => {
    expect(mess.webseite).toBe('https://swisstaxcalculator.estv.admin.ch/');
    expect(mess.steuerjahr).toBe(2026);
    expect(mess.gegenprobe).toMatch(/fehlgeschlagen wie erwartet/);
    expect(mess.punkte).toHaveLength(3536);
  });

  it('jeder Messpunkt, der im Band liegt, liegt auch in der Toleranz', () => {
    const fehler = [];
    for (const [kt, zs, brutto, steuerbar, dbgEstv, , , , , , kg] of mess.punkte) {
      const { lage } = steuerbandLage(kt, steuerbar, { verheiratet: zs === 'verheiratet' });
      if (lage === 'innerhalb' && !toleranzOk(Math.round(dbgEstv * faktor[kt]), kg)) fehler.push([kt, zs, brutto]);
    }
    expect(fehler).toEqual([]);
  });

  it('jedes Band trägt Quelle, Stand und Prüfdatum', () => {
    for (const [kt, z] of Object.entries(STEUERFAKTOR_BAND)) {
      for (const band of [z.ledig, z.verheiratet]) {
        expect(band, kt).not.toBeNull();
        expect(band.bandMin, kt).toBeLessThan(band.bandMax);
        expect(band.quelle, kt).toMatch(/ESTV/);
        expect(band.stand, kt).toBe('2026');
        expect(band.geprueftAm, kt).toBe('2026-09-16');
      }
    }
  });
});

describe('E37 · Lagen ohne Messung', () => {
  it('mit Kindern gibt es kein Band → keine Zahl', () => {
    const r = kantonsschaetzung('ZH', 3000, 128739, { kinder: 1 });
    expect(r.lage).toBe('ungeprueft');
    expect(r.kantonal).toBeNull();
  });

  it('unbekannter Kanton → keine Zahl', () => {
    expect(kantonsschaetzung('XX', 3000, 128739).kantonal).toBeNull();
  });

  it('ohne Kanton → Hinweis zur Kantonswahl', () => {
    expect(kantonsschaetzung('', 3000, 128739).lage).toBe('keinKanton');
  });
});
