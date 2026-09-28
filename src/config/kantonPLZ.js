// PLZ → Kanton/Gemeinde, Kantonscodes und -namen — der Teil der Kantonsdaten, den die Startdatei braucht.
// Eigene Datei seit 28.09.2026: solange main.jsx diese Funktionen aus cantonalData.js holte, lag die
// ganze Datei samt IPV-, Sozialhilfe- und EL-Rechnung in der Startdatei (65-kB-Grenze). cantonalData.js
// reicht alles hier weiter; bestehende Importe bleiben gültig. Startdatei-Module importieren von HIER.

// PLZ-Bereiche → Kanton Zuordnung (Fallback für PLZ ohne amtlichen Eintrag)
const PLZ_RANGES = [
  { from: 1000, to: 1099, canton: 'VD' },
  { from: 1100, to: 1199, canton: 'VD' },
  { from: 1200, to: 1299, canton: 'GE' },
  { from: 1300, to: 1399, canton: 'VD' },
  { from: 1400, to: 1499, canton: 'VD' },
  { from: 1500, to: 1599, canton: 'VD' },
  { from: 1600, to: 1699, canton: 'FR' },
  { from: 1700, to: 1799, canton: 'FR' },
  { from: 1800, to: 1899, canton: 'VD' },
  { from: 1900, to: 1999, canton: 'VS' },
  { from: 2000, to: 2099, canton: 'NE' },
  { from: 2100, to: 2199, canton: 'NE' },
  { from: 2200, to: 2299, canton: 'NE' },
  { from: 2300, to: 2399, canton: 'NE' },
  { from: 2400, to: 2499, canton: 'NE' },
  { from: 2500, to: 2599, canton: 'BE' },
  { from: 2600, to: 2699, canton: 'BE' },
  { from: 2700, to: 2799, canton: 'JU' },
  { from: 2800, to: 2899, canton: 'JU' },
  { from: 2900, to: 2999, canton: 'JU' },
  { from: 3000, to: 3199, canton: 'BE' },
  { from: 3200, to: 3299, canton: 'BE' },
  { from: 3300, to: 3399, canton: 'BE' },
  { from: 3400, to: 3499, canton: 'BE' },
  { from: 3500, to: 3599, canton: 'BE' },
  { from: 3600, to: 3699, canton: 'BE' },
  { from: 3700, to: 3799, canton: 'BE' },
  { from: 3800, to: 3899, canton: 'BE' },
  { from: 3900, to: 3999, canton: 'VS' },
  { from: 4000, to: 4099, canton: 'BS' },
  { from: 4100, to: 4199, canton: 'BL' },
  { from: 4200, to: 4299, canton: 'BL' },
  { from: 4300, to: 4399, canton: 'SO' },
  { from: 4400, to: 4499, canton: 'SO' },
  { from: 4500, to: 4599, canton: 'SO' },
  { from: 4600, to: 4699, canton: 'SO' },
  { from: 4700, to: 4799, canton: 'SO' },
  { from: 4800, to: 4899, canton: 'AG' },
  { from: 4900, to: 4999, canton: 'SO' },
  { from: 5000, to: 5099, canton: 'AG' },
  { from: 5100, to: 5199, canton: 'AG' },
  { from: 5200, to: 5299, canton: 'AG' },
  { from: 5300, to: 5399, canton: 'AG' },
  { from: 5400, to: 5499, canton: 'AG' },
  { from: 5500, to: 5599, canton: 'AG' },
  { from: 5600, to: 5699, canton: 'AG' },
  { from: 5700, to: 5799, canton: 'AG' },
  { from: 5800, to: 5899, canton: 'AG' },
  { from: 5900, to: 5999, canton: 'AG' },
  { from: 6000, to: 6099, canton: 'LU' },
  { from: 6100, to: 6199, canton: 'LU' },
  { from: 6200, to: 6249, canton: 'LU' },
  { from: 6250, to: 6299, canton: 'LU' },
  { from: 6300, to: 6399, canton: 'ZG' },
  { from: 6400, to: 6449, canton: 'SZ' },
  { from: 6450, to: 6499, canton: 'UR' },
  { from: 6500, to: 6599, canton: 'TI' },
  { from: 6600, to: 6699, canton: 'TI' },
  { from: 6700, to: 6799, canton: 'TI' },
  { from: 6800, to: 6899, canton: 'TI' },
  { from: 6900, to: 6999, canton: 'TI' },
  { from: 7000, to: 7099, canton: 'GR' },
  { from: 7100, to: 7199, canton: 'GR' },
  { from: 7200, to: 7299, canton: 'GR' },
  { from: 7300, to: 7399, canton: 'GR' },
  { from: 7400, to: 7499, canton: 'GR' },
  { from: 7500, to: 7599, canton: 'GR' },
  { from: 7600, to: 7699, canton: 'GR' },
  { from: 7700, to: 7799, canton: 'GR' },
  { from: 8000, to: 8099, canton: 'ZH' },
  { from: 8100, to: 8199, canton: 'ZH' },
  { from: 8200, to: 8299, canton: 'SH' },
  { from: 8300, to: 8399, canton: 'ZH' },
  { from: 8400, to: 8499, canton: 'ZH' },
  { from: 8500, to: 8599, canton: 'TG' },
  { from: 8600, to: 8699, canton: 'ZH' },
  { from: 8700, to: 8799, canton: 'ZH' },
  { from: 8800, to: 8899, canton: 'SZ' },
  { from: 8900, to: 8999, canton: 'AG' },
  { from: 9000, to: 9099, canton: 'SG' },
  { from: 9100, to: 9199, canton: 'AI' },
  { from: 9200, to: 9299, canton: 'SG' },
  { from: 9300, to: 9399, canton: 'SG' },
  { from: 9400, to: 9499, canton: 'SG' },
  { from: 9500, to: 9599, canton: 'SG' },
  { from: 9600, to: 9699, canton: 'SG' },
  { from: 9700, to: 9799, canton: 'AR' },
  { from: 9800, to: 9899, canton: 'SG' },
  { from: 9900, to: 9999, canton: 'SG' },
];

