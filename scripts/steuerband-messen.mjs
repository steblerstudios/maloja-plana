#!/usr/bin/env node
// E37 / K37 — Einkommensband für den Kantons-/Gemeindesteuer-Faktor (kantonaleSteuerdaten.js).
//
// Zwei Schritte, getrennt, damit die Auswertung ohne Netz nachvollziehbar bleibt:
//
//   node scripts/steuerband-messen.mjs --messen
//     Fragt den amtlichen Steuerrechner der ESTV ab (swisstaxcalculator.estv.admin.ch,
//     Operation API_calculateDetailedTaxes — dieselbe, die die Web-Oberfläche benutzt) und
//     schreibt die Rohwerte nach docs/sources/steuerfaktor-band-2026.messpunkte.json.
//     Nur dieses Entwickler-Skript geht ins Netz. Die App selbst bleibt ohne Netzwerk-Calls.
//
//   node scripts/steuerband-messen.mjs
//     Wertet die Messpunkte aus: legt das Modell der App (Faktor × Bundessteuer nach
//     steuerRechner.js) gegen die ESTV-Kantons- und Gemeindesteuer und schreibt
//       src/data/steuerfaktorBand.js           (Band je Kanton und Zivilstand)
//       docs/sources/steuerfaktor-band-2026.md (Methode + alle Messpunkte)
//
// Messanlage: Steuerjahr 2026, Kantonshauptort, unselbständig erwerbend, Alter 40,
// Konfession «andere/keine» (also ohne Kirchensteuer — der Faktor meint Kantons- und
// Gemeindesteuer), kein Vermögen, keine Kinder. Verheiratet: Alleinverdiener-Ehepaar.
// Die ESTV rechnet vom Bruttolohn mit ihren Standardabzügen (AHV/IV/EO, ALV, NBU, BVG,
// Berufsauslagen, Versicherungsabzug) und liefert das steuerbare Einkommen Bund dazu.

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { berechneBundessteuer } from '../src/data/steuerRechner.js';
import { getKantonDaten } from '../src/data/kantonaleSteuerdaten.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const MESS_PATH = resolve(__dirname, '../docs/sources/steuerfaktor-band-2026.messpunkte.json');
const DATA_PATH = resolve(__dirname, '../src/data/steuerfaktorBand.js');
const DOC_PATH = resolve(__dirname, '../docs/sources/steuerfaktor-band-2026.md');

const API = 'https://swisstaxcalculator.estv.admin.ch/delegate/ost-integration/v1/lg-proxy/operation/c3b67379_ESTV/';
const STEUERJAHR = 2026;
const TOLERANZ = 0.15;

// TaxLocationID aus API_searchLocation (Suche nach dem Hauptort, Kanton geprüft), BFS-Nummer zur Kontrolle.
const ORTE = {
  AG: { id: 500000000, ort: 'Aarau', bfs: 4001 },
  AI: { id: 905000000, ort: 'Appenzell', bfs: 3101 },
  AR: { id: 910000000, ort: 'Herisau', bfs: 3001 },
  BE: { id: 300000000, ort: 'Bern', bfs: 351 },
  BL: { id: 441000000, ort: 'Liestal', bfs: 2829 },
  BS: { id: 400000000, ort: 'Basel', bfs: 2701 },
  FR: { id: 170000000, ort: 'Fribourg', bfs: 2196 },
  GE: { id: 120000000, ort: 'Genève', bfs: 6621 },
  GL: { id: 875000000, ort: 'Glarus', bfs: 1632 },
  GR: { id: 700000000, ort: 'Chur', bfs: 3901 },
  JU: { id: 280000000, ort: 'Delémont', bfs: 6711 },
  LU: { id: 600000000, ort: 'Luzern', bfs: 1061 },
  NE: { id: 200000000, ort: 'Neuchâtel', bfs: 6458 },
  NW: { id: 637000000, ort: 'Stans', bfs: 1509 },
  OW: { id: 606000000, ort: 'Sarnen', bfs: 1407 },
  SG: { id: 900000000, ort: 'St. Gallen', bfs: 3203 },
  SH: { id: 820000000, ort: 'Schaffhausen', bfs: 2939 },
  SO: { id: 450000000, ort: 'Solothurn', bfs: 2601 },
  SZ: { id: 643000000, ort: 'Schwyz', bfs: 1372 },
  TG: { id: 850000000, ort: 'Frauenfeld', bfs: 4566 },
  TI: { id: 650000000, ort: 'Bellinzona', bfs: 5002 },
  UR: { id: 646000000, ort: 'Altdorf UR', bfs: 1201 },
  VD: { id: 100000000, ort: 'Lausanne', bfs: 5586 },
  VS: { id: 195000000, ort: 'Sion', bfs: 6266 },
  ZG: { id: 630000000, ort: 'Zug', bfs: 1711 },
  ZH: { id: 800000000, ort: 'Zürich', bfs: 261 },
};

