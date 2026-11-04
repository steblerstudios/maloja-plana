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
  last: { titel: 'Prämienlast vor Verbilligung', einheit: '% des Medianeinkommens', kurz: 'Last vor',
    wert: (k) => A.last[k].lastSingle, ch: A.last.CH.lastSingle, fmt: (n) => pz(n), quelle: 'estvStatistik' },
  lastNachIpv: { titel: 'Prämienlast nach Verbilligung', einheit: '% des Medianeinkommens', kurz: 'Last nach',
    wert: (k) => A.last[k].lastNachIpv, ch: A.last.CH.lastNachIpv, fmt: (n) => pz(n), quelle: 'bagOkp' },
  steuer: { titel: 'Steuern bei 80\'000 Fr. Lohn', einheit: '% des Bruttolohns', kurz: 'Steuern',
    wert: (k) => A.steuern[k].p80, ch: null, fmt: (n) => pz(n), quelle: 'estvSteuerrechner' },
  miete: { titel: 'Miete 3 Zimmer', einheit: 'Fr. im Monat', kurz: 'Miete',
    wert: (k) => A.lohnMiete[k].miete3, ch: A.lohnMiete.CH.miete3, fmt: fr, quelle: 'bfsMiete' },
  mieteAnteil: { titel: 'Miete 3 Zimmer am Medianlohn', einheit: '% des Medianlohns', kurz: 'Miete/Lohn',
    wert: (k) => A.lohnMiete[k].anteil, ch: Math.round((A.lohnMiete.CH.miete3 / A.lohnMiete.CH.lohn24) * 1000) / 10, fmt: (n) => pz(n), quelle: 'bfsLse' },
  leer: { titel: 'Leerwohnungsziffer', einheit: '% der Wohnungen', kurz: 'Leer',
    wert: (k) => A.leer[k].z, ch: A.leer.CH.z, fmt: (n) => pz(n, 2), quelle: 'bfsLeer' },
  sozialhilfe: { titel: 'Sozialhilfequote', einheit: '% der Bevölkerung', kurz: 'Sozialhilfe',
    wert: (k) => A.sozialhilfe[k].q24, ch: A.sozialhilfe.CH.q24, fmt: (n) => pz(n), quelle: 'bfsSozialhilfe' },
  el: { titel: 'EL-Quote zur AHV', einheit: '% der Altersrenten', kurz: 'EL-Quote',
    wert: (k) => A.el[k].ahv, ch: A.el.CH.ahv, fmt: (n) => pz(n), quelle: 'bsvEl' },
  alq: { titel: 'Arbeitslosenquote', einheit: '%, September 2026', kurz: 'Arbeitslos',
    wert: (k) => A.alq[k].q, ch: A.alq.CH.q, fmt: (n) => pz(n), quelle: 'seco' },
  kinderzulage: { titel: 'Kinderzulage', einheit: 'Fr. im Monat je Kind', kurz: 'Kinderzulage',
    wert: (k) => A.famz[k].kind, ch: null, fmt: fr, quelle: 'bsvFamz' },
  kita: { titel: 'Abzug für Kinderbetreuung', einheit: 'Fr. im Jahr je Kind', kurz: 'Kita-Abzug',
    wert: (k) => A.kita[k].chf, ch: null, fmt: fr, quelle: 'estvKantonsblaetter' },
};

const werte = (key) => KANTONE.map((k) => ({ k, name: de.cantons[k], v: EBENEN[key].wert(k) }));
const tief = (key) => werte(key).reduce((a, b) => (b.v < a.v ? b : a));
const hoch = (key) => werte(key).reduce((a, b) => (b.v > a.v ? b : a));

