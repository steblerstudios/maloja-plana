// ─── Hintergrundseite: Kantonsatlas ──────────────────────────────────────────
//
// Der Maloja-Kantonsatlas als Erklärseite vor dem Gate (Weg A). Entscheid von
// Stebler Studios am 06.11.2026: Der Atlas ist kein eigenes Produkt, er gehört
// mit den Erklärseiten zu Maloja. Das private Artefakt bleibt nur Vorschau.
// Vorlage und Entscheide E1–E6: stebler-studios/ENTSCHEID-VORLAGE-kantonsatlas-
// befunde-petitionen-2026-11.md (ausserhalb dieses Repos).
//
// Arbeitsteilung mit /kantone-im-vergleich/: Dort stehen die Zahlen im Text,
// in Tabellen und als Zusammenhänge. Hier stehen sie als Karten. Ebenen,
// Formate und Tabellen kommen aus scripts/seiten-vergleich.mjs, damit beide
// Seiten nie Verschiedenes sagen.
//
// Anders als die Atlas-Vorschau:
//   • kein Skript (Riegel in hintergrundSeiten.test.js): Jede Karte ist beim
//     Bauen gezeichnet, die Werte stehen in einer Tabelle darunter;
//   • Abschnitte nach Thema (wie die Kapitel), dazu die vier Brillen aus dem
//     Entscheid vom 24.10.2026 als Wegweiser (Stebler Studios 07.11.2026:
//     «Brillen zurück»);
//   • keine Ebenen und Texte zu Datenspenden: Die gibt es in Maloja nicht,
//     also verspricht die Seite sie auch nicht;
//   • Befunde (E3) als eigener Abschnitt, nur belegte (siehe BEFUNDE_ABSCHNITT).
//
// Regeln aus dem Atlas-Entscheid vom 24.10.2026: keine Rangliste, keine
// Wertungsfarben. Jede Karte hat eine einzige Farbe in vier Stufen; dunkler (im dunklen Modus: heller)
// heisst «höhere Zahl», nicht «besser» oder «schlechter».
// Welche Farbe: die Frucht des Lebensbereichs (Brand Book, farb-und-daten-system.md Regel 3), seit
// 09.11.2026. Ausnahme Steuern und Familie: Aprikose liegt auf Gold («finanziell enger»), Kirsche auf
// Rosé (harte Schwelle); dort gilt Regel 1 vor Regel 3, die Karten nehmen Zwetschge (Behörden).
// ─────────────────────────────────────────────────────────────────────────────

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import de from '../../src/i18n/de.js';
import { EBENEN, KANTONE, BLOECKE_VERGLEICH, KITA_NICHT_VERGLICHEN, ATLAS_DATEN } from '../seiten-vergleich.mjs';
import { getMindestlohn } from '../../src/data/lohnCheck.js';
import { KANTONE_IM_VERGLEICH } from './kantone-im-vergleich.mjs';
import { zahlen as zahlenKrankenkasse } from '../seiten-figuren.mjs';
import { vergleichZahlen } from '../seiten-vergleich.mjs';
import { appBeispiel } from '../seiten-ziele.mjs';
import { streifenLage, beschriftungsLage } from '../../src/data/punktStreifen.js';

const GEO = JSON.parse(readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), '..', 'daten', 'kantonsatlas', 'paths.json'), 'utf8'));
for (const k of KANTONE) if (!GEO.cantons[k]) throw new Error(`Kantonsatlas-Karte: ${k} fehlt in paths.json`);

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// ─── Farbe je Karte: die Frucht des Lebensbereichs ──────────────────────────
// Vier Stufen je Frucht, gleicher Farbton, nach Leuchtdichte gleichmässig verteilt (Nachbarn hell
// etwa 1,66 · 1,66 · 1,9, dunkel etwa 2,2 · 2,2 · 1,9). Stufe 3 der Heidelbeere ist --heidel.
// Die Stufen der anderen Früchte haben dieselbe Leuchtdichte wie die der Heidelbeere, damit alle
// Karten gleich gelesen werden. Wächter: src/__tests__/atlasStufenAbstand.test.js
export const KARTEN_FRUCHT = {
  praemie: 'heidelbeere', lastNachIpv: 'heidelbeere', // Versicherungen
  miete: 'birne', leer: 'birne',                      // Wohnen
  alq: 'haselnuss', mindestlohn: 'haselnuss',         // Arbeit
  alimente: 'zwetschge',                              // Familie, Ausnahme wie Kinderzulage
  el: 'traube',                                       // Vorsorge
  sozialhilfe: 'zwetschge',                           // Behörden
  steuer: 'zwetschge', kinderzulage: 'zwetschge', kita: 'zwetschge', // Ausnahme, siehe Kopf
};
export const FRUCHT_STUFEN = {
  heidelbeere: { hell: ['#D3DEE9', '#98AFC4', '#6787A5', '#3D5A76'], dunkel: ['#2E3742', '#576A7D', '#86A6C2', '#D3E0EC'] },
  birne:       { hell: ['#D6E0CA', '#A1B387', '#748C4B', '#4A5E1F'], dunkel: ['#2F391E', '#5C6E3B', '#90AC5D', '#D6E3C3'] },
  haselnuss:   { hell: ['#E6DBCE', '#BEA98F', '#9C7F57', '#6D522D'], dunkel: ['#3F3426', '#78654A', '#BB9D73', '#E9DCCB'] },
  traube:      { hell: ['#E0DBE8', '#B3A7C2', '#8D7CA2', '#605174'], dunkel: ['#393440', '#6E647B', '#AB9BC0', '#E2DCEB'] },
  zwetschge:   { hell: ['#D9DDE2', '#A5ADB8', '#7A8593', '#4F5966'], dunkel: ['#32373D', '#616874', '#98A4B5', '#DADFE6'] },
};
const stufenVars = (s) => s.map((c, i) => `--k${i + 1}:${c}`).join('; ');
const FRUCHT_CSS_HELL = Object.entries(FRUCHT_STUFEN).map(([f, s]) => `    .atlas .f-${f}{ ${stufenVars(s.hell)} }`).join('\n');
const FRUCHT_CSS_DUNKEL = Object.entries(FRUCHT_STUFEN).map(([f, s]) => `      .atlas .f-${f}{ ${stufenVars(s.dunkel)} }`).join('\n');

// ─── Stufen: vier gleich grosse Gruppen von Kantonen ────────────────────────
// Nach dem Wert sortiert, in Viertel geteilt. Gleiche Werte bleiben in
// derselben Stufe, darum sind die Stufen nicht immer gleich gross und eine
// kann auch leer bleiben. Keine Platzziffer, nur die Spanne.
export function stufen(key) {
  const reihe = KANTONE.map((k) => ({ k, v: EBENEN[key].wert(k) })).sort((a, b) => a.v - b.v);
  const stufe = {};
  reihe.forEach(({ k, v }, i) => {
    const erster = reihe.findIndex((r) => r.v === v);
    stufe[k] = Math.floor((erster * 4) / reihe.length) + 1;
  });
  const spannen = [1, 2, 3, 4].map((s) => {
    const vs = reihe.filter(({ k }) => stufe[k] === s).map((r) => r.v);
    return vs.length ? { s, min: Math.min(...vs), max: Math.max(...vs), n: vs.length } : null;
  }).filter(Boolean);
  return { stufe, spannen };
}

// ─── Punktstreifen: die Brücke zur App ───────────────────────────────────────
// Entscheid 5 der Instrumente-Matrix, Probe mit der Miete (Stebler Studios 18.11.2026). Dieselbe Lage
// (src/data/punktStreifen.js) zeichnet das Werkzeug Mietbeiträge, dort mit dem eigenen Kanton markiert.
// Die Karte bleibt darunter: Sie sagt «wo», der Streifen «wie weit auseinander».
export const STREIFEN_KARTEN = ['miete'];

export function streifenFuer(key) {
  const E = EBENEN[key];
  const { stufe } = stufen(key);
  return streifenLage({ werte: Object.fromEntries(KANTONE.map((k) => [k, E.wert(k)])), ch: E.ch, stufe });
}

function streifenSvg(key) {
  const id = `streifen-${key.toLowerCase()}`;
  const E = EBENEN[key];
  const L = streifenFuer(key);
  const punkte = L.punkte.map((p) => `<g><title>${esc(`${de.cantons[p.k]}: ${E.fmt(p.v)}`)}</title><circle cx="${p.x}" cy="${p.y}" r="${L.radius}" class="k${p.s}"/></g>`).join('');
  const ch = L.ch ? `<line x1="${L.ch.x}" y1="1" x2="${L.ch.x}" y2="${L.hoehe - 1}" class="streifen-ch"/>` : '';
  const beschreibung = `Jeder Punkt ist ein Kanton. Am günstigsten ${de.cantons[L.minK]} mit ${E.fmt(L.min)}, am teuersten ${de.cantons[L.maxK]} mit ${E.fmt(L.max)} ${E.einheit}${L.ch ? `, der Strich zeigt die ganze Schweiz mit ${E.fmt(L.ch.v)}` : ''}. Die Farbe ist dieselbe Stufe wie auf der Karte. Die Werte jedes Kantons stehen in der Tabelle bei der Karte.`;
  // Namen direkt an den Punkten, als Text unter dem Bild (im SVG wären sie auf dem Handy unter 13 px).
  // Die Lage rechnet beschriftungsLage, dieselbe Funktion wie in der App.
  const marke = (x, inhalt) => {
    const B = beschriftungsLage(x, L.breite);
    const stil = B.ausrichtung === 'rechts' ? `right:${runde1(100 - B.prozent)}%` : `left:${B.prozent}%`;
    return `<span class="streifen-marke streifen-${B.ausrichtung}" style="${stil}">${inhalt}</span>`;
  };
  return `<p class="streifen-satz">Jeder Punkt ist ein Kanton. Links die günstigste Miete, rechts die teuerste.</p>` +
    `<svg viewBox="0 0 ${L.breite} ${L.hoehe}" role="img" aria-labelledby="${id}-t ${id}-d" focusable="false">` +
    `<title id="${id}-t">${esc(`Streifen: ${E.titel}`)}</title><desc id="${id}-d">${esc(beschreibung)}</desc>` +
    `<line x1="${L.xMin}" y1="${L.achseY}" x2="${L.xMax}" y2="${L.achseY}" class="streifen-achse"/>${ch}${punkte}</svg>` +
    `<p class="streifen-namen" aria-hidden="true">` +
    marke(L.xMin, `${esc(de.cantons[L.minK])} ${esc(E.fmt(L.min))}`) +
    (L.ch ? marke(L.ch.x, `Schweiz ${esc(E.fmt(L.ch.v))}`) : '') +
    marke(L.xMax, `${esc(de.cantons[L.maxK])} ${esc(E.fmt(L.max))}`) + `</p>`;
}
const runde1 = (n) => Math.round(n * 10) / 10;

