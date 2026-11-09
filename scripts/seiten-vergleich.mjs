// ─── Zahlen und Tabellen für die Hintergrundseite «Kantone im Vergleich» ──────
//
// Alle Werte kommen aus dem Maloja-Kantonsatlas (Kopie unter
// scripts/daten/kantonsatlas/, gleich gehalten mit scripts/kantonsatlas-abgleich.mjs).
// Hier wird nichts abgetippt: Tabellen, Balken, die Zahlen im Text und die
// Zusammenhänge werden beim Bauen gerechnet.
//
// Regeln aus dem Entscheid zum Kantonsatlas (stebler-studios, 24.10.2026):
//   • keine Rangliste, keine Farben für «gut» und «schlecht»;
//   • jede Zahl mit Quelle und Stand;
//   • ein Zusammenhang ist eine Beobachtung, keine Erklärung.
// Die Kantone stehen darum alphabetisch oder nach dem Wert sortiert, nie mit
// Platzziffer, und alle Balken haben dieselbe ruhige Farbe.
//
// Build-Zeit — liegt bewusst NICHT unter src/.

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import de from '../src/i18n/de.js';

const DATEN = resolve(dirname(fileURLToPath(import.meta.url)), 'daten', 'kantonsatlas');
const lies = (name) => JSON.parse(readFileSync(resolve(DATEN, `${name}.json`), 'utf8'));

const A = {
  praemien: lies('praemien'),
  last: lies('last'),
  steuern: lies('steuern'),
  lohnMiete: lies('lohn_miete'),
  leer: lies('leerwohnungsziffer'),
  sozialhilfe: lies('sozialhilfe'),
  el: lies('el_quote'),
  alq: lies('arbeitslosenquote'),
  famz: lies('familienzulagen'),
  kita: lies('kita_abzug'),
};

export const KANTONE = Object.keys(A.steuern).filter((k) => /^[A-Z]{2}$/.test(k)).sort((a, b) => de.cantons[a].localeCompare(de.cantons[b], 'de'));
if (KANTONE.length !== 26) throw new Error(`Kantonsatlas: ${KANTONE.length} statt 26 Kantone`);

// ─── Zahlenformat ────────────────────────────────────────────────────────────
const tausender = (s) => s.replace(/\B(?=(\d{3})+(?!\d))/g, "'");
const fr = (n) => tausender(String(Math.round(n)));
const rp = (n) => { const [g, r] = Number(n).toFixed(2).split('.'); return `${tausender(g)}.${r}`; };
const pz = (n, stellen = 1) => `${Number(n).toFixed(stellen).replace('.', ',')} %`;

