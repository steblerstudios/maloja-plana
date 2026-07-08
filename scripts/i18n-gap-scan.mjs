// i18n-Lückenscan: findet Blatt-Schlüssel, deren fr/it/rm-Wert exakt dem
// Deutschen gleicht — ein Signal für vergessene Übersetzungen.
//
//   node scripts/i18n-gap-scan.mjs            # ehrliche Übersicht (Fehlalarme abgezogen)
//   node scripts/i18n-gap-scan.mjs --list rm  # echte Verdachtsfälle einer Sprache
//   node scripts/i18n-gap-scan.mjs --raw      # rohe Zahlen inkl. Fehlalarme
//
// Fehlende Schlüssel (ganz abwesend) fängt bereits der i18n-Vollständigkeitstest;
// dieser Scan findet das Gegenteil: Schlüssel, die DA sind, aber noch auf Deutsch.
//
// Das rohe Signal LÜGT nach oben: Kognaten (Total, Franchise, Niveau …), Eigennamen
// (Maloja Plana, Threema, Kantone), Codes und Format-Strings ({value}%, CHF {value})
// sind bewusst identisch. `isLikelyLegit` zieht diese bekannten Fehlalarme ab, damit
// die verbleibende Zahl der EHRLICHE Gradmesser ist. Der Filter ist bewusst
// konservativ: Zweifelhaftes (Impressum, Affiliate, Testament) bleibt Verdacht.

import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, join } from 'path';

// ── Fehlalarm-Erkennung (rein, testbar; kein Zugriff auf die i18n-Daten) ──────

// Werte, die sprachneutral sein DÜRFEN → kein Verdacht.
export const neutral = (s) =>
  !s || s.length <= 2 ||
  /^[\d\s.,:/+%–—-]*$/.test(s) ||
  /^https?:\/\//.test(s) ||
  /^[A-Z0-9]{2,6}$/.test(s) ||
  /^\{[^}]+\}$/.test(s) ||
  /^(tel:|mailto:)/.test(s);

// Internationale Lehn-/Fremdwörter, die in FR/IT/RM legitim gleich lauten wie im
// Deutschen. Bewusst OHNE die zweifelhaften Fälle (impressum/affiliate/testament),
// damit die als Verdacht sichtbar bleiben. Vergleich klein geschrieben.
export const COGNATES = new Set([
  'total', 'budget', 'franchise', 'maximum', 'minimum', 'import', 'export',
  'basic', 'comfort', 'bachelor', 'master', 'pharma', 'cyber', 'hosting',
  'transport', 'industrie', 'niveau', 'tarif', 'adresse', 'gratis', 'version',
  'online', 'offline', 'standard', 'info', 'status', 'stopp', 'pers.', 'max.',
  'tel.', 'excel (.xlsx)', 'json (ats)',
]);

// Schlüssel-Muster, deren Wert von Natur aus ein Eigenname/Code/Format ist —
// sprachunabhängig (ein Kantonsname, eine Marke ist in jeder Sprache derselbe).
export const LEGIT_KEY_PATTERNS = [
  /(^|\.)cantons\./,                       // Kantonsnamen (viele gleich)
  /^legal\.resources\.[^.]+\.name$/,       // Threema, SecureSafe, petitionen.ch …
  /\.placeholders\./,                      // +41 XX…, 756.XXXX…
  /\.regio\.offers\.[^.]+\.titel$/,        // reale Basler Angebote (Eigennamen)
  /^legal\.imprint\.(operator|contact)/,   // Firmen-/Kontaktangaben
  /^legal\.license\..*Title$/,             // Lizenznamen (AGPL …)
  /\.(kkModel|educationLevel|bloodType)\.options\./, // Basic/Comfort/Bachelor/AB+
  /^common\.appName$/,                     // „Maloja Plana"
];

const stripPlaceholders = (s) => s.replace(/\{[^}]+\}/g, '').trim();

// True, wenn ein DE-gleicher Wert plausibel LEGITIM identisch ist (Fehlalarm).
export function isLikelyLegit(key, val) {
  if (neutral(val)) return true;
  if (LEGIT_KEY_PATTERNS.some((re) => re.test(key))) return true;
  // Nach Entfernen der Platzhalter nur noch Grossbuchstaben/Zahlen/Einheiten/Maske
  // → Format-String (CHF {value}, = CHF {betrag}, ICD-10, 756.XXXX…). Kleinbuch-
  // staben verraten echten Prosa-Text und bleiben Verdacht.
  const rest = stripPlaceholders(val);
  if (rest === '' || /^[\sA-Z0-9.,:;/()%+&×=–—X_-]*$/.test(rest)) return true;
  // Kognat mit angehängtem Platzhalter/Einheit ist immer noch ein Kognat
  // („Franchise {value}" → „Franchise").
  if (COGNATES.has(rest.toLowerCase()) || COGNATES.has(val.trim().toLowerCase())) return true;
  return false;
}

// ── CLI-Teil: läuft nur bei direktem Aufruf, nicht beim Import (für Tests) ────

const isMain = process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMain) {
  const here = dirname(fileURLToPath(import.meta.url));
  const base = join(here, '..', 'src', 'i18n');
  const load = async (f) => (await import(join(base, f))).default;
  const [de, fr, it, rm] = await Promise.all(['de.js', 'fr.js', 'it.js', 'rm.js'].map(load));

  const flatten = (obj, prefix = '', out = {}) => {
    for (const [k, v] of Object.entries(obj || {})) {
      const key = prefix ? prefix + '.' + k : k;
      if (v && typeof v === 'object' && !Array.isArray(v)) flatten(v, key, out);
      else if (typeof v === 'string') out[key] = v;
    }
    return out;
  };

  const raw = process.argv.includes('--raw');
  const fde = flatten(de);
  const maps = { fr: flatten(fr), it: flatten(it), rm: flatten(rm) };
  const report = {};
  for (const [name, map] of Object.entries(maps)) {
    report[name] = Object.entries(fde)
      .filter(([key, deVal]) => map[key] !== undefined && map[key] === deVal &&
        (raw ? !neutral(deVal) : !isLikelyLegit(key, deVal)))
      .map(([key, wert]) => ({ key, wert }));
  }

  const listLang = process.argv.includes('--list') ? process.argv[process.argv.indexOf('--list') + 1] : null;
  if (listLang && report[listLang]) {
    for (const h of report[listLang]) console.log(h.key + '  |  ' + h.wert);
    process.exit(0);
  }

  const label = raw ? 'roh (inkl. Fehlalarme)' : 'echte Verdachtsfälle (Fehlalarme abgezogen)';
  for (const [name, hits] of Object.entries(report)) {
    const byTop = {};
    for (const h of hits) byTop[h.key.split('.')[0]] = (byTop[h.key.split('.')[0]] || 0) + 1;
    const top = Object.entries(byTop).sort((a, b) => b[1] - a[1]).slice(0, 8);
    console.log(`\n${name.toUpperCase()}: ${hits.length}  ${label}`);
    for (const [k, n] of top) console.log(`  ${String(n).padStart(3)}  ${k}`);
  }
  console.log('\nEchte Liste einer Sprache:  node scripts/i18n-gap-scan.mjs --list rm');
  console.log('Rohe Zahlen (mit Fehlalarmen):  node scripts/i18n-gap-scan.mjs --raw');
}