// ─── Eine Karte ──────────────────────────────────────────────────────────────
// Die Kantonsformen stehen einmal in der ersten Karte (<defs>), alle weiteren
// Karten verweisen mit <use> darauf. So bleibt die Seite leicht.
function karte(ctx, key, { legende, nachher = '' }) {
  ctx.abb += 1;
  const E = EBENEN[key];
  const frucht = KARTEN_FRUCHT[key];
  if (!FRUCHT_STUFEN[frucht]) throw new Error(`Kantonsatlas: Karte ${key} hat keine Frucht (KARTEN_FRUCHT)`);
  const { stufe, spannen } = stufen(key);
  const id = `karte-${key.toLowerCase()}`;
  const erste = !ctx.kartenDefs;
  ctx.kartenDefs = true;
  const defs = erste
    ? `<defs>${KANTONE.map((k) => `<path id="ka-${k}" d="${GEO.cantons[k].d}"/>`).join('')}${GEO.lakes.map((d, i) => `<path id="ka-see-${i}" d="${d}"/>`).join('')}</defs>`
    : '';
  // Je Kanton Name und Wert als <title>: erscheint beim Darüberfahren mit der Maus, ohne Skript
  // (Durchgang 07.11.2026: auf den Karten stand kein Kantonsname). Vorlesen bleibt bei der Tabelle,
  // weil role="img" die Kinder für Screenreader zusammenfasst.
  const flaechen = KANTONE.map((k) => `<g><title>${esc(`${de.cantons[k]}: ${E.fmt(E.wert(k))}`)}</title><use href="#ka-${k}" class="k${stufe[k]}"/></g>`).join('');
  const seen = GEO.lakes.map((_, i) => `<use href="#ka-see-${i}" class="see"/>`).join('');
  const spanne = (s) => s.min === s.max ? E.fmt(s.min) : `${E.fmt(s.min)} bis ${E.fmt(s.max)}`;
  const titel = `Karte: ${E.titel}`;
  const tiefK = KANTONE.find((k) => E.wert(k) === spannen[0].min);
  const hochK = KANTONE.find((k) => E.wert(k) === spannen[spannen.length - 1].max);
  const beschreibung = `Die 26 Kantone, eingefärbt in ${spannen.length} Stufen nach ${E.titel} (${E.einheit}), von den tieferen zu den höheren Zahlen. Am tiefsten im Kanton ${de.cantons[tiefK]} mit ${E.fmt(spannen[0].min)}, am höchsten im Kanton ${de.cantons[hochK]} mit ${E.fmt(spannen[spannen.length - 1].max)}. Die Werte jedes Kantons stehen in der Tabelle bei der Karte.`;
  const svg = `<svg viewBox="0 0 ${GEO.w} ${GEO.h}" role="img" aria-labelledby="${id}-t ${id}-d" focusable="false">` +
    `<title id="${id}-t">${esc(titel)}</title><desc id="${id}-d">${esc(beschreibung)}</desc>${defs}${flaechen}${seen}</svg>`;
  // Einheit über der Legende, damit die Spannen nicht ohne Mass dastehen.
  const schweiz = E.ch != null ? `Ganze Schweiz: ${E.fmt(E.ch)}` : '';
  // Brillen als Filter (A, Brückenstück 09.11.2026): Welche Brillen diese Karte zeigen, steht an der figure.
  // Ist eine andere Brille gewählt, klappt die Karte auf eine Zeile zu; «Karte zeigen» springt zu ihr und
  // hebt damit den Filter auf (ohne Skript, nur :target).
  const brillen = BRILLEN.filter((b) => b.karten.includes(key));
  const zu = `
          <p class="atlas-zu">${esc(E.titel)}: zugeklappt, gehört nicht zur gewählten Brille. <a href="#${id}">Karte zeigen<span class="sr-only">: ${esc(E.titel)}</span></a></p>`;
  // Weg in die App (C): zum Werkzeug, das mit den eigenen Angaben rechnet. Nur wo es eines gibt.
  // ?beispiel: ohne Zugangscode öffnet sich das Beispiel direkt (BetaGate), mit Zugang die eigene App.
  // Wortlaut nach der Copy-Prüfung 09.11.2026: das Werkzeug beim Namen, keine «eigene Lage» versprechen.
  const W = KARTE_WERKZEUG[key];
  const weiter = W ? `
          <p class="atlas-weiter"><a href="${appBeispiel(W.view)}">Mit Ihren Angaben rechnen: ${esc(W.name)}</a> <span>Ohne Zugangscode öffnet sich das Beispiel.</span></p>` : '';
  return `
        <figure class="abb atlas" id="${id}" data-brillen="${brillen.map((b) => b.id).join(' ')}">${zu}
          <div class="abb-karte f-${frucht}">
            <p class="abb-kopf" aria-hidden="true"><span>Abb. ${ctx.abb}</span><span>${esc(E.titel)}</span></p>${STREIFEN_KARTEN.includes(key) ? `
            <div class="atlas-streifen">${streifenSvg(key)}</div>
            <p class="atlas-einheit">${esc(E.einheit)}. Darunter dieselben Zahlen als Karte.</p>` : ''}
            <div class="abb-bild">${svg}</div>
            <p class="atlas-einheit">${esc(E.einheit)}</p>
            <ul class="atlas-legende" role="list">${spannen.map((s, i) => `<li><i class="k${s.s}" aria-hidden="true"></i><span class="sr-only">Stufe ${i + 1} von ${spannen.length}${i === 0 ? ', tiefste Zahlen' : i === spannen.length - 1 ? ', höchste Zahlen' : ''}: </span>${spanne(s)}</li>`).join('')}</ul>
            ${schweiz ? `<p class="abb-fuss"><span class="abb-wert">${schweiz}</span></p>` : ''}
          </div>
          <figcaption><strong>Abb. ${ctx.abb}.</strong> ${legende}</figcaption>${weiter}${nachher}
        </figure>`;
}

// ─── Mindestlohn: zwei Arten statt vier Stufen ──────────────────────────────
// Entscheid Stebler Studios 14.11.2026 («Eigene Form je Ebene»): Nur fünf Kantone kennen einen
// kantonalen Mindestlohn, vier Stufen über 26 Kantone gäbe es nicht. Die Karte zeigt darum nur
// «Mindestlohn» oder «keiner», die Beträge stehen in der Tabelle. Werte aus der App (src/data/lohnCheck.js,
// am Volltext der Kantonsquellen geprüft), Stand 2026: Die Seite rechnet nicht mit dem Baudatum.
const MINDESTLOHN_STICHTAG = new Date('2026-07-01T12:00:00');
export const MINDESTLOHN = Object.fromEntries(KANTONE.map((k) => [k, getMindestlohn(k, MINDESTLOHN_STICHTAG)]).filter(([, v]) => v));
const MINDESTLOHN_ANGABE = {
  GE: { quelle: 'mlGe', hinweis: 'jährlich an die Teuerung angepasst' },
  NE: { quelle: 'mlNe', hinweis: 'jährlich an die Teuerung angepasst' },
  BS: { quelle: 'mlBs', hinweis: 'jährlich an Teuerung und Löhne angepasst' },
  JU: { quelle: 'mlJu', hinweis: 'Anpassung entscheidet die Regierung' },
  TI: { quelle: 'mlTi', hinweis: 'je nach Branche 20.00 bis 20.50 Fr.' },
};
for (const k of Object.keys(MINDESTLOHN)) if (!MINDESTLOHN_ANGABE[k]) throw new Error(`Kantonsatlas: Mindestlohn ${k} ohne Angabe`);
const rp2 = (n) => Number(n).toFixed(2);
const mlText = (k) => (MINDESTLOHN[k] ? `${rp2(MINDESTLOHN[k].chfStunde)} Fr. pro Stunde` : 'kein kantonaler Mindestlohn');
// Stufe 4 für «mit»: k1 gegen k3 trug hell nur 2,75:1 (a11y-Prüfung 16.11.2026), k1 gegen k4 trägt über 3:1.
export const MINDESTLOHN_STUFE = (k) => (MINDESTLOHN[k] ? 4 : 1);

