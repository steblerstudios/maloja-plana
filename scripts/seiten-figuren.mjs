// ─── Figuren und Zahlen für die Hintergrundseiten ────────────────────────────
//
// Die Hintergrundseite /krankenkasse/ (scripts/seiten/krankenkasse.mjs) nennt
// Zahlen — anders als die Erklärseiten. Damit sie nicht zu Handabschriften
// werden, kommt alles, was Maloja selbst führt, beim Bauen aus Malojas Daten:
//
//   • Prämien 2027 je Kantonsregion   src/data/praemienRegionenDaten.js
//   • Schweizer Mittel 2027           src/data/praemienRegionen.js
//   • Franchisen, Selbstbehalt, Dach  src/data/kvgLeistungen.js
//   • Kantonsnamen                    src/i18n/de.js
//
// Was Maloja nicht führt (BAG-Kostenstatistik EFIND 2024), steht hier einmal,
// mit Quelle, und speist Figur UND Tabelle — es gibt keine zweite Abschrift.
//
// Die Figuren sind ruhige, statische SVG ohne Skript: die Seite lädt weiterhin
// kein JavaScript (CSP default-src 'none'). Farben kommen über Klassen aus dem
// Seitenstil, damit hell und dunkel stimmen.
//
// Build-Zeit — liegt bewusst NICHT unter src/, damit nichts ins Bundle rutscht.

import { PRAEMIEN, PRAEMIEN_QUELLEN } from '../src/data/praemienRegionenDaten.js';
import { NATIONAL_AVG_PREMIUM_JE_JAHR } from '../src/data/praemienRegionen.js';
import {
  FRANCHISE_STUFEN, SELBSTBEHALT_RATE, SELBSTBEHALT_MAX, SELBSTBEHALT_MAX_KINDER, berechneFranchise,
} from '../src/data/kvgLeistungen.js';
import de from '../src/i18n/de.js';

export const PRAEMIENJAHR = '2027';

// ─── Zahlenformat ────────────────────────────────────────────────────────────
// Schweizer Schreibweise wie im übrigen Text: 50'000, 324.90.
const tausender = (s) => s.replace(/\B(?=(\d{3})+(?!\d))/g, "'");
export const fr = (n) => tausender(String(Math.round(n)));
export const rp = (n) => {
  const [ganz, rest] = Number(n).toFixed(2).split('.');
  return `${tausender(ganz)}.${rest}`;
};

// ─── BAG EFIND 2024 — nicht in Maloja geführt, darum hier, einmal ────────────
// Kostenstufen: Tabelle 1.1, auf 100 Menschen gerundet. Die Höhe ist die Mitte
// der Stufe; die oberste steht auf ihrer Untergrenze (über 50'000).
export const DORF_STUFEN = [
  { menschen: 16, hoehe: 0, gruppe: 'nichts abgerechnet' },
  { menschen: 19, hoehe: 250, gruppe: "bis 2'000 Franken" },
  { menschen: 12, hoehe: 750, gruppe: "bis 2'000 Franken" },
  { menschen: 14, hoehe: 1500, gruppe: "bis 2'000 Franken" },
  { menschen: 18, hoehe: 3500, gruppe: "2'000 bis 10'000 Franken" },
  { menschen: 10, hoehe: 7500, gruppe: "2'000 bis 10'000 Franken" },
  { menschen: 6, hoehe: 15000, gruppe: "10'000 bis 50'000 Franken" },
  { menschen: 4, hoehe: 35000, gruppe: "10'000 bis 50'000 Franken" },
  { menschen: 1, hoehe: 50000, gruppe: "über 50'000 Franken" },
];

// Kosten je versicherte Person nach Alter, nach Abzug der Kostenbeteiligung,
// Tabelle 2.2. Schnitt ab 26: gewichtet ab 26 Jahren (eigene Rechnung).
export const ALTER_KOSTEN = [
  ['0–5', 1622], ['6–10', 1126], ['11–15', 1445], ['16–20', 1715], ['21–25', 1703], ['26–30', 1903],
  ['31–35', 2252], ['36–40', 2252], ['41–45', 2349], ['46–50', 2779], ['51–55', 3454], ['56–60', 4203],
  ['61–65', 5233], ['66–70', 6690], ['71–75', 8488], ['76–80', 10582], ['81–85', 12738], ['86–90', 15710],
  ['über 90', 20389],
];
export const ALTER_SCHNITT_AB_26 = 4863;

