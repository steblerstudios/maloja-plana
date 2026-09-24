// Gemeinsame Anbindung an den ESTV-Steuerrechner (swisstaxcalculator.estv.admin.ch) für die
// Entwickler-Skripte. Eine Quelle für Adresse, Orte, Lohnraster und Anfrage — damit Messung
// (scripts/steuerband-messen.mjs) und Stichprobe (scripts/estv-stichprobe.mjs) nachweislich
// dieselbe Frage stellen. Die App selbst importiert diese Datei nicht und bleibt ohne Netz.

import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const API = 'https://swisstaxcalculator.estv.admin.ch/delegate/ost-integration/v1/lg-proxy/operation/c3b67379_ESTV/';
export const STEUERJAHR = 2026;

// Messdatei ohne Kinder (E37) — Rohwerte je Kanton × Zivilstand × Bruttolohn.
export const MESS_PATH = resolve(__dirname, '../docs/sources/steuerfaktor-band-2026.messpunkte.json');

// Den amtlichen Server schonen: ein Abruf nach dem anderen, mit dieser Pause dazwischen.
export const PAUSE_MS = 150;

// TaxLocationID aus API_searchLocation (Suche nach dem Hauptort, Kanton geprüft), BFS-Nummer zur Kontrolle.
export const ORTE = {
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
export const BRUTTO = [];
for (let b = 20000; b <= 150000; b += 2500) BRUTTO.push(b);
for (let b = 160000; b <= 300000; b += 10000) BRUTTO.push(b);

export const ZIVILSTAND = { ledig: 1, verheiratet: 2 };

// Ein Aufruf der Schnittstelle. `fetchFn` nur für Tests austauschbar, `api` nur für die
// Gegenprobe «Netz weg» der Stichprobe.
export async function post(op, body, { fetchFn = fetch, api = API } = {}) {
  const res = await fetchFn(api + op, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(op + ' HTTP ' + res.status);
  const json = await res.json();
  if (!json || !json.response) throw new Error(op + ' ohne response');
  return json.response;
}

// Ein kurzer Aussetzer der Quelle soll nicht den ganzen Lauf beenden: neue Versuche mit den
// angegebenen Wartezeiten (Standard 5 und 20 Sekunden). Danach wird der Fehler weitergereicht.
export async function mitWiederholung(fn, wartezeiten = [5000, 20000]) {
  for (const warten of [...wartezeiten, null]) {
    try { return await fn(); } catch (e) {
      if (warten === null) throw e;
      console.warn('Abruf fehlgeschlagen (' + e.message + '), neuer Versuch in', warten / 1000, 's');
      await new Promise((r) => setTimeout(r, warten));
    }
  }
}

// Gegenprobe: eine erfundene Operation muss scheitern, sonst unterscheidet das Skript echte
// Antworten nicht von einer Fehlerseite. Liefert den Befund als Text.
export async function gegenprobeErfundeneOperation(postFn = post) {
  try { await postFn('API_gibtEsNicht_' + Date.now(), {}); return 'UNERWARTET beantwortet'; } catch { return 'fehlgeschlagen wie erwartet'; }
}

// Messanlage: Steuerjahr 2026, Kantonshauptort, unselbständig erwerbend, Alter 40, Konfession
// «andere/keine», kein Vermögen; verheiratet = Alleinverdiener. Kinder je `kinderalter` Jahre.
export function anfrage({ ortId, rel, brutto, kinder = 0, kinderalter = 8 }) {
  return {
    SimKey: null, TaxYear: STEUERJAHR, TaxLocationID: ortId, Relationship: rel,
    Confession1: 4, Children: Array.from({ length: kinder }, () => ({ Age: kinderalter })),
    Age1: 40, RevenueType1: 1, Revenue1: brutto, Fortune: 0,
    Confession2: rel === 2 ? 4 : 0, Age2: rel === 2 ? 40 : 0, RevenueType2: 0, Revenue2: 0, Budget: [],
  };
}

// Antwort am richtigen Ort? Wirft, wenn die ESTV einen anderen Kanton oder eine andere Gemeinde rechnet.
export function pruefeOrt(r, kt, o) {
  if (r.Location && (r.Location.Canton !== kt || r.Location.BfsID !== o.bfs)) {
    throw new Error('Ort passt nicht: ' + kt + ' ' + JSON.stringify(r.Location));
  }
}

// Kantons- und Gemeindesteuer auf dem Einkommen inkl. Personal-/Kopfsteuer, ohne Kirche.
export const kantonUndGemeinde = (r) => r.IncomeTaxCanton + r.IncomeTaxCity + (r.PersonalTax || 0);