function karteMindestlohn(ctx) {
  ctx.abb += 1;
  const key = 'mindestlohn';
  const id = 'karte-mindestlohn';
  const mit = KANTONE.filter((k) => MINDESTLOHN[k]);
  const flaechen = KANTONE.map((k) => `<g><title>${esc(`${de.cantons[k]}: ${mlText(k)}`)}</title><use href="#ka-${k}" class="k${MINDESTLOHN_STUFE(k)}"/></g>`).join('');
  const seen = GEO.lakes.map((_, i) => `<use href="#ka-see-${i}" class="see"/>`).join('');
  const beschreibung = `Die 26 Kantone in zwei Gruppen: ${mit.length} Kantone mit kantonalem Mindestlohn (${mit.map((k) => de.cantons[k]).join(', ')}), die übrigen ohne. Die Beträge stehen in der Tabelle bei der Karte.`;
  const svg = `<svg viewBox="0 0 ${GEO.w} ${GEO.h}" role="img" aria-labelledby="${id}-t ${id}-d" focusable="false">` +
    `<title id="${id}-t">Karte: Kantonaler Mindestlohn</title><desc id="${id}-d">${esc(beschreibung)}</desc>${flaechen}${seen}</svg>`;
  const brillen = BRILLEN.filter((b) => b.karten.includes(key));
  const zeilen = KANTONE.filter((k) => MINDESTLOHN[k]).map((k) =>
    `              <tr><th scope="row">${de.cantons[k]}</th><td class="n">${rp2(MINDESTLOHN[k].chfStunde)}</td><td>${MINDESTLOHN_ANGABE[k].hinweis} [[q:${MINDESTLOHN_ANGABE[k].quelle}]]</td></tr>`).join('\n');
  return `
        <figure class="abb atlas" id="${id}" data-brillen="${brillen.map((b) => b.id).join(' ')}">
          <p class="atlas-zu">Kantonaler Mindestlohn: zugeklappt, gehört nicht zur gewählten Brille. <a href="#${id}">Karte zeigen<span class="sr-only">: Kantonaler Mindestlohn</span></a></p>
          <div class="abb-karte f-${KARTEN_FRUCHT[key]}">
            <p class="abb-kopf" aria-hidden="true"><span>Abb. ${ctx.abb}</span><span>Kantonaler Mindestlohn</span></p>
            <div class="abb-bild">${svg}</div>
            <p class="atlas-einheit">Kanton mit oder ohne eigenen Mindestlohn</p>
            <ul class="atlas-legende" role="list"><li><i class="k4" aria-hidden="true"></i>mit kantonalem Mindestlohn (${mit.length})</li><li><i class="k1" aria-hidden="true"></i>ohne (${KANTONE.length - mit.length})</li></ul>
          </div>
          <figcaption><strong>Abb. ${ctx.abb}.</strong> ${LEGENDE.mindestlohn}</figcaption>${KARTE_WERKZEUG.mindestlohn ? `
          <p class="atlas-weiter"><a href="${appBeispiel(KARTE_WERKZEUG.mindestlohn.view)}">Mit Ihren Angaben rechnen: ${esc(KARTE_WERKZEUG.mindestlohn.name)}</a> <span>Ohne Zugangscode öffnet sich das Beispiel.</span></p>` : ''}
          <details class="atlas-werte">
            <summary>Mindestlohn je Kanton als Tabelle</summary>
            <div class="tabelle zahlen" tabindex="0" role="region" aria-label="Kantonaler Mindestlohn 2026"><table>
              <caption>Kantonaler Mindestlohn 2026, in Franken pro Stunde, brutto, alphabetisch</caption>
              <tr><th scope="col">Kanton</th><th scope="col" class="n">Fr. pro Stunde</th><th scope="col">Hinweis</th></tr>
${zeilen}
            </table></div>
          </details>
        </figure>`;
}

// Alimente: Kantone, deren Höchstbetrag laut Daten an die höchste AHV-Waisenrente gekoppelt ist (Feld `bezug`),
// nicht bloss gleich hoch (Fachprüfung 16.11.2026: vorher über chf === 1008 gezählt).
export const ALIMENTE_GEKOPPELT = KANTONE.filter((k) => /waise|orphelin/i.test(ATLAS_DATEN.alimente[k].bezug) && ATLAS_DATEN.alimente[k].chf === 1008);
const und = (xs) => (xs.length > 1 ? `${xs.slice(0, -1).join(', ')} und ${xs[xs.length - 1]}` : xs[0]);

// ─── Feiertage: Tabelle statt Karte ─────────────────────────────────────────
// 23 Kantone haben neun dem Sonntag gleichgestellte Feiertage, drei haben acht (Atlas, SECO-Stand
// 12.12.2024): Eine Karte zeigte fast nur eine Farbe. Darum ein Satz und eine aufklappbare Tabelle.
const F = ATLAS_DATEN.feiertage;
export function feiertageBlock() {
  const anzahl = [...new Set(KANTONE.map((k) => F[k].n))].sort((a, b) => a - b);
  const mit = (n) => KANTONE.filter((k) => F[k].n === n);
  // Grösste Gruppe zuerst: «23 Kantone haben 9 solche Feiertage, Appenzell Ausserrhoden, Graubünden und Neuenburg 8».
  const gruppen = anzahl.map((n) => ({ n, ks: mit(n) })).sort((a, b) => b.ks.length - a.ks.length);
  // Zahlen im Fliesstext ausgeschrieben (Copy-Prüfung 16.11.2026).
  const WORT = { 6: 'sechs', 7: 'sieben', 8: 'acht', 9: 'neun' };
  const wort = (n) => WORT[n] || String(n);
  const wer = (ks) => (ks.length > 3 ? `${ks.length} Kantone` : und(ks.map((k) => de.cantons[k])));
  const satz = `${wer(gruppen[0].ks)} ${wort(gruppen[0].n)} solche Feiertage${gruppen.slice(1).map((g) => `; ${wer(g.ks)} ${g.ks.length > 1 ? 'haben' : 'hat'} ${wort(g.n)}`).join('')}`;
  const hinweis = (k) => [
    F[k].uneinheitlich ? 'nicht im ganzen Kanton gleich' : '',
    F[k].n26 !== F[k].n ? `2026: ${F[k].n26}, weil einzelne Feiertage nur an bestimmten Wochentagen gelten` : '',
    F[k].sicher === false ? '<strong>nicht gesichert</strong>' : '',
  ].filter(Boolean).join(' · ');
  const zeilen = KANTONE.map((k) => `              <tr><th scope="row">${de.cantons[k]}</th><td class="n">${F[k].n}</td><td>${hinweis(k)}</td></tr>`).join('\n');
  return `
        <p>Im Geltungsbereich des Arbeitsgesetzes ist der 1. August dem Sonntag gleichgestellt; dazu dürfen die Kantone höchstens acht weitere Feiertage den Sonntagen gleichstellen. [[q:arg]] Gezählt mit dem 1. August haben ${satz}. An diesen Tagen gelten für die Arbeit die Regeln für den Sonntag. Welche Tage es sind, unterscheidet sich stärker als ihre Zahl. [[q:secoFeiertage]]</p>
        <details class="atlas-werte">
          <summary>Feiertage je Kanton als Tabelle</summary>
          <div class="tabelle zahlen" tabindex="0" role="region" aria-label="Dem Sonntag gleichgestellte Feiertage je Kanton"><table>
            <caption>Dem Sonntag gleichgestellte Feiertage je Kanton, mit dem 1. August, ohne Sonderregeln einzelner Gebiete, alphabetisch</caption>
            <tr><th scope="col">Kanton</th><th scope="col" class="n">Anzahl</th><th scope="col">Hinweis</th></tr>
${zeilen}
          </table></div>
        </details>`;
}

// ─── Eine Karte als eigenes Bild ─────────────────────────────────────────────
// Für die Vorstellungsseite (Entscheid Stebler Studios 10.11.2026, Skizze A–C → «C: als eigenes Bild»):
// dieselben Formen und Stufen wie im Atlas, aber als Datei, die erst beim Hinscrollen lädt. Eine Datei
// als <img> erbt kein CSS der Seite, darum stehen Farben und Rand hier fest, hell und dunkel.
export const KARTE_MASS = { w: GEO.w, h: GEO.h };
const RAND = { hell: '#6A6E74', dunkel: '#A8A5A0' }; // --leise der Seiten: Rand 3:1 gegen den Grund (1.4.11)
export function karteBild(key) {
  const E = EBENEN[key];
  const f = FRUCHT_STUFEN[KARTEN_FRUCHT[key]];
  if (!E || !f) throw new Error(`Kantonsatlas: keine Karte «${key}» für das Bild`);
  const { stufe } = stufen(key);
  const farben = (s, see, rand) => `use{stroke:${rand};stroke-width:.6}${s.map((c, i) => `.k${i + 1}{fill:${c}}`).join('')}.see{fill:${see};stroke:none}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${GEO.w} ${GEO.h}" width="${GEO.w}" height="${GEO.h}">` +
    `<title>${esc(`Karte: ${E.titel}`)}</title>` +
    `<style>${farben(f.hell, SEE.hell, RAND.hell)}@media (prefers-color-scheme:dark){${farben(f.dunkel, SEE.dunkel, RAND.dunkel)}}</style>` +
    `<defs>${KANTONE.map((k) => `<path id="ka-${k}" d="${GEO.cantons[k].d}"/>`).join('')}${GEO.lakes.map((d, i) => `<path id="ka-see-${i}" d="${d}"/>`).join('')}</defs>` +
    KANTONE.map((k) => `<use href="#ka-${k}" class="k${stufe[k]}"/>`).join('') +
    GEO.lakes.map((_, i) => `<use href="#ka-see-${i}" class="see"/>`).join('') +
    `</svg>\n`;
}

