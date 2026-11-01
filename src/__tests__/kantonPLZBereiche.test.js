import { describe, it, expect } from 'vitest';
import { cantonFromPLZ } from '../config/kantonPLZ.js';

// Die frühere Tabelle von kantonPLZ.js, wörtlich. Seit 01.11.2026 liegt sie dort kurz gefasst (65-kB-Grenze);
// das Ergebnis darf sich für keine PLZ ändern.
const ALT = [
  [1000, 1099, 'VD'],
  [1100, 1199, 'VD'],
  [1200, 1299, 'GE'],
  [1300, 1399, 'VD'],
  [1400, 1499, 'VD'],
  [1500, 1599, 'VD'],
  [1600, 1699, 'FR'],
  [1700, 1799, 'FR'],
  [1800, 1899, 'VD'],
  [1900, 1999, 'VS'],
  [2000, 2099, 'NE'],
  [2100, 2199, 'NE'],
  [2200, 2299, 'NE'],
  [2300, 2399, 'NE'],
  [2400, 2499, 'NE'],
  [2500, 2599, 'BE'],
  [2600, 2699, 'BE'],
  [2700, 2799, 'JU'],
  [2800, 2899, 'JU'],
  [2900, 2999, 'JU'],
  [3000, 3199, 'BE'],
  [3200, 3299, 'BE'],
  [3300, 3399, 'BE'],
  [3400, 3499, 'BE'],
  [3500, 3599, 'BE'],
  [3600, 3699, 'BE'],
  [3700, 3799, 'BE'],
  [3800, 3899, 'BE'],
  [3900, 3999, 'VS'],
  [4000, 4099, 'BS'],
  [4100, 4199, 'BL'],
  [4200, 4299, 'BL'],
  [4300, 4399, 'SO'],
  [4400, 4499, 'SO'],
  [4500, 4599, 'SO'],
  [4600, 4699, 'SO'],
  [4700, 4799, 'SO'],
  [4800, 4899, 'AG'],
  [4900, 4999, 'SO'],
  [5000, 5099, 'AG'],
  [5100, 5199, 'AG'],
  [5200, 5299, 'AG'],
  [5300, 5399, 'AG'],
  [5400, 5499, 'AG'],
  [5500, 5599, 'AG'],
  [5600, 5699, 'AG'],
  [5700, 5799, 'AG'],
  [5800, 5899, 'AG'],
  [5900, 5999, 'AG'],
  [6000, 6099, 'LU'],
  [6100, 6199, 'LU'],
  [6200, 6249, 'LU'],
  [6250, 6299, 'LU'],
  [6300, 6399, 'ZG'],
  [6400, 6449, 'SZ'],
  [6450, 6499, 'UR'],
  [6500, 6599, 'TI'],
  [6600, 6699, 'TI'],
  [6700, 6799, 'TI'],
  [6800, 6899, 'TI'],
  [6900, 6999, 'TI'],
  [7000, 7099, 'GR'],
  [7100, 7199, 'GR'],
  [7200, 7299, 'GR'],
  [7300, 7399, 'GR'],
  [7400, 7499, 'GR'],
  [7500, 7599, 'GR'],
  [7600, 7699, 'GR'],
  [7700, 7799, 'GR'],
  [8000, 8099, 'ZH'],
  [8100, 8199, 'ZH'],
  [8200, 8299, 'SH'],
  [8300, 8399, 'ZH'],
  [8400, 8499, 'ZH'],
  [8500, 8599, 'TG'],
  [8600, 8699, 'ZH'],
  [8700, 8799, 'ZH'],
  [8800, 8899, 'SZ'],
  [8900, 8999, 'AG'],
  [9000, 9099, 'SG'],
  [9100, 9199, 'AI'],
  [9200, 9299, 'SG'],
  [9300, 9399, 'SG'],
  [9400, 9499, 'SG'],
  [9500, 9599, 'SG'],
  [9600, 9699, 'SG'],
  [9700, 9799, 'AR'],
  [9800, 9899, 'SG'],
  [9900, 9999, 'SG'],
];

describe('PLZ-Bereiche, kurze Fassung', () => {
  it('liefert für jede PLZ denselben Kanton wie die lange Tabelle, auch in der Lücke', () => {
    for (let plz = 1000; plz <= 9999; plz += 1) {
      const zeile = ALT.find(([von, bis]) => plz >= von && plz <= bis);
      expect(cantonFromPLZ(String(plz))).toBe(zeile ? zeile[2] : null);
    }
  });

  it('ausserhalb 1000–9999 kein Kanton', () => {
    expect(cantonFromPLZ('999')).toBeNull();
    expect(cantonFromPLZ('10000')).toBeNull();
    expect(cantonFromPLZ('abc')).toBeNull();
  });
});