// Kosten je Person 2024 in sechs Kantonen (Franken im Jahr) — nur für die
// Vergleichstabelle; die Prämien daneben kommen aus Malojas Daten.
export const KANTON_KOSTEN_2024 = { ZG: 3869, AI: 3366, ZH: 4516, BS: 5591, TI: 5796, GE: 5616 };

// ─── Prämien 2027 aus Malojas Daten ──────────────────────────────────────────
// PRAEMIEN[Jahr][Kanton+Region] = [Kinder, Junge Erwachsene, Erwachsene].
// Region 0 heisst: der Kanton hat nur eine Prämienregion. Für Kantone mit
// mehreren Regionen führt die BAG-Datei nur die Werte je Region, keinen
// Kantonsmittelwert — die Seite zeigt darum ehrlich die Spanne der Regionen
// statt einer selbst gemittelten Zahl.
export function kantonsPraemien(jahr = PRAEMIENJAHR) {
  const tabelle = PRAEMIEN[jahr];
  if (!tabelle) throw new Error(`Keine Prämien für ${jahr} in praemienRegionenDaten.js`);
  const je = {};
  for (const [schluessel, werte] of Object.entries(tabelle)) {
    const k = schluessel.slice(0, 2), region = Number(schluessel.slice(2));
    (je[k] ||= []).push({ region, erwachsene: werte[2] });
  }
  return Object.entries(je).map(([kanton, regionen]) => {
    regionen.sort((a, b) => a.region - b.region);
    const werte = regionen.map((r) => r.erwachsene);
    return {
      kanton,
      name: de.cantons[kanton],
      regionen,
      tief: Math.min(...werte),
      hoch: Math.max(...werte),
      eineRegion: regionen.length === 1,
    };
  }).sort((a, b) => a.hoch - b.hoch || a.kanton.localeCompare(b.kanton));
}

export const praemienQuelle = (jahr = PRAEMIENJAHR) => PRAEMIEN_QUELLEN[jahr];

const praemieText = (k) => (k.eineRegion
  ? rp(k.tief)
  : `${rp(k.tief)} bis ${rp(k.hoch)} <span class="leise">(${k.regionen.length} Regionen)</span>`);

// ─── Platzhalter im Text ─────────────────────────────────────────────────────
// Der Text schreibt {{schluessel}}; hier steht, woher die Zahl kommt. Ein
// unbekannter Schlüssel bricht den Bau ab, statt leer durchzurutschen.
export function zahlen() {
  const mittel = NATIONAL_AVG_PREMIUM_JE_JAHR[PRAEMIENJAHR];
  if (!mittel) throw new Error(`Kein Schweizer Mittel für ${PRAEMIENJAHR}`);
  const kantone = kantonsPraemien();
  const billig = kantone[0], teuer = kantone[kantone.length - 1];
  // Der Text sagt «im Schnitt in …» — das stimmt nur für Kantone mit einer Region.
  if (!billig.eineRegion || !teuer.eineRegion) {
    throw new Error(`Tiefster oder höchster Wert ist eine Region (${billig.kanton}/${teuer.kanton}) — Satz «im Schnitt in …» in krankenkasse.mjs anpassen`);
  }
  const frMin = Math.min(...FRANCHISE_STUFEN), frMax = Math.max(...FRANCHISE_STUFEN);
  // Höchstrabatt für eine höhere Franchise: 70 % des zusätzlichen Risikos (KVV Art. 95 Abs. 2bis).
  const rabattJahr = 0.7 * (frMax - frMin);
  const dorf = (gruppe) => DORF_STUFEN.filter((s) => s.gruppe === gruppe).reduce((n, s) => n + s.menschen, 0);
  return {
    jahr: PRAEMIENJAHR,
    'mittel.erwachsene': rp(mittel.erwachsene),
    'mittel.junge': rp(mittel.junge),
    'mittel.kinder': rp(mittel.kinder),
    'mittel.gesamt': rp(mittel.gesamt),
    'mittel.gesamtFr': fr(mittel.gesamt),
    // 16 bis 19 % vermeidbare Kosten (INFRAS/WIG), grob auf 5 Franken gerundet.
    'vermeidbar.tief': fr(Math.floor((0.16 * mittel.gesamt) / 5) * 5),
    'vermeidbar.hoch': fr(Math.ceil((0.19 * mittel.gesamt) / 5) * 5),
    'kanton.tiefName': billig.name,
    'kanton.tief': rp(billig.tief),
    'kanton.hochName': teuer.name,
    'kanton.hoch': rp(teuer.hoch),
    'franchise.min': fr(frMin),
    'franchise.max': fr(frMax),
    'franchise.differenz': fr(frMax - frMin),
    'selbstbehalt.satz': String(Math.round(SELBSTBEHALT_RATE * 100)),
    'selbstbehalt.max': fr(SELBSTBEHALT_MAX),
    'selbstbehalt.kinder': fr(SELBSTBEHALT_MAX_KINDER),
    'dach.min': fr(frMin + SELBSTBEHALT_MAX),
    'dach.max': fr(frMax + SELBSTBEHALT_MAX),
    'rabatt.jahr': fr(rabattJahr),
    'rabatt.monat': fr(rabattJahr / 12),
    'dorf.null': String(dorf('nichts abgerechnet')),
    'dorf.bis2000': String(dorf("bis 2'000 Franken")),
    'dorf.bis10000': String(dorf("2'000 bis 10'000 Franken")),
    'dorf.bis50000': String(dorf("10'000 bis 50'000 Franken")),
    'dorf.ueber50000': String(dorf("über 50'000 Franken")),
    'alter.schnitt': fr(ALTER_SCHNITT_AB_26),
    'alter.jung': fr(ALTER_KOSTEN.find(([a]) => a === '26–30')[1]),
    'alter.alt': fr(ALTER_KOSTEN.find(([a]) => a === '81–85')[1]),
  };
}