// Karte → Werkzeug der App, das dieselbe Frage mit den eigenen Angaben rechnet (C, Brückenstück 09.11.2026).
// Die Umkehrung von KANTONSKARTE in src/components/ErklaerseiteLink.jsx (Wächter: atlasBruecke.test.js).
// Leerwohnungen, Kinderzulage und Kita-Abzug haben kein eigenes Werkzeug: dort steht kein Weg.
export const KARTE_WERKZEUG = {
  praemie: { view: 'praemien', name: 'Prämie und Franchise' },
  lastNachIpv: { view: 'premium', name: 'Prämienverbilligung' },
  steuer: { view: 'tax', name: 'Steuern' },
  miete: { view: 'mietzins', name: 'Mietbeiträge' },
  alq: { view: 'alv', name: 'Arbeitslosentaggeld' },
  sozialhilfe: { view: 'sozialhilfe', name: 'Sozialhilfe' },
  el: { view: 'ergaenzungsleistungen', name: 'Ergänzungsleistungen' },
  mindestlohn: { view: 'stundenlohn', name: 'Stundenlohn' }, // 14.11.2026
};

// Die Werte zu einer Karte: dieselbe Tabelle wie auf /kantone-im-vergleich/,
// zugeklappt, damit die Karten auf dem Handy nahe beieinander stehen.
const werteTabelle = (tab, text) => `
        <details class="atlas-werte">
          <summary>${text}</summary>${BLOECKE_VERGLEICH[`TAB:${tab}`]()}
        </details>`;

// Legenden der Karten, die auch die App zeigt (scripts/app-verstehen.mjs, 09.11.2026): eine Quelle für
// Jahr, Rahmung und Belege, damit Seite und App nie Verschiedenes sagen.
export const LEGENDE = {
  praemie: 'Mittlere Monatsprämie für Erwachsene 2027, mit allen Franchisen und Modellen. [[q:praemienKantone]]',
  lastNachIpv: 'Prämienlast einer unverheirateten Person mit Medianeinkommen nach der durchschnittlichen Verbilligung im Kanton, gerechnet mit der Prämie 2026, dem Einkommen 2022 und der Verbilligung 2025. Ein Rechenwert über alle Versicherten, nicht die Last einer bestimmten Person. [[q:estvStatistik]] [[q:bagOkp]]',
  steuer: 'Steuern an Bund, Kanton und Gemeinde im Kantonshauptort bei 80\'000 Franken Bruttolohn, ledig, ohne Kinder und ohne Konfession, Steuerjahr 2026. [[q:estvSteuerrechner]]',
  miete: 'Durchschnittliche Nettomiete einer 3-Zimmer-Wohnung 2024, über alle vermieteten Wohnungen, auch langjährige Verträge. [[q:bfsMiete]]',
  alq: 'Anteil der Erwerbspersonen, die im September 2026 beim RAV als arbeitslos gemeldet waren. [[q:seco]]',
  sozialhilfe: 'Anteil der Bevölkerung, der 2025 wirtschaftliche Sozialhilfe, also Geld vom Sozialdienst, bezog. [[q:bfsSozialhilfe]]',
  el: 'Anteil der Menschen mit Altersrente, die im Dezember 2025 Ergänzungsleistungen (EL) bezogen. [[q:bsvEl]]',
  // Seit 14.11.2026 auch in der App (Abläufe «Kind», «Trennung», Werkzeug Stundenlohn).
  kinderzulage: 'Kinderzulage 2026 je Kind und Monat, erster Ansatz für Arbeitnehmende. Viele Kantone zahlen ab einem bestimmten Alter oder ab dem dritten Kind mehr; das zeigt die Karte nicht. Kantone mit gleichem Betrag stehen in derselben Stufe, darum sind die Stufen nicht gleich gross. [[q:bsvFamz]]',
  kita: `Höchster Steuerabzug für die Betreuung von Kindern durch Dritte, Steuerjahr 2026, je Kind. Für ${KITA_NICHT_VERGLICHEN.map((k) => de.cantons[k]).join(' und ')} ist nur der Wert 2025 ausgewiesen; dort ist der Abzug auf die Elternbeiträge an die Betreuung begrenzt, die Zahl ist also kein fester Höchstbetrag. [[q:estvKantonsblaetter]] [[q:estvDrittbetreuung]]`,
  alimente: `Höchster Betrag, den der Kanton je Kind und Monat vorschiesst, wenn Kinderalimente nicht bezahlt werden. ${ALIMENTE_GEKOPPELT.length} Kantone koppeln den Betrag an die höchste AHV-Waisenrente und stehen darum gleich hoch (${EBENEN.alimente.fmt(1008)} Franken, Stand 2026); bei mehreren steht der Betrag nicht im Gesetz, sondern folgt aus dieser Kopplung. Ob und wie viel jemand erhält, hängt in den meisten Kantonen von Einkommen und Vermögen ab; die Regeln sind je Kanton verschieden. ${KANTONE.filter((x) => ATLAS_DATEN.alimente[x].einheit).map((x) => `${de.cantons[x]} rechnet ${ATLAS_DATEN.alimente[x].einheit.replace(/^pro /, 'je ').replace(/ und Monat$/, '')}, nicht je Kind. `).join('')}${KANTONE.filter((x) => ATLAS_DATEN.alimente[x].sicher === false).length ? `Nicht gesichert ist der Betrag für ${und(KANTONE.filter((x) => ATLAS_DATEN.alimente[x].sicher === false).map((x) => `den Kanton ${de.cantons[x]}`))}.` : ''}`.trim(),
  mindestlohn: 'Kantone mit einem gesetzlichen Mindestlohn, Stand 2026. Die Farbe zeigt nur, ob es einen gibt, nicht, wie hoch er ist. Ausnahmen, etwa für Lernende, regelt jeder Kanton selbst.',
};

// Stufenfarben je Frucht, hell und dunkel, mit der Farbe der Seen. Im dunklen Modus ist die höchste Stufe
// die hellste. Aus FRUCHT_STUFEN erzeugt; auch die App liest sie (über scripts/app-verstehen.mjs), nicht
// von Hand kopiert. Welche Frucht eine Karte trägt: KARTEN_FRUCHT.
const SEE = { hell: '#F2F2F0', dunkel: '#22211F' };
const alsSatz = (s, see) => ({ 1: s[0], 2: s[1], 3: s[2], 4: s[3], see });
export const STUFEN_FARBEN = Object.fromEntries(Object.entries(FRUCHT_STUFEN).map(([f, s]) =>
  [f, { hell: alsSatz(s.hell, SEE.hell), dunkel: alsSatz(s.dunkel, SEE.dunkel) }]));
const cssStufen = (f) => `--k1:${f[1]}; --k2:${f[2]}; --k3:${f[3]}; --k4:${f[4]}; --k-see:${f.see}`;

const BLOECKE_ATLAS = {
  'FIG:praemie': (ctx) => karte(ctx, 'praemie', {
    legende: LEGENDE.praemie,
    nachher: werteTabelle('vpraemie', 'Prämie je Kanton als Tabelle') }),
  'FIG:lastnachipv': (ctx) => karte(ctx, 'lastNachIpv', {
    legende: LEGENDE.lastNachIpv,
    nachher: werteTabelle('vlast', 'Prämienlast vor und nach Verbilligung als Tabelle') }),
  'FIG:steuer': (ctx) => karte(ctx, 'steuer', {
    legende: LEGENDE.steuer,
    nachher: werteTabelle('vsteuer', 'Steuern je Kanton als Tabelle, mit der Spanne der Gemeinden') }),
  'FIG:miete': (ctx) => karte(ctx, 'miete', {
    legende: LEGENDE.miete,
    nachher: werteTabelle('vmiete', 'Miete je Kanton als Tabelle') }),
  'FIG:leer': (ctx) => karte(ctx, 'leer', {
    legende: 'Leerwohnungsziffer am 1. Juni 2026: Anteil der Wohnungen und Einfamilienhäuser, die leer stehen und zur Miete oder zum Kauf angeboten sind. [[q:bfsLeer]]',
    nachher: werteTabelle('vleer', 'Leerwohnungsziffer je Kanton als Tabelle') }),
  'FIG:kinderzulage': (ctx) => karte(ctx, 'kinderzulage', {
    legende: LEGENDE.kinderzulage,
    nachher: werteTabelle('vfamilie', 'Kinderzulage je Kanton als Tabelle') }),
  'FIG:kita': (ctx) => karte(ctx, 'kita', {
    legende: LEGENDE.kita,
    nachher: werteTabelle('vkita', 'Kita-Abzug je Kanton als Tabelle') }),
  'FIG:alimente': (ctx) => karte(ctx, 'alimente', {
    legende: LEGENDE.alimente,
    nachher: werteTabelle('valimente', 'Vorschuss je Kanton als Tabelle, mit Stand und Quelle') }),
  'FIG:mindestlohn': (ctx) => karteMindestlohn(ctx),
  'FIG:feiertage': () => feiertageBlock(),
  'FIG:alq': (ctx) => karte(ctx, 'alq', {
    legende: LEGENDE.alq,
    nachher: werteTabelle('valq', 'Arbeitslosenquote je Kanton als Tabelle') }),
  'FIG:sozialhilfe': (ctx) => karte(ctx, 'sozialhilfe', {
    legende: LEGENDE.sozialhilfe }),
  'FIG:el': (ctx) => karte(ctx, 'el', {
    legende: LEGENDE.el,
    nachher: werteTabelle('vunterstuetzung', 'Sozialhilfe und Ergänzungsleistungen je Kanton als Tabelle') }),
};