// ─── Die Ebenen ──────────────────────────────────────────────────────────────
// wert(k) liefert den Kantonswert, ch den Wert der ganzen Schweiz (falls die
// Quelle ihn führt), fmt die Anzeige, quelle den Schlüssel der Belege.
export const EBENEN = {
  praemie: { titel: 'Prämie Erwachsene', einheit: 'Fr. im Monat', kurz: 'Prämie',
    wert: (k) => A.praemien[k].erw.y27, ch: A.praemien.CH.erw.y27, fmt: rp, quelle: 'praemienKantone' },
  last: { titel: 'Prämienlast vor Verbilligung', einheit: '% des Median-Reineinkommens', kurz: 'Prämienlast vor Verbilligung',
    wert: (k) => A.last[k].lastSingle, ch: A.last.CH.lastSingle, fmt: (n) => pz(n), quelle: 'estvStatistik' },
  lastNachIpv: { titel: 'Prämienlast nach Verbilligung', einheit: '% des Median-Reineinkommens, Rechenwert', kurz: 'Prämienlast nach Verbilligung',
    wert: (k) => A.last[k].lastNachIpv, ch: A.last.CH.lastNachIpv, fmt: (n) => pz(n), quelle: 'bagOkp' },
  steuer: { titel: 'Steuern bei 80\'000 Fr. Lohn', einheit: '% des Bruttolohns', kurz: 'Steuern bei 80\'000 Fr.',
    wert: (k) => A.steuern[k].p80, ch: null, fmt: (n) => pz(n), quelle: 'estvSteuerrechner' },
  miete: { titel: 'Miete 3 Zimmer', einheit: 'Fr. im Monat', kurz: 'Miete 3 Zimmer',
    wert: (k) => A.lohnMiete[k].miete3, ch: A.lohnMiete.CH.miete3, fmt: fr, quelle: 'bfsMiete' },
  mieteAnteil: { titel: 'Miete 3 Zimmer am Medianlohn', einheit: '% des Medianlohns (Vollzeit, brutto)', kurz: 'Miete am Medianlohn',
    wert: (k) => A.lohnMiete[k].anteil, ch: Math.round((A.lohnMiete.CH.miete3 / A.lohnMiete.CH.lohn24) * 1000) / 10, fmt: (n) => pz(n), quelle: 'bfsLse' },
  leer: { titel: 'Leerwohnungsziffer', einheit: '% der Wohnungen', kurz: 'Leerwohnungen',
    wert: (k) => A.leer[k].z, ch: A.leer.CH.z, fmt: (n) => pz(n, 2), quelle: 'bfsLeer' },
  sozialhilfe: { titel: 'Sozialhilfequote', einheit: '% der Bevölkerung', kurz: 'Sozialhilfequote',
    wert: (k) => A.sozialhilfe[k].q24, ch: A.sozialhilfe.CH.q24, fmt: (n) => pz(n), quelle: 'bfsSozialhilfe' },
  el: { titel: 'Ergänzungsleistungen zur AHV', einheit: '% der Menschen mit Altersrente', kurz: 'Ergänzungsleistungen (EL)',
    wert: (k) => A.el[k].ahv, ch: A.el.CH.ahv, fmt: (n) => pz(n), quelle: 'bsvEl' },
  alq: { titel: 'Arbeitslosenquote', einheit: '% der Erwerbspersonen', kurz: 'Arbeitslosenquote',
    wert: (k) => A.alq[k].q, ch: A.alq.CH.q, fmt: (n) => pz(n), quelle: 'seco' },
  kinderzulage: { titel: 'Kinderzulage', einheit: 'Fr. im Monat je Kind', kurz: 'Kinderzulage',
    wert: (k) => A.famz[k].kind, ch: null, fmt: fr, quelle: 'bsvFamz' },
  kita: { titel: 'Abzug für Kinderbetreuung', einheit: 'Fr. im Jahr je Kind', kurz: 'Kita-Abzug',
    wert: (k) => A.kita[k].chf, ch: null, fmt: fr, quelle: 'estvKantonsblaetter' },
};

// Stand und wichtigster Vorbehalt je Zahl, für die Punktstreifen, die zuerst
// und allein sichtbar sind (Fachprüfung 09.11.2026). Aus `stand` der Seite.
const STAND_STREIFEN = {
  praemie: 'mittlere Prämie 2027',
  lastNachIpv: 'nicht die Last einer Person; Prämie 2026, Einkommen 2022, Verbilligung 2025',
  steuer: 'Kantonshauptort, ledig, ohne Kinder und Konfession, Steuerjahr 2026',
  miete: '2024, Durchschnitt aller Verträge, nicht Inserate',
  leer: '1. Juni 2026',
  sozialhilfe: '2024',
  el: 'Dezember 2025',
  alq: 'September 2026, Monatswert',
  kinderzulage: '2026, erster Ansatz',
};
// Zwei fast gleich hohe Spitzenwerte nicht als einen einzigen Höchstwert zeigen
// (Fachprüfung 05.11.2026, gleiche Regel wie v.lastNachIpv.hochZusatz).
const NAH_STREIFEN = { lastNachIpv: 0.2 };