// ─── Tabelle je Ebene: Werte mit Balken, nach Wert sortiert, ohne Platzziffer ─
// Ein Balken in der Tabelle (echter Text, auf dem Handy lesbar), ab null.
// Zwei Ebenen nebeneinander (z. B. vor/nach Verbilligung) teilen die Skala.
function tabelle(keys, { caption, sortiere = keys[0], zusatz = null }) {
  const reihen = werte(sortiere).sort((a, b) => a.v - b.v || a.name.localeCompare(b.name, 'de'));
  const max = Math.max(...keys.flatMap((key) => werte(key).map((w) => w.v)));
  const balken = (v, i) => `<span class="b${i}" style="width:${(v / max * 100).toFixed(1)}%"></span>`;
  const kopf = keys.map((key) => `<th scope="col" class="n">${EBENEN[key].kurz}</th>`).join('');
  const zeilen = reihen.map(({ k, name }) => {
    const vs = keys.map((key) => EBENEN[key].wert(k));
    return `              <tr><th scope="row">${name}</th><td class="balken" aria-hidden="true">${vs.map(balken).join('')}</td>${vs.map((v, i) => `<td class="n">${EBENEN[keys[i]].fmt(v)}</td>`).join('')}${zusatz ? `<td class="n leise">${zusatz(k)}</td>` : ''}</tr>`;
  }).join('\n');
  const chZeile = keys.some((key) => EBENEN[key].ch != null)
    ? `\n              <tr class="ch"><th scope="row">Ganze Schweiz</th><td class="balken" aria-hidden="true"></td>${keys.map((key) => `<td class="n">${EBENEN[key].ch != null ? EBENEN[key].fmt(EBENEN[key].ch) : '–'}</td>`).join('')}${zusatz ? '<td></td>' : ''}</tr>` : '';
  const legende = keys.length > 1
    ? `<p class="leise legende" aria-hidden="true">${keys.map((key, i) => `<span class="b${i}"></span> ${EBENEN[key].titel}`).join(' · ')}</p>` : '';
  return `
        <div class="tabelle zahlen"><table>
          <caption>${caption}</caption>
          <tr><th scope="col">Kanton</th><th scope="col"><span class="sr-only">Balken</span></th>${kopf}${zusatz ? `<th scope="col" class="n">${zusatz(null)}</th>` : ''}</tr>
${zeilen}${chZeile}
        </table></div>${legende}`;
}