const QUELLEN_AUS_VERGLEICH = ['praemienKantone', 'estvStatistik', 'bagOkp', 'estvSteuerrechner', 'bfsMiete', 'bfsLeer', 'bsvFamz', 'estvKantonsblaetter', 'seco', 'bfsSozialhilfe', 'bsvEl', 'estvDrittbetreuung', 'dbg'];

// ─── Befunde (E3, Entscheid Stebler Studios 06.11.2026) ─────────────────────
// Ein Befund ist eine Beobachtung, keine Forderung. Nur belegte Befunde stehen
// hier: B2 (Kita-Abzug, aus den Daten gerechnet) und B3 (Genfer Elternzeit, an
// den Seiten von Kanton und Parlament gelesen am 06.11.2026). B1 (Alimente VD)
// erst nach der Antwort des BRAPA; K1 (Prämienlast) hielt der Nachrechnung vom
// 04.11.2026 nicht stand. Bewusst ohne «mögliches Instrument»: Die Seite sagt,
// was die Zahlen zeigen und wer die Regel festlegt, nicht, was man unternehmen soll.
// Keine selbst gewählte Schwelle (Rechtsprüfung 07.11.2026: wirkte wie eine Rangliste).
const BEFUNDE_ABSCHNITT = {
  id: 'befunde',
  titel: '9. Befunde',
  html: `
        <p>Manchmal zeigen die Zahlen selbst einen Unterschied: eine grosse Spanne oder eine beschlossene Regel, die noch nicht in Kraft ist. Hier stehen solche Befunde. Ein Befund ist eine Beobachtung, keine Forderung. Er nennt, was belegt ist, woher es kommt und wer die Regel festlegt. Was jemand daraus macht, steht nicht auf dieser Seite.</p>
        <article class="befund" aria-labelledby="befund-kita">
          <h3 id="befund-kita">Abzug für Kinderbetreuung: grosse Spanne zwischen den Kantonen</h3>
          <dl>
            <dt>Art</dt><dd>grosse Spanne</dd>
            <dt>Belegt</dt><dd>ja</dd>
            <dt>Was die Zahlen zeigen</dt><dd>Bei der direkten Bundessteuer lassen sich im Steuerjahr {{v.kita.bundJahr}} bis zu {{v.kita.bund}} Franken je Kind abziehen. [[q:dbg]] Bei den Kantons- und Gemeindesteuern reichen die Grenzen von {{v.kita.tief}} Franken {{v.kita.tiefName}} bis {{v.kita.hoch}} Franken {{v.kita.hochName}}. {{v.kita.unterBund}} Kantone liegen unter dem Betrag des Bundes, {{v.kita.abBund}} auf oder darüber. [[q:estvKantonsblaetter]] Alle Werte stehen in der Tabelle zur Karte im Abschnitt Familie.</dd>
            <dt>Wer die Regel festlegt</dt><dd>Den Abzug und seine Bedingungen schreibt das Bundesrecht vor, die Höhe bei den Kantons- und Gemeindesteuern legt jeder Kanton in seinem Steuergesetz fest. [[q:sthg]]</dd>
            <dt>Vorbehalt</dt><dd>Ein tiefer Abzug sagt noch nicht, was Betreuung kostet: Das hängt auch davon ab, wie stark Kanton und Gemeinde die Plätze verbilligen, und vom Steuertarif. {{v.kita.nichtVerglichenName}} ist nicht mitgezählt, weil für den Kanton nur der Wert für 2025 vorliegt.</dd>
          </dl>
        </article>
        <article class="befund" aria-labelledby="befund-ge">
          <h3 id="befund-ge">Genf: Elternurlaub in der Verfassung, Ausführungsgesetz in Arbeit</h3>
          <dl>
            <dt>Art</dt><dd>Stand der Umsetzung</dd>
            <dt>Belegt</dt><dd>ja</dd>
            <dt>Was belegt ist</dt><dd>Die Genfer Stimmberechtigten haben am 18. Juni 2023 einen Elternurlaub in die Kantonsverfassung geschrieben: zu den 16 Wochen Mutterschaftsurlaub 8 Wochen für den anderen Elternteil, die heutigen 2 Wochen nach Bundesrecht eingerechnet. Das Bundesparlament hat die Verfassungsänderung am 22. September 2026 bestätigt (gewährleistet); ausgenommen ist die Bestimmung zu Pflegefamilien. [[q:parlamentGe]] Möglich wird das durch eine Änderung des Erwerbsersatzgesetzes (EOG) vom 19. Dezember 2025: Sie erlaubt den Kantonen, den Urlaub des anderen Elternteils zu verlängern, und tritt am 1. Juli 2027 in Kraft. [[q:as2026433]] Das kantonale Ausführungsgesetz ist laut Kanton noch in Arbeit, ein Datum für den Start nennt er nicht. [[q:geElternurlaub]]</dd>
            <dt>Wer die Regel festlegt</dt><dd>Staatsrat und Grosser Rat des Kantons Genf. Laut Kanton wirken vorher auch das Bundesamt für Sozialversicherungen und allenfalls der Bundesrat mit.</dd>
            <dt>Vorbehalt</dt><dd>Bis das Genfer Ausführungsgesetz in Kraft ist, gibt es den längeren Urlaub für den anderen Elternteil nicht; es gelten die bisherigen Regeln. Ob und wie viel Sie erhalten, hängt von Ihrer Situation ab. Massgebend ist die Auskunft der Ausgleichskasse.</dd>
          </dl>
        </article>`,
};

// ─── Brillen (Entscheid Stebler Studios 24.10.2026, bestätigt 06.11.2026) ────
// Gleiche Karten, anderer Blick: Jede Brille nennt ihre Frage und führt zu den
// Karten, die sie beantworten. Ohne Skript, als Sprungmarken. Ebenen ohne
// eigene Karte auf dieser Seite (Feiertage, nur Tabelle) und die
// Spenden-Werte der Atlas-Vorschau fehlen bewusst — die Seite verspricht nichts,
// was es (noch) nicht gibt. Mindestlohn und Alimente seit 14.11.2026.
export const BRILLEN = [
  { id: 'person', name: 'Person', frage: 'Was bedeutet der Wohnkanton für mich?',
    text: 'Prämie, Steuern und was Familien erhalten oder abziehen können. Die Karten zeigen Durchschnitte je Kanton, nicht Ihre eigene Lage; die rechnet Maloja mit Ihren Angaben.',
    karten: ['praemie', 'lastNachIpv', 'steuer', 'kinderzulage', 'kita', 'alimente'] },
  { id: 'firma', name: 'Firma', frage: 'Wie sieht es für die Mitarbeitenden am Standort aus?',
    text: 'Miete, Wohnungsmarkt, Arbeitslosenquote, Mindestlohn sowie Kinderzulage und Kita-Abzug. Es sind Werte je Kanton; einen Standortentscheid ersetzen sie nicht.',
    karten: ['miete', 'leer', 'alq', 'mindestlohn', 'kinderzulage', 'kita'] },
  { id: 'kanton', name: 'Kanton oder Gemeinde', frage: 'Wie schwer wiegt die Prämie, wie häufig ist Unterstützung?',
    text: 'Prämienlast nach der Verbilligung, Sozialhilfe, Ergänzungsleistungen (EL), Arbeitslosigkeit und Leerwohnungen im Kanton. Dazu die <a href="#befunde">Befunde</a>.',
    karten: ['lastNachIpv', 'sozialhilfe', 'el', 'alq', 'leer'] },
  { id: 'stiftung', name: 'Stiftung oder Verein', frage: 'Wo beziehen viele Menschen Unterstützung?',
    text: 'Sozialhilfe, Ergänzungsleistungen, Arbeitslosenquote und Prämienlast nach der Verbilligung. Ein hoher Anteil zeigt, wo mehr Menschen Unterstützung beziehen, nicht, wo sie mehr nützt.',
    karten: ['sozialhilfe', 'el', 'alq', 'lastNachIpv'] },
];