// Kita-Abzug: Kantone, deren Wert nicht vergleichbar ist, zählen beim Vergleich
// mit dem Bund nicht mit (Fach- und Rechtsprüfung 05.11.2026). NE: nur Wert 2025
// (ESTV-Steuermäppchen 2025: 20'400 Fr., höchstens die Elternbeiträge nach LAE);
// «kein fester Höchstbetrag» liess sich nicht belegen.
export const KITA_NICHT_VERGLICHEN = ['NE'];
// Bundesabzug ab Steuerjahr 2027: Verordnung über die kalte Progression vom
// 11.09.2026, AS 2026 486 (Erlasstext gelesen 05.11.2026). Steht noch nicht im
// Atlas; der Atlas führt das Steuerjahr 2026.
export const KITA_BUND_2027 = 25900;

const werte = (key) => KANTONE.map((k) => ({ k, name: de.cantons[k], v: EBENEN[key].wert(k) }));
const tief = (key) => werte(key).reduce((a, b) => (b.v < a.v ? b : a));
const hoch = (key) => werte(key).reduce((a, b) => (b.v > a.v ? b : a));

// Kein Schweizer Wert in der Quelle: sichtbar ein Strich, vorgelesen in Worten.
const KEIN = '<span aria-hidden="true">–</span><span class="sr-only">kein Wert</span>';

// ─── Tabelle je Ebene: Werte mit Balken, nach Wert sortiert, ohne Platzziffer ─
// Ein Balken in der Tabelle (echter Text, auf dem Handy lesbar), ab null.
// Zwei Ebenen nebeneinander (z. B. vor/nach Verbilligung) teilen die Skala.
function tabelle(keys, { caption, sortiere = keys[0], zusatz = null }) {
  const reihen = werte(sortiere).sort((a, b) => a.v - b.v || a.name.localeCompare(b.name, 'de'));
  const max = Math.max(...keys.flatMap((key) => werte(key).map((w) => w.v)));
  const balken = (v, i) => `<span class="b${i}" style="width:${(v / max * 100).toFixed(1)}%"></span>`;
  const kopf = keys.map((key) => `<th scope="col" class="n">${EBENEN[key].kurz}<br><span class="leise">${EBENEN[key].einheit}</span></th>`).join('');
  const zeilen = reihen.map(({ k, name }) => {
    const vs = keys.map((key) => EBENEN[key].wert(k));
    return `              <tr><th scope="row">${name}</th><td class="balken" aria-hidden="true">${vs.map(balken).join('')}</td>${vs.map((v, i) => `<td class="n">${EBENEN[keys[i]].fmt(v)}</td>`).join('')}${zusatz ? `<td class="n leise">${zusatz(k)}</td>` : ''}</tr>`;
  }).join('\n');
  const chZeile = keys.some((key) => EBENEN[key].ch != null)
    ? `\n              <tr class="ch"><th scope="row">Ganze Schweiz</th><td class="balken" aria-hidden="true"></td>${keys.map((key) => `<td class="n">${EBENEN[key].ch != null ? EBENEN[key].fmt(EBENEN[key].ch) : KEIN}</td>`).join('')}${zusatz ? '<td></td>' : ''}</tr>` : '';
  const legende = keys.length > 1
    ? `<p class="leise legende" aria-hidden="true">${keys.map((key, i) => `<span class="b${i}"></span> ${EBENEN[key].titel}`).join(' · ')}</p>` : '';
  return `${legende}
        <div class="tabelle zahlen" tabindex="0" role="region" aria-label="${caption.replace(/<[^>]+>/g, '')}"><table>
          <caption>${caption}, sortiert nach ${EBENEN[sortiere].titel}</caption>
          <tr><th scope="col">Kanton</th><th scope="col"><span class="sr-only">Balken</span></th>${kopf}${zusatz ? `<th scope="col" class="n">${zusatz(null)}</th>` : ''}</tr>
${zeilen}${chZeile}
        </table></div>`;
}

