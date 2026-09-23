#!/usr/bin/env node
// Stichprobe: Rechnet der ESTV-Steuerrechner heute noch so wie an unseren gespeicherten Messpunkten?
//
//   node scripts/estv-stichprobe.mjs [--messpunkte <datei>] [--schwelle <CHF>]
//
// Anlass (PR #293, 23.09.2026): Die ESTV hat für TI die Daten des laufenden Steuerjahres geändert
// (CHF 500 höhere Abzüge), ohne dass sich die Versionsangabe der Schnittstelle änderte. Die Tests der
// App prüfen die Interpolation der Tabelle, nicht ihre Aktualität. Diese Stichprobe prüft die Aktualität.
//
// Umfang: 26 Kantone × 2 Zivilstände (ledig, verheiratet) × 3 Bruttolöhne (STICHPROBE_BRUTTO) = 156
// Abrufe, ohne Kinder, seriell mit 150 ms Pause, nur lesend. Gleiche Schnittstelle und gleiche Anfrage
// wie scripts/steuerband-messen.mjs (beide aus scripts/estv-schnittstelle.mjs).
//
// Verglichen wird gegen die GESPEICHERTEN MESSPUNKTE (Standard: steuerfaktor-band-2026.messpunkte.json),
// nicht gegen die interpolierte Tabelle: Die ESTV ist ein Rechner, keine Messung mit Streuung — an
// demselben Punkt liefert sie dieselbe Zahl (belegt am 23.09.: ZH in allen Feldern gleich wie am 16.09.).
// Jede Änderung über der Schwelle (Standard CHF 1, Rundung) ist deshalb eine Änderung der Daten.
//
// Exit-Code:
//   0  alle 156 Abrufe erfolgreich, keine Abweichung über der Schwelle
//   1  alle 156 Abrufe erfolgreich, mindestens eine Abweichung → Kanton nachmessen
//   2  Messung gescheitert oder unvollständig (Netz, Schnittstelle geändert, Gegenprobe beantwortet,
//      Messpunkt fehlt in der Datei, weniger als 156 erfolgreiche Abrufe). Hat Vorrang vor 1 —
//      gefundene Abweichungen werden trotzdem ausgegeben. «0 Abweichungen aus 0 Abrufen» ist 2, nie 0.