// ─── Brillen als Filter, ohne Skript (A, Brückenstück 09.11.2026) ────────────
// Jede Brille hat eine eigene Adresse (#fuer-firma …), damit man sie verlinken und teilen kann, auch von der
// Startseite aus. Gewählt ist, was im Adressfeld steht (:target): Die Karten der Brille bleiben offen, die
// übrigen klappen auf eine Zeile zu. «Karte zeigen» und «Alle Karten» ändern die Adresse und heben den Filter
// auf. Ohne :has() (ältere Browser) bleiben einfach alle Karten offen. Die Seite hat kein Skript (CSP).
const BRILLEN_CSS = [
  // Ohne :has() kann die Seite nicht filtern: dann gibt es weder Knöpfe noch den Satz dazu, die Brillen bleiben
  // Wegweiser wie vor dem 09.11.2026 (a11y- und Copy-Prüfung: kein Knopf, der nichts tut).
  '    .brillen-wahl, .nur-mit-filter, .brillen-status, .gewaehlt{ display:none }',
  '    .atlas-zu{ display:none; margin:0; padding:12px 16px; border:1px dashed var(--rand); border-radius:16px; color:var(--leise); font-size:15px }',
  '    .atlas-zu a, .brillen-status a{ display:inline-block; padding:10px 0; color:var(--heidel-text) }',
  '    @supports selector(:has(*)){',
  '    .nur-mit-filter{ display:inline }',
  '    .brillen-wahl{ display:block; margin:14px 0 6px }',
  '    .brillen-wahl ul{ list-style:none; padding:0; margin:0; display:flex; flex-wrap:wrap; gap:8px }',
  // Rand in --leise: trägt 3:1 gegen den Grund (1.4.11), --rand hätte 1,2:1.
  '    .brillen-wahl a{ display:inline-flex; align-items:center; min-height:44px; padding:0 16px; border:1px solid var(--leise); border-radius:999px; font-size:15px; color:var(--heidel-text); text-decoration:none; background:var(--flaeche) }',
  '    .brillen-wahl a:hover{ border-color:var(--heidel-text) }',
  '    .brillen-wahl a:focus-visible{ outline:2px solid var(--text); outline-offset:2px }',
  // Der Statussatz ist das Sprungziel: er wird beim Wählen zuerst gelesen (a11y-Prüfung, Soll 2).
  '    .brillen-status{ font-size:15px; scroll-margin-top:24px }',
  '    .brillen-status:target{ display:block }',
  '    .brillen-status:focus{ outline:none }',
  // Gewählt: Rand und Grund in Heidelbeere, fett und «(gewählt)» für Screenreader (nicht nur Farbe).
  '    body:not(:has(.brillen-status:target)) .brillen-wahl .wahl-alle,',
  ...BRILLEN.map((b, i) => `    body:has(#fuer-${b.id}:target) .brillen-wahl a[href="#fuer-${b.id}"]${i < BRILLEN.length - 1 ? ',' : ''}`),
  '      { border-color:var(--heidel-text); background:var(--heidel-hauch); color:var(--text); font-weight:600 }',
  '    body:not(:has(.brillen-status:target)) .wahl-alle .gewaehlt,',
  ...BRILLEN.map((b, i) => `    body:has(#fuer-${b.id}:target) a[href="#fuer-${b.id}"] .gewaehlt${i < BRILLEN.length - 1 ? ',' : ''}`),
  '      { display:inline }',
  ...BRILLEN.flatMap((b) => [
    `    body:has(#fuer-${b.id}:target) .brille:not([data-brille="${b.id}"]){ display:none }`,
    `    body:has(#fuer-${b.id}:target) .atlas:not([data-brillen~="${b.id}"]) > :not(.atlas-zu){ display:none }`,
    `    body:has(#fuer-${b.id}:target) .atlas:not([data-brillen~="${b.id}"]) > .atlas-zu{ display:block }`,
  ]),
  '    }',
  // Weg in die App unter der Karte (C).
  '    .atlas-weiter{ margin:10px 0 0; font-size:15px }',
  // Eigenständiger Weg, kein Link im Fliesstext: 44 px hoch wie jedes Bedienelement.
  '    .atlas-weiter a{ display:inline-block; padding:11px 0; color:var(--heidel-text); font-weight:600; text-underline-offset:3px }',
  '    .atlas-weiter span{ color:var(--leise); margin-left:6px }',
].join('\n');

const BRILLEN_ABSCHNITT = {
  id: 'brillen',
  titel: '2. Vier Brillen: wer welche Karten braucht',
  html: `
        <p>Je nachdem, wer fragt, zählen andere Karten. Eine Person fragt, was der Wohnort für sie bedeutet. Eine Firma schaut auf den Standort ihrer Mitarbeitenden. Die Karten selbst sind für alle dieselben und frei zugänglich. Wir ordnen sie hier aus vier Blickwinkeln, als «Brillen».<span class="nur-mit-filter"> Wählen Sie eine: Deren Karten bleiben offen, die übrigen klappen zu. Keine Karte verschwindet.</span></p>
${BRILLEN.map((b) => `        <p class="brillen-status" id="fuer-${b.id}" tabindex="-1">Gewählt: Brille «${b.name}». ${b.karten.length} von ${Object.keys(KARTEN_FRUCHT).length} Karten sind offen, die übrigen zugeklappt. <a href="#brillen">Alle Karten zeigen</a></p>`).join('\n')}
        <nav class="brillen-wahl" aria-label="Karten nach Brille zeigen">
          <ul role="list">
            <li><a href="#brillen" class="wahl-alle">Alle Karten<span class="gewaehlt sr-only"> (gewählt)</span></a></li>
${BRILLEN.map((b) => `            <li><a href="#fuer-${b.id}">${b.name}<span class="gewaehlt sr-only"> (gewählt)</span></a></li>`).join('\n')}
          </ul>
        </nav>
        <div class="brillen">
${BRILLEN.map((b) => `          <section class="brille" data-brille="${b.id}" aria-labelledby="brille-${b.id}">
            <h3 id="brille-${b.id}">${b.name}: ${b.frage}</h3>
            <p>${b.text}</p>
            <ul role="list">${b.karten.map((k) => `<li><a href="#karte-${k.toLowerCase()}">${k === 'mindestlohn' ? 'Kantonaler Mindestlohn' : EBENEN[k].titel}</a></li>`).join('')}</ul>
          </section>`).join('\n')}
        </div>`,
};