// ─── Nebeneinander: alle Kantone, alle Ebenen, alphabetisch ──────────────────
const NEBENEINANDER = ['praemie', 'lastNachIpv', 'steuer', 'miete', 'leer', 'sozialhilfe', 'el', 'alq', 'kinderzulage'];
function nebeneinander() {
  const kopf = NEBENEINANDER.map((key) => `<th scope="col" class="n">${EBENEN[key].kurz}<br><span class="leise">${EBENEN[key].einheit}</span></th>`).join('');
  // Die erste Spalte bleibt beim waagrechten Verschieben stehen (CSS: position sticky).
  const zeilen = KANTONE.map((k) => `            <tr><th scope="row">${de.cantons[k]}</th>${NEBENEINANDER.map((key) => `<td class="n">${EBENEN[key].fmt(EBENEN[key].wert(k))}</td>`).join('')}</tr>`).join('\n');
  const ch = `            <tr class="ch"><th scope="row">Ganze Schweiz</th>${NEBENEINANDER.map((key) => `<td class="n">${EBENEN[key].ch != null ? EBENEN[key].fmt(EBENEN[key].ch) : KEIN}</td>`).join('')}</tr>`;
  return `
        <div class="tabelle breit" tabindex="0" role="region" aria-label="Alle Kantone nebeneinander, waagrecht verschiebbar"><table>
          <caption>Alle Kantone nebeneinander, alphabetisch. Quellen und Stand wie in den Abschnitten oben.</caption>
          <tr><th scope="col">Kanton</th>${kopf}</tr>
${zeilen}
${ch}
        </table></div>`;
}

// ─── Was zusammenhängt: Korrelation über die 26 Kantone ──────────────────────
// Pearson, ungewichtet: jeder Kanton zählt einmal, egal wie gross er ist.
export function korrelation(a, b) {
  const xs = KANTONE.map((k) => EBENEN[a].wert(k)), ys = KANTONE.map((k) => EBENEN[b].wert(k));
  const mx = xs.reduce((s, x) => s + x, 0) / xs.length, my = ys.reduce((s, y) => s + y, 0) / ys.length;
  let sxy = 0, sxx = 0, syy = 0;
  xs.forEach((x, i) => { sxy += (x - mx) * (ys[i] - my); sxx += (x - mx) ** 2; syy += (ys[i] - my) ** 2; });
  return sxy / Math.sqrt(sxx * syy);
}

// Rangkorrelation (Spearman) als Kontrolle: weniger anfällig für einzelne
// Ausreisser. Weichen die Stufen ab, gilt die schwächere (Fachprüfung 04.11.2026:
// Miete–Leerwohnungen hing sonst an einem einzigen Kanton).
const raenge = (xs) => {
  const sortiert = xs.map((x, i) => [x, i]).sort((a, b) => a[0] - b[0]);
  const r = new Array(xs.length);
  for (let i = 0; i < sortiert.length;) {
    let j = i; while (j + 1 < sortiert.length && sortiert[j + 1][0] === sortiert[i][0]) j++;
    for (let k = i; k <= j; k++) r[sortiert[k][1]] = (i + j) / 2 + 1;
    i = j + 1;
  }
  return r;
};
export function rangkorrelation(a, b) {
  const rx = raenge(KANTONE.map((k) => EBENEN[a].wert(k))), ry = raenge(KANTONE.map((k) => EBENEN[b].wert(k)));
  const m = (rx.length + 1) / 2;
  let sxy = 0, sxx = 0, syy = 0;
  rx.forEach((x, i) => { sxy += (x - m) * (ry[i] - m); sxx += (x - m) ** 2; syy += (ry[i] - m) ** 2; });
  return sxy / Math.sqrt(sxx * syy);
}