import { readFileSync } from 'fs';
import { relative, resolve, dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import {
  MESS_PATH, PAUSE_MS, ORTE, ZIVILSTAND,
  post as postEstv, mitWiederholung, gegenprobeErfundeneOperation, anfrage, pruefeOrt, kantonUndGemeinde,
} from './estv-schnittstelle.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Feste Auswahl aus dem Messraster (BRUTTO in estv-schnittstelle.mjs): tief, mittel, hoch — dieselben
// drei Löhne, die das Quellenblatt als Beispiele je Kanton ausweist.
export const STICHPROBE_BRUTTO = [50000, 80000, 120000];
// Abweichung, ab der ein Punkt als geändert gilt (CHF, strikt grösser). 1 = nur Rundung wird toleriert.
export const SCHWELLE_CHF = 1;
// So viele Abrufe in Folge dürfen scheitern, dann bricht die Stichprobe ab (Netz weg → nicht 156 × warten).
export const ABBRUCH_NACH_FEHLERN_IN_FOLGE = 3;

export const EXIT = { GLEICH: 0, ABWEICHUNG: 1, GESCHEITERT: 2 };

const schluessel = (kt, zs, brutto) => kt + '/' + zs + '/' + brutto;

export function auftraege(orte = ORTE, zivilstaende = ZIVILSTAND, brutto = STICHPROBE_BRUTTO) {
  const liste = [];
  for (const [kt, o] of Object.entries(orte)) {
    for (const [zs, rel] of Object.entries(zivilstaende)) {
      for (const b of brutto) liste.push({ kt, o, zs, rel, brutto: b });
    }
  }
  return liste;
}

// Gespeicherte Messpunkte → Map «KT/zivilstand/brutto» → { steuerbarBund, kug }. Die Spalten werden
// über `spalten` gesucht, nicht über feste Positionen; fehlt eine, wirft die Funktion (→ Exit 2).
export function gespeicherteWerte(mess) {
  if (!mess || !Array.isArray(mess.spalten) || !Array.isArray(mess.punkte)) throw new Error('Messdatei ohne spalten/punkte');
  const idx = (name) => {
    const i = mess.spalten.indexOf(name);
    if (i < 0) throw new Error('Messdatei ohne Spalte ' + name);
    return i;
  };
  const [iKt, iZs, iBrutto, iBund, iKug] = ['kanton', 'zivilstand', 'brutto', 'steuerbarBund', 'kantonUndGemeinde'].map(idx);
  const werte = new Map();
  for (const p of mess.punkte) werte.set(schluessel(p[iKt], p[iZs], p[iBrutto]), { steuerbarBund: p[iBund], kug: p[iKug] });
  return werte;
}

// Ein gemessener Punkt gegen seinen gespeicherten Wert. Abweichend, wenn K+G ODER steuerbares
// Einkommen Bund um mehr als die Schwelle abweicht.
export function vergleichePunkt(alt, neu, schwelle = SCHWELLE_CHF) {
  const dKug = neu.kug - alt.kug;
  const dBund = neu.steuerbarBund - alt.steuerbarBund;
  return {
    abweichend: Math.abs(dKug) > schwelle || Math.abs(dBund) > schwelle,
    kugAlt: alt.kug, kugNeu: neu.kug, dKug, pctKug: alt.kug !== 0 ? dKug / alt.kug : null,
    bundAlt: alt.steuerbarBund, bundNeu: neu.steuerbarBund, dBund,
  };
}

// Ergebnis je Kanton: gleich / abweichend / unvollständig (nicht alle Punkte gemessen oder gespeichert).
export function kantonsBericht(ergebnisse, erwartetJeKanton) {
  const je = new Map();
  for (const e of ergebnisse) {
    if (!je.has(e.kt)) je.set(e.kt, { kt: e.kt, gemessen: 0, abweichungen: [] });
    const k = je.get(e.kt);
    k.gemessen++;
    if (e.vergleich.abweichend) k.abweichungen.push(e);
  }
  return Object.keys(ORTE).map((kt) => {
    const k = je.get(kt) || { kt, gemessen: 0, abweichungen: [] };
    const status = k.abweichungen.length ? 'abweichend' : k.gemessen < erwartetJeKanton ? 'unvollständig' : 'gleich';
    return { ...k, status };
  });
}

export function exitCode({ erwartet, erfolgreich, fehler, abweichungen }) {
  if (erfolgreich === 0 || erfolgreich < erwartet || fehler.length > 0) return EXIT.GESCHEITERT;
  return abweichungen > 0 ? EXIT.ABWEICHUNG : EXIT.GLEICH;
}

// Die Stichprobe selbst. `post` ist austauschbar (Tests ohne Netz); Pause und Wartezeiten ebenso.
export async function stichprobe({ mess, post = postEstv, schwelle = SCHWELLE_CHF, pauseMs = PAUSE_MS, wartezeiten = [5000], liste = auftraege() } = {}) {
  const fehler = [];
  const ergebnisse = [];
  const bericht = (extra) => {
    const abweichungen = ergebnisse.filter((e) => e.vergleich.abweichend).length;
    const erfolgreich = ergebnisse.length;
    const r = { erwartet: liste.length, erfolgreich, abweichungen, fehler, ergebnisse, ...extra };
    return { ...r, exit: exitCode(r) };
  };

  let gespeichert;
  try { gespeichert = gespeicherteWerte(mess); } catch (e) { fehler.push('Messpunkte: ' + e.message); return bericht({}); }
  const fehlend = liste.filter((a) => !gespeichert.has(schluessel(a.kt, a.zs, a.brutto)));
  if (fehlend.length) {
    fehler.push('Messpunkte: ' + fehlend.length + ' Punkte der Stichprobe fehlen in der Datei (z. B. ' + schluessel(fehlend[0].kt, fehlend[0].zs, fehlend[0].brutto) + ')');
    return bericht({});
  }

  // Erreichbarkeit und Gegenprobe vor dem ersten Abruf: Antwortet eine erfundene Operation, unterscheidet
  // das Skript echte Antworten nicht von einer Fehlerseite. Ist die Version nicht abrufbar, ist die
  // Schnittstelle nicht erreichbar oder geändert — dann gar nicht erst 156 Mal fragen.
  const gegenprobe = await gegenprobeErfundeneOperation(post);
  if (gegenprobe !== 'fehlgeschlagen wie erwartet') { fehler.push('Gegenprobe: erfundene Operation ' + gegenprobe); return bericht({ gegenprobe }); }
  let version;
  try { version = await post('API_getTaxVersion', {}); } catch (e) { fehler.push('Schnittstelle nicht erreichbar: API_getTaxVersion → ' + e.message); return bericht({ gegenprobe }); }

  let inFolge = 0;
  for (const a of liste) {
    if (pauseMs) await new Promise((r) => setTimeout(r, pauseMs));
    try {
      const r = await mitWiederholung(() => post('API_calculateDetailedTaxes', anfrage({ ortId: a.o.id, rel: a.rel, brutto: a.brutto })), wartezeiten);
      pruefeOrt(r, a.kt, a.o);
      if (typeof r.TaxableIncomeFed !== 'number' || typeof r.IncomeTaxCanton !== 'number' || typeof r.IncomeTaxCity !== 'number') {
        throw new Error('Antwort ohne Zahlen');
      }
      const neu = { steuerbarBund: r.TaxableIncomeFed, kug: kantonUndGemeinde(r) };
      ergebnisse.push({ kt: a.kt, zs: a.zs, brutto: a.brutto, vergleich: vergleichePunkt(gespeichert.get(schluessel(a.kt, a.zs, a.brutto)), neu, schwelle) });
      inFolge = 0;
    } catch (e) {
      fehler.push(schluessel(a.kt, a.zs, a.brutto) + ': ' + e.message);
      if (++inFolge >= ABBRUCH_NACH_FEHLERN_IN_FOLGE) {
        fehler.push('Abbruch nach ' + inFolge + ' gescheiterten Abrufen in Folge');
        break;
      }
    }
  }
  return bericht({ gegenprobe, version });
}

// ── Ausgabe ──────────────────────────────────────────────────────────────────────────────────────
const chf = (n) => Math.round(n).toLocaleString('de-CH').replace(/[’,]/g, "'");
const vz = (n) => (n > 0 ? '+' : n < 0 ? '−' : '±') + chf(Math.abs(n));
const pct = (x) => (x === null ? '–' : (x > 0 ? '+' : x < 0 ? '−' : '±') + (Math.round(Math.abs(x) * 1000) / 10).toFixed(1) + ' %');

export function textBericht(r, { quelle, beginn, schwelle = SCHWELLE_CHF, mess } = {}) {
  const L = [];
  L.push('ESTV-Stichprobe ' + (beginn || '') + (r.version ? ' · Schnittstelle «' + r.version + '»' : '') + (r.gegenprobe ? ' · Gegenprobe (erfundene Operation): ' + r.gegenprobe : ''));
  if (quelle) {
    const nach = (mess?.nachmessungen || []).map((n) => n.kanton + ' ' + String(n.abgerufen).slice(0, 10)).join(', ');
    L.push('Verglichen mit: ' + quelle + (mess?.abgerufen ? ' (abgerufen ' + String(mess.abgerufen).slice(0, 10) + (nach ? '; nachgemessen ' + nach : '') + ')' : ''));
  }
  L.push('Schwelle: Abweichung > CHF ' + schwelle + ' bei Kantons- + Gemeindesteuer (K+G) oder steuerbarem Einkommen Bund. Löhne: ' + STICHPROBE_BRUTTO.map(chf).join(' · ') + '.');
  L.push('');
  const jeKanton = STICHPROBE_BRUTTO.length * Object.keys(ZIVILSTAND).length;
  const kantone = kantonsBericht(r.ergebnisse, jeKanton);
  for (const k of kantone) {
    L.push((k.kt + ' ' + ORTE[k.kt].ort).padEnd(16) + k.status.padEnd(14) + k.gemessen + '/' + jeKanton);
    for (const e of k.abweichungen) {
      const v = e.vergleich;
      L.push('    ' + e.zs + ' ' + chf(e.brutto) + ': K+G ' + chf(v.kugAlt) + ' → ' + chf(v.kugNeu) + ' (' + vz(v.dKug) + ' CHF, ' + pct(v.pctKug) + ')' +
        (v.dBund !== 0 ? ' · steuerbar Bund ' + chf(v.bundAlt) + ' → ' + chf(v.bundNeu) + ' (' + vz(v.dBund) + ')' : ''));
    }
  }
  L.push('');
  if (r.fehler.length) {
    L.push('Fehler (' + r.fehler.length + '):');
    for (const f of r.fehler.slice(0, 20)) L.push('    ' + f);
    if (r.fehler.length > 20) L.push('    … ' + (r.fehler.length - 20) + ' weitere');
    L.push('');
  }
  const abwKantone = kantone.filter((k) => k.status === 'abweichend');
  L.push('Abrufe erfolgreich: ' + r.erfolgreich + ' von ' + r.erwartet + ' · Abweichungen: ' + r.abweichungen + ' Punkte in ' + abwKantone.length + ' Kantonen');
  for (const k of abwKantone) {
    L.push('Empfehlung ' + k.kt + ': node scripts/steuerband-messen.mjs --messen --kanton ' + k.kt +
      ' && node scripts/steuerband-messen.mjs --messen --kinder --kanton ' + k.kt + ' && node scripts/steuerband-messen.mjs');
  }
  L.push('Ergebnis: ' + (r.exit === EXIT.GLEICH ? 'gleich' : r.exit === EXIT.ABWEICHUNG ? 'ABWEICHUNG' : 'MESSUNG GESCHEITERT — kein Befund über die Aktualität') + ' (Exit ' + r.exit + ')');
  return L.join('\n');
}

// ── Aufruf von der Kommandozeile ────────────────────────────────────────────────────────────────
function argument(name) {
  const i = process.argv.indexOf(name);
  if (i < 0) return null;
  const wert = process.argv[i + 1];
  if (wert === undefined || wert.startsWith('--')) throw new Error(name + ' ohne Wert');
  return wert;
}

async function main() {
  const beginn = new Date().toISOString();
  const pfad = argument('--messpunkte') ? resolve(process.cwd(), argument('--messpunkte')) : MESS_PATH;
  const schwelleArg = argument('--schwelle');
  const schwelle = schwelleArg === null ? SCHWELLE_CHF : Number(schwelleArg);
  if (!(schwelle >= 0)) throw new Error('--schwelle muss eine Zahl ≥ 0 sein');
  // Nur für die Gegenprobe «Netz weg»: andere Adresse für die Schnittstelle.
  const api = argument('--api');
  const post = api ? (op, body) => postEstv(op, body, { api }) : postEstv;

  let mess = null;
  try { mess = JSON.parse(readFileSync(pfad, 'utf-8')); } catch (e) { console.error('Messpunkte nicht lesbar: ' + pfad + ' (' + e.message + ')'); }
  const r = await stichprobe({ mess, post, schwelle });
  const quelle = pfad.startsWith(resolve(__dirname, '..')) ? relative(resolve(__dirname, '..'), pfad) : pfad;
  console.log(textBericht(r, { quelle, beginn, schwelle, mess }));
  console.log('Ende: ' + new Date().toISOString());
  process.exitCode = r.exit;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch((e) => {
    console.error('Stichprobe abgebrochen: ' + e.message);
    console.error('Ergebnis: MESSUNG GESCHEITERT (Exit 2)');
    process.exitCode = EXIT.GESCHEITERT;
  });
}