export function einsetzen(html, werte, bloecke = {}) {
  return html
    .replace(/<!--(FIG|TAB):([a-z]+)-->/g, (_, art, name) => {
      const f = bloecke[`${art}:${name}`];
      if (!f) throw new Error(`Unbekannter Block ${art}:${name}`);
      return f();
    })
    .replace(/\{\{([a-zA-Z0-9.]+)\}\}/g, (_, k) => {
      if (!(k in werte)) throw new Error(`Unbekannte Zahl {{${k}}}`);
      return werte[k];
    });
}

// ─── SVG-Bausteine ───────────────────────────────────────────────────────────
const svgEsc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const r1 = (n) => Math.round(n * 10) / 10;

// Auf dem Handy würde die Schrift im Bild mitschrumpfen (a11y-Prüfung
// 04.11.2026: rund 6 px). Darum hat das Bild eine Mindestbreite und lässt sich
// waagrecht schieben; der Schiebebereich ist per Tastatur erreichbar.
function figur(id, breite, hoehe, titel, beschreibung, inhalt, legende, nachher = '') {
  return `<figure class="fig">
        <div class="fig-schieben" tabindex="0" role="group" aria-labelledby="${id}-t">
        <svg viewBox="0 0 ${breite} ${hoehe}" role="img" aria-labelledby="${id}-t ${id}-d" focusable="false">
          <title id="${id}-t">${svgEsc(titel)}</title>
          <desc id="${id}-d">${svgEsc(beschreibung)}</desc>
${inhalt.map((z) => `          ${z}`).join('\n')}
        </svg>
        </div>
        <figcaption>${legende}</figcaption>${nachher}
      </figure>`;
}