// Bruttolöhne: 20 000–150 000 in Schritten von 2 500, danach bis 300 000 in Schritten von 10 000.
const BRUTTO = [];
for (let b = 20000; b <= 150000; b += 2500) BRUTTO.push(b);
for (let b = 160000; b <= 300000; b += 10000) BRUTTO.push(b);

const ZIVILSTAND = { ledig: 1, verheiratet: 2 };

async function post(op, body) {
  const res = await fetch(API + op, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(op + ' HTTP ' + res.status);
  const json = await res.json();
  if (!json || !json.response) throw new Error(op + ' ohne response');
  return json.response;
}

async function messen() {
  const abgerufen = new Date().toISOString();
  // Gegenprobe: eine erfundene Operation muss scheitern, sonst unterscheidet das Skript echte
  // Antworten nicht von einer Fehlerseite.
  let gegenprobe = 'fehlgeschlagen wie erwartet';
  try { await post('API_gibtEsNicht_' + Date.now(), {}); gegenprobe = 'UNERWARTET beantwortet'; } catch { /* erwartet */ }
  if (gegenprobe !== 'fehlgeschlagen wie erwartet') throw new Error('Gegenprobe: ' + gegenprobe);

  const version = await post('API_getTaxVersion', {}).catch(() => null);
  const punkte = [];
  const auftraege = [];
  for (const [kt, o] of Object.entries(ORTE)) {
    for (const [zs, rel] of Object.entries(ZIVILSTAND)) {
      for (const brutto of BRUTTO) auftraege.push({ kt, o, zs, rel, brutto });
    }
  }
  let i = 0;
  async function arbeiter() {
    while (i < auftraege.length) {
      const a = auftraege[i++];
      const r = await post('API_calculateDetailedTaxes', {
        SimKey: null, TaxYear: STEUERJAHR, TaxLocationID: a.o.id, Relationship: a.rel,
        Confession1: 4, Children: [], Age1: 40, RevenueType1: 1, Revenue1: a.brutto, Fortune: 0,
        Confession2: a.rel === 2 ? 4 : 0, Age2: a.rel === 2 ? 40 : 0, RevenueType2: 0, Revenue2: 0, Budget: [],
      });
      if (r.Location && (r.Location.Canton !== a.kt || r.Location.BfsID !== a.o.bfs)) {
        throw new Error('Ort passt nicht: ' + a.kt + ' ' + JSON.stringify(r.Location));
      }
      // Kantons- und Gemeindesteuer auf dem Einkommen inkl. Personal-/Kopfsteuer, ohne Kirche.
      const kantonUndGemeinde = r.IncomeTaxCanton + r.IncomeTaxCity + (r.PersonalTax || 0);
      punkte.push([a.kt, a.zs, a.brutto, r.TaxableIncomeFed, r.IncomeTaxFed, r.IncomeTaxCanton, r.IncomeTaxCity, r.PersonalTax || 0, r.IncomeTaxChurch, r.TotalTax, kantonUndGemeinde]);
    }
  }
  await Promise.all([arbeiter(), arbeiter(), arbeiter(), arbeiter()]);
  punkte.sort((x, y) => x[0].localeCompare(y[0]) || x[1].localeCompare(y[1]) || x[2] - y[2]);
  writeFileSync(MESS_PATH, JSON.stringify({
    quelle: 'ESTV Steuerrechner, API_calculateDetailedTaxes (' + API + ')',
    webseite: 'https://swisstaxcalculator.estv.admin.ch/',
    abgerufen,
    steuerjahr: STEUERJAHR,
    gegenprobe: 'erfundene Operation → ' + gegenprobe,
    version,
    anlage: 'Hauptort, unselbständig, Alter 40, Konfession andere/keine, ohne Kinder, ohne Vermögen; verheiratet = Alleinverdiener',
    orte: ORTE,
    spalten: ['kanton', 'zivilstand', 'brutto', 'steuerbarBund', 'bundessteuerEstv', 'kantonssteuer', 'gemeindesteuer', 'personalsteuer', 'kirchensteuer', 'totalSteuer', 'kantonUndGemeinde'],
    punkte,
  }, null, 0).replace(/\],\[/g, '],\n[') + '\n');
  console.log('gemessen:', punkte.length, 'Punkte, Gegenprobe:', gegenprobe);
}

const chf = (n) => Math.round(n).toLocaleString('de-CH').replace(/[’,]/g, "'");
const pct = (x) => (x > 0 ? '+' : '') + Math.round(x * 100) + ' %';

function auswerten(mess) {
  const bands = {};
  const zeilen = {};
  const eigeneDbgAbweichungen = [];
  for (const kt of Object.keys(ORTE)) {
    const faktor = getKantonDaten(kt).faktor;
    bands[kt] = {};
    zeilen[kt] = {};
    for (const zs of Object.keys(ZIVILSTAND)) {
      const pts = mess.punkte.filter((p) => p[0] === kt && p[1] === zs).map((p) => {
        const [, , brutto, steuerbar, dbgEstv, , , , , , kug] = p;
        const dbgApp = berechneBundessteuer({ bruttoEinkommen: steuerbar, verheiratet: zs === 'verheiratet' }).steuer;
        if (Math.abs(dbgApp - dbgEstv) > 1) eigeneDbgAbweichungen.push({ kt, zs, steuerbar, dbgApp, dbgEstv });
        const modell = dbgApp > 0 ? Math.round(dbgApp * faktor) : null;
        const abw = modell === null || kug <= 0 ? null : modell / kug - 1;
        return { brutto, steuerbar, dbgApp, kug, modell, abw, ok: abw !== null && Math.abs(abw) <= TOLERANZ };
      });
      zeilen[kt][zs] = pts;
      // Längster zusammenhängender Lauf von Messpunkten innerhalb der Toleranz.
      let best = null; let cur = null;
      for (const p of pts) {
        if (p.ok) { cur = cur ? { ...cur, bis: p, n: cur.n + 1 } : { von: p, bis: p, n: 1 }; if (!best || cur.n > best.n) best = cur; } else cur = null;
      }
      bands[kt][zs] = best && best.n >= 2
        ? { bandMin: best.von.steuerbar, bandMax: best.bis.steuerbar, bruttoMin: best.von.brutto, bruttoMax: best.bis.brutto }
        : null;
    }
  }
  return { bands, zeilen, eigeneDbgAbweichungen };
}

function schreiben(mess, { bands, zeilen, eigeneDbgAbweichungen }) {
  const geprueftAm = mess.abgerufen.slice(0, 10);
  const quelle = 'ESTV Steuerrechner (swisstaxcalculator.estv.admin.ch), Steuerjahr ' + mess.steuerjahr + ', Kantonshauptort, ohne Kirchensteuer';
  const js = [
    '// E37 / K37 — Einkommensband, in dem der Kantons-/Gemeindesteuer-Faktor aus',
    '// kantonaleSteuerdaten.js belegt ist. GENERIERT von scripts/steuerband-messen.mjs — nicht von Hand ändern.',
    '// Messpunkte und Methode: docs/sources/steuerfaktor-band-2026.md',
    '//',
    '// bandMin/bandMax = steuerbares Einkommen Bund (CHF), gemessen an den ESTV-Werten. Innerhalb',
    '// liegt das Modell (Faktor × Bundessteuer) an jedem Messpunkt höchstens ±' + Math.round(TOLERANZ * 100) + ' % neben der',
    '// ESTV-Kantons- und Gemeindesteuer. null = kein solcher Bereich gefunden → keine Zahl zeigen.',
    '// Gemessen nur ohne Kinder; ledig und verheiratet (Alleinverdiener) getrennt.',
    '',
    'export const STEUERBAND_TOLERANZ = ' + TOLERANZ + ';',
    "export const STEUERBAND_QUELLE = '" + quelle + "';",
    "export const STEUERBAND_STAND = '" + mess.steuerjahr + "';",
    "export const STEUERBAND_GEPRUEFT_AM = '" + geprueftAm + "';",
    '',
    'const b = (bandMin, bandMax) => ({ bandMin, bandMax });',
    '',
    'export const STEUERFAKTOR_BAND = {',
    ...Object.entries(bands).map(([kt, z]) =>
      '  ' + kt + ': { ledig: ' + (z.ledig ? 'b(' + z.ledig.bandMin + ', ' + z.ledig.bandMax + ')' : 'null') +
      ', verheiratet: ' + (z.verheiratet ? 'b(' + z.verheiratet.bandMin + ', ' + z.verheiratet.bandMax + ')' : 'null') + ' },'),
    '};',
    '',
    '/**',
    ' * Liegt die Schätzung im belegten Band? Nur ohne Kinder gemessen — mit Kindern gibt es kein Band.',
    " * @returns {'innerhalb'|'ausserhalb'|'unbelegt'}",
    ' */',
    'export function steuerbandLage(kuerzel, steuerbaresEinkommen, { verheiratet = false, kinder = 0 } = {}) {',
    '  const kanton = STEUERFAKTOR_BAND[kuerzel];',
    "  if (!kanton) return 'unbelegt';",
    "  const band = kanton[verheiratet ? 'verheiratet' : 'ledig'];",
    "  if (!band || kinder > 0) return 'ausserhalb';",
    "  return steuerbaresEinkommen >= band.bandMin && steuerbaresEinkommen <= band.bandMax ? 'innerhalb' : 'ausserhalb';",
    '}',
    '',
  ].join('\n');
  writeFileSync(DATA_PATH, js);

  const zs = Object.keys(ZIVILSTAND);
  const belegt = (z) => Object.entries(bands).filter(([, v]) => v[z]).map(([k]) => k);
  const lines = [];
  lines.push('# Kantons-/Gemeindesteuer-Faktor — belegtes Einkommensband 2026 (E37 / K37)', '');
  lines.push('Erhoben am **' + geprueftAm + '** mit `node scripts/steuerband-messen.mjs --messen`, ausgewertet mit',
    '`node scripts/steuerband-messen.mjs`. Diese Datei ist **generiert**; die Rohwerte liegen daneben in',
    '`steuerfaktor-band-2026.messpunkte.json`.', '');
  lines.push('## Quelle', '',
    '- **ESTV, Steuerrechner** — <' + mess.webseite + '>, Rechner «Einkommens- und Vermögenssteuer»,',
    '  detaillierte Berechnung. Abgefragt über die Schnittstelle, die die Web-Oberfläche selbst benutzt:',
    '  `API_calculateDetailedTaxes` (' + API + ').',
    '- Abgerufen: ' + mess.abgerufen + ' (UTC). Steuerjahr **' + mess.steuerjahr + '** (der Rechner bietet 2010–2026 an).',
    '- Gegenprobe: ' + mess.gegenprobe + ' (HTML-Fehlerseite «Server Error»). Die Antworten sind also echte Berechnungen.',
    '- Ort je Kanton: Kantonshauptort, TaxLocationID aus `API_searchLocation`; jede Antwort wurde gegen',
    '  Kanton und BFS-Nummer des Orts geprüft.',
    '- Die ESTV-Publikation «Steuerbelastung in den Kantonshauptorten» wurde **nicht** als Datei gelesen;',
    '  der Steuerrechner ist die rechnende Quelle derselben Behörde und erlaubt beliebige Einkommen.', '');
  lines.push('## Messanlage', '',
    '- ' + mess.anlage + '.',
    '- Bruttolohn 20 000–150 000 in Schritten von 2 500, danach bis 300 000 in Schritten von 10 000.',
    '- Die ESTV rechnet vom Bruttolohn mit ihren Standardabzügen und liefert das steuerbare Einkommen Bund.',
    '- **ESTV K+G** = Kantonssteuer + Gemeindesteuer + Personal-/Kopfsteuer auf dem Einkommen, ohne Kirchensteuer.',
    '- **Modell** = so rechnet die App: Bundessteuer aus `steuerRechner.js` auf dem steuerbaren Einkommen Bund der ESTV,',
    '  mal Faktor aus `kantonaleSteuerdaten.js`, gerundet.',
    '- Kontrolle der eigenen Bundessteuer: ' + (eigeneDbgAbweichungen.length === 0
      ? 'an allen ' + mess.punkte.length + ' Messpunkten höchstens CHF 1 neben der ESTV-Bundessteuer.'
      : eigeneDbgAbweichungen.length + ' Messpunkte weichen um mehr als CHF 1 ab (siehe Ende).'), '');
  lines.push('## Toleranz und Band', '',
    '- **Toleranz ±' + Math.round(TOLERANZ * 100) + ' %** der ESTV-Kantons- und Gemeindesteuer. Begründung: Die App kennzeichnet die Zahl',
    '  als «grobe Schätzung» und rechnet nur mit dem Hauptort. Die Gemeindesteuerfüsse innerhalb eines Kantons',
    '  liegen oft um mehr als 15 % auseinander; eine engere Toleranz am Hauptort würde Genauigkeit vorspiegeln, die',
    '  für andere Gemeinden ohnehin nicht gilt. Eine weitere Toleranz liesse Abweichungen durch, die im Budget',
    '  spürbar falsch sind (bei CHF 8 000 Steuer mehr als CHF 1 200).',
    '- **Band** = der längste zusammenhängende Bereich von Messpunkten, die alle innerhalb der Toleranz liegen',
    '  (mindestens zwei). Grenzen sind gemessene Punkte, nichts ist extrapoliert. Zwischen zwei Messpunkten wird',
    '  angenommen, dass die Abweichung nicht aus der Toleranz springt (Abstand 2 500 bzw. 10 000 Brutto).',
    '- Angegeben als **steuerbares Einkommen Bund** — das ist die Grösse, aus der die App die Bundessteuer rechnet.',
    '- **Nicht gemessen:** Haushalte mit Kindern, Doppelverdiener, andere Gemeinden als der Hauptort, Kirchensteuer.',
    '  Mit Kindern zeigt die App deshalb keine Kantonszahl.', '');
  lines.push('## Ergebnis', '');
  for (const z of zs) lines.push('- **' + z + ':** ' + belegt(z).length + ' von 26 Kantonen mit Band' +
    (belegt(z).length < 26 ? ' · ohne Band: ' + Object.keys(bands).filter((k) => !bands[k][z]).join(', ') : ''));
  lines.push('', '| Kanton | Faktor | ledig: Band steuerbar Bund (Brutto) | verheiratet: Band steuerbar Bund (Brutto) | ledig Abw. bei Brutto 30k / 50k / 80k / 120k / 200k |', '|---|---|---|---|---|');
  for (const [kt, v] of Object.entries(bands)) {
    const f = (x) => (x ? chf(x.bandMin) + '–' + chf(x.bandMax) + ' (' + chf(x.bruttoMin) + '–' + chf(x.bruttoMax) + ')' : '— kein Band');
    const probe = [30000, 50000, 80000, 120000, 200000].map((b) => {
      const p = zeilen[kt].ledig.find((q) => q.brutto === b);
      return p && p.abw !== null ? pct(p.abw) : '–';
    }).join(' / ');
    lines.push('| ' + kt + ' ' + ORTE[kt].ort + ' | ' + getKantonDaten(kt).faktor + ' | ' + f(v.ledig) + ' | ' + f(v.verheiratet) + ' | ' + probe + ' |');
  }
  lines.push('', '## Alle Messpunkte', '',
    'Spalten: Brutto · steuerbar Bund (ESTV) · Bundessteuer (App) · ESTV K+G · Modell · Abweichung · ✓ = innerhalb ±' + Math.round(TOLERANZ * 100) + ' %.',
    '«–» beim Modell: Bundessteuer 0, die App zeigt schon heute keine Kantonszahl.', '');
  for (const kt of Object.keys(ORTE)) {
    lines.push('### ' + kt + ' — ' + ORTE[kt].ort + ' (Faktor ' + getKantonDaten(kt).faktor + ')', '');
    for (const z of zs) {
      lines.push('<details><summary>' + z + '</summary>', '', '| Brutto | steuerbar Bund | DBG App | ESTV K+G | Modell | Abw. | |', '|---:|---:|---:|---:|---:|---:|:-:|');
      for (const p of zeilen[kt][z]) {
        lines.push('| ' + chf(p.brutto) + ' | ' + chf(p.steuerbar) + ' | ' + chf(p.dbgApp) + ' | ' + chf(p.kug) + ' | ' + (p.modell === null ? '–' : chf(p.modell)) + ' | ' + (p.abw === null ? '–' : pct(p.abw)) + ' | ' + (p.ok ? '✓' : '') + ' |');
      }
      lines.push('', '</details>', '');
    }
  }
  if (eigeneDbgAbweichungen.length) {
    lines.push('## Abweichungen der eigenen Bundessteuer (> CHF 1)', '', '```', ...eigeneDbgAbweichungen.map((a) => JSON.stringify(a)), '```', '');
  }
  writeFileSync(DOC_PATH, lines.join('\n'));
  for (const z of zs) console.log(z, 'belegt:', belegt(z).length, belegt(z).join(' '));
  console.log('DBG-Abweichungen > 1 CHF:', eigeneDbgAbweichungen.length);
}

if (process.argv.includes('--messen')) {
  await messen();
} else {
  const mess = JSON.parse(readFileSync(MESS_PATH, 'utf-8'));
  schreiben(mess, auswerten(mess));
}
