// ─── Kantonsseiten · Prämienverbilligung je Kanton ───────────────────────────
//
// Bauplan: docs/roadmap/BAUPLAN-kantonsseiten-2026-11.md (Entscheide E1–E4 vom
// 09.11.2026). Welle 1, PR 2: drei Pilotkantone (ZH, BE, TG), je einer für jeden
// Weg (Antrag bei der SVA · in der Regel von Amtes wegen · Antrag bei der Gemeinde).
//
// Was hier steht und was nicht:
//   • Die Seiten folgen der Regel der Erklärseiten: KEINE Beträge, Fristen,
//     Einkommensgrenzen, Prozentsätze. Wo die Quelle eine Grenze oder Frist nennt,
//     sagt die Seite, DASS es sie gibt und wo sie steht, und nennt die Zahl nicht.
//   • Jeder Satz stammt aus einer Primärquelle des Kantons. Die Stelle steht als
//     Kommentar daneben. Abgeglichen am 09.11.2026 (Fachprüfung, alle Quellen neu
//     abgerufen): BE Informationsblatt 2026 · TG Merkblatt IPV 2026, TG KVG
//     (RB 832.1), TG KVV (RB 832.10) · ZH Kundeninformation 2026 der SVA, EG KVG
//     (LS 832.01). Ältere Fassung der Texte: Commit a5779dad (zu knapp, siehe PR).
//   • Link aufs Amt und Prüfdatum des Links kommen aus den Daten der App
//     (CANTONAL_LINKS, CANTONAL_LINKS_GEPRUEFT), der Weg wird gegen CANTONAL_IPV
//     geprüft. Eine Seite und die App können so nicht Verschiedenes sagen.
//
// Riegel 1 (Bauplan §4): Eine Kantonsseite entsteht nur, wenn der Text hier
// steht UND CANTONAL_IPV einen Beleg hat UND der ipv-Link ein Prüfdatum trägt.
// Fehlt eines, wirft der Generator — still auslassen wäre die schlechtere Wahl,
// weil dann ein Kanton unbemerkt aus der Liste fiele.
// ─────────────────────────────────────────────────────────────────────────────

import { readFileSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { CANTONAL_IPV, IPV_MODULE } from '../../src/config/cantonalData.js';
import { CANTONAL_LINKS, CANTONAL_LINKS_GEPRUEFT } from '../../src/data/direktLinks.js';

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');

// Der Weg, wie er auf der Seite heisst. Farbe nach Entscheid E4 / Farbrollen:
// Gold = handeln, Heidelbeere (Blau) = informieren. Immer mit Wort und Zeichen.
export const WEGE = {
  antrag: { label: 'Antrag nötig' },
  automatisch: { label: 'In der Regel von Amtes wegen' },
};

// Welcher noteKey der App zu welchem Weg gehört. Der Generator und der Test
// prüfen, dass jede Kantonsseite denselben Weg nennt wie die App.
export const WEG_AUS_NOTEKEY = (noteKey) => {
  if (/^ipv\.noteApply/.test(noteKey)) return 'antrag';
  if (/^ipv\.noteAuto/.test(noteKey)) return 'automatisch';
  if (noteKey === 'ipv.geWegAutomatisch') return 'automatisch';
  return null;
};


// Texte je Kanton: scripts/seiten/ipv-kantone/<KT>.mjs, eine Datei je Kanton. Fehlt
// die Datei, gibt es für den Kanton keine Seite (z. B. BL und VS: Amtslinks ungeprüft).
// Reihenfolge der Kantone wie in der Bundesverfassung, Art. 1.
export const KANTONSFOLGE = ['ZH', 'BE', 'LU', 'UR', 'SZ', 'OW', 'NW', 'GL', 'ZG', 'FR', 'SO', 'BS', 'BL',
  'SH', 'AR', 'AI', 'SG', 'GR', 'AG', 'TG', 'TI', 'VD', 'VS', 'NE', 'GE', 'JU'];
const ORDNER = resolve(dirname(fileURLToPath(import.meta.url)), 'ipv-kantone');
const vorhanden = new Set(readdirSync(ORDNER).filter((f) => /^[A-Z]{2}\.mjs$/.test(f)).map((f) => f.slice(0, 2)));
const TEXTE = {};
for (const k of KANTONSFOLGE) {
  if (vorhanden.has(k)) TEXTE[k] = (await import(pathToFileURL(resolve(ORDNER, `${k}.mjs`)).href)).default;
}

// Rechnet die App für diesen Kanton einen Betrag? Abgeleitet aus dem Rechenmodul,
// nicht von Hand: Ein Modul, das nie einen Betrag zeigt (TG, JU, SO), sagt es in
// seinem Kopf mit «🛑 … KEINE ZAHL» bzw. «… FÜR KEINE PERSON EINEN BETRAG». Dass die
// Datei existiert, reicht NICHT (ipvThurgau.js existiert und zeigt nie eine Zahl).
// Rechtsprüfung 09.11.2026, Art. 3 Abs. 1 lit. b UWG: «rechnet» nur, wo es stimmt.
export const OHNE_BETRAG = /🛑[^\n]*(KEINE ZAHL|FÜR KEINE PERSON EINEN BETRAG)/;
// Aus dem Quelltext von IPV_MODULE gelesen, nicht aus laden.toString(): Vitest schreibt
// den Funktionstext um (gemessen 09.11.2026, dort kam null zurück).
const CANTONAL_DATA_QUELLE = readFileSync(resolve(WURZEL, 'src', 'config', 'cantonalData.js'), 'utf8');
export function rechenmodul(k) {
  if (!IPV_MODULE[k]) return null;
  const m = new RegExp(`^\\s*${k}: \\{ laden: \\(\\) => import\\('\\./(ipv[A-Za-z]+\\.js)'\\)`, 'm').exec(CANTONAL_DATA_QUELLE);
  return m ? m[1] : null;
}
export function appRechnetFuer(k) {
  const datei = rechenmodul(k);
  if (!datei) return false;
  const kopf = readFileSync(resolve(WURZEL, 'src', 'config', datei), 'utf8').split('\n').slice(0, 15).join('\n');
  return !OHNE_BETRAG.test(kopf);
}

const MONATE = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August',
  'September', 'Oktober', 'November', 'Dezember'];
// '2026-11-09' → 'November 2026'
export function monatJahr(iso) {
  const m = /^(\d{4})-(\d{2})-\d{2}$/.exec(iso || '');
  if (!m) throw new Error(`Kein Datum in «${iso}»`);
  return `${MONATE[Number(m[2]) - 1]} ${m[1]}`;
}

export const KANTONSSEITEN = Object.entries(TEXTE).map(([k, t]) => {
  const ipv = CANTONAL_IPV[k];
  if (!ipv || !ipv.beleg || !ipv.beleg.quelle) throw new Error(`Kantonsseite ${k}: CANTONAL_IPV ohne Beleg`);
  const link = (CANTONAL_LINKS[k] || {}).ipv;
  const linkGeprueft = (CANTONAL_LINKS_GEPRUEFT[k] || {}).ipv;
  if (!link || !linkGeprueft) throw new Error(`Kantonsseite ${k}: ipv-Link fehlt oder ist ungeprüft`);
  const appWeg = WEG_AUS_NOTEKEY(ipv.noteKey);
  if (appWeg !== t.weg) throw new Error(`Kantonsseite ${k}: Weg «${t.weg}» ≠ App «${appWeg}» (${ipv.noteKey})`);
  return {
    kanton: k,
    ...t,
    pfad: `praemienverbilligung/${t.slug}`,
    // Lange Namen (Appenzell Ausserrhoden …) sprengen sonst die 65 Zeichen des <title>.
    titel: t.titel || `Prämienverbilligung im Kanton ${t.name}`,
    brotkrume: `Kanton ${t.name}`,
    beschreibung: `Prämienverbilligung im Kanton ${t.name}: ob Sie einen Antrag stellen müssen, welche Stelle zuständig ist und was hier anders ist als anderswo.`,
    link,
    appRechnet: appRechnetFuer(k),
    geprueft: monatJahr(t.abgeglichen),
  };
});