// ─── Figur: das Dorf ─────────────────────────────────────────────────────────
// 100 Säulen, eine je Mensch, sortiert, linear ab null. Gerade weil fast alle
// Säulen kaum zu sehen sind, zeigt das Bild, was die Tabelle sagt.
export function figurDorf() {
  const B = 640, H = 220, L = 52, R = 12, OBEN = 14, UNTEN = 30;
  const hMax = Math.max(...DORF_STUFEN.map((s) => s.hoehe));
  const y = (v) => H - UNTEN - (v / hMax) * (H - OBEN - UNTEN);
  const menschen = [...DORF_STUFEN].sort((a, b) => a.hoehe - b.hoehe)
    .flatMap((s) => Array.from({ length: s.menschen }, () => s.hoehe));
  const schritt = (B - L - R) / menschen.length, w = schritt * 0.78;
  const saeulen = menschen.map((v, i) => {
    const x = L + i * schritt;
    const h = H - UNTEN - y(v);
    return h > 0 ? `<rect class="f-saeule${v === hMax ? ' f-hell' : ''}" x="${r1(x)}" y="${r1(y(v))}" width="${r1(w)}" height="${r1(h)}"/>` : '';
  }).filter(Boolean);
  const inhalt = [
    `<line class="f-achse" x1="${L}" y1="${H - UNTEN}" x2="${B - R}" y2="${H - UNTEN}"/>`,
    `<line class="f-raster" x1="${L}" y1="${r1(y(hMax))}" x2="${B - R}" y2="${r1(y(hMax))}"/>`,
    `<text class="f-text" x="${L - 6}" y="${r1(y(hMax) + 4)}" text-anchor="end">50'000</text>`,
    `<text class="f-text" x="${L - 6}" y="${H - UNTEN + 4}" text-anchor="end">0</text>`,
    ...saeulen,
    `<text class="f-text" x="${L}" y="${H - 10}">${DORF_STUFEN[0].menschen} Menschen ohne Rechnung</text>`,
    `<text class="f-text" x="${B - R}" y="${H - 10}" text-anchor="end">1 Mensch über 50'000 Franken</text>`,
  ];
  return figur('fig-dorf', B, H,
    'Hundert Menschen, eine Säule je Person, so hoch wie ihre Kosten 2024',
    'Sortierte Säulen von links nach rechts. Die ersten 16 sind ohne Kosten, die meisten weiteren kaum sichtbar. Ganz rechts ragt eine einzige Säule bis 50\'000 Franken.',
    inhalt,
    'Franken im Jahr, über die Grundversicherung abgerechnet, ohne Kantonsanteil am Spital. Die höchste Säule steht auf der Untergrenze von 50\'000 Franken; in Wirklichkeit ragt sie oft weit höher. Quelle: BAG, EFIND 2024.');
}

export function tabelleDorf() {
  const gruppen = [];
  for (const s of DORF_STUFEN) {
    const g = gruppen.find((x) => x.gruppe === s.gruppe);
    if (g) g.menschen += s.menschen; else gruppen.push({ gruppe: s.gruppe, menschen: s.menschen });
  }
  const zeilen = gruppen.map((g) => `          <tr><td>${g.gruppe}</td><td class="n">${g.menschen}</td></tr>`).join('\n');
  return `<div class="tabelle"><table>
          <caption>Über die Grundversicherung abgerechnet 2024, auf 100 Menschen gerundet</caption>
          <tr><th scope="col">Kosten im Jahr</th><th scope="col" class="n">Menschen</th></tr>
${zeilen}
        </table></div>`;
}

// ─── Figur: Kosten nach Alter ────────────────────────────────────────────────
export function figurAlter() {
  const B = 640, H = 250, L = 52, R = 12, OBEN = 16, UNTEN = 34;
  const vMax = 22000;
  const y = (v) => H - UNTEN - (v / vMax) * (H - OBEN - UNTEN);
  const schritt = (B - L - R) / ALTER_KOSTEN.length, w = schritt * 0.72;
  const saeulen = ALTER_KOSTEN.map(([alter, v], i) => {
    const x = L + i * schritt + (schritt - w) / 2;
    const beschriftung = i % 3 === 0 || i === ALTER_KOSTEN.length - 1
      ? `<text class="f-text" x="${r1(x + w / 2)}" y="${H - UNTEN + 15}" text-anchor="middle">${svgEsc(alter)}</text>` : '';
    return `<rect class="f-saeule" x="${r1(x)}" y="${r1(y(v))}" width="${r1(w)}" height="${r1(H - UNTEN - y(v))}"/>${beschriftung}`;
  });
  const ys = r1(y(ALTER_SCHNITT_AB_26));
  const raster = [5000, 10000, 15000, 20000].map((v) =>
    `<line class="f-raster" x1="${L}" y1="${r1(y(v))}" x2="${B - R}" y2="${r1(y(v))}"/>` +
    `<text class="f-text" x="${L - 6}" y="${r1(y(v) + 4)}" text-anchor="end">${fr(v)}</text>`);
  const inhalt = [
    ...raster,
    `<line class="f-achse" x1="${L}" y1="${H - UNTEN}" x2="${B - R}" y2="${H - UNTEN}"/>`,
    ...saeulen,
    `<line class="f-marke" x1="${L}" y1="${ys}" x2="${B - R}" y2="${ys}"/>`,
    `<text class="f-text f-stark" x="${L + 4}" y="${r1(ys - 6)}">Schnitt ab 26: ${fr(ALTER_SCHNITT_AB_26)}</text>`,
    `<text class="f-text" x="${B - R}" y="${OBEN - 2}" text-anchor="end">Alter in Jahren</text>`,
  ];
  return figur('fig-alter', B, H,
    'Kosten je versicherte Person nach Alter, 2024',
    `Neunzehn Säulen von 0–5 bis über 90 Jahre. Sie bleiben bis Mitte fünfzig tief und steigen dann steil, bis ${fr(ALTER_KOSTEN[ALTER_KOSTEN.length - 1][1])} Franken. Eine gestrichelte Linie markiert den Schnitt ab 26 Jahren bei ${fr(ALTER_SCHNITT_AB_26)} Franken.`,
    inhalt,
    'Franken im Jahr je versicherte Person, nach Abzug der Kostenbeteiligung. Gestrichelt: der Schnitt aller ab 26 Jahren. Quelle: BAG, EFIND 2024, Tabelle 2.2.');
}