export const KANTONSATLAS = {
  pfad: 'kantonsatlas',
  titel: 'Kantonsatlas: die 26 Kantone auf der Karte',
  beschreibung:
    'Prämie, Steuern, Miete, Familie, Arbeit und Unterstützung: zwölf Karten der Schweizer Kantone, mit Quelle und Stand, ohne Rangliste.',
  brotkrume: 'Kantonsatlas',
  kicker: 'Kantonsatlas',
  inhaltTitel: 'Inhalt',
  stand: KANTONE_IM_VERGLEICH.stand,
  // Gleiche Zahlen wie /kantone-im-vergleich/, also dasselbe Prüfdatum.
  pruefenBis: KANTONE_IM_VERGLEICH.pruefenBis,
  hinweis:
    'Orientierung, keine Rechts- oder Finanzberatung. Eine Karte zeigt einen Wert je Kanton; für einen einzelnen Haushalt kann es ganz anders aussehen.',
  vorbehalt:
    'Diese Seite ist eine <strong>Orientierungshilfe auf Basis öffentlicher Statistiken, kantonaler Erlasse und Geodaten — keine Rechts-, Versicherungs- oder Finanzberatung</strong>. Die Karten zeigen Durchschnitte oder gesetzliche Beträge, die verschieden erhoben werden und verschieden alt sind. Sie bewerten die Kantone nicht: Eine dunkle Fläche heisst nur, dass die Zahl höher ist. Massgebend sind der Erlass und die zuständigen Stellen.',
  vorspann:
    'Wie hoch ist die Prämie, wie viel kostet eine Wohnung, wie viele Menschen beziehen Unterstützung? Das hängt in der Schweiz oft vom Kanton ab. Dieser Atlas zeigt die Zahlen als Karten, damit sichtbar wird, wo sich etwas ähnelt und wo nicht. Die genauen Werte stehen zu jeder Karte in einer aufklappbaren Tabelle.',
  inhaltsverzeichnis: true,
  abschnitte: [
    {
      id: 'lesen',
      titel: '1. Wie die Karten zu lesen sind',
      html: `
        <p>Jede Karte teilt die 26 Kantone nach ihrer Zahl in vier etwa gleich grosse Gruppen. Die Farbe einer Karte zeigt nur das Thema, wie in Maloja überall: Blau für Versicherungen, Grün für Wohnen, Braun für Arbeit, Violett für Vorsorge, Grau für das, was über ein Amt läuft. <span class="nur-hell">Hell sind die Kantone mit den tieferen Zahlen, dunkel die mit den höheren.</span><span class="nur-dunkel">Im dunklen Modus sind die Kantone mit den tieferen Zahlen dunkel, die mit den höheren hell.</span> Unter der Karte steht, welche Spanne jede Stufe umfasst; die Werte jedes Kantons stehen in einer aufklappbaren Tabelle bei der Karte. Nahe an einer Stufengrenze können fast gleiche Werte verschieden gefärbt sein.</p>
        <p class="merke"><strong>Kurz gesagt:</strong> <span class="nur-hell">Dunkel</span><span class="nur-dunkel">Hell</span> heisst «höhere Zahl», nicht «besser» oder «schlechter». Eine hohe Miete kann mit hohen Löhnen zusammengehen, eine tiefe Quote damit, dass eine Leistung wenig bekannt ist. Was hinter den Unterschieden steckt, zeigen die Karten nicht.</p>
        <p>Dieselben Zahlen stehen auf der Seite <a href="/kantone-im-vergleich/">Kantone im Vergleich</a> im Text und nebeneinander, dort auch mit ihren Zusammenhängen.</p>`,
    },
    BRILLEN_ABSCHNITT,
    {
      id: 'krankenkasse',
      titel: '3. Krankenkasse',
      html: `
        <p>Die mittlere Prämie für Erwachsene liegt {{jahr}} zwischen {{v.praemie.tief}} Franken {{v.praemie.tiefName}} und {{v.praemie.hoch}} Franken {{v.praemie.hochName}}. Wie die Prämie zustande kommt, erklärt die Seite <a href="/krankenkasse/">Krankenkasse erklärt</a>.</p>
<!--FIG:praemie-->
        <p>Wie schwer die Prämie wiegt, hängt auch vom Einkommen und von der Prämienverbilligung ab. Ob Sie Anspruch auf Verbilligung haben, steht auf der Seite <a href="/praemienverbilligung/">Prämienverbilligung</a>.</p>
<!--FIG:lastnachipv-->`,
    },
    {
      id: 'steuern',
      titel: '4. Steuern',
      html: `
        <p>Bei 80'000 Franken Bruttolohn zahlt eine ledige Person ohne Kinder im Kantonshauptort an Bund, Kanton und Gemeinde zwischen {{v.steuer.tief}} des Lohns {{v.steuer.tiefName}} und {{v.steuer.hoch}} {{v.steuer.hochName}}. Auch innerhalb eines Kantons zählt die Gemeinde; die Tabelle unter der Karte zeigt die Spanne innerhalb jedes Kantons.</p>
<!--FIG:steuer-->`,
    },
    {
      id: 'wohnen',
      titel: '5. Wohnen',
      html: `
        <p>Eine 3-Zimmer-Wohnung kostete 2024 im Durchschnitt zwischen {{v.miete.tief}} Franken im Monat {{v.miete.tiefName}} und {{v.miete.hoch}} Franken {{v.miete.hochName}}. Wie leicht man eine Wohnung findet, zeigt die Karte zur Leerwohnungsziffer.</p>
<!--FIG:miete-->
<!--FIG:leer-->`,
    },
    {
      id: 'familie',
      titel: '6. Familie',
      html: `
        <p>Die Kinderzulage beträgt 2026 in allen Kantonen mindestens {{v.kinderzulage.tief}} Franken im Monat. Bei den Steuern lassen sich die Kosten für Kita, Tagesfamilie oder Hort bis zu einer Grenze abziehen, die fast jeder Kanton selbst festlegt.</p>
<!--FIG:kinderzulage-->
<!--FIG:kita-->
        <p class="leise">Ein tiefer Abzug sagt noch nicht, was Betreuung kostet: Das hängt auch davon ab, wie stark Kanton und Gemeinde die Plätze verbilligen.</p>
        <p>Werden Kinderalimente nicht bezahlt, kann der Kanton sie vorschiessen und das Geld danach beim Elternteil einfordern, der sie schuldet. Wie viel er höchstens vorschiesst, legt jeder Kanton selbst fest.</p>
<!--FIG:alimente-->`,
    },
    {
      id: 'arbeit',
      titel: '7. Arbeit',
      html: `
        <p>Im September 2026 waren zwischen {{v.alq.tief}} der Erwerbspersonen {{v.alq.tiefName}} und {{v.alq.hoch}} {{v.alq.hochName}} als arbeitslos gemeldet.</p>
<!--FIG:alq-->
        <p class="leise">Wer keine Stelle hat, aber nicht beim RAV gemeldet ist, fehlt in dieser Zahl. Es ist ein Monatswert, der saisonal schwankt.</p>
        <p>Einen Mindestlohn für die ganze Schweiz gibt es nicht. ${Object.keys(MINDESTLOHN).length} Kantone haben einen eigenen festgelegt.</p>
<!--FIG:mindestlohn-->
<!--FIG:feiertage-->`,
    },
    {
      id: 'unterstuetzung',
      titel: '8. Unterstützung',
      html: `
        <p>Sozialhilfe und Ergänzungsleistungen helfen, wenn das eigene Geld nicht reicht. Die Karten zeigen, wie viele Menschen sie beziehen.</p>
<!--FIG:sozialhilfe-->
<!--FIG:el-->
        <p class="leise"><strong>Vorbehalt:</strong> Die Quoten zeigen, wer bezieht, nicht, wer Anspruch hätte. Wer eine Leistung nicht beantragt, fehlt. Eine hohe Quote kann auf mehr Bedarf hindeuten, aber auch darauf, dass die Leistung bekannter ist oder leichter beantragt wird. Was Ihnen zustehen könnte, zeigt die Seite <a href="/was-steht-mir-zu/">Was steht mir zu?</a></p>`,
    },
    BEFUNDE_ABSCHNITT,
  ],
  zahlen: () => ({ ...zahlenKrankenkasse(), ...vergleichZahlen(), }),
  bloecke: BLOECKE_ATLAS,
  quellen: [
    ...QUELLEN_AUS_VERGLEICH.map((key) => {
      const q = KANTONE_IM_VERGLEICH.quellen.find((x) => x.key === key);
      if (!q) throw new Error(`Kantonsatlas: Quelle ${key} fehlt auf /kantone-im-vergleich/`);
      return q;
    }),
    { key: 'parlamentGe', herausgeber: 'Keystone-ATS, veröffentlicht auf parlament.ch', titel: 'Le Parlement donne son feu vert au congé parental genevois', datum: '22.09.2026', url: 'https://www.parlament.ch/fr/services/news/Pages/2026/20260922084151244194158159026_bsf021.aspx', belegt: 'Gewährleistung durch das Parlament am 22.09.2026, ohne die Bestimmung zu Pflegefamilien; Inhalt: 8 Wochen für den anderen Elternteil zu 16 Wochen Mutterschaft', amtlich: false },
    { key: 'as2026433', herausgeber: 'Bundeskanzlei (Fedlex), AS 2026 433', titel: 'Bundesgesetz über den Erwerbsersatz (Erwerbsersatzgesetz, EOG) (Angleichung der EO-Leistungen), Änderung vom 19. Dezember 2025', datum: 'in Kraft ab 1.7.2027', url: 'https://www.fedlex.admin.ch/eli/oc/2026/433/de', belegt: 'Art. 16m^bis EOG: Kantone dürfen die Entschädigung des anderen Elternteils verlängern; Inkrafttreten 1.7.2027', amtlich: true },
    { key: 'sthg', herausgeber: 'Bundeskanzlei (Fedlex), SR 642.14', titel: 'Bundesgesetz über die Harmonisierung der direkten Steuern der Kantone und Gemeinden (StHG), Art. 9 Abs. 2 Bst. m', datum: 'Fassung vom 1.1.2025', url: 'https://www.fedlex.admin.ch/eli/cc/1991/1256_1256_1256/de', belegt: 'Abzug für die Drittbetreuung von Kindern, Höhe nach kantonalem Recht', amtlich: true },
    { key: 'geElternurlaub', herausgeber: 'République et canton de Genève', titel: 'Congé parental : les étapes de la mise en œuvre', datum: 'ohne Datum, gelesen 06.11.2026', url: 'https://www.ge.ch/dossier/cohesion-sociale-geneve/domaines-developpement/conge-parental-etapes-mise-oeuvre', belegt: 'Abstimmung 18.06.2023, Änderung der Erwerbsersatzordnung vom 19.12.2025 mit Inkrafttreten 1.7.2027, fehlendes Ausführungsgesetz, kein Startdatum', amtlich: true },
    // Rechtsprüfung 06.11.2026: Die BFS-Geodaten stehen unter «OPEN-BY» (freie Nutzung,
    // Quellenangabe mit Autor, Titel und Link Pflicht). swiss-maps (BSD-3-Clause) hat sie
    // aufbereitet. swisstopo nicht nennen: als Rechteinhaber nicht belegt.
    { key: 'karte', herausgeber: 'Bundesamt für Statistik (BFS), GEOSTAT', titel: 'Generalisierte Gemeindegrenzen: Geodaten', datum: 'Stand 2021; freie Nutzung, Quellenangabe Pflicht (OPEN-BY)', url: 'https://statistik.admin.ch/de/asset/15724821', belegt: 'Grenzen der Kantone und der grossen Seen, Grundlage der Karten', amtlich: true },
    // Mindestlohn (14.11.2026): Beträge aus src/data/lohnCheck.js, Quellen wie in der Atlas-Vorschau.
    { key: 'mlGe', herausgeber: 'République et canton de Genève', titel: 'Montant et calcul du salaire minimum', datum: 'gelesen 14.11.2026', url: 'https://www.ge.ch/appliquer-salaire-minimum-genevois/montant-calcul-du-salaire-minimum', belegt: '24.59 Fr. pro Stunde seit 1.1.2026, jährliche Anpassung an die Teuerung', amtlich: true },
    { key: 'mlNe', herausgeber: 'République et canton de Neuchâtel, Service de l\'emploi', titel: 'Service de l\'emploi: salaire minimum', datum: 'Stand 2026', url: 'https://www.ne.ch/autorites/DECS/SEMP/Pages/accueil.aspx', belegt: '21.35 Fr. pro Stunde 2026, jährliche Anpassung an die Teuerung', amtlich: true },
    { key: 'mlBs', herausgeber: 'Kanton Basel-Stadt, Amt für Wirtschaft und Arbeit', titel: 'Merkblatt und FAQ zum kantonalen Mindestlohn', datum: 'Stand 1.1.2026', url: 'https://media.bs.ch/original_file_download/e7ce0ad1ebb1a946f5c6aab2ce99db95762ecfa2/2026-01-01-merkblatt-faq-homepage-deutsch.docx', belegt: '22.20 Fr. pro Stunde 2026, jährliche Anpassung an einen Mischindex aus Teuerung und Löhnen', amtlich: true },
    { key: 'mlJu', herausgeber: 'République et Canton du Jura', titel: 'Salaires minimaux', datum: 'Stand 2026', url: 'https://www.jura.ch/fr/Autorites/Administration/DES/Economie-et-Emploi-SEE/Conditions-de-travail/Conditions-de-travail/Salaires-minimaux.html', belegt: '21.40 Fr. pro Stunde seit 1.7.2024; Anpassung liegt im Ermessen der Regierung', amtlich: true },
    { key: 'mlTi', herausgeber: 'Repubblica e Cantone Ticino', titel: 'Decreto esecutivo sui salari minimi, 11 dicembre 2025', datum: 'in Kraft 1.1.2026', url: 'https://m3.ti.ch/CAN/RLeggi/public/index.php/raccolta-leggi/pdfatto/atto/11921', belegt: '20.00 bis 20.50 Fr. pro Stunde je nach Branche', amtlich: true },
    { key: 'arg', herausgeber: 'Bundeskanzlei (Fedlex), SR 822.11', titel: 'Bundesgesetz über die Arbeit in Industrie, Gewerbe und Handel (Arbeitsgesetz, ArG), Art. 20a Abs. 1', datum: 'geltende Fassung', url: 'https://www.fedlex.admin.ch/eli/cc/1966/57_57_57/de', belegt: 'Bundesfeiertag dem Sonntag gleichgestellt, Kantone höchstens acht weitere Feiertage', amtlich: true },
    { key: 'secoFeiertage', herausgeber: 'Staatssekretariat für Wirtschaft (SECO)', titel: 'Feiertage in der Schweiz: Anhang zur Wegleitung zum Arbeitsgesetz', datum: 'Stand 12.12.2024', url: 'https://www.seco.admin.ch/dam/de/sd-web/x5LtHPJdNis5/Anhang-Feiertage-Schweiz-Auszug-ArG-ArGV1-5-SECO-SB-2024-DE.pdf', belegt: 'dem Sonntag gleichgestellte Feiertage je Kanton und Gebiet', amtlich: true },
    // Alimente: je Kanton die Quelle aus dem Atlas (alimente.json), in der Tabelle verlinkt.
    ...KANTONE.map((k) => {
      const a = ATLAS_DATEN.alimente[k];
      // Rechtsprüfung 16.11.2026: Wo der Betrag aus der Kopplung folgt, belegt die Quelle die Regel, nicht die Zahl;
      // LexFind ist eine Sammlung, keine amtliche Publikation.
      const abgeleitet = /abgeleitet/i.test(a.notiz || '');
      const lexfind = /lexfind\.ch/.test(a.url);
      return { key: `alimente${k}`, herausgeber: lexfind ? `LexFind (Sammlung der Erlasse), Kanton ${de.cantons[k]}` : `Kanton ${de.cantons[k]}`, titel: `Alimentenbevorschussung: ${a.recht.split(';')[0]}`, datum: `Stand ${a.jahr}`, url: a.url,
        belegt: abgeleitet ? `Kopplung an die höchste AHV-Waisenrente; der Betrag ${a.chf} Fr. ist daraus abgeleitet, nicht im Erlass genannt` : `höchster Vorschuss ${a.chf} Fr. ${a.einheit ? a.einheit.replace(/^pro /, 'pro ') : 'je Kind und Monat'}${a.sicher === false ? '; ob seither angepasst, nicht gesichert' : ''}`, amtlich: !lexfind };
    }),
    { key: 'swissmaps', herausgeber: 'Interactive Things, swiss-maps 4.5.0', titel: 'swiss-maps: Geodaten der Schweiz als TopoJSON', datum: 'Version 4.5.0, BSD-3-Clause', url: 'https://github.com/interactivethings/swiss-maps', belegt: 'Aufbereitung der BFS-Grenzen, für diese Karten zusätzlich vereinfacht', amtlich: false },
  ],
  quellenHinweis:
    'Maloja Plana steht mit diesen Stellen in keiner Verbindung; die Verlinkung bedeutet keine Zusammenarbeit und keine Billigung. Die Zahlen sind dieselben wie auf der Seite «Kantone im Vergleich» und stammen aus diesen Quellen.',
  eigeneRechnungen: [
    'Stufen: Die 26 Kantone sind nach ihrer Zahl sortiert und in vier etwa gleich grosse Gruppen geteilt. Kantone mit gleichem Wert stehen in derselben Stufe. Die Stufen sind für jede Karte neu gerechnet und lassen sich zwischen den Karten nicht vergleichen.',
    ...KANTONE_IM_VERGLEICH.eigeneRechnungen.slice(0, 1),
  ],
  // Belegstellen der Karte stehen in der Legende jeder Abbildung, ausser der
  // Kartengrundlage: die gehört zu allen Karten und steht im ersten Abschnitt.
  stilZusatz: `
    /* ─── Kantonsatlas: je Karte die Frucht ihres Lebensbereichs, vier Stufen ─── */
    /* :root trägt die Heidelbeere als Grundwert; jede Karte setzt ihre Frucht (KARTEN_FRUCHT). */
    :root{ ${cssStufen(STUFEN_FARBEN.heidelbeere.hell)} }
${FRUCHT_CSS_HELL}
    /* Lesart folgt dem Modus: im dunklen Modus ist die höchste Stufe die hellste. Versteckt per display,
       damit Vorlese-Programme jeden Satz genau einmal lesen (Befund 09.11.2026, aus der App-Karte #780). */
    .nur-dunkel{ display:none }
    @media (prefers-color-scheme: dark){ .nur-hell{ display:none } .nur-dunkel{ display:inline } }
    @media (prefers-color-scheme: dark){
      :root{ ${cssStufen(STUFEN_FARBEN.heidelbeere.dunkel)} }
${FRUCHT_CSS_DUNKEL}
    }
    .atlas .abb-bild svg{ max-height:420px }
    .atlas svg use{ stroke:var(--leise); stroke-width:.6 }
    .atlas svg .k1, .atlas-legende i.k1{ fill:var(--k1); background:var(--k1) }
    .atlas svg .k2, .atlas-legende i.k2{ fill:var(--k2); background:var(--k2) }
    .atlas svg .k3, .atlas-legende i.k3{ fill:var(--k3); background:var(--k3) }
    .atlas svg .k4, .atlas-legende i.k4{ fill:var(--k4); background:var(--k4) }
    .atlas svg .see{ fill:var(--k-see); stroke:none }
    /* Punktstreifen (Brücke zur App, 18.11.2026): dieselben Stufen, Rand wie die Kantonsgrenzen. */
    .atlas-streifen{ margin:4px 0 0 }
    .atlas-streifen svg{ display:block; width:100%; height:auto; max-width:560px }
    .atlas-streifen circle{ stroke:var(--leise); stroke-width:.6 }
    .atlas-streifen .streifen-achse{ stroke:var(--leise); stroke-width:.75 }
    .atlas-streifen .streifen-ch{ stroke:var(--text); stroke-width:1; stroke-dasharray:2 2 }
    .atlas-streifen .streifen-satz{ margin:0 0 8px; font-size:15px; color:var(--text) }
    .atlas-streifen .streifen-namen{ position:relative; height:1.5em; margin:4px 0 0; max-width:560px;
      font-size:13px; color:var(--leise); font-variant-numeric:tabular-nums }
    .atlas-streifen .streifen-marke{ position:absolute; top:0; white-space:nowrap }
    .atlas-streifen .streifen-mitte{ transform:translateX(-50%) }
    .atlas-einheit{ margin:6px 0 0; font-size:13px; color:var(--leise) }
    .atlas-legende{ list-style:none; padding:0; display:flex; flex-wrap:wrap; gap:6px 16px; margin:6px 0 4px; font-size:13px; color:var(--leise); font-variant-numeric:tabular-nums }
    .atlas-legende li{ display:inline-flex; align-items:center; gap:6px }
    .atlas-legende i{ display:inline-block; width:14px; height:14px; border-radius:3px; border:1px solid var(--rand);
      -webkit-print-color-adjust:exact; print-color-adjust:exact }
    /* Karte und Legende behalten zusammen ihre Stufen, sonst zeigte die Legende vier Farben und die Karte eine. */
    @media (forced-colors:active){ .atlas-legende i, .atlas svg{ forced-color-adjust:none } }
    .atlas-werte{ margin:10px 0 0 }
    .atlas-werte summary{ cursor:pointer; color:var(--heidel-text); font-size:15px; padding:10px 0 }
    .befund{ background:var(--flaeche); border:1px solid var(--rand); border-radius:16px; padding:16px 18px; margin:18px 0 }
    .befund h3{ margin:0 0 10px }
    .befund dl{ display:grid; grid-template-columns:max-content 1fr; gap:6px 14px; font-size:15px }
    .befund dt{ color:var(--leise) } .befund dd{ margin:0 }
    @media (max-width:600px){ .befund dl{ grid-template-columns:1fr } .befund dt{ margin-top:6px } }
    .brillen{ display:grid; grid-template-columns:repeat(auto-fit,minmax(240px,1fr)); gap:12px; margin:14px 0 }
    .brille{ background:var(--flaeche); border:1px solid var(--rand); border-radius:16px; padding:14px 16px; display:grid; gap:8px; align-content:start }
    .brille h3{ margin:0; font-size:17px }
    .brille p{ font-size:15px; color:var(--leise) }
    .brille ul{ list-style:none; padding:0; margin:0; display:flex; flex-wrap:wrap; gap:6px }
    .brille li a{ display:inline-block; padding:4px 10px; border:1px solid var(--rand); border-radius:999px; font-size:14px; color:var(--heidel-text); text-underline-offset:3px }
    .brille li a:hover{ border-color:var(--heidel-text) }
    .brille li a:focus-visible{ outline:2px solid var(--text); outline-offset:2px }
${BRILLEN_CSS}
    .atlas-werte summary:focus-visible{ outline:2px solid var(--text); outline-offset:2px }`,
};

// Die Kartengrundlage wird im ersten Abschnitt belegt, damit sie in der
// Quellenliste eine Rückverweis-Stelle hat.
KANTONSATLAS.abschnitte[0].html += `
        <p class="leise">Kartengrundlage: Kantonsgrenzen und Seen des BFS, Stand 2021, aufbereitet mit swiss-maps und vereinfacht. Spätere Gebietswechsel zwischen Kantonen sind nicht eingezeichnet. [[q:karte]] [[q:swissmaps]]</p>`;