// ─── Nebeneinander: alle Kantone, alle Ebenen, alphabetisch ──────────────────
const NEBENEINANDER = ['praemie', 'lastNachIpv', 'steuer', 'miete', 'leer', 'sozialhilfe', 'el', 'alq', 'kinderzulage'];
function nebeneinander() {
  const kopf = NEBENEINANDER.map((key) => `<th scope="col" class="n">${EBENEN[key].kurz}<br><span class="leise">${EBENEN[key].einheit}</span></th>`).join('');
  const zeilen = KANTONE.map((k) => `            <tr><th scope="row">${de.cantons[k]}</th>${NEBENEINANDER.map((key) => `<td class="n">${EBENEN[key].fmt(EBENEN[key].wert(k))}</td>`).join('')}</tr>`).join('\n');
  const ch = `            <tr class="ch"><th scope="row">Ganze Schweiz</th>${NEBENEINANDER.map((key) => `<td class="n">${EBENEN[key].ch != null ? EBENEN[key].fmt(EBENEN[key].ch) : '–'}</td>`).join('')}</tr>`;
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

export const PAARE = [
  ['arbeitslos', 'alq', 'sozialhilfe'],
  ['praemieSozial', 'praemie', 'sozialhilfe'],
  ['lastSozial', 'lastNachIpv', 'sozialhilfe'],
  ['mieteLeer', 'miete', 'leer'],
  ['steuerPraemie', 'steuer', 'praemie'],
  ['elSozial', 'el', 'sozialhilfe'],
];

export const staerke = (r) => (Math.abs(r) >= 0.7 ? 'eng' : Math.abs(r) >= 0.4 ? 'teilweise' : 'kaum');

function satz(a, b, r) {
  const A1 = EBENEN[a].titel, B1 = EBENEN[b].titel;
  if (staerke(r) === 'kaum') return `${A1} und ${B1}: kein klarer Zusammenhang.`;
  const richtung = r > 0 ? 'höher' : 'tiefer';
  return `${A1} und ${B1} hängen ${staerke(r)} zusammen: Wo das eine höher ist, ist das andere meist ${richtung}.`;
}

function zusammenhaenge() {
  const zeilen = PAARE.map(([, a, b]) => {
    const r = korrelation(a, b);
    return `          <tr><td>${satz(a, b, r)}</td><td class="n">${r.toFixed(2).replace('.', ',').replace('-', '−')}</td></tr>`;
  }).join('\n');
  return `
        <div class="tabelle"><table>
          <caption>Zusammenhang über die 26 Kantone (Korrelationskoeffizient r, von −1 bis +1)</caption>
          <tr><th scope="col">Beobachtung</th><th scope="col" class="n">r</th></tr>
${zeilen}
        </table></div>`;
}

// ─── Zahlen für den Text ─────────────────────────────────────────────────────
export function vergleichZahlen() {
  const z = {};
  for (const key of Object.keys(EBENEN)) {
    const t = tief(key), h = hoch(key);
    z[`v.${key}.tiefName`] = t.name; z[`v.${key}.tief`] = EBENEN[key].fmt(t.v);
    z[`v.${key}.hochName`] = h.name; z[`v.${key}.hoch`] = EBENEN[key].fmt(h.v);
    if (EBENEN[key].ch != null) z[`v.${key}.ch`] = EBENEN[key].fmt(EBENEN[key].ch);
  }
  z['v.kita.bund'] = fr(A.kita.CH_BUND.chf);
  z['v.kita.unterBund'] = String(KANTONE.filter((k) => A.kita[k].chf < A.kita.CH_BUND.chf).length);
  z['v.kita.abBund'] = String(KANTONE.filter((k) => A.kita[k].chf >= A.kita.CH_BUND.chf).length);
  for (const [name, a, b] of PAARE) z[`v.r.${name}`] = korrelation(a, b).toFixed(2).replace('.', ',').replace('-', '−');
  return z;
}

const gemeinden = (k) => (k === null ? 'Gemeinden im Kanton' : `${pz(A.steuern[k].min[1])} bis ${pz(A.steuern[k].max[1])}`);

export const BLOECKE_VERGLEICH = {
  'TAB:vpraemie': () => tabelle(['praemie'], { caption: 'Mittlere Monatsprämie Erwachsene 2027, in Franken' }),
  'TAB:vlast': () => tabelle(['last', 'lastNachIpv'], { caption: 'Prämienlast einer unverheirateten Person, vor und nach der durchschnittlichen Verbilligung im Kanton', sortiere: 'lastNachIpv' }),
  'TAB:vsteuer': () => tabelle(['steuer'], { caption: 'Steuern im Kantonshauptort bei 80\'000 Franken Bruttolohn, ledig, ohne Kinder, ohne Konfession, Steuerjahr 2026', zusatz: gemeinden }),
  'TAB:vmiete': () => tabelle(['miete'], { caption: 'Durchschnittliche Nettomiete einer 3-Zimmer-Wohnung 2024, in Franken im Monat' }),
  'TAB:vmieteanteil': () => tabelle(['mieteAnteil'], { caption: 'Miete 3 Zimmer im Kanton in Prozent des Medianlohns der Grossregion, 2024' }),
  'TAB:vleer': () => tabelle(['leer'], { caption: 'Leerwohnungsziffer am 1. Juni 2026' }),
  'TAB:vunterstuetzung': () => tabelle(['sozialhilfe', 'el'], { caption: 'Sozialhilfequote 2024 und EL-Quote zur AHV, Dezember 2025', sortiere: 'sozialhilfe' }),
  'TAB:vfamilie': () => tabelle(['kinderzulage'], { caption: 'Kinderzulage 2026 je Kind und Monat (erster Ansatz), in Franken' }),
  'TAB:vkita': () => tabelle(['kita'], { caption: 'Höchster Abzug für Kinderbetreuung durch Dritte, Steuerjahr 2026, in Franken je Kind' }),
  'TAB:valq': () => tabelle(['alq'], { caption: 'Arbeitslosenquote September 2026' }),
  'TAB:nebeneinander': nebeneinander,
  'TAB:zusammenhang': zusammenhaenge,
};