// Je Paar ein von Hand formulierter Satz mit den Kantonen als Subjekt, ohne
// Ursache-Ton (Copy-Prüfung 04.11.2026). gleich: Satz bei gleichläufigem,
// gegen: bei gegenläufigem Zusammenhang.
export const PAARE = [
  ['arbeitslos', 'alq', 'sozialhilfe', { paar: 'Arbeitslosenquote und Sozialhilfequote', gleich: 'In Kantonen mit höherer Arbeitslosenquote ist meist auch die Sozialhilfequote höher.', gegen: 'In Kantonen mit höherer Arbeitslosenquote ist die Sozialhilfequote meist tiefer.' }],
  ['praemieSozial', 'praemie', 'sozialhilfe', { paar: 'Prämie und Sozialhilfequote', gleich: 'In Kantonen mit höherer Prämie ist meist auch die Sozialhilfequote höher.', gegen: 'In Kantonen mit höherer Prämie ist die Sozialhilfequote meist tiefer.' }],
  ['elSozial', 'el', 'sozialhilfe', { paar: 'Ergänzungsleistungen und Sozialhilfequote', gleich: 'In Kantonen, in denen mehr Menschen mit Altersrente Ergänzungsleistungen beziehen, ist meist auch die Sozialhilfequote höher.', gegen: 'In Kantonen mit mehr Ergänzungsleistungen ist die Sozialhilfequote meist tiefer.' }],
  ['mieteLeer', 'miete', 'leer', { paar: 'Miete und Leerwohnungen', gleich: 'In Kantonen mit höheren Mieten stehen meist auch mehr Wohnungen leer.', gegen: 'In Kantonen mit höheren Mieten stehen meist weniger Wohnungen leer.' }],
  ['steuerPraemie', 'steuer', 'praemie', { paar: 'Steuern und Prämie', gleich: 'In Kantonen mit höheren Steuern ist meist auch die Prämie höher.', gegen: 'In Kantonen mit höheren Steuern ist die Prämie meist tiefer.' }],
];

const STUFEN = ['kaum', 'teilweise', 'deutlich'];
const stufe = (r) => (Math.abs(r) >= 0.6 ? 2 : Math.abs(r) >= 0.3 ? 1 : 0);
export const staerke = (a, b) => STUFEN[Math.min(stufe(korrelation(a, b)), stufe(rangkorrelation(a, b)))];

const rText = (r) => r.toFixed(2).replace('.', ',').replace('-', '−');

function zusammenhaenge() {
  const zeilen = PAARE.map(([, a, b, t]) => {
    const r = korrelation(a, b), st = staerke(a, b), rs = rangkorrelation(a, b);
    const satz = st === 'kaum' ? 'Kein klarer Zusammenhang.' : (r > 0 ? t.gleich : t.gegen);
    // Gibt die Rangfolge die Stufe vor, steht ihr Wert dabei, sonst wirkt das r
    // über der Schwelle wie ein Widerspruch zur Stufe (Fachprüfung 05.11.2026).
    const rangHinweis = stufe(rs) < stufe(r) ? ` <span class="leise">(nach Rangfolge ${rText(rs)})</span>` : '';
    return `          <tr><th scope="row">${t.paar}</th><td>${st === 'kaum' ? 'kaum' : `${st}, ${r > 0 ? 'gleichläufig' : 'gegenläufig'}`}${rangHinweis}</td><td class="n">${rText(r)}</td><td>${satz}</td></tr>`;
  }).join('\n');
  return `
        <div class="tabelle" tabindex="0" role="region" aria-label="Zusammenhänge über die 26 Kantone"><table>
          <caption>Zusammenhang über die 26 Kantone. r reicht von −1 (genau gegenläufig) über 0 (kein linearer Zusammenhang) bis +1 (genau gleichläufig).</caption>
          <tr><th scope="col">Zahlen</th><th scope="col">Stärke</th><th scope="col" class="n">r</th><th scope="col">Was das heisst</th></tr>
${zeilen}
        </table></div>`;
}