let _plzModule = null;

// Das geladene PLZ-Modul (oder null) — für die IPV-Kantonsmodelle in cantonalData.js.
export function plzModul() {
  return _plzModule;
}

// Nur das PLZ-Modul vorladen und `_plzModule` setzen (anders als ein roher dynamic import,
// der nur den Cache wärmt).
export function preloadPLZModul() {
  if (!_plzModule) import('../data/plzGemeinde.js').then(m => { _plzModule = m; }).catch(() => {});
}

// PLZ-Daten UND die Kantonsmodelle der Prämienverbilligung vorladen, damit präzise Kanton- und
// Gemeinde-Lookups schon beim ersten PLZ-Eintrag greifen. Die Kantonsmodelle hängen an
// cantonalData.js; die Datei kommt dafür als eigener Chunk nach — sie bleibt aus der Startdatei.
export function preloadPLZ() {
  preloadPLZModul();
  import('./cantonalData.js').then(m => m.preloadIPVModelle()).catch(() => {});
}

export function cantonFromPLZ(plz) {
  const num = parseInt(plz, 10);
  if (isNaN(num) || num < 1000 || num > 9999) return null;

  if (_plzModule) {
    const precise = _plzModule.cantonFromPLZPrecise(plz);
    if (precise) return precise;
  } else {
    import('../data/plzGemeinde.js').then(m => { _plzModule = m; });
  }

  const match = PLZ_RANGES.find(r => num >= r.from && num <= r.to);
  return match ? match.canton : null;
}

// Primäre Gemeinde aus PLZ (lokal). Braucht das geladene PLZ-Modul; vorher null
// (kein Range-Fallback für Namen). Stösst den Lazy-Load an wie cantonFromPLZ.
export function gemeindeFromPLZ(plz) {
  const num = parseInt(plz, 10);
  if (isNaN(num) || num < 1000 || num > 9999) return null;
  if (_plzModule) {
    const primary = _plzModule.primaryGemeinde(plz);
    return primary ? primary.gemeinde : null;
  }
  import('../data/plzGemeinde.js').then(m => { _plzModule = m; });
  return null;
}

export const CANTON_CODES = [
  'AG', 'AI', 'AR', 'BE', 'BL', 'BS', 'FR', 'GE', 'GL', 'GR',
  'JU', 'LU', 'NE', 'NW', 'OW', 'SG', 'SH', 'SO', 'SZ', 'TG',
  'TI', 'UR', 'VD', 'VS', 'ZG', 'ZH'
];

export function getCantonName(code, t) {
  if (!code) return '';
  if (t) return t('cantons.' + code) || code;
  return code;
}