// ─── Figur: eigener Anteil nach Jahreskosten ─────────────────────────────────
// Gerechnet mit berechneFranchise — derselben Funktion wie in der App.
export function figurKostenteil() {
  const B = 640, H = 260, L = 56, R = 16, OBEN = 18, UNTEN = 36;
  const frMin = Math.min(...FRANCHISE_STUFEN), frMax = Math.max(...FRANCHISE_STUFEN);
  const kMax = 12000, vMax = frMax + SELBSTBEHALT_MAX + 400;
  const x = (k) => L + (k / kMax) * (B - L - R);
  const y = (v) => H - UNTEN - (v / vMax) * (H - OBEN - UNTEN);
  const linie = (franchise) => {
    const punkte = [];
    for (let k = 0; k <= kMax; k += 50) punkte.push(`${r1(x(k))},${r1(y(berechneFranchise(franchise, k).eigenanteil))}`);
    return punkte.join(' ');
  };
  const rasterY = [1000, 2000, 3000].map((v) =>
    `<line class="f-raster" x1="${L}" y1="${r1(y(v))}" x2="${B - R}" y2="${r1(y(v))}"/>` +
    `<text class="f-text" x="${L - 6}" y="${r1(y(v) + 4)}" text-anchor="end">${fr(v)}</text>`);
  const rasterX = [0, 3000, 6000, 9000, 12000].map((k) =>
    `<text class="f-text" x="${r1(x(k))}" y="${H - UNTEN + 16}" text-anchor="${k === kMax ? 'end' : 'middle'}">${fr(k)}</text>`);
  const dachMin = frMin + SELBSTBEHALT_MAX, dachMax = frMax + SELBSTBEHALT_MAX;
  const inhalt = [
    ...rasterY,
    `<line class="f-achse" x1="${L}" y1="${H - UNTEN}" x2="${B - R}" y2="${H - UNTEN}"/>`,
    ...rasterX,
    `<polyline class="f-linie" points="${linie(frMin)}"/>`,
    `<polyline class="f-linie f-gestrichelt" points="${linie(frMax)}"/>`,
    `<text class="f-text f-stark" x="${B - R}" y="${r1(y(dachMin) - 7)}" text-anchor="end">Franchise ${fr(frMin)}: höchstens ${fr(dachMin)}</text>`,
    `<text class="f-text f-stark" x="${B - R}" y="${r1(y(dachMax) - 7)}" text-anchor="end">Franchise ${fr(frMax)} (gestrichelt): höchstens ${fr(dachMax)}</text>`,
    `<text class="f-text" x="${(B + L) / 2}" y="${H - 2}" text-anchor="middle">Kosten im Jahr, Franken</text>`,
  ];
  return figur('fig-kostenteil', B, H,
    'Eigener Anteil je nach Jahreskosten, bei der tiefsten und der höchsten Franchise',
    `Zwei Linien: durchgezogen die Franchise ${fr(frMin)}, gestrichelt die Franchise ${fr(frMax)}. Beide steigen zuerst steil bis zur Franchise, dann flacher mit ${Math.round(SELBSTBEHALT_RATE * 100)} Prozent, und laufen ab dem Dach waagrecht weiter: bei Franchise ${fr(frMin)} auf ${fr(dachMin)} Franken, bei Franchise ${fr(frMax)} auf ${fr(dachMax)} Franken.`,
    inhalt,
    `Erwachsene, Grundregel: Franchise, danach ${Math.round(SELBSTBEHALT_RATE * 100)} % Selbstbehalt bis höchstens ${fr(SELBSTBEHALT_MAX)} Franken im Jahr (KVG Art. 64, KVV Art. 93 und 103). Ohne Spitalbeitrag und ohne den höheren Selbstbehalt bei gewissen Medikamenten.`);
}