// ─── Punktstreifen (drei Schichten, «Bild zuerst», 09.11.2026) ───────────────
// Jeder Kanton ein Punkt auf einer Linie vom tiefsten zum höchsten Wert, dazu
// ein Strich für die ganze Schweiz. Eine Farbe, hohle Punkte (Überlappung
// bleibt sichtbar), keine Rangliste und keine Wertungsfarben (Atlas-Regeln
// vom 24.10.2026). Die genauen Zahlen stehen in den Tabellen unter
// «Ausführlich lesen»; vorgelesen wird die Spanne als Satz.
function streifen(key) {
  const e = EBENEN[key], t = tief(key), h = hoch(key);
  const lage = (v) => (h.v === t.v ? 50 : Math.min(100, Math.max(0, ((v - t.v) / (h.v - t.v)) * 100))).toFixed(1);
  const punkte = werte(key).map((w) => `<i style="left:${lage(w.v)}%"></i>`).join('');
  const ch = e.ch != null ? `<b style="left:${lage(e.ch)}%"></b>` : '';
  // Gleichstand am Rand (z. B. Kinderzulage: viele Kantone zahlen das Minimum):
  // dann die Zahl der Kantone statt eines zufällig ersten Namens.
  const wer = (w) => { const n = werte(key).filter((x) => x.v === w.v).length; return n > 1 ? [`${n} Kantone`, `in ${n} Kantonen`] : [w.name, `im Kanton ${w.name}`]; };
  const [tn, tSatz] = wer(t), [hn, hSatz] = wer(h);
  const zweit = werte(key).sort((x, y) => y.v - x.v)[1];
  const nah = NAH_STREIFEN[key] != null && h.v - zweit.v <= NAH_STREIFEN[key];
  const nahSicht = nah ? `<br><span class="leise">fast gleich ${zweit.name} ${e.fmt(zweit.v)}</span>` : '';
  const nahSatz = nah ? `, fast gleich hoch im Kanton ${zweit.name} (${e.fmt(zweit.v)})` : '';
  const stand = STAND_STREIFEN[key] ? `; ${STAND_STREIFEN[key]}` : '';
  const satz = `${e.titel} (${e.einheit}${stand}): von ${e.fmt(t.v)} ${tSatz} bis ${e.fmt(h.v)} ${hSatz}${nahSatz}${e.ch != null ? `, ganze Schweiz ${e.fmt(e.ch)}` : ''}. Jeder Punkt ist ein Kanton.`;
  return `
        <figure class="streifen" role="img" aria-label="${satz}">
          <p class="streifen-titel" aria-hidden="true">${e.titel} <span class="leise">${e.einheit}${stand}</span></p>
          ${e.ch != null ? `<p class="streifen-ch" aria-hidden="true"><span style="left:${Math.min(80, Math.max(20, Number(lage(e.ch))))}%">Schweiz ${e.fmt(e.ch)}</span></p>` : ''}
          <div class="streifen-achse" aria-hidden="true">${punkte}${ch}</div>
          <div class="streifen-ende" aria-hidden="true"><span><strong>${e.fmt(t.v)}</strong> ${tn}</span><span><strong>${e.fmt(h.v)}</strong> ${hn}${nahSicht}</span></div>
        </figure>`;
}
const LEGENDE_STREIFEN = '<p class="leise streifen-legende" aria-hidden="true"><i></i> ein Kanton · <b></b> ganze Schweiz · keine Rangliste</p>';
const streifenKarte = (...keys) => () => `<div class="kern">${keys.map(streifen).join('')}${LEGENDE_STREIFEN}</div>`;

// ─── Zahlen für den Text ─────────────────────────────────────────────────────
export function vergleichZahlen() {
  const z = {};
  for (const key of Object.keys(EBENEN)) {
    const t = tief(key), h = hoch(key);
    // «im Kanton Tessin» statt «in Tessin»: immer richtig, ohne Artikelregeln.
    z[`v.${key}.tiefName`] = `im Kanton ${t.name}`; z[`v.${key}.tief`] = EBENEN[key].fmt(t.v);
    z[`v.${key}.hochName`] = `im Kanton ${h.name}`; z[`v.${key}.hoch`] = EBENEN[key].fmt(h.v);
    if (EBENEN[key].ch != null) z[`v.${key}.ch`] = EBENEN[key].fmt(EBENEN[key].ch);
  }
  // Zwei fast gleich hohe Spitzenwerte nicht als einen einzigen Höchstwert
  // ausgeben (Fachprüfung 05.11.2026: TI 17,3 %, GE 17,2 % liegen in der Unschärfe).
  const nachIpv = werte('lastNachIpv').sort((a, b) => b.v - a.v);
  z['v.lastNachIpv.hochZusatz'] = nachIpv[0].v - nachIpv[1].v <= 0.2
    ? `, fast gleich hoch im Kanton ${nachIpv[1].name} (${pz(nachIpv[1].v)})` : '';
  z['v.kita.bund'] = fr(A.kita.CH_BUND.chf);
  z['v.kita.bund2027'] = fr(KITA_BUND_2027);
  const mitGrenze = KANTONE.filter((k) => !KITA_NICHT_VERGLICHEN.includes(k));
  z['v.kita.unterBund'] = String(mitGrenze.filter((k) => A.kita[k].chf < A.kita.CH_BUND.chf).length);
  z['v.kita.abBund'] = String(mitGrenze.filter((k) => A.kita[k].chf >= A.kita.CH_BUND.chf).length);
  z['v.kita.nichtVerglichenName'] = KITA_NICHT_VERGLICHEN.map((k) => de.cantons[k]).join(' und ');
  for (const [name, a, b] of PAARE) z[`v.r.${name}`] = rText(korrelation(a, b));
  z['v.kita.bundJahr'] = String(A.kita.CH_BUND.jahr);
  return z;
}

