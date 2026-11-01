// PLZ → Kanton/Gemeinde, Kantonscodes und -namen — der Teil der Kantonsdaten, den die Startdatei braucht.
// Eigene Datei seit 28.09.2026: solange main.jsx diese Funktionen aus cantonalData.js holte, lag die
// ganze Datei samt IPV-, Sozialhilfe- und EL-Rechnung in der Startdatei (65-kB-Grenze). cantonalData.js
// reicht alles hier weiter; bestehende Importe bleiben gültig. Startdatei-Module importieren von HIER.

// PLZ-Bereiche → Kanton (Fallback für PLZ ohne amtlichen Eintrag): Kanton + obere Grenze des Bereichs, je bis zur
// nächsten; «--» ist die Lücke 7800–7999. So kurz, weil die Tabelle in der Startdatei liegt. Der Wächter
// kantonPLZBereiche.test.js vergleicht jede PLZ mit der früheren langen Tabelle.
const PLZ_BEREICHE = 'VD1199 GE1299 VD1599 FR1799 VD1899 VS1999 NE2499 BE2699 JU2999 BE3899 VS3999 BS4099 BL4299 SO4799 AG4899 SO4999 AG5999 LU6299 ZG6399 SZ6449 UR6499 TI6999 GR7799 --7999 ZH8199 SH8299 ZH8499 TG8599 ZH8799 SZ8899 AG8999 SG9099 AI9199 SG9699 AR9799 SG9999'.split(' ');

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

  const bereich = PLZ_BEREICHE.find(b => num <= +b.slice(2));
  return bereich[0] === '-' ? null : bereich.slice(0, 2);
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