// ─── Figur: Prämien je Kanton ────────────────────────────────────────────────
// Liegende Balken ab null, damit das Verhältnis stimmt. Kantone mit mehreren
// Regionen: voller Balken bis zur günstigsten Region, heller Teil bis zur
// teuersten, ein Strich je Region. Form und Farbe tragen beide die Aussage.
export function figurKantone() {
  const kantone = kantonsPraemien();
  const zeile = 19, L = 40, R = 150, OBEN = 8, UNTEN = 30, B = 640;
  const H = OBEN + kantone.length * zeile + UNTEN;
  const vMax = 650;
  const x = (v) => L + (v / vMax) * (B - L - R);
  const balken = kantone.map((k, i) => {
    const y0 = OBEN + i * zeile, h = zeile - 6;
    const teile = [
      `<text class="f-text" x="${L - 6}" y="${r1(y0 + h - 2)}" text-anchor="end">${k.kanton}</text>`,
      `<rect class="f-saeule" x="${L}" y="${y0}" width="${r1(x(k.tief) - L)}" height="${h}"/>`,
    ];
    if (!k.eineRegion) {
      teile.push(`<rect class="f-spanne" x="${r1(x(k.tief))}" y="${y0}" width="${r1(x(k.hoch) - x(k.tief))}" height="${h}"/>`);
      for (const r of k.regionen) {
        teile.push(`<line class="f-strich" x1="${r1(x(r.erwachsene))}" y1="${y0 - 1}" x2="${r1(x(r.erwachsene))}" y2="${y0 + h + 1}"/>`);
      }
    }
    // Jede Region mit ihrer Zahl, von der günstigsten zur teuersten.
    const wert = k.regionen.map((r) => r.erwachsene).sort((a, b) => a - b).map(rp).join(' · ');
    teile.push(`<text class="f-text" x="${r1(x(k.hoch) + 6)}" y="${r1(y0 + h - 2)}">${wert}</text>`);
    return teile.join('');
  });
  const raster = [100, 200, 300, 400, 500, 600].map((v) =>
    `<line class="f-raster" x1="${r1(x(v))}" y1="${OBEN - 4}" x2="${r1(x(v))}" y2="${H - UNTEN + 2}"/>` +
    `<text class="f-text" x="${r1(x(v))}" y="${H - UNTEN + 16}" text-anchor="middle">${v}</text>`);
  const inhalt = [
    ...raster,
    `<line class="f-achse" x1="${L}" y1="${OBEN - 4}" x2="${L}" y2="${H - UNTEN + 2}"/>`,
    ...balken,
    `<text class="f-text" x="${B - 8}" y="${H - 4}" text-anchor="end">Franken im Monat</text>`,
  ];
  const billig = kantone[0], teuer = kantone[kantone.length - 1];
  // Alle Werte auch als Tabelle — für Vorlese-Programme und vergrösserten Text.
  const alle = kantone.map((k) => `            <tr><td>${k.name}</td><td class="n">${k.regionen
    .map((r) => (k.eineRegion ? rp(r.erwachsene) : `Region ${r.region}: ${rp(r.erwachsene)}`)).join('<br>')}</td></tr>`).join('\n');
  const tabelle = `
        <details>
          <summary>Alle ${kantone.length} Kantone als Tabelle</summary>
          <div class="tabelle"><table>
            <caption>Mittlere Monatsprämie Erwachsene ${PRAEMIENJAHR}, je Kanton und Prämienregion</caption>
            <tr><th scope="col">Kanton</th><th scope="col" class="n">Franken im Monat</th></tr>
${alle}
          </table></div>
        </details>`;
  return figur('fig-kantone', B, H,
    `Mittlere Monatsprämie für Erwachsene ${PRAEMIENJAHR}, je Kanton oder Prämienregion`,
    `Liegende Balken für alle ${kantone.length} Kantone, sortiert nach der teuersten Region, von ${billig.name} mit ${rp(billig.tief)} Franken bis ${teuer.name} mit ${rp(teuer.hoch)} Franken. Bei ${kantone.filter((k) => !k.eineRegion).length} Kantonen mit mehreren Prämienregionen zeigt ein umrandeter Teil die Spanne zwischen der günstigsten und der teuersten Region. Alle Werte stehen in der Tabelle unter dem Bild.`,
    inhalt,
    `Erwachsene ab 26, alle Kassen zusammen. Umrandeter Teil mit Strichen: Kantone mit mehreren Prämienregionen, ein Strich und eine Zahl je Region; einen Kantonsmittelwert zeigt das Bild dort nicht. Sortiert nach der teuersten Region. Quelle: ${quelleLesbar()}, in Maloja Plana geführt.`,
    tabelle);
}