const gemeinden = (k) => (k === null ? 'Gemeinden im Kanton<br><span class="leise">tiefste bis höchste Belastung</span>' : `${pz(A.steuern[k].min[1])} bis ${pz(A.steuern[k].max[1])}`);

export const BLOECKE_VERGLEICH = {
  'TAB:vpraemie': () => tabelle(['praemie'], { caption: 'Mittlere Monatsprämie Erwachsene 2027, in Franken' }),
  'TAB:vlast': () => tabelle(['last', 'lastNachIpv'], { caption: 'Prämienlast einer unverheirateten Person, vor und nach der durchschnittlichen Verbilligung im Kanton', sortiere: 'lastNachIpv' }),
  'TAB:vsteuer': () => tabelle(['steuer'], { caption: 'Steuern im Kantonshauptort bei 80\'000 Franken Bruttolohn, ledig, ohne Kinder, ohne Konfession, Steuerjahr 2026', zusatz: gemeinden }),
  'TAB:vmiete': () => tabelle(['miete'], { caption: 'Durchschnittliche Nettomiete einer 3-Zimmer-Wohnung 2024, in Franken im Monat' }),
  'TAB:vmieteanteil': () => tabelle(['mieteAnteil'], { caption: 'Miete 3 Zimmer im Kanton in Prozent des Medianlohns der Grossregion, 2024' }),
  'TAB:vleer': () => tabelle(['leer'], { caption: 'Leerwohnungsziffer am 1. Juni 2026' }),
  'TAB:vunterstuetzung': () => tabelle(['sozialhilfe', 'el'], { caption: 'Sozialhilfequote 2024 und EL-Quote zur AHV, Dezember 2025', sortiere: 'sozialhilfe' }),
  'TAB:vfamilie': () => tabelle(['kinderzulage'], { caption: 'Kinderzulage 2026 je Kind und Monat (erster Ansatz), in Franken' }),
  'TAB:vkita': () => tabelle(['kita'], { caption: 'Höchster Abzug für Kinderbetreuung durch Dritte, Steuerjahr 2026, in Franken je Kind',
    zusatz: (k) => (k === null ? 'Hinweis' : KITA_NICHT_VERGLICHEN.includes(k) ? 'Wert 2025, auf Elternbeiträge begrenzt' : '') }),
  'TAB:valq': () => tabelle(['alq'], { caption: 'Arbeitslosenquote September 2026' }),
  'TAB:nebeneinander': nebeneinander,
  'FIG:spraemie': streifenKarte('praemie'),
  'FIG:ssteuer': streifenKarte('steuer'),
  'FIG:swohnen': streifenKarte('miete', 'leer'),
  'FIG:sunterstuetzung': streifenKarte('sozialhilfe', 'el'),
  'FIG:sfamilie': streifenKarte('kinderzulage'),
  'FIG:salq': streifenKarte('alq'),
  'FIG:salle': streifenKarte(...NEBENEINANDER),
  'TAB:zusammenhang': zusammenhaenge,
};
