// i18n-Lückenscan: findet Blatt-Schlüssel, deren fr/it/rm-Wert exakt dem
// Deutschen gleicht — ein hartes Signal für vergessene Übersetzungen.
//
//   node scripts/i18n-gap-scan.mjs            # Übersicht + Bereiche
//   node scripts/i18n-gap-scan.mjs --list rm  # volle Liste einer Sprache
//
// Fehlende Schlüssel (ganz abwesend) fängt bereits der i18n-Vollständigkeitstest;
// dieser Scan findet das Gegenteil: Schlüssel, die DA sind, aber noch auf Deutsch.
// Cognates (Adresse, Total, Budget, Franchise …), Eigennamen und Platzhalter
// erscheinen als Fehltreffer — sie sind bewusst identisch. Der ehrliche Gradmesser
// sind die vollständigen Ablauf-Flows (umzug, kvgWechsel …), die als Block auftauchen.

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const here = dirname(fileURLToPath(import.meta.url));
const base = join(here, '..', 'src', 'i18n');
const load = async (f) => (await import(join(base, f))).default;
const [de, fr, it, rm] = await Promise.all(['de.js', 'fr.js', 'it.js', 'rm.js'].map(load));

function flatten(obj, prefix = '', out = {}) {
  for (const [k, v] of Object.entries(obj || {})) {
    const key = prefix ? prefix + '.' + k : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) flatten(v, key, out);
    else if (typeof v === 'string') out[key] = v;
  }
  return out;
}

// Werte, die sprachneutral sein DÜRFEN → kein Verdacht.
const neutral = (s) =>
  !s || s.length <= 2 ||
  /^[\d\s.,:/+%–—-]*$/.test(s) ||
  /^https?:\/\//.test(s) ||
  /^[A-Z0-9]{2,6}$/.test(s) ||
  /^\{[^}]+\}$/.test(s) ||
  /^(tel:|mailto:)/.test(s);

const fde = flatten(de);
const maps = { fr: flatten(fr), it: flatten(it), rm: flatten(rm) };
const report = {};
for (const [name, map] of Object.entries(maps)) {
  report[name] = Object.entries(fde)
    .filter(([key, deVal]) => map[key] !== undefined && !neutral(deVal) && map[key] === deVal)
    .map(([key, wert]) => ({ key, wert }));
}

const listLang = process.argv.includes('--list') ? process.argv[process.argv.indexOf('--list') + 1] : null;
if (listLang && report[listLang]) {
  for (const h of report[listLang]) console.log(h.key + '  |  ' + h.wert);
  process.exit(0);
}

for (const [name, hits] of Object.entries(report)) {
  const byTop = {};
  for (const h of hits) byTop[h.key.split('.')[0]] = (byTop[h.key.split('.')[0]] || 0) + 1;
  const top = Object.entries(byTop).sort((a, b) => b[1] - a[1]).slice(0, 8);
  console.log(`\n${name.toUpperCase()}: ${hits.length} identisch zum Deutschen (Verdacht: nicht übersetzt)`);
  for (const [k, n] of top) console.log(`  ${String(n).padStart(3)}  ${k}`);
}
console.log('\nVolle Liste einer Sprache:  node scripts/i18n-gap-scan.mjs --list rm');