// «priminfo.admin.ch — praemienregionen-2027.xlsx, Stand 22.10.2026 (…)» →
// «Prämiendaten des Bundes (priminfo.admin.ch), Stand 22. Oktober 2026».
// Das Datum kommt aus der Datenquelle, nicht von Hand.
const MONATE = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
function quelleLesbar() {
  const m = praemienQuelle().match(/Stand (\d{2})\.(\d{2})\.(\d{4})/);
  if (!m) throw new Error(`Kein Stand-Datum in der Prämienquelle: ${praemienQuelle()}`);
  return `Prämiendaten des Bundes (priminfo.admin.ch), Stand ${Number(m[1])}. ${MONATE[Number(m[2]) - 1]} ${m[3]}`;
}

export function tabelleKantone() {
  const je = Object.fromEntries(kantonsPraemien().map((k) => [k.kanton, k]));
  const zeilen = Object.keys(KANTON_KOSTEN_2024)
    .sort((a, b) => je[a].hoch - je[b].hoch)
    .map((k) => `          <tr><td>${je[k].name}</td><td class="n">${praemieText(je[k])}</td><td class="n">${fr(KANTON_KOSTEN_2024[k])}</td></tr>`)
    .join('\n');
  return `<div class="tabelle"><table>
          <caption>Prämie und Kosten in sechs Kantonen</caption>
          <tr><th scope="col">Kanton</th><th scope="col" class="n">Prämie Erwachsene ${PRAEMIENJAHR}, Fr./Mt.</th><th scope="col" class="n">Kosten je Person 2024, Fr./Jahr</th></tr>
${zeilen}
        </table></div>`;
}

export function tabelleMittel() {
  const m = NATIONAL_AVG_PREMIUM_JE_JAHR[PRAEMIENJAHR];
  return `<div class="tabelle"><table>
          <caption>Mittlere Monatsprämie ${PRAEMIENJAHR}, ganze Schweiz</caption>
          <tr><th scope="col">Altersgruppe</th><th scope="col" class="n">Franken</th></tr>
          <tr><td>Erwachsene ab 26</td><td class="n">${rp(m.erwachsene)}</td></tr>
          <tr><td>Junge Erwachsene 19 bis 25</td><td class="n">${rp(m.junge)}</td></tr>
          <tr><td>Kinder bis 18</td><td class="n">${rp(m.kinder)}</td></tr>
          <tr><td>Alle zusammen</td><td class="n">${rp(m.gesamt)}</td></tr>
        </table></div>`;
}

export const BLOECKE = {
  'FIG:dorf': figurDorf,
  'TAB:dorf': tabelleDorf,
  'FIG:alter': figurAlter,
  'FIG:kostenteil': figurKostenteil,
  'FIG:kantone': figurKantone,
  'TAB:kantone': tabelleKantone,
  'TAB:mittel': tabelleMittel,
};
